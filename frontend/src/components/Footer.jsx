import React from "react";
import { Layout } from "antd";
import { Link } from "react-router-dom";

import { FaXTwitter, FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa6";

const { Footer } = Layout;

const CustomFooter = () => {
  return (
    <Footer className="!bg-[#1E3A34] text-[#FFD700] pt-8 pb-6">
      <div className="container mx-auto px-0 md:px-4">
        <div className="flex flex-wrap text-left lg:text-left">
          <div className="w-full lg:w-6/12 px-0 md:px-4">
            <h4 className="text-3xl text-white font-semibold mb-2">
              Jadikan Ramadhan Lebih Bermakna!
            </h4>
            <h5 className="text-lg mt-0 mb-2 text-[#E5C100]">
              Catat setiap momen ibadah dan perjalanan spiritualmu. Mari
              bersama-sama meraih keberkahan Ramadhan!
            </h5>

            <div className="mt-6 lg:mb-0 mb-6 flex space-x-3">
              <Link to={`https://twitter.com/smkn3kendal`} target="_blank">
                <button className="bg-white text-gray-800 shadow-lg h-10 w-10 flex items-center justify-center rounded-full text-lg cursor-pointer">
                  <FaXTwitter />
                </button>
              </Link>
              <Link to={`https://www.facebook.com/SMKNegeri3Kendal/`} target="_blank">
                <button className="bg-white text-blue-600 shadow-lg h-10 w-10 flex items-center justify-center rounded-full text-lg cursor-pointer">
                  <FaFacebookF />
                </button>
              </Link>
              <Link to={`https://www.instagram.com/sm3k_id`} target="_blank">
                <button className="bg-white text-pink-400 shadow-lg h-10 w-10 flex items-center justify-center rounded-full text-lg cursor-pointer">
                  <FaInstagram />
                </button>
              </Link>
              <Link to={`https://www.youtube.com/@smknegeri3kendal-official905`} target="_blank">
                <button className="bg-white text-red-700 shadow-lg h-10 w-10 flex items-center justify-center rounded-full text-lg cursor-pointer">
                  <FaYoutube />
                </button>
              </Link>
            </div>
          </div>
          <div className="w-full lg:w-6/12 px-0 lg:px-4">
            <div className="flex flex-wrap items-top mb-6">
              <div className="w-full lg:w-4/12 px-0 md:px-4 mx-auto">
                <span className="block uppercase text-[#FFD700] text-sm font-semibold mb-2">
                  About
                </span>
                <ul className="list-unstyled">
                  <li>
                    <a
                      className="!text-white hover:!text-gray-300 font-semibold block pb-2 text-sm"
                      href="https://smkn3kendal.sch.id/" target="_blank"
                    >
                      SMK Negeri 3 Kendal
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <hr className="my-6 border-[#FFD700]" />
        <div className="flex flex-wrap items-center md:justify-between justify-center">
          <div className="w-full md:w-4/12 px-4 mx-auto text-center">
            <div className="text-sm text-[#E5C100] font-semibold py-1">
              Copyright © {new Date().getFullYear() === 2025 ? '2025' : `2025 - ${new Date().getFullYear()}`}
              <a href="https://www.instagram.com/ifarxd/" target="_blank" className="!text-white hover:!text-gray-300 me-1">
                {" "}
                Rafi
              </a>  
               &
              <a href="https://www.instagram.com/rifqiramandhani_/" target="_blank" className="!text-white hover:!text-gray-300">
                {" "}
                Taqi
              </a>  
              .
            </div>
          </div>
        </div>
      </div>
    </Footer>
  );
};

export default CustomFooter;
