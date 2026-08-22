import React from 'react';
import { useEffect, useState } from 'react';
import { CircleDollarSign, Download } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import { getPayroll } from '../../services/payrollService';
import { getApiError } from '../../services/api';
const unwrap = result => result?.payroll || result?.data?.payroll || result?.data || result || {};
export default function Payroll() {
  const [payroll, setPayroll] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const load = async () => {
    setLoading(true);
    setError('');
    try {
      setPayroll(unwrap(await getPayroll()));
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);
  if (loading) return /*#__PURE__*/React.createElement(Loading, {
    label: "Loading payroll..."
  });
  if (error) return /*#__PURE__*/React.createElement(ErrorMessage, {
    message: error,
    onRetry: load
  });
  const money = value => value === undefined || value === null || value === '' ? 'â€”' : value;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PageHeader, {
    eyebrow: "COMPENSATION",
    title: "Payroll",
    description: "A clear view of your current salary information."
  }), /*#__PURE__*/React.createElement("section", {
    className: "payroll-banner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "payroll-icon"
  }, /*#__PURE__*/React.createElement(CircleDollarSign, {
    size: 23
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, "NET SALARY"), /*#__PURE__*/React.createElement("strong", null, money(payroll?.netSalary || payroll?.net_salary)), /*#__PURE__*/React.createElement("small", null, "Current pay period"))), /*#__PURE__*/React.createElement("section", {
    className: "section-card payroll-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-heading"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, "PAY BREAKDOWN"), /*#__PURE__*/React.createElement("h2", null, "Employee payroll")), /*#__PURE__*/React.createElement("button", {
    className: "secondary-button",
    disabled: true,
    title: "Available when payroll documents are provided"
  }, /*#__PURE__*/React.createElement(Download, {
    size: 16
  }), " Download")), /*#__PURE__*/React.createElement("div", {
    className: "payroll-details"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, "Employee"), /*#__PURE__*/React.createElement("strong", null, payroll?.employeeName || payroll?.name || 'â€”')), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, "Employee ID"), /*#__PURE__*/React.createElement("strong", null, payroll?.employeeId || 'â€”')), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, "Basic salary"), /*#__PURE__*/React.createElement("strong", null, money(payroll?.basicSalary || payroll?.basic_salary))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, "Allowances"), /*#__PURE__*/React.createElement("strong", null, money(payroll?.allowances))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, "Deductions"), /*#__PURE__*/React.createElement("strong", null, money(payroll?.deductions))))));
}