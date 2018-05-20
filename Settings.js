'use strict';

function Settings(config) {
    config.removeBr = config.removeBr || false;

    var parent = $(config.parent);

    if (!parent) {
        throw new Error('Неверный селектор элемента родителя');
    }

    var controls = {};

    Object.defineProperties(
        this, {
            parent: {
                get: function () {
                    return parent;
                }
            },
            controls: {
                get: function () {
                    return controls;
                }
            },
            removeBr: {
                get: function () {
                    return config.removeBr;
                }
            }
        }
    );

    this.clear = function () {
        for (var a in controls) {
            if (controls.hasOwnProperty(a)) {
                controls[a].clear();
            }
        }

        controls = {};
    };
}

Settings.constructor = Settings;

Settings.prototype._addCtl = function (name, control) {
    if (name && control) {
        this.controls[name] = control;

        if (!this.removeBr) {
            this.parent.append('<br>');
        }
    } else {
        throw new Error('Имя элемента и сам элемент не должны быть пустыми');
    }
};

Settings.prototype.removeControl = function (name) {
    if (name) {
        var ctl = this.controls[name];

        if (ctl) {
            ctl.control.remove();
        }
    }
};

Settings.prototype.addLabel = function (name, text, value) {
    var ctl = new Label({
        parent: this.parent,
        name: name,
        text: text,
        value: value
    });

    this._addCtl(name, ctl);
};

Settings.prototype.addComboBox = function (name, text, options, onchange) {
    var ctl = new ComboBox({
        parent: this.parent,
        name: name,
        text: text,
        options: options,
        onchange: onchange
    });

    this._addCtl(name, ctl);
};

Settings.prototype.addCheckBox = function (name, text, isChecked, onchange) {
    var ctl = new CheckBox({
        parent: this.parent,
        name: name,
        text: text,
        value: isChecked,
        onchange: onchange
    });

    this._addCtl(name, ctl);
};

Settings.prototype.addButton = function (name, text, onclick) {
    var ctl = new Button({
        parent: this.parent,
        name: name,
        value: text,
        onclick: onclick
    });

    this._addCtl(name, ctl);
};

Settings.prototype.addStateButton = function (name, text, states, onclick) {
    var ctl = new StateButton({
        parent: this.parent,
        name: name,
        value: text,
        onclick: onclick
    });

    this._addCtl(name, ctl);
};

function Control(config) {
    if (config.name === '') {
        throw new Error('Элементу управления требуется имя');
    }

    var self = this;
    var text = config.text || ''; // (config.name + ' : ' + config.type);
    var val = config.value || '';
    var defaultOnchange = function () {};
    var onchange = config.onchange || defaultOnchange;
    config.html = config.html || '';

    var parent = config.parent; //$(config.parent);

    // parent.append('<span>');
    parent.append('<span>');
    var span = parent.children().last();

    parent.append('<' + config.type + '>');
    var control = parent.children().last();
    control.attr('id', config.name);

    var attrs = config.attributes;

    if (attrs) {
        for (var a in attrs) {
            if (attrs.hasOwnProperty(a)) {
                control.attr(a, attrs[a]);
            }
        }
    }

    control.on('change', function () {
        self.changed.apply(self, []);
    });

    if (config.onclick) {
        control.on('click', function () {
            config.onclick.apply(self, []);
        });
    }

    Object.defineProperties(
        this, {
            name: {
                get: function () {
                    return config.name;
                }
            },
            text: {
                get: function () {
                    return text;
                },
                set: function (value) {
                    text = value;
                    span.html(text);
                }
            },
            value: {
                get: function () {
                    return val;
                },
                set: function (value) {
                    val = value;
                    self._refresh();
                }
            },
            parent: {
                get: function () {
                    return parent;
                }
            },
            control: {
                get: function () {
                    return control;
                }
            },
            onchange: {
                get: function () {
                    return onchange;
                },
                set: function (value) {
                    onchange = value || defaultOnchange;
                }
            },
            html: {
                get: function () {
                    return config.html;
                },
                set: function (value) {
                    config.html = value;
                    control.html(value);
                }
            }
        }
    );

    this.text = text;
    this.value = val;

    if (config.html) {
        this.html = config.html;
    }

    this.clear = function () {
        span.remove();
        control.remove();
    }
}

Control.constructor = Control;

Control.prototype._refresh = function () {
    this.control.html(this.value);
};

Control.prototype.changed = function () {
    this.onchange.apply(this, []);
};

Control.prototype.disable = function (enable) {
    this.control.prop('disabled', !(enable || false));
};

Control.prototype.enable = function () {
    this.disable(true);
};

function Label(config) {
    config.type = 'span';
    Control.apply(this, arguments);
}

inherit(Label, Control);

function ComboBox(config) {
    config.type = 'select';
    Control.apply(this, arguments);

    for (var a in config.options) {
        if (config.options.hasOwnProperty(a)) {
            this.control.append('<option>');
            var option = this.control.children().last();

            option.attr('value', a);
            option.html(config.options[a] || '');
        }
    }
}

inherit(ComboBox, Control);

ComboBox.prototype.changed = function () {
    this.value = this.control.val();
    Control.prototype.changed.apply(this, arguments);
};

ComboBox.prototype._refresh = function () {
    // Control.prototype._refresh.apply(this, arguments);
};

function CheckBox(config) {
    config.type = 'input';
    config.attributes = { type: 'checkbox' };
    Control.apply(this, arguments);
}

inherit(CheckBox, Control);

CheckBox.prototype.changed = function () {
    this.value = this.control.prop('checked');
    Control.prototype.changed.apply(this, arguments);
};

function Button(config) {
    config.type = 'button';
    Control.apply(this, arguments);
}

inherit(Button, Control);

function StateButton(config) {
    config.type = 'button';
    Control.apply(this, arguments);
}

inherit(StateButton, Control);

/* var settings = new Settings({
    parent: '#div-controls'
});

settings.addLabel('bank', 'Тестовая надпись: ', 13);
settings.addCheckBox('kizaru', 'На моем аккаунте', false,
    function () {
        alert(this.value)
    }
);

settings.addComboBox(
    'options',
    'Konnichiwa.', {
        en: 'Thank you',
        fr: 'Merci',
        ja: 'ありがとう',
        ru: 'Спасибо',
        zh: '谢谢'
    },
    function () {
        alert(this.value);
    }
);

settings.controls.bank.value = '123';

function upd() {
    settings.controls.bank.value = this.value;
} */