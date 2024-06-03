'use client'

import { useUser } from './Usercontext';
import UserAccountNav from './UserAccountNav';
import BillingForm from './billingForm';

const UserPage = () => {
  const { user, loading, error } = useUser();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!user) return <p>No user data available.</p>;

  return (
    <>
      <UserAccountNav user={user} />
      
    </>
  );
};

export default UserPage;
