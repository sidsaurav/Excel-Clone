let defaultProperties = {
    "text": "",
    "font-weight": "",
    "font-style": "",
    "text-decoration": "",
    "text-align": "left",
    "background-color": "#ffffff",
    "color": "#000000",
    "font-family": "arial",
    "font-size": "14px"
}

let cellData = {
    "Sheet1": {}
}

let selectedSheet = "Sheet1";
let totalSheets = 1;



for (let i = 1; i <= 100; i++) {
    let n = i;
    let name = "";
    while (n) {
        let rem = n % 26;
        if (rem == 0) {
            name = "Z" + name;
            n = Math.floor(n / 26) - 1;
        }
        else {
            name = String.fromCharCode(65 + rem - 1) + name;
            n = Math.floor(n / 26);
        }
    }
    let column = $(".column-name-container");
    let toAppend = '<div class ="column-name colCode-' + name + ' colId-' + i + '">' + name + '</div>';
    column.append(toAppend);
}


for (let i = 1; i <= 100; i++) {
    let row = $(".row-name-container");
    let toAppend = '<div class="row-name rowId-' + i + '">' + i + '</div>'
    row.append(toAppend);
}


for (let i = 1; i <= 100; i++) {
    let toAppendRow = '<div class="cell-row rowId-' + i + '"></div>';
    let onAppend = $(".input-cell-container");
    onAppend.append(toAppendRow);
    for (let j = 1; j <= 100; j++) {
        let toAppend = '<div class="input-cell" id="row-' + i + '-col-' + j + '"></div>'
        let onAppend = $(".cell-row.rowId-" + i); //not ".cell-row .rowId-"+i ->space will not be there.
        onAppend.append(toAppend);
    }
}


//selecting a align icon
$(".align-icon").click(function () { //yaha arrow function kaam ni kr rha...
    $(".align-icon.selected").removeClass("selected"); //agr already selected h koi align icon to use hta do...
    $(this).addClass("selected");
})

$(".style-icon").click(function () { //yaha arrow function kaam ni kr rha...
    $(this).toggleClass("selected");
})

$(".input-cell").click(function (e) { //yaha arrow function kaam ni kr rha...
    if (e.ctrlKey) {
        let x = getRowCol(this);
        $(this).addClass("selected");
        if (x[0] > 1) {
            let topCellSelected = $('#row-' + (parseInt(x[0]) - 1) + '-col-' + parseInt(x[1])).hasClass("selected");
            if (topCellSelected) {
                // console.log("top");
                $(this).addClass("top-cell-selected");
                $('#row-' + (parseInt(x[0]) - 1) + '-col-' + parseInt(x[1])).addClass("bottom-cell-selected");
            }
        }
        if (x[1] > 1) {
            let leftCellSelected = $('#row-' + parseInt(x[0]) + '-col-' + (parseInt(x[1]) - 1)).hasClass("selected");
            if (leftCellSelected) {
                // console.log("left");
                $(this).addClass("left-cell-selected");
                $('#row-' + parseInt(x[0]) + '-col-' + (parseInt(x[1]) - 1)).addClass("right-cell-selected");
            }
        }

        if (x[1] < 100) {
            let rightCellSelected = $('#row-' + parseInt(x[0]) + '-col-' + (parseInt(x[1]) + 1)).hasClass("selected");
            if (rightCellSelected) {
                // console.log("right");
                $(this).addClass("right-cell-selected");
                $('#row-' + parseInt(x[0]) + '-col-' + (parseInt(x[1]) + 1)).addClass("left-cell-selected");
            }
        }

        if (x[0] < 100) {
            let bottomCellSelected = $('#row-' + (parseInt(x[0]) + 1) + '-col-' + parseInt(x[1])).hasClass("selected");
            if (bottomCellSelected) {
                // console.log("bottom");
                $(this).addClass("bottom-cell-selected");
                $('#row-' + (parseInt(x[0]) + 1) + '-col-' + parseInt(x[1])).addClass("top-cell-selected");
            }
        }
    }
    else {
        // console.log("hi");
        $(".input-cell.selected").removeClass("selected");
        $(this).addClass("selected");
    }
    changeHeader(this);
})


function changeHeader(ele) {
    console.log("Hello");
    let [rowId, colId] = getRowCol(ele);
    let cellInfo = defaultProperties;
    if (cellData[selectedSheet][rowId] && cellData[selectedSheet][rowId][colId]) {
        cellInfo = cellData[selectedSheet][rowId][colId];
    }

    cellInfo["font-weight"] ? $(".icon-bold").addClass("selected") : $(".icon-bold").removeClass("selected")
    cellInfo["font-style"] ? $(".icon-italic").addClass("selected") : $(".icon-italic").removeClass("selected")
    cellInfo["text-decoration"] ? $(".icon-underline").addClass("selected") : $(".icon-underline").removeClass("selected")
    let alignment = cellInfo["text-align"];
    $(".align-icon.selected").removeClass("selected");
    $(".icon-align-" + alignment).addClass("selected");
    $(".background-color-picker").val(cellInfo["background-color"]);
    $(".text-color-picker").val(cellInfo["color"]);
    $(".font-family-selector").val(cellInfo["font-family"]);
    $(".font-family-selector").css("font-family", cellInfo["font-family"]);
    $(".font-size-selector").val(cellInfo["font-size"]);

}

$(".input-cell").dblclick(function () {
    $(".input-cell.selected").removeClass("selected");
    $(this).addClass("selected");
    $(this).attr("contenteditable", "true");
    $(this).focus();
})

$(".input-cell").blur(function () {
    $(".input-cell.selected").attr("contenteditable", "false"); //focus hatne p contenteditable false ho jae...
    updateCell("text", $(this).text())
})

$(".input-cell-container").scroll(function () {
    $(".column-name-container").scrollLeft(this.scrollLeft) // jitna input cell scroll hua utna column name container bhi scroll kr do.
    $(".row-name-container").scrollTop(this.scrollTop)
})


function getRowCol(ele) {
    let idArray = $(ele).attr("id").split("-");
    let rowId = idArray[1];
    let colId = idArray[3];
    return [rowId, colId];
}

//style-icons--------------------------------------------------------------------

function updateCell(property, value, defaultPossible) { //to make cell bold italic underline...
    $(".input-cell.selected").each(function () {
        $(this).css(property, value);
        let [rowId, colId] = getRowCol(this);
        if (cellData[selectedSheet][rowId]) {
            if (cellData[selectedSheet][rowId][colId]) {
                cellData[selectedSheet][rowId][colId][property] = value; //if both row as well as col exists
            }
            else {
                cellData[selectedSheet][rowId][colId] = { ...defaultProperties }; //if only row exists
                cellData[selectedSheet][rowId][colId][property] = value;
            }
        } else { //if none of them exists
            cellData[selectedSheet][rowId] = {};
            cellData[selectedSheet][rowId][colId] = { ...defaultProperties };
            cellData[selectedSheet][rowId][colId][property] = value;
        }
        if (defaultPossible && JSON.stringify(cellData[selectedSheet][rowId][colId]) === JSON.stringify(defaultProperties)) {
            delete cellData[selectedSheet][rowId][colId];
            if (Object.keys(cellData[selectedSheet][rowId]).length === 0) {
                delete cellData[selectedSheet][rowId];
            }
        }
    })
    console.log(cellData);
}

$(".icon-bold").click(function () {
    if ($(this).hasClass("selected")) {
        updateCell("font-weight", "bold", false);
    } else {
        updateCell("font-weight", "", true); // to remove bold ----> empty string
    }
})

$(".icon-italic").click(function () {
    if ($(this).hasClass("selected")) {
        updateCell("font-style", "italic", false);
    } else {
        updateCell("font-style", "", true);
    }
})

$(".icon-underline").click(function () {
    if ($(this).hasClass("selected")) {
        updateCell("text-decoration", "underline", false);
    } else {
        updateCell("text-decoration", "", true);
    }
})


$(".icon-align-left").click(function () {
    if ($(this).hasClass("selected")) {
        updateCell("text-align", "left", true);
    }
});
$(".icon-align-center").click(function () {
    if ($(this).hasClass("selected")) {
        updateCell("text-align", "center", true);
    }
});
$(".icon-align-right").click(function () {
    if ($(this).hasClass("selected")) {
        updateCell("text-align", "right", true);
    }
});


//----------------------------------------------------------------------------


$(".color-fill-icon").click(function () {
    $(".background-color-picker").click();
})

$(".color-fill-text").click(function () {
    $(".text-color-picker").click();
})

$(".background-color-picker").change(function () {
    updateCell("background-color", $(this).val())
})

$(".text-color-picker").change(function () {
    updateCell("color", $(this).val())
})

$(".font-family-selector").change(function () {
    updateCell("font-family", $(this).val())
    $(".font-family-selector").css("font-family", $(this).val());
})

$(".font-size-selector").change(function () {
    updateCell("font-size", $(this).val())
})

