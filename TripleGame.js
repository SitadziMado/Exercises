function TripleGame(config) {
    config.selectionWidth = config.selectionWidth || 1;
    config.selectionHeight = config.selectionHeight || 1;
    config.goalCount = 3;

    BaseSymbolGame.apply(this, arguments);

    var SKIP = 0;
    var FST = 1;
    var SND = 2;
    var TRD = 3;

    var self = this;

    // Where group = 0, 1, 2, 3
    function match(group) {
        var selected;

        self.selection(function () {
            // This should be the only one
            selected = this.text;
        });

        if ((self.goals.indexOf(selected) + 1) === group) {
            if (group !== 0) {
                self.updateStatistics(true);
            }
        } else {
            if (group !== 0) {
                self.updateStatistics(false);
            } else {
                self.updateStatistics('miss');
            }
        }

        self.advance(self.selectionWidth, false);
    }

    this.addControl('1'.charCodeAt(0), function () {
        match.apply(this, [FST]);
    });

    this.addControl('2'.charCodeAt(0), function () {
        match.apply(this, [SND]);
    });

    this.addControl('3'.charCodeAt(0), function () {
        match.apply(this, [TRD]);
    });

    this.addControl(' '.charCodeAt(0), function () {
        match.apply(this, [SKIP]);
    });
}

inherit(TripleGame, BaseSymbolGame);

TripleGame.prototype.generate = function (width, height) {
    BaseSymbolGame.prototype.generate.apply(this, arguments);

    var rnd = new Random();

    // Заполним поле
    this.grid.rectangleSelection(
        0,
        0,
        this.width,
        this.height,
        function () {
            this.text = rnd.latin();
        }
    );
    this.description =
        'Нажмите клавишу ' +
        '&lt;1&gt; для буквы "' + this.goals[0] + '", ' +
        '&lt;2&gt; для буквы "' + this.goals[1] + '", ' +
        '&lt;3&gt; для буквы "' + this.goals[2] + '", ' +
        '&lt;Пробел&gt; иначе.';
};