import React, { useMemo, useState } from "react";
import BookCard from "../components/BookCard";

export default function Catalog({ books, onAddToCart }) {
  const [filter, setFilter] = useState("Всі");

  const authors = [...new Set(books.map((book) => book.author).filter(Boolean))];
  const genres = [...new Set(books.map((book) => book.genre).filter(Boolean))];

  const filteredBooks = useMemo(() => {
    if (filter === "Всі") return books;
    return books.filter(
      (book) => book.genre === filter || book.author === filter
    );
  }, [books, filter]);

  return (
    <section id="catalog" className="panel">
      <h2 className="section-heading">Каталог книг</h2>

      <div className="filters">
        <button onClick={() => setFilter("Всі")}>Всі книги</button>

        {genres.map((genre) => (
          <button key={genre} onClick={() => setFilter(genre)}>
            {genre}
          </button>
        ))}

        {authors.map((author) => (
          <button key={author} onClick={() => setFilter(author)}>
            Автор: {author}
          </button>
        ))}
      </div>

      <div className="books-grid">
        {filteredBooks.length === 0 ? (
          <p className="empty-text">Книги не знайдено.</p>
        ) : (
          filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} onAddToCart={onAddToCart} />
          ))
        )}
      </div>
    </section>
  );
}