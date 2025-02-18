import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  DatePicker,
  message,
  Spin,
  InputNumber,
} from "antd";
import { RiAddCircleFill } from "react-icons/ri";
import axios from "axios";
import dayjs from "dayjs";
import { IoIosArrowBack } from "react-icons/io";

import { URL_KEGIATAN } from "../../utils/Endpoint";

const CreateKultum = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const formData = {
        date: dayjs(values.date).format("YYYY-MM-DD"),
        ramadhan: values.ramadhan,
        penceramah: values.penceramah,
        tempat: values.tempat,
        ringkasan: values.ringkasan,
      };

      await axios.post(
        `${URL_KEGIATAN}/kultum/add`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      navigate("/kegiatan/kultum");
      message.success("Berhasil menyimpan kultum!");
    } catch (error) {
      message.error("Gagal menyimpan kultum!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-4 px-4">
      <div className="bg-[#2A5D50] shadow-lg rounded-lg p-6 w-full max-w-md">
        <div className="flex mb-4">
          <IoIosArrowBack
            className="text-[#FFD700] mt-3 text-xl cursor-pointer"
            onClick={() => {
              navigate(-1);
            }}
          />
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#FFD700] mb-3 w-full capitalize">
            Tambah kultum
          </h2>
        </div>
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            label={
              <span className="text-[#FFD700] font-semibold">Tanggal</span>
            }
            name="date"
            rules={[{ required: true, message: "Pilih tanggal!" }]}
          >
            <DatePicker
              className="w-full !bg-[#4cb399] !border-[#FFD700] !text-[#FFD700] font-semibold"
              format="YYYY-MM-DD"
              placeholder="Pilih tanggal kultum"
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="text-[#FFD700] font-semibold">
                Ramadhan hari ke-
              </span>
            }
            name="ramadhan"
            rules={[{ required: true, message: "Masukkan nomor Ramadhan!" }]}
          >
            <InputNumber
              placeholder="Contoh: 3, 6, 7"
              className="w-full !bg-[#4cb399] !border-[#FFD700] !text-[#FFD700] font-semibold"
              style={{ width: '100%', color: '#FFD700' }}
              min={1}
              max={30}
              // controls={false} // Ini biar tombol up/down di samping ilang, opsional
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="text-[#FFD700] font-semibold">Penceramah</span>
            }
            name="penceramah"
            rules={[{ required: true, message: "Masukkan nama penceramah!" }]}
          >
            <Input
              placeholder="Contoh: Ust. Abdul Somad, Ustadz Adi Hidayat"
              className="w-full !bg-[#4cb399] !border-[#FFD700] !text-[#FFD700] font-semibold"
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-[#FFD700] font-semibold">Tempat</span>}
            name="tempat"
            rules={[{ required: true, message: "Masukkan tempat!" }]}
          >
            <Input
              placeholder="Contoh: Masjid Al-Falah, Sekolah, Youtube, TV"
              className="w-full !bg-[#4cb399] !border-[#FFD700] !text-[#FFD700] font-semibold"
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="text-[#FFD700] font-semibold">Ringkasan</span>
            }
            name="ringkasan"
            rules={[{ required: true, message: "Masukkan ringkasan!" }]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Tulis ringkasan kultum, misal: Tema kultum tentang keutamaan sedekah..."
              className="w-full !bg-[#4cb399] !border-[#FFD700] !text-[#FFD700] font-semibold !resize-none"
            />
          </Form.Item>

          <div className="flex justify-end">
            <Button
              type="secondary"
              htmlType="submit"
              loading={loading}
              className="!bg-amber-400 !font-semibold !text-[#2A5D50]"
              icon={<RiAddCircleFill />}
            >
              Tambah
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default CreateKultum;
