const WebSocket = require('ws');

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
  var intervalId;
  var delay = 1000;
  var runTime = 0;
  var allDevices = [];

  ws.on('message', function incoming(message) {

    try {
        message = JSON.parse(message);
    } catch (e) {
        console.log("not JSON");
        return false;
    }

    switch (message.type) {
      case 'start':
        if(intervalId)
          clearInterval(intervalId);
        if(message.delay)
          delay = message.delay;

        allDevices = message.allDevices;

        intervalId = setInterval(function() {
          runTime += delay;
          var response = {
            allDevices: [],
            generalCharts: [],
            time: runTime
          };

          for (var i = 0; i < allDevices.length; i++) {
            response.allDevices.push("Temperature: 123 Kelvin\nStatus: OK")
          }

          for (var i = 0; i < 5; i++) {
            response.generalCharts.push({x: runTime, y: randomInt(Math.log2(runTime) * 0.8, Math.log2(runTime) * 1.2)})
          }

          ws.send(JSON.stringify(response));
        }, delay);

        break;
      case 'pause':
        if(intervalId)
          clearInterval(intervalId);

        console.log('paused');
        break;
      case 'stop':
        if(intervalId)
          clearInterval(intervalId);
        runTime = 0;
        delay = 1000;

        break;

      default:

    }
  });

  ws.on('close', function close() {
    if(intervalId)
      clearInterval(intervalId);

  });


});