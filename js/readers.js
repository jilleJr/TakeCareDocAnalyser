
/*

cell = {
    text: "" string,
    html: "" string,
    isItalic: bool,
    isBold: bool
}

doc: {
    head: {
        id: "" string',
        category: "" string,
        data1: "" string,
        data2: "" string,
        datestring: "" string,
        datetime: Date,
    },

    body[0..n]:
        [1..n]: cell

    tables[0..n]: {
        head[1..n]: cell,

        rows[1..n]: {
            columns[1..n]: cell,
            _th_cell_text: cell,
        },

        columns: {
            _th_cell_text[0..n]: cell
        }
    }
}

*/

var read = {
    Vårdtillfällen: [],
    ÖppnaVårdkontakter: []
};

// parser.addReader = function(category, func(parsed))

parser.addReader("Vårdtillfälle", function(doc) {
    // Vårdenhet tabellen innehåller in/ut datum
    var tab = findTableFirstRow(doc.tables, "Vårdenhet");
    if (!tab) return; // next doc plz

    // Spara grejer
    read.Vårdtillfällen.push({
        Rubrik: doc.head.data2,
        Inskrivningsdatum: parseDate(tab.Inskrivningsdatum.text),
        Utskrivningsdatum: parseDate(tab.Utskrivningsdatum.text),
        Diagnoser: findTableFirstColumn(doc.tables, "Diagnoser", true) || [],
        Åtgärder: findTableFirstColumn(doc.tables, "Åtgärder", true) || []
    });
});

parser.addReader("Öppen vårdkontakt", function(doc) {
    // Spara grejer
    read.ÖppnaVårdkontakter.push({
        Rubrik: doc.head.data2,
        Datum: doc.head.datetime,
        Diagnoser: findTableFirstColumn(doc.tables, "Diagnoser", true) || [],
        Åtgärder: findTableFirstColumn(doc.tables, "Åtgärder", true) || []
    });
});

/* HELPER FUNCTIONS */

// callback(cell, row, doc)
function forEachCell(parsed, callback) {
    forEachRow(parsed, function(row, doc) {
        // foreach cell
        for (var i = 0; i < row.length; i++) {
            var cell = row[i];
            var ret = callback(cell, row, doc);
            if (ret) return ret;
        }
    });
}

// callback(row, doc)
function forEachRow(parsed, callback) {
    forEachDocument(parsed, function(doc) {
        // foreach row
        for (var i = 0; i < doc.body.length; i++) {
            var row = doc.body[i];
            var ret = callback(row, doc);
            if (ret) return ret;
        }
    });
}

// callback(doc)
function forEachDocument(parsed, callback) {
    // foreach document
    for (var i = 0; i < parsed.length; i++) {
        var doc = parsed[i];
        var ret = callback(doc);
        if (ret) return ret;
    }
}

// returns cell[] || null
function findTableFirstRow(tables, firstColumnName, textOnly) {
    var tab = tables.find(function(tbl) {
        return tbl.head[0].text === firstColumnName;
    });

    if (!tab) return null;
    if (textOnly) return tab.rows[firstColumnName].map(function(x) {
        return x.text;
    });

    return tab.rows[0];
}

// return cell[] || null
function findTableFirstColumn(tables, firstColumnName, textOnly) {
    var tab = tables.find(function(tbl) {
        return tbl.head[0].text === firstColumnName;
    });

    if (!tab) return null;
    if (textOnly) return tab.columns[firstColumnName].map(function(x) {
        return x.text;
    });

    return tab.columns[firstColumnName];
}