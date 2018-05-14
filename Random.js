function Random() {
    var self = this;

    var latinLetters = [];
    var latinLettersCnt = 'z'.charCodeAt(0) - 'a'.charCodeAt(0) + 1;
    var cur = 'a'.charCodeAt(0);

    for (var i = 0; i < latinLettersCnt; ++i) {
        latinLetters.push(String.fromCharCode(cur + i));
    }

    this.latin = function () {
        return self.choice(latinLetters);
    };

    var cyrillicLetters = [];
    var cyrillicLettersCnt = 'я'.charCodeAt(0) - 'а'.charCodeAt(0) + 1;
    cur = 'а'.charCodeAt(0);

    for (i = 0; i < cyrillicLettersCnt; ++i) {
        cyrillicLetters.push(String.fromCharCode(cur + i));
    }

    this.cyrillic = function () {
        return self.choice(cyrillicLetters);
    };

    this.digit = function () {
        return self.int(0, 9);
    };
}

// Получить случайное целое на отрезке [from; to]
Random.prototype.int = function (from, to) {
    return Math.floor(Math.random() * (to - from + 1) ) + from;
};

Random.prototype.yesNo = function(yesChance) {
    if (yesChance && (0 <= yesChance && yesChance <= 100)) {
        return this.int(0, 100) <= yesChance;
    } else {
        return this.int(0, 1) === 1;
    }
};

Random.prototype.choice = function(seq) {
    var ch = this.int(0, seq.length - 1);
    return seq[ch];
};

Random.prototype.shuffle = function(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
};