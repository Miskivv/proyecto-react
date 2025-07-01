import React, { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("#home");

  // Login/Register form fields state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Password visibility toggles
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Handle hash changes for navigation
  useEffect(() => {
    const onHashChange = () => {
      setPage(window.location.hash || "#home");
    };
    window.addEventListener("hashchange", onHashChange);
    onHashChange();

    // On mount, check if user is logged in (from sessionStorage)
    const savedUser = JSON.parse(sessionStorage.getItem("user"));
    if (savedUser) setUser(savedUser);

    return () => {
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  // Handle registration submit
  const handleRegister = (e) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      alert("Por favor completa todos los campos.");
      return;
    }

    const newUser = {
      name: regName.trim(),
      email: regEmail.trim(),
      password: regPassword.trim(),
    };

    const users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.some((u) => u.email === newUser.email)) {
      alert("Ese correo ya está registrado.");
      return;
    }

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    // Guardar sesión activa en sessionStorage
    sessionStorage.setItem("user", JSON.stringify(newUser));
    setUser(newUser);
    setIsRegistering(false);

    // Reset fields
    setRegName("");
    setRegEmail("");
    setRegPassword("");
    window.location.hash = "#home";
    alert("Usuario registrado con éxito.");
  };

  // Handle login submit
  const handleLogin = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const matchedUser = users.find(
      (u) =>
        u.email === loginEmail.trim() && u.password === loginPassword.trim()
    );

    if (matchedUser) {
      sessionStorage.setItem("user", JSON.stringify(matchedUser));
      setUser(matchedUser);
      setLoginEmail("");
      setLoginPassword("");
      window.location.hash = "#home";
    } else {
      alert("Email o contraseña incorrectos.");
    }
  };

  // Handle logout
  const handleLogout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
    window.location.hash = "";
  };

  // Toggle between register and login panels
  const togglePanel = () => {
    setIsRegistering(!isRegistering);
  };

  // Saved books functions — ahora separados por usuario (email)
  const getSavedBooks = () => {
    if (!user) return [];
    const saved = localStorage.getItem(`savedBooks_${user.email}`);
    return saved ? JSON.parse(saved) : [];
  };

  const saveBook = (book) => {
    if (!user) return false;
    const saved = getSavedBooks();
    if (saved.some((b) => b.key === book.key)) {
      alert("⚠️ Ese libro ya está guardado");
      return false;
    }
    saved.push(book);
    localStorage.setItem(`savedBooks_${user.email}`, JSON.stringify(saved));
    alert("📚 Libro guardado");
    return true;
  };

  const deleteBook = (key) => {
    if (!user) return;
    if (!window.confirm("¿Estás seguro de eliminar este libro de tus guardados?")) return;
    const saved = getSavedBooks();
    const filtered = saved.filter((b) => b.key !== key);
    localStorage.setItem(`savedBooks_${user.email}`, JSON.stringify(filtered));
  };

  return (
    <>
      {!user && (
        <div
          className={`container ${isRegistering ? "right-panel-active" : ""}`}
          id="container"
        >
          {/* Registro */}
          <div className="form-container sign-up-container">
            <form id="registerForm" onSubmit={handleRegister}>
              <h1>Crear Cuenta</h1>
              <input
                type="text"
                placeholder="Nombre"
                id="regName"
                required
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
              />
              <input
                type="email"
                placeholder="Email"
                id="regEmail"
                required
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
              />
              <div className="password-container">
                <input
                  type={showRegPassword ? "text" : "password"}
                  placeholder="Contraseña"
                  id="regPassword"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowRegPassword((prev) => !prev)}
                >
                  {showRegPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>
              <button type="submit">Registrarse</button>
            </form>
          </div>

          {/* Login */}
          <div className="form-container sign-in-container">
            <form id="loginForm" onSubmit={handleLogin}>
              <h1>Iniciar Sesión</h1>
              <input
                type="email"
                placeholder="Email"
                id="loginEmail"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
              <div className="password-container">
                <input
                  type={showLoginPassword ? "text" : "password"}
                  placeholder="Contraseña"
                  id="loginPassword"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowLoginPassword((prev) => !prev)}
                >
                  {showLoginPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>
              <button type="submit">Entrar</button>
            </form>
          </div>

          {/* Overlay panels */}
          <div className="overlay-container">
            <div className="overlay">
              <div className="overlay-panel overlay-left">
                <h1>¡Bienvenido!</h1>
                <p>Ingresa con tu cuenta para continuar</p>
                <button
                  className="ghost"
                  id="signIn"
                  onClick={() => setIsRegistering(false)}
                >
                  Iniciar Sesión
                </button>
              </div>
              <div className="overlay-panel overlay-right">
                <h1>¡Hola, Amigo!</h1>
                <p>Regístrate con tus datos para comenzar</p>
                <button
                  className="ghost"
                  id="signUp"
                  onClick={() => setIsRegistering(true)}
                >
                  Registrarse
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* App cuando hay usuario */}
      {user && (
        <LibraryApp
          user={user}
          onLogout={handleLogout}
          page={page}
          saveBook={saveBook}
          getSavedBooks={getSavedBooks}
          deleteBook={deleteBook}
          updateUser={setUser}
        />
      )}
    </>
  );
}

function LibraryApp({ user, onLogout, page, saveBook, getSavedBooks, deleteBook, updateUser }) {
  return (
    <div id="appContainer">
      <header>
        <h1>📚 Mi Biblioteca</h1>
        <nav>
          <a href="#home" className={page === "#home" ? "active" : ""}>
            Inicio
          </a>
          <a href="#search" className={page === "#search" ? "active" : ""}>
            Buscar
          </a>
          <a href="#profile" className={page == "#profile" ? "active": ""}>
            Perfil
          </a>
          <a href="#" onClick={onLogout}>
            Cerrar Sesión
          </a>
        </nav>
      </header>
      <main id="app">
        {page === "#home" && (
          <HomePage
            user={user}
            getSavedBooks={getSavedBooks}
            deleteBook={deleteBook}
          />
        )}
        {page === "#search" && (
          <SearchPage saveBook={saveBook} getSavedBooks={getSavedBooks} />
        )}
        {page === "#profile" && (<ProfilePage user={user} updateUser={updateUser} />)}
        
      </main>
      <footer>
        <p>&copy; 2025 - Proyecto de Biblioteca Personal</p>
      </footer>
    </div>
  );
}

function HomePage({ user, getSavedBooks, deleteBook }) {
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [savedBooks, setSavedBooks] = useState([]);

  useEffect(() => {
    async function fetchRecommended() {
      const saved = getSavedBooks();
      setSavedBooks(saved);

      const topic = saved.length > 0 ? saved[0].title.split(" ")[0] : "fiction";
      try {
        const res = await fetch(
          `https://openlibrary.org/search.json?q=${encodeURIComponent(
            topic
          )}&limit=12`
        );
        const data = await res.json();
        setRecommendedBooks(data.docs);
      } catch {
        setRecommendedBooks([]);
      }
    }
    fetchRecommended();
  }, [getSavedBooks]);

  const handleDelete = (key) => {
    deleteBook(key);
    const updated = savedBooks.filter((book) => book.key !== key);
    setSavedBooks(updated);
  };
  const carouselRef = useRef(null);

const scrollCarousel = (direction) => {
  const container = carouselRef.current;
  if (!container) return;

  const scrollAmount = 220; // o ajusta según el tamaño de tu card

  if (direction === "left") {
    container.scrollBy({ left: -scrollAmount, behavior: "smooth" });

    // Si estamos al principio, saltamos al medio
    if (container.scrollLeft <= 0) {
      container.scrollLeft = container.scrollWidth / 2;
    }
  } else {
    container.scrollBy({ left: scrollAmount, behavior: "smooth" });

    // Si estamos al final, saltamos al inicio de la segunda mitad
    if (container.scrollLeft + container.offsetWidth >= container.scrollWidth) {
      container.scrollLeft = container.scrollWidth / 2 - container.offsetWidth;
    }
  }
};

// En useEffect, inicia el scroll en la mitad para que funcione bien desde el principio
useEffect(() => {
  if (carouselRef.current) {
    carouselRef.current.scrollLeft = carouselRef.current.scrollWidth / 2;
  }
}, [recommendedBooks]);

  return (
    <>
      <div className="welcome-banner">
        <h2>
          👋 ¡Bienvenido, <span className="highlight">{user.name || "Usuario"}</span>!
        </h2>
      </div>
      <section>
  <h2>📖 Recomendaciones basadas en tus gustos</h2>

  {recommendedBooks.length === 0 ? (
    <p>No hay recomendaciones disponibles.</p>
  ) : (
    <div className="carousel-container">
      <button
        className="carousel-button left"
        onClick={() =>
          document.getElementById("carousel-track").scrollBy({ left: -220, behavior: "smooth" })
        }
      >
        ◀
      </button>
      <div className="carousel-track" id="carousel-track" ref={carouselRef}>
        {recommendedBooks.map((book, index) => (
          <BookCard
            key={`${book.key}-${index}`}
            book={{
              key: book.key,
              title: book.title,
              author: book.author_name ? book.author_name.join(", ") : "Desconocido",
              cover: book.cover_i
                ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
                : "https://via.placeholder.com/128x180?text=Sin+imagen",
            }}
          />
        ))}
      </div>
      <button className="carousel-button left" onClick={() => scrollCarousel("left")}>◀</button>
      <button className="carousel-button right" onClick={() => scrollCarousel("right")}>▶</button>

    </div>
    
  )}
</section>

      <section>
        <h2>📘 Mis Libros Guardados</h2>
        {savedBooks.length === 0 ? (
          <p>No tienes libros guardados.</p>
        ) : (
          <div className="card-grid">
            {savedBooks.map((book) => (
              <BookCard key={book.key} book={book} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function SearchPage({ saveBook, getSavedBooks }) {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [detailsBook, setDetailsBook] = useState(null);

  const savedBooks = getSavedBooks();
  const savedKeys = new Set(savedBooks.map((b) => b.key));

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setDetailsBook(null);

    try {
      const res = await fetch(
        `https://openlibrary.org/search.json?title=${encodeURIComponent(
          query.trim()
        )}`
      );
      const data = await res.json();
      setBooks(data.docs.slice(0, 12));
      if (data.docs.length === 0) setError("No se encontraron resultados.");
    } catch {
      setError("Error al buscar libros.");
    }
    setLoading(false);
  };

  const handleSaveBook = (book) => {
    if (saveBook(book)) {
      // Re-render or give feedback if needed
    }
  };

  const fetchDetails = async (book) => {
    try {
      const response = await fetch(`https://openlibrary.org${book.key}.json`);
      const details = await response.json();
      setDetailsBook({
        ...book,
        description:
          details.description?.value || details.description || "Sin descripción disponible.",
      });
    } catch {
      setDetailsBook({ error: "Error al cargar detalles." });
    }
  };

  return (
    <>
      {!detailsBook && (
        <form onSubmit={handleSearch}>
          <h2>🔍 Buscar Libros</h2>
          <input
            type="text"
            id="query"
            placeholder="Título del libro"
            required
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            Buscar
          </button>
          <div style={{ marginTop: "1rem" }}>
            {loading && <p>Buscando...</p>}
            {error && <p>{error}</p>}
          </div>
        </form>
      )}

      {!detailsBook && (
        <div className="card-grid" style={{ marginTop: "1rem" }}>
          {books.map((book) => {
            const cover = book.cover_i
              ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
              : "https://via.placeholder.com/128x180?text=Sin+imagen";
            return (
              <div
                className="book"
                key={book.key}
                onClick={() =>
                  fetchDetails({
                    key: book.key,
                    title: book.title,
                    author: book.author_name ? book.author_name.join(", ") : "Desconocido",
                    cover,
                  })
                }
                style={{ cursor: "pointer" }}
              >
                <img src={cover} alt={`Portada de ${book.title}`} />
                <h3>{book.title}</h3>
                <p>{book.author_name ? book.author_name.join(", ") : "Desconocido"}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!savedKeys.has(book.key)) {
                      handleSaveBook({
                        key: book.key,
                        title: book.title,
                        author: book.author_name ? book.author_name.join(", ") : "Desconocido",
                        cover,
                      });
                    }
                  }}
                  disabled={savedKeys.has(book.key)}
                >
                  {savedKeys.has(book.key) ? "Guardado" : "Guardar"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {detailsBook && (
        <div style={{ padding: "1rem" }}>
          <button onClick={() => setDetailsBook(null)}>← Volver</button>
          {detailsBook.error ? (
            <p>{detailsBook.error}</p>
          ) : (
            <>
              <h2>{detailsBook.title}</h2>
              <p>
                <strong>Autor:</strong> {detailsBook.author}
              </p>
              <img
                src={detailsBook.cover}
                style={{ maxWidth: "200px", marginTop: "1rem" }}
              />
              <p style={{ marginTop: "1rem" }}>{detailsBook.description}</p>
              <a
                href={`https://openlibrary.org${detailsBook.key}`}
                target="_blank"
                rel="noreferrer"
              >
                📖 Ver en OpenLibrary
              </a>
            </>
          )}
        </div>
      )}
    </>
  );
}

function BookCard({ book, onDelete }) {
  return (
    <div className="book">
      <img src={book.cover} alt={`Portada de ${book.title}`} />
      <h3>{book.title}</h3>
      <p>{book.author}</p>
      {onDelete && (
        <button className="remove-btn" onClick={() => onDelete(book.key)}>
          Eliminar
        </button>
      )}
    </div>
  );
}
function ProfilePage({ user, updateUser }) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleUpdate = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const index = users.findIndex((u) => u.email === user.email);
    if (index === -1) return alert("Usuario no encontrado.");

    // Validar contraseña actual
    if (users[index].password !== currentPassword) {
      return alert("La contraseña actual es incorrecta.");
    }

    users[index].name = name;
    if (newPassword.trim()) {
      users[index].password = newPassword;
    }

    localStorage.setItem("users", JSON.stringify(users));
    const updatedUser = { ...users[index] };
    sessionStorage.setItem("user", JSON.stringify(updatedUser));
    updateUser(updatedUser);
    alert("Perfil actualizado.");
    setCurrentPassword("");
    setNewPassword("");
  };

  return (
    <div style={{ padding: "1rem", maxWidth: "500px", margin: "0 auto" }}>
      <h2>👤 Editar Perfil</h2>
      <form onSubmit={handleUpdate}>
        <label>Nombre:</label>
        <input
          type="text"
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
        />
        <label>Email (no editable):</label>
        <input type="email" value={email} disabled />

        <label>Contraseña actual:</label>
        <input
          type="password"
          required
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />

        <label>Nueva contraseña (opcional):</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <button type="submit">Actualizar</button>
      </form>
    </div>
  );
}

export default App;
