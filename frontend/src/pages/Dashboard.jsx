import React, { useState, useEffect } from "react";
import { Card, Table } from "antd";
import axios from "axios";
import { URL_USER } from "../utils/Endpoint";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5; // Jumlah data per halaman

  // Fetch data dari API
  useEffect(() => {
    // Contoh data statis
    const fetchData = [
      { kultum: "John Doe", puasa: "Puasa", uraian: "Admin", tanggal: "3 Maret 2025" },
      { kultum: "Jane Smith", puasa: "Tidak Puasa", uraian: "User", tanggal: "4 Maret 2025" },
      { kultum: "User 3", puasa: "Puasa", uraian: "User 3", tanggal: "5 Maret 2025" },
      { kultum: "User 4", puasa: "Tidak Puasa", uraian: "User 4", tanggal: "6 Maret 2025" },
      { kultum: "User 5", puasa: "Puasa", uraian: "User 5", tanggal: "7 Maret 2025" },
      { kultum: "User 6", puasa: "Puasa", uraian: "User 6", tanggal: "8 Maret 2025" },
      { kultum: "User 7", puasa: "Puasa", uraian: "User 7", tanggal: "9 Maret 2025" },
      { kultum: "User 8", puasa: "Tidak Puasa", uraian: "User 8", tanggal: "10 Maret 2025" },
      { kultum: "User 9", puasa: "Puasa", uraian: "User 9", tanggal: "11 Maret 2025" },
      { kultum: "User 10", puasa: "Tidak Puasa", uraian: "User 10", tanggal: "12 Maret 2025" },
    ];
    
    setData(fetchData);
  }, []);

  const columns = [
    {
      title: "NO",
      key: "index",
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1, // Nomor otomatis
      width: "5%",
    },
    { title: "Tanggal", dataIndex: "tanggal", key: "tanggal" },
    { title: "Puasa", dataIndex: "puasa", key: "puasa", width: "10%" },
    {
      title: "Uraian Tadarus",
      dataIndex: "uraian",
      key: "uraian",
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
    {
      title: "Catatan Ceramah/Kultum",
      dataIndex: "kultum",
      key: "kultum",
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
      <Card title="Kegiatan" className="shadow-md max-w-screen">
        <div className="overflow-x-auto">
          <Table
            columns={columns}
            dataSource={data}
            pagination={{
              pageSize: pageSize,
              onChange: (page) => setCurrentPage(page),
              className: "custom-pagination",
            }}
            rowKey={(record) => record.tanggal} // Pastikan setiap row memiliki key unik
            
          />
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
