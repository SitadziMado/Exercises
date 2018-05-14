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

    function check(eq) {
        var isFound = false;
        self.selection(function () {
            if (~self.goals.indexOf(self.text)) {
                isFound = true;
            }
        });

        eq = eq || false;

        return eq === isFound;
    }

    // ToDo: обобщить с "Суммой"
    this.addControl(13, function () {
        var result = check.apply(self, [true]);

        if (result) {
            self.updateStatistics(true);
        } else {
            self.updateStatistics(false);
        }

        self.advance(self.selectionHeight, true);
    });

    this.addControl(' '.charCodeAt(0), function () {
        var result = check.apply(self);

        if (!result) {
            self.updateStatistics('miss');
        }

        self.advance(self.selectionHeight, true);
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
            self.generate();
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

        for (var j = 0; j < this.selectionWidth * this.selectionHeight; ++j) {
            if (density) {
                fillers.push(this.generator());
                --density;
            } else {
                fillers.push('');
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

    this.description = 'Задача - нажимать клавишу &lt;Enter&gt;, если в выделении есть символ "' +
        this.goals[0] + '" или "' + this.goals[1] + '", нажимать &lt;Пробел&gt; иначе.';

    this.selectionX = 0;
    this.selectionY = 0;
};