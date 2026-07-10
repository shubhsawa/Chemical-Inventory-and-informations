import { Link } from "react-router-dom";
import type { UnifiedProduct } from "../services/searchService";
import { useFavorites } from "../hooks/useFavorites";
import { useCompare } from "../hooks/useCompare";

const categoryColors: Record<string, string> = {
  Medicines: "#0d6efd",
  Cosmetics: "#d63384",
  "Food Products": "#198754",
  "Cleaning Products": "#fd7e14",
  "Personal Care": "#6610f2",
  Chemical: "#0dcaf0",
};

const sourceBadge: Record<string, { label: string; cls: string }> = {
  pubchem: { label: "PubChem", cls: "bg-info text-dark" },
  openfda: { label: "OpenFDA", cls: "bg-primary" },
  off: { label: "Open Food Facts", cls: "bg-success" },
  curated: { label: "Curated", cls: "bg-secondary" },
};

export default function ProductCard({ product }: { product: UnifiedProduct }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isInCompare, toggleCompare } = useCompare();
  const fav = isFavorite(product.id);
  const inCompare = isInCompare(product.id);
  const color = categoryColors[product.category] || "#0d6efd";
  const src = sourceBadge[product.source] || sourceBadge.curated;

  return (
    <div className="card h-100 ca-fade-up">
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <span
            className="badge rounded-pill"
            style={{ backgroundColor: color + "22", color }}
          >
            {product.category}
          </span>
          <span className={`badge rounded-pill ${src.cls}`}>{src.label}</span>
        </div>

        <h5 className="card-title fw-bold mb-1">{product.name}</h5>
        <p className="text-muted small mb-2">
          <i className="bi bi-building me-1"></i>
          {product.manufacturer}
        </p>

        {product.image && (
          <img
            src={product.image}
            alt={product.name}
            className="rounded-3 mb-3 w-100"
            style={{ maxHeight: 160, objectFit: "cover" }}
            onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
          />
        )}

        {product.purpose && (
          <p className="small text-muted mb-2">{product.purpose.slice(0, 100)}</p>
        )}

        {product.ingredients.length > 0 && (
          <div className="mb-3">
            <span className="small fw-semibold text-secondary">Key ingredients:</span>
            <div className="d-flex flex-wrap gap-1 mt-1">
              {product.ingredients.slice(0, 4).map((ing, i) => (
                <span key={i} className="badge bg-light text-dark border">
                  {ing}
                </span>
              ))}
              {product.ingredients.length > 4 && (
                <span className="badge bg-light text-muted border">
                  +{product.ingredients.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}

        <div className="mt-auto d-flex flex-column gap-2">
          <Link
            to={product.cid ? `/chemical/${product.cid}` : `/chemical?q=${encodeURIComponent(product.ingredients[0] || product.name)}`}
            className="btn btn-primary btn-sm"
          >
            <i className="bi bi-clipboard2-pulse me-1"></i>
            View Chemical Details
          </Link>
          <div className="d-flex gap-2">
            <button
              className={`btn btn-sm flex-grow-1 ${inCompare ? "btn-success" : "btn-outline-secondary"}`}
              onClick={() => toggleCompare(product)}
            >
              <i className="bi bi-bar-chart-line me-1"></i>
              {inCompare ? "Added" : "Compare"}
            </button>
            <button
              className={`btn btn-sm ${fav ? "btn-danger" : "btn-outline-danger"}`}
              onClick={() => toggleFavorite(product)}
              aria-label="Save favorite"
            >
              <i className={`bi ${fav ? "bi-heart-fill" : "bi-heart"}`}></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
