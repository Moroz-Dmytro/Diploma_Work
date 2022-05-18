import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useHistory } from 'react-router-dom';

import { BASE_URL } from '../../constants';
import './styles.scss';
import { UserContent } from '../UserContent';
import { AdminContent } from '../AdminContent';

export const MainContent = () => {
  Axios.defaults.withCredentials = true;
  const history = useHistory();
  const userRole = localStorage.getItem('role');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    setUserName(localStorage.getItem('username') || '');

    const checkIfAuth = async () => {
      Axios.get(`${BASE_URL}/isUserAuth`, {
        headers: {
          'x-access-token': localStorage.getItem('token'),
        },
      }).then((response) => {
        if (response.data.auth === false) {
          history.push('/');
        }
      });
    };

    checkIfAuth();
  }, []);
  const SingOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    localStorage.removeItem('userID');
    history.push('/');
  };

  return (
    <div>
      <header className="pageHeader">
        <div className="pageHeader__logo">
          <img src="/logo2.svg" alt="logo" />
          <span className="pageHeader__logo-text">OnlineSchool</span>
        </div>
        <div className="pageHeader__userInfo">
          <div className="pageHeader__username">
            {userName}
          </div>
          <div className="pageHeader__userLogo">
            {userName[0]?.toUpperCase()}
          </div>
          <button className="pageHeader__exit" type="button" onClick={SingOut}>
            Sign out
            <img src="/exit.svg" alt="Exit" />
          </button>
        </div>
      </header>
      {userRole === 'admin' ? (
        <AdminContent />
      ) : (
        <UserContent />
      )}
    </div>
  );
};
