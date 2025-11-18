
import client from "./client";

export const getPedidos = () => client.get("/pedidos");
export const createPedido = (data) => client.post("/pedidos", data);
export const updatePedido = (id, data) => client.put(`/pedidos/${id}`, data);
export const deletePedido = (id) => client.delete(`/pedidos/${id}`);
