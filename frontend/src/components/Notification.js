import React from 'react'
import { AlertCircle, CheckCircle2, Info, TriangleAlert, X } from 'lucide-react'

const icons = { success: CheckCircle2, error: AlertCircle, warning: TriangleAlert, info: Info }

export default function Notification({ type = 'info', message, onClose }) {
  if (!message) return null
  const Icon = icons[type] || icons.info
  return React.createElement('div', { className: `notification notification-${type}`, role: type === 'error' ? 'alert' : 'status' }, React.createElement(Icon, { size: 18, 'aria-hidden': true }), React.createElement('span', null, message), onClose ? React.createElement('button', { className: 'icon-button', onClick: onClose, 'aria-label': 'Dismiss notification' }, React.createElement(X, { size: 16 })) : null)
}
