import React from 'react';
import { useEffect, useState } from 'react';
import { Save, UserRound } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import { getProfile, updateProfile } from '../../services/profileService';
import { getApiError } from '../../services/api';
const unwrap = result => result?.profile || result?.data?.profile || result?.data || result || {};
export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    phone: '',
    address: '',
    profilePicture: ''
  });
  const [state, setState] = useState({
    loading: true,
    saving: false,
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
      const next = unwrap(await getProfile());
      setProfile(next);
      setForm({
        phone: next.phone || '',
        address: next.address || '',
        profilePicture: next.profilePicture || next.profileImage || ''
      });
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
  const save = async event => {
    event.preventDefault();
    setState({
      ...state,
      saving: true,
      message: '',
      error: ''
    });
    try {
      const next = unwrap(await updateProfile(form));
      setProfile(next || {
        ...profile,
        ...form
      });
      setState({
        ...state,
        saving: false,
        message: 'Profile updated successfully.'
      });
    } catch (err) {
      setState({
        ...state,
        saving: false,
        error: getApiError(err)
      });
    }
  };
  if (state.loading) return /*#__PURE__*/React.createElement(Loading, {
    label: "Loading profile..."
  });
  if (state.error && !profile) return /*#__PURE__*/React.createElement(ErrorMessage, {
    message: state.error,
    onRetry: load
  });
  const readOnly = [['Employee ID', profile.employeeId || profile.id], ['Email', profile.email], ['Department', profile.department], ['Designation', profile.designation], ['Joining date', profile.joiningDate || profile.joinedAt]];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PageHeader, {
    eyebrow: "MY PROFILE",
    title: "Profile",
    description: "Your identity at Dayflow, all in one place."
  }), /*#__PURE__*/React.createElement("div", {
    className: "profile-grid"
  }, /*#__PURE__*/React.createElement("section", {
    className: "section-card profile-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "profile-hero"
  }, /*#__PURE__*/React.createElement("div", {
    className: "avatar large"
  }, (profile.name || profile.fullName || 'E').slice(0, 1)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, profile.name || profile.fullName || 'Employee'), /*#__PURE__*/React.createElement("p", null, profile.designation || 'Employee'))), /*#__PURE__*/React.createElement("div", {
    className: "eyebrow profile-label"
  }, "PERSONAL DETAILS"), /*#__PURE__*/React.createElement("form", {
    onSubmit: save,
    className: "form-stack"
  }, /*#__PURE__*/React.createElement("label", null, "Phone", /*#__PURE__*/React.createElement("input", {
    value: form.phone,
    onChange: e => setForm({
      ...form,
      phone: e.target.value
    })
  })), /*#__PURE__*/React.createElement("label", null, "Address", /*#__PURE__*/React.createElement("textarea", {
    rows: "3",
    value: form.address,
    onChange: e => setForm({
      ...form,
      address: e.target.value
    })
  })), /*#__PURE__*/React.createElement("label", null, "Profile picture URL", /*#__PURE__*/React.createElement("input", {
    value: form.profilePicture,
    onChange: e => setForm({
      ...form,
      profilePicture: e.target.value
    }),
    placeholder: "https://..."
  })), state.error && /*#__PURE__*/React.createElement("div", {
    className: "form-error"
  }, state.error), state.message && /*#__PURE__*/React.createElement("div", {
    className: "form-success"
  }, state.message), /*#__PURE__*/React.createElement("button", {
    className: "primary-button",
    disabled: state.saving
  }, /*#__PURE__*/React.createElement(Save, {
    size: 16
  }), state.saving ? 'Saving...' : 'Save changes'))), /*#__PURE__*/React.createElement("section", {
    className: "section-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, "EMPLOYMENT DETAILS"), /*#__PURE__*/React.createElement("h2", {
    className: "card-title"
  }, "Read-only information"), /*#__PURE__*/React.createElement("div", {
    className: "detail-list"
  }, readOnly.map(([label, value]) => /*#__PURE__*/React.createElement("div", {
    key: label
  }, /*#__PURE__*/React.createElement("span", null, label), /*#__PURE__*/React.createElement("strong", null, value || '-')))), /*#__PURE__*/React.createElement("div", {
    className: "eyebrow profile-label"
  }, "SALARY"), /*#__PURE__*/React.createElement("div", {
    className: "salary-readonly"
  }, /*#__PURE__*/React.createElement("span", null, "Current salary structure"), /*#__PURE__*/React.createElement("strong", null, profile.salary?.netSalary || profile.salary || 'Available through payroll')))));
}