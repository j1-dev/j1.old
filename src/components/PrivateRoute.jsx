// This is used to determine if a user is authenticated and
// if they are allowed to visit the page they navigated to.

// If they are: they proceed to the page
// If not: they are redirected to the login page.
import React from 'react';
import { useAuth } from '../api/authContext';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) return <h1>loading</h1>;

  if (!user) {
    return <Navigate to="/Login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoutes;
