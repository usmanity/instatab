var util = {};

util.timer = {
    start: function () {
        console.time('tabbyTimer');
    },
    end: function () {
        console.timeEnd('tabbyTimer');
    }
};

util.numberWithCommas = function (x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

module.exports = util;