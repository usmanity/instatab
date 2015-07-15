var util = {};

util.timer = {
    start: function () {
        console.time('tabbyTimer');
    },
    end: function () {
        console.timeEnd('tabbyTimer');
    }
};

module.exports = util;