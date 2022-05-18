import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import Axios from 'axios';
import { BASE_URL } from '../../constants';
import { Lesson } from '../../types';

const localizer = momentLocalizer(moment);

export const UserContent: React.FC = () => {
  const [userEvents, setEvents] = useState<Lesson[] | undefined>();

  useEffect(() => {
    const getData = async () => {
      Axios.get(`${BASE_URL}/lessons`, {
        params: {
          ID: localStorage.getItem('userID'),
          role: localStorage.getItem('role'),
        },
      }).then((response) => {
        setEvents(response.data.map((item: Lesson) => ({
          title: item.title,
          start: new Date(item.start),
          end: new Date(item.end),
          link: item.link,
        })));
      });
    };

    getData();
  }, []);

  return (
    <section>
      {userEvents !== undefined && (
        <Calendar
          localizer={localizer}
          events={userEvents}
          defaultView="week"
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          onSelectEvent={(e) => {
            window.open(e.link);
          }}
        />
      )}
    </section>
  );
};
