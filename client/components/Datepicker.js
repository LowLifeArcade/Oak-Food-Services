import React from 'react';
import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const Datepicker = (props) => {
  const [date, setDate] = useState(new Date());

  const onDateChange = (date) => {
    setDate(date);
  };

  return (
    <div className="date-picker ">
      <Calendar
        defaultView={props.defaultView}
        showWeekNumbers={props.showWeekNumbers}
        onChange={onDateChange}
        value={date}
      />
    </div>
  );
};

export default Datepicker;
