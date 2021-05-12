import { useRef, useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import styles from '../styles/Home.module.css';

// disabled dates on calendar
const handleDisabledDates = ({ date, view }) =>
  date.getDay() !== 1 ||
  date.getMonth() === 5 ||
  (date.getMonth() === 6 && date !== '2021-04-31');

// handles lead time for orders
let twoWeeksFromNow = new Date();
twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14);

const MealRequestCalanderPanel = ({ pickupDate, auth, state, setState }) => {
  // Calendar
  const [showSearch, setShowSearch] = useState(false);
  const calendarButton = useRef();

  // shows and hides calendar
  useEffect(() => {
    const handleClick = (event) => {
      if (
        calendarButton.current &&
        !calendarButton.current.contains(event.target)
      ) {
        setShowSearch(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  });

  // changes pickup date
  const onDateChange = (pickupDate, state, setState) => {
    setState({ ...state, pickupDate: moment(pickupDate).format('l') });
    setShowSearch(!showSearch);
  };

  return (
    <div className="row">
      <div className="col-md-9">
        <span ref={calendarButton}>
          <h4 className="text-dark">
            Meal Request for the Week of:{' '}
            {pickupDate && (
              <>
                <span onClick={() => setShowSearch(!showSearch)}>
                  {moment(state.pickupDate).format('MMMM Do')}
                  &nbsp; <i className="text-danger far fa-calendar-check"></i>
                </span>
              </>
            )}
          </h4>
          {pickupDate === '' && (
            <button
              className={
                'btn btn-sm btn-outline-secondary ' + styles.buttonshadow
              }
              onClick={() => setShowSearch(!showSearch)}
            >
              <i class="far fa-calendar-alt"></i> &nbsp;&nbsp; Select Date
            </button>
          )}

          {auth.role === 'admin'
            ? showSearch && (
                <Calendar
                  onChange={(e) => onDateChange(e, state, setState)}
                  tileDisabled={handleDisabledDates}
                  value={''}
                />
              )
            : showSearch && (
                <Calendar
                  onChange={(e) => onDateChange(e, state, setState)}
                  tileDisabled={handleDisabledDates}
                  defaultValue={twoWeeksFromNow}
                  minDate={twoWeeksFromNow}
                  value={twoWeeksFromNow}
                />
              )}
        </span>
      </div>
    </div>
  );
};

export default MealRequestCalanderPanel;
