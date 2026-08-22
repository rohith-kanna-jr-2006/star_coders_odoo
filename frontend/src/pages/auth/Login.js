import React from 'react';
import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, LockKeyhole, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getApiError } from '../../services/api';
export default function Login() {
  const {
    isAuthenticated,
    login
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  if (isAuthenticated) return /*#__PURE__*/React.createElement(Navigate, {
    to: "/employee/dashboard",
    replace: true
  });
  const submit = async event => {
    event.preventDefault();
    setError('');
    if (!form.email || !form.password) return setError('Enter your email and password.');
    setLoading(true);
    try {
      await login(form);
      navigate(location.state?.from?.pathname || '/employee/dashboard', {
        replace: true
      });
    } catch (err) {
      setError(err.message || getApiError(err));
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
  }, "YOUR WORK, IN FLOW"), /*#__PURE__*/React.createElement("h1", null, "A calmer way to manage your workday."), /*#__PURE__*/React.createElement("p", null, "One focused space for your attendance, time off, profile and pay.")), /*#__PURE__*/React.createElement("div", {
    className: "auth-aside-footer"
  }, "Employee workspace Â· Secure access")), /*#__PURE__*/React.createElement("main", {
    className: "auth-panel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "auth-form-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mobile-auth-brand brand"
  }, /*#__PURE__*/React.createElement("span", {
    className: "brand-mark"
  }, "D"), /*#__PURE__*/React.createElement("span", null, "dayflow")), /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, "WELCOME BACK"), /*#__PURE__*/React.createElement("h2", null, "Sign in to Dayflow"), /*#__PURE__*/React.createElement("p", {
    className: "muted"
  }, "Use your work credentials to continue."), /*#__PURE__*/React.createElement("form", {
    onSubmit: submit,
    className: "form-stack"
  }, /*#__PURE__*/React.createElement("label", null, "Email address", /*#__PURE__*/React.createElement("div", {
    className: "input-wrap"
  }, /*#__PURE__*/React.createElement(Mail, {
    size: 18
  }), /*#__PURE__*/React.createElement("input", {
    type: "email",
    autoComplete: "email",
    placeholder: "you@company.com",
    value: form.email,
    onChange: e => setForm({
      ...form,
      email: e.target.value
    })
  }))), /*#__PURE__*/React.createElement("label", null, "Password", /*#__PURE__*/React.createElement("div", {
    className: "input-wrap"
  }, /*#__PURE__*/React.createElement(LockKeyhole, {
    size: 18
  }), /*#__PURE__*/React.createElement("input", {
    type: "password",
    autoComplete: "current-password",
    placeholder: "Enter your password",
    value: form.password,
    onChange: e => setForm({
      ...form,
      password: e.target.value
    })
  }))), error && /*#__PURE__*/React.createElement("div", {
    className: "form-error"
  }, error), /*#__PURE__*/React.createElement("button", {
    className: "primary-button full",
    disabled: loading
  }, loading ? 'Signing in...' : /*#__PURE__*/React.createElement(React.Fragment, null, "Sign in ", /*#__PURE__*/React.createElement(ArrowRight, {
    size: 17
  })))), /*#__PURE__*/React.createElement("p", {
    className: "auth-switch"
  }, "New to Dayflow? ", /*#__PURE__*/React.createElement(Link, {
    to: "/signup"
  }, "Create an account")))));
}