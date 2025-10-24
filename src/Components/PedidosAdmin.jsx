import React, { useState, useEffect, useRef } from 'react';
import logo from '../assets/img/logo-tambo2.png';
import { FaShoppingCart, FaEdit, FaTrash, FaFilePdf } from 'react-icons/fa';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './PedidosAdmin.css';

const PedidosAdmin = () => {
  const [pedidos, setPedidos] = useState([]);
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
    guardados.forEach(p => {
      if (p.fecha) p.fecha = new Date(p.fecha);
    });
    setPedidos(guardados);
    window.html2canvas = html2canvas;
  }, []);

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
    tablaClon.style.width = '100%';
    tablaClon.querySelectorAll('button').forEach(b => b.remove());
    element.appendChild(tablaClon);

    try {
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'pt', 'a4');
      const margin = 20;
      const imgWidth = pdf.internal.pageSize.getWidth() - margin * 2;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      if (imgHeight < pdf.internal.pageSize.getHeight() - margin * 2) {
        pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);
      } else {
        let remainingHeight = imgHeight;
        let pageCanvasHeight = (canvas.width * (pdf.internal.pageSize.getHeight() - margin * 2)) / imgWidth;
        let yOffset = 0;

        while (remainingHeight > 0) {
          const sHeight = Math.min(pageCanvasHeight, canvas.height - yOffset);
          const pageCanvas = document.createElement('canvas');
          pageCanvas.width = canvas.width;
          pageCanvas.height = sHeight;
          const pageCtx = pageCanvas.getContext('2d');
          pageCtx.drawImage(canvas, 0, yOffset, canvas.width, sHeight, 0, 0, canvas.width, sHeight);
          const pageImgData = pageCanvas.toDataURL('image/png');
          if (yOffset > 0) pdf.addPage();
          pdf.addImage(pageImgData, 'PNG', margin, margin, imgWidth, (sHeight * imgWidth) / canvas.width);
          yOffset += sHeight;
          remainingHeight -= sHeight;
        }
      }

      pdf.save('pedidos.pdf');
    } catch (err) {
      console.error('Error generando PDF:', err);
      alert('Hubo un error al generar el PDF');
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
