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
  InputNumber,
  DatePicker,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { IoIosArrowBack } from "react-icons/io";
import imageCompression from "browser-image-compression";

import { useUser } from "../../components/UserContext";
import { FaPersonPraying } from "react-icons/fa6";
import { MdOutlineRefresh } from "react-icons/md";

import { URL_SHOLAT } from "../../utils/Endpoint";

import axios from "axios";

const { Option } = Select;

const CreateTerawih = () => {
  const [form] = Form.useForm();
  const [selectedPrayer, setSelectedPrayer] = useState(null);
  const [status, setStatus] = useState(null);
  const [statusTerawih, setStatusTerawih] = useState(null);
  const [anu, setAnu] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMap, setLoadingMap] = useState(true);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [currentTime, setCurrentTime] = useState("");
  const [permissionStatus, setPermissionStatus] = useState("pending");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [messageShown, setMessageShown] = useState(false);
  const navigate = useNavigate();

  const { user } = useUser();

  const prayerOrder = ["terawih"];
  const today = new Date();
  const todayLocal =
    today.getFullYear() +
    "-" +
    String(today.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(today.getDate()).padStart(2, "0");

  const BuatRowBaru = async () => {
    try {
      const formData = new FormData();
      formData.append("user_id", user?.id);
      formData.append("date", todayLocal);

      await axios.post(URL_SHOLAT, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

    //   console.log("Baris baru berhasil dibuat!");
    } catch (error) {
      message.error("Gagal membuat baris baru.");
    }
  };

  const fetchPrayerStatus = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${URL_SHOLAT}/user/${user?.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const records = response.data;
      setAnu(records);

      const todayRecord = records.find((item) => item.date === todayLocal);

        if (todayRecord?.[`subuh_status`] === "belum" && !messageShown) {
            navigate(`/solat`);
            message.warning('Kamu harus mengisi data solat subuh dahulu!');
            setMessageShown(true); // Menandai bahwa pesan sudah ditampilkan
        }

      if (!todayRecord) {
        await BuatRowBaru();
        await fetchPrayerStatus();
      } else {
        // console.log("TES: "+JSON.stringify(todayRecord));
        const currentPrayerIndex = prayerOrder.findIndex(
          (prayer) => todayRecord?.[`terawih_status`] === "belum"
        );

        if (currentPrayerIndex !== -1) {
          const prayer = "terawih";
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
      message.error("Geolocation tidak didukung di browser Anda.");
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
        message.error("Gagal mendapatkan izin lokasi.");
      }
    };

    checkPermission();
  }, []);

  useEffect(() => {
    const todayRecord = anu?.find((item) => item.date === todayLocal);

    if (todayRecord) {
      const currentPrayerIndex = prayerOrder.findIndex(
        (prayer) => todayRecord[`${prayer}_status`] === "belum"
      );

      if (currentPrayerIndex !== -1) {
        const prayer = "terawih";
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
  const handleStatusTerawihChange = (value) => {
    setStatusTerawih(value);
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

      setImage(compressedFile);
    } catch (error) {
      message.error("Gagal compress gambar!");
    }

    return false; // Supaya Ant Design Upload tidak auto-upload
  };

  const handleSubmit = async (values) => {
    // console.log("Submitting form:", values.reason);
    const todayRecord = anu.find((item) => item.date === todayLocal);
    // console.log("dataL "+JSON.stringify(todayRecord));
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

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("_method", "PUT");
      formData.append("prayer_time", "tarawih");
      formData.append(`tarawih_status`, values.status);
      formData.append(`tarawih_latitude`, latitude);
      formData.append(`tarawih_longitude`, longitude);
      formData.append(`tarawih_time`, currentTimeFormatted);

      if (values.status === "iya" && image) {
        formData.append(`tarawih_image`, image);
        formData.append(`kultum`, values.kultum);

        if(values.kultum === "iya"){
            formData.append(`ramadhan`, values.ramadhan);
            formData.append(`penceramah`, values.penceramah);
            formData.append(`tempat`, values.tempat);
            formData.append(`ringkasan`, values.ringkasan);
        }
      }
      if (values.status === "tidak") {
        formData.append(`tarawih_reason`, values.reason);
        
        }
        // for (let pair of formData.entries()) {
        //     console.log("DATAAAA: "+pair[0] + ": " + pair[1]);
        // }


      await axios.post(
        `${URL_SHOLAT}/${todayRecord.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      message.success("Catatan berhasil diperbarui!");
      fetchPrayerStatus();
      navigate(`/solat`);
    } catch (error) {
      message.error("Gagal menyimpan catatan solat.");
    } finally {
      setLoading(false);
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
                Terawih
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
                <>
                <Form.Item
                  label={
                    <span className="!text-[#FFD700] font-semibold">
                      Foto bukti sebelum atau sesudah solat
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
                      className="!bg-amber-400 !font-semibold !text-[#2A5D50]"
                      type="secondary"
                      icon={<UploadOutlined />}
                    >
                      Upload Foto
                    </Button>
                  </Upload>

                  </Form.Item>
                <Form.Item
                    label={
                    <span className="!text-[#FFD700] font-semibold">
                        Apakah mendengarkan ceramah/kultum? (jika ada)
                    </span>
                    }
                    name="kultum"
                >
                    <Select
                        onChange={handleStatusTerawihChange}
                        placeholder="Ada/Tidak Ada"
                        className="border !border-[#FFD700] !text-[#FFD700] rounded-md !bg-[#4cb399]"
                        variant="borderless"
                        >
                        <Option value="iya">Iya</Option>
                        <Option value="tidak">Tidak</Option>
                    </Select>
                </Form.Item>
                {statusTerawih === "iya" && (
                    <>
                  <Form.Item
                    label={
                      <span className="text-[#FFD700] font-semibold">
                        Ramadhan hari ke-
                      </span>
                    }
                    name="ramadhan"
                    rules={[{ required: true, message: "Masukkan nomor Ramadhan!" }]}
                  >
                    <InputNumber
                      placeholder="Contoh: 3, 6, 7"
                      className="w-full !bg-[#4cb399] !border-[#FFD700] !text-[#FFD700] font-semibold"
                      style={{ width: '100%', color: '#FFD700' }}
                      min={1}
                      max={30}
                      // controls={false} // Ini biar tombol up/down di samping ilang, opsional
                    />
                  </Form.Item>
        
                  <Form.Item
                    label={
                      <span className="text-[#FFD700] font-semibold">Penceramah</span>
                    }
                    name="penceramah"
                    rules={[{ required: true, message: "Masukkan nama penceramah!" }]}
                  >
                    <Input
                      placeholder="Contoh: Ust. Abdul Somad, Ustadz Adi Hidayat"
                      className="w-full !bg-[#4cb399] !border-[#FFD700] !text-[#FFD700] font-semibold"
                    />
                  </Form.Item>
        
                  <Form.Item
                    label={<span className="text-[#FFD700] font-semibold">Tempat</span>}
                    name="tempat"
                    rules={[{ required: true, message: "Masukkan tempat!" }]}
                  >
                    <Input
                      placeholder="Contoh: Masjid Al-Falah, Sekolah, Youtube, TV"
                      className="w-full !bg-[#4cb399] !border-[#FFD700] !text-[#FFD700] font-semibold"
                    />
                  </Form.Item>
        
                  <Form.Item
                    label={
                      <span className="text-[#FFD700] font-semibold">Ringkasan</span>
                    }
                    name="ringkasan"
                    rules={[{ required: true, message: "Masukkan ringkasan!" }]}
                  >
                    <Input.TextArea
                      rows={4}
                      placeholder="Tulis ringkasan kultum, misal: Tema kultum tentang keutamaan sedekah..."
                      className="w-full !bg-[#4cb399] !border-[#FFD700] !text-[#FFD700] font-semibold !resize-none"
                    />
                  </Form.Item>
                  </>
                )}
                </>
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
                    placeholder="Contoh: Sakit, haid, dll"
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
                  className="!bg-amber-400 !font-semibold !text-[#2A5D50] !px-1 md:!px-3"
                  loading={loadingMap}
                  onClick={() => getLocation()}
                  disabled={loadingMap}
                  icon={<MdOutlineRefresh />}
                >
                  Refresh
                </Button>
                <Button
                  type="secondary"
                  className="!bg-amber-400 !font-semibold !text-[#2A5D50] !px-1 md:!px-3"
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

export default CreateTerawih;
