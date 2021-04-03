import moment from 'moment';

// const formatDate = (date) => {
//   // Check if the date is in the format of July, 30 2020 14:00:00
//   // If yes, parse it, else skip
//   const months = [
//     'january',
//     'february',
//     'march',
//     'april',
//     'may',
//     'june',
//     'july',
//     'august',
//     'september',
//     'october',
//     'november',
//     'december',
//   ];
//   const splitDate = date.split(' ');
//   if (splitDate.length !== 4) {
//     return new Date(date);
//   }
//   const month = months.indexOf(
//     splitDate[0].replace(',', '').trim().toLowerCase(),
//   );
//   const day = parseInt(splitDate[1].trim(), 10);
//   const year = parseInt(splitDate[2].trim(), 10);
//   const splitTime = splitDate[3].split(':');
//   const hour = parseInt(splitTime[0].trim(), 10);
//   const minute = parseInt(splitTime[1].trim(), 10);
//   const second = parseInt(splitTime[2].trim(), 10);
//   return new Date(year, month, day, hour, minute, second);
// };
export const formatDate = (date) => {
  if (date) {
    const splitDate = date.split('T');
    return moment(splitDate[0]).format('DD-MM-YYYY');
  }
  return '';
};

export const diff = (dateA, dateB) =>
  moment(formatDate(dateA)).diff(moment(formatDate(dateB)));

export const isFuture = (date) => moment(formatDate(date)).isAfter();

export const fromNow = (date) => moment(formatDate(date)).fromNow();

export const add = (amountInSeconds) => moment().add(amountInSeconds, 's');

export const isBefore = (seconds) => moment().isBefore(seconds);

export const getDate = (date) => moment(formatDate(date));
