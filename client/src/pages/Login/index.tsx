import React, { useState } from 'react';
import Axios from 'axios';
import './styles.scss';
import { useHistory } from 'react-router-dom';

import { BASE_URL } from '../../constants';

interface Props {
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Login:React.FC<Props> = ({ setIsVisible }) => {
  const history = useHistory();
  const [username, setUername] = useState('');
  const [password, setPassword] = useState('');
  const [userNotExist, setUsetNotExist] = useState(false);
  const [serverError, setServerError] = useState(false);

  Axios.defaults.withCredentials = true;

  // const register = () => {
  //   Axios.post('http://localhost:3001/register', {
  //     username: usernameReg,
  //     password: passwordReg,
  //   }).then((response) => {
  //     // eslint-disable-next-line
  //     console.log(response);
  //   });
  // };

  const login = () => {
    Axios.post(`${BASE_URL}/login`, {
      username,
      password,
    }).then((response) => {
      if (response.data.auth) {
        // eslint-disable-next-line
        console.log(response.data);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.result[0].role);
        localStorage.setItem('username', response.data.result[0].username);
        localStorage.setItem('userID', response.data.result[0].ID);
        history.push('/account');
      } else {
        setUsetNotExist(true);
        setPassword('');
      }
    }).catch(() => {
      setServerError(true);
    });
  };

  return (
    <div className="login">
      <button
        type="button"
        onClick={() => setIsVisible(false)}
        className="login__close"
      >
        <img
          src="./closeIcon.png"
          alt="Close"
        />
      </button>
      <img src="./LoginImage.png" alt="Login" />
      <h1>LOGIN</h1>
      <div className="login__box">
        <img src="./Message.svg" alt="Message" />
        <input
          type="text"
          value={username}
          placeholder="Username"
          onChange={(e) => {
            setServerError(false);
            setUsetNotExist(false);
            setUername(e.target.value);
          }}
        />
      </div>
      <div className="login__box">
        <img src="./Password.svg" alt="Password" />
        <input
          type="password"
          value={password}
          placeholder="Password"
          onChange={(e) => {
            setServerError(false);
            setUsetNotExist(false);
            setPassword(e.target.value);
          }}
        />
      </div>
      { (userNotExist || serverError) && (
        <div className="login__error">
          {userNotExist && "User doesn't exist. Contact admin to get the account"}
          {serverError && 'Server error. Please, try again later...'}
        </div>
      )}
      <button
        type="button"
        onClick={login}
        className="login__button"
      >
        LOGIN
      </button>
    </div>
  );
};
