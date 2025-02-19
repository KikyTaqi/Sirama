import React, { useEffect, useRef, useState } from "react";
import {
  Table,
  message,
  Card,
  Image,
  Tag,
  Button,
  ConfigProvider,
  DatePicker,
  Space,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { IoIosArrowBack } from "react-icons/io";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASEURL, URL_STORAGE } from "../../../utils/Endpoint";
import dayjs from "dayjs";

const DetailSolatGuru = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const siswa = state?.siswa || {};
  const navigate = useNavigate();

  const [solatData, setSolatData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  const searchInput = useRef(null);

  useEffect(() => {
    const fetchSolatData = async () => {
      try {
        const response = await axios.get(`${BASEURL}/prayer-records/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const solat = response.data
          .filter((solat) => solat.user_id === Number(id))
          .sort((a, b) => new Date(b.date) - new Date(a.date));

        setSolatData(solat);
      } catch (error) {
        message.error("Gagal mengambil data solat: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSolatData();
  }, [id]);

  // Fungsi Search Antd Filter Dropdown
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex, placeholder) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <ConfigProvider
        theme={{
          components: {
            DatePicker: {
              colorPrimary: "#FFD700",
            },
            Button: {
              colorPrimary: "#FFD700",
              colorPrimaryHover: "#fce45d",
              colorTextLightSolid: "#1E3A34",
            },
          },
        }}
      >
        <div style={{ padding: 8 }}>
          <DatePicker
            value={selectedKeys[0] ? dayjs(selectedKeys[0]) : null}
            onChange={(date, dateString) =>
              setSelectedKeys(dateString ? [dateString] : [])
            }
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
        className="!text-amber-300 !font-bold text-base px-2"
        style={{ color: filtered ? "#FFD700" : undefined }}
      />
    ),
    onFilter: (value, record) => record[dataIndex]?.includes(value),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.focus(), 100);
      }
    },
  });

  const columns = [
    {
      title: "Tanggal",
      dataIndex: "date",
      key: "date",
      ...getColumnSearchProps("date", "Tanggal"),
    },
    ...["subuh", "dzuhur", "asar", "maghrib", "isya"].flatMap((waktu) => [
      {
        title: `Status solat ${waktu.charAt(0).toUpperCase() + waktu.slice(1)}`,
        dataIndex: `${waktu}_status`,
        key: `${waktu}_status`,
        className: "capitalize text-center",
        render: (status) => {
          let color = "";
          let text = "";

          switch (status) {
            case "iya":
              color = "green";
              text = "Sudah Solat";
              break;
            case "tidak":
              color = "red";
              text = "Tidak Solat";
              break;
            default:
              color = "default";
              text = "Belum Solat";
          }
          return (
            <Tag className="!text-base" color={color}>
              {text}
            </Tag>
          );
        },
      },
      {
        title: `Foto solat ${waktu}`,
        dataIndex: `${waktu}_image`,
        className: "capitalize",
        key: `${waktu}_image`,
        render: (src) =>
          src ? (
            <Image
              loading="lazy"
              src={`${URL_STORAGE}/${src}`}
              alt={`${waktu} image`}
              style={{ width: "150px" }}
            />
          ) : (
            "-"
          ),
      },
      {
        title: `Alasan tidak solat ${waktu}`,
        dataIndex: `${waktu}_reason`,
        className: "capitalize",
        key: `${waktu}_reason`,
      },
      {
        title: `Lokasi solat ${waktu} `,
        key: `${waktu}_lokasi`,
        className: "capitalize",
        render: (record) =>
          record[`${waktu}_latitude`] && record[`${waktu}_longitude`] ? (
            <iframe
              width="150"
              height="100"
              style={{ border: 0 }}
              src={`https://www.google.com/maps?q=${
                record[`${waktu}_latitude`]
              },${record[`${waktu}_longitude`]}&hl=es;z=14&output=embed`}
              allowFullScreen
            ></iframe>
          ) : (
            "-"
          ),
      },
      {
        title: `Jam solat ${waktu}`,
        dataIndex: `${waktu}_time`,
        className: "capitalize text-center",
        key: `${waktu}_time`,
      },
    ]),
    {
      title: "Status solat terawih",
      dataIndex: "tarawih_status",
      key: "tarawih_status",
      className: "capitalize text-center",
      render: (status) => {
        let color = "";
        let text = "";

        switch (status) {
          case "iya":
            color = "green";
            text = "Sudah Solat";
            break;
          case "tidak":
            color = "red";
            text = "Tidak Solat";
            break;
          default:
            color = "default";
            text = "Belum Solat";
        }
        return (
          <Tag className="!text-base" color={color}>
            {text}
          </Tag>
        );
      },
    },
    {
      title: "Jam solat Tarawih",
      dataIndex: "tarawih_time",
      className: "capitalize text-center",
      key: "tarawih_time",
    },
    {
      title: "alasan tidak solat Tarawih",
      dataIndex: "tarawih_reason",
      className: "capitalize",
      key: "tarawih_reason",
    },
    {
      title: "Lokasi Tarawih",
      className: "capitalize",
      key: "tarawih_lokasi",
      render: (record) =>
        record.tarawih_latitude && record.tarawih_longitude ? (
          <iframe
            width="150"
            height="100"
            loading="lazy"
            style={{ border: 0 }}
            src={`https://www.google.com/maps?q=${record.tarawih_latitude},${record.tarawih_longitude}&hl=es;z=14&output=embed`}
            allowFullScreen
          ></iframe>
        ) : (
          "-"
        ),
    },
    {
      title: "Foto Solat Tarawih",
      dataIndex: "tarawih_image",
      key: "tarawih_image",
      render: (src) =>
        src ? (
          <Image
            loading="lazy"
            src={`${URL_STORAGE}/${src}`}
            alt="tarawih image"
            style={{ width: "200px" }}
          />
        ) : (
          "-"
        ),
    },
  ];

  return (
    <ConfigProvider
      theme={{
        components: {
          Card: {
            headerBg: "#1E3A34",
            colorTextHeading: "#FFD700",
          },
        },
      }}
    >
      <div className="flex justify-center items-center p-4">
        <div className="w-full lg:max-w-4xl">
          <Card
            title={
              <div className="flex items-center flex-wrap">
                <Button
                  onClick={() => navigate(-1)}
                  type="secondary"
                  icon={<IoIosArrowBack />}
                  className="!bg-amber-400 !font-semibold !text-[#2A5D50] cursor-pointer me-5"
                >
                  Kembali
                </Button>
                <span className="text-sm md:text-base">
                  <span className="block md:hidden capitalize">
                    {siswa.name}
                  </span>
                  <span className="hidden md:block">{`Detail Solat ${siswa.name} (NIS: ${siswa.nis})`}</span>
                </span>
              </div>
            }
          >
            <Table
              dataSource={solatData}
              columns={columns}
              loading={loading}
              bordered
              rowKey={(record) => record.id}
              scroll={{ x: "max-content" }}
              pagination={{ className: "custom-pagination" }}
            />
          </Card>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default DetailSolatGuru;
