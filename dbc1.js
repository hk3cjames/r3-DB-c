// input hash from PS, upload to DB-t for querry and calculate checksum h256 to RS for sync
  const express = require("express");
  const cors = require('cors');
  var crypto = require("crypto");
  const app = express();
  app.use(cors())
  const fetch = require("node-fetch");
  const { stringify } = require("querystring");
  app.use(express.static("DBc"));
  app.use(express.json({ limit: "1mb" }));
  DBcID = "RBAS.RS1.DBc0";
  PSID = "RBAS.ps";
  var res1 = {};
  psKeyOriginal = [];
  psKey = [];
  psName = [];
  PsIn = [];
  dashboardDisp = [];
  systemTick = 0;
  addHash = 0
  nextChain = "";
  busyFlag = false;
  totalHashToDBcCount = 0;
  dashboardDispHashCount = 0;
  psIn = [];
  psInCount = []
  hashToDBt = [];
  hashToDBtTSname = [];
  for (i = 0; i < 1000; i++) {
    k = 1000 + i;
    j = PSID + k;
    psInCount[i] = 0;
    psName[i] = j; // j: name to gen initial hash key
    psKey[i] = crypto.createHash("sha256").update(j).digest("hex");
    psKeyOriginal[i] = psKey[i]; // initial key
  }
  console.log("default Key table")
  console.log(psName)
  console.log(psKey)

app.listen(3200, () =>
  console.log("RS1 DB-c0 listening at port 3200" +
    "\n" + "connect to RS1 localhost:3500" +
    "\n" + "connect to DB-t at :3400"));

function checkPSname(name, ID) {
  for (i = 0; i < 1000; i++) {
    if (name == psName[i]) {
      if (ID == psKey[i] || ID == psKeyOriginal[i]) {
        return i;
      }
    }
  }
  return 1000; // >= 1000
}

async function timeAdj() {
  return;
}

app.post("/hashFile", (req, res) => {
  rxjson = req.body;
  // console.log("PS input json");
  // console.log(rxjson.psCycleCount)
  while (busyFlag == true) {
    setInterval(timeAdj, 10);
  }
  psPointer = checkPSname(rxjson.psId, rxjson.chainId);
  // console.log("tsId =" + rxjson.tsId) //==index of input hash
  // console.log("tsPointer =" + tsPointer)
  if (psPointer < 1000) {
    // console.log(psPointer)
    psIn[psPointer] = rxjson.tsHash;
    psInCount[psPointer] = rxjson.psCycleCount
    addHash = addHash + rxjson.psCycleCount //addHash is the object of additional hash/tick
    j = stringify(rxjson.tsHash)  // next link will be the hash of previous hash object
    // console.log("addHash = " + addHash)
    psKey[psPointer] = crypto.createHash("sha256").update(j).digest("hex");
    result = "submitted";
  } else {
    result = "fail: wrong PSname/LinkHash";
  }

  resJson = {
    status: result,
    nextChainId: psKey[psPointer],
    tick: systemTick,
  };
  res.json(resJson);
  // console.log(resJson)
}
);

async function intervalFunc() {
  // console.log("tick = " + systemTick)
  systemTick++
  // console.log(addHash)
  key = "" + systemTick + addHash
  nextChain = crypto.createHash("sha256").update(key).digest("hex"); // hash to RS
  dashboardDispHashCount = 0
  dashboardDisp = [] 
  // console.log(psInCount)    
  for (i=0; i<1000; i++){
    dashboardDisp[i] = psInCount[i]
    psInCount[i] = 0

    // if (dashboardDisp[i] > 1000) {dashboardDisp[i]=dashboardDisp[i]-1000}
    dashboardDispHashCount = dashboardDispHashCount + dashboardDisp[i]
  }

  const options = {
    method: "POST",
    timeout: 300,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  res1 = await fetch("http://127.0.0.1:3500/db_c", options) //to RS 
  const disp = await res1.json();
  console.log(disp)
  console.log(disp.status)
  result = disp.status
  existHash = disp.hash
}

app.post("/DBCdisplay", async (req, res) => {
  // console.log("input from PS dashboard")
  rxjson = req.body;
  // console.log("PS dashboard req");
  // console.log(rxjson);
  // while (busyFlag == true) {
  //   setInterval(timeAdj, 10); // wait till PS display json is ready
  // }
  // console.log("PS response to TS");
  resJson = {
    cycle: systemTick,
    cycleHashCount: dashboardDispHashCount,
    cycleLinkHash: nextChain,
    dashboardDisp,
  };
  res.json(resJson);
  // console.log(resJson);
});
setInterval(intervalFunc, 1000);