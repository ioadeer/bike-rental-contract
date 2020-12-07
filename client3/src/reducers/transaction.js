const initialState = {
  sending: null,
  sent: null,
  success: null,
  receipt: null,
  error: null,
  reject: null,
};

const TransactionReducer = (state = initialState, action) => {
  switch (action.type) {
  case 'RESET':
    return (initialState);
  case 'SENDING':
    return ({
      ...state,
      sending: true,
    });
  case 'SENT':
    return ({
      ...state,
      sending: false,
      sent: true,
    });
  case 'SUCCESS':
    return ({
      ...state,
      sending: false,
      success: true,
      receipt: action.payload,
    });
  case 'ERROR':
    return ({
      ...state,
      sending: false,
      error: action.payload,
    });
  case 'REJECT':
    return ({
      ...state,
      success: false,
      sending: false,
      reject: true,
      receipt: action.payload,
    });
  default:
    return state;
  }
};

export default TransactionReducer;
