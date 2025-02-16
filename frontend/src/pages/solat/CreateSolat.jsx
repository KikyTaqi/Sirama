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
import { FaPersonPraying } from "react-icons/fa6";
import { MdOutlineRefresh  } from "react-icons/md";

import axios from "axios";

const { Option } = Select;

const CreateSolat = () => {
  const [form] = Form.useForm();
  const [selectedPrayer, setSelectedPrayer] = useState(null);
  const [status, setStatus] = useState(null);
  const [anu, setAnu] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMap, setLoadingMap] = useState(true);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [currentTime, setCurrentTime] = useState("");
  const [permissionStatus, setPermissionStatus] = useState("pending");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();

  const { user } = useUser();

  const prayerOrder = ["subuh", "dzuhur", "asar", "maghrib", "isya"];
  const today = new Date().toISOString().split("T")[0];

  const BuatRowBaru = async () => {
    try {
      const formData = new FormData();
      formData.append("user_id", user?.id);
      formData.append("date", today);

      await axios.post("http://127.0.0.1:8000/api/prayer-records", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log("Baris baru berhasil dibuat!");
    } catch (error) {
      console.error("Gagal membuat baris baru:", error.response?.data);
      message.error("Gagal membuat baris baru.");
    }
  };

  const fetchPrayerStatus = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/prayer-records/user/${user?.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const records = response.data;
      setAnu(records);

      const todayRecord = records.find((item) => item.date === today);

      if (!todayRecord) {
        console.log("Data hari ini kosong, membuat baris baru...");
        await BuatRowBaru();
        await fetchPrayerStatus();
      } else {
        console.log("Data hari ini sudah ada:", todayRecord);
        const currentPrayerIndex = prayerOrder.findIndex(
          (prayer) => todayRecord?.[`${prayer}_status`] === "belum"
        );

        if (currentPrayerIndex !== -1) {
          const prayer = prayerOrder[currentPrayerIndex];
          setSelectedPrayer(prayer);
          form.setFieldsValue({ prayer });
        } else {
          setSelectedPrayer(null);
          form.setFieldsValue({ prayer: null });
        }
      }
    } catch (error) {
      message.error("Gagal mengambil data status solat.");
    } finally {
      setLoading(false);
    }
  };

  const getLocation = () => {
    setLoadingMap(true);
    // console.log("ef");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setLoadingMap(false);
      },
      (error) => {
        console.error("Gagal mendapatkan lokasi:", error);
        message.error("Gagal mendapatkan lokasi.");
        setLoadingMap(false);
        setIsModalVisible(true);
      }
    );
  };

  useEffect(() => {
    if (user) {
      fetchPrayerStatus();
      getLocation();
    }
  }, [user]);

  useEffect(() => {
    if (!navigator.geolocation) {
      message.error("Geolocation is not supported by your browser");
      return;
    }

    let permissionStatus;

    const checkPermission = async () => {
      try {
        permissionStatus = await navigator.permissions.query({
          name: "geolocation",
        });
        setPermissionStatus(permissionStatus.state);

        if (permissionStatus.state === "denied") {
          setIsModalVisible(true);
        } else if (permissionStatus.state === "granted") {
          getLocation();
        }

        // Event listener pada permissionStatus, bukan navigator.permissions
        const handlePermissionChange = () => {
          setPermissionStatus(permissionStatus.state);
          if (permissionStatus.state === "denied") {
            setIsModalVisible(true);
          } else if (permissionStatus.state === "granted") {
            setIsModalVisible(false);
            getLocation();
          }
        };

        permissionStatus.addEventListener("change", handlePermissionChange);

        return () => {
          permissionStatus.removeEventListener(
            "change",
            handlePermissionChange
          );
        };
      } catch (error) {
        console.error("Error checking geolocation permission:", error);
      }
    };

    checkPermission();
  }, []);

  useEffect(() => {
    const todayRecord = anu?.find((item) => item.date === today);

    if (todayRecord) {
      const currentPrayerIndex = prayerOrder.findIndex(
        (prayer) => todayRecord[`${prayer}_status`] === "belum"
      );

      if (currentPrayerIndex !== -1) {
        const prayer = prayerOrder[currentPrayerIndex];
        setSelectedPrayer(prayer);
        form.setFieldsValue({ prayer });
      } else {
        setSelectedPrayer(null);
        form.setFieldsValue({ prayer: null });
      }
    } else {
      setSelectedPrayer(null);
      form.setFieldsValue({ prayer: null });
    }
  }, [anu, form]);

  const handleStatusChange = (value) => {
    setStatus(value);
    form.setFieldsValue({ reason: "", image: null });
    setImage(null);
  };

  const handleUpload = async (file) => {
    const isLt1M = file.size / 1024 / 1024 < 1; // Validasi ukuran awal kalau mau tetap ada
    if (!isLt1M) {
      message.warning("Ukuran file lebih dari 1MB, akan dicompress...");
    }

    try {
      const options = {
        maxSizeMB: 1, // Maksimal ukuran setelah compress (dalam MB)
        maxWidthOrHeight: 1024, // Maksimal dimensi gambar
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);
      console.log(
        "Ukuran setelah compress:",
        compressedFile.size / 1024 / 1024,
        "MB"
      );

      setImage(compressedFile);
    } catch (error) {
      console.error("Gagal compress gambar:", error);
      message.error("Gagal compress gambar!");
    }

    return false; // Supaya Ant Design Upload tidak auto-upload
  };

  const handleSubmit = async (values) => {
    const todayRecord = anu.find((item) => item.date === today);
    if (!todayRecord) {
      message.error("Data hari ini belum ada!");
      return;
    }

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
      formData.append("_method", "PUT");
      formData.append("prayer_time", selectedPrayer);
      formData.append(`${selectedPrayer}_status`, values.status);
      formData.append(`${selectedPrayer}_latitude`, latitude);
      formData.append(`${selectedPrayer}_longitude`, longitude);
      formData.append(`${selectedPrayer}_time`, currentTimeFormatted);

      if (values.status === "iya" && image) {
        formData.append(`${selectedPrayer}_image`, image);
      }
      if (values.status === "tidak") {
        formData.append(`${selectedPrayer}_reason`, values.reason);
      }

      await axios.post(
        `http://127.0.0.1:8000/api/prayer-records/${todayRecord.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      message.success("Catatan berhasil diperbarui!");
      // fetchPrayerStatus();
      navigate(`/solat`);
    } catch (error) {
      message.error("Gagal menyimpan catatan solat.");
    }
  };

  if (loading) {
    return (
      <div className="w-[95vw] h-[50vh] flex justify-center items-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
      {selectedPrayer === null && navigate(`/solat`)}

      <div className="flex justify-center items-center min-h-screen px-4 sm:px-4 lg:px-4">
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
              {selectedPrayer}
            </h2>
          </div>

          {/* Form */}
          <div>
            <Form form={form} onFinish={handleSubmit} layout="vertical">
              <Form.Item
                label={
                  <span className="!text-[#FFD700] font-semibold">
                    Apakah kamu solat?
                  </span>
                }
                name="status"
                rules={[{ required: true, message: "Pilih status solat" }]}
              >
                <Select
                  onChange={handleStatusChange}
                  placeholder="Solat/Tidak Solat"
                  className="border !border-[#FFD700] !text-[#FFD700] rounded-md !bg-[#4cb399]"
                  variant="borderless"
                >
                  <Option value="iya">Iya</Option>
                  <Option value="tidak">Tidak</Option>
                </Select>
              </Form.Item>

              {status === "iya" && (
                <Form.Item
                  label={
                    <span className="!text-[#FFD700] font-semibold">
                      Foto bukti
                    </span>
                  }
                  name="image"
                  rules={[
                    { required: true, message: "Upload foto bukti solat" },
                  ]}
                >
                  <Upload
                    beforeUpload={handleUpload}
                    maxCount={1}
                    listType="picture"
                    className="!text-white"
                  >
                    <Button
                      className="!bg-amber-400 !font-semibold !text-white"
                      type="secondary"
                      icon={<UploadOutlined />}
                    >
                      Upload Foto
                    </Button>
                  </Upload>
                </Form.Item>
              )}

              {status === "tidak" && (
                <Form.Item
                  label={
                    <span className="!text-[#FFD700] font-semibold">
                      Alasan tidak solat?
                    </span>
                  }
                  name="reason"
                  rules={[
                    { required: true, message: "Masukkan alasan tidak solat" },
                  ]}
                >
                  <Input.TextArea
                    rows={3}
                    className="!bg-[#4cb399] border !border-[#FFD700] !text-[#FFD700] font-semibold !resize-none"
                    style={{ minHeight: "100px" }}
                  />
                </Form.Item>
              )}
              <div className="my-3">
                {loadingMap ? (
                  <div className="flex justify-center items-center h-[200px]">
                    <Spin size="large" className="" />
                  </div>
                ) : (
                  <iframe
                    width="100%"
                    height="200"
                    style={{ border: 0 }}
                    className="rounded-xl"
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps?q=${latitude},${longitude}&z=16&output=embed`}
                  />
                )}
              </div>
              <div className="w-full flex justify-between">
                <Button
                  type="secondary"
                  className="!bg-amber-400 !font-semibold !text-white mt"
                  loading={loadingMap}
                  onClick={() => getLocation()}
                  disabled={loadingMap}
                  icon={<MdOutlineRefresh />}
                >
                  Refresh Lokasi
                </Button>
                <Button
                  type="secondary"
                  className="!bg-amber-400 !font-semibold !text-white"
                  htmlType="submit"
                  loading={loading}
                  disabled={loading}
                  icon={<FaPersonPraying />}
                >
                  Absen Solat
                </Button>
              </div>
            </Form>

            {/* Modal Peringatan Geolocation */}
            <Modal
              title="Warning!"
              open={isModalVisible}
              closable={false}
              footer={[
                <Button
                  className="!bg-amber-400 !font-semibold !text-white"
                  key="ok"
                  type="secondary"
                  onClick={() => navigate(0)}
                >
                  OK
                </Button>,
              ]}
            >
              <p>
                Kami membutuhkan izin lokasi untuk memberikan layanan terbaik.
                Aktifkan lokasi pada perangkat Anda dan berikan izin akses
                lokasi di browser.
              </p>
            </Modal>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateSolat;
