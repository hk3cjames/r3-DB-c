// input hash from PS, upload to DB-t for querry and calculate checksum h256 to RS for sync
const express = require("express");
const cors = require('cors');
const app = express();
app.use(cors())

const fetch = require("node-fetch");

app.listen(3200, () => console.log("DB-c-RS1 listening at 127.0.0.1:3200"));

app.use(express.json({ limit: "1mb" }));

var res1 = {};
existHash = "ab1234";
app.post("/hashFile", (req, res) => {
  rxjson = req.body;
  console.log(rxjson);

  time = Date.now();
  newHash = rxjson.thash;

  console.log(existHash);
  console.log(newHash);

  if (newHash === existHash) {
    res_status = "fail";
  } else {
    res_status = "success";
    existHash = rxjson.thash;
  }
  console.log(res_status)
  res.json({
    status: res_status,
    hash: existHash,
    tick: time
  });

});
 