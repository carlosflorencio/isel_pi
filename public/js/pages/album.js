"use strict";
/*=====  Albums Page ======*/

/*
|--------------------------------------------------------------------------
| DOM Listeners
|--------------------------------------------------------------------------
*/
function onSelectChange(selectElement, trackId) {
    const buttonElement = Html.id('btn-' + trackId)
    const optionElement = Html.selectGetSelectedOption(selectElement)

    // Toggle add or remove button
    toggleButton(optionElement, buttonElement)
}


function onButtonClick(buttonElement, trackId) {
    const selectElement = Html.id('select-' + trackId)
    const optionElement = Html.selectGetSelectedOption(selectElement)
    const playlistId = Html.selectGetValue(selectElement)

    if(playlistId.length == 0) //default option
        return spotie.notifyError("Choose a playlist!")

    if(isChecked(optionElement)) { // remove
        spotie.fetch('/playlist/'+playlistId+'/track/'+trackId+'/remove', 'DELETE')
            .then(response => {
                optionElement.innerHTML = optionElement.innerHTML.trim().substr(2) // remove ✓space
                toggleButton(optionElement, buttonElement)
                spotie.notifyInfo(response.data)
            })
            .catch(spotie.notifyError)

    } else { // add
        spotie.fetch('/playlist/' + playlistId + '/add/' + trackId, 'PUT')
            .then(response => {
                optionElement.innerHTML = "✓ " + optionElement.innerHTML
                toggleButton(optionElement, buttonElement)
                spotie.notifySuccess(response.data)
            })
            .catch(spotie.notifyError)
    }
}

/*
|--------------------------------------------------------------------------
| DOM Modifiers
|--------------------------------------------------------------------------
*/
function toggleButton(optionElement, buttonElement) {
    if(isChecked(optionElement)) {
        buttonElement.innerHTML = '<i class="fa fa-trash fa-fw"></i>'
        buttonElement.classList.remove('btn-success')
        buttonElement.classList.add('btn-danger')
    } else {
        buttonElement.innerHTML = '<i class="fa fa-plus fa-fw"></i>'
        buttonElement.classList.remove('btn-danger')
        buttonElement.classList.add('btn-success')
    }
}

function isChecked(optionElement) {
    return optionElement.innerHTML.indexOf('✓') !== -1
}
