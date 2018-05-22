function Cell(td, x, y) {
    x = x || -1;
    y = y || -1;

    var isHighlighted = false;

    td.append('<span>');
    var span = td.children();

    Object.defineProperties(
        this, {
            text: {
                get: function () {
                    return span.html(); // td.html();
                },
                set: function (value) {
                    span.html(value.toString());
                    // td.html(value);
                }
            },
            td: {
                get: function () {
                    return td;
                }
            },
            span: {
                get: function () {
                    return span;
                }
            },
            x: {
                get: function () {
                    return x;
                }
            },
            y: {
                get: function () {
                    return y;
                }
            }
        }
    );

    this.highlight = function (value) {

        if (value === undefined) {
            value = true;
        }

        if (value) {
            td.addClass('highlighted');
            //span.addClass('highlighted');
        } else {
            td.removeClass('highlighted');
            //span.removeClass('highlighted');
        }
    };
}

Cell.constructor = Cell;

Cell.prototype.markMissed = function () {
    this.td.addClass('miss');
};

Cell.prototype.markWrong = function () {
    this.td.addClass('wrong');
};

Cell.prototype.markRight = function () {
    this.td.addClass('right');
};

function Grid(parentId) {
    if (typeof parentId !== 'string') {
        throw new Error('ИД родителя должен быть строкой');
    }

    var self = this;
    var parent = $(parentId);
    var grid = [];
    var width, height;

    Object.defineProperties(
        this, {
            width: {
                get: function () {
                    return width;
                }
            },
            height: {
                get: function () {
                    return height;
                }
            }
        }
    );

    var isCreated = false;

    this.generate = function (w, h) {
        if (!isCreated) {
            var table = parent.append('<table>').children();
            var tbody = table.append('<tbody>').children();
            var i;

            width = w;
            height = h;

            for (i = 0; i < h; ++i) {
                tbody.append('<tr>');
            }

            var trs = tbody.children();

            for (i = 0; i < w; ++i) {
                trs.append('<td>');
            }

            var y = 0;

            trs.each(function () {
                var tr = $(this);
                grid.push([]);

                var x = 0;

                tr.children().each(function () {
                    var td = $(this);
                    grid[y].push(new Cell(td, x, y));
                    // td.html('a');
                    ++x;
                });

                ++y;
            });

            isCreated = true;
        }
    };

    this.clear = function () {
        if (isCreated) {
            isCreated = false;
            parent.empty();
            grid = [];
        }
    };

    this.rectangleSelection = function (x, y, w, h, f) {
        var i, j, yh = y + h, xw = x + w;

        for (i = y; i < yh; ++i) {
            for (j = x; j < xw; ++j) {
                f.apply(grid[i][j], []);
            }
        }
    };

    this.each = function (f) {
        self.rectangleSelection(
            0, 0, self.width, self.height, f
        );
    };

    this.each(function () {
        this.highlight();
    });

    this.each(function () {
        this.highlight(false);
    });
}

Grid.constructor = Grid;