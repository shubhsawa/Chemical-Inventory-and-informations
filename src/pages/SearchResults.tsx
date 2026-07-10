import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import SearchResultsList from "../components/SearchResultsList";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { unifiedSearch, CATEGORIES, type UnifiedProduct } from "../services/searchService";
import { useSearchHistory } from "../hooks/useSearchHistory";

const PAGE_SIZE = 9;

export default function SearchResults() {
  const [params, setParams] = useSearchParams();
  const query = params.get("q") || "";
  const [results, setResults] = useState<UnifiedProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const { addSearch } = useSearchHistory();

  useEffect(() => {
    if (!query) return;
    let active = true;
    setLoading(true);
    setError(null);
    setPage(1);
    addSearch(query);
    unifiedSearch(query)
      .then((r) => {
        if (active) setResults(r);
      })
      .catch(() => {
        if (active) setError("Failed to fetch results. Please try again.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [query]);

  const filtered =
    activeCategory === "All"
      ? results
      : results.filter((r) => r.category === activeCategory);

  const handleSearch = (q: string) => setParams({ q });

  return (
    <div className="container py-5">
      <div className="mx-auto mb-4" style={{ maxWidth: 680 }}>
        <SearchBar initialQuery={query} onSearch={handleSearch} autoFocus={!query} />
      </div>

      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <div>
          <h2 className="ca-section-title mb-0">
            {query ? <>Results for "<span className="text-primary">{query}</span>"</> : "Search products"}
          </h2>
          {!loading && !error && query && (
            <p className="text-muted small mb-0">
              {filtered.length} {filtered.length === 1 ? "product" : "products"} found
            </p>
          )}
        </div>

        {results.length > 0 && (
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-funnel text-muted"></i>
            <select
              className="form-select form-select-sm"
              style={{ width: "auto" }}
              value={activeCategory}
              onChange={(e) => {
                setActiveCategory(e.target.value);
                setPage(1);
              }}
            >
              <option value="All">All categories</option>
              {CATEGORIES.map((c) => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
              <option value="Chemical">Chemical</option>
            </select>
          </div>
        )}
      </div>

      {loading && <LoadingSpinner message="Searching across PubChem, OpenFDA & Open Food Facts..." />}

      {error && <ErrorMessage message={error} onRetry={() => setParams({ q: query })} />}

      {!loading && !error && query && filtered.length === 0 && (
        <div className="text-center py-5">
          <i className="bi bi-search text-muted" style={{ fontSize: "3rem" }}></i>
          <h4 className="mt-3">No products found</h4>
          <p className="text-muted">Try a different search term or browse a category.</p>
        </div>
      )}

      {!loading && !error && !query && (
        <div className="text-center py-5">
          <i className="bi bi-search text-muted" style={{ fontSize: "3rem" }}></i>
          <h4 className="mt-3">Start searching</h4>
          <p className="text-muted">Enter a product, medicine, or chemical name above.</p>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <SearchResultsList
          products={filtered}
          page={page}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
