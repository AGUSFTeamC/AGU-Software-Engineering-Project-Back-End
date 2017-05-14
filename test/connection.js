const WebSocket = require('ws');
var expect    = require("chai").expect;

const server = require('../index.js');
var ws;


describe("Websocket server", function() {

	it('establishes connection', function(done) {
		ws = new WebSocket('ws://localhost:443');
		ws.on('open', function() {
			ws.close();
			done();
		});

	});

	describe('Simulation', function()  {

		afterEach((done) => {
		    // Cleanup
		    if(ws.connected) {
		      ws.close();
		    }
		    done();
	  	});
		beforeEach(function(done) {
			ws = new WebSocket('ws://localhost:443');
			ws.on('open', function() {
				var request = {
					type: 'start',
					delay: 100,
					allDevices: [[{"name":"type","value":"base-stations"},{"name":"ant-h","value":"21"},{"name":"ant-t","value":"3213"},{"name":"sec-num","value":"12"},{"name":"latlng","value":{"lat":51.440312757160115,"lng":6.361083984375001}}],[{"name":"type","value":"iot-device"},{"name":"hardware","value":"x86 Generic Platform"},{"name":"os-image","value":"RioT x86"},{"name":"location","value":"Basement"},{"name":"protocol","value":"UDP"},{"name":"repint","value":"21"},{"name":"packsize","value":"12"},{"name":"packsize","value":""},{"name":"latlng","value":{"lat":51.089722918116315,"lng":5.51513671875}},{"name":"dist","value":70.59699848326136}]]
				};

			  	ws.send(JSON.stringify(request));
			  	done();
			});

		});


		it('starts the simulation', function(done) {

			ws.on('message', function(response) {
				
				response = JSON.parse(response);
				expect(response.generalCharts.length).to.equal(2);
				ws.close();
				done();
			})

		});

		it('stops the simulation', function(done) {
			var firstResponse = '';
			var lastResponse = '';
			ws.on('message', function(response) {
				if(firstResponse == '')
					firstResponse = response;

				lastResponse = response;
		        var request = {
	            	type: 'stop'
	          	}

				ws.send(JSON.stringify(request));

				setTimeout(function() {
					expect(firstResponse).to.equal(lastResponse);
					done();
				},100);
			})
		});

		it('clears the interval after it is stopped', function() {
			ws.on('message', function(response) {
		        var request = {
	            	type: 'stop'
	          	}

				ws.send(JSON.stringify(request));
				expect(server.connections[0].intervalId).to.equal(false);
			})			
		})
	})
});