import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Alert, Select } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, LockOutlined } from '@ant-design/icons';
import AuthLayout from '../../components/auth/AuthLayout';
import AuthFormCard from '../../components/auth/AuthFormCard';
import { useAuth } from '../../contexts/AuthContext';
import { pageTitle } from '../../utils/PageTitle';
import { getAssetUrl } from '../../config';
import '../../components/auth/auth.scss';

const passwordRules = [
  { required: true, message: 'Please enter a password' },
  { min: 8, message: 'Password must be at least 8 characters' },
  {
    pattern: /[A-Z]/,
    message: 'Password must contain at least one uppercase letter',
  },
  {
    pattern: /[a-z]/,
    message: 'Password must contain at least one lowercase letter',
  },
  {
    pattern: /[0-9]/,
    message: 'Password must contain at least one number',
  },
];

function getPasswordStrength(password) {
  if (!password) return { level: 0, label: '', className: '' };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  const levels = [
    { level: 0, label: 'Weak', className: 'password-strength--weak' },
    { level: 1, label: 'Weak', className: 'password-strength--weak' },
    { level: 2, label: 'Fair', className: 'password-strength--fair' },
    { level: 3, label: 'Good', className: 'password-strength--good' },
    { level: 4, label: 'Strong', className: 'password-strength--strong' },
    { level: 5, label: 'Strong', className: 'password-strength--strong' },
  ];
  return levels[Math.min(score, 5)];
}

export default function Signup() {
  pageTitle('Sign up');
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [form] = Form.useForm();
  const password = Form.useWatch('password', form);
  const strength = useMemo(() => getPasswordStrength(password), [password]);

  const onFinish = (values) => {
    setError('');
    setLoading(true);
    const name = values.fullName || values.name || values.email?.split('@')[0];
    const roleType = values.roleType?.toLowerCase?.()?.replace(/\s+/g, '_') || values.roleType;
    signup(name, values.email, values.password, roleType, values.phone)
      .then(() => {
        setSuccess(true);
        setTimeout(() => navigate('/login', { replace: true }), 2000);
      })
      .catch((err) => {
        setError(err.message || 'Sign up failed. Please try again.');
      })
      .finally(() => setLoading(false));
  };

  if (success) {
    return (
      <AuthLayout>
        <div className="auth-page-header">
          <img src={getAssetUrl('/images/best-of-ids-logo.png')} alt="Best of IDs" className="auth-page-header__logo" />
        </div>
        <AuthFormCard title="Account created">
          <Alert
            message="Success! Your account has been created."
            description="Redirecting you to sign in..."
            type="success"
            showIcon
            style={{ marginTop: 8 }}
          />
        </AuthFormCard>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="auth-page-header">
        <img src={getAssetUrl('/images/best-of-ids-logo.png')} alt="Best of IDs" className="auth-page-header__logo" />
      </div>
      <AuthFormCard title="Create your account">
        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            closable
            onClose={() => setError('')}
            style={{ marginBottom: 16 }}
          />
        )}
        <Form
          form={form}
          name="signup"
          layout="vertical"
          requiredMark={false}
          onFinish={onFinish}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="fullName"
            label="Full Name"
            rules={[{ required: true, message: 'Please enter your full name' }]}
          >
            <Input
              prefix={<UserOutlined style={{ color: 'rgba(0,0,0,0.25)' }} />}
              placeholder="Enter your full name"
              autoComplete="name"
            />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input
              prefix={<MailOutlined style={{ color: 'rgba(0,0,0,0.25)' }} />}
              placeholder="Enter your email address"
              autoComplete="email"
            />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[
              { required: true, message: 'Please enter your phone number' },
              { pattern: /^[0-9+\-\s()]+$/, message: 'Please enter a valid phone number' },
            ]}
          >
            <Input
              prefix={<PhoneOutlined style={{ color: 'rgba(0,0,0,0.25)' }} />}
              placeholder="Enter your phone number"
              autoComplete="tel"
            />
          </Form.Item>
          <Form.Item
            name="roleType"
            label="Role Type"
            rules={[{ required: true, message: 'Please select your role' }]}
          >
            <Select
              placeholder="Select your role"
              options={[
                { value: 'student', label: 'Student' },
                { value: 'doctor', label: 'Doctor' },
                { value: 'patient', label: 'Patient' },
                { value: 'health_professional', label: 'Health Professional' },
              ]}
            />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={passwordRules}>
            <Input.Password
              prefix={<LockOutlined style={{ color: 'rgba(0,0,0,0.25)' }} />}
              placeholder="Create a password (min 8 chars, upper, lower, number)"
              autoComplete="new-password"
            />
          </Form.Item>
          {password && (
            <div className={`password-strength ${strength.className}`} style={{ marginTop: -12, marginBottom: 8 }}>
              Password strength: {strength.label}
            </div>
          )}
          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) return Promise.resolve();
                  return Promise.reject(new Error('Passwords do not match'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: 'rgba(0,0,0,0.25)' }} />}
              placeholder="Confirm your password"
              autoComplete="new-password"
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: 8 }}>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Create account
            </Button>
          </Form.Item>
        </Form>
        <p className="auth-footer-link">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </AuthFormCard>
    </AuthLayout>
  );
}
