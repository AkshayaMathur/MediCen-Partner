import SInfo from 'react-native-sensitive-info';

const SENSITIVE_STORAGE_OPTIONS = {
  sharedPreferencesName: 'mySharedPrefs',
  keychainService: 'myKeychain',
};

const setItem = async (key, value) => {
  let values = await SInfo.setItem(key, value, SENSITIVE_STORAGE_OPTIONS);
  return values;
};

const getItem = async (key) => {
  return await SInfo.getItem(key, SENSITIVE_STORAGE_OPTIONS);
};
const deleteitem = async (key) => {
  let value = await SInfo.deleteItem(key, SENSITIVE_STORAGE_OPTIONS);
  // let value1 = await RNSInfo.
  return value;
};

export {SENSITIVE_STORAGE_OPTIONS, setItem, getItem, deleteitem};
