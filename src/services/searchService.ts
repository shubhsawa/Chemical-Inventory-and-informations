import { searchCompounds, getCompoundSuggestions } from "./pubchemService";
import { searchDrugs } from "./openfdaService";
import { searchFoods } from "./openFoodFactsService";
import { logApiError } from "./apiErrors";

export interface UnifiedProduct {
  id: string;
  name: string;
  manufacturer: string;
  category: string;
  ingredients: string[];
  image?: string;
  source: "pubchem" | "openfda" | "off" | "curated";
  cid?: number;
  purpose?: string;
  warnings?: string;
}

/**
 * Curated dataset of common consumer products across categories.
 * Used as a fallback when public APIs return no results, ensuring the
 * app always demonstrates its full feature set.
 */
export const CURATED_PRODUCTS: UnifiedProduct[] = [
  {
    id: "cur-paracetamol",
    name: "Paracetamol (Acetaminophen)",
    manufacturer: "Generic / OTC",
    category: "Medicines",
    ingredients: ["Acetaminophen", "Microcrystalline cellulose", "Magnesium stearate", "Povidone"],
    source: "curated",
    cid: 1983,
    purpose: "Pain reliever and fever reducer",
    warnings: "Overuse can cause liver damage. Do not exceed 4g per day.",
  },
  {
    id: "cur-ibuprofen",
    name: "Ibuprofen",
    manufacturer: "Generic / OTC",
    category: "Medicines",
    ingredients: ["Ibuprofen", "Microcrystalline cellulose", "Croscarmellose sodium", "Titanium dioxide"],
    source: "curated",
    cid: 3672,
    purpose: "NSAID for pain and inflammation",
    warnings: "May cause gastrointestinal irritation. Take with food.",
  },
  {
    id: "cur-toothpaste",
    name: "Fluoride Toothpaste",
    manufacturer: "Colgate / Sensodyne",
    category: "Personal Care",
    ingredients: ["Sodium fluoride", "Sodium lauryl sulfate", "Glycerin", "Hydrated silica", "Sorbitol"],
    source: "curated",
    cid: 5164,
    purpose: "Dental cleaning and cavity prevention",
    warnings: "Do not swallow. Keep away from children under 6.",
  },
  {
    id: "cur-shampoo",
    name: "Daily Shampoo",
    manufacturer: "Head & Shoulders / Dove",
    category: "Personal Care",
    ingredients: ["Sodium lauryl sulfate", "Cocamidopropyl betaine", "Sodium chloride", "Fragrance", "Glycerin"],
    source: "curated",
    cid: 5164,
    purpose: "Hair cleansing",
    warnings: "May cause eye irritation. Rinse thoroughly.",
  },
  {
    id: "cur-bleach",
    name: "Household Bleach",
    manufacturer: "Clorox",
    category: "Cleaning Products",
    ingredients: ["Sodium hypochlorite", "Sodium hydroxide", "Water"],
    source: "curated",
    cid: 23665760,
    purpose: "Disinfectant and stain remover",
    warnings: "Toxic if mixed with ammonia or acids. Use in ventilated areas.",
  },
  {
    id: "cur-dishsoap",
    name: "Dish Soap",
    manufacturer: "Dawn",
    category: "Cleaning Products",
    ingredients: ["Sodium lauryl sulfate", "Lauramine oxide", "Sodium chloride", "Fragrance"],
    source: "curated",
    cid: 5164,
    purpose: "Grease-cutting dish cleaner",
    warnings: "Mild skin irritation with prolonged exposure.",
  },
  {
    id: "cur-soda",
    name: "Cola Soft Drink",
    manufacturer: "Coca-Cola / Pepsi",
    category: "Food Products",
    ingredients: ["Carbonated water", "High fructose corn syrup", "Caramel color", "Phosphoric acid", "Caffeine", "Natural flavors"],
    source: "curated",
    cid: 1004,
    purpose: "Sweetened carbonated beverage",
    warnings: "High sugar content. Phosphoric acid may affect bone density.",
  },
  {
    id: "cur-lotion",
    name: "Body Lotion",
    manufacturer: "Nivea / Aveeno",
    category: "Cosmetics",
    ingredients: ["Glycerin", "Mineral oil", "Cetyl alcohol", "Dimethicone", "Fragrance", "Methylparaben"],
    source: "curated",
    cid: 753,
    purpose: "Skin moisturizer",
    warnings: "Parabens may cause sensitivity in some individuals.",
  },
  {
    id: "cur-lipstick",
    name: "Matte Lipstick",
    manufacturer: "Maybelline / Revlon",
    category: "Cosmetics",
    ingredients: ["Castor oil", "Carnauba wax", "Beeswax", "Red 7", "Titanium dioxide", "Fragrance"],
    source: "curated",
    cid: 753,
    purpose: "Lip color cosmetic",
    warnings: "Some pigments may cause allergic contact dermatitis.",
  },
  {
    id: "cur-aspirin",
    name: "Aspirin",
    manufacturer: "Bayer",
    category: "Medicines",
    ingredients: ["Acetylsalicylic acid", "Microcrystalline cellulose", "Corn starch"],
    source: "curated",
    cid: 2244,
    purpose: "Pain reliever and antiplatelet",
    warnings: "Not for children under 16 due to Reye's syndrome risk.",
  },
  {
    id: "cur-energybar",
    name: "Protein Energy Bar",
    manufacturer: "Clif / Quest",
    category: "Food Products",
    ingredients: ["Whey protein isolate", "Oats", "Cane sugar", "Cocoa", "Soy lecithin", "Palm oil"],
    source: "curated",
    cid: 5283,
    purpose: "Nutritional snack",
    warnings: "Contains common allergens (milk, soy).",
  },
  {
    id: "cur-deodorant",
    name: "Antiperspirant Deodorant",
    manufacturer: "Old Spice / Dove",
    category: "Personal Care",
    ingredients: ["Aluminum zirconium tetrachlorohydrex", "Cyclopentasiloxane", "Stearyl alcohol", "Fragrance"],
    source: "curated",
    cid: 5359,
    purpose: "Sweat and odor control",
    warnings: "Aluminum compounds under scrutiny for long-term exposure.",
  },
];

export const CATEGORIES = [
  { name: "Medicines", icon: "bi-capsule", color: "#0d6efd", desc: "OTC and prescription drugs" },
  { name: "Cosmetics", icon: "bi-palette", color: "#d63384", desc: "Makeup and beauty products" },
  { name: "Food Products", icon: "bi-basket", color: "#198754", desc: "Packaged and processed foods" },
  { name: "Cleaning Products", icon: "bi-spray-can", color: "#fd7e14", desc: "Household cleaners" },
  { name: "Personal Care", icon: "bi-droplet", color: "#6610f2", desc: "Hygiene and care items" },
];

/**
 * Unified search across PubChem, OpenFDA, and Open Food Facts, with a
 * curated fallback so the UI always has results to display.
 *
 * Each source runs independently via Promise.allSettled so a failure or
 * rate-limit on one API never prevents the others from contributing.
 * Every failure is logged to the console with a clear source tag.
 */
export async function unifiedSearch(query: string): Promise<UnifiedProduct[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  console.info(`[Search] Starting unified search for "${trimmed}"`);

  // Run all three sources in parallel; allSettled means a rejection in one
  // does not short-circuit the others.
  const settled = await Promise.allSettled([
    searchDrugs(trimmed, 8),
    searchFoods(trimmed, 8),
    searchCompounds(trimmed, 8),
  ]);

  const [drugsSettled, foodsSettled, compoundsSettled] = settled;

  const drugs = extractSettled(drugsSettled, "OpenFDA");
  const foods = extractSettled(foodsSettled, "OpenFoodFacts");
  const compounds = extractSettled(compoundsSettled, "PubChem");

  const results: UnifiedProduct[] = [];

  drugs.forEach((d) =>
    results.push({
      id: d.id,
      name: d.name,
      manufacturer: d.manufacturer,
      category: "Medicines",
      ingredients: d.activeIngredients,
      source: "openfda",
      purpose: d.purpose,
      warnings: d.warnings,
    })
  );

  foods.forEach((f) =>
    results.push({
      id: f.id,
      name: f.name,
      manufacturer: f.manufacturer,
      category: "Food Products",
      ingredients: f.activeIngredients,
      image: f.image,
      source: "off",
      purpose: f.purpose,
    })
  );

  compounds.forEach((c) =>
    results.push({
      id: `pc-${c.cid}`,
      name: c.name,
      manufacturer: "PubChem",
      category: "Chemical",
      ingredients: c.synonyms?.slice(0, 5) || [],
      source: "pubchem",
      cid: c.cid,
    })
  );

  console.info(
    `[Search] Live results: ${results.length} (OpenFDA: ${drugs.length}, OpenFoodFacts: ${foods.length}, PubChem: ${compounds.length})`
  );

  // Curated fallback if all live APIs returned nothing.
  if (results.length === 0) {
    console.warn(`[Search] All live APIs returned no results for "${trimmed}". Falling back to curated dataset.`);
    const matches = CURATED_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(trimmed.toLowerCase()) ||
        p.ingredients.some((ing) => ing.toLowerCase().includes(trimmed.toLowerCase())) ||
        p.category.toLowerCase().includes(trimmed.toLowerCase())
    );
    if (matches.length > 0) {
      console.info(`[Search] Curated fallback matched ${matches.length} product(s).`);
      return matches;
    }
    // If nothing matches, return all curated so the page isn't empty.
    console.info(`[Search] No curated match; returning all ${CURATED_PRODUCTS.length} curated products.`);
    return CURATED_PRODUCTS;
  }

  return results;
}

/**
 * Extract the value from a Promise.allSettled result, logging any rejection
 * with a clear source tag so failures are visible in the console.
 */
function extractSettled<T>(
  result: PromiseSettledResult<T>,
  source: string
): T {
  if (result.status === "fulfilled") return result.value;
  logApiError(source, result.reason, "unifiedSearch");
  // Return an empty array cast to T — the callers all expect arrays.
  return [] as unknown as T;
}

export { getCompoundSuggestions };
