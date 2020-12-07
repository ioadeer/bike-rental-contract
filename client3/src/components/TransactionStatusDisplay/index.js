import React from 'react';

import {
  useSelector,
} from 'react-redux';

function TransactionStatusDisplay() {
  const {
    sending,
    sent,
    success,
    receipt,
    error,
    reject,
  } = useSelector((state) => state.TransactionReducer);

  return (
    <div style={{ position: 'fixed', bottom: '10px' }}>
      { sending && (
        <p>
          Sending ...
        </p>
      )}
      { sent && (
        <p>
          Sent!
        </p>
      )}
      { success && (
        <p>
          Successful transaction!
          &nbsp;
          {receipt.transactionHash}
        </p>
      )}
      { reject && (
        <p>
          Transaction rejected by user
          &nbsp;
          {receipt.message}
        </p>
      )}
      { error && (
        <p>
          Failure during transaction!
        </p>
      )}
    </div>
  );
}

export default TransactionStatusDisplay;
