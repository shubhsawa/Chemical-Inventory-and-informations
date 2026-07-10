import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill mb-3">About ChemAware</span>
        <h1 className="ca-section-title mb-3">Empowering consumers through chemical transparency</h1>
        <p className="text-muted mx-auto" style={{ maxWidth: 720 }}>
          ChemAware is an educational platform that helps you understand the chemicals present in
          everyday consumer products and medicines — what they do, how safe they are, and how they
          affect your health and the environment.
        </p>
      </div>

      <div className="row g-4 mb-5">
        {[
          { icon: "bi-bullseye", title: "Our Purpose", text: "To make chemical information accessible and understandable so people can make informed choices about the products they use daily." },
          { icon: "bi-database", title: "How Data Is Collected", text: "We aggregate data from trusted, free public APIs including PubChem, OpenFDA, and Open Food Facts. A curated dataset supplements results for common products." },
          { icon: "bi-shield-check", title: "Our Commitment", text: "We present information clearly with safety ratings, health effects, and environmental impact — without bias or commercial influence." },
        ].map((c, i) => (
          <div className="col-md-4" key={c.title}>
            <div className="card h-100 ca-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="card-body">
                <div className="d-inline-flex align-items-center justify-content-center rounded-3 mb-3"
                  style={{ width: 52, height: 52, backgroundColor: "rgba(13,110,253,0.1)", color: "#0d6efd" }}>
                  <i className={`bi ${c.icon} fs-3`}></i>
                </div>
                <h5 className="fw-bold">{c.title}</h5>
                <p className="text-muted mb-0">{c.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card mb-5 ca-fade-up">
        <div className="card-body p-4 p-md-5">
          <h3 className="fw-bold mb-4"><i className="bi bi-cloud-download me-2 text-primary"></i>APIs We Use</h3>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="border rounded-3 p-3 h-100" style={{ borderColor: "var(--ca-border)" }}>
                <h6 className="fw-bold text-primary"><i className="bi bi-droplet-half me-1"></i>PubChem</h6>
                <p className="small text-muted mb-0">
                  Maintained by the NIH, PubChem provides chemical structures, formulas, molecular
                  weights, CAS numbers, and descriptions for over 118 million compounds.
                </p>
                <a href="https://pubchem.ncbi.nlm.nih.gov/" target="_blank" rel="noreferrer" className="small text-decoration-none">
                  pubchem.ncbi.nlm.nih.gov <i className="bi bi-box-arrow-up-right"></i>
                </a>
              </div>
            </div>
            <div className="col-md-4">
              <div className="border rounded-3 p-3 h-100" style={{ borderColor: "var(--ca-border)" }}>
                <h6 className="fw-bold text-primary"><i className="bi bi-capsule me-1"></i>OpenFDA</h6>
                <p className="small text-muted mb-0">
                  The U.S. FDA's open API delivers drug labeling data including active ingredients,
                  manufacturers, purposes, and warnings for prescription and OTC medications.
                </p>
                <a href="https://open.fda.gov/" target="_blank" rel="noreferrer" className="small text-decoration-none">
                  open.fda.gov <i className="bi bi-box-arrow-up-right"></i>
                </a>
              </div>
            </div>
            <div className="col-md-4">
              <div className="border rounded-3 p-3 h-100" style={{ borderColor: "var(--ca-border)" }}>
                <h6 className="fw-bold text-primary"><i className="bi bi-basket me-1"></i>Open Food Facts</h6>
                <p className="small text-muted mb-0">
                  A community-driven database of food products with ingredient lists, brands,
                  categories, and nutrition facts for millions of items worldwide.
                </p>
                <a href="https://world.openfoodfacts.org/" target="_blank" rel="noreferrer" className="small text-decoration-none">
                  world.openfoodfacts.org <i className="bi bi-box-arrow-up-right"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="alert alert-warning rounded-4 border-0 d-flex gap-3 align-items-start" style={{ backgroundColor: "rgba(255,193,7,0.12)" }}>
        <i className="bi bi-exclamation-triangle-fill fs-3 text-warning"></i>
        <div>
          <h5 className="alert-heading fw-bold">Disclaimer</h5>
          <p className="mb-0">
            The information provided by ChemAware is for <strong>educational purposes only</strong> and
            is not intended as medical, pharmaceutical, or professional advice. Always consult a
            qualified healthcare provider, product manufacturer, or regulatory authority for
            guidance specific to your situation. Safety ratings are heuristic estimates derived
            from public data and should not replace professional assessment.
          </p>
        </div>
      </div>

      <div className="text-center mt-5">
        <Link to="/" className="btn btn-primary"><i className="bi bi-house me-1"></i> Back to Home</Link>
      </div>
    </div>
  );
}
