import React from 'react';
import { useEffect, useState } from 'react';
import { CalendarDays, Check, ChevronLeft, ChevronRight, Clock3 } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import StatusBadge from '../../components/StatusBadge';
import { checkIn, checkOut, getAttendance } from '../../services/attendanceService';
import { getApiError } from '../../services/api';
const unwrap = (result, key) => result?.[key] || result?.data?.[key] || result?.data || result || [];
export default function Attendance() {
  const [data, setData] = useState(null);
  const [week, setWeek] = useState([]);
  const [loading, setLoading] = useState(true);
  const [action, setAction] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await getAttendance();
      setData(unwrap(result, 'today') || {});
      setWeek(unwrap(result, 'weekly') || unwrap(result, 'week') || []);
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);
  const act = async type => {
    setAction(type);
    setMessage('');
    try {
      await (type === 'in' ? checkIn() : checkOut());
      setMessage(type === 'in' ? 'Check-in successful.' : 'Check-out successful.');
      await load();
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setAction('');
    }
  };
  if (loading) return /*#__PURE__*/React.createElement(Loading, {
    label: "Loading attendance..."
  });
  if (error && !data) return /*#__PURE__*/React.createElement(ErrorMessage, {
    message: error,
    onRetry: load
  });
  const rows = Array.isArray(data?.daily) ? data.daily : Array.isArray(data) ? data : data?.records || [];
  const canIn = !data?.checkIn && !data?.checkInTime;
  const canOut = !data?.checkOut && !data?.checkOutTime && !canIn;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PageHeader, {
    eyebrow: "TIME & ATTENDANCE",
    title: "Attendance",
    description: "Keep an accurate pulse on your workday."
  }), /*#__PURE__*/React.createElement("section", {
    className: "attendance-hero"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, "TODAYâ€™S ATTENDANCE"), /*#__PURE__*/React.createElement("h2", null, data?.date || new Date().toLocaleDateString()), /*#__PURE__*/React.createElement("div", {
    className: "attendance-status"
  }, /*#__PURE__*/React.createElement(StatusBadge, {
    status: data?.status || 'Not recorded'
  }), data?.workingHours || data?.hours ? /*#__PURE__*/React.createElement("span", null, data.workingHours || data.hours, " worked") : null)), /*#__PURE__*/React.createElement("div", {
    className: "attendance-actions"
  }, message && /*#__PURE__*/React.createElement("span", {
    className: "form-success compact"
  }, "âœ“ ", message), error && /*#__PURE__*/React.createElement("span", {
    className: "form-error compact"
  }, error), /*#__PURE__*/React.createElement("button", {
    className: "primary-button",
    disabled: !canIn || action,
    onClick: () => act('in')
  }, action === 'in' ? 'Checking in...' : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Check, {
    size: 16
  }), " Check in")), /*#__PURE__*/React.createElement("button", {
    className: "secondary-button",
    disabled: !canOut || action,
    onClick: () => act('out')
  }, action === 'out' ? 'Checking out...' : 'Check out'))), /*#__PURE__*/React.createElement("section", {
    className: "time-row large-time"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(Clock3, {
    size: 14
  }), " Check-in"), /*#__PURE__*/React.createElement("strong", null, data?.checkIn || data?.checkInTime || 'â€”')), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(Clock3, {
    size: 14
  }), " Check-out"), /*#__PURE__*/React.createElement("strong", null, data?.checkOut || data?.checkOutTime || 'â€”')), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(CalendarDays, {
    size: 14
  }), " Working hours"), /*#__PURE__*/React.createElement("strong", null, data?.workingHours || data?.hours || 'â€”'))), /*#__PURE__*/React.createElement("section", {
    className: "section-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-heading"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, "HISTORY"), /*#__PURE__*/React.createElement("h2", null, "Daily attendance")), /*#__PURE__*/React.createElement("div", {
    className: "week-controls"
  }, /*#__PURE__*/React.createElement("button", {
    className: "icon-button",
    "aria-label": "Previous week"
  }, /*#__PURE__*/React.createElement(ChevronLeft, {
    size: 17
  })), /*#__PURE__*/React.createElement("span", null, "Current week"), /*#__PURE__*/React.createElement("button", {
    className: "icon-button",
    "aria-label": "Next week"
  }, /*#__PURE__*/React.createElement(ChevronRight, {
    size: 17
  })))), /*#__PURE__*/React.createElement("div", {
    className: "table-scroll"
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Date"), /*#__PURE__*/React.createElement("th", null, "Check-in"), /*#__PURE__*/React.createElement("th", null, "Check-out"), /*#__PURE__*/React.createElement("th", null, "Status"))), /*#__PURE__*/React.createElement("tbody", null, rows.length ? rows.map((row, index) => /*#__PURE__*/React.createElement("tr", {
    key: row._id || row.id || index
  }, /*#__PURE__*/React.createElement("td", null, row.date || row.day || 'â€”'), /*#__PURE__*/React.createElement("td", null, row.checkIn || row.checkInTime || 'â€”'), /*#__PURE__*/React.createElement("td", null, row.checkOut || row.checkOutTime || 'â€”'), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(StatusBadge, {
    status: row.status
  })))) : /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    colSpan: "4",
    className: "empty-cell"
  }, "No attendance records returned.")))))), /*#__PURE__*/React.createElement("section", {
    className: "section-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, "WEEKLY VIEW"), /*#__PURE__*/React.createElement("h2", {
    className: "card-title"
  }, "This week"), /*#__PURE__*/React.createElement("div", {
    className: "week-grid"
  }, week.length ? week.map((day, index) => /*#__PURE__*/React.createElement("div", {
    key: day.date || index
  }, /*#__PURE__*/React.createElement("span", null, day.day || day.date), /*#__PURE__*/React.createElement(StatusBadge, {
    status: day.status
  }))) : /*#__PURE__*/React.createElement("p", {
    className: "muted"
  }, "Weekly attendance will appear when the backend returns it."))));
}