var sim_payload;
var res;
var fishery_colors = {};

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
  
// load initial simulation config and run it
// in development, you can switch it to use a fake response, provided under assets/fake.json

var j_req = new XMLHttpRequest();
j_req.responseText = 'json';
j_req.open('GET','assets/sim.json');
j_req.onload = function() {
    sim_payload = JSON.parse(j_req.response);
    Object.keys(sim_payload["fisheries"]).forEach(function(k) {
        fishery_colors[sim_payload["fisheries"][k]["name"]] = "rgb("+getRandomInt(256)+","+getRandomInt(256)+","+getRandomInt(256)+")";
    });
    var xhr = new XMLHttpRequest();
   // xhr.open("POST", "/api/sim", true);
    //xhr.setRequestHeader('Content-Type', 'application/json');
    //xhr.send(JSON.stringify(sim_payload));
    xhr.open("GET","assets/fake.json", true);
    xhr.onload = function() {
        res = JSON.parse(xhr.responseText);
    }
    xhr.send(null);
}
j_req.send(null);

