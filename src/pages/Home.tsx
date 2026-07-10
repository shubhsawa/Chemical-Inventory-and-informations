import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import CategoryCards from "../components/CategoryCards";
import { useSearchHistory } from "../hooks/useSearchHistory";

export default function Home() {
  const { history, clearHistory } = useSearchHistory();

  return (
    <div>
      {/* Hero */}
      <section className="ca-hero text-white py-5">
        <div className="ca-hero-blob" style={{ width: 320, height: 320, background: "#4361ee", top: -80, right: -60 }} />
        <div className="ca-hero-blob" style={{ width: 260, height: 260, background: "#3a0ca3", bottom: -100, left: -40 }} />
        <div className="container position-relative py-5 text-center">
          <span className="badge bg-white text-primary px-3 py-2 mb-4 rounded-pill ca-fade-in">
            <i className="bi bi-shield-check me-1"></i> Your chemical awareness companion
          </span>
          <h1 className="display-3 fw-bold mb-3 ca-fade-up" style={{ letterSpacing: "-0.03em" }}>
            Know What Is Inside<br />Your Products
          </h1>
          <p className="lead mb-4 mx-auto ca-fade-up" style={{ maxWidth: 640, animationDelay: "0.1s" }}>
            Search any medicine, cosmetic, food, or cleaning product to discover its
            ingredients, health effects, and safety information — backed by open scientific data.
          </p>
          <div className="mx-auto ca-fade-up" style={{ maxWidth: 680, animationDelay: "0.2s" }}>
            <SearchBar />
          </div>

          {history.length > 0 && (
            <div className="mt-4 d-flex align-items-center justify-content-center flex-wrap gap-2 ca-fade-up" style={{ animationDelay: "0.3s" }}>
              <span className="small text-white-50">Recent searches:</span>
              {history.map((h) => (
                <Link
                  key={h}
                  to={`/search?q=${encodeURIComponent(h)}`}
                  className="badge rounded-pill text-decoration-none"
                  style={{ backgroundColor: "rgba(255,255,255,0.18)", color: "#fff" }}
                >
                  {h}
                </Link>
              ))}
              <button className="btn btn-sm btn-link text-white-50 p-0 ms-1" onClick={clearHistory}>
                <i className="bi bi-x-circle"></i> Clear
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="container py-5">
        <div className="text-center mb-5">
          <h2 className="ca-section-title mb-2">Explore by Category</h2>
          <p className="text-muted">Browse common product categories to start your research</p>
        </div>
        <CategoryCards />
      </section>

      {/* Why it matters */}
      <section className="py-5" style={{ backgroundColor: "var(--ca-surface)" }}>
        <div className="container py-4">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill mb-3">
                Why Chemical Awareness Matters
              </span>
              <h2 className="ca-section-title mb-3">
                Informed choices start with understanding ingredients
              </h2>
              <p className="text-muted mb-4">
                Every day we encounter hundreds of chemicals — in the medicines we take, the
                cosmetics we apply, the food we eat, and the cleaners we use. Most are safe in
                the right amounts, but some can cause allergic reactions, long-term health
                effects, or environmental harm.
              </p>
              <p className="text-muted mb-4">
                ChemAware brings together open data from PubChem, OpenFDA, and Open Food Facts
                so you can look up what's really inside the products you use, understand the
                purpose of each ingredient, and make safer, more informed decisions.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link to="/search?q=paracetamol" className="btn btn-primary">
                  <i className="bi bi-search me-1"></i> Try a search
                </Link>
                <Link to="/about" className="btn btn-outline-primary">
                  Learn more
                </Link>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="row g-3">
                {[
                  { icon: "bi-clipboard2-pulse", title: "Ingredient Transparency", text: "See every ingredient and its purpose", color: "#0d6efd" },
                  { icon: "bi-heart-pulse", title: "Health Effects", text: "Understand side effects and risks", color: "#dc3545" },
                  { icon: "bi-shield-check", title: "Safety Ratings", text: "Clear toxicity and safety indicators", color: "#198754" },
                  { icon: "bi-globe-americas", title: "Environmental Impact", text: "Learn ecological consequences", color: "#fd7e14" },
                ].map((f, i) => (
                  <div className="col-sm-6" key={f.title}>
                    <div className="card h-100 ca-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                      <div className="card-body">
                        <div
                          className="d-inline-flex align-items-center justify-content-center rounded-3 mb-3"
                          style={{ width: 48, height: 48, backgroundColor: f.color + "1a", color: f.color }}
                        >
                          <i className={`bi ${f.icon} fs-4`}></i>
                        </div>
                        <h6 className="fw-bold mb-1">{f.title}</h6>
                        <p className="small text-muted mb-0">{f.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container py-5">
        <div className="row g-4">
          {[
            { num: "118M+", label: "Compounds in PubChem", icon: "bi-droplet-half" },
            { num: "100K+", label: "FDA drug labels", icon: "bi-capsule" },
            { num: "3M+", label: "Food products tracked", icon: "bi-basket" },
            { num: "5", label: "Product categories", icon: "bi-grid" },
          ].map((s) => (
            <div className="col-lg-3 col-6" key={s.label}>
              <div className="card ca-stat h-100">
                <i className={`bi ${s.icon} fs-1 text-primary mb-2`}></i>
                <div className="fs-3 fw-bold">{s.num}</div>
                <div className="small text-muted">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-5">
        <div
          className="rounded-4 p-5 text-center text-white"
          style={{ background: "linear-gradient(135deg,#0d6efd,#3a0ca3)" }}
        >
          <h3 className="fw-bold mb-2">Ready to look up a product?</h3>
          <p className="mb-4 text-white-50">Start with something you use every day — your toothpaste, a painkiller, or your favorite snack.</p>
          <Link to="/search?q=toothpaste" className="btn btn-light fw-semibold">
            <i className="bi bi-arrow-right me-1"></i> Explore products
          </Link>
        </div>
      </section>
    </div>
  );
}
