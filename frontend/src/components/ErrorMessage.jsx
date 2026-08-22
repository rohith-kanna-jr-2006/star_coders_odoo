export default function ErrorMessage({ message, onRetry }) {
  return <div className="error-box" role="alert"><strong>We hit a snag.</strong><span>{message}</span>{onRetry && <button className="text-button" onClick={onRetry}>Try again</button>}</div>
}
