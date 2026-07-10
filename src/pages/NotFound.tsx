import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container py-5 text-center" style={{ minHeight: "60vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <i className="bi bi-compass text-primary" style={{ fontSize: "4rem" }}></i>
      <h1 className="display-4 fw-bold mt-3">404</h1>
      <p className="lead text-muted">This page took a wrong turn in the lab.</p>
      <div>
        <Link to="/" className="btn btn-primary"><i className="bi bi-house me-1"></i> Back to Home</Link>
      </div>
    </div>
  );
}
