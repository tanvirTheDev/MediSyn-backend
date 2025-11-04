const pick = (obj: any, keys: string[]) => {
  const finalObject: Record<string, any> = {};

  for (const key of keys) {
    if (obj && Object.prototype.hasOwnProperty.call(obj, key)) {
      finalObject[key] = obj[key];
    }
  }

  return finalObject;
};

export default pick;
