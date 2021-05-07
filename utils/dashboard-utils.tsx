import regression from "regression";
import settings from "../components/Dashboards/__settings__/settings.json";

/**
 * Validates command that user typed and parse code it into string.
 * When command is invalid, return "". Else return encoded string.
 * Encoding is following:
 * "<scoreGreaterThan>|<scoreLessThan>|<percentileGreaterThan>|<percentileLessThan>|<weekGreaterThan>|<weekLessThan>"
 * @param inputValue is typed command
 */
export const validateInput = (inputValue: string) => {
  const predicates = inputValue.toLowerCase().trim().split("and");
  const res = [
    "", // score greater than
    "", // score less than
    "", // percentile greater than
    "", // percentile less than
    "", // week greater than
    "", // week less than
  ];
  let valid = true;

  predicates.map((predicate) => {
    const pred = predicate.trim().replace(/ +/g, " ").split(" ");
    if (pred.length !== 3) {
      valid = false;
      return;
    }

    if (
      pred[0] === "score" &&
      (pred[1] === "<" || pred[1] === ">") &&
      !isNaN(Number(pred[2]))
    ) {
      res[pred[1] === ">" ? 0 : 1] = pred[2];
    } else if (
      pred[0] === "percentile" &&
      (pred[1] === "<" || pred[1] === ">") &&
      !isNaN(Number(pred[2]))
    ) {
      res[pred[1] === ">" ? 2 : 3] = pred[2];
    } else if (
      pred[0] === "week" &&
      (pred[1] === "<" || pred[1] === ">") &&
      !isNaN(Number(pred[2]))
    ) {
      res[pred[1] === ">" ? 4 : 5] = pred[2];
    } else {
      valid = false;
      return;
    }
  });

  return !valid || res.every((e) => e === "") ? "" : res.join("|");
};

type Settings = {
  parallel: string;
  assignment: string;
  customCommand: any;
};

export const createParametersToQuery = (filterSettings: Settings) => {
  const [sgt, slt, pgt, plt, wgt, wlt] = filterSettings.customCommand;

  if (filterSettings.assignment !== "")
    return "(assName: " + filterSettings.assignment + ")";
  if (filterSettings.parallel !== "")
    return "(parName: " + filterSettings.parallel + ")";

  const x =
    (sgt === "" ? "" : "sgt: " + sgt + ", ") +
    (slt === "" ? "" : "slt: " + slt + ", ") +
    (pgt === "" ? "" : "pgt: " + pgt + ", ") +
    (plt === "" ? "" : "plt: " + plt + ", ") +
    (wgt === "" ? "" : "wgt: " + wgt + ", ") +
    (wlt === "" ? "" : "wlt: " + wlt + ", ");

  return x === "" ? "" : "(" + x.substr(0, x.length - 2) + ")";
};

/**
 * Returns percentage ratio of numbers in array.
 * @param arr is array of numbers for ratio calculation.
 */
export const getPercentageRatio = (arr: number[]) => {
  const accumulate = arr.reduce((acc, x) => acc + x);
  const c = 100 / accumulate;
  return arr.map((x) => Math.ceil(x * c));
};

/**
 * Rounds up decimal number to certain precision of floating point.
 * @param num
 * @param precision
 */
export const roundUp = (num, precision) => {
  precision = Math.pow(10, precision);
  return Math.ceil(num * precision) / precision;
};

/**
 * Returns Standard CTU Grading according to score
 * @param score
 */
export const getGrade = (score: number) => {
  return score >= 90
    ? "A"
    : score >= 80
    ? "B"
    : score >= 70
    ? "C"
    : score >= 60
    ? "D"
    : score >= 50
    ? "E"
    : "F";
};

/**
 * Calculates regression according to arr and predicts values for weeks of semester. Those values are returned
 * @param arr is sample data
 * @param polynomial is indicates, whether polynomial or linear regression should be used
 */
export const getRegression = (arr: number[], polynomial?: boolean) => {
  const xVal = Array(arr.length)
    .fill(0)
    .map((_, x) => x);
  const zipped = xVal.map((a, i) => [a, arr[i]]);

  const result = polynomial
    ? regression.polynomial(zipped)
    : regression.linear(zipped);
  const prediction = Array(settings.courseSettings.numberOfWeeks)
    .fill(0)
    .map(
      (_, i) => result.predict(i)[1] // y value
    );

  return prediction;
};

/**
 * Calculates current semester week number
 * @param date is in format "2021-04-26" <==> "YYYY-MM-DD"
 */
export const getSemesterWeek = (date: string) => {
  const now = new Date();
  const start = new Date(date);
  const diff = now - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const day = Math.floor(diff / oneDay);
  const week = Math.floor(day / 7 + 1);

  return week > settings.courseSettings.numberOfWeeks
    ? settings.courseSettings.numberOfWeeks
    : week < 0
    ? 1
    : week;
};
