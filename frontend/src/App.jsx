import "@ant-design/v5-patch-for-react-19";
import React from "react";
import { ConfigProvider, Spin } from "antd";
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import "./App.css";

// Components
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import Footer from "./components/Footer";
import { UserProvider, useUser } from "./components/UserContext";
import ProtectedSiswa from "./components/ProtectedSiswa";
import NotFound from "./components/NotFound";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import DashboardGuru from "./pages/guru/DashboardGuru";

//solat
import Solat from "./pages/solat/Solat";
import CreateSolat from "./pages/solat/CreateSolat";

//places
import Places from "./pages/places/Places";
import CreatePlaces from "./pages/places/CreatePlaces";
import UpdatePlaces from "./pages/places/UpdatePlaces";

//kegiatan
import CreateKegiatan from "./pages/kegiatanSiswa/CreateKegiatan";
import Kultum from "./pages/kegiatanSiswa/kultum";
import CreateKultum from "./pages/kegiatanSiswa/CreateKultum";

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
            selectorBg: "#4cb399",
            colorText: "#FFD700",
            optionSelectedBg: "#1E3A34",
            optionActiveBg: "#3e947e",
          },
        },
      }}
    >
      <Router>
        <UserProvider>
          <AppContent />
        </UserProvider>
      </Router>
    </ConfigProvider>
  );
}

function AppContent() {
  const { user, loadingUser } = useUser();

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50 bg-[#1e3a34] shadow-md">
        <Header className="" />
      </div>
      <div className="bg-[#1e3a342f] min-h-screen pt-16">
        <div className="px-6 py-5">
          {loadingUser ? (
            <div className="w-[95vw] h-[50vh] flex justify-center items-center">
              <Spin size="large" />
            </div>
          ) : (
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    {user?.role === "siswa" && <Outlet />}
                    {user?.role === "guru" && <Outlet />}
                  </ProtectedRoute>
                }
              >
                {/* Routes siswa */}
                {user?.role === "siswa" && (
                  <>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="notifications" element={<Places />} />
                    <Route path="solat" element={<Solat />} />
                    <Route path="solat/create" element={<CreateSolat />} />
                    <Route path="kegiatan/create" element={<CreateKegiatan />} />
                    <Route path="kegiatan/kultum" element={<Kultum />} />
                    <Route path="kegiatan/kultum/create" element={<CreateKultum />} />
                  </>
                )}

                {/* Routes guru */}
                {user?.role === "guru" && (
                  <Route path="dashboard" element={<DashboardGuru />} />
                )}

                {/* Fallback untuk rute yang tidak cocok */}
                <Route path="*" element={<NotFound />} />
              </Route>

              {/* Rute NotFound di luar kalau ada kesalahan */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
}


export default App;
