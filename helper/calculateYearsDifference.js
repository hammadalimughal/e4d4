function calculateYearsDifference(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
  
    // Calculate the difference in years
    let yearsDiff = end.getFullYear() - start.getFullYear();
  
    // Calculate the difference in months
    let monthsDiff = end.getMonth() - start.getMonth();
  
    // If the end month is before the start month, adjust the year and month difference
    if (monthsDiff < 0) {
      yearsDiff--;
      monthsDiff += 12; // Adjust the months to account for the negative difference
    }
  
    // Adjust if the day of the end date is before the start date
    if (end.getDate() < start.getDate()) {
      monthsDiff--;
      if (monthsDiff < 0) {
        yearsDiff--;
        monthsDiff += 12;
      }
    }
  
    // return { years: yearsDiff, months: monthsDiff };
    return `${yearsDiff} Yrs ${monthsDiff} Mos`
}
module.exports = calculateYearsDifference