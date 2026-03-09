import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Form, Input, Button, Alert } from 'antd';
import { LockOutlined, SafetyCertificateOutlined, ReloadOutlined } from '@ant-design/icons';
import AuthLayout from '../../components/auth/AuthLayout';
import AuthFormCard from '../../components/auth/AuthFormCard';
import { pageTitle } from '../../utils/PageTitle';
import { verifyResetOtp, forgotPassword } from '../../services/authService';
import { getAssetUrl } from '../../config';
import '../../components/auth/auth.scss';

const passwordRules = [
  { required: true, message: 'Please enter a new password' },
  { min: 8, message: 'Password must be at least 8 characters' },
  { pattern: /[A-Z]/, message: 'At least one uppercase letter' },
  { pattern: /[a-z]/, message: 'At least one lowercase letter' },
  { pattern: /[0-9]/, message: 'At least one number' },
];

export default function VerifyOtp() {
  pageTitle('Reset Password');
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromState = location.state?.email || '';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendMessage, setResendMessage] = useState('');
  const [form] = Form.useForm();

  useEffect(() => {
    if (!emailFromState) {
      navigate('/forgot-password', { replace: true });
    }
  }, [emailFromState, navigate]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setInterval(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [resendCooldown]);

  const handleResendOtp = () => {
    if (resendCooldown > 0 || resendLoading) return;
    setError('');
    setResendMessage('');
    setResendLoading(true);
    forgotPassword(emailFromState)
      .then(() => {
        setResendMessage('A new OTP has been sent to your email.');
        setResendCooldown(60);
      })
      .catch((err) => {
        setError(err.message || 'Failed to send OTP. Please try again.');
      })
      .finally(() => setResendLoading(false));
  };

  const onFinish = (values) => {
    setError('');
    setLoading(true);
    const email = values.email || emailFromState;
    verifyResetOtp(email, values.otp, values.newPassword)
      .then(() => {
        setSuccess(true);
        setTimeout(() => navigate('/login', { replace: true }), 2500);
      })
      .catch((err) => {
        setError(err.message || 'Failed to reset password. Please try again.');
      })
      .finally(() => setLoading(false));
  };

  if (success) {
    return (
      <AuthLayout>
        <div className="auth-page-header">
          <img src={getAssetUrl('/images/best-of-ids-logo.png')} alt="Best of IDs" className="auth-page-header__logo" />
        </div>
        <AuthFormCard title="Password reset successful">
          <Alert
            message="Password reset successful. Please login."
            type="success"
            showIcon
            style={{ marginTop: 8 }}
          />
          <p className="auth-footer-link" style={{ marginTop: 16 }}>
            Redirecting to login...
          </p>
        </AuthFormCard>
      </AuthLayout>
    );
  }

  if (!emailFromState) {
    return null;
  }

  return (
    <AuthLayout>
      <div className="auth-page-header">
        <img src={getAssetUrl('/images/best-of-ids-logo.png')} alt="Best of IDs" className="auth-page-header__logo" />
      </div>
      <AuthFormCard title="Enter OTP & new password">
        <p style={{ color: 'rgba(0,0,0,0.65)', marginBottom: 24 }}>
          Enter the 6-digit OTP sent to <strong>{emailFromState}</strong> and choose a new password.
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
          name="verify-otp"
          layout="vertical"
          requiredMark={false}
          onFinish={onFinish}
          autoComplete="off"
          size="large"
          initialValues={{ email: emailFromState }}
        >
          <Form.Item name="email" hidden>
            <Input type="hidden" />
          </Form.Item>
          <Form.Item
            name="otp"
            label="OTP"
            rules={[
              { required: true, message: 'Please enter the OTP' },
              { len: 6, message: 'OTP must be 6 digits' },
              { pattern: /^\d{6}$/, message: 'OTP must be 6 digits' },
            ]}
          >
            <Input
              prefix={<SafetyCertificateOutlined style={{ color: 'rgba(0,0,0,0.25)' }} />}
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              autoComplete="one-time-code"
            />
          </Form.Item>
          <div style={{ marginTop: -8, marginBottom: 16 }}>
            <Button
              type="link"
              size="small"
              icon={<ReloadOutlined />}
              loading={resendLoading}
              disabled={resendCooldown > 0}
              onClick={handleResendOtp}
              style={{ padding: 0 }}
            >
              {resendCooldown > 0
                ? `Resend OTP (${resendCooldown}s)`
                : 'Resend OTP'}
            </Button>
            {resendMessage && (
              <span style={{ marginLeft: 8, color: '#52c41a', fontSize: 12 }}>{resendMessage}</span>
            )}
          </div>
          <Form.Item name="newPassword" label="New password" rules={passwordRules}>
            <Input.Password
              prefix={<LockOutlined style={{ color: 'rgba(0,0,0,0.25)' }} />}
              placeholder="New password (min 8 chars, upper, lower, number)"
              autoComplete="new-password"
            />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Confirm password"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Please confirm your password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) return Promise.resolve();
                  return Promise.reject(new Error('Passwords do not match'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: 'rgba(0,0,0,0.25)' }} />}
              placeholder="Confirm new password"
              autoComplete="new-password"
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: 8 }}>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Reset password
            </Button>
          </Form.Item>
        </Form>
        <p className="auth-footer-link">
          <Link to="/forgot-password">Use a different email</Link>
        </p>
        <p className="auth-footer-link" style={{ marginTop: 8 }}>
          <Link to="/login">Back to sign in</Link>
        </p>
      </AuthFormCard>
    </AuthLayout>
  );
}
