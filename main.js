'use strict';

var game = undefined;

document.addEventListener(
    'keydown',
    document_onKeyDown,
    false
);

window.onerror = function myErrorHandler(errorMsg, url, lineNumber) {
    alert("Error occurred: " + errorMsg + ' in ' + url + ', line ' + lineNumber);
    return false;
};

function changeGame(name) {
    if (game) {
        game.clear();
    }

    var config = {
        gameBlock: '#div-grid',
        infoBlock: '#div-info',
        width: 18,
        height: 12,
        time: 60
    };

    if (name === 'SearchGame') {
        game = new SearchGame(config);
    } else if (name === 'SumGame') {
        game = new SumGame(config);
    } else if (name === 'TripleGame') {
        game = new TripleGame(config);
    }
}

function document_onKeyDown(e) {
    var key = String.fromCharCode(e.keyCode);
    if (game) {
        game.dispatchControl(e.keyCode);
    }
}