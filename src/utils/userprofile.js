import {getItem, setItem} from './secureStorage';

const USER_PROFILE = 'userToken';
const ORDERS = 'orders';
const getUserDetails = async () => {
  return await getItem(USER_PROFILE);
};

const setUserDetails = async (val) => {
  await setItem(USER_PROFILE, JSON.stringify(val));
};
const getAllUserOrders = async () => {
  let orders = await getItem(ORDERS);
  if (orders) {
    return JSON.parse(orders);
  }
  return null;
};

const setAllUserOrder = async (val) => {
  await setItem(ORDERS, JSON.stringify(val));
};

export {getUserDetails, setUserDetails, getAllUserOrders, setAllUserOrder};
