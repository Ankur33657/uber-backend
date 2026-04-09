const responseFormat = (res, status, message, data = null) => {
  return res.status(status).json({
    message,
    data
  });
};


 const getCurrentWeekDates = () => {
   const now = new Date();
   const startOfWeek = new Date(now);
   startOfWeek.setDate(now.getDate() - now.getDay());
   startOfWeek.setHours(0, 0, 0, 0);
   const endOfWeek = new Date(startOfWeek);
   endOfWeek.setDate(startOfWeek.getDate() + 6);
   endOfWeek.setHours(23, 59, 59, 999);

   const dates = { start: startOfWeek, end: endOfWeek };
   return dates;
 };

module.exports = {
  responseFormat,
  getCurrentWeekDates,
};