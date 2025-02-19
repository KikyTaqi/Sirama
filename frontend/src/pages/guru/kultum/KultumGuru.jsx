import React, { useState, useEffect } from "react";
import {
  List,
  Skeleton,
  ConfigProvider,
  message,
  Card,
  Input,
  Avatar,
  Pagination,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { URL_USER } from "../../../utils/Endpoint";
import { useUser } from "../../../components/UserContext";

const { Search } = Input;

const Guru = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // Untuk data hasil search
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const navigate = useNavigate();
  const pageSize = 5; // Data per halaman

  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      try {
        const siswaResponse = await axios.get(`${URL_USER}/siswa-by-kelas`, {
          params: { kelas: user?.kelas },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const sortedData = siswaResponse.data.sort((a, b) =>
          a.name.localeCompare(b.name)
        );

        setData(sortedData);
        setFilteredData(sortedData);
      } catch (error) {
        message.error("Gagal mengambil data siswa: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleSearch = (value) => {
    setLoading(true);

    setTimeout(() => {
      const filtered = data.filter(
        (item) =>
          item.name.toLowerCase().includes(value.toLowerCase()) ||
          item.nis.toLowerCase().includes(value.toLowerCase())
      );

      setFilteredData(filtered);
      setCurrentPage(1); // Reset ke halaman pertama saat pencarian
      setLoading(false);
    }, 500);
  };

  // Data yang ditampilkan berdasarkan halaman
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <ConfigProvider
      theme={{
        components: {
          Button: {
            colorPrimary: "#FFD700",
            colorPrimaryHover: "#fce45d",
            colorTextLightSolid: "#1E3A34",
          },
          Card: {
            headerBg: "#1E3A34",
            colorTextHeading: "#FFD700",
          },
          Input: {
            colorPrimary: "#FFD700",
            colorPrimaryHover: "#fce45d",
            colorTextLightSolid: "#1E3A34",
          },
        },
      }}
    >
      <div className="flex justify-center items-center p-4">
        <div className="w-full lg:max-w-4xl">
          <Card title={`Absen Solat Siswa`}>
            <Search
              placeholder="Cari nama atau NIS"
              allowClear
              onSearch={handleSearch}
              className="w-full mb-3"
            />
            <List
              className="max-h-[70vh]"
              loading={loading}
              itemLayout="horizontal"
              dataSource={paginatedData}
              renderItem={(item) => (
                <List.Item
                  key={item.id}
                  onClick={() =>
                    navigate(`/kegiatan/kultum/detail/${item.id}`, {
                      state: { siswa: item },
                    })
                  }
                  style={{ cursor: "pointer" }}
                  className="hover:bg-gray-100"
                >
                  <Skeleton avatar title={false} loading={loading} active>
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          icon={<UserOutlined />}
                          src={item.avatar || "https://via.placeholder.com/40"}
                        />
                      }
                      title={
                        <span className="text-base font-semibold hover:text-blue-700 capitalize">
                          {item.name}
                        </span>
                      }
                      description={`NIS: ${item.nis}`}
                    />
                    <div
                      style={{
                        color: "#FFD700",
                        cursor: "pointer",
                        fontWeight: 500,
                      }}
                    >
                      Detail
                    </div>
                  </Skeleton>
                </List.Item>
              )}
            />

            {/* Pagination */}
            <div className="flex justify-end mt-4">
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={filteredData.length}
                onChange={(page) => setCurrentPage(page)}
                showSizeChanger={false}
                className="custom-pagination"
              />
            </div>
          </Card>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default Guru;
