const parseTimeToHours = (timeString) => {
    if (!timeString || typeof timeString !== 'string') {
        return Infinity; // Return Infinity for missing or invalid formats
      }
    
      const parts = timeString.split(' ');
      if (parts.length < 2) {
        return Infinity; // Return Infinity for unexpected formats
      }
    
      const [value, unit] = parts;
      const number = parseInt(value);
    
      if (isNaN(number)) {
        return Infinity; // Return Infinity if the value is not a valid number
      }
  
    if (unit.includes('Minute')) {
      return number / 60; // Convert minutes to hours
    } else if (unit.includes('Hour')) {
      return number;
    } else if (unit.includes('Day')) {
      return number * 24; // Convert days to hours
    }
    return Infinity; // Default for unexpected format
  };
  
  // Filter jobs within 48 hours
  const filterJobsWithin48Hours = (jobs) => {
    return jobs.filter(job => {
      const hoursAgo = parseTimeToHours(job.time);
      return hoursAgo <= 48;
    });
  };

  module.exports = {filterJobsWithin48Hours}