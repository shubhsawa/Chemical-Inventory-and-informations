/**
 * Curated chemical reference data used as a fallback when PubChem or other
 * live APIs are unreachable, rate-limited, or return no match. Each entry
 * mirrors the fields PubChem would provide so the Chemical Details page can
 * render a complete record without a network round-trip.
 */
export interface CuratedChemical {
  cid: number;
  name: string;
  iupacName: string;
  molecularFormula: string;
  molecularWeight: string;
  cas: string;
  synonyms: string[];
  description: string;
  commonUses: string[];
}

export const CURATED_CHEMICALS: CuratedChemical[] = [
  {
    cid: 1983,
    name: "Acetaminophen",
    iupacName: "N-(4-hydroxyphenyl)acetamide",
    molecularFormula: "C8H9NO2",
    molecularWeight: "151.16 g/mol",
    cas: "103-90-2",
    synonyms: ["Acetaminophen", "Paracetamol", "Tylenol", "N-Acetyl-p-aminophenol", "APAP"],
    description:
      "Acetaminophen (paracetamol) is a widely used analgesic and antipyretic medication for relieving pain and reducing fever. Unlike NSAIDs it has minimal anti-inflammatory effect.",
    commonUses: ["Pain relief (analgesic)", "Fever reduction (antipyretic)", "Active ingredient in cold and flu remedies"],
  },
  {
    cid: 3672,
    name: "Ibuprofen",
    iupacName: "2-(4-isobutylphenyl)propanoic acid",
    molecularFormula: "C13H18O2",
    molecularWeight: "206.28 g/mol",
    cas: "15687-27-1",
    synonyms: ["Ibuprofen", "Advil", "Motrin", "Brufen", "2-(4-isobutylphenyl)propanoic acid"],
    description:
      "Ibuprofen is a nonsteroidal anti-inflammatory drug (NSAID) used to treat pain, inflammation, and fever by inhibiting cyclooxygenase enzymes.",
    commonUses: ["Pain relief", "Anti-inflammatory", "Fever reduction", "Menstrual cramp relief"],
  },
  {
    cid: 2244,
    name: "Acetylsalicylic Acid",
    iupacName: "2-acetoxybenzoic acid",
    molecularFormula: "C9H8O4",
    molecularWeight: "180.16 g/mol",
    cas: "50-78-2",
    synonyms: ["Aspirin", "Acetylsalicylic acid", "ASA", "2-acetoxybenzoic acid"],
    description:
      "Aspirin (acetylsalicylic acid) is an NSAID and antiplatelet agent used for pain relief, inflammation, and cardiovascular protection at low doses.",
    commonUses: ["Pain relief", "Anti-inflammatory", "Antiplatelet therapy", "Fever reduction"],
  },
  {
    cid: 5164,
    name: "Sodium Fluoride",
    iupacName: "sodium fluoride",
    molecularFormula: "FNa",
    molecularWeight: "41.99 g/mol",
    cas: "7681-49-4",
    synonyms: ["Sodium fluoride", "NaF", "Fluorol", "Sodium fluoride (NaF)"],
    description:
      "Sodium fluoride is an inorganic compound used in toothpaste and water fluoridation to prevent dental caries by strengthening tooth enamel.",
    commonUses: ["Dental caries prevention", "Water fluoridation", "Toothpaste active ingredient"],
  },
  {
    cid: 23665760,
    name: "Sodium Hypochlorite",
    iupacName: "sodium hypochlorite",
    molecularFormula: "ClNaO",
    molecularWeight: "74.44 g/mol",
    cas: "7681-52-9",
    synonyms: ["Sodium hypochlorite", "Bleach", "Antiformin", "NaOCl"],
    description:
      "Sodium hypochlorite is the active ingredient in household bleach, used as a disinfectant and stain remover. It is corrosive and releases chlorine gas when mixed with acids.",
    commonUses: ["Surface disinfection", "Laundry bleaching", "Water treatment", "Stain removal"],
  },
  {
    cid: 753,
    name: "Glycerin",
    iupacName: "propane-1,2,3-triol",
    molecularFormula: "C3H8O3",
    molecularWeight: "92.09 g/mol",
    cas: "56-81-5",
    synonyms: ["Glycerin", "Glycerol", "Glycerine", "propane-1,2,3-triol"],
    description:
      "Glycerin is a colorless, odorless, viscous liquid widely used as a humectant, solvent, and sweetener in food, cosmetics, and pharmaceuticals.",
    commonUses: ["Skin moisturizer (humectant)", "Pharmaceutical solvent", "Food sweetener", "Cosmetic formulations"],
  },
  {
    cid: 1004,
    name: "Phosphoric Acid",
    iupacName: "phosphoric acid",
    molecularFormula: "H3O4P",
    molecularWeight: "98.00 g/mol",
    cas: "7664-38-2",
    synonyms: ["Phosphoric acid", "Orthophosphoric acid", "White phosphoric acid"],
    description:
      "Phosphoric acid is a mineral acid used as a food additive (acidulant in soft drinks), fertilizer component, and rust remover.",
    commonUses: ["Acidulant in soft drinks", "Fertilizer production", "Rust removal", "Dental etching"],
  },
  {
    cid: 5283,
    name: "Caffeine",
    iupacName: "1,3,7-trimethylpurine-2,6-dione",
    molecularFormula: "C8H10N4O2",
    molecularWeight: "194.19 g/mol",
    cas: "58-08-2",
    synonyms: ["Caffeine", "1,3,7-Trimethylxanthine", "Theine", "Guaranine"],
    description:
      "Caffeine is a central nervous system stimulant of the methylxanthine class, naturally found in coffee, tea, and cacao, used to improve alertness and reduce fatigue.",
    commonUses: ["Stimulant in beverages", "Pain reliever adjunct", "Pre-workout supplements", "Alertness enhancement"],
  },
  {
    cid: 5359,
    name: "Aluminum Zirconium Tetrachlorohydrex",
    iupacName: "aluminum zirconium tetrachlorohydrex gly",
    molecularFormula: "Variable",
    molecularWeight: "Variable",
    cas: "134910-86-0",
    synonyms: ["Aluminum zirconium tetrachlorohydrex", "AZG", "Antiperspirant active"],
    description:
      "Aluminum zirconium tetrachlorohydrex is an active antiperspirant ingredient that temporarily blocks sweat glands to reduce perspiration.",
    commonUses: ["Antiperspirant active ingredient", "Sweat reduction in deodorants"],
  },
];
