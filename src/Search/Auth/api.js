import axios from "axios";

const api = axios.create({
  baseURL:
    "https://aiko-olhovivo-proxy.aikodigital.io//Login/Autenticar?token=6336708fa832bd35a008691c697daffe93e248f0bffed553801b7bddbfa9dc00",
});

export default api;
