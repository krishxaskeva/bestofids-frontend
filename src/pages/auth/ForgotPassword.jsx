import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Alert } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import AuthLayout from '../../components/auth/AuthLayout';
import AuthFormCard from '../../components/auth/AuthFormCard';
import { pageTitle } from '../../utils/PageTitle';
import { forgotPassword } from '../../services/authService';
import { getAssetUrl } from '../../config';
import '../../components/auth/auth.scss';

export default function ForgotPassword() {
  pageTitle('Forgot Password');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form] = Form.useForm();

  const onFinish = (values) => {
    setError('');
    setLoading(true);
    forgotPassword(values.email)
      .then(() => {
        navigate('/verify-otp', { state: { email: values.email.trim() } });
      })
      .catch((err) => {
        setError(err.message || 'Failed to send OTP. Please try again.');
      })
      .finally(() => setLoading(false));
  };

  return (
    <AuthLayout>
      <div className="auth-page-header">
        <img src={getAssetUrl('/images/best-of-ids-logo.png')} alt="Best of IDs" className="auth-page-header__logo" />
      </div>
      <AuthFormCard title="Forgot password?">
        <p style={{ color: 'rgba(0,0,0,0.65)', marginBottom: 24 }}>
          Enter your email and we&apos;ll send you a one-time code to reset your password.
        </p>
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
          name="forgot-password"
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
          <Form.Item style={{ marginBottom: 8 }}>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Send OTP
            </Button>
          </Form.Item>
        </Form>
        <p className="auth-footer-link">
          <Link to="/login">Back to sign in</Link>
        </p>
      </AuthFormCard>
    </AuthLayout>
  );
}
