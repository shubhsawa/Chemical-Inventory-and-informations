import { Link } from "react-router-dom";
import { CATEGORIES } from "../services/searchService";

export default function Footer() {
  return (
    <footer className="border-top mt-auto" style={{ backgroundColor: "var(--ca-surface)" }}>
      <div className="container py-5">
        <div className="row g-4">
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 fw-bold fs-4 mb-2">
              <span
                className="d-inline-flex align-items-center justify-content-center rounded-3"
                style={{ width: 34, height: 34, background: "linear-gradient(135deg,#0d6efd,#3a0ca3)", color: "#fff" }}
              >
                <i className="bi bi-flask-fill"></i>
              </span>
              <span style={{ color: "var(--ca-text)" }}>
                Chem<span style={{ color: "var(--ca-primary)" }}>Aware</span>
              </span>
            </div>
            <p className="text-muted small mb-0">
              Empowering consumers to understand the chemicals in everyday products and medicines.
              Knowledge leads to safer choices.
            </p>
          </div>

          <div className="col-lg-2 col-md-6 col-6">
            <h6 className="fw-bold mb-3">Categories</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2">
              {CATEGORIES.map((c) => (
                <li key={c.name}>
                  <Link to={`/search?q=${encodeURIComponent(c.name)}`} className="text-decoration-none text-muted">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-lg-3 col-md-6 col-6">
            <h6 className="fw-bold mb-3">Quick Links</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2">
              <li><Link to="/" className="text-decoration-none text-muted">Home</Link></li>
              <li><Link to="/about" className="text-decoration-none text-muted">About Us</Link></li>
              <li><Link to="/favorites" className="text-decoration-none text-muted">Favorites</Link></li>
              <li><Link to="/compare" className="text-decoration-none text-muted">Compare Products</Link></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="fw-bold mb-3">Data Sources</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2 text-muted">
              <li><a href="https://pubchem.ncbi.nlm.nih.gov/" target="_blank" rel="noreferrer" className="text-decoration-none text-muted">PubChem (NIH)</a></li>
              <li><a href="https://open.fda.gov/" target="_blank" rel="noreferrer" className="text-decoration-none text-muted">OpenFDA</a></li>
              <li><a href="https://world.openfoodfacts.org/" target="_blank" rel="noreferrer" className="text-decoration-none text-muted">Open Food Facts</a></li>
            </ul>
          </div>
        </div>

        <hr className="my-4" style={{ borderColor: "var(--ca-border)" }} />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
          <p className="small text-muted mb-0">
            &copy; {new Date().getFullYear()} ChemAware. For educational purposes only.
          </p>
          <p className="small text-muted mb-0">
            Built with React, Bootstrap 5 &amp; public open data.
          </p>
        </div>
      </div>
    </footer>
  );
}
