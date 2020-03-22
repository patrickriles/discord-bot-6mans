module.exports = {
    remove: function(arr) {
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax= arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
},
    // This is Durstenfeld shuffle, an optimized version of Fisher-Yates shuffle algorithm
    randomize: function(arr) {
        let tempArr = arr;
        for (var i = tempArr.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = tempArr[i];
            tempArr[i] = tempArr[j];
            tempArr[j] = temp;
        }
        return tempArr;
    }
};