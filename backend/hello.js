const http = require("http");
const host = "localhost";
const port = 8000;
const _ = require("lodash");

const pieChart = JSON.stringify({ iOS: 40, android: 60 });
const rankingChart = JSON.stringify([
  { key: "Day 1", value: _.random(0, 20) },
  { key: "Day 2", value: _.random(0, 20) },
  { key: "Day 3", value: _.random(0, 20) },
  { key: "Day 4", value: _.random(0, 20) },
  { key: "Day 5", value: _.random(0, 20) },
  { key: "Day 6", value: _.random(0, 20) },
  { key: "Day 7", value: _.random(0, 20) },
]);

const requestListener = function (req, res) {
  res.setHeader("Content-Type", "application/json");
  switch (req.url) {
    case "/hello":
      res.writeHead(200);
      res.end("Hello every");
      break;

    case "/device_summary":
      setTimeout(() => {
        res.writeHead(200);
        res.end(pieChart);
      }, 10000);
      break;

    case "/ranking":
      setTimeout(() => {
        res.writeHead(200);
        res.end(rankingChart);
      }, 5000);
      break;
  }
};
const server = http.createServer(requestListener);
server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
