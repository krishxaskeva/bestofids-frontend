import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Modal, Form, Input, Button, Alert } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../../store/hooks';
import { getAssetUrl } from '../../config';
import '../auth/auth.scss';

const SITE_TEAL = '#117574';

export default function LoginModal({ open, onClose, onSuccess }) {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form] = Form.useForm();

  const onFinish = (values) => {
    setError('');
    setLoading(true);
    const { email, password } = values;
    login(email, password)
      .then(() => {
        form.resetFields();
        onSuccess?.();
        onClose();
      })
      .catch((err) => {
        setError(err.message || 'Invalid email or password. Please try again.');
      })
      .finally(() => setLoading(false));
  };

  const handleClose = () => {
    setError('');
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      width={440}
      centered
      destroyOnClose
      className="login-modal"
      styles={{
        body: { padding: '24px 24px 28px' },
        content: { borderRadius: 16 },
      }}
      afterOpenChange={(visible) => {
        if (!visible) setError('');
      }}
    >
      <div className="auth-page-header" style={{ marginBottom: 16 }}>
        <img
          src={getAssetUrl('/images/best-of-ids-logo.png')}
          alt="Best of IDs"
          className="auth-page-header__logo"
        />
      </div>
      <h2 className="auth-form-card__title" style={{ marginBottom: 20, fontSize: '1.5rem', color: SITE_TEAL }}>
        Sign in to your account
      </h2>
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
        name="login-modal"
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
        <Form.Item style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Link to="/forgot-password" style={{ fontSize: 14 }} onClick={handleClose}>
              Forgot password?
            </Link>
          </div>
        </Form.Item>
        <Form.Item style={{ marginBottom: 8 }}>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
            style={{ backgroundColor: SITE_TEAL, borderColor: SITE_TEAL }}
          >
            Sign in
          </Button>
        </Form.Item>
      </Form>
      <p className="auth-footer-link" style={{ marginBottom: 0 }}>
        Don&apos;t have an account? <Link to="/signup" onClick={handleClose}>Sign up</Link>
      </p>
      <p className="auth-footer-link" style={{ marginTop: 8, paddingTop: 12 }}>
        <Link to="/login/admin" onClick={handleClose}>Login as admin</Link>
      </p>
    </Modal>
  );
}
