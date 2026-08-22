export default function StatusBadge({ status }) { const value = String(status || 'Unknown'); return <span className={`status status-${value.toLowerCase().replace(/[^a-z]+/g, '-')}`}>{value}</span> }
