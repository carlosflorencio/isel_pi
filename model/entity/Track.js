"use strict";

/**
 * Track Entity
 * @param id
 * @param name
 * @param disk
 * @param duration
 * @param previewUrl
 * @param track_number
 * @param uri
 * @constructor
 */
function Track(id, name, disk, duration, previewUrl, track_number, uri) {
    this.id = id
    this.name = name
    this.disk = disk
    this.duration = duration
    this.previewUrl = previewUrl
    this.track_number = track_number
    this.uri = uri
}

/**
 * Get duration as minutes:seconds
 * @return {string}
 */
Track.prototype.getDuration = function () {
    let seconds = parseInt((this.duration/1000)%60),
        minutes = parseInt((this.duration/(1000*60))%60)

    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return minutes + ":" + seconds;
}

module.exports = Track