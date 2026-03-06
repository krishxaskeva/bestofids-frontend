import React from 'react';
import { Card } from 'antd';

export default function AuthFormCard({ title, subtitle, children, extra, className = '' }) {
  return (
    <Card
      className={`auth-form-card ${className}`}
      bordered={false}
      title={title ? <span className="auth-form-card__title">{title}</span> : undefined}
      extra={extra}
    >
      {subtitle && <p className="auth-form-card__subtitle">{subtitle}</p>}
      {children}
    </Card>
  );
}
