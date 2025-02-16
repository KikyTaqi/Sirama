import React, { useState, useEffect } from "react";
import { Button, Card, message, Spin, Table } from "antd";
import axios from "axios";
import { URL_USER } from "../../utils/Endpoint";
import { Link } from "react-router-dom";
import { RiAddCircleFill } from "react-icons/ri";
import { useUser } from "../../components/UserContext";

const DashboardGuru = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5; // Jumlah data per halaman

  const { user } = useUser();

  useEffect(() => {
    if (!user?.id) return;
    const fetchPrayerStatus = async () => {
      // console.time("fetchPrayerStatus"); // Mulai stopwatch
      setLoading(true);
  
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/kegiatan/kultum/user/${user?.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
  
        // console.timeEnd("fetchPrayerStatus"); // Hentikan stopwatch
        setData(response.data);
      } catch (error) {
        message.error("Gagal mengambil data kegiatan." + error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchPrayerStatus();
  }, [user]);

  const columns = [
    // {
    //   title: "NO",
    //   key: "index",
    //   render: (_, __, index) => (currentPage - 1) * pageSize + index + 1, // Nomor otomatis
    //   width: "5%",
    //   className: "text-center",
    // },
    { title: "Tanggal", dataIndex: "date", key: "date",
      render: (text) => new Date(text).toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      width: "20%",
    },
    { title: "Ramadhan", dataIndex: "ramadhan", key: "ramadhan", width: "10%", className: "text-center",
      render: (text) => (
          <span
            // className={`
            //   ${text === "iya" ? "bg-[#2E7D32]" : "bg-[#D32F2F]"}
            //   text-white py-1 px-3 rounded capitalize`}
          >
            Ke-{text}
          </span>
      ),
    },
    {
      title: "Penceramah",
      dataIndex: "penceramah",
      key: "penceramah",
      render: (text) => (
        <div
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "15rem",
          }}
          title={text}
        >
          {text || "-"}
        </div>
      ),
    },
    {
      title: "Tempat Ceramah",
      dataIndex: "tempat",
      key: "tempat",
      render: (text) => (
        <div
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "15rem",
          }}
          title={text}
        >
          {text || "-"}
        </div>
      ),
    },
    {
      title: "Ringkasan Ceramah/Kultum",
      dataIndex: "ringkasan",
      key: "ringkasan",
      render: (text) => (
        <div
          style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "15rem",
          }}
          title={text}
        >
          {text}
        </div>
      ),
    },
  ];

  return (
    <div>
      <Card title="Catatan Ceramah / Kultum" className="shadow-md max-w-screen">
        <Link to="/kegiatan/kultum/create">
          <Button
            type="secondary"
            className="!bg-amber-400 !font-semibold !text-white mb-2"
            icon={<RiAddCircleFill />}
          >
            Tambah Kegiatan
          </Button>
        </Link>
        <div className="overflow-x-auto">
          <Table
            columns={columns}
            dataSource={data}
            loading={loading}
            pagination={{
              pageSize: pageSize,
              onChange: (page) => setCurrentPage(page),
              className: "custom-pagination",
            }}
            rowKey={(record) => record.id}  // Pastikan setiap row memiliki key unik
          />
        </div>
      </Card>
    </div>
  );
};

export default DashboardGuru;
