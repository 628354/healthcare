import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckComplete, setIsCheckComplete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const localUser = localStorage.getItem('user');
    //const userObj = JSON.parse(localUser);
   // console.log(localUser);
    
    if (!localUser) {
      setIsLoggedIn(false);
      navigate('/application/login');
    } else {
      setIsLoggedIn(true);
    }

    // Set the check as complete
    setIsCheckComplete(true);
  }, [navigate]);

  return <>{isCheckComplete && isLoggedIn ? children : null}</>;
}

export default ProtectedRoute;
