import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
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
import { FaPersonPraying } from "react-icons/fa6";

import { useUser } from "../../components/UserContext";

import axios from "axios";

const { Option } = Select;

const Solat = () => {
  const [form] = Form.useForm();
  const [selectedPrayer, setSelectedPrayer] = useState(null);
  const [todayRecord, setTodayRecord] = useState([]);
  const [anu, setAnu] = useState(null);
  const [loading, setLoading] = useState(true);
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
        setTodayRecord(todayRecord);
        const currentPrayerIndex = prayerOrder.findIndex(
          (prayer) => todayRecord?.[`${prayer}_status`] === "belum"
        );

        if (currentPrayerIndex !== -1) {
          const prayer = prayerOrder[currentPrayerIndex];
          setSelectedPrayer(prayer);
        } else {
          setSelectedPrayer(null);
        }
      }
    } catch (error) {
      message.error("Gagal mengambil data status solat.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const todayRecord = anu?.find((item) => item.date === today);
  
    if (todayRecord) {
      const currentPrayerIndex = prayerOrder.findIndex(
        (prayer) => todayRecord[`${prayer}_status`] === "belum"
      );
  
      if (currentPrayerIndex !== -1) {
        const prayer = prayerOrder[currentPrayerIndex];
        setSelectedPrayer(prayer);
      } else {
        setSelectedPrayer(null);
      }
    } else {
      setSelectedPrayer(null);
    }
  }, [anu]);
  

  useEffect(() => {
    if (user) {
      fetchPrayerStatus();
    }
  }, [user]);

  const getPrayerStatusText = (status) => {
    switch (status) {
      case "iya":
        return "Sudah Solat";
      case "tidak":
        return "Tidak Solat";
      case "belum":
      default:
        return "Belum Solat";
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
    <div className="flex justify-center items-center py-4 px-4">
      <div className="bg-[#2A5D50] shadow-lg rounded-lg p-6 w-full max-w-md">
        {/* Header */}
        <h2 className="text-2xl font-bold text-center text-[#FFD700] mb-6">
          Catatan Solat
        </h2>
  
        {/* Status Salat */}
        {todayRecord ? (
          <div className="bg-[#1E4A40] p-4 rounded-lg shadow-inner">
            <h3 className="text-[#FFD700] font-semibold mb-3">
              Status Salat Hari Ini
            </h3>
            <div className="space-y-2">
              {prayerOrder.map((prayer) => {
                const status = todayRecord[`${prayer}_status`];
                const statusText = getPrayerStatusText(status);
                const statusColor =
                  status === "iya"
                    ? "bg-green-600"
                    : status === "tidak"
                    ? "bg-red-600"
                    : "bg-gray-500";
  
                return (
                  <div
                    key={prayer}
                    className="flex justify-between items-center bg-[#2D6A5A] p-2 rounded-md"
                  >
                    <span className="capitalize text-white">{prayer}</span>
                    <span
                      className={`text-white px-3 py-1 rounded-md ${statusColor}`}
                    >
                      {statusText}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-center text-white">Belum ada data untuk hari ini.</p>
        )}
  
        {/* Absen Solat / Semua Dicatat */}
        <div className="mt-6 text-center">
          {selectedPrayer === null ? (
            <p className="text-green-400 font-semibold">
              Semua solat hari ini sudah dicatat!
            </p>
          ) : (
            <Link to={`/solat/create`}>
              <Button
                type="secondary"
                className="!bg-amber-400 !font-semibold !text-white"
                icon={<FaPersonPraying />}
              >
                Absen Solat
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
  
};

export default Solat;
