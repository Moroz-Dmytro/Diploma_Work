import React, { useState } from 'react';
import Axios from 'axios';
import { message } from 'antd';
import 'antd/dist/antd.css';

import './styles.scss';
import { BASE_URL } from '../../constants';

export const CreateGroup: React.FC = () => {
  const [name, setName] = useState('');

  Axios.defaults.withCredentials = true;

  const onSubmit = () => {
    Axios.post(`${BASE_URL}/createGroup`, {
      name,
    }).then((response) => {
      if (response.data.insertId) {
        message.success('Group Created!', 5);
        setName('');
      } else {
        message.error('Ups... Something went wrong or group exist!', 5);
      }
    });
  };

  return (
    <div className="create">
      <img src="/LoginImage.png" alt="Login" />
      <h1>CREATE GROUP</h1>
      <div className="create__box">
        <img src="/UserInfo.svg" alt="Message" />
        <input
          type="text"
          value={name}
          placeholder="Group name"
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
      </div>
      <button
        type="button"
        onClick={onSubmit}
        className="login__button"
      >
        CREATE
      </button>
    </div>
  );
};
