import React, { useEffect, useState } from "react";
import "./App.css";
import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import { collection, getDocs, addDoc } from "firebase/firestore";

import { auth, db } from "./firebase";

import Catalog from "./pages/Catalog";
import CartPage from "./pages/CartPage";
import AccountPage from "./pages/AccountPage";

export default function App() {
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadBooks();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        await loadOrders(currentUser.uid);
      } else {
        setOrders([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const loadBooks = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "books"));
      const booksFromDb = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBooks(booksFromDb);
    } catch (error) {
      console.error("Помилка завантаження книг:", error);
      setMessage("Не вдалося завантажити книги.");
    }
  };

  const loadOrders = async (uid) => {
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${uid}`);
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("Помилка завантаження замовлень:", error);
    }
  };

  const handleRegister = async () => {
    try {
      setMessage("");
      await createUserWithEmailAndPassword(auth, email, password);
      setMessage("Реєстрація успішна.");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    }
  };

  const handleLogin = async () => {
    try {
      setMessage("");
      await signInWithEmailAndPassword(auth, email, password);
      setMessage("Вхід успішний.");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setMessage("Вихід виконано.");
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    }
  };

  const addToCart = (book) => {
    const existingBook = cart.find((item) => item.id === book.id);

    if (existingBook) {
      setCart(
        cart.map((item) =>
          item.id === book.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          id: book.id,
          title: book.title,
          author: book.author,
          price: Number(book.price ?? 0),
          quantity: 1,
        },
      ]);
    }

    setMessage(`Книгу "${book.title}" додано в кошик.`);
  };

  const increaseQuantity = (id) => {
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCart(
      cart
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + Number(item.price ?? 0) * item.quantity,
    0
  );

  const handleCheckout = async () => {
    if (!user) {
      setMessage("Щоб оформити замовлення, потрібно увійти в систему.");
      return;
    }

    if (cart.length === 0) {
      setMessage("Кошик порожній.");
      return;
    }

    try {
      await addDoc(collection(db, "orders"), {
        userId: user.uid,
        userEmail: user.email,
        items: cart.map((item) => ({
          title: item.title,
          author: item.author,
          price: item.price,
          quantity: item.quantity,
        })),
        total: totalPrice,
        createdAt: new Date().toISOString(),
      });

      setCart([]);
      setMessage("Замовлення успішно оформлено.");
      await loadOrders(user.uid);
    } catch (error) {
      console.error("Помилка оформлення замовлення:", error);
      setMessage(error.message);
    }
  };

  return (
    <Router>
      <div className="app">
        <header className="topbar">
          <div className="container topbar-row">
            <div className="brand">
              <span className="brand-icon">📖</span>
              <h1>Amber Pages</h1>
            </div>

            <nav className="nav">
              <Link to="/">Каталог</Link>
              <Link to="/cart" className="cart-link">
                Кошик
                <span className="cart-badge">{cart.length}</span>
              </Link>
              <Link to="/account">Мій акаунт</Link>
            </nav>
          </div>
        </header>

        <main className="container main-content">
          <section className="hero">
            <div className="hero-content">
              <p className="hero-label">Преміальна онлайн-книгарня</p>
              <h2>Знайди свою наступну улюблену книгу</h2>
              <p className="hero-text">
                Каталог сучасних книг з програмування, саморозвитку та штучного
                інтелекту. Обирай книги, додавай у кошик та оформлюй замовлення
                онлайн.
              </p>

              <div className="hero-actions">
                <Link to="/" className="hero-btn">
                  Перейти до каталогу
                </Link>
                <Link to="/account" className="hero-btn hero-btn-secondary">
                  Мій акаунт
                </Link>
              </div>
            </div>
          </section>

          <section className="auth-box">
            <div className="section-title-row">
              <h2>Реєстрація / Вхід</h2>
              <span className={`status-badge ${user ? "online" : "guest"}`}>
                {user ? "У системі" : "Гість"}
              </span>
            </div>

            <div className="auth-form">
              <input
                type="email"
                placeholder="Введіть email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Введіть пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <div className="auth-buttons">
                <button onClick={handleRegister}>Зареєструватися</button>
                <button onClick={handleLogin}>Увійти</button>
                <button onClick={handleLogout} className="secondary-btn">
                  Вийти
                </button>
              </div>
            </div>

            <p className="status-text">
              <strong>Статус:</strong>{" "}
              {user ? `увійшов як ${user.email}` : "гість"}
            </p>

            {message && <p className="message">{message}</p>}
          </section>

          <Routes>
            <Route
              path="/"
              element={<Catalog books={books} onAddToCart={addToCart} />}
            />
            <Route
              path="/cart"
              element={
                <CartPage
                  cartItems={cart}
                  totalPrice={totalPrice}
                  increaseQuantity={increaseQuantity}
                  decreaseQuantity={decreaseQuantity}
                  removeFromCart={removeFromCart}
                  onCheckout={handleCheckout}
                />
              }
            />
            <Route
              path="/account"
              element={<AccountPage user={user} orders={orders} />}
            />
          </Routes>
        </main>

        <footer className="footer">
          <div className="container footer-content">
            <p>© 2026 Amber Pages — онлайн-магазин книг</p>
            <p>React • Firebase • Firestore</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}