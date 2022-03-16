import axios from "axios";
import { apiUrl } from "./consts";
const instance = axios.create({
    baseURL: apiUrl,
});

export default instance;
