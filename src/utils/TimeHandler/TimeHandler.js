function transformTime(time: number) {
  const passedTime = time;
  const newTime = Date.now();
  const difference = newTime - passedTime;
  if (difference < 60000) {
    return 'Active now';
  } else if (difference < 60 * 60000) {
    return (
      'Active ' + Math.floor((difference / 1000 / 60) % 60) + ' Minutes ago'
    );
  } else if (difference < 24 * (60 * 60000)) {
    return 'Active ' + Math.floor(difference / 1000 / 60 / 60) + ' Hours ago';
  } else if (difference < 24 * (60 * 60 * 60000)) {
    return Math.floor(difference / 1000 / 60 / 60 / 24) + ' Days ago';
  } else {
    return 'Long time ago';
  }
}

function transformTimeDevices(time: number) {
  const passedTime = time;
  const newTime = Date.now();
  const difference = newTime - passedTime;
  if (difference < 60000) {
    return 'Active now';
  } else if (difference < 60 * 60000) {
    return Math.floor((difference / 1000 / 60) % 60) + ' Minutes ago';
  } else if (difference < 24 * (60 * 60000)) {
    return Math.floor(difference / 1000 / 60 / 60) + ' Hours ago';
  } else if (difference < 24 * (60 * 60 * 60000)) {
    if (
      difference / 1000 / 60 / 60 / 24 > 86400000 &&
      difference / 1000 / 60 / 60 / 24 < 172800000
    ) {
      return Math.floor(difference / 1000 / 60 / 60 / 24) + ' Day ago';
    }
    return Math.floor(difference / 1000 / 60 / 60 / 24) + ' Days ago';
  } else {
    return 'Long time ago';
  }
}

function transformTimeForStories(time: number) {
  const passedTime = time;
  const newTime = Date.now();
  const difference = newTime - passedTime;
  if (difference < 60000) {
    return 'Posted Now';
  } else if (difference < 60 * 60000) {
    return Math.floor((difference / 1000 / 60) % 60) + ' Minutes ago';
  } else if (difference < 24 * (60 * 60000)) {
    return Math.floor(difference / 1000 / 60 / 60) + ' Hours ago';
  }
}

export {transformTime, transformTimeDevices, transformTimeForStories};
