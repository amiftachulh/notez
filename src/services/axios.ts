import { default as a } from "axios";

const axios = a.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export const fetcher = <T>(url: string): Promise<T> => axios.get<T>(url).then((res) => res.data);

export default axios;
