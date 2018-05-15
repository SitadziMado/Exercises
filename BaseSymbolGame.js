'use strict';

function BaseSymbolGame(config) {
    config.symbols = config.symbols || 'cyrillic';

    var self = this;
    var rnd = new Random();
    var generator;

    Object.defineProperties(
        this, {
            generator: {
                get: function () {
                    return generator;
                },
                set: function (value) {
                    var f = rnd[value];

                    if (!f) {
                        throw new Error('Недопустимый тип символов');
                    }

                    generator = function () {
                        return f().toString();
                    };
                }
            },
            symbols: {
                get: function () {
                    return config.symbols;
                },
                set: function (value) {
                    config.symbols = value;
                }
            }
        }
    );

    Game.apply(this, arguments);
}

inherit(BaseSymbolGame, Game);

BaseSymbolGame.prototype.generate = function (width, height) {
    Game.prototype.generate.apply(this, arguments);

    this.generator = this.symbols;

    this.goals = [ this.generator() ];
    var cnt = this.goalCount - 1;

    while (cnt) {
        var next = this.generator();

        if (!~this.goals.indexOf(next)) {
            this.goals.push(next.toString());
            --cnt;
        }
    }
};

BaseSymbolGame.prototype.fillInfo = function () {
    Game.prototype.fillInfo.apply(this, arguments);

    var self = this;

    this.settings.addComboBox(
        'symbols',
        'Символы: ', {
            cyrillic: 'Кириллица',
            latin: 'Латиница',
            digit: 'Цифры'
        }, function () {
            self.symbols = this.value;
            self.generate();
        }
    );
};