const Device_Api = {
  addDevice: async (deviceInfo) => {
    return fetch(
      'https://7d5simyvz0.execute-api.us-east-1.amazonaws.com/V1/add-device',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(deviceInfo),
      },
    )
      .then((res) => res.json())
      .catch((err) => {
        console.log('Error In Add Device: ', err);
        throw err;
      });
  },
  userOrders: async (userId) => {
    return fetch(
      'https://7d5simyvz0.execute-api.us-east-1.amazonaws.com/V1/get-user-orders',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
        }),
      },
    )
      .then((res) => res.json())
      .catch((err) => {
        console.log('Error In User Orders: ', err);
        throw err;
      });
  },
  getPartnerDetails: () => {
    return fetch(
      'https://7d5simyvz0.execute-api.us-east-1.amazonaws.com/V1/get-partners',
      {
        method: 'GET',
      },
    )
      .then((res) => res.json())
      .catch((err) => {
        console.log('Error In getPartnerDetails: ', err);
        throw err;
      });
  },
  updatePartnerDetails: (partnerDetails) => {
    return fetch(
      'https://7d5simyvz0.execute-api.us-east-1.amazonaws.com/V1/update-partner',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(partnerDetails),
      },
    )
      .then((res) => res.json())
      .catch((err) => {
        console.log('Error In getPartnerDetails: ', err);
        throw err;
      });
  },
  getOrderDetailsById: (orderId) => {
    return fetch(
      'https://7d5simyvz0.execute-api.us-east-1.amazonaws.com/V1/get-order-by-id',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({Id: orderId}),
      },
    )
      .then((res) => res.json())
      .catch((err) => {
        console.log('Error In getPartnerDetails: ', err);
        throw err;
      });
  },
  getPartnerSubscription: (userId) => {
    return fetch(
      'https://7d5simyvz0.execute-api.us-east-1.amazonaws.com/V1/get-subscription/partner',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({partnerId: userId}),
      },
    )
      .then((res) => res.json())
      .catch((err) => {
        console.log('Error In getPartnerSubscription: ', err);
        throw err;
      });
  },
  getUsersReminders: (userId) => {
    return fetch(
      'https://7d5simyvz0.execute-api.us-east-1.amazonaws.com/V1/get-reminders',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({userId: userId}),
      },
    )
      .then((res) => res.json())
      .catch((err) => {
        console.log('Error In getPartnerSubscription: ', err);
        throw err;
      });
  },
  createReminder: (obj) => {
    return fetch(
      'https://7d5simyvz0.execute-api.us-east-1.amazonaws.com/V1/create-reminder/user',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj),
      },
    )
      .then((res) => res.json())
      .catch((err) => {
        console.log('Error In getPartnerSubscription: ', err);
        throw err;
      });
  },
  updateReminder: (obj) => {
    return fetch(
      'https://7d5simyvz0.execute-api.us-east-1.amazonaws.com/V1/update-reminder',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj),
      },
    )
      .then((res) => res.json())
      .catch((err) => {
        console.log('Error In getPartnerSubscription: ', err);
        throw err;
      });
  },
  medicalSuggestion: (txt) => {
    return fetch(
      `https://www.medindia.net/patients/calculators/cal_includes/get-drug-details.asp?txt=${txt}&section=Drug%20Price&source=No.`,
    )
      .then((res) => res.json())
      .catch((err) => {
        console.log('Error In medicalSuggestion: ', err);
        throw err;
      });
  },
  getOrderCount: async (userId) => {
    return fetch(
      'https://7d5simyvz0.execute-api.us-east-1.amazonaws.com/V1/getorder/count',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          partnerId: userId,
        }),
      },
    )
      .then((res) => res.json())
      .catch((err) => {
        console.log('Error In User Orders: ', err);
        throw err;
      });
  },
  createUpiDetails: async (obj) => {
    return fetch(
      'https://7d5simyvz0.execute-api.us-east-1.amazonaws.com/V1/payment/add',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj),
      },
    )
      .then((res) => res.json())
      .catch((err) => {
        console.log('Error In User Orders: ', err);
        throw err;
      });
  },
  getUpiDetails: async (userId) => {
    return fetch(
      'https://7d5simyvz0.execute-api.us-east-1.amazonaws.com/V1/payment/get-details',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          partnerId: userId,
        }),
      },
    )
      .then((res) => res.json())
      .catch((err) => {
        console.log('Error In User Orders: ', err);
        throw err;
      });
  },
  submitError: async (obj) => {
    return fetch(
      'https://7d5simyvz0.execute-api.us-east-1.amazonaws.com/V1/error-report',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj),
      },
    )
      .then((res) => res.json())
      .catch((err) => {
        console.log('Error In User Orders: ', err);
        throw err;
      });
  },
  remindUser: async (obj) => {
    return fetch(
      'https://7d5simyvz0.execute-api.us-east-1.amazonaws.com/V1/payment-reminder',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj),
      },
    )
      .then((res) => res.json())
      .catch((err) => {
        console.log('Error In User Orders: ', err);
        throw err;
      });
  },
  getPaymentOrders: async (Id) => {
    return fetch(
      'https://7d5simyvz0.execute-api.us-east-1.amazonaws.com/V1/payment-reminder/partner-payment-orders',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({Id: Id}),
      },
    )
      .then((res) => res.json())
      .catch((err) => {
        console.log('Error In User Orders: ', err);
        throw err;
      });
  },
  getSimilarUserOrders: async (partnerId, userId) => {
    return fetch(
      'https://7d5simyvz0.execute-api.us-east-1.amazonaws.com/V1/get-similar-user-order',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          partnerId: partnerId,
          userId: userId,
        }),
      },
    )
      .then((res) => res.json())
      .catch((err) => {
        console.log('Error In User Orders: ', err);
        throw err;
      });
  },
  uploadInvoice: async (orderId, key) => {
    return fetch(
      'https://7d5simyvz0.execute-api.us-east-1.amazonaws.com/V1/upload-invoice',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Id: orderId,
          invoiceKey: key,
        }),
      },
    )
      .then((res) => res.json())
      .catch((err) => {
        console.log('Error In User Orders: ', err);
        throw err;
      });
  },
  getInvoiceImage: async (orderId, key) => {
    return fetch(
      'https://7d5simyvz0.execute-api.us-east-1.amazonaws.com/V1/get-invoice-image',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: orderId,
          invoiceKeys: key,
        }),
      },
    )
      .then((res) => res.json())
      .catch((err) => {
        console.log('Error In User Orders: ', err);
        throw err;
      });
  },
  uploadPartnerProfilePic: async (orderId, key) => {
    return fetch(
      'https://7d5simyvz0.execute-api.us-east-1.amazonaws.com/V1/partner-update-profile',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Id: orderId,
          profileKey: key,
        }),
      },
    )
      .then((res) => res.json())
      .catch((err) => {
        console.log('Error In User Orders: ', err);
        throw err;
      });
  },
  getPartnerProfilePic: async (orderId, key) => {
    return fetch(
      'https://7d5simyvz0.execute-api.us-east-1.amazonaws.com/V1/partner-get-profile',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Id: orderId,
          partnerPic: key,
        }),
      },
    )
      .then((res) => res.json())
      .catch((err) => {
        console.log('Error In User Orders: ', err);
        throw err;
      });
  },
};

export default Device_Api;
