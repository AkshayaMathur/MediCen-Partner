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
};

export default Device_Api;
