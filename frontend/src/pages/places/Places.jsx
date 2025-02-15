import React, { useEffect, useState } from "react";
import { Table, Button, message, ConfigProvider, Card } from "antd";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { URL_SHOLAT, URL_IMAGES } from "../../utils/Endpoint";

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
      const res = await axios.get(URL_SHOLAT);
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
      await axios.delete(`${URL_SHOLAT}/${id}`);
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
        <Card title="Solat" className="shadow-md max-w-screen">
          <div className="overflow-x-auto">
            <Button
              type="primary"
              onClick={() => navigate("/notifications/create")}
            >
              Add New Place
            </Button>
            <Table
              dataSource={places}
              rowKey="id"
              pagination={{ pageSize: 5, className: "custom-pagination" }}
              loading={loading}
            >
              <Table.Column title="Title" dataIndex="title" />
              <Table.Column title="Description" dataIndex="description" />
              <Table.Column
                title="Coordinates"
                render={(record) => (
                  <iframe
                    width="300"
                    height="200"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps?q=${record.latitude},${record.longitude}&z=15&output=embed`}
                  />
                )}
              />

              <Table.Column
                title="Image"
                dataIndex="image"
                render={(src) =>
                  src && (
                    <img
                      src={`http://127.0.0.1:8000/images/${src}`}
                      width={50}
                    />
                  )
                }
              />
              <Table.Column
                title="Actions"
                width={`11rem`}
                render={(record) => (
                  <>
                    <Button
                      onClick={() => navigate(`/notifications/${record.id}`)}
                      className="me-2 mb-2"
                    >
                      Edit
                    </Button>
                    <Button
                      type="secondary"
                      className="!bg-red-600 hover:!bg-red-500"
                      onClick={() => handleDelete(record.id)}
                      loading={loading}
                      disabled={loading}
                      classNames={`!bg`}
                    >
                      Delete
                    </Button>
                  </>
                )}
              />
            </Table>
          </div>
        </Card>
      </ConfigProvider>
    </div>
  );
};

export default Place;
