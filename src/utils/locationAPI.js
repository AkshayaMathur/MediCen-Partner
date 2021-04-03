const LocationApi = {
  getLocationFromPincode: async (pincode) => {
    return fetch(
      `https://nominatim.openstreetmap.org/search?format=jsonv2&postalcode=${pincode}`,
      {
        method: 'GET',
      },
    )
      .then((res) => res.json())
      .catch((err) => {
        console.log('Error In Getting Location From Pincode: ', err);
        throw err;
      });
  },
};

export default LocationApi;
