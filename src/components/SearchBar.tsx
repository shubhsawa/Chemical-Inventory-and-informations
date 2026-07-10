import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCompoundSuggestions } from "../services/searchService";

interface SearchBarProps {
  initialQuery?: string;
  onSearch?: (q: string) => void;
  size?: "lg" | "md";
  autoFocus?: boolean;
}

export default function SearchBar({ initialQuery = "", onSearch, size = "lg", autoFocus }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggest, setShowSuggest] = useState(false);
  const [loadingSuggest, setLoadingSuggest] = useState(false);
  const navigate = useNavigate();
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => setQuery(initialQuery), [initialQuery]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setShowSuggest(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    let active = true;
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    setLoadingSuggest(true);
    const t = setTimeout(async () => {
      const s = await getCompoundSuggestions(query);
      if (active) {
        setSuggestions(s);
        setLoadingSuggest(false);
      }
    }, 250);
    return () => {
      active = false;
      clearTimeout(t);
    };
  }, [query]);

  const submit = (e: React.FormEvent, term?: string) => {
    e.preventDefault();
    const final = (term || query).trim();
    if (!final) return;
    setShowSuggest(false);
    if (onSearch) onSearch(final);
    else navigate(`/search?q=${encodeURIComponent(final)}`);
  };

  const inputClass = size === "lg" ? "form-control form-control-lg" : "form-control";

  return (
    <div className="position-relative w-100" ref={wrapRef}>
      <form onSubmit={(e) => submit(e)} className="w-100">
        <div className="input-group input-group-lg">
          <span className="input-group-text bg-white border-end-0">
            <i className="bi bi-search text-primary"></i>
          </span>
          <input
            type="search"
            className={`${inputClass} border-start-0 border-end-0`}
            placeholder="Search a product, medicine, or chemical..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggest(true);
            }}
            onFocus={() => setShowSuggest(true)}
            autoFocus={autoFocus}
            aria-label="Search products"
          />
          <button className="btn btn-primary px-4" type="submit">
            <i className="bi bi-arrow-right d-lg-none"></i>
            <span className="d-none d-lg-inline">Search</span>
          </button>
        </div>
      </form>

      {showSuggest && (suggestions.length > 0 || loadingSuggest) && (
        <div
          className="position-absolute w-100 mt-1 rounded-3 shadow border overflow-hidden"
          style={{ zIndex: 1050, backgroundColor: "var(--ca-surface)", borderColor: "var(--ca-border)" }}
        >
          {loadingSuggest && (
            <div className="px-3 py-2 small text-muted">
              <span className="spinner-border spinner-border-sm me-2"></span>
              Loading suggestions...
            </div>
          )}
          {!loadingSuggest &&
            suggestions.map((s) => (
              <button
                key={s}
                type="button"
                className="w-100 text-start px-3 py-2 border-0 bg-transparent d-flex align-items-center gap-2 suggest-item"
                style={{ color: "var(--ca-text)" }}
                onClick={() => {
                  setQuery(s);
                  submit({ preventDefault: () => {} } as any, s);
                }}
              >
                <i className="bi bi-droplet-half text-primary"></i>
                {s}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
