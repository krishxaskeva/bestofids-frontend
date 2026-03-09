import React from 'react';
import { Modal, Button } from 'antd';

export default function CoursePurchaseModal({
  open,
  onClose,
  onBuy,
  course = {},
  loading = false,
}) {
  const { title = 'Course Title', price = '499', description = 'Course description.' } = course;

  return (
    <Modal
      title="Purchase Course"
      open={open}
      onCancel={onClose}
      footer={null}
      width={420}
      centered
      destroyOnClose
      className="course-purchase-modal"
    >
      <h4 style={{ marginBottom: 8 }}>{title}</h4>
      <p style={{ color: 'rgba(0,0,0,0.65)', marginBottom: 16 }}>{description}</p>
      <div style={{ marginBottom: 24 }}>
        <span style={{ fontSize: 24, fontWeight: 600 }}>₹{price}</span>
      </div>
      <Button type="primary" block size="large" onClick={onBuy} loading={loading}>
        Buy Now
      </Button>
    </Modal>
  );
}
