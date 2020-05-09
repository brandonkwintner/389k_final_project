var fs = require('fs');

function loadData() {
    return JSON.parse(fs.readFileSync('data.json'));
}

function saveData(data) {
    var obj = {
        powerlifters: data
    };

    fs.writeFileSync('data.json', JSON.stringify(obj));
}

module.exports = {
    loadData: loadData,
    saveData: saveData,
}
