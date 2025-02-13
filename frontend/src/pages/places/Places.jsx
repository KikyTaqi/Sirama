import React, { useEffect, useState } from "react";
import { Table, Button, message, ConfigProvider } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "http://127.0.0.1:8000/api/places";

const Place = () => {
  const [places, setPlaces] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setPlaces(res.data);
    } catch (error) {
      console.error("Error fetching places:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/${id}`);
      message.success("Deleted successfully!");
      fetchPlaces();
    } catch (error) {
      message.error("Error deleting data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ConfigProvider
        theme={{
          components: {
            Button: {
              defaultBg: "#FFD700",
              defaultHoverBg: "#E5C100",
              defaultBorderColor: "#FFD700",
              defaultHoverBorderColor: "#FFD700",
              defaultHoverColor: "#000000",
              colorText: "#FFFFFF",
              colorBgDisabled: "#E5C100",
              colorBorderDisabled: "#E5C100",
              colorTextDisabled: "#999999",
            },
          },
        }}
      >
        <h1>Manage Places</h1>
        <Button
          type="primary"
          onClick={() => navigate("/notifications/create")}
        >
          Add New Place
        </Button>
        <Table
          dataSource={places}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          loading={loading}
        >
          <Table.Column title="Title" dataIndex="title" />
          <Table.Column title="Description" dataIndex="description" />
          <Table.Column
            title="Coordinates"
            render={(record) => `${record.latitude}, ${record.longitude}`}
          />
          <Table.Column
            title="Image"
            dataIndex="image"
            render={(src) =>
              src && (
                <img src={`http://127.0.0.1:8000/images/${src}`} width={50} />
              )
            }
          />
          <Table.Column
            title="Actions"
            render={(record) => (
              <>
                <Button onClick={() => navigate(`/notifications/${record.id}`)}>
                  Edit
                </Button>
                <Button
                  danger
                  type="secondary"
                  className=""
                  onClick={() => handleDelete(record.id)}
                  loading={loading}
                  disabled={loading}
                >
                  Delete
                </Button>
              </>
            )}
          />
        </Table>
      </ConfigProvider>
    </div>
  );
};

export default Place;
