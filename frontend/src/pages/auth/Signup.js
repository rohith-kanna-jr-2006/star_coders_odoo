import React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { signup } from '../../services/authService';
import { getApiError } from '../../services/api';
export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    employeeId: '',
    name: '',
    email: '',
    password: '',
    role: 'Employee',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const update = (key, value) => setForm({
    ...form,
    [key]: value
  });
  const submit = async event => {
    event.preventDefault();
    setError('');
    setSuccess('');
    if (Object.values(form).some(value => !value)) return setError('Please complete every field.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return setError('Enter a valid email address.');
    if (form.password.length < 8) return setError('Password must be at least 8 characters.');
    if (form.password !== form.confirmPassword) return setError('Passwords do not match.');
    setLoading(true);
    try {
      await signup(form);
      setSuccess('Registration complete. Redirecting to sign in...');
      setTimeout(() => navigate('/login'), 900);
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "auth-layout"
  }, /*#__PURE__*/React.createElement("div", {
    className: "auth-aside"
  }, /*#__PURE__*/React.createElement("div", {
    className: "brand auth-brand"
  }, /*#__PURE__*/React.createElement("span", {
    className: "brand-mark"
  }, "D"), /*#__PURE__*/React.createElement("span", null, "dayflow")), /*#__PURE__*/React.createElement("div", {
    className: "auth-quote"
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, "A BETTER WORKDAY"), /*#__PURE__*/React.createElement("h1", null, "Make space for the work that matters."), /*#__PURE__*/React.createElement("p", null, "Join your teamâ€™s single source of truth for the everyday details.")), /*#__PURE__*/React.createElement("div", {
    className: "auth-aside-footer"
  }, "Employee workspace Â· Secure access")), /*#__PURE__*/React.createElement("main", {
    className: "auth-panel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "auth-form-wrap signup-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mobile-auth-brand brand"
  }, /*#__PURE__*/React.createElement("span", {
    className: "brand-mark"
  }, "D"), /*#__PURE__*/React.createElement("span", null, "dayflow")), /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, "GET STARTED"), /*#__PURE__*/React.createElement("h2", null, "Create your account"), /*#__PURE__*/React.createElement("p", {
    className: "muted"
  }, "Your people team can help with your employee ID."), /*#__PURE__*/React.createElement("form", {
    onSubmit: submit,
    className: "form-stack two-col"
  }, /*#__PURE__*/React.createElement("label", null, "Full name", /*#__PURE__*/React.createElement("input", {
    placeholder: "Your full name",
    autoComplete: "name",
    value: form.name,
    onChange: e => update('name', e.target.value)
  })), /*#__PURE__*/React.createElement("label", null, "Employee ID", /*#__PURE__*/React.createElement("input", {
    placeholder: "EMP-0000",
    value: form.employeeId,
    onChange: e => update('employeeId', e.target.value)
  })), /*#__PURE__*/React.createElement("label", null, "Work email", /*#__PURE__*/React.createElement("input", {
    type: "email",
    placeholder: "you@company.com",
    value: form.email,
    onChange: e => update('email', e.target.value)
  })), /*#__PURE__*/React.createElement("label", null, "Password", /*#__PURE__*/React.createElement("input", {
    type: "password",
    placeholder: "8+ characters",
    value: form.password,
    onChange: e => update('password', e.target.value)
  })), /*#__PURE__*/React.createElement("label", null, "Confirm password", /*#__PURE__*/React.createElement("input", {
    type: "password",
    placeholder: "Repeat password",
    value: form.confirmPassword,
    onChange: e => update('confirmPassword', e.target.value)
  })), /*#__PURE__*/React.createElement("label", null, "Role", /*#__PURE__*/React.createElement("select", {
    value: form.role,
    onChange: e => update('role', e.target.value)
  }, /*#__PURE__*/React.createElement("option", null, "Employee"), /*#__PURE__*/React.createElement("option", null, "HR"))), error && /*#__PURE__*/React.createElement("div", {
    className: "form-error span-two"
  }, error), success && /*#__PURE__*/React.createElement("div", {
    className: "form-success span-two"
  }, success), /*#__PURE__*/React.createElement("button", {
    className: "primary-button full span-two",
    disabled: loading
  }, loading ? 'Creating account...' : /*#__PURE__*/React.createElement(React.Fragment, null, "Create account ", /*#__PURE__*/React.createElement(ArrowRight, {
    size: 17
  })))), /*#__PURE__*/React.createElement("p", {
    className: "auth-switch"
  }, "Already have an account? ", /*#__PURE__*/React.createElement(Link, {
    to: "/login"
  }, "Sign in")))));
}