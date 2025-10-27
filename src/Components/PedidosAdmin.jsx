import React, { useState, useEffect, useRef } from 'react'; 
import logo from '../assets/img/logo-tambo2.png';
import { FaShoppingCart, FaEdit, FaTrash, FaFilePdf } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './PedidosAdmin.css';

const estados = ['Pendiente', 'Entregado'];

const PedidosAdmin = ({ clientes = [], productos = [] }) => {
  const [pedidos, setPedidos] = useState([]);
  const [form, setForm] = useState({
    cliente: '',
    producto: '',
    cantidad: '',
    fecha: null,
    estado: '',
    direccion: '',
    telefono: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [mensajeExito, setMensajeExito] = useState('');

  const tablaRef = useRef(null);
  const logoBase64Ref = useRef('');

  useEffect(() => {
    const img = new Image();
    img.src = logo;
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      logoBase64Ref.current = canvas.toDataURL('image/png');
    };

    const guardados = JSON.parse(localStorage.getItem('pedidosTambo')) || [];
    guardados.forEach(p => { if (p.fecha) p.fecha = new Date(p.fecha); });
    setPedidos(guardados);

    window.html2canvas = html2canvas;
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validar = () => {
    const errores = {};
    if (!form.cliente) errores.cliente = 'Cliente es requerido';
    if (!form.producto) errores.producto = 'Producto es requerido';
    if (!form.cantidad.toString().trim()) errores.cantidad = 'Cantidad es requerida';
    else if (Number(form.cantidad) <= 0)
      errores.cantidad = 'Cantidad inválida';
    if (!form.fecha) errores.fecha = 'Fecha es requerida';
    if (!form.estado) errores.estado = 'Estado es requerido';
    if (!form.direccion.trim()) errores.direccion = 'Dirección es requerida';
    if (!form.telefono.trim()) errores.telefono = 'Teléfono es requerido';
    return errores;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errores = validar();
    if (Object.keys(errores).length > 0) {
      setErrors(errores);
      setMensajeExito('');
      return;
    }

    const formData = { ...form };

    if (editingId !== null) {
      const nuevosPedidos = pedidos.map((p, idx) => (idx === editingId ? formData : p));
      setPedidos(nuevosPedidos);
      localStorage.setItem('pedidosTambo', JSON.stringify(nuevosPedidos));
      setEditingId(null);
      setMensajeExito('Pedido actualizado correctamente');
    } else {
      const nuevosPedidos = [...pedidos, formData];
      setPedidos(nuevosPedidos);
      localStorage.setItem('pedidosTambo', JSON.stringify(nuevosPedidos));
      setMensajeExito('Pedido registrado correctamente');
    }

    setForm({
      cliente: '',
      producto: '',
      cantidad: '',
      fecha: null,
      estado: '',
      direccion: '',
      telefono: '',
    });
    setErrors({});
  };

  const handleEdit = (idx) => {
    setForm(pedidos[idx]);
    setEditingId(idx);
    setErrors({});
    setMensajeExito('');
  };

  const handleDelete = (idx) => {
    if (!window.confirm('¿Estás seguro de eliminar este pedido?')) return;
    const nuevosPedidos = pedidos.filter((_, i) => i !== idx);
    setPedidos(nuevosPedidos);
    localStorage.setItem('pedidosTambo', JSON.stringify(nuevosPedidos));
    setMensajeExito('Pedido eliminado');
    if (editingId === idx) setEditingId(null);
    setForm({
      cliente: '',
      producto: '',
      cantidad: '',
      fecha: null,
      estado: '',
      direccion: '',
      telefono: '',
    });
    setErrors({});
  };

  const exportarPDF = async () => {
    if (!tablaRef.current) return;

    const element = document.createElement('div');
    element.style.width = '800px';
    element.style.padding = '20px';
    element.style.backgroundColor = 'white';
    element.style.position = 'absolute';
    element.style.left = '-9999px';
    document.body.appendChild(element);

    if (logoBase64Ref.current) {
      const imgEl = document.createElement('img');
      imgEl.src = logoBase64Ref.current;
      imgEl.style.width = '150px';
      imgEl.style.display = 'block';
      imgEl.style.margin = '0 auto 20px auto';
      element.appendChild(imgEl);
    }

    const titleEl = document.createElement('h2');
    titleEl.innerText = 'Listado de Pedidos';
    titleEl.style.textAlign = 'center';
    titleEl.style.marginBottom = '20px';
    element.appendChild(titleEl);

    const tablaClon = tablaRef.current.cloneNode(true);
    const botones = tablaClon.querySelectorAll('button');
    botones.forEach(b => b.remove());
    element.appendChild(tablaClon);

    try {
      const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'pt', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const imgWidth = pdfWidth - margin * 2;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);
      pdf.save('pedidos.pdf');
    } catch (err) {
      console.error(err);
      alert('Error generando PDF');
    } finally {
      document.body.removeChild(element);
    }
  };

  return (
    <>
      <div className="header d-flex justify-content-between align-items-center mb-4">
        <div className="header-left d-flex align-items-center">
          <FaShoppingCart size={40} className="me-2" />
          <h1 className="h4 mb-0 ms-2">Gestión de Pedidos</h1>
        </div>
        <div className="d-flex align-items-center">
          <span>Administrador</span>
        </div>
      </div>

      <div className="admin-container">
        <button className="btn btn-danger mb-3" onClick={exportarPDF}>
          <FaFilePdf /> Descargar PDF
        </button>

        <div className="card">
          <div className="card-body">
            <h5>{editingId !== null ? 'Editar Pedido' : 'Registrar Pedido'}</h5>
            <form onSubmit={handleSubmit} noValidate>
              <select
                name="cliente"
                value={form.cliente}
                onChange={handleChange}
                className={`form-control mb-2 ${errors.cliente ? 'is-invalid' : ''}`}
              >
                <option value="">Seleccione un cliente</option>
                {clientes.map(c => <option key={c.id} value={c.nombre}>{c.nombre}</option>)}
              </select>
              {errors.cliente && <div className="invalid-feedback">{errors.cliente}</div>}

              <select
                name="producto"
                value={form.producto}
                onChange={handleChange}
                className={`form-control mb-2 ${errors.producto ? 'is-invalid' : ''}`}
              >
                <option value="">Seleccione un producto</option>
                {productos.map(p => <option key={p.id} value={p.nombre}>{p.nombre}</option>)}
              </select>
              {errors.producto && <div className="invalid-feedback">{errors.producto}</div>}

              <input
                type="number"
                name="cantidad"
                value={form.cantidad}
                onChange={handleChange}
                placeholder="Cantidad"
                className={`form-control mb-2 ${errors.cantidad ? 'is-invalid' : ''}`}
                min="1"
              />
              {errors.cantidad && <div className="invalid-feedback">{errors.cantidad}</div>}

              <label>Fecha:</label>
              <DatePicker
                selected={form.fecha}
                onChange={(date) => setForm({ ...form, fecha: date })}
                className={`form-control mb-2 ${errors.fecha ? 'is-invalid' : ''}`}
                placeholderText="Seleccione una fecha"
                dateFormat="yyyy/MM/dd"
              />
              {errors.fecha && <div className="invalid-feedback d-block">{errors.fecha}</div>}

              <select
                name="estado"
                value={form.estado}
                onChange={handleChange}
                className={`form-control mb-2 ${errors.estado ? 'is-invalid' : ''}`}
              >
                <option value="">Seleccione un estado</option>
                {estados.map(est => <option key={est} value={est}>{est}</option>)}
              </select>
              {errors.estado && <div className="invalid-feedback">{errors.estado}</div>}

              <input
                type="text"
                name="direccion"
                value={form.direccion}
                onChange={handleChange}
                placeholder="Dirección"
                className={`form-control mb-2 ${errors.direccion ? 'is-invalid' : ''}`}
              />
              {errors.direccion && <div className="invalid-feedback">{errors.direccion}</div>}

              <input
                type="text"
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                placeholder="Teléfono"
                className={`form-control mb-2 ${errors.telefono ? 'is-invalid' : ''}`}
                maxLength="9"
              />
              {errors.telefono && <div className="invalid-feedback">{errors.telefono}</div>}

              <button type="submit" className="btn btn-primary me-2">
                {editingId !== null ? 'Actualizar' : 'Registrar'}
              </button>
              {mensajeExito && <span className="text-success ms-3">{mensajeExito}</span>}
            </form>
          </div>
        </div>

        <div className="card mt-4">
          <div className="card-body">
            <h5>Lista de Pedidos</h5>
            {pedidos.length === 0 ? (
              <p>No hay pedidos registrados.</p>
            ) : (
              <table ref={tablaRef} className="table table-hover">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th>Dirección</th>
                    <th>Teléfono</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidos.map((pedido, idx) => (
                    <tr key={idx}>
                      <td>{pedido.cliente}</td>
                      <td>{pedido.producto}</td>
                      <td>{pedido.cantidad}</td>
                      <td>{pedido.fecha ? new Date(pedido.fecha).toLocaleDateString() : ''}</td>
                      <td>{pedido.estado}</td>
                      <td>{pedido.direccion}</td>
                      <td>{pedido.telefono}</td>
                      <td>
                        <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(idx)}>
                          <FaEdit /> Editar
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(idx)}>
                          <FaTrash /> Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PedidosAdmin;
