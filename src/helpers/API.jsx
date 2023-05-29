import axios from "axios";
import authHeader from "services/admin/auth/AuthHeader";

const defaultBaseAPI = "https://redefine-admin.azurewebsites.net/";
const defaultFrontBaseAPI = "https://redefine-front-dev.redefinecommerce.io/";

export const fileUploadAPI = axios.create({
  baseURL: process.env.REACT_APP_API_URL ?? defaultBaseAPI + "upload/image",
  headers: {
    Accept: "application/json",
    ...authHeader(),
  },
});

export const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL ?? defaultBaseAPI,
});
export const FrontAPI = axios.create({
  baseURL: process.env.REACT_Front_APP_API_URL ?? defaultFrontBaseAPI,
});

export const PHPAPI = () =>
  axios.create({
    //    baseURL: "http://10.0.10.58/redefine-cms-api-lv8/api",
    baseURL: "https://www.redefinecommerce.net/API/api",

    headers: {
      // 'Content-type': 'application/json',
      ...authHeader(),
      Accept: "application/json",
    },
  });

export const PublicAPI = axios.create({
  baseURL: process.env.REACT_APP_API_URL ?? defaultBaseAPI,
  headers: {
    Accept: "application/json",
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Request-Private-Network': true,
    'Access-Control-Allow-Private-Network': true
  },
});
