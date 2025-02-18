import React, { useState, useEffect } from "react";
import { Button, Card, message, Spin, Table, Pagination, Flex, Tag } from "antd";
import axios from "axios";
import { URL_USER, URL_KEGIATAN, URL_SHOLAT } from "../../utils/Endpoint";
import { Link } from "react-router-dom";
import { RiAddCircleFill } from "react-icons/ri";
import { FaCheck } from "react-icons/fa6";
import { useUser } from "../../components/UserContext";

const DashboardGuru = () => {
  const [data, setData] = useState([]);
  const [siswa, setSiswa] = useState([]);
  const [kultum, setKultum] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [pageSize, setPageSize] = useState(5); // Jumlah data per halaman

  const { user } = useUser();

  useEffect(() => {
    if (!user?.id) return;
    const fetchPrayerStatus = async () => {
      // console.time("fetchPrayerStatus"); // Mulai stopwatch
      setLoading(true);

      try {

        // const siswaResponse = await axios.get(`${URL_USER}/siswa-by-kelas`, {
        //   params: { kelas: user?.kelas },
        //   headers: {
        //     Authorization: `Bearer ${localStorage.getItem("token")}`,
        //   },
        // });

        const response = await axios.get(`http://127.0.0.1:8000/api/kegiatan-kelas?kelas=X PPLG 1`, {
          // params: { kelas: user?.kelas },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const responseSolat = await axios.get(
          `${URL_SHOLAT}/user/${user?.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        // console.timeEnd("fetchPrayerStatus"); // Hentikan stopwatch
        // setSiswa(siswaResponse.data);
        // console.log(siswaResponse.data);

        setData(response.data.kegiatan);
        console.log(response.data.kegiatan);
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
    // {
    //   title: "Tanggal",
    //   dataIndex: "date",
    //   key: "date",
    //   render: (text) =>
    //     new Date(text).toLocaleDateString("id-ID", {
    //       weekday: "long",
    //       year: "numeric",
    //       month: "long",
    //       day: "numeric",
    //     }),
    //   width: "20%",
    // },
    {
      title: "Nama Siswa",
      dataIndex: "name",
      key: "name",
      width: "20%",
    },
    {
      title: "Puasa",
      dataIndex: "puasa",
      key: "puasa",
      width: "10%",
      className: "text-center",
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
      title: "Solat",
      dataIndex: "",
      key: "solat_status",
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
          <Flex gap="4px 0">
            <Tag color={``}></Tag>
          </Flex>
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
          <div
            className="truncate max-w-[15rem]"
            title={filteredKultum.map((item) => item.ringkasan).join(", ")}
          >
            {filteredKultum.length > 0 ? (
              filteredKultum.map((item) => item.ringkasan).join(", ")
            ) : (
              <span>-</span>
            )}
          </div>
        );
      },
    },
  ];

  const paginatedData = siswa.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Format waktu dan tanggal
  const formatTime = currentTime.toLocaleTimeString("en-EN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const formatDate = currentTime.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const today = new Date().toISOString().split("T")[0]; // Ambil tanggal hari ini dalam format YYYY-MM-DD
  // const isTodayFilled = data.some((item) => item.date === today);

  return (
    <div className="flex justify-center items-center py-4 px-4">
      <div className="w-full lg:max-w-4xl">
        <div className="bg-[#1E3A34] p-4 rounded-md mb-4 shadow-md">
          <h2 className="text-2xl font-semibold text-[#FFD700] mb-3">
            Selamat Datang di Dashboard Guru, {user?.name}!
          </h2>
          <table>
            <tbody>
              <tr>
                <td>
                  <p className="text-sm text-white">Hari ini</p>
                </td>
                <td>
                  <p className="text-sm text-white px-5">:</p>
                </td>
                <td>
                  <p className="text-sm text-white">{formatDate}</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p className="text-sm text-white">Jam</p>
                </td>
                <td>
                  <p className="text-sm text-white px-5">:</p>
                </td>
                <td>
                  <p className="text-sm text-white">{formatTime}</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <Card title="Kegiatan" className="shadow-md max-w-screen">
          <div className="overflow-x-auto">
            <Table
              columns={columns}
              dataSource={paginatedData}
              loading={loading}
              pagination={false}
              rowKey={(record) => record.id} // Pastikan setiap row memiliki key unik
            />
          </div>
          <div className="mt-4 flex justify-end">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={data.length}
              onChange={(page, pageSize) => {
                setCurrentPage(page);
                setPageSize(pageSize);
              }}
              className="custom-pagination"
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardGuru;
