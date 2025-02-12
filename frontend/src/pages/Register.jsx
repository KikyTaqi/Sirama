import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api";

const Register = () => {
  const navigate = useNavigate();
  const [ loading, setLoading ] = useState(false);

  const onFinish = async (values) => {
    try {
      const { data } = await register(values);
      message.success("Registrasi berhasil! Silakan login.");
      navigate("/login") // Redirect setelah register
    } catch (error) {
      message.error("Registrasi gagal! Periksa data Anda.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4 sm:px-6 lg:px-8">
      <div className="bg-[#2A5D50] shadow-lg rounded-lg p-6 sm:p-8 w-full max-w-sm sm:max-w-md lg:max-w-lg">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#FFD700] mb-6">
          Register
        </h2>

        <Form name="register" layout="vertical" onFinish={onFinish}>
          {/* Input Nama */}
          <Form.Item
            label={<span className="text-[#FFD700]">Full Name</span>}
            name="name"
            rules={[
              { required: true, message: "Please input your full name!" },
            ]}
          >
            <Input
              className="py-2 px-3 border !border-[#FFD700] !text-[#FFD700] rounded-md w-full !bg-[#3e947e]"
              placeholder="Enter your full name"
            />
          </Form.Item>

          {/* Input Email */}
          <Form.Item
            label={<span className="text-[#FFD700]">Email</span>}
            name="email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Please enter a valid email!",
              },
            ]}
          >
            <Input
              className="py-2 px-3 border !border-[#FFD700] !text-[#FFD700] rounded-md w-full !bg-[#3e947e]"
              placeholder="Enter your email"
            />
          </Form.Item>

          {/* Input Password */}
          <Form.Item
            label={<span className="text-[#FFD700]">Password</span>}
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              className="py-2 px-3 border !border-[#FFD700] !text-[#FFD700] rounded-md w-full !bg-[#3e947e]"
              placeholder="Enter your password"
            />
          </Form.Item>

          {/* Tombol Register */}
          <Form.Item>
            <Button
              type="default"
              htmlType="submit"
              disabled={loading}
              loading={loading}
              className="w-full border-none text-white hover:!text-white py-2 rounded-md !font-semibold disabled:!bg-[#E5C100] disabled:!text-white"
            >
              Register
            </Button>
          </Form.Item>
        </Form>

        <p className="text-center text-white text-sm">
          Already have an account?{" "}
          <Link to={`/`} className="text-[#FFD700] hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
