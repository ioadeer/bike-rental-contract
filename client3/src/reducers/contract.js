const initialState = null;

const ContractReducer = (state = initialState, action) => {
  switch (action.type) {
  case 'SET_CONTRACT':
    return ({
      ...action.payload,
    });
  default:
    return state;
  }
};

export default ContractReducer;
