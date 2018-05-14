function SumGame(config) {
    config.selectionWidth = config.selectionWidth || 2;
    config.selectionHeight = config.selectionHeight || 1;
    config.description = 'Нажмите клавишу &lt;Enter&gt;, если сумма равна 10, &lt;Пробел&gt; иначе.';
    config.goalCount = 1;

    Game.apply(this, arguments);

    var self = this;
    var goal = config.goal;

    function check(eq) {
        var sum = 0;
        self.selection(function () {
            sum += +this.text;
        });

        eq = eq || false;

        return eq === (sum === goal);
    }

    this.addControl(13, function () {
        var result = check.apply(this, [true]);

        if (result) {
            self.updateStatistics(true);
        } else {
            self.updateStatistics(false);
        }

        self.advance();
    });

    this.addControl(' '.charCodeAt(0), function () {
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

    // Заполним поле
    this.grid.rectangleSelection(
        0,
        0,
        this.width,
        this.height,
        function () {
            this.text = rnd.digit();
        }
    );
};