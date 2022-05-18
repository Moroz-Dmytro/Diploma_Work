import React from 'react';
import { NavLink, Route } from 'react-router-dom';
import { CreateGroup } from './CreateGroup';
import { CreateLesson } from './CreateLesson';
import { CreateSubject } from './CreateSubject';
import { CreateUser } from './CreateUser';

import './styles.scss';

export const AdminContent: React.FC = () => {
  return (
    <div className="content">
      <section className="sidebar">
        <ul className="sidebar__navbar">
          <NavLink
            to="/account"
            className="sidebar__element-link"
            activeClassName="sidebar__element--active"
            exact
          >
            <li className="sidebar__element">
              <img src="/userLogo.svg" alt="User" className="sidebar__img" />
              Create User
            </li>
          </NavLink>
          <NavLink
            to="/account/group"
            className="sidebar__element-link"
            activeClassName="sidebar__element--active"
            exact
          >
            <li className="sidebar__element">
              <img src="/Group.svg" alt="User" className="sidebar__img" />
              Create Group
            </li>
          </NavLink>
          <NavLink
            to="/account/subject"
            className="sidebar__element-link"
            activeClassName="sidebar__element--active"
            exact
          >
            <li className="sidebar__element">
              <img src="/Subject.svg" alt="User" className="sidebar__img" />
              Create Subject
            </li>
          </NavLink>
          <NavLink
            to="/account/lesson"
            className="sidebar__element-link"
            activeClassName="sidebar__element--active"
            exact
          >
            <li className="sidebar__element">
              <img src="/Lesson.svg" alt="User" className="sidebar__img" />
              Create Lesson
            </li>
          </NavLink>
        </ul>
      </section>

      <main className="content__main">
        <Route path="/account" component={CreateUser} exact />
        <Route path="/account/group" component={CreateGroup} exact />
        <Route path="/account/subject" component={CreateSubject} exact />
        <Route path="/account/lesson" component={CreateLesson} exact />
      </main>
    </div>
  );
};
