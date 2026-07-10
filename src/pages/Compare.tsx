import { Link } from "react-router-dom";
import { useCompare } from "../hooks/useCompare";

export default function Compare() {
  const { compareList, toggleCompare, clearCompare } = useCompare();

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <div>
          <h1 className="ca-section-title mb-0"><i className="bi bi-bar-chart-line text-primary me-2"></i>Compare Products</h1>
          <p className="text-muted small mb-0">Compare up to two products side by side</p>
        </div>
        {compareList.length > 0 && (
          <button className="btn btn-outline-danger btn-sm" onClick={clearCompare}>
            <i className="bi bi-trash me-1"></i> Clear all
          </button>
        )}
      </div>

      {compareList.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-bar-chart-line text-muted" style={{ fontSize: "3.5rem" }}></i>
          <h4 className="mt-3">Nothing to compare yet</h4>
          <p className="text-muted">Add products to compare using the "Compare" button on any product card.</p>
          <Link to="/search?q=toothpaste" className="btn btn-primary mt-2">
            <i className="bi bi-search me-1"></i> Find products
          </Link>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered align-middle ca-compare-table">
            <tbody>
              <tr>
                <th>Product</th>
                {compareList.map((p) => (
                  <td key={p.id}>
                    <div className="d-flex justify-content-between align-items-start">
                      <span className="fw-bold">{p.name}</span>
                      <button className="btn btn-sm btn-outline-danger ms-2" onClick={() => toggleCompare(p)}>
                        <i className="bi bi-x-lg"></i>
                      </button>
                    </div>
                  </td>
                ))}
                {compareList.length < 2 && (
                  <td className="text-center text-muted">
                    <Link to="/search" className="text-decoration-none">
                      <i className="bi bi-plus-circle fs-2 d-block"></i>
                      <span className="small">Add another</span>
                    </Link>
                  </td>
                )}
              </tr>
              <tr>
                <th>Category</th>
                {compareList.map((p) => <td key={p.id}>{p.category}</td>)}
                {compareList.length < 2 && <td></td>}
              </tr>
              <tr>
                <th>Manufacturer</th>
                {compareList.map((p) => <td key={p.id}>{p.manufacturer}</td>)}
                {compareList.length < 2 && <td></td>}
              </tr>
              <tr>
                <th>Purpose</th>
                {compareList.map((p) => <td key={p.id} className="small">{p.purpose || "—"}</td>)}
                {compareList.length < 2 && <td></td>}
              </tr>
              <tr>
                <th>Ingredients</th>
                {compareList.map((p) => (
                  <td key={p.id}>
                    <ul className="list-unstyled mb-0 small">
                      {p.ingredients.map((ing, i) => (
                        <li key={i} className="mb-1">
                          <i className="bi bi-dot text-primary"></i>{ing}
                        </li>
                      ))}
                    </ul>
                  </td>
                ))}
                {compareList.length < 2 && <td></td>}
              </tr>
              <tr>
                <th>Warnings</th>
                {compareList.map((p) => (
                  <td key={p.id} className="small text-muted">{p.warnings || "—"}</td>
                ))}
                {compareList.length < 2 && <td></td>}
              </tr>
              <tr>
                <th>Details</th>
                {compareList.map((p) => (
                  <td key={p.id}>
                    <Link
                      to={p.cid ? `/chemical/${p.cid}` : `/chemical?q=${encodeURIComponent(p.ingredients[0] || p.name)}`}
                      className="btn btn-outline-primary btn-sm"
                    >
                      <i className="bi bi-clipboard2-pulse me-1"></i> View
                    </Link>
                  </td>
                ))}
                {compareList.length < 2 && <td></td>}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
