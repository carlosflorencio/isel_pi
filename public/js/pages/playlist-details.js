"use strict";

/*=====  Playlist Details Page ======*/

/*
|--------------------------------------------------------------------------
| DOM Events
|--------------------------------------------------------------------------
*/
function onClickDelete(element, playlistId, trackId) {

    spotie.fetch('/playlist/'+playlistId+'/track/'+trackId+'/remove', 'DELETE')
        .then(response => {
            Html.removeRow(element)
            spotie.notifyInfo(response.data)
        })
        .catch(spotie.notifyError)
}