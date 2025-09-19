// Importa React y el hook useState para manejar estados locales
import React, { useState } from 'react';

// Importa el hook useNavigate para redireccionar entre rutas
import { useNavigate } from 'react-router-dom';

// Importa los estilos CSS específicos del login
import './Login.css';

// Importa el logo de Tambo desde la carpeta de imágenes
import famisLogo from '../assets/img/logo-tambo2.png';

function Login() {
  // Estados para capturar el correo, contraseña, errores y validación de correo
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(false);

  // Hook para redireccionar programáticamente
  const navigate = useNavigate();

  // Función para validar formato de correo electrónico
  const validateEmail = (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValidEmail(regex.test(value));
  };

  // Función que se ejecuta al enviar el formulario
  const handleSubmit = (e) => {
    e.preventDefault(); // Evita el comportamiento por defecto del formulario

    // Intenta recuperar el usuario registrado desde localStorage
    const userString = localStorage.getItem('registroUsuario');
    if (!userString) {
      setError('No hay usuarios registrados');
      return;
    }

    // Parsea el usuario guardado y compara credenciales
    const user = JSON.parse(userString);
    if (email === user.email && password === user.password) {
      // Si el correo termina en @tambo.com, redirige al panel de administración
      if (email.endsWith("@tambo.com")) {
        navigate('/panel');
      } else {
        // Si es un usuario normal, redirige a la raíz
        navigate('/');
      }
    } else {
      // Si las credenciales no coinciden, muestra error
      setError('Credenciales incorrectas');
    }
  };

  // Render del formulario de login
  return (
    <div className="registro-container">
      {/* Sección izquierda con el logo */}
      <div className="registro-imagen">
        <img src={famisLogo} alt="FAMIS Logo" />
      </div>

      {/* Formulario de inicio de sesión */}
      <form className="registro-formulario" onSubmit={handleSubmit}>
        <h2>Iniciar Sesión</h2>

        {/* Campo de correo electrónico */}
        <input
          type="email"
          placeholder="Correo Electrónico"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            validateEmail(e.target.value); // Valida en tiempo real
          }}
          required
        />

        {/* Campo de contraseña */}
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Muestra mensaje de error si existe */}
        {error && <p className="error">{error}</p>}

        {/* Botón de envío, deshabilitado si los campos están vacíos o el correo no es válido */}
        <button
          type="submit"
          disabled={!email || !password || !isValidEmail}
        >
          Iniciar sesión
        </button>

        {/* Enlace para ir al registro */}
        <p className="registro-link">
          ¿No tienes cuenta? <a href="/registro">Regístrate</a>
        </p>
      </form>
    </div>
  );
}

// Exporta el componente para que pueda usarse en App.jsx
export default Login;
