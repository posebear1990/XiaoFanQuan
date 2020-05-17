export function formatTime(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const hour = date.getHours();
  const minute = date.getMinutes();

  const mainDate =
    year === new Date().getFullYear() ? [month, day] : [year, month, day];

  return (
    mainDate.map(formatNumber).join("-") +
    " " +
    [hour, minute].map(formatNumber).join(":")
  );
}

export function formatNumber(n) {
  n = n.toString();
  return n[1] ? n : "0" + n;
}
