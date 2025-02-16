import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";

const NotFound = () => {
    const navigate = useNavigate();
  return (
    <div className="flex justify-center items-center min-h-screen text-[#FFD700] text-center px-4">
      <div className="max-w-md p-6 bg-[#2A5D50] shadow-lg rounded-lg text-white">
        <div className="flex w-full justify-center">
            <img src="/qiqi-impact.gif" alt="" loading="lazy"/>
        </div>
        <h3 className="text-6xl font-bold">404</h3>
        <p className="text-xl font-semibold mt-2">Oops! Halaman tidak ditemukan.</p>
        <p className="text-sm mt-2 text-[#FFD700]">
          Halaman yang kamu cari mungkin telah dihapus atau tidak tersedia.
        </p>
        <Link
        //   to="/"
            onClick={() => {
                navigate(-1);
            }}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[#FFD700] text-[#2A5D50] font-semibold rounded-lg hover:bg-[#e6c200] transition"
        >
          <IoIosArrowBack className="text-xl" /> Kembali
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
