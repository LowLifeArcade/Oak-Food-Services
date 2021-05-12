import React from 'react';
import styles from '../styles/Home.module.css';
import { showSuccessMessage, showErrorMessage } from '../helpers/alerts';

const submit = (
  mealRequest,
  pickupCodeAdd,
  pickupCodeInput,
  auth,
  userCode,
  state,
  setState
) => {
  // TODO: refactor this into useEffect on CREATE page 
  // localStorage.removeItem('search-date');
  const newPickupCodeAdd = pickupCodeAdd.filter((code) => code != 'None'); // bad code

  let length = mealRequest // good code
    .filter((meal) => meal.meal != 'None')
    .filter((meal) => meal.pickupOption != 'Lunch Onsite').length;

  let newPickupCode = '';

  auth.role === 'admin' // turnary to configure code format 'good code'
    ? (newPickupCode =
        (newPickupCodeAdd.join('') != ''
          ? newPickupCodeAdd.join('') + '-'
          : '') +
        (pickupCodeInput != '' ? pickupCodeInput : userCode) +
        '-0' +
        length)
    : (newPickupCode =
        (newPickupCodeAdd.join('') != ''
          ? newPickupCodeAdd.join('') + '-'
          : '') +
        userCode +
        '-0' +
        length);

  setState({
    ...state,
    pickupCode: newPickupCode,
    pickupCodeAdd: newPickupCodeAdd,
  });
};

const SubmitButton = ({
  mealRequest,
  pickupCodeAdd,
  pickupCodeInput,
  auth,
  userCode,
  success,
  error,
  state,
  setState,
  handleSubmit,
  handleAdminSubmit,
  token,
}) => {
  return (
    <>
      <form onSubmit={auth.role === 'admin' ? handleAdminSubmit : handleSubmit}>
        {success && showSuccessMessage(success)}
        {error && showErrorMessage(error)}
        <div>
          <button
            disabled={!token}
            className={'btn  ' + styles.button}
            onClick={() =>
              submit(
                mealRequest,
                pickupCodeAdd,
                pickupCodeInput,
                auth,
                userCode,
                state,
                setState
              )
            }
            type="submit"
          >
            <i class="far fa-paper-plane"></i> &nbsp;&nbsp;
            {auth || token ? state.buttonText : 'Login to Make Request'}
          </button>
        </div>
      </form>
    </>
  );
};

export default SubmitButton;
