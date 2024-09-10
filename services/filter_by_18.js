

function filterJobsBy18Hours(data) {

    // console.log(data);

    return data.filter(job => {
      const timeString = job.time;
      let timeInHours;
  
      if (timeString.includes('minute')) {
        // Convert minutes to hours (1 hour = 60 minutes)
        const minutes = parseInt(timeString);
        timeInHours = minutes / 60;
      } else if (timeString.includes('hour')) {
        // Extract the number of hours directly
        timeInHours = parseInt(timeString);
      } else if (timeString.includes('day')) {
        // Convert days to hours (1 day = 24 hours)
        const days = parseInt(timeString);
        timeInHours = days * 24;
      }
  
      return timeInHours < 19;
    });
  }

module.exports = {filterJobsBy18Hours}