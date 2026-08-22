import React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { signup } from '../../services/authService';
import { getApiError } from '../../services/api';

const employeeTypes = [
  'Software Developer / Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Data Analyst',
  'Data Scientist',
  'AI/ML Engineer',
  'Generative AI Engineer',
  'Cloud Engineer',
  'DevOps Engineer',
  'Cybersecurity Engineer',
  'QA / Test Engineer',
  'Database Engineer',
  'Technical Support Engineer',
  'Business Analyst',
  'UI/UX Designer'
];

const departments = [
  'Engineering',
  'Design',
  'Product',
  'HR',
  'Finance',
  'Marketing',
  'Sales',
  'Operations'
];

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    roleType: 'Employee',
    employeeType: '',
    department: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (key, value) => {
    if (key === 'roleType') {
      setForm({
        ...form,
        roleType: value,
        employeeType: '',
        department: ''
      });
    } else {
      setForm({
        ...form,
        [key]: value
      });
    }
  };

  const submit = async event => {
    event.preventDefault();
    setError('');
    setSuccess('');
    
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      return setError('Please complete all required fields.');
    }
    if (form.roleType === 'Employee' && !form.employeeType) {
      return setError('Please select an Employee Type.');
    }
    if (form.roleType === 'HR' && !form.department) {
      return setError('Please select a Department.');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return setError('Enter a valid email address.');
    if (form.password.length < 8) return setError('Password must be at least 8 characters.');
    if (form.password !== form.confirmPassword) return setError('Passwords do not match.');
    
    setLoading(true);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.roleType.toLowerCase(),
      };
      
      if (form.roleType === 'Employee') {
        payload.designation = form.employeeType;
      } else if (form.roleType === 'HR') {
        payload.department = form.department;
      }
      
      const res = await signup(payload);
      const employeeId = res.user?.employeeId || 'N/A';
      
      setSuccess(`Account created successfully!\nEmployee ID: ${employeeId}\nRole Type: ${form.roleType}\n${form.roleType === 'Employee' ? `Employee Type: ${form.employeeType}` : `Department: ${form.department}`}`);
      
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const aside = React.createElement("div", { className: "auth-aside" },
    React.createElement("div", { className: "brand auth-brand" },
      React.createElement("span", { className: "brand-mark" }, "D"),
      React.createElement("span", null, "dayflow")
    ),
    React.createElement("div", { className: "auth-quote" },
      React.createElement("div", { className: "eyebrow" }, "A BETTER WORKDAY"),
      React.createElement("h1", null, "Make space for the work that matters."),
      React.createElement("p", null, "Join your team's single source of truth for the everyday details.")
    ),
    React.createElement("div", { className: "auth-aside-footer" }, "Employee workspace · Secure access")
  );

  const formFields = [
    React.createElement("label", { key: "name" }, "Full name", React.createElement("input", { placeholder: "Your full name", autoComplete: "name", value: form.name, onChange: e => update('name', e.target.value) })),
    React.createElement("label", { key: "email" }, "Work email", React.createElement("input", { type: "email", placeholder: "you@company.com", value: form.email, onChange: e => update('email', e.target.value) })),
    React.createElement("label", { key: "password" }, "Password", React.createElement("input", { type: "password", placeholder: "8+ characters", value: form.password, onChange: e => update('password', e.target.value) })),
    React.createElement("label", { key: "confirmPassword" }, "Confirm password", React.createElement("input", { type: "password", placeholder: "Repeat password", value: form.confirmPassword, onChange: e => update('confirmPassword', e.target.value) })),
    React.createElement("label", { key: "roleType" }, "Role Type", React.createElement("select", { value: form.roleType, onChange: e => update('roleType', e.target.value) },
      React.createElement("option", { value: "Employee" }, "Employee"),
      React.createElement("option", { value: "HR" }, "HR")
    )),
    form.roleType === 'Employee' ? React.createElement("label", { key: "employeeType" }, "Employee Type", React.createElement("select", { value: form.employeeType, onChange: e => update('employeeType', e.target.value) },
      React.createElement("option", { value: "" }, "Select employee type"),
      employeeTypes.map(type => React.createElement("option", { key: type, value: type }, type))
    )) : null,
    form.roleType === 'HR' ? React.createElement("label", { key: "department" }, "Department", React.createElement("select", { value: form.department, onChange: e => update('department', e.target.value) },
      React.createElement("option", { value: "" }, "Select department"),
      departments.map(dept => React.createElement("option", { key: dept, value: dept }, dept))
    )) : null,
    error ? React.createElement("div", { key: "error", className: "form-error span-two" }, error) : null,
    success ? React.createElement("div", { key: "success", className: "form-success span-two", style: { whiteSpace: 'pre-line', lineHeight: '1.5' } }, success) : null,
    React.createElement("button", { key: "submitBtn", className: "primary-button full span-two", disabled: loading || !!success },
      loading ? 'Creating account...' : React.createElement(React.Fragment, null, success ? "Account Created" : "Create account ", !success ? React.createElement(ArrowRight, { size: 17 }) : null)
    )
  ];

  const mainPanel = React.createElement("main", { className: "auth-panel" },
    React.createElement("div", { className: "auth-form-wrap signup-wrap" },
      React.createElement("div", { className: "mobile-auth-brand brand" },
        React.createElement("span", { className: "brand-mark" }, "D"),
        React.createElement("span", null, "dayflow")
      ),
      React.createElement("div", { className: "eyebrow" }, "GET STARTED"),
      React.createElement("h2", null, "Create your account"),
      React.createElement("form", { onSubmit: submit, className: "form-stack two-col", style: { marginTop: '24px' } }, ...formFields),
      React.createElement("p", { className: "auth-switch" }, "Already have an account? ", React.createElement(Link, { to: "/login" }, "Sign in"))
    )
  );

  return React.createElement("div", { className: "auth-layout" }, aside, mainPanel);
}