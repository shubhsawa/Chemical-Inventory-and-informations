import type { UnifiedProduct } from "../services/searchService";
import ProductCard from "./ProductCard";

interface SearchResultsListProps {
  products: UnifiedProduct[];
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export default function SearchResultsList({ products, page, pageSize, onPageChange }: SearchResultsListProps) {
  const totalPages = Math.ceil(products.length / pageSize);
  const start = (page - 1) * pageSize;
  const pageItems = products.slice(start, start + pageSize);

  if (products.length === 0) return null;

  return (
    <div>
      <div className="row g-4">
        {pageItems.map((p) => (
          <div className="col-lg-4 col-md-6" key={`${p.id}-${p.name}`}>
            <ProductCard product={p} />
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <nav className="d-flex justify-content-center mt-5">
          <ul className="pagination">
            <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => onPageChange(page - 1)}>
                <i className="bi bi-chevron-left"></i>
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <li key={n} className={`page-item ${n === page ? "active" : ""}`}>
                <button className="page-link" onClick={() => onPageChange(n)}>
                  {n}
                </button>
              </li>
            ))}
            <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => onPageChange(page + 1)}>
                <i className="bi bi-chevron-right"></i>
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}
