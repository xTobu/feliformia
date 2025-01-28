// 在某個文件中創建並導出 nocodbClient
import axios from "axios";
const API_URL = "https://app.nocodb.com/api/v2/tables";
const API_TOKEN = process.env.NOCODB_API_TOKEN;

const request = axios.create({
  baseURL: API_URL + "/",
  headers: {
    "Content-Type": "application/json",
    "xc-token": API_TOKEN,
  },
});

export { request };
