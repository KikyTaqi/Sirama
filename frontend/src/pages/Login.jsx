import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { login, logout } from "../api";
import { useUser } from '../components/UserContext'

const Login = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [ loading, setLoading ] = useState(false);
  const { user, fetchUser } = useUser();

  const onFinish = async (values) => {
    setLoading(true)

    try {
      const { data } = await login(values);
      localStorage.setItem("token", data.token);
      message.success("Login berhasil!");
      await fetchUser();
      // if(user.role == "siswa") navigate("/dashboard");
      // else if(user.role == "guru") navigate("/guru/dashboard");
      // else if(user.role == "admin") navigate("/admin/dashboard");
      navigate("/dashboard"); // Redirect setelah login
    } catch (error) {
      message.error("Login gagal! Periksa email dan password.");
    } finally {
        setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const messageCoba = () => {
    message.success("config");
    logout();
  };

  return (
      <div className="flex justify-center items-center py-14 px-4 sm:px-6 lg:px-8">
        <div className="bg-[#2A5D50] shadow-lg rounded-lg p-6 sm:p-8 w-full max-w-sm sm:max-w-md lg:max-w-lg">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#FFD700] mb-6">
            Login
          </h2>

          <Form
            name="login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            layout="vertical"
          >
            <Form.Item
              label={<span className="text-[#FFD700]">NIS/NIP</span>}
              name="nis"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <Input
                className="py-2 px-3 border !border-[#FFD700] !text-[#FFD700] rounded-md w-full !bg-[#4cb399]"
                placeholder="Masukan NIS/NIP"
              />
            </Form.Item>

            <Form.Item
              label={<span className="text-[#FFD700]">Password</span>}
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password
                className="py-2 px-3 border !border-[#FFD700] !text-[#FFD700] rounded-md w-full !bg-[#4cb399]"
                placeholder="Masukan password"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="secondary"
                htmlType="submit"
                loading={loading}
                disabled={loading}
                className="w-full border-none !text-[#2A5D50] hover:!text-green-700 !bg-amber-300 hover:!bg-amber-200 py-2 rounded-md !font-semibold disabled:!bg-[#E5C100] disabled:!text-white"
              >
                Login
              </Button>
            </Form.Item>
          </Form>

          <p className="text-center text-white text-sm">
            Don't have an account?{" "}
            <Link to={`/register`} className="text-[#FFD700] hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
  );
};

export default Login;

// bg #FFD700
// hover #E5C100