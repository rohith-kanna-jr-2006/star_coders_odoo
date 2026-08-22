import { AlertCircle, RefreshCw } from 'lucide-react'

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-box" role="alert">
      <div className="error-icon-wrap">
        <AlertCircle size={20} className="error-icon" />
      </div>
      <div className="error-content">
        <strong className="error-title">Unable to complete request</strong>
        <p className="error-message">{message || 'Something went wrong. Please try again.'}</p>
      </div>
      {onRetry && (
        <button className="secondary-button error-retry-btn" onClick={onRetry}>
          <RefreshCw size={14} />
          <span>Try Again</span>
        </button>
      )}
    </div>
  )
}
