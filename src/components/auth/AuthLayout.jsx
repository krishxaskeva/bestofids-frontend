import React from 'react';
import { ConfigProvider } from 'antd';
import { Row, Col } from 'antd';
import { getAssetUrl } from '../../config';

const AUTH_THEME = {
  token: {
    colorPrimary: '#117574',
    borderRadius: 8,
    colorLink: '#117574',
  },
  components: {
    Button: { primaryShadow: '0 2px 8px rgba(17, 117, 116, 0.25)' },
    Input: { activeShadow: '0 0 0 2px rgba(17, 117, 116, 0.15)' },
  },
};

export default function AuthLayout({ children, variant = 'default' }) {
  const isAdmin = variant === 'admin';

  return (
    <ConfigProvider theme={AUTH_THEME}>
      <div className={`auth-layout ${isAdmin ? 'auth-layout--admin' : ''}`}>
        <Row gutter={0} className="auth-layout__row">
          <Col xs={0} sm={0} md={12} lg={12} xl={12} className="auth-layout__brand">
            <div className="auth-layout__brand-inner">
              <img
                src={getAssetUrl('/images/best-of-ids-logo.png')}
                alt="Best of IDs"
                className="auth-layout__logo"
              />
              <h1 className="auth-layout__tagline">
                Transforming Infectious Disease Care
              </h1>
              <p className="auth-layout__sub">
                {isAdmin
                  ? 'Secure admin access for authorized personnel only.'
                  : 'Your health and safety are our priority.'}
              </p>
              <div className="auth-layout__illustration">
                <div className="auth-layout__illustration-shape auth-layout__illustration-shape--1" />
                <div className="auth-layout__illustration-shape auth-layout__illustration-shape--2" />
                <div className="auth-layout__illustration-shape auth-layout__illustration-shape--3" />
              </div>
            </div>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={12} className="auth-layout__form-col">
            <div className="auth-layout__form-wrap">{children}</div>
          </Col>
        </Row>
      </div>
    </ConfigProvider>
  );
}
