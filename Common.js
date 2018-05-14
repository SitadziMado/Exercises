'use strict';

function inherit(ctor, parent) {
    if (parent) {
        ctor.prototype = Object.create(parent.prototype);
    }

    ctor.constructor = parent;
}

function formatSeconds(value) {
    var min = (~~(value / 60)).toString();
    var sec = (~~(value % 60)).toString();

    if (sec.length === 1) {
        sec = '0' + sec;
    }

    return min + ':' + sec;
}

function odd(number) {
    return number % 2 === 1;
}

function even(number) {
    return !odd(number);
}