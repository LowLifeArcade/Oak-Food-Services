import { isAuth } from '../helpers/auth';
import { useCallback } from 'react';

const handleSelectChange = (e, state, setState) => {
  let i = e.target.getAttribute('data-index');

  // sets pickup option
  // let input = e.target.value;
  let pickupOptionLO = '';
  switch (e.target.value) {
    // specials
    case 'Vegan B': // Vegan with breakfast
      pickupOptionLO = 'Breakfast and Lunch';
      break;
    case 'Gluten Free with Breakfast':
      pickupOptionLO = 'Breakfast and Lunch';
      break;
    case '2on 3off':
      pickupOptionLO = 'Two Onsite / Three Breakfast and Lunches';
      break;

    // standard options
    case 'Standard':
      pickupOptionLO = 'Breakfast and Lunch';
      break;
    case 'Vegetarian':
      pickupOptionLO = 'Breakfast and Lunch';
      break;
    case 'Vegan':
      pickupOptionLO = 'Lunch Only';
      break;

    // gluten dairy options
    case 'Gluten Free':
      pickupOptionLO = 'Lunch Only';
      break;
    case 'Standard Dairy Free':
      pickupOptionLO = 'Lunch Only';
      break;
    case 'Gluten Free Dairy Free':
      pickupOptionLO = 'Lunch Only';
      break;

    // sesame gluten dairy combos
    case 'Gluten Sesame Free':
      pickupOptionLO = 'Lunch Only';
      break;
    case 'Sesame Dairy Free':
      pickupOptionLO = 'Lunch Only';
      break;
    case 'Sesame Dairy Gluten Free':
      pickupOptionLO = 'Lunch Only';
      break;

    // sesame options
    case 'Standard Sesame Free':
      pickupOptionLO = 'Breakfast and Lunch';
      break;
    case 'Vegetarian Sesame Free':
      pickupOptionLO = 'Breakfast and Lunch';
      break;
    case 'Vegan Sesame Free':
      pickupOptionLO = 'Lunch Only';
      break;

    // soy options
    case 'Standard Soy Free':
      pickupOptionLO = 'Lunch Only';
      break;
    case 'Vegetarian Soy Free':
      pickupOptionLO = 'Lunch Only';
      break;
    case 'Vegan Soy Free':
      pickupOptionLO = 'Lunch Only';
      break;
    case 'Gluten Soy Free':
      pickupOptionLO = 'Lunch Only';
      break;
    case 'Soy and Sesame Free':
      pickupOptionLO = 'Lunch Only';
      break;
    case 'Soy Dairy Free':
      pickupOptionLO = 'Lunch Only';
      break;
    case 'Soy Sesame Dairy Free':
      pickupOptionLO = 'Lunch Only';
      break;
    case 'Soy Sesame Gluten Free':
      pickupOptionLO = 'Lunch Only';
      break;
    case 'Soy Sesame Dairy Gluten Free':
      pickupOptionLO = 'Lunch Only';
      break;
    case 'Soy Dairy Gluten Free':
      pickupOptionLO = 'Lunch Only';
      break;

    // other
    case 'Standard Onsite':
      pickupOptionLO = 'Lunch Onsite';
      break;
    case 'None':
      pickupOptionLO = 'None';
      break;
    default:
      break;
  }

  // sets meal
  let meals = [...state.mealRequest]; // spreads array from mealRequest: [] into an array called meal
  let meal = { ...meals[i] }; // takes a meal out of the mealRequest array that matches the index we're at
  meal.meal = e.target.value; // handles actual meal selected
  meal.pickupOption = pickupOptionLO;

  meals[i] = meal; // puts meal[i] back into mealRequest array

  setState({
    ...state,
    mealRequest: [...meals],
    buttonText: 'Submit',
    success: '',
    error: '',
  });
};

const SelectMealRequest = ({ i, user, meal, student, state, setState }) => (
  <>
    <div key={i} className="">
      <div key={i} className="form-group">
        <div className="">
          <select
            type="select"
            data-index={i}
            value={meal}
            onChange={(e) => handleSelectChange(e, state, setState)}
            className="form-control"
          >
            {' '}
            <option disabled value="">
              Choose an option
            </option>
            {isAuth().role === 'admin' && ( // admin options
              <>
                <option value={'Standard'}>Standard</option>
                <option value={'Standard Onsite'}>Standard Onsite</option>
                <option value={'Vegetarian'}>Vegetarian</option>
                <option value={'Vegan'}>Vegan</option>
                <option value={'Gluten Free'}>Gluten Free</option>
                <option value={'Gluten Free Dairy Free'}>
                  Gluten Free Dairy Free
                </option>
                <option value={'Standard Dairy Free'}>
                  Standard Dairy Free
                </option>
                <option value={'Standard Sesame Free'}>
                  Standard Sesame Free{' '}
                </option>
                <option value={'Vegetarian Sesame Free'}>
                  Vegetarian Sesame Free
                </option>
                <option value={'Vegan Sesame Free'}>Vegan Sesame Free</option>
                <option value={'Sesame Dairy Free'}>Sesame Dairy Free</option>
                <option value={'Standard Soy Free'}>Standard Soy Free</option>
                <option value={'Vegetarian Soy Free'}>
                  Vegetarian Soy Free
                </option>
                <option value={'Vegan Soy Free'}>Vegan Soy Free</option>
                <option value={'Soy Sesame Free'}>Soy Sesame Free</option>
                <option value={'Soy Sesame Dairy Free'}>
                  Soy Sesame Dairy Free
                </option>
                <option value={'Soy Sesame Gluten Free'}>
                  Soy Sesame Gluten Free
                </option>
                <option value={'Soy Sesame Dairy Gluten Free'}>
                  Soy Sesame Dairy Gluten Free
                </option>
                <option value={'2on 3off'}>
                  Standard 2 Onsite / 3 Offsite Lunches plus 5 Breakfasts
                </option>
              </>
            )}
            {student.group === 'distance-learning' && (
              <>
                {isAuth().role === 'subscriber' && // 0000              students[i].foodAllergy.gluten === false &&
                  student.foodAllergy.sesame === false &&
                  student.foodAllergy.dairy === false &&
                  student.foodAllergy.soy === false && (
                    <option value={'Standard'}>Standard</option>
                  )}
                {isAuth().role === 'subscriber' &&
                  student.foodAllergy.gluten === false &&
                  student.foodAllergy.sesame === false &&
                  student.foodAllergy.dairy === false &&
                  student.foodAllergy.soy === false && (
                    <option value={'Vegetarian'}>Vegetarian</option>
                  )}
                {isAuth().role === 'subscriber' &&
                  student.foodAllergy.gluten === false &&
                  student.foodAllergy.sesame === false &&
                  student.foodAllergy.dairy === false &&
                  student.foodAllergy.soy === false && (
                    <option value={'Vegan'}>Vegan (Lunch Only)</option>
                  )}
                {/* {gluten dairy options} */}
                {isAuth().role === 'subscriber' && // 0100
                  student.foodAllergy.dairy === false &&
                  student.foodAllergy.gluten === true &&
                  student.foodAllergy.soy === false &&
                  student.foodAllergy.sesame === false && (
                    <option value={'Gluten Free'}>
                      Gluten Free (Lunch Only)
                    </option>
                  )}
                {isAuth().role === 'subscriber' && // 1000
                  student.foodAllergy.dairy === true &&
                  student.foodAllergy.gluten === false &&
                  student.foodAllergy.soy === false &&
                  student.foodAllergy.sesame === false && (
                    <option value={'Standard Dairy Free'}>
                      Dairy Free (Lunch Only)
                    </option>
                  )}
                {isAuth().role === 'subscriber' && // dairy free has this option too
                  student.foodAllergy.dairy === true &&
                  student.foodAllergy.gluten === false &&
                  student.foodAllergy.soy === false &&
                  student.foodAllergy.sesame === false && (
                    <option value={'Vegan'}>Vegan (Lunch Only)</option>
                  )}
                {isAuth().role === 'subscriber' && // 1100
                  student.foodAllergy.dairy === true &&
                  student.foodAllergy.gluten === true &&
                  student.foodAllergy.soy === false &&
                  student.foodAllergy.sesame === false && (
                    <option value={'Gluten Free Dairy Free'}>
                      Gluten Free Dairy Free (lunch only)
                    </option>
                  )}
                {isAuth().role === 'subscriber' && // 0101 // add to list
                  student.foodAllergy.dairy === false &&
                  student.foodAllergy.gluten === true &&
                  student.foodAllergy.soy === false &&
                  student.foodAllergy.sesame === true && (
                    <option value={'Gluten Sesame Free'}>
                      Gluten Sesame Free (Lunch Only)
                    </option>
                  )}
                {/* soy */}
                {isAuth().role === 'subscriber' && // 0010
                  student.foodAllergy.dairy === false &&
                  student.foodAllergy.gluten === false &&
                  student.foodAllergy.soy === true &&
                  student.foodAllergy.sesame === false && (
                    <option value={'Standard Soy Free'}>
                      Standard Soy Free
                    </option>
                  )}
                {isAuth().role === 'subscriber' &&
                  student.foodAllergy.dairy === false &&
                  student.foodAllergy.gluten === false &&
                  student.foodAllergy.soy === true &&
                  student.foodAllergy.sesame === false && (
                    <option value={'Vegetarian Soy Free'}>
                      Vegetarian Soy Free
                    </option>
                  )}
                {isAuth().role === 'subscriber' &&
                  student.foodAllergy.dairy === false &&
                  student.foodAllergy.gluten === false &&
                  student.foodAllergy.soy === true &&
                  student.foodAllergy.sesame === false && (
                    <option value={'Vegan Soy Free'}>Vegan Soy Free</option>
                  )}
                {isAuth().role === 'subscriber' && // 0110 // add to list
                  student.foodAllergy.dairy === false &&
                  student.foodAllergy.gluten === true &&
                  student.foodAllergy.soy === true &&
                  student.foodAllergy.sesame === false && (
                    <option value={'Gluten Soy Free'}>Gluten Soy Free</option>
                  )}
                {isAuth().role === 'subscriber' && // 0011
                  student.foodAllergy.dairy === false &&
                  student.foodAllergy.gluten === false &&
                  student.foodAllergy.soy === true &&
                  student.foodAllergy.sesame === true && (
                    <option value={'Soy and Sesame Free'}>
                      Soy and Sesame Free (Lunch Only)
                    </option>
                  )}
                {isAuth().role === 'subscriber' && // 1011 // change code elsewhere
                  student.foodAllergy.dairy === true &&
                  student.foodAllergy.gluten === false &&
                  student.foodAllergy.soy === true &&
                  student.foodAllergy.sesame === true && (
                    <option value={'Soy Sesame Dairy Free'}>
                      Dairy Soy Sesame Free (Lunch Only)
                    </option>
                  )}
                {isAuth().role === 'subscriber' && // 1010 // add to list
                  student.foodAllergy.dairy === true &&
                  student.foodAllergy.gluten === false &&
                  student.foodAllergy.soy === true &&
                  student.foodAllergy.sesame === false && (
                    <option value={'Soy Dairy Free'}>
                      Dairy Soy Free (Lunch Only)
                    </option>
                  )}
                {isAuth().role === 'subscriber' && // 0111
                  student.foodAllergy.dairy === false &&
                  student.foodAllergy.gluten === true &&
                  student.foodAllergy.soy === true &&
                  student.foodAllergy.sesame === true && (
                    <option value={'Soy Sesame Gluten Free'}>
                      Gluten Soy and Sesame Free (Lunch Only)
                    </option>
                  )}
                {isAuth().role === 'subscriber' && // 1111
                  student.foodAllergy.dairy === true &&
                  student.foodAllergy.gluten === true &&
                  student.foodAllergy.soy === true &&
                  student.foodAllergy.sesame === true && (
                    <option value={'Soy Sesame Dairy Gluten Free'}>
                      Gluten Dairy Soy and Sesame Free (Lunch Only)
                    </option>
                  )}
                {isAuth().role === 'subscriber' && // 1110 // add to list
                  student.foodAllergy.dairy === true &&
                  student.foodAllergy.gluten === true &&
                  student.foodAllergy.soy === true &&
                  student.foodAllergy.sesame === false && (
                    <option value={'Soy Dairy Gluten Free'}>
                      Gluten Dairy Soy Free (lunch only)
                    </option>
                  )}
                {/* Sesame  */}
                {isAuth().role === 'subscriber' && // 0001
                  student.foodAllergy.dairy === false &&
                  student.foodAllergy.gluten === false &&
                  student.foodAllergy.soy === false &&
                  student.foodAllergy.sesame === true && (
                    <option value={'Standard Sesame Free'}>
                      Standard Sesame Free
                    </option>
                  )}
                {isAuth().role === 'subscriber' &&
                  student.foodAllergy.dairy === false &&
                  student.foodAllergy.gluten === false &&
                  student.foodAllergy.soy === false &&
                  student.foodAllergy.sesame === true && (
                    <option value={'Vegetarian Sesame Free'}>
                      Vegetarian Sesame Free
                    </option>
                  )}
                {isAuth().role === 'subscriber' &&
                  student.foodAllergy.dairy === false &&
                  student.foodAllergy.gluten === false &&
                  student.foodAllergy.soy === false &&
                  student.foodAllergy.sesame === true && (
                    <option value={'Vegan Sesame Free'}>
                      Vegan Sesame Free
                    </option>
                  )}
                {isAuth().role === 'subscriber' && // 1001 // add to list
                  student.foodAllergy.dairy === true &&
                  student.foodAllergy.gluten === false &&
                  student.foodAllergy.soy === false &&
                  student.foodAllergy.sesame === true && (
                    <option value={'Sesame Dairy Free'}>
                      Dairy Sesame Free (Lunch Only)
                    </option>
                  )}
                {isAuth().role === 'subscriber' && // 1101
                  student.foodAllergy.dairy === true &&
                  student.foodAllergy.gluten === true &&
                  student.foodAllergy.soy === false &&
                  student.foodAllergy.sesame === true && (
                    <option value={'Sesame Dairy Gluten Free'}>
                      Gluten Dairy Sesame Free (Lunch Only)
                    </option>
                  )}
                {user.special.gfplus == true && ( // special options
                  <option value={'Gluten Free with Breakfast'}>
                    Gluten Free Lunch plus Breakfast
                  </option>
                )}
                {user.special.gfplus == 'true' && (
                  <option value={'Gluten Free with Breakfast'}>
                    Gluten Free Lunch plus Breakfast
                  </option>
                )}
                {user.special.vgplus == true && (
                  <option value={'Vegan B'}>Vegan Lunch plus Breakfast</option>
                )}
              </>
            )}
            {
              // onsite
            }
            {(student && student.group === 'a-group') ||
            student.group === 'b-group' ? (
              <option value={'Standard Onsite'}>Standard (Onsite)</option>
            ) : null}
            {user.special.twothree == true && (
              <option value={'2on 3off'}>
                Standard 2 Onsite / 3 Offsite Lunches plus 5 Breakfasts
              </option>
            )}
            {user.special.day1 == 'true' && (
              <option value={'Onsite Day 1'}>
                Onsite Lunch Monday/Wednesday Only
              </option>
            )}
            {user.special.day2 == 'true' && (
              <option value={'Onsite Day 2'}>
                Onsite Lunch Tuesday/Thursday Only
              </option>
            )}
            <option value={'None'}>None</option>
          </select>
          <div className="p-1"></div>
        </div>
      </div>
    </div>
  </>
);

export default SelectMealRequest;
