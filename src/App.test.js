import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Catalog from './pages/Catalog';
import CartPage from './pages/CartPage';
import AccountPage from './pages/AccountPage';
import './App.css'; 

function App() {
  return (
    <Router>
      <header>
        <div className="container" style={{ textAlign: 'center', padding: '20px', background: '#222', color: 'white' }}>
          <h1>📚 Онлайн-магазин книг</h1>
          <nav>
            <ul style={{ display: 'flex', justifyContent: 'center', gap: '30px', listStyle: 'none', padding: 0 }}>
              {/* Link замість <a> забезпечує перехід без перезавантаження сторінки */}
              <li><Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Каталог</Link></li>
              <li><Link to="/cart" style={{ color: 'white', textDecoration: 'none' }}>Кошик</Link></li>
              <li><Link to="/account" style={{ color: 'white', textDecoration: 'none' }}>Мій акаунт</Link></li>
            </ul>
          </nav>
        </div>
      </header>
      
      <main className="container" style={{ padding: '40px 20px' }}>
        <Routes>
          <Route path="/" element={<Catalog />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/account" element={<AccountPage />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;