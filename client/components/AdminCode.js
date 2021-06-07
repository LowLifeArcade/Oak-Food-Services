const handleCodeChange = (e, state, setState) => {
  e.preventDefault;
  setState({
    ...state,
    pickupCodeInput: e.target.value.toUpperCase(),
    userCode: e.target.value.toUpperCase(),
  });
};

const AdminCode = ({ state, setState, pickupCodeInput }) =>
  state.userCode === 'DOOB' || state.userCode === 'LYF' ? (
    <>
      <div className=" form-group">
        <input
          type="text"
          className=" form-control"
          value={state.pickupCodeInput}
          placeholder="Enter a 4 digit User Code test"
          onChange={(e) => handleCodeChange(e, state, setState)}
        />
      </div>
    </>
  ) : null;

export default AdminCode;
