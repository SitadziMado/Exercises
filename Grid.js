function Cell(td, x, y) {
    x = x || -1;
    y = y || -1;

    var isHighlighted = false;

    this.td = td;
    this.x = x;
    this.y = y;

    Object.defineProperties(
        this, {
            text: {
                get: function () {
                    return td.html();
                },
                set: function (value) {
                    td.html(value);
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
        } else {
            td.removeClass('highlighted');
        }
    };
}

function Grid(parentId) {
    if (typeof parentId !== 'string') {
        throw new Error('ИД родителя должен быть строкой');
    }

    var parent = $(parentId);
    var grid = [];
    var width, height;

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
                    td.html('a');
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
                f.apply(grid[i][j]);
            }
        }
    };
}