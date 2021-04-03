import {getItem, setItem} from './secureStorage';

const USER_PROFILE = 'userToken';

const getUserDetails = async () => {
  return await getItem(USER_PROFILE);
};

const setUserDetails = async (val) => {
  await setItem(USER_PROFILE, JSON.stringify(val));
};

export {getUserDetails, setUserDetails};
