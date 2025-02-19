import React, { useState, useEffect, useRef } from "react";
import { Drawer, Button, message, Skeleton, Avatar } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../api";
import Typed from "typed.js";

import { MenuOutlined, UserOutlined } from "@ant-design/icons";
import { TbArrowBadgeDown } from "react-icons/tb";
import { HiOutlineLogin, HiOutlineLogout } from "react-icons/hi";
import { useUser } from "../components/UserContext";

import {
  FaPersonPraying,
  FaHouse,
  FaBookQuran,
  FaNoteSticky,
} from "react-icons/fa6";

const Header = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loadingUser, fetchUser } = useUser();
  const el = useRef(null);

  useEffect(() => {
    const typed = new Typed(el.current, {
      strings: ["Sirama", "Selamat", "menunaikan", "ibadah", "puasa."],
      typeSpeed: 100,
      loop: true,
    });

    return () => {
      // Destroy Typed instance during cleanup to stop animation
      typed.destroy();
    };
  }, []);

  const menuItems = [
    {
      name: "Dashboard",
      icon: <FaHouse />,
      path: "/dashboard",
    },
    {
      name: "Catatan Solat",
      icon: <FaPersonPraying />,
      path: "/solat",
    },
    // {
    //   name: "Tadarus",
    //   icon: <FaBookQuran/>,
    //   path: "/tadarus",
    // },
    {
      name: "Kultum",
      icon: <FaBookQuran />,
      path: "/kegiatan/kultum",
    },
    {
      name: "Logout",
      icon: <HiOutlineLogout className="text-xl" />,
      path: "#",
      logout: true,
    },
  ];

  const handleLogout = async () => {
    // console.log("oioioi");

    try {
      await logout(); // Logout API
      localStorage.removeItem("token"); // Hapus token
      message.success("Berhasil Logout.");
      fetchUser();
      navigate("/"); // Redirect ke halaman login
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="p-2 text-xl font-bold bg-[#1E3A34] text-[#FFD700]">
      <div className="px-7 flex justify-between items-center">
        <div className="flex items-center">
          <div className="flex">
            <img src="/smk.png" alt="logo" className="max-h-12 py-1 me-2" />
            <img src="/ketupat.gif" alt="ketupat" className="max-h-12" />
          </div>
          <span ref={el} />
        </div>
        <Button
          type="primary"
          icon={<MenuOutlined />}
          onClick={() => setOpen(true)}
          style={{
            backgroundColor: "#FFD700",
            borderColor: "#FFD700",
            color: "#1E3A34",
          }}
        >
          Menu
        </Button>
      </div>

      <Drawer
        placement="right"
        closable={false}
        onClose={() => setOpen(false)}
        open={open}
        width={280}
        style={{ backgroundColor: "#2A5D50" }}
      >
        {/* Profile User */}
        <div className="w-full">
          <div className="flex items-center space-x-4 p-2 mb-5">
            <div className="">
              <Avatar
                style={{
                  backgroundColor: "#87d068",
                }}
                icon={<UserOutlined />}
                size={50}
              />
            </div>
            <div>
              <h4 className="font-semibold text-lg text-[#FFD700] capitalize">
                {loadingUser ? (
                  <Skeleton.Input active size="small" />
                ) : (
                  user?.name || "Belum Login"
                )}
              </h4>
              <span className="text-sm tracking-wide flex items-center space-x-1">
                <TbArrowBadgeDown className="text-green-600 text-2xl" />
                {loadingUser ? (
                  <Skeleton.Input active size="small" className="py-2" />
                ) : (
                  <span className="text-[#FFD700] uppercase">
                    {user?.kelas}
                  </span>
                )}
              </span>
            </div>
          </div>
          <ul className="space-y-2 text-sm">
            {!user ? (
              <li
                key={1}
                className="rounded-md"
                style={{
                  backgroundColor: "#FFD700",
                  color: "#1E3A34",
                }}
                onClick={() => {
                  setOpen(false);
                }}
              >
                <Link
                  to={`/`}
                  className="flex items-center space-x-3 p-2 rounded-md font-medium"
                  style={{
                    backgroundColor: "#FFD700",
                    color: "#1E3A34",
                  }}
                >
                  <span>
                    <HiOutlineLogin className="text-xl" />
                  </span>
                  <span>Login</span>
                </Link>
              </li>
            ) : (
              <>
                {menuItems.map((item, index) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <li
                      key={index}
                      className="rounded-md"
                      onClick={() => {
                        setOpen(false);
                      }}
                      style={{
                        backgroundColor: isActive ? "#FFD700" : "transparent",
                        color: isActive ? "#1E3A34" : "#FFD700",
                      }}
                    >
                      <Link
                        to={item.path}
                        onClick={
                          item.logout === true ? handleLogout : undefined
                        }
                        className="flex items-center space-x-3 p-2 rounded-md font-medium"
                        style={{
                          backgroundColor: isActive ? "#FFD700" : "transparent",
                          color: isActive ? "#1E3A34" : "#FFD700",
                        }}
                      >
                        <span>{item.icon}</span>
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </>
            )}
          </ul>
        </div>
      </Drawer>
    </header>
  );
};

export default Header;
