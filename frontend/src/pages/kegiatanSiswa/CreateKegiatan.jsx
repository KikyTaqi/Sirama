import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Select,
  Upload,
  Input,
  Button,
  message,
  Spin,
  Modal,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { IoIosArrowBack } from "react-icons/io";
import imageCompression from "browser-image-compression";

import { useUser } from "../../components/UserContext";
import { RiAddCircleFill } from "react-icons/ri";

import axios from "axios";
import { URL_KEGIATAN } from "../../utils/Endpoint";

const { Option } = Select;

const CreateKegiatan = () => {
  const [form] = Form.useForm();
  const [selectedPrayer, setSelectedPrayer] = useState(null);
  const [status, setStatus] = useState(null);
  const [anu, setAnu] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [currentTime, setCurrentTime] = useState("");
  const [permissionStatus, setPermissionStatus] = useState("pending");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();

  const { user } = useUser();

  const prayerOrder = ["subuh", "dzuhur", "asar", "maghrib", "isya"];
  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async (values) => {
    setLoading(true);
    const now = new Date();
    const currentTimeFormatted = `${now
      .getHours()
      .toString()
      .padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now
      .getSeconds()
      .toString()
      .padStart(2, "0")}`;

    setCurrentTime(currentTimeFormatted);

    try {
      const formData = new FormData();
      formData.append("_method", "POST");
      formData.append("puasa", values.status);
      formData.append("tadarus", values.tadarus || null);

      if (values.status == "tidak") {
        formData.append("reason", values.reason);
      }

      await axios.post(
        URL_KEGIATAN,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // fetchPrayerStatus();
      navigate(`/dashboard`);
      message.success("Berhasil menyimpan kegiatan!");
    } catch (error) {
      message.error("Gagal menyimpan kegiatan!.");
    } finally{
      setLoading(false);
    }
  };

  const handleStatusChange = (value) => {
    setStatus(value);
    form.setFieldsValue({ reason: "" });
  };

  // if (loading) {
  //   return (
  //     <div className="w-[95vw] h-[50vh] flex justify-center items-center">
  //       <Spin size="large" />
  //     </div>
  //   );
  // }

  return (
    <>
      {/* {selectedPrayer === null && navigate(`/solat`)} */}

      <div className="flex justify-center items-center py-4 px-4 sm:px-4 lg:px-4">
        <div className="bg-[#2A5D50] shadow-lg rounded-lg p-6 sm:p-8 w-full max-w-sm sm:max-w-md lg:max-w-lg">
          {/* Header */}
          <div className="flex mb-4">
            <IoIosArrowBack
              className="text-[#FFD700] mt-3 text-xl cursor-pointer"
              onClick={() => {
                navigate(-1);
              }}
            />
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#FFD700] mb-3 w-full capitalize">
              Tambah kegiatan
            </h2>
          </div>

          {/* Form */}
          <div>
            <Form form={form} onFinish={handleSubmit} layout="vertical">
              <Form.Item
                label={
                  <span className="!text-[#FFD700] font-semibold">
                    Apakah kamu puasa?
                  </span>
                }
                name="status"
                rules={[{ required: true, message: "Pilih status puasa" }]}
              >
                <Select
                  onChange={handleStatusChange}
                  placeholder="Puasa/Tidak Puasa"
                  className="border !border-[#FFD700] !text-[#FFD700] rounded-md !bg-[#4cb399]"
                  variant="borderless"
                >
                  <Option value="iya">Iya</Option>
                  <Option value="tidak">Tidak</Option>
                </Select>
              </Form.Item>

              {status === "tidak" && (
                <Form.Item
                  label={
                    <span className="!text-[#FFD700] font-semibold">
                      Alasan tidak puasa?
                    </span>
                  }
                  name="reason"
                  rules={[
                    { required: true, message: "Masukkan alasan tidak puasa" },
                  ]}
                  >
                  <Input.TextArea
                    rows={3}
                    placeholder="Contoh: Sakit, haid, dll"
                    className="!bg-[#4cb399] border !border-[#FFD700] !text-[#FFD700] font-semibold !resize-none"
                    style={{ minHeight: "100px" }}
                    />
                </Form.Item>
              )}
              <Form.Item
                label={
                  <span className="!text-[#FFD700] font-semibold">
                    Isi kegiatan tadarus
                  </span>
                }
                name="tadarus"
              >
                <Input.TextArea
                  rows={3}
                  placeholder="Contoh: 1 ayat, 2 surat, 1 juz, dll"
                  className="!bg-[#4cb399] border !border-[#FFD700] !text-[#FFD700] font-semibold !resize-none"
                  style={{ minHeight: "100px" }}
                />
              </Form.Item>

              <div className="w-full flex justify-end">
                <Button
                  type="secondary"
                  className="!bg-amber-400 !font-semibold !text-[#2A5D50]"
                  htmlType="submit"
                  loading={loading}
                  disabled={loading}
                  icon={<RiAddCircleFill className=""/>}
                >
                  Tambah
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateKegiatan;
