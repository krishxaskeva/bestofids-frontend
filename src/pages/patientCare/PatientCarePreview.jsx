import React from 'react';
import { Modal, Tag } from 'antd';
import dayjs from 'dayjs';

const categoryColorMap = {
  'Health Tips': 'green',
  'Patient Guidelines': 'blue',
  'Announcements': 'orange',
  'Awareness Campaigns': 'purple',
  'Treatment Updates': 'cyan',
};

export default function PatientCarePreview({ post, open, onClose }) {
  if (!post) return null;

  const displayDate = post.publishDate || post.createdAt;

  return (
    <Modal
      title="Preview – How it appears on the website"
      open={open}
      onCancel={onClose}
      footer={null}
      width={640}
      destroyOnClose
    >
      <div className="patient-care-preview" style={{ padding: '8px 0' }}>
        {post.thumbnailUrl && (
          <div style={{ marginBottom: 16, borderRadius: 8, overflow: 'hidden' }}>
            <img
              src={post.thumbnailUrl}
              alt=""
              style={{ width: '100%', height: 240, objectFit: 'cover' }}
            />
          </div>
        )}
        <div style={{ marginBottom: 8 }}>
          {post.category && (
            <Tag color={categoryColorMap[post.category] || 'default'}>
              {post.category}
            </Tag>
          )}
          {displayDate && (
            <span style={{ marginLeft: 8, color: '#666', fontSize: 13 }}>
              {dayjs(displayDate).format('MMM D, YYYY')}
            </span>
          )}
        </div>
        <h3 style={{ marginBottom: 12, fontSize: 22 }}>{post.title}</h3>
        <p style={{ color: '#555', marginBottom: 16 }}>{post.shortDescription}</p>
        <div
          className="preview-content"
          dangerouslySetInnerHTML={{ __html: post.content || '' }}
          style={{
            borderTop: '1px solid #f0f0f0',
            paddingTop: 16,
            fontSize: 15,
            lineHeight: 1.6,
          }}
        />
      </div>
    </Modal>
  );
}
