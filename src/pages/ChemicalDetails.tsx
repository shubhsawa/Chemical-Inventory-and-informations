import { useEffect, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { getCompoundDetails, getCompoundDetailsByName, type ChemicalDetailsData } from "../services/pubchemService";
import { useFavorites } from "../hooks/useFavorites";
import { useCompare } from "../hooks/useCompare";

const safetyClass: Record<string, string> = {
  low: "bg-success",
  moderate: "bg-warning text-dark",
  high: "bg-danger",
  extreme: "bg-dark",
  unknown: "bg-secondary",
};

const safetyProgress: Record<string, number> = {
  low: 20,
  moderate: 50,
  high: 75,
  extreme: 100,
  unknown: 0,
};

export default function ChemicalDetails() {
  const { cid } = useParams();
  const [params] = useSearchParams();
  const queryName = params.get("q") || "";
  const [chemical, setChemical] = useState<ChemicalDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isInCompare, toggleCompare } = useCompare();

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    async function load() {
      try {
        if (cid) {
          const data = await getCompoundDetails(Number(cid));
          if (active) {
            if (data) setChemical(data);
            else {
              // Should not happen now (getCompoundDetails always falls back),
              // but guard anyway with a generic record.
              setError("Chemical not found.");
            }
          }
        } else if (queryName) {
          // Resolve a name to details with built-in curated fallback.
          const data = await getCompoundDetailsByName(queryName);
          if (active) {
            if (data) setChemical(data);
            else setError(`No chemical found for "${queryName}".`);
          }
        } else {
          if (active) setError("No chemical specified.");
        }
      } catch (err) {
        console.error("[ChemicalDetails] Unexpected failure:", err);
        if (active) setError("Failed to load chemical details. Please try again.");
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [cid, queryName]);

  if (loading) return <LoadingSpinner message="Fetching chemical details from PubChem..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!chemical) return <ErrorMessage message="No data available." />;

  const fav = isFavorite(`pc-${chemical.cid}`);
  const inCompare = isInCompare(`pc-${chemical.cid}`);
  const product = {
    id: `pc-${chemical.cid}`,
    name: chemical.name,
    manufacturer: "PubChem",
    category: "Chemical",
    ingredients: chemical.synonyms,
    source: "pubchem" as const,
    cid: chemical.cid,
  };

  return (
    <div className="container py-5">
      {/* Breadcrumb */}
      <nav className="mb-3">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/" className="text-decoration-none">Home</Link></li>
          <li className="breadcrumb-item"><Link to="/search" className="text-decoration-none">Search</Link></li>
          <li className="breadcrumb-item active">{chemical.name}</li>
        </ol>
      </nav>

      {chemical.isFallback && (
        <div className="alert alert-warning d-flex align-items-center gap-2 rounded-4 border-0 mb-4" style={{ backgroundColor: "rgba(255,193,7,0.12)" }}>
          <i className="bi bi-info-circle-fill text-warning"></i>
          <span className="small">
            Live API data was unavailable, so this record was built from ChemAware's curated
            reference dataset. Some fields may be approximate.
          </span>
        </div>
      )}

      {/* Header */}
      <div className="card mb-4 ca-fade-up">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
            <div>
              <div className="d-flex align-items-center gap-2 mb-2">
                <span className={`badge rounded-pill ${safetyClass[chemical.safetyLevel]} px-3 py-2`}>
                  <i className="bi bi-shield-check me-1"></i>
                  {chemical.safetyRating}
                </span>
                <span className="badge bg-light text-dark border">CID: {chemical.cid}</span>
              </div>
              <h1 className="fw-bold mb-1">{chemical.name}</h1>
              <p className="text-muted fst-italic mb-0">{chemical.scientificName}</p>
            </div>
            <div className="d-flex gap-2">
              <button
                className={`btn ${inCompare ? "btn-success" : "btn-outline-secondary"} btn-sm`}
                onClick={() => toggleCompare(product)}
              >
                <i className="bi bi-bar-chart-line me-1"></i>
                {inCompare ? "In Compare" : "Compare"}
              </button>
              <button
                className={`btn ${fav ? "btn-danger" : "btn-outline-danger"} btn-sm`}
                onClick={() => toggleFavorite(product)}
              >
                <i className={`bi ${fav ? "bi-heart-fill" : "bi-heart"} me-1`}></i>
                {fav ? "Saved" : "Save"}
              </button>
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: chemical.name, url: window.location.href }).catch(() => {});
                  } else {
                    navigator.clipboard?.writeText(window.location.href);
                  }
                }}
              >
                <i className="bi bi-share me-1"></i> Share
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Left: key facts */}
        <div className="col-lg-4">
          <div className="card ca-fade-up sticky-top" style={{ top: 90 }}>
            <div className="card-body">
              <h5 className="fw-bold mb-3"><i className="bi bi-table me-2 text-primary"></i>Chemical Identity</h5>
              <table className="table table-sm mb-0">
                <tbody>
                  <tr>
                    <th className="text-muted small">Molecular Formula</th>
                    <td className="fw-bold text-end">{chemical.molecularFormula}</td>
                  </tr>
                  <tr>
                    <th className="text-muted small">Molecular Weight</th>
                    <td className="fw-bold text-end">{chemical.molecularWeight}</td>
                  </tr>
                  <tr>
                    <th className="text-muted small">CAS Number</th>
                    <td className="fw-bold text-end">{chemical.casNumber}</td>
                  </tr>
                  <tr>
                    <th className="text-muted small">PubChem CID</th>
                    <td className="fw-bold text-end">{chemical.cid}</td>
                  </tr>
                </tbody>
              </table>

              <hr className="my-3" />
              <h6 className="small fw-bold text-muted mb-2">SYNONYMS</h6>
              <div className="d-flex flex-wrap gap-1">
                {chemical.synonyms.slice(0, 10).map((s, i) => (
                  <span key={i} className="badge bg-light text-dark border">{s}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: detailed accordions */}
        <div className="col-lg-8">
          {/* Safety meter */}
          <div className="card mb-4 ca-fade-up">
            <div className="card-body">
              <h5 className="fw-bold mb-3"><i className="bi bi-shield-exclamation me-2 text-primary"></i>Safety Rating</h5>
              <div className="d-flex justify-content-between mb-1">
                <span className="fw-semibold">{chemical.safetyRating}</span>
                <span className="text-muted small">Risk level: {chemical.safetyLevel}</span>
              </div>
              <div className="progress" style={{ height: 12 }}>
                <div
                  className={`progress-bar ${safetyClass[chemical.safetyLevel]}`}
                  style={{ width: `${safetyProgress[chemical.safetyLevel]}%` }}
                  role="progressbar"
                />
              </div>
              <p className="small text-muted mt-2 mb-0">{chemical.toxicity}</p>
            </div>
          </div>

          {/* Description */}
          <div className="card mb-4 ca-fade-up">
            <div className="card-body">
              <h5 className="fw-bold mb-2"><i className="bi bi-info-circle me-2 text-primary"></i>Overview</h5>
              <p className="mb-0">{chemical.description}</p>
            </div>
          </div>

          {/* Accordions */}
          <div className="accordion" id="chemicalAccordion">
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#uses">
                  <i className="bi bi-bag-check me-2 text-primary"></i> Common Uses
                </button>
              </h2>
              <div id="uses" className="accordion-collapse collapse show" data-bs-parent="#chemicalAccordion">
                <div className="accordion-body">
                  <ul className="mb-0">
                    {chemical.commonUses.map((u, i) => (
                      <li key={i}>{u}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <h2 className="accordion-header">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#sideEffects">
                  <i className="bi bi-clipboard2-pulse me-2 text-warning"></i> Side Effects
                </button>
              </h2>
              <div id="sideEffects" className="accordion-collapse collapse" data-bs-parent="#chemicalAccordion">
                <div className="accordion-body">
                  <ul className="mb-0">
                    {chemical.sideEffects.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <h2 className="accordion-header">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#healthRisks">
                  <i className="bi bi-heart-pulse me-2 text-danger"></i> Health Risks
                </button>
              </h2>
              <div id="healthRisks" className="accordion-collapse collapse" data-bs-parent="#chemicalAccordion">
                <div className="accordion-body">
                  <ul className="mb-0">
                    {chemical.healthRisks.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <h2 className="accordion-header">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#environment">
                  <i className="bi bi-globe-americas me-2 text-success"></i> Environmental Impact
                </button>
              </h2>
              <div id="environment" className="accordion-collapse collapse" data-bs-parent="#chemicalAccordion">
                <div className="accordion-body">
                  <p className="mb-0">{chemical.environmentalImpact}</p>
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <h2 className="accordion-header">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#regulatory">
                  <i className="bi bi-bank me-2 text-secondary"></i> Regulatory Status
                </button>
              </h2>
              <div id="regulatory" className="accordion-collapse collapse" data-bs-parent="#chemicalAccordion">
                <div className="accordion-body">
                  <p className="mb-0">{chemical.regulatoryStatus}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Reference links */}
          <div className="card mt-4 ca-fade-up">
            <div className="card-body">
              <h5 className="fw-bold mb-3"><i className="bi bi-link-45deg me-2 text-primary"></i>External References</h5>
              <div className="d-flex flex-wrap gap-2">
                {chemical.referenceLinks.map((ref) => (
                  <a
                    key={ref.url}
                    href={ref.url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline-primary btn-sm"
                  >
                    <i className="bi bi-box-arrow-up-right me-1"></i>
                    {ref.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="alert alert-info mt-4 rounded-4 border-0" style={{ backgroundColor: "rgba(13,110,253,0.08)" }}>
            <i className="bi bi-info-circle me-2"></i>
            <strong>Disclaimer:</strong> This information is for educational purposes only and
            is not medical advice. Always consult a healthcare professional or product label
            for guidance.
          </div>
        </div>
      </div>
    </div>
  );
}
