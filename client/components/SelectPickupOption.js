import React from 'react';

const handlePickupOption = (i, e, state, setState) => {
  // handles pickup options (all, breakfast only, lunch only) select
  let meals = [...state.mealRequest]; // spreads array from mealRequest: [] into an array called meal
  let meal = { ...meals[i] }; // takes a meal out of the mealRequest array that matches the index we're at
  meal.pickupOption = e.target.value;

  meals[i] = meal;

  let codes = [...state.pickupCodeAdd]; // spreads array from mealRequest: [] into an array called meal
  let code = { ...codes[i] }; // takes a meal out of the mealRequest array that matches the index we're at
  let input = e.target.value;
  let frontCode = ''; // TODO refactor and get rid of this random variable

  switch (input) {
    case 'Breakfast Only':
      frontCode = 'B';
      break;
    case 'Lunch Onsite / Breakfast Pickup':
      frontCode = 'B';
      break;
    default:
      break;
  }
  code = frontCode;
  codes[i] = code;

  setState({
    ...state,
    mealRequest: [...meals],
    pickupTime: '',
    buttonText: 'Submit',
    pickupCodeAdd: codes,
    success: '',
    error: '',
  });
};

const selectAdminPickupOptions = (i, state, setState) => (
  <>
    <div key={state.mealRequest[i].student} className="form-group">
      <select
        type="select"
        data-index={i}
        defaultValue={state.mealRequest[i].pickupOption}
        value={state.mealRequest[i].pickupOption}
        onChange={(e) => handlePickupOption(i, e, state, setState)}
        className="form-control"
      >
        <option selected value={'Breakfast and Lunch'}>
          Breakfast and Lunch
        </option>
        <option value={'Breakfast Only'}>Breakfast Only</option>
        <option value={'Lunch Only'}>Lunch Only</option>
        <option value={'Lunch Onsite'}>Lunch Onsite</option>
        <option value={'Lunch Onsite / Breakfast Pickup'}>
          Lunch Onsite / Breakfast Pickup
        </option>
      </select>
      <div className="p-1"></div>
    </div>
  </>
);

const selectPickupLunchOnlyOption = (i, state, setState) => (
  <>
    <div key={state.mealRequest[i].student} className="form-group">
      <select
        type="select"
        defaultValue={state.mealRequest[i].pickupOption}
        value={state.mealRequest[i].pickupOption}
        data-index={i}
        onChange={(e) => handlePickupOption(i, e, state, setState)}
        className="form-control"
      >
        {' '}
        <option selected value={'Lunch Only'}>
          Lunch Only
        </option>
      </select>
      <div className="p-1"></div>
    </div>
  </>
);

const selectPickupOption = (i, state, setState) => (
  <>
    <div key={state.mealRequest[i].student} className="form-group">
      <select
        type="select"
        defaultValue={state.mealRequest[i].pickupOption}
        // value={state.mealRequest[i].pickupOption}
        data-index={i}
        onChange={(e) => handlePickupOption(i, e, state, setState)}
        className="form-control"
      >
        {' '}
        <option selected value={'Breakfast and Lunch'}>
          Breakfast and Lunch
        </option>
        <option value={'Breakfast Only'}>Breakfast Only</option>
        <option value={'Lunch Only'}>Lunch Only</option>
      </select>
      <div className="p-1"></div>
    </div>
  </>
);

const selectPickupLunchOnsiteBreakfastOffsiteOption = (i, state, setState) => (
  <>
    <div key={state.mealRequest[i].student} className="form-group">
      <select
        type="select"
        defaultValue={state.mealRequest[i].pickupOption}
        value={state.mealRequest[i].pickupOption}
        data-index={i}
        onChange={(e) => handlePickupOption(i, e, state, setState)}
        className="form-control"
      >
        {' '}
        <option selected value={'Lunch Onsite'}>
          Lunch Onsite
        </option>
        <option value={'Lunch Onsite / Breakfast Pickup'}>
          Lunch Onsite / Breakfast Pickup
        </option>
      </select>
      <div className="p-1"></div>
    </div>
  </>
);

const select2on3offOption = (i, state, setState) => (
  <>
    <div key={state.mealRequest[i].student} className="form-group">
      <select
        type="select"
        defaultValue={state.mealRequest[i].pickupOption}
        value={state.mealRequest[i].pickupOption}
        data-index={i}
        onChange={(e) => handlePickupOption(i, e, state, setState)}
        className="form-control"
      >
        {' '}
        {/* <option value={'Lunch Onsite'}>
          Lunch Onsite
        </option> */}
        <option selected value={'Two Onsite / Three Breakfast and Lunches'}>
          Two Onsite / Three Breakfast and Lunches
        </option>
      </select>
      <div className="p-1"></div>
    </div>
  </>
);

const SelectPickupOption = ({ i, x, state, auth, user, setState }) => {
  return (
    <>
      {x.meal !== '2on 3off'
        ? auth.role === 'admin'
          ? selectAdminPickupOptions(i, state, setState)
          : x.meal != 'None'
          ? state.students[i].group === 'distance-learning'
            ? x.meal === 'Gluten Free' ||
              x.meal === 'Gluten Free Dairy Free' ||
              x.meal === 'Standard Dairy Free' ||
              x.meal === 'Vegan' ||
              user.students[i].foodAllergy.egg === true ||
              user.students[i].foodAllergy.soy === true ||
              user.students[i].foodAllergy.dairy === true ||
              user.students[i].foodAllergy.gluten === true
              ? selectPickupLunchOnlyOption(i, state, setState)
              : selectPickupOption(i, state, setState) // if not distance learning then:
            : selectPickupLunchOnsiteBreakfastOffsiteOption(i, state, setState)
          : null
        : null}
      {x.meal === '2on 3off' && select2on3offOption(i, state, setState)}
    </>
  );
};

export default SelectPickupOption;
