import React, { useState, useEffect } from "react";
import { Form, Input, Upload, Button, message, Modal, Space } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { IoIosArrowBack } from "react-icons/io";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { URL_SHOLAT } from "../../utils/Endpoint";

const defaultCenter = {
  lat: -7.110958672034551,
  lng: 110.27712970443156,
};

const CreatePlace = () => {
  const [form] = Form.useForm();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();
  const [currentLocation, setCurrentLocation] = useState(defaultCenter);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => setIsModalVisible(true), // Tampilkan modal jika geolocation tidak aktif
        { enableHighAccuracy: true }
      );
    } else {
      setIsModalVisible(true);
    }
  }, []);

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("latitude", currentLocation.lat);
      formData.append("longitude", currentLocation.lng);
      if (file) formData.append("image", file);

      await axios.post(URL_SHOLAT, formData);
      message.success("Added successfully!");
      navigate("/notifications");
    } catch (error) {
      console.error("Error submitting data:", error.response?.data);
      message.error("Error submitting data");
    }
  };

  // Handle upload image
  const handleUpload = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
    setFile(file);
    return false; // Mencegah upload otomatis
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="bg-[#2A5D50] shadow-lg rounded-lg p-6 sm:p-8 w-full max-w-sm sm:max-w-md lg:max-w-lg">
          {/* Header */}
          <div className="flex mb-4">
              <IoIosArrowBack className="text-[#FFD700] mt-3 text-xl cursor-pointer" onClick={() => {navigate(-1)}}/>
              <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#FFD700] mb-3 w-full">
                Create Location
              </h2>
          </div>

          {/* Form */}
          <div>
            <Form form={form} onFinish={handleSubmit} layout="vertical">
              <Form.Item
                name="title"
                label={<span className="!text-[#FFD700] font-semibold">Title</span>}
                rules={[{ required: true }]}
              >
                <Input className="!bg-[#4cb399] border !border-[#FFD700] !text-[#FFD700] font-semibold" />
              </Form.Item>
              <Form.Item name="description" label={<span className="!text-[#FFD700] font-semibold">Description</span>}>
                <Input.TextArea className="!bg-[#4cb399] border !border-[#FFD700] !text-[#FFD700] font-semibold !resize-none" style={{ minHeight: '100px' }} />
              </Form.Item>
              <Form.Item  label={<span className="!text-[#FFD700] font-semibold">Gambar</span>}>
                <Space
                  direction="vertical"
                  style={{ width: "100%" }}
                  size="large"
                >
                  <Upload
                    listType="picture"
                    maxCount={1}
                    beforeUpload={handleUpload}
                    className="!text-amber-300 !border-amber-300 !outline-amber-300"
                  >
                    <Button type="secondary" className="!border !border-amber-300 !text-amber-300" icon={<UploadOutlined />}>Pilih Gambar</Button>
                  </Upload>
                </Space>
              </Form.Item>
              <Button type="secondary" className="!bg-amber-400 !font-semibold" htmlType="submit">
                Add Place
              </Button>
            </Form>

            {/* Modal Peringatan Geolocation */}
            <Modal
              title="Location Access Denied"
              open={isModalVisible}
              closable={false}
              footer={[
                <Button key="ok" type="primary" onClick={() => navigate(0)}>
                  OK
                </Button>,
              ]}
            >
              <p>Please enable location access for better accuracy.</p>
            </Modal>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatePlace;
