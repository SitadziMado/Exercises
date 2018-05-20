'use strict';

function SearchGame(config) {
    config.selectionWidth = config.selectionWidth || 6;
    config.selectionHeight = config.selectionHeight || 3;
    config.description = '';
    config.density = 6;
    config.goalCount = 2;

    var self = this;

    Object.defineProperties(
        this, {
            density: {
                get: function () {
                    return config.density;
                },
                set: function (value) {
                    config.density = value;
                }
            }
        }
    );

    BaseSymbolGame.apply(this, arguments);

    function match(eq) {
        var isFound = false;
        var selected = [];

        eq = eq || false;

        self.selection(function () {
            if (~self.goals.indexOf(this.text)) {
                isFound = true;
                selected.push(this);
            }
        });

        var markFunc = function () {};

        if (eq) {
            if (isFound) {
                self.updateStatistics(true);
                markFunc = Cell.prototype.markRight;
            } else {
                self.updateStatistics(false);
                markFunc = Cell.prototype.markWrong;
            }
        } else {
            if (isFound) {
                self.updateStatistics('miss');
                markFunc = Cell.prototype.markMissed;
            } else {
                //
            }
        }

        for (var a in selected) {
            if (selected.hasOwnProperty(a)) {
                markFunc.apply(selected[a]);
            }
        }

        if (!self.advance(self.selectionHeight, true)) {
            self.generate();
        }
    }

    this.addControl('1'.charCodeAt(0), function () {
        var result = match.apply(self, [true]);
    });

    this.addControl('2'.charCodeAt(0), function () {
        var result = match.apply(self);
    });
}

inherit(SearchGame, BaseSymbolGame);

SearchGame.prototype.fillInfo = function () {
    BaseSymbolGame.prototype.fillInfo.apply(this, arguments);

    var self = this;

    this.settings.addComboBox(
        'density',
        'Количество символов в рамке: ',
        { 6: 'Мало', 9: 'Средне', 12: 'Много' },
        function () {
            self.density = +this.value;
            self.restart();
        }
    );
};

SearchGame.prototype.generate = function (width, height) {
    BaseSymbolGame.prototype.generate.apply(this, arguments);

    var rnd = new Random();
    var times = (this.width / this.selectionWidth) * (this.height / this.selectionHeight);

    // Заполним поле
    for (var i = 0; i < times; ++i) {
        var density = this.density;
        var fillers = [];
        var hasDesired = false;

        for (var j = 0; j < this.selectionWidth * this.selectionHeight; ++j) {
            if (density) {
                var cur = this.generator();

                if (~this.goals.indexOf(cur)) {
                    hasDesired = true;
                }

                fillers.push(cur);
                --density;
            } else {
                fillers.push('');
            }
        }

        if (!hasDesired) {
            if (rnd.yesNo(25)) {
                fillers[0] = rnd.choice(this.goals);
            }
        }

        var actual = rnd.shuffle(fillers);

        this.selection(
            function () {
                this.text = actual.pop();
            }
        );

        this.advance(this.selectionHeight, true);
    }

    this.description = 'Задача - нажимать клавишу &lt;1&gt;, если в выделении есть символ "' +
        this.goals[0] + '" или "' + this.goals[1] + '", нажимать &lt;2&gt; иначе.';

    this.selectionX = 0;
    this.selectionY = 0;

    this.resetField();
};