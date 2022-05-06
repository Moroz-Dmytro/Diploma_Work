import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import Axios from 'axios';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useHistory } from 'react-router-dom';

import { BASE_URL } from '../../constants';
import './styles.scss';

const localizer = momentLocalizer(moment);
const myEventsList = [
  {
    start: new Date(),
    end: new Date(),
    title: 'special event',
    link: 'https://meet.jit.si/as',
  },
];

export const MainContent = () => {
  Axios.defaults.withCredentials = true;
  const history = useHistory();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    setUserName(localStorage.getItem('username') || '');

    const chechIfAuth = async () => {
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

    chechIfAuth();
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
          <img src="./logo2.svg" alt="logo" />
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
            <img src="./exit.svg" alt="Exit" />
          </button>
        </div>
      </header>
      <Calendar
        localizer={localizer}
        events={myEventsList}
        defaultView="week"
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        onSelectEvent={(e) => {
          window.open(e.link);
          // eslint-disable-next-line
          console.log(e)
        }}
      />
    </div>
  );
};
