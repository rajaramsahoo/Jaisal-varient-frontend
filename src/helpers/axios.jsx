import axios from "axios";
const instance = axios.create({
    baseURL: "http://localhost:5000/",
    // baseURL: "https://jaisal.co.in/",
    //baseURL: "https://jaisal-organic.onrender.com/",
});

export default instance;
