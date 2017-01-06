"use strict";

console.log(spotie)

function addTrackToPlaylist(trackId) {
    console.log(trackId)


    spotie.fetch('/add-track')
        .then(function (response) {
            console.log(response)
            spotie.notifySuccess('Success message');
        })
        .catch(function (error) {
            console.log(error)
            spotie.notifyError('error');
        })



    return false // dont let the form submit
}
