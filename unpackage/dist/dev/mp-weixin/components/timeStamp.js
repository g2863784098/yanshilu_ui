"use strict";
function formatTimestamp(timestamp, format = "YYYY-MM-DD HH:mm") {
  let ts = Number(timestamp);
  if (ts.toString().length === 10) {
    ts *= 1e3;
  }
  const date = new Date(ts);
  function pad(n) {
    return n < 10 ? "0" + n : n;
  }
  return format.replace("YYYY", date.getFullYear()).replace("MM", pad(date.getMonth() + 1)).replace("DD", pad(date.getDate())).replace("HH", pad(date.getHours())).replace("mm", pad(date.getMinutes()));
}
exports.formatTimestamp = formatTimestamp;
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/timeStamp.js.map
