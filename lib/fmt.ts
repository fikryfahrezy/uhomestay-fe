export const idrCurrency = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
});

export const idDate = (date: Date) => {
  if (date.toString() === "Invalid Date") {
    return "";
  }

  const formater = new Intl.DateTimeFormat("id-ID", {
    year: "numeric",
    month: "long",
  });

  return formater.format(date);
};

/**
 * Ref: Format JavaScript date as yyyy-mm-dd
 * https://stackoverflow.com/a/29774197/12976234
 *
 */
export const yyyyMm = (currentDate: Date) => {
  if (currentDate.toString() === "Invalid Date") {
    return "";
  }

  const offset = currentDate.getTimezoneOffset();

  currentDate = new Date(currentDate.getTime() - offset * 60 * 1000);
  const newDate = currentDate
    .toISOString()
    .split("T")[0]
    .split("-")
    .slice(0, 2)
    .join("-");

  return newDate;
};
