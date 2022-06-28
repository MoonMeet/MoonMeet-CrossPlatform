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
    return Math.floor(difference / 1000 / 60 / 60 / 24) + ' Days ago';
  } else {
    return 'Long time ago';
  }
}

function transformTimeForStories(time: number) {
  const passedTime = time;
  let returnCondition = Boolean;
  const newTime = Date.now();
  const difference = newTime - passedTime;
  if (difference < 60000) {
    console.log(returnCondition);
    return 'Posted Now';
  } else if (difference < 60 * 60000) {
    returnCondition = Math.floor((difference / 1000 / 60) % 60) === 1;
    return returnCondition
      ? Math.floor((difference / 1000 / 60) % 60) + ' Minute ago'
      : Math.floor((difference / 1000 / 60) % 60) + ' Minutes ago';
  } else if (difference < 24 * (60 * 60000)) {
    returnCondition = Math.floor(difference / 1000 / 60 / 60) === 1;
    return returnCondition
      ? Math.floor(difference / 1000 / 60 / 60) + ' Hour ago'
      : Math.floor(difference / 1000 / 60 / 60) + ' Hours ago';
  }
}

function transformTimeChats(time: number) {
  const passedTime = time;
  let returnCondition = Boolean;
  const newTime = Date.now();
  const difference = newTime - passedTime;
  if (difference < 60000) {
    console.log(returnCondition);
    return 'Sent Now';
  } else if (difference < 60 * 60000) {
    returnCondition = Math.floor((difference / 1000 / 60) % 60) === 1;
    return returnCondition
      ? Math.floor((difference / 1000 / 60) % 60) + ' Minute ago'
      : Math.floor((difference / 1000 / 60) % 60) + ' Minutes ago';
  } else if (difference < 24 * (60 * 60000)) {
    returnCondition = Math.floor(difference / 1000 / 60 / 60) === 1;
    return returnCondition
      ? Math.floor(difference / 1000 / 60 / 60) + ' Hour ago'
      : Math.floor(difference / 1000 / 60 / 60) + ' Hours ago';
  } else if (difference < 24 * (60 * 60 * 60000)) {
    returnCondition = Math.floor(difference < 24 * (60 * 60 * 60000)) === 1;
    return returnCondition
      ? Math.floor(difference / 1000 / 60 / 60 / 24) + 'Day ago'
      : Math.floor(difference / 1000 / 60 / 60 / 24) + ' Days ago';
  }
}

export {
  transformTime,
  transformTimeDevices,
  transformTimeForStories,
  transformTimeChats,
};
