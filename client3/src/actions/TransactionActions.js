/* eslint-disable */

const  setSending = () => {
  return {
    type: 'SENDING'
  }
}

const  setSent= () => {
  return {
    type: 'SENT'
  }
}

const setSuccess= (receipt) => {
  return {
    type: 'SUCCESS',
    payload: receipt
  }
}

const setReject= (reject) => {
  return {
    type: 'REJECT',
    payload: reject 
  }
}

const setError = (err) => {
  return {
    type: 'RECEIPT',
    payload: err 
  }
}

const setReset= () => {
  return {
    type: 'RESET'
  }
}

export {
  setSending,
  setSent,
  setSuccess,
  setError,
  setReset,
  setReject,
}
