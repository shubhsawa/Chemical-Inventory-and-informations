import { Link } from "react-router-dom";
import { useFavorites } from "../hooks/useFavorites";
import ProductCard from "../components/ProductCard";

export default function Favorites() {
  const { favorites, removeFavorite } = useFavorites();

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <div>
          <h1 className="ca-section-title mb-0"><i className="bi bi-heart-fill text-danger me-2"></i>Favorites</h1>
          <p className="text-muted small mb-0">Products you've saved for later</p>
        </div>
        {favorites.length > 0 && (
          <Link to="/search" className="btn btn-outline-primary btn-sm">
            <i className="bi bi-search me-1"></i> Find more
          </Link>
        )}
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-heart text-muted" style={{ fontSize: "3.5rem" }}></i>
          <h4 className="mt-3">No favorites yet</h4>
          <p className="text-muted">Search for products and tap the heart icon to save them here.</p>
          <Link to="/search?q=paracetamol" className="btn btn-primary mt-2">
            <i className="bi bi-search me-1"></i> Start searching
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {favorites.map((p) => (
            <div className="col-lg-4 col-md-6" key={p.id}>
              <div className="position-relative">
                <ProductCard product={p} />
                <button
                  className="btn btn-sm btn-outline-danger position-absolute top-0 end-0 m-2 rounded-circle"
                  style={{ zIndex: 2 }}
                  onClick={() => removeFavorite(p.id)}
                  aria-label="Remove favorite"
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
