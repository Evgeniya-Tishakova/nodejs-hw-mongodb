const parseType = (value) => {
  const parsedType = ["home", "work", "personal"];

  if (typeof value === "undefined") {
    return undefined;
  }

  if (!parsedType.includes(value)) {
    return undefined;
  }

  return value;
};

const parseIsFavourite = (value) => {
  if (typeof value === "undefined") {
    return undefined;
  }

  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }
  return undefined;
};

export const parseFilterParams = (query) => {
  const { type, isFavourite } = query;

  const parsedType = parseType(type);
  const parsedIsFavourite = parseIsFavourite(isFavourite);

  const filter = {};

  if (parsedType !== undefined) {
    filter.contactType = parsedType;
  }

  if (parsedIsFavourite !== undefined) {
    filter.isFavourite = parsedIsFavourite;
  }

  return filter;
};
