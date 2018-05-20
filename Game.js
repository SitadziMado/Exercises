function Game(config) {
    var grid = new Grid(config.gameBlock);

    config.font = 'standard';
    config.fontSize = 20;
    config.color = 'standard';

    var w = config.width || 1;
    var h = config.height || 1;
    var selX = config.selectionX || 0;
    var selY = config.selectionX || 0;
    var selW = config.selectionWidth || 3;
    var selH = config.selectionHeight || 3;
    config.goalCount = config.goalCount || 1;

    // Время в мс
    config.time = config.time || 60;
    var time = config.time;

    // Ссылка на текущий элемент
    var self = this;

    // Список контролов
    var controls = {};

    // Запущена ли игра?
    var isStarted = false;
    var timer;

    // Статистика для игры
    var statistics = {};

    // <div>, где хранится информация об игре
    var divInfo = $(config.infoBlock);

    var settings = new Settings({ parent: divInfo });
    var goals = config.goals || [];
    // var statisticsLabel = $('#statistics-label');

    var rnd = new Random();

    function inBounds(value, lower, upper) {
        if (value < lower) {
            value = lower;
        }

        if (value >= upper) {
            value = upper - 1;
        }

        return value;
    }

    function deselect() {
        grid.rectangleSelection(
            selX,
            selY,
            selW,
            selH,
            function () {
                this.highlight(false);
            }
        );
    }

    function reselect() {
        grid.rectangleSelection(
            selX,
            selY,
            selW,
            selH,
            function () {
                this.highlight();
            }
        );
    }

    function checkControlKey(key) {
        if (typeof key !== 'number') {
            throw new Error('Ключ должен быть клавишей');
        }
    }

    function nextFont(n) {
        if (n === undefined) {
            n = rnd.int(0, 4);
        }

        return 'font-' + n.toString();
    }

    function nextColor() {
        return rnd.choice([
            '#f44336',
            '#E91E63',
            '#9C27B0',
            '#673AB7',
            '#3F51B5',
            '#2196F3',
            '#03A9F4',
            '#00BCD4',
            '#009688',
            '#4CAF50',
            '#8BC34A',
            '#CDDC39',
            '#FFEB3B',
            '#FFC107',
            '#FF9800',
            '#FF5722',
            '#795548',
            '#9E9E9E',
            '#607D8B'
        ]);
    }

    Object.defineProperties(
        this, {
            selectionX: {
                get: function () {
                    return selX;
                },
                set: function (value) {
                    deselect();
                    selX = inBounds(value, 0, w - selW + 1);
                    reselect();
                }
            },
            selectionY: {
                get: function () {
                    return selY;
                },
                set: function (value) {
                    deselect();
                    selY = inBounds(value, 0, h - selH + 1);
                    reselect();
                }
            },
            selectionWidth: {
                get: function () {
                    return selW;
                },
                set: function (value) {
                    deselect();
                    selW = inBounds(value, 1, w);
                    reselect();
                }
            },
            selectionHeight: {
                get: function () {
                    return selH;
                },
                set: function (value) {
                    deselect();
                    selH = inBounds(value, 1, w);
                    reselect();
                }
            },
            width: {
                get: function () {
                    return w;
                },
                set: function (value) {
                    if (value >= 1) {
                        w = value;
                    } else {
                        w = 1;
                    }
                }
            },
            height: {
                get: function () {
                    return h;
                },
                set: function (value) {
                    if (value >= 1) {
                        h = value;
                    } else {
                        h = 1;
                    }
                }
            },
            settings: {
                get: function () {
                    return settings;
                }
            },
            description: {
                get: function () {
                    return config.description;
                },
                set: function (value) {
                    config.description = value;
                    self.settings.controls.caption.text = value;
                }
            },
            time: {
                get: function () {
                    return time;
                },
                set: function (value) {
                    time = value;
                }
            },
            grid: {
                get: function () {
                    return grid;
                }
            },
            goals: {
                get: function () {
                    return goals;
                },
                set: function (value) {
                    goals = value;
                }
            },
            goalCount: {
                get: function () {
                    return config.goalCount;
                },
                set: function (value) {
                    config.goalCount = value;
                }
            },
            font: {
                get: function () {
                    return config.font;
                },
                set: function (value) {
                    function clearFonts() {
                        for (var i = 0; i < 5; ++i) {
                            this.span.removeClass(nextFont(i));
                        }
                    }
                    var singleFont = nextFont();
                    var fontFuncs = {
                        standard: function () {
                            // this.span.css('font-family', '');
                            clearFonts.apply(this, []);
                        },
                        single: function () {
                            // this.span.css('font-family', singleFont);
                            clearFonts.apply(this, []);
                            this.span.addClass(singleFont);
                        },
                        random: function () {
                            clearFonts.apply(this, []);
                            this.span.addClass(nextFont());
                        }
                    };

                    var f = fontFuncs[value];

                    if (!f) {
                        throw new Error('Неверный идентификатор шрифта.');
                    }

                    self.grid.each(f);

                    config.font = value;
                }
            },
            fontSize: {
                get: function () {
                    return config.fontSize;
                },
                set: function (value) {
                    self.grid.each(function () {
                        this.span.css('font-size', value);
                        this.td.css({
                            width: value,
                            height: value
                        });
                    });
                    config.fontSize = value;
                }
            },
            color: {
                get: function () {
                    return config.color;
                },
                set: function (value) {
                    var used = {};
                    var colorFuncs = {
                        standard: function () {
                            this.span.css('color', '');
                        },
                        symbolBased: function () {
                            if (!used[this.text]) {
                                used[this.text] = nextColor();
                            }

                            this.span.css('color', used[this.text]);
                        },
                        random: function () {
                            this.span.css('color', nextColor());
                        }
                    };

                    var f = colorFuncs[value];

                    if (!f) {
                        throw new Error('Неверный идентификатор цвета поля.');
                    }

                    self.grid.each(f);

                    config.color = value;
                }
            }
        }
    );

    var gameButtons = new Settings({ parent: '#div-controls', removeBr: true });

    this.clear = function () {
        self.cancel();
        grid.clear();
        divInfo.empty();
        settings.clear();
        gameButtons.clear();
    };

    this.addControl = function (key, f) {
        checkControlKey(key);

        if (typeof f === 'function') {
            controls[key] = f;

            var chr = String.fromCharCode(key);
            var name = 'ctl-' + chr;

            gameButtons.addButton(
                name,
                chr,
                function () {
                    self.dispatchControl(key);
                }
            );

            gameButtons.controls[name].control.addClass('control');
        } else {
            throw new Error('Некорретная callback-функция');
        }
    };

    this.removeControl = function (key) {
        checkControlKey(key);

        if (controls[key]) {
            delete controls[key];
            gameButtons.removeControl(
                'ctl-' + String.fromCharCode(key)
            );
        }
    };

    this.changeControl = function (oldKey, key) {
        checkControlKey(oldKey);

        if (controls[oldKey]) {
            var oldF = controls[oldKey];
            delete controls[oldKey];
            controls[key] = oldF;
        }
    };

    this.aliasControl = function (key, alias) {
        checkControlKey(key);

        if (controls[key] && !controls[alias]) {
            controls[alias] = controls[key];
        }
    };

    this.dispatchControl = function (key) {
        if (isStarted) {
            checkControlKey(key);

            var result = undefined;
            var ctrl = controls[key];

            if (ctrl) {
                ctrl.apply(self)
            }

            return result;
        }
    };

    this.start = function (finished) {
        if (!isStarted) {
            isStarted = true;

            statistics = {};

            var args = [];
            for (var i = 1; i < arguments.length; ++i) {
                args.push(arguments[i]);
            }

            var timeLeft = self.time;

            timer = setInterval(
                function () {
                    if (timeLeft <= 0) {
                        self.cancel();
                        finished.apply(self, args);
                    } else {
                        --timeLeft;
                        self.settings.controls.timeLeft.value =
                            formatSeconds(timeLeft);
                    }
                }, 1000 // секунда
            );
        }
    };

    this.cancel = function () {
        if (isStarted) {
            clearInterval(timer);
            isStarted = false;
        }
    };

    this.updateStatistics = function (oneMore) {
        if (statistics[oneMore]) {
            ++statistics[oneMore];
        } else {
            statistics[oneMore] = 1;
        }

        this.settings.controls.statistics.value =
            'Правильные: ' + (statistics[true] || '0') + '<br>' +
            'Неправильные: ' + (statistics[false] || '0') + '<br>' +
            'Пропущено: ' + (statistics['miss'] || '0');
    };

    this._grid = grid;

    this.fillInfo();
    this.generate(config.width, config.height);
}

Game.prototype.constructor = Game;

Game.prototype.advance = function (amount, vertical) {
    var result = true;
    amount = amount || 1;
    vertical = vertical || false;

    if (vertical) {
        if (this.selectionY + amount > this.height - this.selectionHeight) {
            this.selectionY = 0;

            if (this.selectionX + this.selectionWidth >= this.width) {
                this.selectionX = 0;
                result = false;
            } else {
                this.selectionX += this.selectionWidth;
            }
        } else {
            this.selectionY += amount;
        }
    } else {
        if (this.selectionX + amount > this.width - this.selectionWidth) {
            this.selectionX = 0;

            if (this.selectionY + this.selectionHeight >= this.height) {
                this.selectionY = 0;
                result = false;
            } else {
                this.selectionY += this.selectionHeight;
            }
        } else {
            this.selectionX += amount;
        }
    }

    return result;
};

Game.prototype.selection = function (f) {
    this._grid.rectangleSelection(
        this.selectionX,
        this.selectionY,
        this.selectionWidth,
        this.selectionHeight,
        f
    );
};

Game.prototype.fillInfo = function () {
    var self = this;

    this.settings.addLabel('caption', this.description);
    this.settings.addLabel('statistics', 'Статистика: ', 'задание не начато');
    this.settings.addLabel('timeLeft', 'Осталось времени: ', formatSeconds(this.time));

    this.settings.addComboBox(
        'size',
        'Размер поля: ',
        [ 'Маленький', 'Средний', 'Большой' ],
        function () {
            var width = 18 + this.value * 12;
            var height = 12 + this.value * 6;
            self.restart(width, height);
        }
    );

    this.settings.addComboBox(
        'time',
        'Время: ',
        { 60: 'Минута', 120: '2 минуты', 180: '3 минуты', 300: '5 минут' },
        function () {
            self.time = +this.value;
            self.restart();
        }
    );

    this.settings.addComboBox(
        'fonts',
        'Шрифты: ', {
            standard: 'Стандарт',
            single: 'Один',
            random: 'Случайный'
        }, function () {
            self.font = this.value;
            // self.restart();
        }
    );

    this.settings.addComboBox(
        'fontSize',
        'Размер шрифта: ',
        { 20: 'Малый', 24: 'Средний', 28: 'Большой' },
        function () {
            self.fontSize = +this.value;
            // self.restart();
        }
    );

    this.settings.addComboBox(
        'colors',
        'Цвет символов: ', {
            standard: 'Автоматически',
            symbolBased: 'В зависимости от символа',
            random: 'Случайный'
        }, function () {
            self.color = this.value;
            // self.restart();
        }
    );

    this.settings.addButton(
        'start',
        'Начать игру',
        function () {
            self.settings.controls.start.disable();
            self.start(function () {
                swal(self.settings.controls.statistics.value);
                self.restart();
            });
        }
    );

    this.settings.addButton(
        'update',
        'Обновить',
        function () {
            self.restart();
        }
    );
};

Game.prototype.generate = function (width, height) {
    width = width || this.width;
    height = height || this.height;

    this.grid.clear();
    this.width = width || 1;
    this.height = height || 1;
    this.grid.generate(this.width, this.height);
    this.settings.controls.start.disable(true);
    this.settings.controls.timeLeft.value = formatSeconds(this.time);

    this.selectionX = 0;
    this.selectionY = 0;
};

Game.prototype.resetField = function () {
    this.color = this.color;
    this.font = this.font;
    this.fontSize = this.fontSize;
};

Game.prototype.restart = function (width, height) {
    this.cancel();
    this.generate.apply(this, arguments);
};