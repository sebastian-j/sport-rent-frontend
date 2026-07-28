import { api } from "./client.ts";

export const getUser = () => api.GET("/user");

export const getUserHistory = () => api.GET("/user/history");

export const getOrderDetails = (orderId: number) =>
  api.GET("/user/history/{order_id}", {
    params: { path: { order_id: orderId } },
  });
