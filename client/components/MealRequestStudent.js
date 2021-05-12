import React from 'react';

const MealRequestStudent = ({i, state, auth }) => {
  return (
    <div>
      <label key={state.students[i].student} className="text-secondary">
        {auth.role != 'admin' && (
          <h6>
            {' '}
            <b>{`${state.students[i].name}`}'s</b>{' '}
            {state.students[i].group === 'distance-learning' ? (
              <>Curbside</>
            ) : (
              <>Onsite</>
            )}{' '}
            Meals
          </h6>
        )}
      </label>
    </div>
  );
};

export default MealRequestStudent;
