'use strict';

var config = {
    gameBlock: '#div-grid',
    infoBlock: '#div-info',
    width: 18,
    height: 12,
    time: 60
};

var game;

document.addEventListener(
    'keydown',
    document_onKeyDown,
    false
);

window.onerror = function myErrorHandler(errorMsg, url, lineNumber) {
    alert("Error occurred: " + errorMsg + ' in ' + url + ', line ' + lineNumber);
    return false;
};

function document_onKeyDown(e) {
    var key = String.fromCharCode(e.keyCode);
    if (game) {
        game.dispatchControl(e.keyCode);
    }
}