import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Alert } from 'antd';
import { MailOutlined, LockOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import AuthLayout from '../../components/auth/AuthLayout';
import AuthFormCard from '../../components/auth/AuthFormCard';
import { useAuth } from '../../store/hooks';
import { pageTitle } from '../../utils/PageTitle';
import { getAssetUrl } from '../../config';
import '../../components/auth/auth.scss';

export default function AdminLogin() {
  pageTitle('Admin Login');
  const navigate = useNavigate();
  const { adminLogin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form] = Form.useForm();

  const onFinish = (values) => {
    setError('');
    setLoading(true);
    const { email, password } = values;
    adminLogin(email, password)
      .then(() => {
        navigate('/admin', { replace: true });
      })
      .catch((err) => {
        const isNetworkError = err.message === 'Network Error' || err.code === 'ERR_NETWORK' || !err.response;
        setError(
          isNetworkError
            ? 'Cannot reach the server. Make sure the backend is running (e.g. run "npm start" in the backend folder).'
            : (err.message || 'Invalid admin credentials. Please try again.')
        );
      })
      .finally(() => setLoading(false));
  };

  return (
    <AuthLayout variant="admin">
      <div className="auth-page-header">
        <img
          src={getAssetUrl('/images/best-of-ids-logo.png')}
          alt="Best of IDs"
          className="auth-page-header__logo"
        />
      </div>
      <AuthFormCard
        title="Admin sign in"
        subtitle="Admin Access Only — Sign in with your administrator credentials."
        extra={
          <span className="auth-admin-badge">
            <SafetyCertificateOutlined /> Admin
          </span>
        }
      >
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
          name="admin-login"
          layout="vertical"
          requiredMark={false}
          onFinish={onFinish}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="email"
            label="Admin Email"
            rules={[
              { required: true, message: 'Please enter admin email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input
              prefix={<MailOutlined style={{ color: 'rgba(0,0,0,0.25)' }} />}
              placeholder="Enter admin email"
              autoComplete="email"
            />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: 'rgba(0,0,0,0.25)' }} />}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: 8 }}>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Sign in as admin
            </Button>
          </Form.Item>
        </Form>
        <p className="auth-footer-link">
          <Link to="/login">← Back to user login</Link>
        </p>
      </AuthFormCard>
    </AuthLayout>
  );
}
