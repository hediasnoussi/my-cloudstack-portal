import React from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';

const RoleBasedAccess = ({ children, allowedRoles = [] }) => {
  const { user } = useAuth();
  
  if (!user || allowedRoles.length === 0) {
    return null;
  }
  
  if (allowedRoles.includes(user.role)) {
    return <>{children}</>;
  }
  
  return null;
};

export default RoleBasedAccess; 