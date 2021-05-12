import styles from '../styles/Home.module.css';

const removeMeal = (state, setState) => {
  const list = [...state.mealRequest];
  list.splice(-1)[0];

  const list2 = [...state.pickupCodeAdd];
  list2.splice(-1)[0];
  setState({ ...state, mealRequest: list, pickupCodeAdd: list2 });
};

const RemoveMeal = ({ state, setState }) => {
  return (
    <>
      {state.mealRequest.length !== 1 && (
        <button
          className={'btn float-right ' + styles.buttonshadow}
          onClick={() => removeMeal(state, setState)}
        >
          Remove
        </button>
      )}
    </>
  );
};

export default RemoveMeal;
