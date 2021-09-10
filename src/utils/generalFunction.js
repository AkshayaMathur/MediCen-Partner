const getStatusString = (status) => {
  if (status === 'all') {
    return 'All';
  } else if (status === 'awaiting') {
    return 'Awaiting Order Confirmation';
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
  } else if (status === 'delayed') {
    return 'Delayed';
  }
};

const REPEAT_ORDER = [
  'once',
  'weekly',
  'monthly',
  'quarterly',
  'half-yearly',
  'yearly',
];

const getRepeatOrderString = (val) => {
  if (val === 'once') {
    return 'Once';
  } else if (val === 'weekly') {
    return 'Weekly';
  } else if (val === 'monthly') {
    return 'Monthly';
  } else if (val === 'quarterly') {
    return 'Quarterly';
  } else if (val === 'half-yearly') {
    return 'Half-Yearly';
  } else if (val === 'yearly') {
    return 'Yearly';
  }
};

const getRepeatFreqString = (val) => {
  if (val === 'once') {
    return 'Once';
  } else if (val === 'weekly') {
    return 'Weekly';
  } else if (val === 'monthly') {
    return 'Monthly';
  } else if (val === 'daily') {
    return 'Daily';
  }
};
const REPEAT_FREQ = ['once', 'daily', 'weekly', 'monthly'];

const UPI_PAYMENT = 'upi';
const RAZOR_PAY = 'razorpay';
const CASH_ON_DELIVERY = 'cash_on_delivery';

const getPaymentModeName = (mode) => {
  if (mode === UPI_PAYMENT) {
    return 'UPI';
  } else if (mode === RAZOR_PAY) {
    return 'Razorpay';
  } else if (mode === CASH_ON_DELIVERY) {
    return 'Cash On Delivery';
  }
  return '';
};

export {
  getStatusString,
  REPEAT_ORDER,
  getRepeatOrderString,
  REPEAT_FREQ,
  getRepeatFreqString,
  getPaymentModeName,
};
