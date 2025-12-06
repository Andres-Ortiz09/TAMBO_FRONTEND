import React, { useState, useEffect } from "react";
import { FaUser, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "./UsuarioAdmin.css";
import { getAllUsers, createUser, updateUser, deleteUser } from "../users";

const UsuarioAdmin = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    repeatPassword: "",
    address: "",
    phone: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [mensajeExito, setMensajeExito] = useState("");
  const [errors, setErrors] = useState({});
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) fetchUsers();
  }, [token]);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers(token);
      setUsuarios(data);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    }
  };

  const validar = () => {
    const err = {};
    if (!form.firstName.trim()) err.firstName = "El nombre es obligatorio";
    else if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(form.firstName))
      err.firstName = "Solo letras en el nombre";

    if (!form.lastName.trim()) err.lastName = "El apellido es obligatorio";
    else if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(form.lastName))
      err.lastName = "Solo letras en el apellido";

    if (!form.email.trim()) err.email = "El correo es obligatorio";
    else if (!/^[\w.-]+@[\w.-]+\.\w+$/.test(form.email))
      err.email = "Correo inválido";

    if (!form.password.trim()) err.password = "La contraseña es obligatoria";
    else if (form.password.length < 6)
      err.password = "Debe tener al menos 6 caracteres";

    if (!form.repeatPassword.trim()) err.repeatPassword = "Debe repetir la contraseña";
    else if (form.password !== form.repeatPassword)
      err.repeatPassword = "Las contraseñas no coinciden";

    if (!form.address.trim()) err.address = "La dirección es obligatoria";

    if (!form.phone.trim()) err.phone = "El teléfono es obligatorio";
    else if (!/^\d{9}$/.test(form.phone))
      err.phone = "Debe tener exactamente 9 dígitos numéricos";

    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validar();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setMensajeExito("");
      return;
    }

    try {
      if (editingId) {
        await updateUser(token, editingId, form);
        setMensajeExito("Usuario actualizado correctamente");
      } else {
        await createUser(token, form);
        setMensajeExito("Usuario registrado correctamente");
      }
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        repeatPassword: "",
        address: "",
        phone: "",
      });
      setEditingId(null);
      setErrors({});
      fetchUsers();
    } catch (error) {
      console.error("Error al guardar usuario:", error);
      alert("Error al guardar el usuario");
    }
  };

  const handleEdit = (user) => {
    setForm({ ...user, repeatPassword: user.password });
    setEditingId(user.id);
    setMensajeExito("");
    setErrors({});
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este usuario?")) {
      try {
        await deleteUser(token, id);
        fetchUsers();
        setMensajeExito("Usuario eliminado correctamente");
      } catch (error) {
        alert("Error al eliminar usuario");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "firstName" || name === "lastName") {
      const soloLetras = value.replace(/[^A-Za-zÁÉÍÓÚáéíóúñÑ\s]/g, "");
      setForm({ ...form, [name]: soloLetras });
    } else if (name === "phone") {
      const soloNumeros = value.replace(/\D/g, "").slice(0, 9);
      setForm({ ...form, [name]: soloNumeros });
    } else {
      setForm({ ...form, [name]: value });
    }

    setErrors({ ...errors, [name]: "" });
  };

  return (
    <>
      <div className="header d-flex justify-content-between align-items-center mb-4">
        <div className="header-left d-flex align-items-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/1077/1077012.png"
            alt="Logo Tambo"
            width="40"
          />
          <h1 className="h4 mb-0 ms-2">Gestión de Usuarios</h1>
        </div>
        <div className="d-flex align-items-center">
          <FaUser size={30} className="text-secondary me-2" />
          <span>Administrador</span>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <h5>{editingId ? "Editar Usuario" : "Registrar Usuario"}</h5>

          <form onSubmit={handleSubmit} noValidate>
            <div className="row">
              <div className="col-md-6 mb-3">
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="Nombre"
                  className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
                />
                {errors.firstName && (
                  <div className="invalid-feedback">{errors.firstName}</div>
                )}
              </div>

              <div className="col-md-6 mb-3">
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Apellido"
                  className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
                />
                {errors.lastName && (
                  <div className="invalid-feedback">{errors.lastName}</div>
                )}
              </div>
            </div>

            {/* Email y Teléfono */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Correo electrónico"
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                />
                {errors.email && (
                  <div className="invalid-feedback">{errors.email}</div>
                )}
              </div>

              <div className="col-md-6 mb-3">
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Teléfono"
                  maxLength="9"
                  className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                />
                {errors.phone && (
                  <div className="invalid-feedback">{errors.phone}</div>
                )}
              </div>
            </div>

            {/* Contraseña y repetir */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Contraseña"
                  className={`form-control ${errors.password ? "is-invalid" : ""}`}
                />
                {errors.password && (
                  <div className="invalid-feedback">{errors.password}</div>
                )}
              </div>

              <div className="col-md-6 mb-3">
                <input
                  type="password"
                  name="repeatPassword"
                  value={form.repeatPassword}
                  onChange={handleChange}
                  placeholder="Repetir Contraseña"
                  className={`form-control ${errors.repeatPassword ? "is-invalid" : ""}`}
                />
                {errors.repeatPassword && (
                  <div className="invalid-feedback">{errors.repeatPassword}</div>
                )}
              </div>
            </div>

            {/* Dirección convertida en TEXTAREA */}
            <div className="mb-3">
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Dirección"
                className={`form-control textarea-input ${errors.address ? "is-invalid" : ""}`}
                rows="2"
              ></textarea>
              {errors.address && (
                <div className="invalid-feedback">{errors.address}</div>
              )}
            </div>

            <button type="submit" className="btn btn-primary me-2">
              {editingId ? "Actualizar" : <>
                <FaPlus className="me-1" /> Agregar Usuario
              </>}
            </button>

            {mensajeExito && (
              <span className="text-success fw-semibold ms-3">{mensajeExito}</span>
            )}
          </form>
        </div>
      </div>

      <div className="card shadow-sm table-container mt-4">
        <div className="card-body">
          <h5>Lista de Usuarios</h5>

          {usuarios.length === 0 ? (
            <p>No hay usuarios registrados.</p>
          ) : (
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Email</th>
                  <th>Dirección</th>
                  <th>Teléfono</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario.id}>
                    <td>{usuario.firstName}</td>
                    <td>{usuario.lastName}</td>
                    <td>{usuario.email}</td>
                    <td>{usuario.address}</td>
                    <td>{usuario.phone}</td>

                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => handleEdit(usuario)}
                      >
                        <FaEdit />
                      </button>

                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(usuario.id)}
                      >
                        <FaTrash />
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default UsuarioAdmin;