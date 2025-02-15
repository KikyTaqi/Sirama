import "@ant-design/v5-patch-for-react-19";
import React from "react";
import { ConfigProvider } from "antd";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// Components
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import Footer from "./components/Footer";
import { UserProvider } from "./components/UserContext";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

//solat
import Solat from "./pages/solat/Solat";
import CreateSolat from "./pages/solat/CreateSolat";

//places
import Places from "./pages/places/Places";
import CreatePlaces from "./pages/places/CreatePlaces";
import UpdatePlaces from "./pages/places/UpdatePlaces";

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {},
        components: {
          Table: {
            headerBg: "#1E3A34",
            headerColor: "#FFD700",
          },
          Pagination: {
            itemActiveBg: "#1E3A34",
          },
          Select: {
            selectorBg: '#4cb399',
            colorText: "#FFD700",
            optionSelectedBg: "#1E3A34",
            optionActiveBg: "#3e947e",
          }
        },
      }}
    >
      <Router>
        <UserProvider>
        <div className="fixed top-0 left-0 w-full z-50 bg-[#1e3a34] shadow-md">
          <Header className="" />
        </div>
        <div className="bg-[#1e3a342f] min-h-screen">
          <div className="px-6 py-5">
            <Routes>
              {/* Route untuk halaman login dan register */}
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <div className="pt-14">
                      <div className="min-h-max my-5">
                        <Routes>
                          <Route path="/dashboard" element={<Dashboard />} />
                          <Route path="/notifications" element={<Places />} />
                          <Route path="/notifications/create" element={<CreatePlaces />} />
                          <Route path="/notifications/:id" element={<UpdatePlaces />} />
                          <Route path="/solat" element={<Solat />} />
                          <Route path="/solat/create" element={<CreateSolat />} />
                        </Routes>
                      </div>
                    </div>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>

          <Footer />
        </div>
        </UserProvider>
      </Router>
    </ConfigProvider>
  );
}

export default App;
