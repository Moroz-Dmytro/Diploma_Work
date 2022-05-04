import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import Axios from 'axios';
import { useHistory } from 'react-router-dom';

import { Login } from '../Login';
import { BASE_URL } from '../../constants';

import './styles.scss';

export const MainPage: React.FC<{}> = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const history = useHistory();

  Axios.defaults.withCredentials = true;

  useEffect(() => {
    const chechIfAuth = async () => {
      Axios.get(`${BASE_URL}/isUserAuth`, {
        headers: {
          'x-access-token': localStorage.getItem('token'),
        },
      }).then((response) => {
        if (response.data.auth !== false) {
          history.push('/account');
        }
      });
    };

    chechIfAuth();
  }, []);

  return (
    <section className="page">
      <div className={cn({ 'mute--off': !isModalVisible }, { 'mute--on': isModalVisible })}></div>
      <header className="header page__header">
        <div className="header__logo">
          <img src="./logo.svg" alt="logo" />
          <span className="header__logo-text">OnlineSchool</span>
        </div>
        <button
          type="button"
          className="loginButton"
          onClick={() => setIsModalVisible(true)}
        >
          Login
        </button>
      </header>
      <main className="main">
        <img src="./mainImage.png" alt="Education" className="mainImage" />
        <article className="main__textContent">
          <div className="main__header">
            Online meetings, with real people
          </div>
          <div className="main__article">
            Visit your classes online, and don&apos;t waste time on the road to your university.
            All your groupmates in this app.
            Keep studying in difficult times and stay safe.
          </div>
        </article>
      </main>
      {isModalVisible && <Login setIsVisible={setIsModalVisible} />}
    </section>
  );
};
