import React from 'react';
import { gql, useQuery } from '@apollo/client';

const allUsersQuery = gql`
  {
    allUsers {
      id
      email
    }
  }
`;

const Home = () => {
  const {
    loading, error, data = {
      allUsers: [],
    },
  } = useQuery(allUsersQuery);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error..;</p>;
  return (
    data.allUsers.map((user) => <h1 key={user.id}>{user.email}</h1>)
  );
};

export default Home;
