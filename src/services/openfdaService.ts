import axios from "axios";
import { logApiError } from "./apiErrors";

const OPENFDA_BASE = "https://api.fda.gov";

export interface OpenFDADrugResult {
  id: string;
  name: string;
  manufacturer: string;
  category: string;
  activeIngredients: string[];
  purpose: string;
  warnings: string;
  route: string;
  details: any;
}

/**
 * Search FDA drug labeling records by product/brand name.
 * Returns [] on 404 (no match) or any failure — never throws.
 */
export async function searchDrugs(query: string, limit = 15): Promise<OpenFDADrugResult[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  try {
    const res = await axios.get(`${OPENFDA_BASE}/drug/label.json`, {
      params: {
        search: `openfda.brand_name:"${trimmed}"+openfda.generic_name:"${trimmed}"`,
        limit,
      },
      timeout: 12000,
    });

    const results = res.data?.results || [];
    if (results.length === 0) {
      console.warn(`[OpenFDA] No drug labels matched "${trimmed}".`);
    }
    return results.map((r: any, i: number) => {
      const openfda = r.openfda || {};
      return {
        id: openfda.id?.[0] || `fda-${i}`,
        name: openfda.brand_name?.[0] || openfda.generic_name?.[0] || trimmed,
        manufacturer: openfda.manufacturer_name?.[0] || "Unknown manufacturer",
        category: "Medicine",
        activeIngredients: openfda.generic_name?.length
          ? openfda.generic_name
          : r.active_ingredient?.map((a: string) => a.split("[")[0].trim()).slice(0, 10) || [],
        purpose: r.purpose?.join(" ") || r.indications_and_usage?.[0]?.slice(0, 240) || "See labeling",
        warnings: r.warnings?.join(" ") || "See full prescribing information",
        route: openfda.route?.join(", ") || "Oral",
        details: r,
      };
    });
  } catch (err) {
    logApiError("OpenFDA.searchDrugs", err, `query="${trimmed}"`);
    return [];
  }
}

/**
 * Fetch a single drug record by its openfda id.
 */
export async function getDrugById(id: string): Promise<OpenFDADrugResult | null> {
  try {
    const res = await axios.get(`${OPENFDA_BASE}/drug/label.json`, {
      params: { search: `openfda.id:"${id}"`, limit: 1 },
      timeout: 12000,
    });
    const r = res.data?.results?.[0];
    if (!r) {
      console.warn(`[OpenFDA] No record found for id "${id}".`);
      return null;
    }
    const openfda = r.openfda || {};
    return {
      id: openfda.id?.[0] || id,
      name: openfda.brand_name?.[0] || openfda.generic_name?.[0] || "Unknown",
      manufacturer: openfda.manufacturer_name?.[0] || "Unknown",
      category: "Medicine",
      activeIngredients: openfda.generic_name || [],
      purpose: r.purpose?.join(" ") || r.indications_and_usage?.[0]?.slice(0, 240) || "",
      warnings: r.warnings?.join(" ") || "",
      route: openfda.route?.join(", ") || "Oral",
      details: r,
    };
  } catch (err) {
    logApiError("OpenFDA.getDrugById", err, `id="${id}"`);
    return null;
  }
}
