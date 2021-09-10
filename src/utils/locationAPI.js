const LocationApi = {
  getLocationFromPincode: async (pincode) => {
    return fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${pincode}&region=in&key=AIzaSyCwBluVddK8b8h3fCTxWUD77i7L2Tep9ew`,
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

// https://nominatim.openstreetmap.org/search?format=jsonv2&postalcode=${pincode}
export default LocationApi;
