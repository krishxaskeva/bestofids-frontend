import React, { useState } from 'react';
import { Modal, Form, Button, Radio } from 'antd';

const PAYMENT_METHODS = [
  { value: 'card', label: 'Card' },
  { value: 'upi', label: 'UPI' },
  { value: 'netbanking', label: 'Net Banking' },
];

export default function PaymentModal({
  open,
  onClose,
  onConfirm,
  planName,
  amount,
  loading: externalLoading = false,
}) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const isProcessing = loading || externalLoading;

  const handleConfirm = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await onConfirm?.(values);
      form.resetFields();
      onClose();
    } catch (err) {
      // validation or API error
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      form.resetFields();
      onClose();
    }
  };

  return (
    <Modal
      title="Confirm Payment"
      open={open}
      onCancel={handleClose}
      footer={null}
      width={420}
      centered
      destroyOnClose
      maskClosable={!isProcessing}
      closable={!isProcessing}
      className="payment-modal"
    >
      <Form form={form} layout="vertical" initialValues={{ paymentMethod: 'card' }}>
        <Form.Item label="Plan Name">
          <span style={{ fontWeight: 500 }}>{planName}</span>
        </Form.Item>
        <Form.Item label="Amount">
          <span style={{ fontWeight: 600, fontSize: 18 }}>₹{amount}</span>
        </Form.Item>
        <Form.Item name="paymentMethod" label="Payment Method" rules={[{ required: true }]}>
          <Radio.Group>
            {PAYMENT_METHODS.map((m) => (
              <Radio key={m.value} value={m.value}>
                {m.label}
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>
        <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
          <Button type="primary" block size="large" onClick={handleConfirm} loading={isProcessing} disabled={isProcessing}>
            Confirm Payment
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
