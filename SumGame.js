function SumGame(config) {
    config.selectionWidth = config.selectionWidth || 2;
    config.selectionHeight = config.selectionHeight || 1;
    config.description = 'Нажмите клавишу &lt;1&gt;, если сумма равна 10, &lt;2&gt; иначе.';
    config.goalCount = 1;
    config.chances = 55;

    var self = this;

    Object.defineProperties(
        this, {
            chances: {
                get: function () {
                    return config.chances;
                },
                set: function (value) {
                    config.chances = value;
                }
            }
        }
    );

    Game.apply(this, arguments);

    function match(eq) {
        var selected = [];
        var sum = 0;

        eq = eq || false;

        self.selection(function () {
            sum += +this.text;
            selected.push(this);
        });

        var match = sum === this.goals[0];
        var markFunc = function () {};
        var amount = 1;

        if (eq) {
            if (match) {
                self.updateStatistics(true);
                markFunc = Cell.prototype.markRight;
                amount = 2;
            } else {
                self.updateStatistics(false);
                markFunc = Cell.prototype.markWrong;
            }
        } else {
            if (match) {
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

        if (!self.advance(amount)) {
            self.generate();
        }
    }

    this.addControl('1'.charCodeAt(0), function () {
        var result = match.apply(this, [true]);
    });

    this.addControl('2'.charCodeAt(0), function () {
        var result = match.apply(this);
    });
}

SumGame.prototype = Object.create(Game.prototype);
SumGame.prototype.constructor = SumGame;

SumGame.prototype.generate = function (width, height) {
    Game.prototype.generate.apply(this, arguments);

    var self = this;
    var rnd = new Random();

    this.goals = [10];

    var fillers = [];

    for (var i = 0; i < this.height; ++i) {
        for (var j = 0; j < this.width; j += 2) {
            var fst = rnd.digit();
            var snd;

            if (fst > (this.goals[0] - 10) && rnd.yesNo(this.chances)) {
                snd = this.goals[0] - fst;
            } else {
                snd = rnd.digit();
            }

            fillers.push(fst.toString(), snd.toString());
        }

        if (odd(this.width)) {
            fillers.push(rnd.digit());
        }
    }

    var idx = 0;

    // Заполним поле
    this.grid.rectangleSelection(
        0,
        0,
        this.width,
        this.height,
        function () {
            this.text = fillers[idx++];
        }
    );
};

SumGame.prototype.fillInfo = function () {
    Game.prototype.fillInfo.apply(this, arguments);

    var self = this;

    this.settings.addComboBox(
        'chances',
        'Вероятность нужной суммы: ', {
            55: 'Низкая',
            65: 'Средняя',
            75: 'Высокая'
        }, function () {
            self.chances = +this.value;
            self.restart();
        }
    );
};