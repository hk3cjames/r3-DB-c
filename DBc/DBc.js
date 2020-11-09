

var tsHashCountr = []
for (i=0; i<1000;i++) {tsHashCountr[i]=i}
console.log(tsHashCountr)

async function intervalFunc() {
    const options = {
        method: "POST",
      };
    const res = await fetch("/DBCdisplay", options);
    const disp = await res.json();
    // console.log(disp);
    document.getElementById("tick").textContent = disp.cycle;
    const d = new Date();
    var str = "" + d;
    var test = str.substring(4, 24);
    document.getElementById("time").textContent = test;
    document.getElementById("count").textContent = disp.cycleHashCount;
    document.getElementById("hash").textContent = disp.cycleLinkHash
    for (i = 0; i < 1000; i++) {
        j = i + 1000;      
        k = "" + disp.dashboardDisp[i]
        display = "" + j + " " + k
        document.getElementsByTagName("p")[i].textContent = "-PS-"+display.substring(1) ;
    }
        

}
setInterval(intervalFunc, 1000); 