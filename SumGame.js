function SumGame(config) {
    config.selectionWidth = config.selectionWidth || 2;
    config.selectionHeight = config.selectionHeight || 1;
    config.description = 'Нажмите клавишу &lt;1&gt;, если сумма равна 10, &lt;2&gt; иначе.';
    config.goalCount = 1;
    config.chances = 55;

    var self = this;
    var goal = config.goal;

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

    function check(eq) {
        var sum = 0;
        self.selection(function () {
            sum += +this.text;
        });

        eq = eq || false;

        return eq === (sum === goal);
    }

    this.addControl('1'.charCodeAt(0), function () {
        var result = check.apply(this, [true]);

        if (result) {
            self.updateStatistics(true);
            self.advance();
        } else {
            self.updateStatistics(false);
        }

        self.advance();
    });

    this.addControl('2'.charCodeAt(0), function () {
        var result = check.apply(this);

        if (!result) {
            self.updateStatistics('miss');
        }

        self.advance();
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
            self.generate();
        }
    )
};