import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { uuid } from 'uuidv4';
import { message } from 'antd';
import 'antd/dist/antd.css';

import './styles.scss';
import { BASE_URL, JITSI } from '../../constants';
import { Group, Subject, Teacher } from '../../types';

export const CreateLesson: React.FC = () => {
  const [allSub, setAllSub] = useState([]);
  const [subject, setSubject] = useState(1);
  const [allTeachers, setAllTeachers] = useState([]);
  const [teacher, setTeacher] = useState(1);
  const [allGroups, setAllGroups] = useState([]);
  const [group, setGroup] = useState(1);
  const [startTime, setStartTime] = useState(new Date().toString());
  const [endTime, setEndTime] = useState(new Date().toString());

  Axios.defaults.withCredentials = true;

  const onSubmit = () => {
    const jitsiURL = `${JITSI}/${uuid()}`;

    Axios.post(`${BASE_URL}/createLesson`, {
      subject,
      group,
      teacher,
      startTime: `${startTime.split('T').join(' ')}:00`,
      endTime: `${endTime.split('T').join(' ')}:00`,
      jitsiURL,
    }).then((response) => {
      if (response.data.insertId) {
        message.success('Lesson Created!', 5);
        setSubject(1);
        setGroup(1);
        setTeacher(1);
      } else {
        message.error(
          'Ups... Please check again all fields!', 5,
        );
      }
    });
  };

  useEffect(() => {
    Axios.get(`${BASE_URL}/groups`).then((response) => {
      setAllGroups(response.data);
    });
    Axios.get(`${BASE_URL}/teachers`).then((response) => {
      setAllTeachers(response.data);
    });
    Axios.get(`${BASE_URL}/subjects`).then((response) => {
      setAllSub(response.data);
    });
  }, []);

  return (
    <div className="create">
      <h1>CREATE LESSON</h1>
      <div className="create__box">
        <img src="/SubjectSmall.svg" alt="Subject" />
        <select
          name="subject"
          value={subject}
          onChange={(e) => {
            setSubject(+e.target.value);
          }}
        >
          {allSub.map((item: Subject) => (
            <option value={item.ID} key={item.ID}>{item.Sub_name}</option>
          ))}
        </select>
      </div>
      <div className="create__box">
        <img src="/userInfo.svg" alt="Password" />
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
      <div className="create__box">
        <img src="/userInfo.svg" alt="Password" />
        <select
          name="teacher"
          value={teacher}
          onChange={(e) => {
            setTeacher(+e.target.value);
          }}
        >
          {allTeachers.map((item: Teacher) => (
            <option value={item.ID} key={item.ID}>{`${item.name} ${item.surname}`}</option>
          ))}
        </select>
      </div>

      <label htmlFor="meeting-time">
        Start time
        <div className="create__box">
          <img src="/Time.svg" alt="Start time" />
          <input
            type="datetime-local"
            id="meeting-time"
            name="meeting-time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            min="2022-05-18T00:00"
            max="2042-12-31T00:00"
          />
        </div>
      </label>

      <label htmlFor="meeting-time-end">
        End time
        <div className="create__box">
          <img src="/Time.svg" alt="End Time" />
          <input
            type="datetime-local"
            id="meeting-time-end"
            name="meeting-time-end"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            min="2022-05-18T00:00"
            max="2042-12-31T00:00"
          />
        </div>
      </label>
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
