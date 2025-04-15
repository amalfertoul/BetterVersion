import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000/api/users'; // Adapt to your API URL

const UserApiTester = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    username: '',
    fullname: '',
    email: '',
    profile_picture: '',
    password: '',
    role: 'user',
  });
  const [selectedUserId, setSelectedUserId] = useState(null);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await axios.get(API_BASE);
      setUsers(res.data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Create a new user
  const handleCreate = async () => {
    try {
      const data = { ...form };
      if (!data.profile_picture) delete data.profile_picture; // Remove empty profile_picture
      await axios.post(API_BASE, data);
      fetchUsers();
      alert('User created successfully!');
      setForm({
        username: '',
        fullname: '',
        email: '',
        profile_picture: '',
        password: '',
        role: 'user',
      });
    } catch (err) {
      console.error('Error creating user:', err);
    }
  };

  // Update an existing user
  const handleUpdate = async () => {
    if (!selectedUserId) {
      alert('No user selected for update.');
      return;
    }
    try {
      const data = { ...form };
      if (!data.profile_picture) delete data.profile_picture; // Remove empty profile_picture
      if (!data.password) delete data.password; // Do not send empty password
      await axios.put(`${API_BASE}/${selectedUserId}`, data);
      fetchUsers();
      alert('User updated successfully!');
      setSelectedUserId(null);
      setForm({
        username: '',
        fullname: '',
        email: '',
        profile_picture: '',
        password: '',
        role: 'user',
      });
    } catch (err) {
      console.error('Error updating user:', err);
    }
  };

  // Delete a user
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }
    try {
      await axios.delete(`${API_BASE}/${id}`);
      fetchUsers();
      alert('User deleted successfully!');
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectUser = (user) => {
    setSelectedUserId(user.id);
    setForm({
      username: user.username,
      fullname: user.fullname,
      email: user.email,
      profile_picture: user.profile_picture || '',
      password: '', // Password should not be pre-filled for security reasons
      role: user.role,
    });
  };

  return (
    <div className="p-4">
      <h2>👤 Users API Tester</h2>

      <div>
        <input name="username" placeholder="Username" onChange={handleChange} value={form.username || ''} />
        <input name="fullname" placeholder="Fullname" onChange={handleChange} value={form.fullname || ''} />
        <input name="email" placeholder="Email" onChange={handleChange} value={form.email || ''} />
        <input name="profile_picture" placeholder="Profile picture URL" onChange={handleChange} value={form.profile_picture || ''} />
        <input name="password" placeholder="Password" type="password" onChange={handleChange} value={form.password || ''} />
        <select name="role" onChange={handleChange} value={form.role}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        {selectedUserId ? (
          <button onClick={handleUpdate}>Update User</button>
        ) : (
          <button onClick={handleCreate}>Create User</button>
        )}
      </div>

      <h3>📋 Users List</h3>
      <ul>
        {users.map((u) => (
          <li key={u.id}>
            {u.fullname} ({u.email}) - {u.role}
            <button onClick={() => handleSelectUser(u)}>Edit</button>
            <button onClick={() => handleDelete(u.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserApiTester;
