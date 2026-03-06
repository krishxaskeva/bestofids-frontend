import React from 'react';
import { Form, Input, Select, Upload, Switch } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { usePatientCare } from '../../contexts/PatientCareContext';

const { TextArea } = Input;

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image'],
    ['clean'],
  ],
};

export default function PatientCareForm({ form, thumbnailFileList, onThumbnailChange }) {
  const { categories } = usePatientCare();

  return (
    <Form form={form} layout="vertical">
      <Form.Item
        name="title"
        label="Title"
        rules={[{ required: true, message: 'Please enter a title' }]}
      >
        <Input placeholder="Post title" />
      </Form.Item>
      <Form.Item
        name="shortDescription"
        label="Short Description"
        rules={[{ required: true, message: 'Please enter a short description' }]}
      >
        <TextArea rows={3} placeholder="Brief summary for cards and listings" />
      </Form.Item>
      <Form.Item
        name="content"
        label="Detailed Content"
        rules={[{ required: true, message: 'Please add content' }]}
      >
        <ReactQuill
          theme="snow"
          modules={quillModules}
          placeholder="Write health content..."
          style={{ minHeight: 200 }}
        />
      </Form.Item>
      <Form.Item
        name="category"
        label="Category"
        rules={[{ required: true, message: 'Please select a category' }]}
      >
        <Select
          placeholder="Select category"
          options={categories.map((c) => ({ value: c.value, label: c.label }))}
        />
      </Form.Item>
      <Form.Item
        name="showInWebsite"
        label="Show on website"
        valuePropName="checked"
        initialValue={true}
      >
        <Switch checkedChildren="Yes" unCheckedChildren="No" />
      </Form.Item>
      <Form.Item label="Thumbnail Image">
        <Upload
          listType="picture-card"
          maxCount={1}
          accept="image/*"
          beforeUpload={() => false}
          onChange={onThumbnailChange}
          fileList={thumbnailFileList}
        >
          <div>
            <UploadOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        </Upload>
      </Form.Item>
    </Form>
  );
}
