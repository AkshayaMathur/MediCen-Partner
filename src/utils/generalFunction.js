const getStatusString = (status) => {
  if (status === 'all') {
    return 'All';
  } else if (status === 'awaiting') {
    return 'Awaiting Prescription Confirmation';
  } else if (status === 'preparing') {
    return 'Preparing';
  } else if (status === 'awaiting_cust') {
    return 'Awaiting Customer Confirmation';
  } else if (status === 'dispatch') {
    return 'Dispatch';
  } else if (status === 'delivered') {
    return 'Delivered';
  } else if (status === 'cancelled') {
    return 'Cancel Order';
  }
};

export {getStatusString};
