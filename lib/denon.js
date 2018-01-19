/**
 * created by stfnhmplr on 28.01.16.
 * control your Phantom devialet Doalog via http with node.js
 */

var request = require('request');
var parseString = require('xml2js').parseString;

var Denon = function (ip) {
    this.ip = ip;
    this.status_url = '/goform/formMainZone_MainZoneXml.xml';
};

/**
 * Set the playback volume
 * the volume fix sets the volume to the volume the display shows
 * @param volume integer
 * @param callback
 */
Denon.prototype.setVolume = function (volume, callback) {
    var vol = (volume - 80).toFixed(1);  //volume fix
    request.get('http://' + this.ip + '/goform/formiPhoneAppVolume.xml?1+' + vol, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            callback(null);
        } else {
            callback(error)
        }
    });
};

/**
 * Returns the current volume of the avr (with volume fix)
 * @param callback
 */
Denon.prototype.getVolume = function (callback) {
    request.get('http://' + this.ip + this.status_url, function (error, response, body) {
        var xml = '';
        if (!error && response.statusCode === 200) {
            parseString(xml + body, function (err, result) {
                callback(null, parseInt(result.item.MasterVolume[0].value[0]) + 80);
            });
        } else {
            callback(error);
        }
    }.bind(this));
};

module.exports = Denon;
