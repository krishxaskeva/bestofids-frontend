import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Form, Input, Button, Checkbox, Alert } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import AuthLayout from '../../components/auth/AuthLayout';
import AuthFormCard from '../../components/auth/AuthFormCard';
import { useAuth } from '../../store/hooks';
import { pageTitle } from '../../utils/PageTitle';
import { getAssetUrl } from '../../config';
import '../../components/auth/auth.scss';

export default function Login() {
  pageTitle('Login');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form] = Form.useForm();

  const onFinish = (values) => {
    setError('');
    setLoading(true);
    const { email, password } = values;
    console.log('Login form submit, email:', email);
    login(email, password)
      .then(() => {
        const from = location.state?.from?.pathname || '/';
        const redirectParam = new URLSearchParams(location.search).get('redirect');
        const target = redirectParam && redirectParam.startsWith('/') ? redirectParam : from;
        console.log('User logged in, redirecting to:', target);
        navigate(target, { replace: true });
      })
      .catch((err) => {
        console.error('Component error (Login):', err);
        setError(err.message || 'Invalid email or password. Please try again.');
      })
      .finally(() => setLoading(false));
  };

  return (
    <AuthLayout>
      <div className="auth-page-header">
        <img
          src={getAssetUrl('/images/best-of-ids-logo.png')}
          alt="Best of IDs"
          className="auth-page-header__logo"
        />
      </div>
      <AuthFormCard title="Sign in to your account">
        {location.state?.message && (
          <Alert
            message={location.state.message}
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}
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
          name="login"
          layout="vertical"
          requiredMark={false}
          onFinish={onFinish}
          autoComplete="off"
          size="large"
        >
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
          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <Link to="/forgot-password" style={{ fontSize: 14 }}>Forgot password?</Link>
            </div>
          </Form.Item>
          <Form.Item style={{ marginBottom: 8 }}>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Sign in
            </Button>
          </Form.Item>
        </Form>
        <p className="auth-footer-link">
          Don&apos;t have an account? <Link to="/signup">Sign up</Link>
        </p>
        <p className="auth-footer-link" style={{ marginTop: 8, paddingTop: 12 }}>
          <Link to="/login/admin">Login as admin</Link>
        </p>
      </AuthFormCard>
    </AuthLayout>
  );
}
