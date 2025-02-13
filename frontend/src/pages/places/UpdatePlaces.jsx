import React, { useEffect, useState } from "react";
import { Form, Input, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = "http://127.0.0.1:8000/api/places";

const UpdatePlace = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlace();
  }, []);

  const fetchPlace = async () => {
    try {
      const res = await axios.get(`${API_URL}/${id}`);
      form.setFieldsValue(res.data);
    } catch (error) {
      console.error("Error fetching place:", error);
    }
  };

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      if (file) formData.append("image", file);

      await axios.patch(`${API_URL}/${id}`, formData);
      message.success("Updated successfully!");
      navigate("/notifications");
    } catch (error) {
      message.error("Error updating data");
    }
  };

  return (
    <div>
      <h1>Edit Place</h1>
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item name="title" label="Title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input.TextArea />
        </Form.Item>
        <Form.Item label="Upload Image">
          <Upload beforeUpload={(file) => (setFile(file), false)}>
            <Button icon={<UploadOutlined />}>Select Image</Button>
          </Upload>
        </Form.Item>
        <Button type="primary" htmlType="submit">
          Update Place
        </Button>
      </Form>
    </div>
  );
};

export default UpdatePlace;
