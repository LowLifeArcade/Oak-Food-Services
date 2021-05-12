import React from 'react';

const handlePickupTimeChange = (e, state, setState) => {
  setState({
    ...state,
    pickupTime: e.target.value,
    buttonText: 'Submit',
    success: '',
    error: '',
  });
};

const selectPickupTimeCafeteriaOnly = (state, setState, auth, pickupTime) => (
  <>
    <div>
      <div className="">
        <select
          type="select"
          value={pickupTime}
          onChange={(e) => handlePickupTimeChange(e, state, setState)}
          className="form-control"
        >
          {' '}
          <option disabled value="">
            Choose an option
          </option>
          {auth.role === 'admin' && <option value={'7am-9am'}>7am-9am</option>}
          {auth.role === 'admin' && (
            <option value={'11am-1pm'}>11am-1pm</option>
          )}
          {auth.role === 'admin' && <option value={'4pm-6pm'}>4pm-6pm</option>}
          <option value={'Cafeteria'}>Student Cafeteria Lunch Onsite</option>
        </select>
        <div className="p-1"></div>
      </div>
    </div>
  </>
);

const selectPickupTime = (state, setState, auth, pickupTime) => (
  <>
    <div>
      <div className="">
        <select
          type="select"
          value={pickupTime}
          onChange={(e) => handlePickupTimeChange(e, state, setState)}
          className="form-control"
        >
          {' '}
          <option disabled value="">
            Choose an option
          </option>
          <option value={'7am-9am'}>7am-9am</option>
          <option value={'11am-1pm'}>11am-1pm</option>
          <option value={'4pm-6pm'}>4pm-6pm</option>
          {auth.role === 'admin' && (
            <option value={'Cafeteria'}>Student Cafeteria Lunch Onsite</option>
          )}
        </select>
        <div className="p-1"></div>
      </div>
    </div>
  </>
);

const SelectPickupTime = ({
  pickupTime,
  auth,
  mealRequest,
  state,
  setState,
}) => {
  return (
    <>
      {mealRequest
        .filter((meal) => meal.meal !== 'None')
        .every(
          (meal) =>
            meal.meal == 'Standard Onsite' &&
            meal.pickupOption == 'Lunch Onsite'
        ) ? (
        <div className="form-group">
          <label htmlFor="" className="text-muted">
            Pickup at Cafeteria
          </label>
          {selectPickupTimeCafeteriaOnly(state, setState, auth, pickupTime)}
          {pickupTime != 'Cafeteria' &&
            setState({
              // quick fix but deservers a refactor and figure out a better solution
              ...state,
              pickupTime: 'Cafeteria',
            })}
        </div>
      ) : (
        <div className="form-group">
          <label htmlFor="" className="text-muted">
            Pickup Time
          </label>
          {selectPickupTime(state, setState, auth, pickupTime)}
        </div>
      )}
    </>
  );
};

export default SelectPickupTime;
