import axios from "axios";
import { logApiError } from "./apiErrors";

const OFF_BASE = "https://world.openfoodfacts.org";

export interface OFFProductResult {
  id: string;
  name: string;
  manufacturer: string;
  category: string;
  activeIngredients: string[];
  purpose: string;
  image: string;
  details: any;
}

/**
 * Search Open Food Facts products by name.
 * Returns [] on any failure — never throws.
 */
export async function searchFoods(query: string, limit = 15): Promise<OFFProductResult[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  try {
    const res = await axios.get(`${OFF_BASE}/cgi/search.pl`, {
      params: {
        search_terms: trimmed,
        search_simple: 1,
        action: "process",
        json: 1,
        page_size: limit,
      },
      timeout: 12000,
    });

    const products = res.data?.products || [];
    if (products.length === 0) {
      console.warn(`[OpenFoodFacts] No products matched "${trimmed}".`);
    }
    return products.map((p: any) => ({
      id: p.code || p._id,
      name: p.product_name || p.product_name_en || "Unknown product",
      manufacturer: p.brands || "Unknown brand",
      category: "Food Product",
      activeIngredients: parseIngredients(p.ingredients_text),
      purpose: p.categories?.split(",").slice(0, 3).join(", ") || "Food product",
      image: p.image_front_small_url || p.image_small_url || p.image_front_url || "",
      details: p,
    }));
  } catch (err) {
    logApiError("OpenFoodFacts.searchFoods", err, `query="${trimmed}"`);
    return [];
  }
}

function parseIngredients(text?: string): string[] {
  if (!text) return [];
  return text
    .split(/[,;()]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 1 && s.length < 40)
    .slice(0, 20);
}
