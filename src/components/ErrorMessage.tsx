interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="container py-5">
      <div className="alert alert-danger d-flex align-items-center gap-3 rounded-4 border-0 shadow-sm" role="alert">
        <i className="bi bi-exclamation-triangle-fill fs-3"></i>
        <div className="flex-grow-1">
          <h6 className="alert-heading fw-bold mb-1">Something went wrong</h6>
          <p className="mb-0 small">{message}</p>
        </div>
        {onRetry && (
          <button className="btn btn-outline-danger btn-sm" onClick={onRetry}>
            <i className="bi bi-arrow-clockwise me-1"></i> Retry
          </button>
        )}
      </div>
    </div>
  );
}
