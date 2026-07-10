import { Link } from "react-router-dom";
import { CATEGORIES } from "../services/searchService";

export default function CategoryCards() {
  return (
    <div className="row g-4">
      {CATEGORIES.map((cat, i) => (
        <div className="col-lg col-md-4 col-6" key={cat.name}>
          <Link to={`/search?q=${encodeURIComponent(cat.name)}`} className="text-decoration-none">
            <div
              className="card h-100 ca-category-card ca-fade-up"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div
                className="ca-category-icon"
                style={{ backgroundColor: cat.color + "1a", color: cat.color }}
              >
                <i className={`bi ${cat.icon}`}></i>
              </div>
              <h6 className="fw-bold mb-1" style={{ color: "var(--ca-text)" }}>{cat.name}</h6>
              <p className="small text-muted mb-0">{cat.desc}</p>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
