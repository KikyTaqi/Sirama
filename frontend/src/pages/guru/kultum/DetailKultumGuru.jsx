import React, { useEffect, useState } from "react";
import { Table, message, Card, Button, ConfigProvider, Pagination } from "antd";
import { IoIosArrowBack } from "react-icons/io";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { URL_KEGIATAN } from "../../../utils/Endpoint";
import dayjs from "dayjs";

const DetailKultumGuru = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const siswa = state?.siswa || {};
  const navigate = useNavigate();

  const [kultumData, setKultumData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    const fetchKultumData = async () => {
      try {
        const response = await axios.get(`${URL_KEGIATAN}/kultum/user/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = response.data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        setKultumData(data);
      } catch (error) {
        message.error("Gagal mengambil data kultum: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchKultumData();
  }, [id]);

  const paginatedData = kultumData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const columns = [
    {
      title: "Tanggal",
      dataIndex: "date",
      key: "date",
      render: (date) => dayjs(date).format("DD MMMM YYYY"),
    },
    {
      title: "Ramadhan ke",
      dataIndex: "ramadhan",
      key: "ramadhan",
    },
    {
      title: "Penceramah",
      dataIndex: "penceramah",
      key: "penceramah",
    },
    {
      title: "Tempat",
      dataIndex: "tempat",
      key: "tempat",
    },
    {
      title: "Ringkasan Kultum",
      dataIndex: "ringkasan",
      key: "ringkasan",
      width: "40%",
      render: (text) => (
        <textarea
          value={text}
          readOnly
          className="w-full h-24 p-2 border border-gray-300 rounded resize-none bg-gray-50"
        />
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
                  <span className="hidden md:block">{`Detail Kultum ${siswa.name} (NIS: ${siswa.nis})`}</span>
                </span>
              </div>
            }
          >
            <div className="max-h-[70vh] max-w-screen overflow-auto">
              <Table
                dataSource={paginatedData}
                columns={columns}
                loading={loading}
                bordered
                rowKey={(record) => record.id}
                scroll={{ x: "max-content" }}
                pagination={false}
              />
            </div>

            <div className="flex justify-end mt-4">
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={kultumData.length}
                onChange={handlePageChange}
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

export default DetailKultumGuru;
