import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import axios from 'axios';


const BASE_URL = 'http://127.0.0.1:8000/api';


const baseQuery = async (args, api, extraOptions) => {
  try {
    const result = await axios({
      ...args,
      baseURL: BASE_URL,
      // withCredentials: true, // if using Sanctum
    });
    return { data: result.data };
  } catch (error) {
    return { error };
  }
};

export const apiSlice = createApi({
  baseQuery,
  endpoints: () => ({}),
});