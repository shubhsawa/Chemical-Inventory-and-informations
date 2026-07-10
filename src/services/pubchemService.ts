import axios from "axios";
import { logApiError } from "./apiErrors";
import { CURATED_CHEMICALS } from "./curatedChemicals";

const PUBCHEM_BASE = "https://pubchem.ncbi.nlm.nih.gov/rest/pug";

export interface PubChemCompound {
  cid: number;
  name: string;
  iupacName?: string;
  molecularFormula?: string;
  molecularWeight?: string;
  casNumber?: string;
  synonyms?: string[];
  description?: string;
}

export interface ChemicalDetailsData {
  cid: number;
  name: string;
  scientificName: string;
  molecularFormula: string;
  molecularWeight: string;
  casNumber: string;
  synonyms: string[];
  description: string;
  commonUses: string[];
  safetyRating: string;
  safetyLevel: "low" | "moderate" | "high" | "extreme" | "unknown";
  toxicity: string;
  healthRisks: string[];
  sideEffects: string[];
  environmentalImpact: string;
  regulatoryStatus: string;
  referenceLinks: { label: string; url: string }[];
  /** True when this record was synthesized from the curated fallback dataset. */
  isFallback?: boolean;
}

/**
 * Search PubChem compounds by name. Returns up to `limit` matches.
 * Returns [] on 404 (no match) or any failure — never throws.
 */
export async function searchCompounds(query: string, limit = 15): Promise<PubChemCompound[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  try {
    const res = await axios.get(
      `${PUBCHEM_BASE}/compound/name/${encodeURIComponent(trimmed)}/property/CID,IUPACName,MolecularFormula,MolecularWeight,Synonyms/JSON`,
      { timeout: 12000 }
    );

    const props = res.data?.PropertyTable?.Properties;
    if (!Array.isArray(props) || props.length === 0) {
      console.warn(`[PubChem] No compounds matched "${trimmed}".`);
      return [];
    }

    return props.slice(0, limit).map((p: any) => ({
      cid: p.CID,
      name: (p.Synonyms?.split("|")[0] as string) || trimmed,
      iupacName: p.IUPACName,
      molecularFormula: p.MolecularFormula,
      molecularWeight: p.MolecularWeight,
      synonyms: p.Synonyms?.split("|").slice(0, 12) || [],
    }));
  } catch (err) {
    logApiError("PubChem.searchCompounds", err, `query="${trimmed}"`);
    return [];
  }
}

/**
 * Autocomplete suggestions via PubChem's autocomplete endpoint.
 */
export async function getCompoundSuggestions(query: string): Promise<string[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  try {
    const res = await axios.get(
      `https://pubchem.ncbi.nlm.nih.gov/rest/autocomplete/compound/${encodeURIComponent(trimmed)}/JSON`,
      { timeout: 8000 }
    );
    const terms = res.data?.autocomplete?.dict?.compound?.suggestions || [];
    return terms.slice(0, 8);
  } catch (err) {
    logApiError("PubChem.getCompoundSuggestions", err, `query="${trimmed}"`);
    return [];
  }
}

/**
 * Fetch full details for a compound by CID, including description and safety data.
 * On any failure, falls back to the curated dataset so the UI never breaks.
 */
export async function getCompoundDetails(cid: number): Promise<ChemicalDetailsData | null> {
  try {
    const [propsRes, descRes] = await Promise.all([
      axios.get(
        `${PUBCHEM_BASE}/compound/cid/${cid}/property/CID,IUPACName,MolecularFormula,MolecularWeight,CAS,Synonyms/JSON`,
        { timeout: 12000 }
      ),
      axios.get(`${PUBCHEM_BASE}/compound/cid/${cid}/description/JSON`, { timeout: 12000 }),
    ]);

    const prop = propsRes.data?.PropertyTable?.Properties?.[0];
    if (!prop) {
      console.warn(`[PubChem] CID ${cid} returned no property record.`);
      return getCuratedChemicalDetails(cid);
    }

    const descList = descRes.data?.InformationList?.Information || [];
    const description =
      descList.find((d: any) => d.Description)?.Description ||
      "No description available from PubChem.";

    const synonyms: string[] = (prop.Synonyms?.split("|") || []).slice(0, 15);
    const name = synonyms[0] || `CID ${cid}`;
    const cas = prop.CAS || "Not available";

    const safety = inferSafety(name, synonyms, description);

    return {
      cid,
      name,
      scientificName: prop.IUPACName || name,
      molecularFormula: prop.MolecularFormula || "—",
      molecularWeight: prop.MolecularWeight ? `${prop.MolecularWeight} g/mol` : "—",
      casNumber: cas,
      synonyms,
      description,
      commonUses: inferCommonUses(name, synonyms),
      safetyRating: safety.rating,
      safetyLevel: safety.level,
      toxicity: safety.toxicity,
      healthRisks: safety.healthRisks,
      sideEffects: safety.sideEffects,
      environmentalImpact: safety.environmentalImpact,
      regulatoryStatus: safety.regulatoryStatus,
      referenceLinks: [
        { label: "PubChem Compound", url: `https://pubchem.ncbi.nlm.nih.gov/compound/${cid}` },
        { label: "PubChem 3D Viewer", url: `https://pubchem.ncbi.nlm.nih.gov/compound/${cid}#section=3D-Conformer` },
        { label: "EPA CompTox Dashboard", url: `https://comptox.epa.gov/dashboard/chemical/details/${cas !== "Not available" ? cas : cid}` },
      ],
    };
  } catch (err) {
    logApiError("PubChem.getCompoundDetails", err, `cid=${cid}`);
    return getCuratedChemicalDetails(cid);
  }
}

/**
 * Resolve a chemical name to details. Tries PubChem by name → CID → details,
 * then falls back to the curated dataset by matching the name or a known CID.
 */
export async function getCompoundDetailsByName(name: string): Promise<ChemicalDetailsData | null> {
  const trimmed = name.trim();
  if (!trimmed) return null;

  // Try the curated dataset first by name — it's instant and reliable.
  const curated = getCuratedChemicalDetailsByName(trimmed);
  if (curated) return curated;

  // Otherwise resolve via PubChem search → details.
  const compounds = await searchCompounds(trimmed, 1);
  if (compounds.length > 0) {
    const data = await getCompoundDetails(compounds[0].cid);
    if (data) return data;
  }

  // Last resort: a generic fallback record so the page still renders.
  return getCuratedChemicalDetailsByName(trimmed) ?? buildGenericFallback(trimmed);
}

/**
 * Heuristic safety inference based on known chemical names and keywords.
 * PubChem's REST API does not expose a curated safety field, so we derive a
 * reasonable estimate from the compound name, synonyms, and description.
 */
function inferSafety(
  name: string,
  synonyms: string[],
  description: string
): {
  rating: string;
  level: ChemicalDetailsData["safetyLevel"];
  toxicity: string;
  healthRisks: string[];
  sideEffects: string[];
  environmentalImpact: string;
  regulatoryStatus: string;
} {
  const text = `${name} ${synonyms.join(" ")} ${description}`.toLowerCase();

  const extremeKeywords = ["arsenic", "cyanide", "mercury", "lead", "asbestos", "formaldehyde", "benzene", "cadmium", "strychnine"];
  const highKeywords = ["ammonia", "bleach", "sodium hydroxide", "sulfuric acid", "hydrochloric acid", "acetone", "toluene", "xylene", "phthalate", "paraben", "triclosan"];
  const moderateKeywords = ["sodium lauryl", "sulfate", "alcohol", "caffeine", "nicotine", "fluoride", "nitrate", "preservative", "emulsifier"];

  if (extremeKeywords.some((k) => text.includes(k))) {
    return {
      rating: "Hazardous",
      level: "extreme",
      toxicity: "High acute toxicity. Exposure can cause severe health effects including organ damage, neurological harm, or carcinogenic effects.",
      healthRisks: ["Carcinogenic potential", "Organ system toxicity", "Severe skin and eye damage", "Neurological effects"],
      sideEffects: ["Nausea and vomiting", "Respiratory distress", "Skin burns", "Long-term organ damage"],
      environmentalImpact: "High environmental persistence; bioaccumulates in ecosystems and poses risk to aquatic life.",
      regulatoryStatus: "Regulated by EPA, OSHA, and international agencies. Many uses restricted or banned.",
    };
  }
  if (highKeywords.some((k) => text.includes(k))) {
    return {
      rating: "Caution",
      level: "high",
      toxicity: "Moderate to high toxicity with prolonged or concentrated exposure. Can cause irritation and systemic effects.",
      healthRisks: ["Skin and eye irritation", "Respiratory irritation", "Allergic reactions", "Endocrine disruption (some)"],
      sideEffects: ["Dry skin", "Eye redness", "Coughing or throat irritation", "Headache"],
      environmentalImpact: "Moderate environmental impact; may be toxic to aquatic organisms at elevated concentrations.",
      regulatoryStatus: "Subject to FDA, EPA, or EU REACH regulation depending on application.",
    };
  }
  if (moderateKeywords.some((k) => text.includes(k))) {
    return {
      rating: "Moderate",
      level: "moderate",
      toxicity: "Low acute toxicity but may cause irritation or sensitivity with repeated exposure.",
      healthRisks: ["Mild skin irritation", "Contact dermatitis", "Gastrointestinal upset if ingested"],
      sideEffects: ["Mild dryness", "Minor irritation", "Allergic reaction in sensitive individuals"],
      environmentalImpact: "Low to moderate; generally biodegradable but may affect water systems in large quantities.",
      regulatoryStatus: "Generally recognized as safe in approved concentrations; regulated by FDA and EFSA.",
    };
  }
  return {
    rating: "Low Risk",
    level: "low",
    toxicity: "Low toxicity under normal use conditions. Widely used in consumer and pharmaceutical products.",
    healthRisks: ["Rare allergic reactions in sensitive individuals"],
    sideEffects: ["Generally well tolerated"],
    environmentalImpact: "Low environmental impact; readily biodegradable in most cases.",
    regulatoryStatus: "Approved for use by major regulatory bodies (FDA, EFSA, WHO).",
  };
}

function inferCommonUses(name: string, _synonyms: string[]): string[] {
  const lower = name.toLowerCase();
  const uses: string[] = [];
  if (lower.includes("acid") || lower.includes("citric") || lower.includes("ascorbic")) uses.push("Food additive and preservative");
  if (lower.includes("sodium")) uses.push("Cleaning and personal care formulations");
  if (lower.includes("alcohol") || lower.includes("ethanol")) uses.push("Solvent and disinfectant");
  if (lower.includes("acetaminophen") || lower.includes("ibuprofen") || lower.includes("aspirin")) uses.push("Pharmaceutical active ingredient");
  if (lower.includes("glycol") || lower.includes("glycerin")) uses.push("Moisturizer and humectant in cosmetics");
  if (uses.length === 0) uses.push("Industrial and consumer product applications", "Chemical synthesis intermediate");
  return uses;
}

/* ------------------------------------------------------------------ */
/* Curated fallback helpers                                            */
/* ------------------------------------------------------------------ */

/** Look up a curated chemical by PubChem CID. */
function getCuratedChemicalDetails(cid: number): ChemicalDetailsData | null {
  const entry = CURATED_CHEMICALS.find((c) => c.cid === cid);
  if (!entry) return null;
  return buildChemicalDetailsFromCurated(entry);
}

/** Look up a curated chemical by name (case-insensitive, partial match). */
function getCuratedChemicalDetailsByName(name: string): ChemicalDetailsData | null {
  const lower = name.toLowerCase();
  const entry = CURATED_CHEMICALS.find(
    (c) =>
      c.name.toLowerCase() === lower ||
      c.name.toLowerCase().includes(lower) ||
      c.synonyms.some((s) => s.toLowerCase().includes(lower))
  );
  if (!entry) return null;
  return buildChemicalDetailsFromCurated(entry);
}

function buildChemicalDetailsFromCurated(entry: (typeof CURATED_CHEMICALS)[number]): ChemicalDetailsData {
  const safety = inferSafety(entry.name, entry.synonyms, entry.description);
  return {
    cid: entry.cid,
    name: entry.name,
    scientificName: entry.iupacName || entry.name,
    molecularFormula: entry.molecularFormula,
    molecularWeight: entry.molecularWeight,
    casNumber: entry.cas,
    synonyms: entry.synonyms,
    description: entry.description,
    commonUses: entry.commonUses,
    safetyRating: safety.rating,
    safetyLevel: safety.level,
    toxicity: safety.toxicity,
    healthRisks: safety.healthRisks,
    sideEffects: safety.sideEffects,
    environmentalImpact: safety.environmentalImpact,
    regulatoryStatus: safety.regulatoryStatus,
    referenceLinks: [
      { label: "PubChem Compound", url: `https://pubchem.ncbi.nlm.nih.gov/compound/${entry.cid}` },
      { label: "EPA CompTox Dashboard", url: `https://comptox.epa.gov/dashboard/chemical/details/${entry.cas}` },
    ],
    isFallback: true,
  };
}

/** Build a minimal but valid record for an unknown chemical so the page renders. */
function buildGenericFallback(name: string): ChemicalDetailsData {
  const safety = inferSafety(name, [], "");
  return {
    cid: 0,
    name,
    scientificName: name,
    molecularFormula: "—",
    molecularWeight: "—",
    casNumber: "Not available",
    synonyms: [name],
    description: `No detailed information was available from PubChem for "${name}". This record was generated as a fallback so the page remains usable. Try searching for a more specific chemical name.`,
    commonUses: inferCommonUses(name, []),
    safetyRating: safety.rating,
    safetyLevel: safety.level,
    toxicity: safety.toxicity,
    healthRisks: safety.healthRisks,
    sideEffects: safety.sideEffects,
    environmentalImpact: safety.environmentalImpact,
    regulatoryStatus: safety.regulatoryStatus,
    referenceLinks: [
      { label: "Search PubChem", url: `https://pubchem.ncbi.nlm.nih.gov/#query=${encodeURIComponent(name)}` },
    ],
    isFallback: true,
  };
}
