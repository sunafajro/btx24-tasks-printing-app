import moment from "moment";

moment.locale("ru");
const dateFormat = "YYYY-MM-DD";

export const getNumbers = (min, max) => {
  const arr = [];
  for (let i = min; i <= max; i++) {
    const num = i < 10 ? "0" + i : String(i);
    arr.push({
      text: num,
      value: num
    });
  }
  return arr;
};

export const getDays = ({ month = "01", year = "2018" }) => {
  const days = [];
  const date = year + "-" + month + "-01";
  const endOfMonth = parseInt(
    moment(date, dateFormat)
      .endOf("month")
      .format("DD")
  );
  for (let i = 1; i <= endOfMonth; i++) {
    const num = i < 10 ? "0" + i : String(i);
    days.push({
      text: num,
      value: num
    });
  }
  return days;
};

export const getMonths = () => {
  const months = [];
  for (let i = 1; i <= 12; i++) {
    const num = i < 10 ? "0" + i : String(i);
    const date = "2018-" + num + "-01";
    months.push({
      text: moment(date, dateFormat).format("MMMM"),
      value: num
    });
  }
  return months;
};

export const getYears = (start = 2018) => {
  const years = [];
  let currentYear = parseInt(moment().format("YYYY"));
  let i = 1;
  while (currentYear >= start) {
    // ограничиваем цикл (чтобы не стал бесконечным)
    if (i > 100) {
      currentYear = start - 1;
    }
    years.push({
      text: String(currentYear),
      value: String(currentYear)
    });
    currentYear = currentYear - 1;
    i++;
  }
  return years;
};
