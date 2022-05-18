import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { message } from 'antd';
import 'antd/dist/antd.css';

import './styles.scss';
import { BASE_URL } from '../../constants';
import { Group } from '../../types';

export const CreateUser: React.FC = () => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [username, setUername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin');
  const [allGroups, setAllGroups] = useState([]);
  const [group, setGroup] = useState(1);

  Axios.defaults.withCredentials = true;

  const onSubmit = () => {
    Axios.post(`${BASE_URL}/createUser`, {
      name,
      surname,
      username,
      password,
      role,
    }).then((response) => {
      if (response.data.insertId) {
        message.success('User Created!', 5);
        setName('');
        setSurname('');
        setUername('');
        setPassword('');
        setRole('admin');
        setGroup(1);
      } else {
        message.error('Ups... Please check again all fields or maybe such user already exist!', 5);
      }

      if (role === 'student') {
        Axios.post(`${BASE_URL}/createStudent`, {
          User_ID: response.data.insertId,
          group,
        });
      }

      if (role === 'teacher') {
        Axios.post('http://localhost:3001/createTeacher', {
          User_ID: response.data.insertId,
        });
      }
    });
  };

  useEffect(() => {
    Axios.get(`${BASE_URL}/groups`).then((response) => {
      setAllGroups(response.data);
    });
  }, []);

  return (
    <div className="create">
      <h1>CREATE USER</h1>
      <div className="create__box">
        <img src="./UserInfo.svg" alt="Message" />
        <input
          type="text"
          value={name}
          placeholder="Name"
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
      </div>
      <div className="create__box">
        <img src="./UserInfo.svg" alt="Message" />
        <input
          type="text"
          value={surname}
          placeholder="Surname"
          onChange={(e) => {
            setSurname(e.target.value);
          }}
        />
      </div>
      <div className="create__box">
        <img src="./Message.svg" alt="Message" />
        <input
          type="text"
          value={username}
          placeholder="Username"
          onChange={(e) => {
            setUername(e.target.value);
          }}
        />
      </div>
      <div className="create__box">
        <img src="./Password.svg" alt="Password" />
        <input
          type="password"
          value={password}
          placeholder="Password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
      </div>
      <div className="create__box">
        <img src="./userInfo.svg" alt="Password" />
        <select
          name="role"
          value={role}
          onChange={(e) => {
            setRole(e.target.value);
          }}
        >
          <option value="admin">Admin</option>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>
      </div>
      {role === 'student' && (
        <div className="create__box">
          <img src="./userInfo.svg" alt="Password" />
          <select
            name="group"
            value={group}
            onChange={(e) => {
              setGroup(+e.target.value);
            }}
          >
            {allGroups.map((item: Group) => (
              <option value={item.ID} key={item.ID}>{item.Name}</option>
            ))}
          </select>
        </div>
      )}
      { /* (userNotExist || serverError) && (
        <div className="login__error">
          {userNotExist && "User doesn't exist. Contact admin to get the account"}
          {serverError && 'Server error. Please, try again later...'}
        </div>
      ) */ }
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
