import React from "react";

export default function BookCard({ book, onAddToCart }) {
  return (
    <article className="book-card">
      <div className="book-image-wrap">
        <img
          src={book.image || book.img}
          alt={`Обкладинка книги ${book.title}`}
          className="book-image"
        />
      </div>

      <div className="book-info">
        <h3>{book.title}</h3>
        <p><strong>Автор:</strong> {book.author}</p>
        <p><strong>Жанр:</strong> {book.genre}</p>
        <p><strong>Ціна:</strong> {book.price} грн</p>
        {book.rating && <p><strong>Рейтинг:</strong> ⭐ {book.rating}</p>}
      </div>

      <button className="primary-btn" onClick={() => onAddToCart(book)}>
        Додати в кошик
      </button>
    </article>
  );
}