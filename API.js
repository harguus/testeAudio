import axios from "axios";

const api = axios.create({
    baseURL: "http://157.230.136.198/api/"
});

export default api;