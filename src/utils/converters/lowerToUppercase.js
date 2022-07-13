const lowerToUppercase = text => {
  if (!text || text?.length < 1) {
    return '';
  }
  return (text[0]?.toUpperCase() + text?.substring(1)).trim();
};

export {lowerToUppercase};
