import React, { useState, useEffect, useRef } from "react";
import { Drawer, Button, message, Skeleton } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../api";
import Typed from "typed.js";

import { MenuOutlined } from "@ant-design/icons";
import { TbArrowBadgeDown } from "react-icons/tb";
import { HiOutlineLogin } from "react-icons/hi";
import { useUser } from '../components/UserContext'

const Header = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading, fetchUser } = useUser();
  const el = useRef(null);


  useEffect(() => {
    const typed = new Typed(el.current, {
      strings: ['Sirama', 'Selamat', 'menunaikan','ibadah',' puasa.'],
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
      icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
      path: "/dashboard",
    },
    {
      name: "Notifications",
      icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
      path: "/notifications",
    },
    {
      name: "Messages",
      icon: "M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z",
      path: "/messages",
    },
    {
      name: "Profile",
      icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
      path: "/profile",
    },
    {
      name: "Orders",
      icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
      path: "/orders",
    },
    {
      name: "Logout",
      icon: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1",
      path: "#",
      logout: true,
    },
  ];

  const handleLogout = async () => {
    // console.log("oioioi");

    try {
      await logout(); // Logout API
      localStorage.removeItem("token"); // Hapus token
      message.error("Berhasil Logout.");
      fetchUser();
      navigate("/"); // Redirect ke halaman login
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header
      className="p-2 text-xl font-bold bg-[#1E3A34] text-[#FFD700]"
    >
      <div className="px-10 flex justify-between items-center">
        <div className="flex items-center">
          <img src="/ketupat.gif" alt="ketupat" className="max-h-12" />
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
            <img
              className="h-12 rounded-full"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/FullMoon2010.jpg/1200px-FullMoon2010.jpg"
              alt="User Avatar"
            />
            <div>
              <h4 className="font-semibold text-lg text-[#FFD700] capitalize">
                {loading ? <Skeleton.Input active size="small" /> : user?.name || "Belum Login"}
              </h4>
              <span className="text-sm tracking-wide flex items-center space-x-1">
                <TbArrowBadgeDown className="text-green-600 text-2xl" />
                <span className="text-[#FFD700]">Verified</span>
              </span>
            </div>
          </div>
          <ul className="space-y-2 text-sm">
            {location.pathname === "/" || location.pathname === "/register" ? (
              <li
                key={1}
                className="rounded-md"
                style={{
                  backgroundColor: "#FFD700",
                  color: "#1E3A34",
                }}
                onClick={() => {setOpen(false)}}
              >
                <Link
                  to={`/`}
                  className="flex items-center space-x-3 p-2 rounded-md font-medium"
                  style={{
                    backgroundColor: "#FFD700",
                    color: "#1E3A34",
                  }}
                >
                  <span><HiOutlineLogin className="text-xl" /></span>
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
                      onClick={() => {setOpen(false)}}
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
                        <span>
                          <svg
                            className="h-5"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d={item.icon}
                            />
                          </svg>
                        </span>
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
