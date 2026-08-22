import React from 'react';
import { useEffect, useState } from 'react';
import { Send } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import StatusBadge from '../../components/StatusBadge';
import { applyLeave, getLeaves } from '../../services/leaveService';
import { getApiError } from '../../services/api';
import Notification from '../../components/Notification';
const unwrap = result => result?.leaves || result?.data?.leaves || result?.data || result || [];
export default function Leave() {
  const [leaves, setLeaves] = useState([]);
  const [form, setForm] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    remarks: ''
  });
  const [state, setState] = useState({
    loading: true,
    submitting: false,
    error: '',
    message: ''
  });
  const load = async () => {
    setState({
      ...state,
      loading: true,
      error: ''
    });
    try {
      setLeaves(unwrap(await getLeaves()));
    } catch (err) {
      setState({
        ...state,
        loading: false,
        error: getApiError(err)
      });
      return;
    }
    setState({
      ...state,
      loading: false
    });
  };
  useEffect(() => {
    load();
  }, []);
  const submit = async event => {
    event.preventDefault();
    if (!form.leaveType || !form.startDate || !form.endDate) return setState({
      ...state,
      error: 'Choose a leave type and both dates.'
    });
    if (form.endDate < form.startDate) return setState({
      ...state,
      error: 'End date cannot be before start date.'
    });
    setState({
      ...state,
      submitting: true,
      error: '',
      message: ''
    });
    try {
      await applyLeave(form);
      setForm({
        leaveType: '',
        startDate: '',
        endDate: '',
        remarks: ''
      });
      setState({
        ...state,
        submitting: false,
        message: 'Leave request submitted successfully.'
      });
      await load();
    } catch (err) {
      setState({
        ...state,
        submitting: false,
        error: getApiError(err)
      });
    }
  };
  if (state.loading) return /*#__PURE__*/React.createElement(Loading, {
    label: "Loading leave history..."
  });
  if (state.error && !leaves.length) return /*#__PURE__*/React.createElement(ErrorMessage, {
    message: state.error,
    onRetry: load
  });
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PageHeader, {
    eyebrow: "TIME AWAY",
    title: "Leave",
    description: "Plan time away and keep track of every request."
  }), /*#__PURE__*/React.createElement("div", {
    className: "leave-grid"
  }, /*#__PURE__*/React.createElement("section", {
    className: "section-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, "NEW REQUEST"), /*#__PURE__*/React.createElement("h2", {
    className: "card-title"
  }, "Apply for leave"), /*#__PURE__*/React.createElement("form", {
    onSubmit: submit,
    className: "form-stack"
  }, /*#__PURE__*/React.createElement("label", null, "Leave type", /*#__PURE__*/React.createElement("select", {
    value: form.leaveType,
    onChange: e => setForm({
      ...form,
      leaveType: e.target.value
    })
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Select type"), /*#__PURE__*/React.createElement("option", {
    value: "Paid"
  }, "Paid"), /*#__PURE__*/React.createElement("option", {
    value: "Sick"
  }, "Sick"), /*#__PURE__*/React.createElement("option", {
    value: "Unpaid"
  }, "Unpaid"))), /*#__PURE__*/React.createElement("div", {
    className: "two-col"
  }, /*#__PURE__*/React.createElement("label", null, "From date", /*#__PURE__*/React.createElement("input", {
    type: "date",
    value: form.startDate,
    onChange: e => setForm({
      ...form,
      startDate: e.target.value
    })
  })), /*#__PURE__*/React.createElement("label", null, "To date", /*#__PURE__*/React.createElement("input", {
    type: "date",
    value: form.endDate,
    onChange: e => setForm({
      ...form,
      endDate: e.target.value
    })
  }))), /*#__PURE__*/React.createElement("label", null, "Remarks ", /*#__PURE__*/React.createElement("span", {
    className: "optional"
  }, "Optional"), /*#__PURE__*/React.createElement("textarea", {
    rows: "4",
    placeholder: "Add context for your manager",
    value: form.remarks,
    onChange: e => setForm({
      ...form,
      remarks: e.target.value
    })
  })), state.error && /*#__PURE__*/React.createElement("div", {
    className: "form-error"
  }, state.error), state.message && /*#__PURE__*/React.createElement("div", {
    className: "form-success"
  }, state.message), /*#__PURE__*/React.createElement(Notification, {
    type: "success",
    message: state.message
  }), /*#__PURE__*/React.createElement("button", {
    className: "primary-button",
    disabled: state.submitting
  }, state.submitting ? 'Submitting...' : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Send, {
    size: 16
  }), " Submit request")))), /*#__PURE__*/React.createElement("section", {
    className: "section-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, "REQUESTS"), /*#__PURE__*/React.createElement("h2", {
    className: "card-title"
  }, "Leave history"), /*#__PURE__*/React.createElement("div", {
    className: "table-scroll"
  }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Type"), /*#__PURE__*/React.createElement("th", null, "From"), /*#__PURE__*/React.createElement("th", null, "To"), /*#__PURE__*/React.createElement("th", null, "Status"))), /*#__PURE__*/React.createElement("tbody", null, leaves.length ? leaves.map((leave, index) => /*#__PURE__*/React.createElement("tr", {
    key: leave._id || leave.id || index
  }, /*#__PURE__*/React.createElement("td", null, leave.leaveType || leave.type || 'â€”'), /*#__PURE__*/React.createElement("td", null, leave.startDate || leave.from || 'â€”'), /*#__PURE__*/React.createElement("td", null, leave.endDate || leave.to || 'â€”'), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(StatusBadge, {
    status: leave.status
  })))) : /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    colSpan: "4",
    className: "empty-cell"
  }, "No leave requests yet."))))))));
}