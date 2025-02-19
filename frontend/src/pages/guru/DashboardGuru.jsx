import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  message,
  Table,
  Pagination,
  Tag,
  Input,
  Space,
  Button,
  ConfigProvider,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import { URL_USER, BASEURL } from "../../utils/Endpoint";
import { useUser } from "../../components/UserContext";

const DashboardGuru = () => {
  const [siswa, setSiswa] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [currentTime, setCurrentTime] = useState(new Date());
  const searchInput = useRef(null);
  const today = new Date();
  const todayLocal =
    today.getFullYear() +
    "-" +
    String(today.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(today.getDate()).padStart(2, "0");

  const { user } = useUser();

  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const siswaResponse = await axios.get(`${URL_USER}/siswa-by-kelas`, {
          params: { kelas: user?.kelas },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const solatResponse = await axios.get(`${BASEURL}/solat-kelas`, {
          params: { kelas: user?.kelas },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const kultumResponse = await axios.get(`${BASEURL}/kultum-kelas`, {
          params: { kelas: user?.kelas },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const kegiatanResponse = await axios.get(
          `${BASEURL}/kegiatan/kegiatan-kelas`,
          {
            params: { kelas: user?.kelas },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const solatHariIni = solatResponse.data.filter(
          (solat) => solat.date === todayLocal
        );
        const kultumHariIni = kultumResponse.data.filter(
          (kultum) => kultum.date === todayLocal
        );
        const kegiatanHariIni = kegiatanResponse.data.filter(
          (kegiatan) => kegiatan.date === todayLocal
        );

        const siswaWithData = siswaResponse.data.map((siswaItem) => {
          const solatItem = solatHariIni.find(
            (solat) => solat.user_id === siswaItem.id
          );
          const kultumItems = kultumHariIni.filter(
            (kultum) => kultum.user_id === siswaItem.id
          );
          const kegiatanItem = kegiatanHariIni.find(
            (kegiatan) => kegiatan.user_id === siswaItem.id
          );

          return {
            ...siswaItem,
            solat: solatItem || {},
            kultum: kultumItems,
            puasa: kegiatanItem?.puasa || "Belum Mengisi", // Pakai "-" kalau datanya ga ada
            tadarus: kegiatanItem?.tadarus || "-", // Pastikan ini ada di API kegiatan
          };
        });

        setSiswa(siswaWithData);
        console.log(siswaWithData);
      } catch (error) {
        message.error("Gagal mengambil data: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <ConfigProvider
        theme={{
          // token:{
          //   colorPrimary: ""
          // },
          components:{
            Input:{
              colorPrimary: '#FFD700'
            },
            Button:{
              colorPrimary: '#FFD700',
              colorPrimaryHover: '#fce45d',
              colorTextLightSolid: '#1E3A34',
            }
          }
        }}
      >
        <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
          <Input
            ref={searchInput}
            placeholder={`Cari ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{ marginBottom: 8, display: "block" }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
              icon={<SearchOutlined />}
              size="small"
            >
              Cari
            </Button>
            <Button
              onClick={() => clearFilters && handleReset(clearFilters)}
              size="small"
            >
              Reset
            </Button>
            <Button type="link" size="small" onClick={() => close()}>
              Tutup
            </Button>
          </Space>
        </div>
      </ConfigProvider>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        className="!text-amber-300 me-2 !font-bold"
        style={{ color: filtered ? "#" : undefined }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    },
  });

  const columns = [
    {
      title: "Nama Siswa",
      dataIndex: "name",
      key: "name",
      width: "100%",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Puasa",
      dataIndex: "puasa",
      key: "puasa",
      className: 'text-center',
      render: (text) => (
        <Tag
          color={text === "iya" ? "green" : text === "tidak" ? "red" : "gray"}
          className="capitalize !text-base"
        >
          {text || "Belum mengisi"}
        </Tag>
      ),
      ...getColumnSearchProps("puasa"),
    },
    {
      title: "Solat",
      dataIndex: "solat",
      key: "solat_status",
      render: (solat) => {
        const prayers = [
          { key: "subuh_status", label: "Subuh" },
          { key: "dzuhur_status", label: "Dzuhur" },
          { key: "asar_status", label: "Asar" },
          { key: "maghrib_status", label: "Maghrib" },
          { key: "isya_status", label: "Isya" },
        ];

        return (
          <div className="flex flex-wrap gap-1">
            {prayers.map((prayer) => (
              <Tag
                key={prayer.key}
                className="!text-sm"
                color={
                  solat[prayer.key] === "iya"
                    ? "green"
                    : solat[prayer.key] === "tidak"
                    ? "red"
                    : "gray"
                }
              >
                {prayer.label}:{" "}
                {solat[prayer.key] === "iya"
                  ? "Sudah Solat"
                  : solat[prayer.key] === "tidak"
                  ? "Tidak Solat"
                  : "Belum Solat"}
              </Tag>
            ))}
          </div>
        );
      },
    },
    {
      title: "Uraian Tadarus",
      dataIndex: "tadarus",
      key: "tadarus",
    },
    {
      title: "Catatan Ceramah/Kultum",
      key: "kultum",
      render: (_, record) => {
        if (record.kultum.length === 0) return "-";
        return record.kultum.map((item) => item.ringkasan).join(", ");
      },
    },
  ];

  const paginatedData = siswa.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

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
        <ConfigProvider
          theme={{
            components: {
              Card: {
                colorTextHeading: "#1E3A34",
              },
            },
          }}
        >
          <Card
            title="Kegiatan Siswa Hari ini."
            className="shadow-md max-w-screen"
          >
            <div className="overflow-x-auto">
              <Table
                columns={columns}
                dataSource={paginatedData}
                loading={loading}
                pagination={false}
                rowKey={(record) => record.id}
              />
            </div>
            <div className="mt-4 flex justify-end">
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={siswa.length}
                onChange={(page, pageSize) => {
                  setCurrentPage(page);
                  setPageSize(pageSize);
                }}
                className="custom-pagination"
              />
            </div>
          </Card>
        </ConfigProvider>
      </div>
    </div>
  );
};

export default DashboardGuru;
