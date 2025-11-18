import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./PedidosAdmin.css";

const estados = ["PENDIENTE", "ENTREGADO", "CANCELADO"];

const PedidosAdmin = () => {
  const [pedidos, setPedidos] = useState([]);
  const [modalEstado, setModalEstado] = useState(null);
  const [nuevoEstado, setNuevoEstado] = useState("");
  const [mensaje, setMensaje] = useState("");

  // Cargar los pedidos al cargar el componente
  useEffect(() => {
    cargarPedidos();
  }, []);

  // Cargar los pedidos
  const cargarPedidos = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:8080/api/pedidos/admin/todos",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPedidos(res.data);
    } catch (err) {
      console.error(err);
      setMensaje("Error al cargar pedidos");
    }
  };

  // Abrir el modal para editar el estado
  const abrirModalEstado = (pedido) => {
    setModalEstado({ id: pedido.id, estado: pedido.estado });
    setNuevoEstado(pedido.estado);
    setMensaje(""); // limpiar mensaje
  };

  // Cerrar el modal
  const cerrarModal = () => {
    setModalEstado(null);
    setNuevoEstado("");
  };

  // Guardar el nuevo estado
  const guardarEstado = async () => {
    if (!nuevoEstado) {
      setMensaje("Seleccione un estado válido");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:8080/api/pedidos/admin/${modalEstado.id}/estado`,
        { estado: nuevoEstado },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Si la respuesta es correcta, recargar los pedidos y mostrar mensaje
      if (response.status === 200) {
        setMensaje("Estado actualizado correctamente");
        cerrarModal();
        cargarPedidos();
      } else {
        setMensaje("Error al actualizar estado");
      }
    } catch (err) {
      console.error(err);
      setMensaje("Error al actualizar estado");
    }
  };

  // Eliminar pedido
  const eliminarPedido = async (id) => {
    if (!window.confirm("¿Eliminar pedido?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `https://tambo-backend.onrender.com/api/pedidos/admin/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMensaje("Pedido eliminado correctamente");
      cargarPedidos();
    } catch (err) {
      console.error(err);
      setMensaje("Error al eliminar pedido");
    }
  };

  return (
    <div className="admin-container">
      {/* Cabecera */}
      <div className="header d-flex justify-content-between align-items-center mb-4">
        <div className="header-left d-flex align-items-center">
          <FaEdit size={40} className="me-2" />
          <h1 className="h4 mb-0 ms-2">Gestión de Pedidos</h1>
        </div>
      </div>

      {/* Mensaje de respuesta */}
      {mensaje && (
        <div className="alert alert-info">
          {mensaje}
        </div>
      )}

      {/* Tabla de pedidos */}
      <table className="table table-hover">
        <thead>
          <tr>
            <th>ID de Pedido</th>
            <th>Cliente</th>
            <th>Estado</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.user?.firstName} {p.user?.lastName}</td>
              <td>{p.estado}</td>
              <td>{p.fechaPedido?.split("T")[0]}</td>
              <td>
                <button className="btn btn-warning btn-sm me-2" onClick={() => abrirModalEstado(p)}>
                  <FaEdit /> Editar
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => eliminarPedido(p.id)}>
                  <FaTrash /> Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de edición de estado */}
      {modalEstado && (
        <div className="modal">
          <div className="modal-content p-4">
            <h5>Editar Estado Pedido {modalEstado.id}</h5>
            <select
              className="form-select my-3"
              value={nuevoEstado}
              onChange={(e) => setNuevoEstado(e.target.value)}
            >
              <option value="">Seleccione estado</option>
              {estados.map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
            <div>
              <button className="btn btn-primary me-2" onClick={guardarEstado}>Actualizar</button>
              <button className="btn btn-secondary" onClick={cerrarModal}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PedidosAdmin;
