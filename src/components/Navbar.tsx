import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useCompare } from "../hooks/useCompare";
import { useFavorites } from "../hooks/useFavorites";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { compareList } = useCompare();
  const { favorites } = useFavorites();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [collapsed, setCollapsed] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setCollapsed(false);
    }
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `nav-link fw-medium ${isActive ? "active" : ""}`;

  return (
    <nav className="navbar navbar-expand-lg sticky-top border-bottom" style={{ backgroundColor: "var(--ca-surface)" }}>
      <div className="container">
        <Link to="/" className="navbar-brand d-flex align-items-center gap-2 fw-bold">
          <span
            className="d-inline-flex align-items-center justify-content-center rounded-3"
            style={{ width: 38, height: 38, background: "linear-gradient(135deg,#0d6efd,#3a0ca3)", color: "#fff" }}
          >
            <i className="bi bi-flask-fill fs-5"></i>
          </span>
          <span style={{ color: "var(--ca-text)" }}>
            Chem<span style={{ color: "var(--ca-primary)" }}>Aware</span>
          </span>
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          aria-label="Toggle navigation"
        >
          <i className={`bi ${collapsed ? "bi-x-lg" : "bi-list"} fs-4`}></i>
        </button>

        <div className={`collapse navbar-collapse ${collapsed ? "show" : ""}`}>
          <form className="d-flex mx-lg-auto my-2 my-lg-0" style={{ maxWidth: 420, width: "100%" }} onSubmit={submit}>
            <div className="input-group">
              <span className="input-group-text bg-transparent border-end-0">
                <i className="bi bi-search"></i>
              </span>
              <input
                className="form-control border-start-0"
                type="search"
                placeholder="Search products or chemicals..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search"
              />
              <button className="btn btn-primary px-3" type="submit">
                Search
              </button>
            </div>
          </form>

          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-1">
            <li className="nav-item">
              <NavLink to="/" end className={linkClass} onClick={() => setCollapsed(false)}>
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/about" className={linkClass} onClick={() => setCollapsed(false)}>
                About
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/favorites" className={linkClass} onClick={() => setCollapsed(false)}>
                <i className="bi bi-heart-fill text-danger me-1"></i>
                Favorites
                {favorites.length > 0 && (
                  <span className="badge bg-danger ms-1">{favorites.length}</span>
                )}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/compare" className={linkClass} onClick={() => setCollapsed(false)}>
                <i className="bi bi-bar-chart-line me-1"></i>
                Compare
                {compareList.length > 0 && (
                  <span className="badge bg-primary ms-1">{compareList.length}</span>
                )}
              </NavLink>
            </li>
            <li className="nav-item ms-lg-2">
              <button
                className="btn btn-outline-secondary btn-sm rounded-circle"
                onClick={toggleTheme}
                aria-label="Toggle theme"
                title="Toggle dark mode"
              >
                <i className={`bi ${theme === "dark" ? "bi-sun-fill" : "bi-moon-stars-fill"}`}></i>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
