import { useState, useEffect } from "react";
import { Input, Button, Form, Alert, ConfigProvider, message } from "antd";
import axios from 'axios';
import { URL_USER } from "../utils/Endpoint"; 
import { useNavigate } from "react-router-dom";
import { useUser } from "../components/UserContext";

function ChangePassword() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState("");
    const [profile, setProfile] = useState({});
    const navigate = useNavigate();

    const { user } = useUser();

    const handleSubmit = (values) => {
        setLoading(true);
        let id = user?.id;
        let data = {
            id: id,
            password: values.password,
            newPassword: values.newPassword,
            confirmPassword: values.confirmPassword
        };

        axios
            .post(`${URL_USER}/password/change`, data,{
                headers: {
                  "Content-Type": "multipart/form-data",
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              })
            .then(() => {
                setLoading(false);
                navigate(`/dashboard`);
                message.success("Password berhasil diubah!");
            })
            .catch((err) => {
                console.error("Error:", err);
                setLoading(false);
                const errors = err.response.data.errors;
                if (err.response.status === 422) {
                    // Tangkap error validasi dari Laravel
            
                    // Cek jika ada error di masing-masing field dan tampilkan pesan error
                    if (errors.id) {
                      message.error("ID diperlukan!");
                    }
                    if (errors.confirmPassword) {
                      message.error("Password tidak sama!");
                    }
                    if (errors.newPassword) {
                      message.error("Password harus minimal 6 karakter!");
                    }
                }
                else if (err.response.status === 400) {
                    // Cek jika ada error di masing-masing field dan tampilkan pesan error
                    if (err.response.data.message) {
                      message.error("Password salah!");
                    }
                }
            });
    };

    return (
        <>
            <div className="bg-[#2A5D50] border p-4 border-[#F2E8C6] rounded-md shadow-md max-w-lg mx-auto">
                <div className="rounded-md text-center p-2 text-black mb-4">
                    <h1 className="font-bold text-2xl text-[#FFD700]">Ubah Password</h1>
                </div>
                <Form
                    form={form}
                    onFinish={handleSubmit}
                    autoComplete="off"
                    layout="vertical"
                >
                    <Form.Item
                        name="password"
                        label={<span className="text-[#FFD700]">Password Saat Ini</span>}
                        rules={[{ required: true, message: "Masukkan password saat ini!" }]}
                    >
                        <Input.Password className="py-2 px-3 border !border-[#FFD700] !text-[#FFD700] rounded-md w-full !bg-[#4cb399]" placeholder="Masukkan password saat ini" size="large" />
                    </Form.Item>

                    <Form.Item
                        name="newPassword"
                        label={<span className="text-[#FFD700]">Password Baru</span>}
                        rules={[{ required: true, message: "Masukkan password baru!" }]}
                    >
                        <Input.Password className="py-2 px-3 border !border-[#FFD700] !text-[#FFD700] rounded-md w-full !bg-[#4cb399]" placeholder="Masukkan password baru" size="large" />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        label={<span className="text-[#FFD700]">Konfirmasi Password Baru</span>}
                        dependencies={["newPassword"]}
                        rules={[
                            { required: true, message: "Konfirmasi password baru!" },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue("newPassword") === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error("Password tidak sama!"));
                                },
                            }),
                        ]}
                    >
                        <Input.Password className="py-2 px-3 border !border-[#FFD700] !text-[#FFD700] rounded-md w-full !bg-[#4cb399]" placeholder="Konfirmasi password baru" size="large" />
                    </Form.Item>

                    <Form.Item className="mb-0">
                        <Button
                            type="secondary"
                            htmlType="submit"
                            block
                            loading={loading}
                            size="large"
                            className="w-full border-none !text-[#2A5D50] hover:!text-green-700 !bg-amber-300 hover:!bg-amber-200 py-2 rounded-md !font-semibold disabled:!bg-[#E5C100] disabled:!text-white"
                        >
                            Simpan Password Baru
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </>
    );
}

export default ChangePassword;
