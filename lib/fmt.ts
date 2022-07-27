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

/**
 * Ref: Transform numbers to words in lakh / crore system
 * https://stackoverflow.com/a/30524915/12976234
 */
export const idrNumToWord = (idrNum: string) => {
  const arr = (x: string) => Array.from(x);
  const num = (x: string) => Number(x) || 0;
  const isEmpty = (xs: string[]) => xs.length === 0;
  const take = (n: number) => (xs: string[]) => xs.slice(0, n);
  const drop = (n: number) => (xs: string[]) => xs.slice(n);
  const reverse = (xs: string[]) => xs.slice(0).reverse();
  const comp =
    (f: (...x: any[]) => any) => (g: (...x: any[]) => any) => (x: string[]) =>
      f(g(x));
  const not = (x: string) => !x;
  const chunk: (n: number) => (xs: string[]) => string[][] = (n) => (xs) =>
    isEmpty(xs) ? [[]] : [take(n)(xs), ...chunk(n)(drop(n)(xs))];

  let numToWords = (n: string) => {
    let a = [
      "",
      "satu",
      "dua",
      "tiga",
      "empat",
      "lima",
      "enam",
      "tujuh",
      "delapan",
      "sembilan",
      "sepuluh",
      "sebelas",
      "dua belas",
      "tiga belas",
      "empat belas",
      "lima belas",
      "enam belas",
      "tujuh belas",
      "delapan belas",
      "sembilan belas",
    ];

    let b = [
      "",
      "",
      "dua puluh",
      "tiga puluh",
      "empat puluh",
      "lima puluh",
      "enam puluh",
      "tujuh puluh",
      "delapan puluh",
      "sembilan puluh",
    ];

    let g = [
      "",
      "ribu",
      "juta",
      "miliar",
      "triliun",
      "kuadriliun",
      "kuintiliun",
      "sekstiliun",
      "septiliun",
      "oktiliun",
      "noniliun",
    ];

    // this part is really nasty still
    // it might edit this again later to show how Monoids could fix this up
    let makeGroup = ([ones, tens, huns]: string[3]) => {
      return [
        num(huns) === 0
          ? ""
          : huns === "1"
          ? "seratus "
          : a[num(huns)] + " ratus ",
        num(ones) === 0
          ? b[num(tens)]
          : (b[num(tens)] && b[num(tens)] + " ") || "",
        a[num(tens + ones)] || a[num(ones)],
      ].join("");
    };

    let thousand = (group: string, i: number) =>
      group === "" ? group : `${group} ${g[i]}`;

    if (n === "0") return "nol ";
    else
      return (
        comp(chunk(3))(reverse)(arr(n))
          .map(makeGroup)
          .map(thousand)
          .filter(comp(not)(isEmpty))
          .reverse()
          .join(" ") + " "
      );
  };

  return numToWords(idrNum);
};

/**
 * Ref: Format JavaScript date as yyyy-mm-dd
 * https://stackoverflow.com/a/29774197/12976234
 *

 */
export const yyyyMmDd = (currentDate: Date) => {
  if (currentDate.toString() === "Invalid Date") {
    return "";
  }

  const offset = currentDate.getTimezoneOffset();

  currentDate = new Date(currentDate.getTime() - offset * 60 * 1000);
  const newDate = currentDate.toISOString().split("T")[0];

  return newDate;
};
