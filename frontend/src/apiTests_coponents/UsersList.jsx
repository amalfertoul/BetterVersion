import React from 'react';
import {
  useGetUsersQuery,
  useCreateUserMutation,
} from '../features/users/usersApi';

function UsersList() {
  const { data: users, isLoading, error } = useGetUsersQuery();
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      await createUser(Object.fromEntries(formData));
      e.target.reset();
    } catch (err) {
      console.error('Failed to create user:', err);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Users</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" required />
        <input name="email" type="email" placeholder="Email" required />
        <button type="submit" disabled={isCreating}>
          {isCreating ? 'Creating...' : 'Create User'}
        </button>
      </form>
      
      <ul>
        {users?.data?.map(user => (
          <li key={user.id}>{user.name} - {user.email}</li>
        ))}
      </ul>
    </div>
  );
}

export default UsersList;