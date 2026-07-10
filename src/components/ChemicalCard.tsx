import { Link } from "react-router-dom";
import type { ChemicalDetailsData } from "../services/pubchemService";

const safetyClass: Record<string, string> = {
  low: "bg-success",
  moderate: "bg-warning text-dark",
  high: "bg-danger",
  extreme: "bg-dark",
  unknown: "bg-secondary",
};

export default function ChemicalCard({ chemical }: { chemical: ChemicalDetailsData }) {
  return (
    <div className="card ca-fade-up">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
          <div>
            <h4 className="fw-bold mb-0">{chemical.name}</h4>
            <p className="text-muted small mb-0 fst-italic">{chemical.scientificName}</p>
          </div>
          <span className={`badge rounded-pill ${safetyClass[chemical.safetyLevel]} px-3 py-2`}>
            <i className="bi bi-shield-check me-1"></i>
            {chemical.safetyRating}
          </span>
        </div>

        <div className="row g-2 mb-3">
          <div className="col-md-6">
            <div className="border rounded-3 p-2 h-100" style={{ borderColor: "var(--ca-border)" }}>
              <span className="small text-muted d-block">Molecular Formula</span>
              <span className="fw-bold">{chemical.molecularFormula}</span>
            </div>
          </div>
          <div className="col-md-6">
            <div className="border rounded-3 p-2 h-100" style={{ borderColor: "var(--ca-border)" }}>
              <span className="small text-muted d-block">Molecular Weight</span>
              <span className="fw-bold">{chemical.molecularWeight}</span>
            </div>
          </div>
          <div className="col-md-6">
            <div className="border rounded-3 p-2 h-100" style={{ borderColor: "var(--ca-border)" }}>
              <span className="small text-muted d-block">CAS Number</span>
              <span className="fw-bold">{chemical.casNumber}</span>
            </div>
          </div>
          <div className="col-md-6">
            <div className="border rounded-3 p-2 h-100" style={{ borderColor: "var(--ca-border)" }}>
              <span className="small text-muted d-block">PubChem CID</span>
              <span className="fw-bold">{chemical.cid}</span>
            </div>
          </div>
        </div>

        <div className="mb-3">
          <span className="small fw-semibold text-secondary">Synonyms:</span>
          <div className="d-flex flex-wrap gap-1 mt-1">
            {chemical.synonyms.slice(0, 8).map((s, i) => (
              <span key={i} className="badge bg-light text-dark border">{s}</span>
            ))}
          </div>
        </div>

        <Link to={`/chemical/${chemical.cid}`} className="btn btn-outline-primary btn-sm">
          <i className="bi bi-info-circle me-1"></i> Full Details
        </Link>
      </div>
    </div>
  );
}
