import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "@/services/axios";

export default function useInterceptor() {
  const navigate = useNavigate();

  useEffect(() => {
    const responseInterceptor = axios.interceptors.response.use(
      (res) => res,
      (error) => {
        if (error.response && error.response.status === 401) {
          navigate("/auth/login");
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [navigate]);
}
