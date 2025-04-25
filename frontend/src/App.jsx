import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/books';

function App() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({ title: '', author: '', publishedOn: '', genre: '', rating: '' });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    axios.get(API).then(res => setBooks(res.data));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await axios.put(`${API}/${editId}`, form);
    } else {
      await axios.post(API, form);
    }
    const res = await axios.get(API);
    setBooks(res.data);
    setForm({ title: '', author: '', publishedOn: '', genre: '', rating: '' });
    setEditId(null);
  };

  const handleEdit = (book) => {
    setForm(book);
    setEditId(book.id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API}/${id}`);
    setBooks(books.filter(b => b.id !== id));
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h1>📚 Book CRUD App</h1>
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required /><br />
        <input name="author" placeholder="Author" value={form.author} onChange={handleChange} required /><br />
        <input type="date" name="publishedOn" value={form.publishedOn} onChange={handleChange} required /><br />
        <input name="genre" placeholder="Genre" value={form.genre} onChange={handleChange} required /><br />
        <input name="rating" type="number" value={form.rating} placeholder="Rating" onChange={handleChange} required /><br />
        <button type="submit">{editId ? 'Update' : 'Add'} Book</button>
      </form>

      <ul>
        {books.map(book => (
          <li key={book.id}>
            <strong>{book.title}</strong> by {book.author} <br />
            📅 {book.publishedOn?.split('T')[0]} | 🎭 {book.genre} | ⭐ {book.rating}
            <div>
              <button onClick={() => handleEdit(book)}>Edit</button>
              <button onClick={() => handleDelete(book.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
