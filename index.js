var Service, Characteristic;
var discoverInterval = 10000; // rajouté pour pour les Devialets
var Denon = require('./lib/denon');
var inherits = require('util').inherits;
var pollingtoevent = require('polling-to-event');
var ssdp = require('node-ssdp').Client, client = new ssdp(), http = require('http'), url = require('url'), request = require('request'), actVol=0, actualDevice = []; // rajouté pour pour les Devialets


module.exports = function (homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;

    homebridge.registerAccessory('DevialetPhantomDialog', DenonAVRAccessory);
					};

function DenonAVRAccessory(log, config) {
    this.log = log;
	var that = this;
	
    this.config = config;
    this.devialet_ipaddress = config['ip']; // recuperer l'Ip dans Config pour le module devialet
    this.name = config['name'];

    this.defaultInput = config['defaultInput'] || null;
    this.defaultVolume = config['defaultVolume'] || null;
    this.minVolume = config['minVolume'] || 0;
    this.maxVolume = config['maxVolume'] || 70;
	this.doPolling = config['doPolling'] || false;
	
	this.pollingInterval = config['pollingInterval'] || "60";
	this.pollingInterval = parseInt(this.pollingInterval)

    this.denon = new Denon(this.devialet_ipaddress);
	
	this.setAttempt = 0;
	this.state = false;
	if (this.interval < 10 && this.interval > 100000) {
		this.log("polling interval out of range.. disabled polling");
		this.doPolling = false;
							  }

	// Status Polling
	if (this.doPolling) {
		that.log("start polling..");
		var statusemitter = pollingtoevent(function(done) {
			that.log("do poll..")
			that.getPowerState( function( error, response) {
				done(error, response, this.setAttempt);
			}, "statuspoll");
		}, {longpolling:true,interval:that.pollingInterval * 1000,longpollEventName:"statuspoll"});

		statusemitter.on("statuspoll", function(data) {
			that.state = data;
			that.log("poll end, state: "+data);
			
			if (that.switchService ) {
				that.switchService.getCharacteristic(Characteristic.On).updateValue(that.state, null, "statuspoll");
			}
		});
	}
}


DenonAVRAccessory.prototype.getVolume = function (callback) {
    this.denon.getVolume(function (err, volume) {
        if (err) {
            this.log('get Volume error: ' + err)
            callback(err);
        } else {
            this.log('current volume is: ' + volume);
            var pVol = Math.round(volume / this.maxVolume * 100);
            callback(null, pVol);
        }
    }.bind(this))
};

DenonAVRAccessory.prototype.setVolume = function (pVol, callback) {
    var volume = Math.round(pVol / 100 * this.maxVolume);
    this.denon.setVolume(volume, function (err) {
        if (err) {
            this.log('set Volume error: ' + err);
        } else {
            this.log('set Volume to: ' + volume);
            callback(null);
        }
    }.bind(this))
};


DenonAVRAccessory.prototype.getServices = function () {
    var informationService = new Service.AccessoryInformation();

    informationService
        .setCharacteristic(Characteristic.Name, this.name)
        .setCharacteristic(Characteristic.Manufacturer,  'Devialet');

    this.switchService = new Service.Switch(this.name);
    this.switchService.getCharacteristic(Characteristic.On)
        .on('get', this.getPowerState.bind(this))
        .on('set', this.setPowerState.bind(this));
// J'ai enlevé la partie Mute ici
    this.switchService.addCharacteristic(Characteristic.Volume)
        .on('get', this.getVolume.bind(this))
        .on('set', this.setVolume.bind(this));

    return [informationService, this.switchService];
};
