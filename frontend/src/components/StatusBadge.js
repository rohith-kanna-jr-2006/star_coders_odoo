export default function StatusBadge({ status }) {
  const normalized = String(status || 'Unknown').trim()
  const classKey = normalized.toLowerCase().replace(/[^a-z0-9]+/g, '-')

  return (
    <span className={`status-badge status-${classKey}`}>
      <span className="status-dot" aria-hidden="true" />
      {normalized}
    </span>
  )
}
