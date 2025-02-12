import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { URL_USER } from "../utils/Endpoint";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Default loading true

  const fetchUser = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const { data } = await axios.get(URL_USER, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(data);
    } catch (error) {
      console.error("Gagal mendapatkan info user", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
