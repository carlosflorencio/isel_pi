"use strict";

/*=====  Playlists Page ======*/

/*
|--------------------------------------------------------------------------
| DOM Events
|--------------------------------------------------------------------------
*/
function onClickEdit(el, playlistId) {

    const anchorElement = Html.id('name-' + playlistId),
        playlistName = anchorElement.innerHTML.trim()

    spotie.prompt("Edit Playlist: " + playlistName, "Name:", playlistName,
        value => { // clicked ok

            if(value == playlistName) return // same name?

            spotie.fetch('/'+playlistId+'/edit', 'PUT', {name: value})
                .then(response => {
                    anchorElement.innerHTML = value
                    spotie.notifySuccess(response.data)
                })
                .catch(spotie.notifyError)

        }, () => { // canceled

        })

}