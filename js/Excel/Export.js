﻿
//#region Export
async function exportToExcel (id, filename) {
    new Promise((resolve, reject) => {
        if (typeof toastExportExcel === 'object') toastExportExcel.begin();
        setTimeout(() => {
            try {
                $("#tablePrintForAll").empty();
                var idbody = document.querySelector('#' + id + ' tbody:not(.bodyfilterunique)').id;
                var table = $("#" + id).clone();
                let StrCheck = '';
                let newtableid = id + "Copy";
                let newbodytableid = idbody + "Copy";
                table.attr('id', newtableid);
                $("#tablePrintForAll").html(table);
                document.getElementById(newtableid).tBodies[0].id = newbodytableid;
                table = document.getElementById(newtableid);

                for (let i = 0, row; row = table.rows[i]; i++) {
                    for (let j = table.rows[i].cells.length - 1, col; col = row.cells[j]; j--) {
                        if (table.rows[i].cells[j].style.display == "none" || table.rows[i].cells[j].classList.contains('d-none') || $(table.rows[i].cells[j]).css('display') == "none") {
                            row.deleteCell(j);
                        }
                    }
                    if (row.id != '') {
                        let elem = document.querySelector("#" + row.id);
                        let style = getComputedStyle(elem);
                        if (style.display == "none") {
                            row.remove();
                            i--;
                        }
                    }
                }

                let rowsThead = table.tHead ? table.tHead.rows.length - 1 : 0;
                for (let i = 0, row; row = table.rows[i]; i++) {
                    for (let j = table.rows[i].cells.length - 1, col; col = row.cells[j]; j--) {


                        if ($(table.rows[i].cells[j]).find(".selection.dropdown").length > 0) {
                            $(table.rows[i].cells[j]).html($(table.rows[i].cells[j]).find(".selection.dropdown .text"));
                        }

                        if ($(table.rows[i].cells[j]).hasClass("vt-number-order")) {
                            $(table.rows[i].cells[j]).html(i - rowsThead);
                        }

                        //let val = $(table.rows[i].cells[j]).html().toString().replace(/[^a-zA-Z0-9\.\-]/gm, "");
                        //if (/^(\d+\.?\d*|\.\d+)$/.test(val)) {
                        //    $(table.rows[i].cells[j]).html(Number(val));
                        //    let NumCharCode = 'A'.charCodeAt(0);
                        //    let NumFirst = (Math.floor(j / 25) > 0 ? Number(Math.floor(j / 25)) : 0);
                        //    while (j > 25) {
                        //        j = j - 25;
                        //    }
                        //    let CellName = (NumFirst > 0 ? String.fromCharCode(NumCharCode + (NumFirst - 1)) : "")  + String.fromCharCode(NumCharCode + j);
                        //    CellNameTypeNumber.push(CellName + (i + 1));
                        //}
                    }
                }
                // Change class td
                $("#tablePrintForAll td").each(function () {
                    $(this).addClass("tableexport-string targets")
                    // compare id to what you want
                });
                filename=SysDate().FNOW().UTC_DNum().toString() + '-' + (filename ? decodeHtml(filename) : 'VTtech-Excel');
                GetTemplateXLSX("tablePrintForAll", filename);
                $("#tablePrintForAll").empty();
                if (typeof toastExportExcel === 'object') toastExportExcel.complete(); 
                resolve();
            }
            catch (ex) {
                reject();
                if (typeof toastExportExcel === 'object') toastExportExcel.error();
            }
        }, 100)
    })
}

var divHeightGlobalPDF;
var divWidthGlobalPDF;
var ratioGlobalPDF;

function ExportPDFContainer (id, filename) {
    id = "dtContentReport";
    let element = $("#" + id);
    divHeightGlobalPDF = element.height();
    divWidthGlobalPDF = element.width();
    ratioGlobalPDF = divHeightGlobalPDF / divWidthGlobalPDF;

    html2canvas(element, {
        height: divHeightGlobalPDF,
        width: divWidthGlobalPDF,
        onrendered: function (canvas) {

            //  var ctx = canvas.getContext("2d");
            //  ctx.fillStyle = '#ffffff';
            var gl = canvas.getContext("2d");
            gl.fillStyle = '#ffffff';
            // gl.fillRect(0, 0, canvas.width, canvas.height);
            var image = canvas.toDataURL("image/jpeg", 1.0);
            var doc = new jsPDF();
            var width = doc.internal.pageSize.width;
            var height = ratioGlobalPDF * width;
            doc.addImage(image, 'JPEG', 0, 0, width, height);
            doc.save(filename + '.pdf');
        }
    });
}
//#region function duplicate
//function GetTemplateXLSX (id, filename, DataTypeNumber) {

//    var elt = document.getElementById(id);
//    var wb = XLSX.utils.table_to_book(elt, {sheet: "data", raw: true});
//    //var ws = wb.Sheets["data"];
//    //if (DataTypeNumber && DataTypeNumber.length > 0) {
//    //    for (let i = 0; i < DataTypeNumber.length; i++) {
//    //        let CellName = DataTypeNumber[i].toString();
//    //        ws[CellName].t = "n";
//    //    }
//    //}
//    XLSX.writeFile(wb, (filename + '.xlsx'));
//}
//#endregion
function GetTemplateXLSX_RemoveLocalStorage () {
    if (Object.values(localStorage).length != 0) {
        for ([key, value] of Object.entries(localStorage)) {
            if (key.indexOf('te-') == 0 &&
                (key.indexOf('-txt') == key.length - 4 || key.indexOf('-xlsx') == key.length - 5 || key.indexOf('-csv') == key.length - 4)) {
                localStorage.removeItem(key);
            }
        }
    }
}

//#endregion

function exportToExcel_Xls (id, filename) {
    $("#tablePrintForAll").empty();
    var idbody = document.getElementById(id).tBodies[0].id;
    var table = $("#" + id).clone();
    let newtableid = id + "Copy";
    let newbodytableid = idbody + "Copy";
    table.attr('id', newtableid);
    $("#tablePrintForAll").html(table);
    document.getElementById(newtableid).tBodies[0].id = newbodytableid;
    // Detect TH Hide
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
    $("#" + newtableid).table2excel({
        exclude: ".csv",
        name: "Worksheet Name",
        filename: filename,
        fileext: ".csv" // file extension
    });

    $("#tablePrintForAll").empty();


}

//#region //Export Json to excel
function exportJsonToExcel(filename, dataExp, dataKeyExport = {}, merge = {}) {
    return new Promise(resolve => {
        if (typeof toastExportExcel === 'object') toastExportExcel.begin();
        setTimeout(() => {
            try {
                if (dataExp && dataExp.length > 0) {
                    let dtResult = [];
                    let dtMerges = [];
                    if (merge && Object.entries(merge).length > 0 && merge?.KeyDetail != undefined && merge?.KeyDetail != "") {
                        dtMerges = exportJsonToExcel_MergesCell(dataKeyExport, dataExp, merge?.ColumnSkip, merge?.KeyDetail)
                        if (dtMerges != undefined && dtMerges.length != 0)
                            dataExp = exportJsonToExcel_MergesData(dataExp, merge?.KeyDetail, dataKeyExport);
                    }
                    if (dataKeyExport && Object.values(dataKeyExport).length != 0) {
                        let index = 0;
                        for ([key, value] of Object.entries(dataExp)) {
                            let e = {};
                            if (Object.entries(dataKeyExport).length > 0) {
                                for ([key1, value1] of Object.entries(dataKeyExport)) {
                                    if (typeof value1 === 'object') {
                                        if (exportJsonToExcel_CheckPer(value1[2])) {
                                            e[decodeHtml(value1[0])] = (typeof value1[1] !== 'function' ? value[key1] : exportJsonToExcel_CallFunc(value1[1], value[key1], value, value?.IndexRow || index));
                                        }
                                        else e[decodeHtml(value1[0])] = '';
                                    }
                                    else e[decodeHtml(value1)] = value[key1];
                                }
                            }
                            index++;
                            dtResult.push(e);
                        }
                    }
                    else dtResult = dataExp;
                    let myFile=SysDate().FNOW().UTC_DNum().toString() + '-' + (filename ? decodeHtml(filename) : 'VTtech-Excel') + ".xlsx";
                    let myWorkSheet = XLSX.utils.json_to_sheet(dtResult);
                    myWorkSheet["!merges"]=dtMerges;

                    let myWorkBook = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(myWorkBook, myWorkSheet, "Sheet");
                    XLSX.writeFile(myWorkBook, myFile);
                    if (typeof toastExportExcel === 'object') toastExportExcel.complete(); 
                } else {
                    if (typeof toastExportExcel === 'object') toastExportExcel.close();
                    notiWarning("Empty data");
                }
            }
            catch (ex) {
                if (typeof toastExportExcel === 'object') toastExportExcel.error();
            }
            resolve();
        }, 100);
    });
}

function exportJsonToExcel_CallFunc(funccb, value, item, index) {
    try {
       
        return funccb(value, item, index);
    }
    catch {
        return null;
    }
}


function exportJsonToExcel_MergesCell(dataKeyExport, dataListNew, arrkeyskip, keyDetail) {
    try {
        let merge = [];
        let row = 1;
        let lengthkey = Object.entries(dataKeyExport).length;
        let arrskip = exportJsonToExcel_IndexHeader(dataKeyExport, arrkeyskip);
        if (arrskip.length == 0) return merge;
        for (let i = 0; i < dataListNew.length; i++) {
            let item = dataListNew[i];
            item.IndexRow = i;
            let rowSpan = 1;
            if (item[keyDetail] && item[keyDetail].length != 0) {
                rowSpan = item[keyDetail].length;
            }
            for (let j = 0; j < lengthkey; j++) {
                if (!arrskip.includes(j)) {
                    merge.push(
                        {
                            s: { c: j, r: row },
                            e: { c: j, r: row + rowSpan - 1 }
                        }
                    )
                }
            }
            row += rowSpan;
        }
        return merge
    }
    catch {
        return [];
    }
}
function exportJsonToExcel_IndexHeader(dataHeader, arrkey) {
    try {
        let arr = [];
        for (const [index, [key, value]] of Object.entries(Object.entries(dataHeader))) {
            if (arrkey.includes(key))
                arr.push(Number(index));
        }
        return arr;
    }
    catch {
        return [];
    }  
}
function exportJsonToExcel_MergesData(data, keyDetail, dataKeyExport) {
    try {
        const mergedData = [];
        for (const item of data) {
            if (item[keyDetail] && Array.isArray(item[keyDetail]) && item[keyDetail].length > 0) {
                let countDetail = 0;
                for (const detailItem of item[keyDetail]) {
                    if (countDetail != 0) {
                        Object.keys(item).forEach(k => item[k] = (k != keyDetail && k != 'IndexRow')
                            ? exportJsonToExcel_defaultVal(k, item[k], dataKeyExport )
                            : item[k]);
                    }
                    countDetail++;
                    const newRow = { ...item, ...detailItem };
                    mergedData.push(newRow);
                }
            } else {
                mergedData.push(item);
            }
        }
        return mergedData;
    }
    catch {
        return data;
    }
}

function exportJsonToExcel_defaultVal(field, value, dataKeyExport) {
    let type = typeof value;
    if (dataKeyExport[field] != undefined && typeof dataKeyExport[field][1] == 'function') {
        return value;
    }
    switch (type) {
        case 'bigint': return BigInt(0);
        case 'boolean': return false;
        case 'function': return function () {

        };
        case 'null': return null;
        case 'number': return 0
        case 'object': return {};
        case 'symbol': return Symbol();
        case 'undefined': return void 0;
        default: return value;
    }

    try {
        // Look for constructor in this or current scope
        var ctor = typeof this[type] === 'function'
            ? this[type]
            : eval(type);

        return new ctor;

        // Constructor not found, return new object
    } catch (e) { return {}; }
}

function exportJsonToExcel_CheckPer (key) {
    if (typeof key !== 'string') return true;
    if (key.trim() != "" && PermissionTable_TabControl && PermissionTable_TabControl[key.trim()] == undefined) return false;
    return true;
}
//#endregion
//#region //Export Json to excel
 
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

    async function get_all_css (html = '') {
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



    async function wordExportGetFile (url) {
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
                downloadLink.onclick = function (e) {document.body.removeChild(e.target);};
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

function GetTemplateXLSX (id, filename) {
    var elt = document.getElementById(id);
    var wb = XLSX.utils.table_to_book(elt, {sheet: "data", raw: true});
    var ws = wb.Sheets["data"];
    for (const [key, value] of Object.entries(ws)) {
        if (value.v != undefined) {
            let val = (value.v).toString().replace(/\,/g, "");
            if (!isNaN(parseFloat(val)) && isFinite(val) && val.charAt(0) != '0') {
                ws[key].v = val;
                ws[key].t = "n";
            }
        }
    }
    XLSX.writeFile(wb, (filename + '.xlsx'));
}