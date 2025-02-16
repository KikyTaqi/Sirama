import React, { useState, useEffect } from "react";
import { Button, Card, message, Spin, Table } from "antd";
import axios from "axios";
import { URL_USER } from "../utils/Endpoint";
import { Link } from "react-router-dom";
import { RiAddCircleFill } from "react-icons/ri";
import { useUser } from "../components/UserContext";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [kultum, setKultum] = useState([]);
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
          `http://127.0.0.1:8000/api/kegiatan/user/${user?.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
  
        // console.timeEnd("fetchPrayerStatus"); // Hentikan stopwatch
        setData(response.data.kegiatan);
        setKultum(response.data.kultum);
      } catch (error) {
        message.error("Gagal mengambil data kegiatan." + error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchPrayerStatus();
  }, [user]);
  

  // Fetch data dari API
  // useEffect(() => {
  //   // Contoh data statis
  //   const fetchData = [
  //     { kultum: "John Doe", puasa: "Puasa", uraian: "Admin", tanggal: "3 Maret 2025" },
  //     { kultum: "Jane Smith", puasa: "Tidak Puasa", uraian: "User", tanggal: "4 Maret 2025" },
  //     { kultum: "User 3", puasa: "Puasa", uraian: "User 3", tanggal: "5 Maret 2025" },
  //     { kultum: "User 4", puasa: "Tidak Puasa", uraian: "User 4", tanggal: "6 Maret 2025" },
  //     { kultum: "User 5", puasa: "Puasa", uraian: "User 5", tanggal: "7 Maret 2025" },
  //     { kultum: "User 6", puasa: "Puasa", uraian: "User 6", tanggal: "8 Maret 2025" },
  //     { kultum: "User 7", puasa: "Puasa", uraian: "User 7", tanggal: "9 Maret 2025" },
  //     { kultum: "User 8", puasa: "Tidak Puasa", uraian: "User 8", tanggal: "10 Maret 2025" },
  //     { kultum: "User 9", puasa: "Puasa", uraian: "User 9", tanggal: "11 Maret 2025" },
  //     { kultum: "User 10", puasa: "Tidak Puasa", uraian: "User 10", tanggal: "12 Maret 2025" },
  //   ];
    
  //   setData(fetchData);
  // }, []);

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
    { title: "Puasa", dataIndex: "puasa", key: "puasa", width: "10%", className: "text-center",
      render: (text) => (
          <span
            className={`
              ${text === "iya" ? "bg-[#2E7D32]" : "bg-[#D32F2F]"}
              text-white py-1 px-3 rounded capitalize`}
          >
            {text}
          </span>
      ),
    },
    {
      title: "Alasan",
      dataIndex: "reason",
      key: "reason",
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
      title: "Uraian Tadarus",
      dataIndex: "tadarus",
      key: "tadarus",
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
      title: "Catatan Ceramah/Kultum",
      dataIndex: "date", // Gunakan date dari data kegiatan
      key: "kultum",
      render: (date) => {
        const filteredKultum = kultum.filter((item) => item.date === date);
        return (
          <div className="truncate max-w-[15rem]" title={filteredKultum.map((item) => item.tempat).join(", ")}>
            {filteredKultum.length > 0 ? filteredKultum.map((item) => item.tempat).join(", ") : <span>-</span>}
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <Card title="Kegiatan" className="shadow-md max-w-screen">
        <Link to="/kegiatan/create">
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

export default Dashboard;
