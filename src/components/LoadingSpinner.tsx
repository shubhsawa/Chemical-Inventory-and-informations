export default function LoadingSpinner({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="ca-loading-wrap">
      <div
        className="spinner-border text-primary"
        style={{ width: "3rem", height: "3rem" }}
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="text-muted mb-0">{message}</p>
    </div>
  );
}
