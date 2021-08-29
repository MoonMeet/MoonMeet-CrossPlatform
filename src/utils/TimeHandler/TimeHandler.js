export default function transformTime(time: number) {
  const passedTime = time;
  const newTime = Date.now();
  const difference = newTime - passedTime;
  if (difference < 60000) {
    return 'Active Now';
  } else if (difference < 60 * 60000) {
    return (
      'Active ' + Math.floor((difference / 1000 / 60) % 60) + ' Minutes ago'
    );
  } else if (difference < 24 * (60 * 60000)) {
    return 'Active ' + Math.floor(difference / 1000 / 60 / 60) + ' Hours ago';
  } else if (difference < 24 * (60 * 60 * 60000)) {
    return (
      'Active ' + Math.floor(difference / 1000 / 60 / 60 / 24) + ' Day ago'
    );
  } else {
    return 'Long time ago';
  }
}
