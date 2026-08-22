export default function Loading({ label = 'Loading...' }) {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <span className="loading-text">{label}</span>
    </div>
  )
}
