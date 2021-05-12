import React from 'react';
import Toggle from './Toggle'

const handleDayChange = (day, state, setState) => (e) => {
  let i = e.target.getAttribute('data-index');
  let value =
    e.target.type === 'checkbox' ? e.target.checked : e.target.value;

  let meals = [...state.mealRequest]; // spreads array from mealRequest: [] into an array called meal
  let meal = { ...meals[i] }; // takes a meal out of the mealRequest array that matches the index we're at
  meal.days[day] = value;

  meals[i] = meal; // puts meal[i] back into mealRequest array

  setState({
    ...state,
    mealRequest: [...meals],
    buttonText: 'Submit',
    // pickupCodeAdd: codes,
    success: '',
    error: '',
  }); //puts ...mealRequest with new meal back into mealRequest: []
};

const SelectDaysPanel = ({ i, x, auth, state, setState }) => {
  return (
    <>
      {(process.browser &&
        auth.role === 'admin' &&
        x.meal === '2on 3off' &&
        x.group === 'a-group') ||
      (auth.role === 'admin' &&
        x.meal === 'Standard Onsite' &&
        x.group === 'a-group') ? (
        <>
          <hr />
          <div className="form-control ">
            <div className="row p-1">

              {/* <Toggle
                                toggleKey={i}
                                dataIndex={i}
                                isOn={x.days.sunday}
                                toggleId="sunday"
                                toggleName="Sunday"
                                handleToggle={handleDayChange('sunday')}
                              ></Toggle> */}
                              
              <Toggle
                toggleKey={i}
                dataIndex={i}
                isOn={x.days.monday}
                toggleId="monday"
                toggleName="Monday"
                handleToggle={handleDayChange('monday', state, setState)}
              ></Toggle>
              <Toggle
                toggleKey={i}
                dataIndex={i}
                isOn={x.days.tuesday}
                toggleId="tuesday"
                toggleName="Tuesday"
                handleToggle={handleDayChange('tuesday', state, setState)}
              ></Toggle>
              {/* <Toggle
                                  toggleKey={i}
                                  dataIndex={i}
                                  isOn={x.days.wednesday}
                                  toggleId="wednesday"
                                  toggleName="Wednesday"
                                  handleToggle={handleDayChange('wednesday')}
                                ></Toggle> */}
              {/* <Toggle
                                  toggleKey={i}
                                  dataIndex={i}
                                  isOn={x.days.thursday}
                                  toggleId="thursday"
                                  toggleName="Thursday"
                                  handleToggle={handleDayChange('thursday')}
                                ></Toggle>
                                <Toggle
                                  toggleKey={i}
                                  dataIndex={i}
                                  isOn={x.days.friday}
                                  toggleId="friday"
                                  toggleName="Friday"
                                  handleToggle={handleDayChange('friday')}
                                ></Toggle> */}
              {/* <Toggle
                                toggleKey={i}
                                dataIndex={i}
                                isOn={x.days.saturday}
                                toggleId="saturday"
                                toggleName="Saturday"
                                handleToggle={handleDayChange('saturday')}
                              ></Toggle> */}
            </div>
          </div>
        </>
      ) : (process.browser &&
          auth.role === 'admin' &&
          x.meal === '2on 3off' &&
          x.group === 'b-group') ||
        (auth.role === 'admin' &&
          x.meal === 'Standard Onsite' &&
          x.group === 'b-group') ? (
        <>
          <hr />
          <div className="form-control ">
            <div className="row p-1">
              {/* <Toggle
                                toggleKey={i}
                                dataIndex={i}
                                isOn={x.days.sunday}
                                toggleId="sunday"
                                toggleName="Sunday"
                                handleToggle={handleDayChange('sunday')}
                              ></Toggle> */}
              {/* <Toggle
                                  toggleKey={i}
                                  dataIndex={i}
                                  isOn={x.days.monday}
                                  toggleId="monday"
                                  toggleName="Monday"
                                  handleToggle={handleDayChange('monday')}
                                ></Toggle> */}
              {/* <Toggle
                                  toggleKey={i}
                                  dataIndex={i}
                                  isOn={x.days.tuesday}
                                  toggleId="tuesday"
                                  toggleName="Tuesday"
                                  handleToggle={handleDayChange('tuesday')}
                                ></Toggle> */}
              <Toggle
                toggleKey={i}
                dataIndex={i}
                isOn={x.days.wednesday}
                toggleId="wednesday"
                toggleName="Wednesday"
                handleToggle={handleDayChange('wednesday', state, setState)}
              ></Toggle>
              <Toggle
                toggleKey={i}
                dataIndex={i}
                isOn={x.days.thursday}
                toggleId="thursday"
                toggleName="Thursday"
                handleToggle={handleDayChange('thursday', state, setState)}
              ></Toggle>
              {/* <Toggle
                                  toggleKey={i}
                                  dataIndex={i}
                                  isOn={x.days.friday}
                                  toggleId="friday"
                                  toggleName="Friday"
                                  handleToggle={handleDayChange('friday')}
                                ></Toggle> */}
              {/* <Toggle
                                toggleKey={i}
                                dataIndex={i}
                                isOn={x.days.saturday}
                                toggleId="saturday"
                                toggleName="Saturday"
                                handleToggle={handleDayChange('saturday')}
                              ></Toggle> */}
            </div>
          </div>
        </>
      ) : (
        ''
      )}
    </>
  );
};

export default SelectDaysPanel;
