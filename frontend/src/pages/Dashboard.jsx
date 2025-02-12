import React, { useState, useEffect } from "react";
import { Card, Table } from "antd";
import axios from "axios";
import { URL_USER } from "../utils/Endpoint";

const Dashboard = () => {
  const columns = [
    { title: "Nama", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Role", dataIndex: "role", key: "role" },
    { title: "Role", dataIndex: "role", key: "role" },
    { title: "Role", dataIndex: "role", key: "role" },
    { title: "Role", dataIndex: "role", key: "role" },
    { title: "Role", dataIndex: "role", key: "role" },
  ];

  const data = [
    { key: "1", name: "John Doe", email: "john@example.com", role: "Admin" },
    { key: "2", name: "Jane Smith", email: "jane@example.com", role: "User" },
    {
      key: "3",
      name: "Michael Lee",
      email: "michael@example.com",
      role: "Editor",
    },
  ];

  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const { data } = await axios.get(URL_USER, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(data);
      } catch (error) {
        console.error("Gagal mendapatkan info user", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="">
      <Card title="User Data" className="shadow-md max-w-screen">
        <div className="overflow-x-auto">
          <Table columns={columns} dataSource={data} pagination={false} />
        </div>
      </Card>

      <div>
        {user ? <p>Halo, {user.name}! {user.email}</p> : <p>Loading...</p>}
      </div>
    </div>
  );
};

export default Dashboard;
