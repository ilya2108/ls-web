import {getPercentageRatio, roundUp, validateInput} from "./dashboard-utils";

describe("getPercentageRatio function", () => {
  test("values are equivalent to its ratio", () => {
    expect(getPercentageRatio([10, 20, 30, 40])).toStrictEqual([
      10,
      20,
      30,
      40,
    ]);
  });
  test("values are lower than its percentage", () => {
    expect(getPercentageRatio([1, 2, 3, 4])).toStrictEqual([10, 20, 30, 40]);
  });
  test("values are higher than its percentage 1", () => {
    expect(getPercentageRatio([1000, 2000, 3000, 4000])).toStrictEqual([
      10,
      20,
      30,
      40,
    ]);
  });
  test("values are higher than its percentage 2", () => {
    expect(getPercentageRatio([500, 1000, 1500, 2000])).toStrictEqual([
      10,
      20,
      30,
      40,
    ]);
  });
});

describe("validateInput function", () => {
  test("valid input without conjunction 1", () => {
    expect(validateInput("score > 5")).toStrictEqual("5|||||");
    expect(validateInput("    percentile   <    5  ")).toStrictEqual("|||5||");
    expect(validateInput("percentile < 5.2")).toStrictEqual("|||5.2||");
  });
  test("invalid input without conjunction 1", () => {
    expect(validateInput("scor > 5")).toStrictEqual("");
    expect(validateInput("score > 5,2")).toStrictEqual("");
    expect(validateInput("score > 5.5s")).toStrictEqual("");
    expect(validateInput("score > 5.5 score")).toStrictEqual("");
  });
  test("valid input with conjunction 1", () => {
    expect(validateInput("score > 5 and score < 10")).toStrictEqual("5|10||||");
    expect(
      validateInput(
        "score > 5 and score < 10  and  percentile > 5 and percentile < 10 "
      )
    ).toStrictEqual("5|10|5|10||");
    expect(
      validateInput(
        "score > 5 and score < 10  and  percentile > 5 and percentile < 10 and week > 5 and week < 10"
      )
    ).toStrictEqual("5|10|5|10|5|10");
  });
  test("valid input with conjunction 1", () => {
    expect(validateInput("score > 5 and")).toStrictEqual("");
  });
  test("invalid input - edge case 1", () => {
    expect(validateInput("")).toStrictEqual("");
    expect(validateInput("score > 5 and fesf wda dwd and score > 5")).toStrictEqual("")
    expect(validateInput("score > 5 and wda dwd and score > 5")).toStrictEqual("")
  });
});

describe("roundUp function", () => {
  test("", () => {
    expect(roundUp(2.456764, 2)).toStrictEqual(2.46)
    expect(roundUp(2.456764, 10)).toStrictEqual(2.456764)
    expect(roundUp(2.456764, 0)).toStrictEqual(3)
    expect(roundUp(-2.456764, 0)).toStrictEqual(-2)
    expect(roundUp(12.456764, -1)).toStrictEqual(20)
    expect(roundUp(12.456764, -2)).toStrictEqual(100)
    expect(roundUp(-102.456764, -2)).toEqual(-100)
  })
})
