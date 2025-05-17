//#region Export
var expExcel_bgColor = "E4E4E4";
var expExcel_fontColor = "141B25";
async function exportToExcel(id, filename) {
    return new Promise(async (resolve) => {
        if (typeof toastExportExcel === 'object') toastExportExcel.begin();

        try {
            $("#tablePrintForAll").empty();

            let table = $("#" + id).clone();
            let newTableId = id + "Copy";
            table.attr('id', newTableId);
            $("#tablePrintForAll").html(table);

            let rows = document.getElementById(newTableId).rows;
            let rowsThead = table[0].querySelector("thead") ? table[0].querySelector("thead").rows.length : 1;
            let mergeCells = new Map(); // Track merged cells (using Map for better tracking)

            let workbook = new ExcelJS.Workbook();
            let worksheet = workbook.addWorksheet('Sheet1');

            let rowIndex = 1;

            // Process rows and cells together in one loop
            for (let i = 0; i < rows.length; i++) {
                let row = rows[i];
                let cellIndex = 1;

                let cellsToRemove = [];
                Array.from(row.cells).forEach((cell, j) => {
                    if (cell.style.display === "none" || cell.classList.contains('d-none') || $(cell).css('display') === "none") {
                        cellsToRemove.push(j);
                    }
                });

                cellsToRemove.reverse().forEach(j => row.deleteCell(j));

                if (row.id && getComputedStyle(row).display === "none") {
                    row.remove();
                    i--;
                    continue;
                }
                for (let j = 0; j < row.cells.length; j++) {
                    let cell = row.cells[j];
                    let cellKey = `${rowIndex}-${cellIndex}`;

                    let value = $(cell).find(".selection.dropdown .text").text().replace(/\s+/g, ' ') || cell.innerText.trim().replace(/\s+/g, ' ');

                    while (mergeCells.has(cellKey)) {
                        cellIndex++;
                        cellKey = `${rowIndex}-${cellIndex}`;
                    }

                    let excelCell = worksheet.getCell(rowIndex, cellIndex);
                    if ($(cell).hasClass("vt-number-order") && i >= rowsThead) {
                        excelCell.value = rowIndex - rowsThead;
                    } else {
                        excelCell.value = value;
                    }

                    export_formatValue(excelCell);

                    excelCell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };

                    Export_renderStyle(isHeader = i < rowsThead, cell, excelCell)


                    let rowSpan = parseInt(cell.getAttribute('rowspan')) || 1;
                    let colSpan = parseInt(cell.getAttribute('colspan')) || 1;

                    if (rowSpan > 1 || colSpan > 1) {
                        worksheet.mergeCells(
                            rowIndex,
                            cellIndex,
                            rowIndex + rowSpan - 1,
                            cellIndex + colSpan - 1
                        );

                        for (let r = 0; r < rowSpan; r++) {
                            for (let c = 0; c < colSpan; c++) {
                                mergeCells.set(`${rowIndex + r}-${cellIndex + c}`, true);
                            }
                        }
                    }
                    cellIndex = cellIndex + colSpan;
                }
                rowIndex++;
            }

            let columns = worksheet.columns;
            columns.forEach((column, columnIndex) => {
                let values = Object.values(column.values);
                let maxLength = Math.max(...values.map(value => value.toString().length)) || 20;
                column.width = Math.max(10, maxLength + 5);
                let cellValue = worksheet.getRow(2).getCell(columnIndex + 1);
            });
            worksheet.properties.defaultRowHeight = 20;

            filename = SysDate().FNOW().UTC_DNum().toString() + '-' + (filename ? decodeHtml(filename) : 'VTtech-Excel');

            let buffer = await workbook.xlsx.writeBuffer();
            let blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            let url = window.URL.createObjectURL(blob);
            let link = document.createElement('a');
            link.href = url;
            link.download = `${filename || 'Export'}.xlsx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            $("#tablePrintForAll").empty();

            if (typeof toastExportExcel === 'object') toastExportExcel.complete();
            resolve();
        }
        catch (ex) {
            resolve(ex);
            if (typeof toastExportExcel === 'object') toastExportExcel.error();
        }
    });
}

function Export_renderStyle(isHeader, cell, excelCell) {
    if (cell == null || excelCell == null) return
    if (isHeader) {
        excelCell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: expExcel_bgColor },  // Background color for header cells
        };
        excelCell.font = {
            color: { argb: expExcel_fontColor },
            bold: true,
            size: 12,
        };
        excelCell.alignment = {
            vertical: 'middle',
            horizontal: 'center',
            wrapText: 'normal',
        };
    }
    else {
        // Dynamically set alignment, font style, background color, etc. based on computed styles
        const computedStyle = getComputedStyle(cell);

        // Extract alignment
        const verticalAlign = computedStyle.verticalAlign || 'middle';  // Default to middle if not set
        const horizontalAlign = computedStyle.textAlign || 'center';  // Default to center if not set

        // Extract background color
        const bgColor = export_getCellBackgroundColor(cell);  // Default to white if not set

        // Extract font color and font style
        const fontColor = computedStyle.color || 'black';  // Default to black if not set
        const fontSize = computedStyle.fontSize || '10pt';  // Default to 10pt if not set
        const fontWeight = computedStyle.fontWeight || 'normal';  // Default to normal if not set
        const fontStyle = computedStyle.fontStyle || 'normal';  // Default to normal if not set

        // Apply styles to Excel cell
        excelCell.alignment = {
            vertical: verticalAlign,  // Vertical alignment (from computed style)
            horizontal: horizontalAlign,  // Horizontal alignment (from computed style)
            wrapText: computedStyle.whiteSpace === 'normal',  // Enable text wrapping if the white-space is normal
        };

        excelCell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: rgb2hex(bgColor).replace('#', '') },  // Background color for the cell
        };

        excelCell.font = {
            color: { argb: rgb2hex(fontColor).replace('#', '') },  // Font color
            //size: parseInt(fontSize) || 10,  // Font size
            bold: fontWeight === 'bold',  // Bold font weight
            italic: fontStyle === 'italic',  // Italic font style
        };
    }


}

function export_getCellBackgroundColor(cell) {
    // Get the computed styles for the <td> and <tr>
    const tdStyle = getComputedStyle(cell);
    const trStyle = getComputedStyle(cell.parentElement);

    // Check if <td> has a background color
    const tdBackgroundColor = tdStyle.backgroundColor;
    if (tdBackgroundColor !== 'rgba(0, 0, 0, 0)' && tdBackgroundColor !== 'transparent') {
        return tdBackgroundColor;  // If <td> has background color, return it
    }

    // If <td> doesn't have background color, fall back to <tr> background color
    const trBackgroundColor = trStyle.backgroundColor;
    return trBackgroundColor !== 'rgba(0, 0, 0, 0)' && trBackgroundColor !== 'transparent'
        ? trBackgroundColor
        : 'white';  // Default to white if neither has a background color
}

//#endregion

function exportToExcel_Xls(id, filename) {
    $("#tablePrintForAll").empty();
    var idbody = document.getElementById(id).tBodies[0].id;
    var table = $("#" + id).clone();
    let newtableid = id + "Copy";
    let newbodytableid = idbody + "Copy";
    table.attr('id', newtableid);
    $("#tablePrintForAll").html(table);
    document.getElementById(newtableid).tBodies[0].id = newbodytableid;

    let foundTH = 0;
    let THHide = [];
    table = document.getElementById(newtableid);
    for (var i = 0, row; row = table.rows[i]; i++) {
        for (var j = 0, col; col = row.cells[j]; j++) {
            if (row.cells[j].nodeName == "TH") {
                if (row.cells[j].style.display == "none" || row.cells[j].innerHTML == "Sửa" || row.cells[j].innerHTML == "Xóa" || $(row.cells[j]).hasClass("d-none") == true) {
                    let element = {};
                    element.NodeName = j;
                    THHide.push(element);
                }
                foundTH = 1;
            }
        }
        if (foundTH === 1) break;
    }

    for (var i = 0, row; row = table.rows[i]; i++) {
        for (var j = table.rows[i].cells.length - 1, col; col = row.cells[j]; j--) {
            for (var z = 0; z < THHide.length; z++) {
                if (j == THHide[z].NodeName) row.deleteCell(j);
            }
        }
    }

    $("#" + newtableid + " th").css({
        "background-color": '#' + expExcel_bgColor,
        "color": '#' + expExcel_fontColor,
        "border": "1px solid #000"
    });

    $("#" + newtableid + " td").css({
        "border": "1px solid #000"
    });

    $("#" + newtableid).table2excel({
        exclude: ".csv",
        name: "Worksheet Name",
        filename: filename,
        fileext: ".csv"
    });

    $("#tablePrintForAll").empty();
}

//#region //Export Json to excel
function export_cleanOverlappingMerges(merges) {
    if (!Array.isArray(merges)) {
        console.error("Input to export_cleanOverlappingMerges is not an array.");
        return [];
    }
    console.log(`Starting merge cleaning. Input count: ${merges.length}`);
    const cleanedMerges = [];
    const mergedCells = new Set(); 

    const isCellMerged = (r, c) => mergedCells.has(`${r},${c}`);

    const markCellsAsMerged = (sR, sC, eR, eC) => {
        for (let r = sR; r <= eR; r++) {
            for (let c = sC; c <= eC; c++) {
                mergedCells.add(`${r},${c}`);
            }
        }
    };

    let skippedCount = 0;
    for (const currentMerge of merges) {
        if (!currentMerge || !currentMerge.s || !currentMerge.e ||
            typeof currentMerge.s.r !== 'number' || typeof currentMerge.s.c !== 'number' ||
            typeof currentMerge.e.r !== 'number' || typeof currentMerge.e.c !== 'number') {
            console.warn("Skipping invalid merge object:", currentMerge);
            skippedCount++;
            continue;
        }

        const { s, e } = currentMerge;
        let overlaps = false;
        const startRow = Math.min(s.r, e.r);
        const startCol = Math.min(s.c, e.c);
        const endRow = Math.max(s.r, e.r);
        const endCol = Math.max(s.c, e.c);

        for (let r = startRow; r <= endRow; r++) {
            for (let c = startCol; c <= endCol; c++) {
                if (isCellMerged(r, c)) {
                    overlaps = true;
                    break;
                }
            }
            if (overlaps) break;
        }

        if (!overlaps) {
            cleanedMerges.push(currentMerge); 
            markCellsAsMerged(startRow, startCol, endRow, endCol);
        } else {
            skippedCount++;
        }
    }

    console.log(`Finished merge cleaning. Cleaned count: ${cleanedMerges.length}. Skipped: ${skippedCount}`);
    return cleanedMerges;
}
function export_optimizedMergeCells(worksheet, cleanedMerges) {
    if (!worksheet || typeof worksheet.getCell !== 'function' || typeof worksheet.mergeCells !== 'function') {
        console.error("Invalid worksheet object provided to export_optimizedMergeCells.");
        return;
    }
    if (!Array.isArray(cleanedMerges)) {
        console.error("Invalid cleanedMerges array provided to export_optimizedMergeCells.");
        return;
    }
    if (cleanedMerges.length === 0) {
        console.log("No merges to apply after cleaning.");
        return;
    }


    console.log(`Starting optimized merge process for ${cleanedMerges.length} ranges.`);
    console.time('Optimized Merging');

    const originalMergeInternal = worksheet._mergeCellsInternal;

    try {
        worksheet._mergeCellsInternal = function _export_optimizedMergeCellsInternal(dimensions, ignoreStyle) {
            const master = this.getCell(dimensions.top, dimensions.left);
            for (let i = dimensions.top; i <= dimensions.bottom; i++) {
                for (let j = dimensions.left; j <= dimensions.right; j++) {
                    if (i > dimensions.top || j > dimensions.left) {
                        const cellToMerge = this.getCell(i, j);
                        cellToMerge.merge(master, ignoreStyle);
                    }
                }
            }

            this._merges = this._merges || {};
            this._merges[master.address] = dimensions;
        };

        let mergeCount = 0;
        for (const { s, e } of cleanedMerges) {
            if (s && typeof s.r === 'number' && typeof s.c === 'number' &&
                e && typeof e.r === 'number' && typeof e.c === 'number') {
  
                worksheet.mergeCells(
                    s.r + 1, s.c + 1,
                    e.r + 1, e.c + 1
                );
                mergeCount++;
            } else {
                console.warn("Skipping merge due to invalid coordinates in cleaned data:", { s, e });
            }
        }
        console.log(`Applied ${mergeCount} merges.`);

    } catch (error) {
        console.error("Error during optimized merge execution:", error);
    } finally {
        if (originalMergeInternal) {
            worksheet._mergeCellsInternal = originalMergeInternal;
            console.log('Restored original _mergeCellsInternal function.');
        } else {
            console.warn('Could not restore original _mergeCellsInternal function.');
        }
    }
    console.timeEnd('Optimized Merging');
}
async function exportJsonToExcel(filename, dataExp, dataKeyExport = {}, merge = {}) {
    if (!dataExp || dataExp.length === 0) {
        notiWarning("Empty data");
        toastExportExcel?.close();
        return;
    }

    if (typeof toastExportExcel === 'object') toastExportExcel.begin();

    try {
        let workbook = new ExcelJS.Workbook();
        let worksheet = workbook.addWorksheet('Sheet');

        let headers = Object.values(dataKeyExport).map(key => {
            return decodeHtml(typeof key === 'object' ? key[0] : key)
        }
        );
        worksheet.addRow(headers);

        let dtMerges = [];
        if (merge?.KeyDetail) {
            dtMerges = exportJsonToExcel_MergesCell(dataKeyExport, dataExp, merge.ColumnSkip, merge.KeyDetail);
            dataExp = exportJsonToExcel_MergesData(dataExp, merge.KeyDetail, dataKeyExport);
        }

        let numOrder = -1;
        let batchSize = 5000;
        for (let i = 0; i < dataExp.length; i += batchSize) {
            let batch = dataExp.slice(i, i + batchSize).map((item, index) => {
                numOrder++;
                return Object.keys(dataKeyExport).map((key) => {
                    let keyConfig = dataKeyExport[key];
                    let _ele;
                    if (typeof keyConfig === 'object') {
                        if (exportJsonToExcel_CheckPer(keyConfig[2])) {
                            _ele = (typeof keyConfig[1] !== 'function') ? item[key] : exportJsonToExcel_CallFunc(keyConfig[1], item[key], item, numOrder);
                        }
                        else _ele = '';
                    }
                    else _ele = item[key];

                    return _ele;
                });
            });
            worksheet.addRows(batch);
        }
        const cleanedDtMerges = export_cleanOverlappingMerges(dtMerges);

        if (worksheet && typeof worksheet.mergeCells === 'function') {
            export_optimizedMergeCells(worksheet, cleanedDtMerges);
        } else {
            console.error("Cannot perform merge: worksheet is invalid or missing required methods.");
        }

        //for (let { s, e } of dtMerges) {
        //    worksheet.mergeCells(
        //        s.r + 1,
        //        s.c + 1,
        //        e.r + 1,
        //        e.c + 1
        //    );
        //}
        worksheet.border = {
            top: { style: 'thick' },
            left: { style: 'thick' },
            bottom: { style: 'thick' },
            right: { style: 'thick' },
        };
        let columns = worksheet.columns;
        columns.forEach((column, columnIndex) => {
            let values = Object.values(column.values);
            let maxLength = Math.max(...values.map(value => value?.toString().length)) || 20;
            column.width = Math.max(10, maxLength + 5);

            let firstCell = worksheet.getRow(1).getCell(columnIndex + 1);
            firstCell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: expExcel_bgColor },
            };
            firstCell.font = {
                color: { argb: expExcel_fontColor },
                bold: true,
                size: 12,
            };
            firstCell.alignment = {
                vertical: 'middle',
                horizontal: 'center',
                wrapText: 'normal',
            };


            let secondCell = worksheet.getRow(2).getCell(columnIndex + 1);

            let columnLetter = export_encodeCol(columnIndex + 1);
            for (let i = 1; i <= worksheet.rowCount; i++) {
                let range = `${columnLetter}${i}`;
                worksheet.getCell(range).border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            }
            export_formatValue(secondCell, columnIndex + 1, worksheet);
        });
        worksheet.properties.defaultRowHeight = 20;

        let buffer = await workbook.xlsx.writeBuffer();
        let blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        let url = window.URL.createObjectURL(blob);
        let link = document.createElement('a');
        link.href = url;
        link.download = `${filename || 'Export'}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        if (typeof toastExportExcel === 'object') toastExportExcel.complete();
    } catch (error) {
        console.error("Export error: ", error);
        toastExportExcel?.error();
    }
}

function exportJsonToExcel_CallFunc(funccb, value, item, index) {
    try {
        return funccb(value, item, index);
    } catch {
        return null;
    }
}

function exportJsonToExcel_MergesCell(dataKeyExport, dataListNew, arrkeyskip, keyDetail) {
    try {
        let merge = [];
        let arrskip = exportJsonToExcel_IndexHeader(dataKeyExport, arrkeyskip);

        if (arrskip.length === 0) return merge;

        let row = 1;
        dataListNew.forEach((item, i) => {
            let rowSpan = item[keyDetail]?.length || 1;
            for (let j = 0; j < Object.keys(dataKeyExport).length; j++) {
                if (!arrskip.includes(j)) {
                    merge.push({
                        s: { c: j, r: row },
                        e: { c: j, r: row + rowSpan - 1 },
                    });
                }
            }
            row += rowSpan;
        });

        return merge;
    } catch {
        return [];
    }
}

function exportJsonToExcel_MergesData(data, keyDetail, dataKeyExport) {
    try {
        return data.flatMap(item => {
            let details = item[keyDetail] || [];
            if (!details.length) return [item];

            return details.map((detailItem, index) => {
                if (index === 0) return { ...item, ...detailItem };

                let newRow = { ...item, ...detailItem };
                Object.keys(item).forEach(key => {
                    if (key !== keyDetail) {
                        newRow[key] = exportJsonToExcel_defaultVal(key, item[key], dataKeyExport);
                    }
                });

                return newRow;
            });
        });
    } catch {
        return data;
    }
}
function exportJsonToExcel_defaultVal(field, value, dataKeyExport) {
    if (dataKeyExport[field] && typeof dataKeyExport[field][1] === 'function') {
        return value;
    }

    switch (typeof value) {
        case 'bigint': return BigInt(0);
        case 'boolean': return false;
        case 'number': return 0;
        case 'object': return null;
        default: return '';
    }
}

function exportJsonToExcel_IndexHeader(dataHeader, arrkey) {
    try {
        return Object.keys(dataHeader)
            .map((key, index) => (arrkey.includes(key) ? index : -1))
            .filter(index => index !== -1);
    } catch {
        return [];
    }
}
function exportJsonToExcel_CheckPer(key) {
    if (typeof key !== 'string') return true;
    if (key.trim() != "" && PermissionTable_TabControl && PermissionTable_TabControl[key.trim()] == undefined) return false;
    return true;
}

/**
 * Xử lý dữ liệu từ cell Excel
 * @cell {richText} - cell.richText.map(part => part.text).join('')
 * @cell {value} - {bool, date, number, Date, string}
 * @cell {formula} formula - Xử lý công thức (Formula)
 * @cell {error} error - Xử lý lỗi trong ô
 * @cell {hyperlink} hyperlink - Xử lý liên kết (Hyperlink)
 * @cell {Date} cell.value instanceof Date
 * @returns {Object} - Dữ liệu đã xử lý
 */
function export_getCellValue(cell) {
    // //let cell = worksheet.getRow(rowNumber).getCell(colNumber);

    if (cell?.richText && cell?.richText.length > 0) {
        return cell.richText.map(part => part.text).join('');
    } else if (typeof cell?.text != "undefined") {
        return cell?.text ?? "";
    } else if (typeof cell?.value != "undefined") {
        return cell?.value ?? "";
    } else {
        return cell ?? "";
    }
}

function export_formatValue(cell, columnIndex = null, worksheet = null) {

    let $obj = (columnIndex != null && worksheet != null) ? worksheet.getColumn(columnIndex) : cell;
    let value = cell.value;
    if (/^\d{1,3}(,\d{3})*(\.\d+)?$/gm.test(value)) {
         value = value.toString().replace(/,/g, '');
    }
    value = !isNaN(Number(value)) ? Number(value) : value
    if(cell.value!=undefined) cell.value = value;
    if (typeof value === 'number') {
        if (value % 1 !== 0) {
            $obj.numFmt = '#,##0.00';
        } else {
            $obj.numFmt = '#,##0';
        }
    } else if (value instanceof Date) {
        if (value.getHours() === 0 && value.getMinutes() === 0 && value.getSeconds() === 0) {
            $obj.numFmt = 'dd-mm-yyyy;@';
        } else {
            $obj.numFmt = 'dd-mm-yyyy hh:mm:ss;@';
        }
    } else if (typeof value === 'string') {
        $obj.numFmt = '@';
    } else {
        $obj.numFmt = 'General';
    }
}

function export_encodeCol(columnIndex) {
    let result = '';
    while (columnIndex > 0) {
        columnIndex--;
        result = String.fromCharCode(65 + (columnIndex % 26)) + result;
        columnIndex = Math.floor(columnIndex / 26);
    }
    return result;
}

//#endregion

(function ($) {

    $.fn.wordExport = async function (fileName, options) {
        fileName = typeof fileName !== 'undefined' ? fileName : "jQuery-Word-Export";
        var static = {
            mhtml: {
                top: "Mime-Version: 1.0\nContent-Base: " + location.href + "\nContent-Type: Multipart/related; boundary=\"NEXT.ITEM-BOUNDARY\";type=\"text/html\"\n\n--NEXT.ITEM-BOUNDARY\nContent-Type: text/html; charset=\"utf-8\"\nContent-Location: " + location.href + "\n\n<!DOCTYPE html>\n<html>\n_html_</html>",
                head: "<head>\n<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\">\n<style>\n_styles_\n</style>\n</head>\n",
                body: "<body>_body_</body>"
            }
        };

        options = {
            maxWidth: 624
        };
        // Clone selected element before manipulating it
        var markup = $(this).clone();

        // Remove hidden elements from the output
        markup.each(function () {
            var self = $(this);
            if (self.is(':hidden'))
                self.remove();
        });

        // Embed all images using Data URLs
        var images = Array();
        //var img = markup.find('img');
        //for (let i = 0; i < img.length; i++) {
        //    // Calculate dimensions of output image
        //    var w = Math.min(img[i].width, options.maxWidth);
        //    var h = img[i].height * (w / img[i].width);
        //    // Create canvas for converting image to data URL
        //    var canvas = document.createElement("CANVAS");
        //    canvas.width = w;
        //    canvas.height = h;
        //    // Draw image to canvas
        //    var context = canvas.getContext('2d');
        //    context.drawImage(img[i], 0, 0, w, h);
        //    // Get data URL encoding of image
        //    var uri = canvas.toDataURL("image/png");
        //    $(img[i]).attr("src", img[i].src);
        //    img[i].width = w;
        //    img[i].height = h;
        //    // Save encoded image to array
        //    images[i] = {
        //        type: uri.substring(uri.indexOf(":") + 1, uri.indexOf(";")),
        //        encoding: uri.substring(uri.indexOf(";") + 1, uri.indexOf(",")),
        //        location: $(img[i]).attr("src"),
        //        data: uri.substring(uri.indexOf(",") + 1)
        //    };
        //}

        // Prepare bottom of mhtml file with image data
        var mhtmlBottom = "\n";
        for (let i = 0; i < images.length; i++) {
            mhtmlBottom += "--NEXT.ITEM-BOUNDARY\n";
            mhtmlBottom += "Content-Location: " + images[i].location + "\n";
            mhtmlBottom += "Content-Type: " + images[i].type + "\n";
            mhtmlBottom += "Content-Transfer-Encoding: " + images[i].encoding + "\n\n";
            mhtmlBottom += images[i].data + "\n\n";
        }
        mhtmlBottom += "--NEXT.ITEM-BOUNDARY--";

        //TODO: load css from included stylesheet


        var styles =
            '@page WordSection1{size: 841.95pt 595.35pt;mso-page-orientation: landscape;}' +
            'div.WordSection1 {page: WordSection1;}' +
            'table{border-collapse:collapse;}td{border:1px gray solid;width:5em;padding:2px;}';
        css =
            '@page WordSection1{size: 841.95pt 595.35pt;mso-page-orientation: landscape;}' +
            'table{page: WordSection1;}'

        var style = ''
        style = style + "@page WordSection1{size: 841.95pt 595.35pt;mso-page-orientation: landscape;}";
        style = style + "table {width: 100%;font: 17px Calibri;page: WordSection1;}";
        style = style + "table, th, td {border: solid 1px #DDD; border-collapse: collapse;";
        style = style + "padding: 2px 3px;text-align: center;}";
        style = style + ".fs-5{font-size: 50px;}";


        // var promisesCss = [];
        // var fileContent = ['\ufeff', static.mhtml.top.replace("_html_", static.mhtml.head.replace("_styles_", css) + static.mhtml.body.replace("_body_", markup.html())) + mhtmlBottom]

        // Create a Blob with the file contents
        //var blob = new Blob(fileContent, {
        //    type: "application/msword;charset=utf-8"
        //});
        //saveAs(blob, fileName + ".doc");
        get_all_css().then((values) => {
            if (values && values.length != 0) {
                //for (let i = 0; i < values.length; i++) {
                //    styles += values[i];
                //}
                styles += values;

                // Aggregate parts of the file together
                var fileContent = ['\ufeff', static.mhtml.top.replace("_html_", static.mhtml.head.replace("_styles_", styles) + static.mhtml.body.replace("_body_", markup.html())) + mhtmlBottom]

                // Create a Blob with the file contents
                var blob = new Blob(fileContent, {
                    type: "application/msword;charset=utf-8"
                });
                saveAs(blob, fileName + ".doc");
            }
        }).catch((ex) => {
            //var fileContent = static.mhtml.top.replace("_html_", static.mhtml.head.replace("_styles_", styles)
            //    + static.mhtml.body.replace("_body_", markup.html())) + mhtmlBottom;
            //var blob = new Blob([fileContent], {
            //    type: "application/msword;charset=utf-8"
            //});

            //saveAs(blob, fileName + ".doc");

        })


    };

    async function get_all_css(html = '') {
        return new Promise((reslove) => {
            var tags = ['style', 'link'];
            var promisesCss = [];
            for (let i = 0; i < tags.length; ++i) {
                $(document).find(tags[i]).each(function (index) {
                    if (tags[i] == 'style') {
                        html += ('\n' + $(this)[0].innerHTML + '\n');
                    }
                    if (tags[i] == 'link' || ($(this).attr('rel') == 'stylesheet' && proto.test($(this).attr('href')))) {
                        promisesCss.push(wordExportGetFile($(this).attr('href')));
                    }
                });
            }
            if (promisesCss && promisesCss.length != 0) {
                Promise.all(promisesCss).then((values) => {
                    if (values && values.length) {
                        for (let i = 0; i < values.length; i++) {
                            html += ('\n' + values[i] + '\n');
                        }
                    }
                    reslove(html);
                }).catch(() => {
                    reslove(html);
                })
            }
            else reslove(html);

            //var css = [];

            //for (let sheeti = 0; sheeti < document.styleSheets.length; sheeti++) {
            //    var sheet = document.styleSheets[sheeti];
            //    var rules = ('cssRules' in sheet) ? sheet.cssRules : sheet.rules;
            //    for (var rulei = 0; rulei < rules.length; rulei++) {
            //        var rule = rules[rulei];
            //        if ('cssText' in rule)
            //            css.push(rule.cssText);
            //        else
            //            css.push(rule.selectorText + ' {\n' + rule.style.cssText + '\n}\n');
            //    }
            //}
            //reslove('\n<style>\n' + css.join('\n') + '\n</style>\n')
        })
        //adding any header information that may be pertinent in the copied html
    }



    async function wordExportGetFile(url) {
        return new Promise((reslove) => {
            if (url && url != '')
                $.get(url, function (result) {
                    reslove(result);
                })
        })
    }


})(jQuery);


(function ($) {

    $.fn.googoose = function (options, callback) {

        var GG = this;
        var now = new Date().getTime();
        var proto = new RegExp(/^(http|https|file):/);
        var ab = new RegExp(/^\//);

        GG.finish = function () {
            if (options.debug)
                GG.debug_fn('finish action');
            if (callback) {
                var blob = new Blob([options.html], {
                    type: 'application/msword'
                });
                callback(null, blob);
            } else {
                GG.saveHtmlAsFile(options.filename, options.html);
            }
        }

        var options = $.extend({
            // These are the defaults.
            area: 'div.googoose-wrapper',
            margins: '1.0in',
            zoom: '75',
            filename: 'Doc1_' + now + '.doc',
            size: '8.5in 11.0in',
            display: 'Print',
            lang: 'en-US',
            toc: 'div.googoose.toc',
            pagebreak: 'div.googoose.break',
            headerarea: 'div.googoose.header',
            footerarea: 'div.googoose.footer',
            headerid: 'googoose-header',
            footerid: 'googoose-footer',
            headermargin: '.5in',
            footermargin: '.5in',
            currentpage: 'span.googoose.currentpage',
            totalpage: 'span.googoose.totalpage',
            finishaction: GG.finish,
            html: null,
            initobj: document,
            debugtype: 'alert',
            debug: 0
        }, options);
        GG.options = options;

        GG.debug_fn = function (args) {
            options.debugtype == 'console' ? console.log(args) : alert(args);
        }


        GG.saveHtmlAsFile = function (
            fileNameToSaveAs, textToWrite
        ) {
            /* Saves a text string as a blob file*/
            var ie = navigator.userAgent.match(/MSIE\s([\d.]+)/),
                ie11 = navigator.userAgent.match(/Trident\/7.0/) && navigator.userAgent.match(/rv:11/),
                ieEDGE = navigator.userAgent.match(/Edge/g),
                ieVer = (ie ? ie[1] : (ie11 ? 11 : (ieEDGE ? 12 : -1)));

            if (ie && ieVer < 10) {
                console.log("No blobs on IE ver<10");
                return;
            }

            var textFileAsBlob = new Blob([textToWrite], {
                type: 'application/msword'
            });

            if (ieVer > -1) {
                window.navigator.msSaveBlob(textFileAsBlob, fileNameToSaveAs);

            } else {
                var downloadLink = document.createElement("a");
                downloadLink.download = fileNameToSaveAs;
                downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
                downloadLink.onclick = function (e) { document.body.removeChild(e.target); };
                downloadLink.style.display = "none";
                document.body.appendChild(downloadLink);
                downloadLink.click();
            }
        }

        // http://stackoverflow.com/questions/7394748/whats-the-right-way-to-decode-a-string-that-has-special-html-entities-in-it
        GG.decodeHtmlEntity = function (str) {
            return str.replace(/&#(\d+);/g, function (match, dec) {
                return String.fromCharCode(dec);
            });
        }


        GG.translate_mso_features = function (html) {
            if (options.debug)
                GG.debug_fn('GG.translate_mso_features');

            html = GG.decodeHtmlEntity(html);
            html = GG.remove_bad_tags(html);
            html = GG.convert_pagebreaks(html);
            html = GG.convert_toc(html);
            html = GG.convert_hdrftr(html);
            html = GG.convert_imgs(html);

            return html;
        }

        GG.remove_bad_tags = function (html) {
            if (options.debug)
                GG.debug_fn('GG.remove_bad_tags');
            var thtml = $(html);


            thtml.find('noscript').each(function () {
                $(this).replaceWith('');
            });
            thtml.each(function () {
                if ($(this).is(':hidden')) {
                    $(this).remove();
                }
            });

            html = thtml[0].outerHTML;
            return html;
        }

        GG.convert_pagebreaks = function (html) {
            if (options.debug)
                GG.debug_fn('GG.convert_pagebreaks');
            //user decides in html what will be a page break in word, this converts to a page break
            if (options.pagebreak) {
                var thtml = $(html);
                thtml.find(options.pagebreak).replaceWith(GG.get_pagebreak());
                html = thtml[0].outerHTML;
            }
            return html;
        }

        GG.convert_toc = function (html) {
            if (options.debug)
                GG.debug_fn('GG.convert_toc');
            //user determines in html what will be the toc in word
            if (options.toc && $(options.toc).length) {
                var thtml = $(html);
                thtml.find(options.toc).replaceWith(GG.get_toc_contents());
                html = thtml[0].outerHTML;
            }
            return html;
        }

        GG.convert_hdrftr = function (html) {
            if (options.debug)
                GG.debug_fn('GG.convert_hdrftr');
            var hvis = options.headerarea && $(options.headerarea).length;
            var fvis = options.footerarea && $(options.footerarea).length;
            if (hvis || fvis) {
                html = GG.convert_totalpage(html);
                html = GG.convert_currentpage(html);
            }

            var thtml = $(html);
            if (hvis) {
                thtml.find(options.headerarea).replaceWith(GG.headerstart() + thtml.find(options.headerarea).html() + GG.headerend());
                html = thtml[0].outerHTML;
            }
            if (fvis) {
                thtml.find(options.footerarea).replaceWith(GG.footerstart() + thtml.find(options.footerarea).html() + GG.footerend())
                html = thtml[0].outerHTML;
            }
            return html;

        }

        GG.convert_imgs = function (html) {
            if (options.debug)
                GG.debug_fn('GG.convert_imgs');
            //make sure all standard images use absolute path
            var thtml = $(html);
            imgs = thtml.find('img');
            imgs.each(function () {
                var src = $(this)[0].src;
                var l = window.location;
                //var t = l.protocol + '//' + l.host + '/';
                var t = l.protocol + '//' + 'demo.vttechsolution.com' + '/';
                if (proto.test(src)) {
                } else if (ab.test(src)) {
                    src = t + src;
                } else {
                    var p = l.path.replace('/\/[^\/.]+$/', '/');
                    src = t + p + src;
                }
                $(this).attr('src', src);
            });
            html = thtml[0].outerHTML;
            return html;
        }

        GG.convert_totalpage = function (html) {
            if (options.debug)
                GG.debug_fn('GG.convert_totalpage');
            if (options.totalpage && $(options.totalpage).length) {
                var thtml = $(html);
                thtml.find(options.totalpage).html('');
                thtml.find(options.totalpage).append(GG.get_total_page_number());
                html = thtml[0].outerHTML;
            }
            return html;
        }

        GG.convert_currentpage = function (html) {
            if (options.debug)
                GG.debug_fn('GG.convert_currentpage');
            if (options.currentpage && $(options.currentpage).length) {
                var thtml = $(html);
                thtml.find(options.currentpage).html('');
                thtml.find(options.currentpage).append(GG.get_page_number());
                html = thtml[0].outerHTML;
            }
            return html;
        }

        GG.get_pagebreak = function () {
            if (options.debug)
                GG.debug_fn('GG.get_pagebreak');
            return '<br clear=all style=\'mso-special-character:line-break;page-break-before:always\'>';
        }

        GG.headerstart = function () {
            var html = '';
            html += '\n<div style=\'mso-element:header\' id=' + options.headerid + '>\n';
            html += '<p class="MsoHeader">\n';
            return html;
        }
        GG.headerend = function () {
            if (options.debug)
                GG.debug_fn('GG.headerend');
            return '</p></div>\n';
        }

        GG.footerstart = function () {
            if (options.debug)
                GG.debug_fn('GG.footerstart');
            var html = '';
            html += '<div style=\'mso-element:footer\' id=' + options.footerid + '>';
            return html;
        }

        GG.footerend = function () {
            if (options.debug)
                GG.debug_fn('GG.footerend');
            return '</div>\n';
        }

        GG.get_page_number = function () {
            if (options.debug)
                GG.debug_fn('GG.get_page_number');
            var html = '<!--[if supportFields]><span\n';
            html += 'class=MsoPageNumber><span style=\'mso-element:field-begin\'></span><span\n';
            html += 'style=\'mso-spacerun:yes\'> </span>PAGE <span style=\'mso-element:field-separator\'></span></span><![endif]--><span\n';
            html += 'class=MsoPageNumber><span style=\'mso-no-proof:yes\'>1</span></span><!--[if supportFields]><span\n';
            html += 'class=MsoPageNumber><span style=\'mso-element:field-end\'></span></span><![endif]-->';
            return html;
        }

        GG.get_total_page_number = function () {
            if (options.debug)
                GG.debug_fn('GG.get_total_page_number');
            var html = '<!--[if supportFields]><span class=MsoPageNumber><span \n';
            html += ' style=\'mso-element:field-begin\'></span> NUMPAGES <span style=\'mso-element:field-separator\'></span></span><![endif]--><span \n';
            html += ' class=MsoPageNumber><span style=\'mso-no-proof:yes\'>1</span></span><!--[if supportFields]><span \n'
            html += ' class=MsoPageNumber><span style=\'mso-element:field-end\'></span></span><![endif]-->\n';
            return html;
        }

        GG.get_toc_contents = function () {
            if (options.debug)
                GG.debug_fn('GG.get_toc_contents');
            var toc = '<p class=MsoToc1>\n';
            toc += '<!--[if supportFields]>\n';
            toc += '<span style=\'mso-element:field-begin\'></span>\n';
            toc += 'TOC \o "1-3" \\u \n';
            toc += '<span style=\'mso-element:field-separator\'></span>\n';
            toc += '<![endif]-->\n';
            toc += '<span style=\'mso-no-proof:yes\'>Table of content - Please right-click and choose "Update fields".</span>\n';
            toc += '<!--[if supportFields]>\n';
            toc += '<span style=\'mso-element:field-end\'></span>\n';
            toc += '<![endif]-->\n';
            toc += '</p>\n';

            return toc;
        }

        //TODO - figure out a way to simulate a right mpuse click, update fields

        GG.include_css_getlink = async function (url) {
            return new Promise((reslove) => {
                if (url && url != '')
                    $.get(url, function (result) {
                        reslove(result);
                    })
            })
        }

        GG.include_css = async function (html = '') {
            return new Promise((reslove) => {
                if (options.debug)
                    GG.debug_fn('GG.include_css');
                //var tags = ['link', 'style'];
                //var promisesCss = [];
                //for (let i = 0; i < tags.length; ++i) {
                //    $(document).find(tags[i]).each(function (index) {
                //        if (tags[i] == 'style') {
                //            html += ('\n' + $(this)[0].outerHTML + '\n');
                //        }
                //        if (tags[i] == 'link' || ($(this).attr('rel') == 'stylesheet' && proto.test($(this).attr('href')))) {
                //            promisesCss.push(GG.include_css_getlink($(this).attr('href')));
                //        }
                //    });
                //}
                //if (promisesCss && promisesCss.length != 0) {
                //    Promise.all(promisesCss).then((values) => {
                //        if (values && values.length) {
                //            for (let i = 0; i < values.length; i++) {
                //                html += ('<style>\n' + values[i] + '\n<style>');
                //            }
                //        }
                //        reslove(html);
                //    }).catch(() => {
                //        reslove(html);
                //    })
                //}
                //else reslove(html);

                var css = [];

                for (let sheeti = 0; sheeti < document.styleSheets.length; sheeti++) {
                    var sheet = document.styleSheets[sheeti];
                    var rules = ('cssRules' in sheet) ? sheet.cssRules : sheet.cssRules;
                    for (let rulei = 0; rulei < rules.length; rulei++) {
                        var rule = rules[rulei];
                        if ('cssText' in rule)
                            css.push(rule.cssText);
                        else
                            css.push(rule.selectorText + ' {\n' + rule.style.cssText + '\n}\n');
                    }
                }
                reslove('\n<style>\n' + css.join('\n') + '\n</style>\n')
            })
            //adding any header information that may be pertinent in the copied htmls
        }

        //GG.include_css = function (html = '') {
        //    //adding any header information that may be pertinent in teh copied html
        //    var tags = ['link', 'style' ];
        //    for (let i = 0; i < tags.length; i++) {
        //        $(document).find(tags[i]).each(function () {
        //            if (tags[i] == 'style') html += ('\n' + $(this)[0].outerHTML + '\n');
        //            if (tags[i] == 'link') {
        //                let itemLink = $(this).clone();
        //                itemLink.attr('href', 'https://demo.vttechsolution.com' + itemLink.attr('href'));
        //                html += ('\n' + itemLink[0].outerHTML + '\n');
        //            }
        //        });
        //    }
        //    return html;
        //}

        GG.html = async function () {
            if (options.debug)
                GG.debug_fn('GG.html');
            if (!$(options.area).length) return null;

            var html = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>\n`;
            html += '<head>\n';
            html += '<meta charset=\'utf-8\'\n';
            html += '<!--[if gte mso 9]>\n';
            html += '<xml>\n';
            html += '<w:WordDocument>\n';
            html += ('<w:View>' + options.display + '</w:View>\n');
            html += ('<w:Zoom>' + options.zoom + '</w:Zoom>\n');
            html += '<w:DoNotOptimizeForBrowser/>\n';
            html += '</w:WordDocument>\n';
            html += '<o:OfficeDocumentSettings>\n';
            html += '<o:AllowPNG/>\n';
            html += '</o:OfficeDocumentSettings>\n';
            html += '</xml>\n';
            html += '<![endif]-->\n';
            html += '';
            let htmlcss = await GG.include_css();
            html += htmlcss;
            //html += GG.include_css();
            //adding in mso style necessesities
            //html += '<style>\n';
            //html += '.col-7{width: 10in !important;}'
            //html += '</style>\n';
            html += '<style>\n';
            html += '#' + options.headerid + ', #' + options.footerid + '{\n';
            html += '\tmargin: 0 0 0 9in;';
            html += '}\n';
            html += '<!--\n';
            html += '@page {\n';
            html += ('\tsize:' + options.size + ';\n');
            html += ('\tmargin:' + options.margins + ';\n');
            html += '}\n';
            html += '@page Container {\n';
            html += ('\tmso-header-margin:' + options.headermargin + ';\n');
            html += ('\tmso-footer-margin:' + options.footermargin + ';\n');
            html += ('\tmso-header:' + options.headerid + ';\n');
            html += ('\tmso-footer:' + options.footerid + ';\n');
            html += '}\n';
            html += 'div.Container { page:Container; }\n';
            html += '-->\n';
            html += '</style>\n';

            //close head
            html += '</head>\n';

            //start body
            html += ('<body lang="' + options.lang + '">\n<div class="Container">');


            if ($(options.initobj).is(options.area)) {
                if (options.debug)
                    GG.debug_fn('is');
                html += GG.translate_mso_features($(options.initobj)[0].outerHTML);
            } else {
                if (options.debug)
                    GG.debug_fn('no is');
                // Clone selected element before manipulating it
                $("#tablePrintForAll").empty().show();
                var markup = $(options.initobj).find(options.area).clone();
                $("#tablePrintForAll").html(markup.outerHTML())
                // Remove hidden elements from the output
                //$("#tablePrintForAll").find(":hidden").remove();
                //$("#tablePrintForAll *").makeCssInline();
                $(options.initobj).find(options.area).each(function () {
                    html += GG.translate_mso_features($("#tablePrintForAll").outerHTML());
                });
                $("#tablePrintForAll").empty().hide();
            }

            //close body
            html += '</div></body>\n';

            //close doc
            html += '</html>\n';

            //return html;
            return html;

        }

        setTimeout(() => {
            //execution
            if (options.debug)
                GG.debug_fn('googoose exec');
            GG.html().then((values) => {
                options.html = values;
                if (options.html && options.finishaction) {
                    options.finishaction();
                }

                //var source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(values);
                //var fileDownload = document.createElement("a");
                //document.body.appendChild(fileDownload);
                //fileDownload.href = source;
                //fileDownload.download = 'document.doc';
                //fileDownload.click();
                //document.body.removeChild(fileDownload);

                //if (options.html && options.finishaction) {
                //    options.finishaction();
                //}
                return GG;
            })

        }, 100)

    };
}(jQuery));



let val = $(table.rows[i].cells[j]).html().toString().replace(/[^a-zA-Z0-9\.\-]/gm, "");
if (/^(\d+\.?\d*|\.\d+)$/.test(val)) {
    $(table.rows[i].cells[j]).html(Number(val));

    let NumCharCode = 'A'.charCodeAt(0);
    let CellName = String.fromCharCode(NumCharCode + j);
    CellNameTypeNumber.push(CellName + (i + 1));

}

