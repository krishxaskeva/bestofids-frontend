import React from 'react';
import { Modal, Button, List } from 'antd';
import { CheckOutlined } from '@ant-design/icons';

const DEFAULT_PLAN = {
  title: 'Blog Premium Access',
  price: '₹199',
  period: '/ month',
  benefits: [
    'Unlimited blogs',
    'Expert insights',
    'Healthcare updates',
  ],
};

export default function SubscriptionModal({ open, onClose, onBuy, plan = DEFAULT_PLAN, loading = false }) {
  return (
    <Modal
      title={plan.title}
      open={open}
      onCancel={onClose}
      footer={null}
      width={420}
      centered
      destroyOnClose
      className="subscription-modal"
    >
      <div style={{ marginBottom: 20 }}>
        <span style={{ fontSize: 28, fontWeight: 600 }}>{plan.price}</span>
        <span style={{ color: 'rgba(0,0,0,0.45)' }}>{plan.period}</span>
      </div>
      <List
        dataSource={plan.benefits}
        renderItem={(item) => (
          <List.Item style={{ border: 'none', padding: '4px 0' }}>
            <CheckOutlined style={{ color: '#52c41a', marginRight: 8 }} />
            {item}
          </List.Item>
        )}
        style={{ marginBottom: 24 }}
      />
      <Button type="primary" block size="large" onClick={onBuy} loading={loading}>
        Buy Subscription
      </Button>
    </Modal>
  );
}
