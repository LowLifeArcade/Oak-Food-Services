import React from 'react';
import PropTypes from 'prop-types';
import styles from '../styles/Home.module.css';

const addMeal = (
  i,
  group,
  foodAllergy,
  state,
  setState,
  user,
  pickupCodeAdd,
  mealRequest
) => {
  setState({
    ...state,
    mealRequest: [
      ...mealRequest,
      {
        meal:
          group === 'a-group' || group === 'b-group'
            ? 'Standard Onsite'
            : // soy options
            foodAllergy.dairy === false &&
              foodAllergy.gluten === false &&
              foodAllergy.soy === true &&
              foodAllergy.sesame === true
            ? 'Soy and Sesame Free'
            : foodAllergy.soy === true &&
              foodAllergy.sesame === false &&
              foodAllergy.dairy === false &&
              foodAllergy.gluten === false
            ? 'Standard Soy Free'
            : foodAllergy.soy === true &&
              foodAllergy.sesame === true &&
              foodAllergy.dairy === true &&
              foodAllergy.gluten === false
            ? 'Soy Sesame Dairy Free'
            : foodAllergy.soy === true &&
              foodAllergy.sesame === true &&
              foodAllergy.dairy === false &&
              foodAllergy.gluten === true
            ? 'Soy Sesame Gluten Free'
            : foodAllergy.soy === true &&
              foodAllergy.sesame === true &&
              foodAllergy.dairy === true &&
              foodAllergy.gluten === true
            ? 'Soy Sesame Dairy Gluten Free'
            : // gf df
            foodAllergy.soy === false &&
              foodAllergy.sesame === false &&
              foodAllergy.dairy === true &&
              foodAllergy.gluten === true
            ? 'Gluten Free Dairy Free'
            : foodAllergy.soy === false &&
              foodAllergy.sesame === false &&
              foodAllergy.dairy === true &&
              foodAllergy.gluten === false
            ? 'Standard Dairy Free'
            : foodAllergy.soy === false &&
              foodAllergy.sesame === false &&
              foodAllergy.dairy === false &&
              foodAllergy.gluten === true
            ? 'Gluten Free'
            : // sesame
            foodAllergy.soy === false &&
              foodAllergy.sesame === true &&
              foodAllergy.dairy === false &&
              foodAllergy.gluten === false
            ? 'Standard Sesame Free'
            : // gf df sesame combos
            foodAllergy.soy === false &&
              foodAllergy.sesame === true &&
              foodAllergy.dairy === false &&
              foodAllergy.gluten === true
            ? 'Gluten Sesame Free'
            : foodAllergy.soy === false &&
              foodAllergy.sesame === true &&
              foodAllergy.dairy === true &&
              foodAllergy.gluten === false
            ? 'Sesame Dairy Free'
            : foodAllergy.soy === false &&
              foodAllergy.sesame === true &&
              foodAllergy.dairy === true &&
              foodAllergy.gluten === true
            ? 'Sesame Dairy Gluten Free'
            : // else standard
              'Standard',
        student: state.students[`${i + 1}`]._id,
        studentName: state.students[`${i + 1}`].name,
        lastName: user.lastName,
        schoolName: state.students[`${i + 1}`].schoolName,
        group: group,
        teacher: state.students[`${i + 1}`].teacher,
        // sets default pickupOption when adding meal
        pickupOption:
          group === 'a-group' || group === 'b-group'
            ? 'Lunch Onsite'
            : foodAllergy.egg === true ||
              foodAllergy.soy === true ||
              foodAllergy.dairy === true ||
              foodAllergy.gluten === true
            ? 'Lunch Only'
            : 'Breakfast and Lunch',
        foodAllergy: foodAllergy,
        parentEmail: user.email,
        parentName: user.name,
        individualPickupTime: '',
        complete: false,
        // unused but will use for coming school year potentially
        days:
          group === 'a-group'
            ? {
                sunday: false,
                monday: true, // a
                tuesday: true, // a
                wednesday: false,
                thursday: false,
                friday: false,
                saturday: false,
              }
            : group === 'b-group'
            ? {
                sunday: false,
                monday: false,
                tuesday: false,
                wednesday: true, // b
                thursday: true, // b
                friday: false,
                saturday: false,
              }
            : {
                sunday: false,
                monday: false,
                tuesday: false,
                wednesday: false,
                thursday: false,
                friday: false,
                saturday: false,
              },
      },
    ],
    pickupCodeAdd: [...pickupCodeAdd, ''],
  });
};

const AddMeal = ({state, setState, user, mealRequest, pickupCodeAdd }) => {
  return state.mealRequest.length < state.students.length && (
    <>
      <button
        className={'btn  btn-outline-info ' + styles.buttonshadow}
        onClick={() =>
          state.mealRequest.map((meal, i) =>
            addMeal(i,
              state.students[`${i + 1}`].group,
              state.students[`${i + 1}`].foodAllergy,
              state,
              setState,
              user,
              pickupCodeAdd,
              mealRequest
            )
          )
        }
      >
        <i class="fas fa-utensils"></i>
        &nbsp;&nbsp; Show Next Student
      </button>
    </>
  );
};

AddMeal.propTypes = {};

export default AddMeal;
