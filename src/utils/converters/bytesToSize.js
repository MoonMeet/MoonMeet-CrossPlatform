const bytesToSize = bytes => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) {
    return '0';
  }
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
  if (i === 0) {
    return `${bytes} ${sizes[i]})`;
  }
  return `${(bytes / 1024 ** i)?.toFixed(1)} ${sizes[i]}`;
};

export {bytesToSize};
