import React, { useState, useEffect } from "react";
import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/img/logo-tambo2.png';
import { getCurrentUser } from '../api';

export default function Inicio() {
    const [user, setUser] = useState(null);
    const [animate, setAnimate] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setAnimate(true);
        const token = localStorage.getItem('token');
        if (token) {
            getCurrentUser(token)
                .then(u => setUser(u))
                .catch(() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setUser(null);
                });
        }
    }, []);

    useEffect(() => {
        if (user?.role === 'admin') {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    const benefits = [
        { icon: "🛒", title: "Variedad de productos", description: "Encuentra todo lo que necesitas para tu hogar." },
        { icon: "💰", title: "Precios competitivos", description: "Ofertas y promociones todos los días." },
        { icon: "🚚", title: "Entrega rápida", description: "Recibe tus productos cómodamente en tu hogar." },
    ];

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <div style={styles.logoWrapper}>
                    <img src={logo} alt="Logo Tambo" style={styles.logotambo} />
                </div>

                <nav style={styles.nav}>
                    {!user ? (
                        <>
                            <Link to="/login" style={styles.navLink}>Iniciar Sesión</Link>
                            <Link to="/registro" style={styles.navLink}>Registrarse</Link>
                        </>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={styles.welcome}>Bienvenido, {user.firstName || user.name || "Usuario"}</span>
                            <button style={styles.btnLogout} onClick={handleLogout}>Cerrar Sesión</button>
                        </div>
                    )}
                </nav>
            </header>

            <main style={styles.main}>
                <section style={styles.heroSection}>
                    <div style={styles.heroText}>
                        <h2>Compra productos de Tambo con confianza</h2>
                        <p>Tu minimarket online para todas tus necesidades diarias.</p>

                        <div style={styles.heroButtonWrapper}>
                            <Link to="/inicio" style={styles.btnVerProductos}>Ver Productos</Link>
                        </div>
                    </div>

                    <div style={styles.imageWrapper}>
                        <img
                            src="https://d1h08qwp2t1dnu.cloudfront.net/assets/media/es_pe/images/flyergibs/crop_68ea6ac5-4248-4bf3-86d3-004f0ad300c7_20251011163343_webp.webp"
                            alt="Minimarket"
                            style={styles.heroImage}
                        />
                    </div>
                </section>


                <section style={styles.infoSection}>
                    <h3>¿Por qué elegir Tambo?</h3>
                    <p>Conectamos a nuestros clientes con productos de calidad y variedad.</p>
                    <p>Disfruta de la mejor experiencia de compra en tu minimarket de confianza.</p>
                </section>

                <section style={styles.infoSection}>
                    <h3>Compromiso y conveniencia</h3>
                    <p>Ofrecemos precios justos y entregas rápidas.</p>
                    <p>Siempre pensamos en tu comodidad y satisfacción.</p>
                </section>

                <section style={styles.cardsSection}>
                    {benefits.map(({ icon, title, description }, i) => (
                        <div
                            key={i}
                            style={{
                                ...styles.card,
                                opacity: animate ? 1 : 0,
                                transform: animate ? "translateY(0)" : "translateY(30px)",
                                transition: `all 0.6s ease ${(i + 1) * 0.3}s`,
                            }}
                        >
                            <div style={styles.cardIcon}>{icon}</div>
                            <h3>{title}</h3>
                            <p>{description}</p>
                        </div>
                    ))}
                </section>
            </main>

            <footer style={styles.footerBottom}>
                <p>© 2025 Tambo. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
}

const styles = {
    container: {
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#f3e5f5",
        color: "#4a148c",
        margin: 0,
        padding: 0,
        boxSizing: "border-box",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem 2rem",
        backgroundColor: "#58007eff",
        color: "white",
        boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        position: "sticky",
        top: 0,
        zIndex: 100,
    },
    logoWrapper: { flex: "0 0 auto" },
    logotambo: {
        height: "50px",
        width: "auto",
        objectFit: "contain",
    },
    nav: { display: "flex", alignItems: "center", gap: "1rem" },
    navLink: {
        color: "white",
        textDecoration: "none",
        fontWeight: 600,
        padding: "0.5rem 1rem",
        borderRadius: "20px",
        transition: "0.3s",
        backgroundColor: "#9c27b0",
    },
    welcome: { fontWeight: 600, marginRight: "1rem" },
    btnLogout: {
        padding: "0.5rem 1rem",
        border: "none",
        borderRadius: "20px",
        backgroundColor: "#d500f9",
        color: "white",
        fontWeight: 600,
        cursor: "pointer",
    },
    main: { flexGrow: 1, padding: "2rem" },
    heroSection: {
        display: "flex",
        gap: "2rem",
        flexWrap: "wrap",
        alignItems: "center",
        marginBottom: "2rem",
        lineHeight: 0, // eliminar espacio extra debajo de imagen
    },
    heroText: { flex: "1 1 300px" },
    imageWrapper: {
        flex: "1 1 400px",
        maxWidth: 500,
        overflow: "hidden",
        borderRadius: 16,
        boxShadow: "0 6px 14px rgba(0,0,0,0.15)",
        display: "flex",
        lineHeight: 0, // elimina espacio blanco debajo imagen
    },
    heroImage: {
        width: "100%",
        height: "auto", // importante, para no forzar altura al 100%
        objectFit: "cover",
        borderRadius: 16,
        boxShadow: "0 6px 14px rgba(0, 0, 0, 0.15)",
        margin: 0,
        padding: 0,
        display: "block", // evita línea blanca por comportamiento inline
    },
    heroButtonWrapper: {
        marginTop: "2.5rem",
        textAlign: "center",
    },
    btnVerProductos: {
        backgroundColor: "#9c27b0",
        color: "white",
        fontWeight: 600,
        padding: "1.4rem 3rem",
        borderRadius: "30px",
        textDecoration: "none",
        transition: "0.3s",
        textAlign: "center",
        display: "inline-block",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        fontSize: "1.3rem",
        cursor: "pointer",
    },

    infoSection: {
        backgroundColor: "#e1bee7",
        padding: "2rem",
        borderRadius: "16px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        marginBottom: "2rem",
    },
    cardsSection: {
        display: "flex",
        justifyContent: "center",
        gap: "2rem",
        flexWrap: "wrap",
    },
    card: {
        backgroundColor: "white",
        borderRadius: 16,
        padding: "1.5rem",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        flex: "1 1 220px",
        maxWidth: 280,
        textAlign: "center",
    },
    cardIcon: { fontSize: "3rem", marginBottom: "0.5rem" },
    footerBottom: {
        backgroundColor: "#ce996dff",
        color: "white",
        textAlign: "center",
        padding: "1rem",
        fontWeight: 600,
    },
};
