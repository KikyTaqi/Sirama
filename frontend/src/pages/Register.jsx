import React, { useState } from "react";
import { Form, Input, Button, message, Select } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const { data } = await register(values); // Panggil API untuk registrasi
      message.success("Registrasi berhasil! Silakan login.");
      navigate("/"); // Redirect setelah register
    } catch (error) {
      if (error.response) {
        // Tangani error berdasarkan status kode
        if (error.response.status === 422) {
          // Tangkap error validasi dari Laravel
          const errors = error.response.data.errors;
  
          // Cek jika ada error di masing-masing field dan tampilkan pesan error
          if (errors.nis) {
            message.error("NIS sudah digunakan!");
          }
          if (errors.name) {
            message.error("Nama harus diisi!");
          }
          if (errors.kelas) {
            message.error("Kelas harus diisi!");
          }
          if (errors.password) {
            message.error("Password harus minimal 6 karakter!");
          }
  
          // Kamu juga bisa menggunakan loop untuk menampilkan semua error field
          // Object.keys(errors).forEach((field) => {
          //   message.error(errors[field].join(', ')); // Menampilkan semua error terkait field
          // });
        } else if (error.response.status === 500) {
          // Error server
          message.error("Server error!");
        } else {
          // Tangani error lain (misalnya network error)
          message.error("Terjadi kesalahan, coba lagi!");
        }
      } else {
        message.error("Terjadi kesalahan, coba lagi!");
      }
    } finally {
      setLoading(false); // Hentikan loading setelah error atau sukses
    }
  };
  

  return (
    <div className="flex justify-center items-center py-14 px-4 sm:px-6 lg:px-8">
      <div className="bg-[#2A5D50] shadow-lg rounded-lg p-6 sm:p-8 w-full max-w-sm sm:max-w-md lg:max-w-lg">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#FFD700] mb-6">
          Register
        </h2>

        <Form name="register" layout="vertical" onFinish={onFinish}>
          {/* Input Nama */}
          <Form.Item
            label={<span className="text-[#FFD700]">NIS</span>}
            name="nis"
            rules={[{ required: true, message: "Mohon masukan NIS!" }]}
          >
            <Input
              className="py-2 px-3 border !border-[#FFD700] !text-[#FFD700] rounded-md w-full !bg-[#4cb399]"
              placeholder="Masukan NIS"
            />
          </Form.Item>
          <Form.Item
            label={<span className="text-[#FFD700]">Nama Lengkap</span>}
            name="name"
            rules={[{ required: true, message: "Mohon masukan nama lengkap!" }]}
          >
            <Input
              className="py-2 px-3 border !border-[#FFD700] !text-[#FFD700] rounded-md w-full !bg-[#4cb399]"
              placeholder="Masukan nama lengkap"
            />
          </Form.Item>

          {/* Input Email */}
          <Form.Item
            label={<span className="text-[#FFD700]">Kelas</span>}
            name="kelas"
            rules={[
              {
                required: true,
                message: "Mohon masukan kelas!",
              },
            ]}
          >
            <Select
              showSearch
              mode="combobox"
              placeholder="Pilih kelas!"
              className="py-2 px-3 border !border-[#FFD700] !text-[#FFD700] rounded-md w-full !bg-[#4cb399]"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option?.children?.toLowerCase().includes(input.toLowerCase())
              }
            >
              <Select.Option value="X TO 1">X TO 1</Select.Option>
              <Select.Option value="X TO 2">X TO 2</Select.Option>
              <Select.Option value="X TO 3">X TO 3</Select.Option>
              <Select.Option value="X TJKT 1">X TJKT 1</Select.Option>
              <Select.Option value="X TJKT 2">X TJKT 2</Select.Option>
              <Select.Option value="X TJKT 3">X TJKT 3</Select.Option>
              <Select.Option value="X PPLG 1">X PPLG 1</Select.Option>
              <Select.Option value="X PPLG 2">X PPLG 2</Select.Option>
              <Select.Option value="X PPLG 3">X PPLG 3</Select.Option>
              <Select.Option value="X TE 1">X TE 1</Select.Option>
              <Select.Option value="X TE 2">X TE 2</Select.Option>
              <Select.Option value="X TE 3">X TE 3</Select.Option>
              <Select.Option value="X TKI 1">X TKI 1</Select.Option>
              <Select.Option value="X TKI 2">X TKI 2</Select.Option>
              <Select.Option value="XI TO 1">XI TO 1</Select.Option>
              <Select.Option value="XI TO 2">XI TO 2</Select.Option>
              <Select.Option value="XI TO 3">XI TO 3</Select.Option>
              <Select.Option value="XI TJKT 1">XI TJKT 1</Select.Option>
              <Select.Option value="XI TJKT 2">XI TJKT 2</Select.Option>
              <Select.Option value="XI TJKT 3">XI TJKT 3</Select.Option>
              <Select.Option value="XI PG 1">XI PG 1</Select.Option>
              <Select.Option value="XI RPL 1">XI RPL 1</Select.Option>
              <Select.Option value="XI RPL 2">XI RPL 2</Select.Option>
              <Select.Option value="XI TE 1">XI TE 1</Select.Option>
              <Select.Option value="XI TE 2">XI TE 2</Select.Option>
              <Select.Option value="XI TE 3">XI TE 3</Select.Option>
              <Select.Option value="XI TKI 1">XI TKI 1</Select.Option>
              <Select.Option value="XI TKI 2">XI TKI 2</Select.Option>
            </Select>
          </Form.Item>

          {/* Input Password */}
          <Form.Item
            label={<span className="text-[#FFD700]">Password</span>}
            name="password"
            rules={[{ required: true, message: "Mohon masukan password!" }]}
          >
            <Input.Password
              className="py-2 px-3 border !border-[#FFD700] !text-[#FFD700] rounded-md w-full !bg-[#4cb399]"
              placeholder="Enter your password"
            />
          </Form.Item>

          {/* Tombol Register */}
          <Form.Item>
            <Button
              type="secondary"
              htmlType="submit"
              disabled={loading}
              loading={loading}
              className="w-full border-none !text-[#2A5D50] hover:!text-green-700 !bg-amber-300 hover:!bg-amber-200 py-2 rounded-md !font-semibold disabled:!bg-[#E5C100] disabled:!text-white"
            >
              Register
            </Button>
          </Form.Item>
        </Form>

        <p className="text-center text-white text-sm">
          Sudah punya akun?{" "}
          <Link to={`/`} className="text-[#FFD700] hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
