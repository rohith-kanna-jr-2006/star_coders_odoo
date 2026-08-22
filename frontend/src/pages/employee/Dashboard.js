import React from 'react';
import { useEffect, useState } from 'react';
import { ArrowUpRight, CalendarCheck, Clock3, FileText, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import StatusBadge from '../../components/StatusBadge';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import { useAuth } from '../../context/AuthContext';
import { getAttendance } from '../../services/attendanceService';
import { getLeaves } from '../../services/leaveService';
import { getApiError } from '../../services/api';
const unwrap = (result, key) => result?.[key] || result?.data?.[key] || result?.data || result || [];
export default function Dashboard() {
  const {
    user
  } = useAuth();
  const [data, setData] = useState({
    attendance: null,
    leaves: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [attendance, leaves] = await Promise.all([getAttendance(), getLeaves()]);
      setData({
        attendance: unwrap(attendance, 'today') || unwrap(attendance, 'attendance'),
        leaves: unwrap(leaves, 'leaves')
      });
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);
  const today = data.attendance || {};
  const name = user?.name || user?.fullName || 'there';
  const pending = data.leaves.filter(leave => String(leave.status).toLowerCase() === 'pending').length;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PageHeader, {
    eyebrow: "OVERVIEW",
    title: `Good morning, ${name.split(' ')[0]}.`,
    description: "Hereâ€™s the shape of your workday."
  }), loading ? /*#__PURE__*/React.createElement(Loading, {
    label: "Loading your workspace..."
  }) : error ? /*#__PURE__*/React.createElement(ErrorMessage, {
    message: error,
    onRetry: load
  }) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("section", {
    className: "metric-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "metric-card accent"
  }, /*#__PURE__*/React.createElement("div", {
    className: "metric-icon"
  }, /*#__PURE__*/React.createElement(Clock3, {
    size: 19
  })), /*#__PURE__*/React.createElement("span", null, "Todayâ€™s status"), /*#__PURE__*/React.createElement("strong", null, today.status || 'Not recorded'), /*#__PURE__*/React.createElement("small", null, today.checkIn || today.checkInTime ? `In at ${today.checkIn || today.checkInTime}` : 'No check-in yet')), /*#__PURE__*/React.createElement("div", {
    className: "metric-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "metric-icon green"
  }, /*#__PURE__*/React.createElement(CalendarCheck, {
    size: 19
  })), /*#__PURE__*/React.createElement("span", null, "Leave requests"), /*#__PURE__*/React.createElement("strong", null, pending), /*#__PURE__*/React.createElement("small", null, "Pending review")), /*#__PURE__*/React.createElement("div", {
    className: "metric-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "metric-icon blue"
  }, /*#__PURE__*/React.createElement(UserRound, {
    size: 19
  })), /*#__PURE__*/React.createElement("span", null, "Employee ID"), /*#__PURE__*/React.createElement("strong", null, user?.employeeId || user?.id || 'â€”'), /*#__PURE__*/React.createElement("small", null, "Active employee"))), /*#__PURE__*/React.createElement("section", {
    className: "dashboard-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-heading"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, "QUICK ACCESS"), /*#__PURE__*/React.createElement("h2", null, "Keep moving"))), /*#__PURE__*/React.createElement("div", {
    className: "quick-links"
  }, /*#__PURE__*/React.createElement(Link, {
    to: "/employee/profile"
  }, /*#__PURE__*/React.createElement(UserRound, {
    size: 20
  }), /*#__PURE__*/React.createElement("span", null, "Profile", /*#__PURE__*/React.createElement("small", null, "Personal details")), /*#__PURE__*/React.createElement(ArrowUpRight, {
    size: 17
  })), /*#__PURE__*/React.createElement(Link, {
    to: "/employee/attendance"
  }, /*#__PURE__*/React.createElement(Clock3, {
    size: 20
  }), /*#__PURE__*/React.createElement("span", null, "Attendance", /*#__PURE__*/React.createElement("small", null, "Track your hours")), /*#__PURE__*/React.createElement(ArrowUpRight, {
    size: 17
  })), /*#__PURE__*/React.createElement(Link, {
    to: "/employee/leave"
  }, /*#__PURE__*/React.createElement(FileText, {
    size: 20
  }), /*#__PURE__*/React.createElement("span", null, "Leave", /*#__PURE__*/React.createElement("small", null, pending ? `${pending} request pending` : 'Plan time away')), /*#__PURE__*/React.createElement(ArrowUpRight, {
    size: 17
  })))), /*#__PURE__*/React.createElement("div", {
    className: "section-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-heading"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, "TODAY"), /*#__PURE__*/React.createElement("h2", null, "Attendance pulse")), /*#__PURE__*/React.createElement(StatusBadge, {
    status: today.status || 'Not recorded'
  })), /*#__PURE__*/React.createElement("div", {
    className: "time-row"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, "Check-in"), /*#__PURE__*/React.createElement("strong", null, today.checkIn || today.checkInTime || 'â€”')), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, "Check-out"), /*#__PURE__*/React.createElement("strong", null, today.checkOut || today.checkOutTime || 'â€”')), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, "Hours"), /*#__PURE__*/React.createElement("strong", null, today.workingHours || today.hours || 'â€”'))), /*#__PURE__*/React.createElement(Link, {
    className: "card-link",
    to: "/employee/attendance"
  }, "Open attendance ", /*#__PURE__*/React.createElement(ArrowUpRight, {
    size: 15
  }))))));
}