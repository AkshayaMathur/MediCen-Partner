import Geolocation from '@react-native-community/geolocation';
import {PermissionsAndroid} from 'react-native';
import {PERMISSIONS, check, request, RESULTS} from 'react-native-permissions';
import {setItem, deleteitem, getItem} from './secureStorage';
const LOCATION_KEY = 'user_current_location';
const getCurrentUserLocation = async () => {
  return new Promise(async (res, reject) => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message: 'MyMapApp needs access to your location',
      },
    );
    console.log('GRANTED IS: ', granted);
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Finding User Location.... ');
      Geolocation.getCurrentPosition(
        async (info) => {
          console.log('Got Geo Location in util Functioon?????????', info);
          const lat = info.coords.latitude;
          const lon = info.coords.longitude;
          await storeAddress(lat, lon);
          res(true);
        },
        (error) => {
          console.log('Can not find user location: ', error);
          res(error);
        },
        {timeout: 30000, enableHighAccuracy: true, maximumAge: 1000},
      );
    }
  });
};
const storeAddress = async (lat, lon) => {
  return new Promise((resolve, reject) => {
    fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`,
      {
        method: 'GET',
      },
    )
      .then((res) => res.json())
      .then((response) => {
        console.log(' util Functioon Got API Response as: ', response);
        setItem(LOCATION_KEY, JSON.stringify(response));
        let str = '';
        if (response.address.suburb) {
          str = `${response.address.suburb}`;
        } else if (response.address.village) {
          str = `${response.address.village}`;
        } else if (response.display_name) {
          str = `${response.display_name}`;
        }
        resolve(str);
        return str;
      })
      .catch((err) => {
        console.log('An error occurred while fetching location');
        reject(err);
        throw err;
      });
  });
};

const getAddress = () => {
  return getItem(LOCATION_KEY);
};
export {storeAddress, getCurrentUserLocation, getAddress};
