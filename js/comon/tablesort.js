﻿/*
    A simple, lightweight jQuery plugin for creating sortable tables.
    https://github.com/kylefox/jquery-tablesort
    Version 0.0.11
*/
(function ($) {
    $.tablesort = function ($table, settings) {
        var self = this;
        this.$table = $table;


        this.$thead = this.$table.find('thead');
        this.settings = $.extend({}, $.tablesort.defaults, settings);
        this.$sortCells = this.$thead.length > 0 ? this.$thead.find('th:not(.no-sort)') : this.$table.find('th:not(.no-sort)');
        $.each(this.$sortCells, function (key, value) {
            value.classList.add("willsort");
        });
        
        this.$sortCells.on('click.tablesort', function () {
            try {
                let _tablesortclassname = this.parentNode.offsetParent.className;
                if (_tablesortclassname.includes('nosortwholetable'))
                    return false;
                else {
                    //if (LanguageVTT)
                    //    LanguageVTT.Terminate();
                    
                    self.sort($(this));
                }
            }
            catch (ex) {

            }

        });
        this.index = null;
        this.$th = null;
        this.direction = null;
    };

    function removeAccents(str) {
        var AccentsMap = [
            "aàảãáạăằẳẵắặâầẩẫấậ",
            "AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ",
            "dđ", "DĐ",
            "eèẻẽéẹêềểễếệ",
            "EÈẺẼÉẸÊỀỂỄẾỆ",
            "iìỉĩíị",
            "IÌỈĨÍỊ",
            "oòỏõóọôồổỗốộơờởỡớợ",
            "OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ",
            "uùủũúụưừửữứự",
            "UÙỦŨÚỤƯỪỬỮỨỰ",
            "yỳỷỹýỵ",
            "YỲỶỸÝỴ"
        ];
        for (var i = 0; i < AccentsMap.length; i++) {
            var re = new RegExp('[' + AccentsMap[i].substr(1) + ']', 'g');
            var char = AccentsMap[i][0];
            str = str.replace(re, char);
        }
        return str;
    }

    $.tablesort.prototype = {

        sort: function (th, direction) {
  
            var dataname= th.data('name');
            var start = new Date(),
                self = this,
                table = this.$table,
                rowsContainer = table.children('tbody:not(.bodyfilterunique)').length > 0 ? table.children('tbody:not(.bodyfilterunique)') : table,
                rows = rowsContainer.children('tr'),
                cells=(dataname!=undefined&&dataname!="")? rows.find('td[data-name="'+dataname+'"]'):rows.children(':nth-child('+(th.index()+1)+')').filter('td, th'),
                sortBy = th.data().sortBy,
                sortedMap = [];
             table.addClass("sort-pending");
 
            if (th != undefined) th.addClass("sort-progressing");
            var sortbytype = th.attr('sortby');
            var unsortedValues = cells.map(function (idx, cell) {
 
                if (sortBy)
                    return (typeof sortBy === 'function') ? sortBy($(th), $(cell), self) : sortBy;
                else if (!isNaN($(this).text()) && $(this).text().trim()!="") return Number($(this).text());
                return ($(this).data().sortvalue != null ? removeAccents($(this).data().sortvalue.toString()) : removeAccents($(this).text()));
            });
            if (unsortedValues.length === 0) {
                if (table != undefined) table.removeClass("sort-pending");
                if (th != undefined) th.removeClass("sort-progressing");
                return;
            }

            //click on a different column
            if (this.index !== th.index()) {
                this.direction = 'asc';
                this.index = th.index();
                direction = 1;
            }
            else {
                
                switch (this.direction) {
                    case "asc": {
                        this.direction = 'desc';
                        direction = -1;
                        break;
                    }
                    case "desc": {
                        this.direction = '';
                        direction = 0;
                        break;
                    }
                    case "": {
               
                        this.direction = 'asc';
                        direction = 1;
                        break;
                    }
                }
            }


            // Try to force a browser redraw
            self.$table.css("display");
            // Run sorting asynchronously on a timeout to force browser redraw after
            // `tablesort:start` callback. Also avoids locking up the browser too much.
            setTimeout(function () {
                self.$sortCells.removeClass(self.settings.asc + ' ' + self.settings.desc);
                for (let i = 0, length = unsortedValues.length; i < length; i++) {
           
                    sortedMap.push({
                        index: i,
                        cell: cells[i],
                        row: rows[i],
                        value: unsortedValues[i]
                    });
                }

                // Custom

                  
                var index = th[0].dataset.default_index != undefined ? Number(th[0].dataset.default_index) : 0
                $.each(sortedMap, function (key, value) {
                    if (value.cell != undefined && value.cell.dataset.default_index == undefined) {
                        index = index + 1;
                        value.cell.dataset.default_index = index;
                        
                    }
                });
                th[0].dataset.default_index = Number(index);
                ///////////////////////
                                             debugger
                sortedMap.sort((a, b) => {
                    if (direction != 0) {
                        switch (sortbytype) {
                            case 'd': {
                                return self.settings.compareNumber(a.value, b.value) * direction;
                                break;
                            }
                            case 's': {
                                return self.settings.comparestring(a.value, b.value) * direction;
                                break;
                            }
                            case 'datetext': {
                                return self.settings.compareddmmyyy(a.value, b.value) * direction;
                                break;
                            }

                            default: {
                                return self.settings.compare(a.value, b.value) * direction;
                                break;
                            }
                        }
                        
                    }
                    else {
                        return self.settings.compareNumber(a.cell.dataset.default_index, b.cell.dataset.default_index);
                    }
                })
                const rendertable = async (item) => {
                    setTimeout(() => {
                        for (let j = 0; j < item.length; j++) {
                            rowsContainer.append($(item[j].row));
                        }
                    }, 10);
                }

                var array = sliceIntoChunks(sortedMap, 100);
                if (array != undefined && array.length != 0) rendertable(array[0]);
                for (let i = 1; i < array.length; i++) {
                    rendertable(array[i]);
                }
                th.addClass(self.settings[self.direction]);
                self.$table.css("display");
                //if (LanguageVTT)
                //    LanguageVTT.Initialize();
               table.removeClass("sort-pending");
               if (th != undefined) th.removeClass("sort-progressing");
            }, unsortedValues.length > 2000 ? 300 : 100);
        },

        log: function (msg) {
            if (($.tablesort.DEBUG || this.settings.debug) && console && console.log) {
                console.log('[tablesort] ' + msg);
            }
        },

        destroy: function () {
            this.$sortCells.off('click.tablesort');
            this.$table.data('tablesort', null);
            return null;
        }

    };

    $.tablesort.DEBUG = false;

    $.tablesort.defaults = {
        debug: $.tablesort.DEBUG,
        asc: 'sorted ascending',
        desc: 'sorted descending',
        compareddmmyyy: function (a, b) {
 
            a=SysDate().FDTEXT(a).UTC_DateTime();
            b=SysDate().FDTEXT(b).UTC_DateTime();
            
            if (a > b) {
                return 1;
            } else if (a < b) {
                return -1;
            } else {
                return 0;
            }
        },
        compareNumber: function (a, b) {
            a = a.toString().includes(',') ? Number(a.replaceAll(',','')) :  Number(a);
            b = b.toString().includes(',') ? Number(b.replaceAll(',','')) :  Number(b);
            if (a > b) {
                return 1;
            } else if (a < b) {
                return -1;
            } else {
                return 0;
            }
        },
        comparestring: function (a, b) {
            a = a.toString();
            b = b.toString();
            if (a > b) {
                return 1;
            } else if (a < b) {
                return -1;
            } else {
                return 0;
            }
        },

        
        compare: function (a, b) {
                
            if (a > b) {
                return 1;
            } else if (a < b) {
                return -1;
            } else {
                return 0;
            }
        }
    };

    $.fn.tablesort = function (settings) {
        var table, sortable, previous;
        return this.each(function () {
            table = $(this);
            previous = table.data('tablesort');
            if (previous) {
                previous.destroy();
            }
            table.data('tablesort', new $.tablesort(table, settings));
        });
    };

})(window.Zepto || window.jQuery);


(function ($) {
    $.tablecontrol = function ($table, settings) {
        var self = this;
        this.$table = $table;
        this.$thead = this.$table.find('thead');
        this.$tbody = this.$table.find('tbody');
        this.settings = $.extend({}, $.tablecontrol.defaults, settings);
        this.$sortCells = this.$thead.length > 0 ? this.$thead.find('th.vtt-filter') : null;

        this.init();

        this.$sortCells.children('.vtt-filter-icon').on('click.tablecontrol', function (e) {
            e.preventDefault();
            e.stopPropagation();
            let _cell = $(this).parent();
            let _index = _cell.index();
            self.popup(_cell, _index);
        });
        if (this.settings.isbodysearch)
            self.bodySearch();

        this.isWatingSearch = {};
        this.index = null;
        this.$th = null;
        this.direction = null;
    };

    $.tablecontrol.prototype = {
        init: function () {
            var cell = this.$sortCells;
            let icon = `
                <div class="vtt-filter-icon start-3 position-absolute top-50 translate-middle-y text-xs cursor-pointer" >
                    <i class="fas fa-filter"></i>
                </div>
            `
            cell.each(function (index, element) {
                $(this).append(icon);
            });
        },
        bodySearch: function () {
            var self = this,
                table = this.$table,
                thead = this.$thead,
                trthead = this.$sortCells;

            $body = $('<tbody>')
            thead.after($body)  

            var clonedTbody = $('<tbody />');
            var clonedTr = $('<tr>');
            clonedTr.addClass('position-relative');
            $.each(thead[0].attributes, function (index, attribute) {
                clonedTbody.attr(attribute.name, attribute.value);
            });
            clonedTbody.addClass('bodyfilterunique border-bottom');
            thead.find('th').each(function (index) {
                var $element = $(this);
                var clonedTd = $('<td>');
                $.each($(this)[0].attributes, function (i, attr) {
                    clonedTd.attr(attr.name, attr.value);
                });
                clonedTd.addClass('position-relative');
                clonedTd.attr('data-search-index', index);
                if (!$element.hasClass("vtt-notfilter-body"))
                    clonedTd.html('<input class="border-0 form-control rounded-0 inputsearchunique" />'); // Sao chép nội dung từ th sang td
                else clonedTd.addClass('bg-gray-100');
                clonedTr.append(clonedTd);
            });

            let $itemClear = $("<div>")
            $itemClear.addClass("position-absolute start-0 text-danger cursor-pointer text-center");
            $itemClear.css({
                
            })
            $itemClear.html(`<i class="fas fa-minus-circle"></i>`);
            clonedTr.append($itemClear);
            clonedTbody.append(clonedTr);

            $body.replaceWith(clonedTbody);
            self.bodySearchTrElement = clonedTr;
            self.eventHandleClearText($itemClear);
            self.eventHandleBody(clonedTbody);
        },
        eventHandleClearText: function(ele){
            var self = this;
            ele.on('click', function(e){
                self.clearTextSearch(true);
            })
        },
        popup: function (th) {

            var self = this,
                table = this.$table
            thindex = th.index() + 1;
            let thindex1 = th.index() + 1;
            let theadall = th.parent().children('th');
            for (let j = 0; j < thindex1; j++) {
                if (theadall[j] != undefined && theadall[j].colSpan != undefined && theadall[j].colSpan > 1) {
                    thindex += (theadall[j].colSpan - 1);
                }
            }
            self.settings.thindexcurr = thindex;
            self.outClick();
            let { left, top } = th.offset();
            let _popup = document.createElement("div"),
                _popupHeader = document.createElement("div"),
                _popupBody = document.createElement("div"),
                _popupFooter = document.createElement("div");
            _popup.className = 'card z-index-sticky col-w-300 rounded-3 position-absolute text-sm p-2 pt-3 shadow-lg shadow-xl ' + self.settings.class.popup;

            if ((left + th.outerWidth()) - parseInt($("#BodyMain > .main-content").css("marginLeft")) > 350) {
                _popup.style.right = ($(window).width() - left - th.outerWidth()) + 'px';
            }
            else {
                _popup.style.left = left + 'px';
            }

            _popup.style.top = (top + th.outerHeight()) + 'px';
            _popupHeader.className = 'card-hearder py-0 px-2';
            _popupBody.className = 'card-body py-2 px-2 text-start rounded-2 max-height-250 overflow-auto';
            _popupFooter.className = 'mt-2 d-flex justify-content-end';
            _popupFooter.innerHTML = `
                    <button class="btn btn-sm badge bg-secondary ms-2 mb-0 btnfilterunique_close">Đóng</button>
                    <button class="btn btn-sm badge bg-gradient-primary ms-2 mb-0 btnfilterunique_ok">OK</button>
                `
            _popupHeader.innerHTML = `
                    <div class="mb-2">
                        <div class="input-group">
                        <input id="inputfilterunique" class="form-control" type="text" placeholder="Tìm kiếm">
                        <div class="input-group-text">
                            <i class="text-sm px-1 fas fa-sort-alpha-down cursor-pointer filteruniquesort" data-sort="asc"></i>
                            <i class="text-sm px-1 fas fa-sort-alpha-up cursor-pointer filteruniquesort" data-sort="desc"></i>
                        </div>
                    </div>

                </div>
                    <div id="filterwaiting" class="position-absolute start-50 text-center translate-middle-x waitingdiv z-index-3">
                        <div class="spinner-border text-primary" role="status">
                            <span class="sr-only">Loading...</span>
                        </div>
                    </div>
                `
            self.settings.popup = {
                table: table,
                popup: _popup,
                popupHeader: _popupHeader,
                popupBody: _popupBody,
                popupFooter: _popupFooter
            };
            _popup.append(_popupHeader);
            _popup.append(_popupBody);
            _popup.append(_popupFooter);
            $("#" + self.settings.bodyappend).append(_popup);
            self.isComplete(false);
            setTimeout(() => {
                let rowsContainer = table.children('tbody:not(".bodyfilterunique")').length > 0 ? table.children('tbody:not(".bodyfilterunique")') : table,
                    rows = rowsContainer.children('tr'),
                    cells = rows.children(':nth-child(' + thindex + ')').filter('td, th');
                self.rows = rows;
                self.eventHandle(self.settings.popup, thindex);
                if (cells.length != 0) {
                    var dataunique = self.uniqueCells(cells);
                    self.datafilter = dataunique;
                    self.settings.fillthead = self.settings.thindex[thindex] ? 0 : 1;
                    self.render(_popupBody, Object.values(dataunique));
                }
                else {
                    self.isComplete(true);
                }
            }, 10);
        },
        reRender: function (cells, _popupBody) {
            var self = this;
            var dataunique = self.uniqueCells(cells);
            self.datafilter = dataunique;
            self.render(_popupBody, Object.values(dataunique));
        },
        outClick: function () {
            var self = this;
            $(document).mouseup(function (e) {
                let popup = $(self.settings.popup.popup);
                if (!popup.is(e.target) && popup.has(e.target).length === 0) {
                    self.removePopup();
                }
            });
        },
        uniqueCells: function (cells) {
            let dataCell = {};
            cells.map((idx, cell) => {
                let nameCell = cell.textContent;
                if (nameCell == '') nameCell = '(blank)'
                if (dataCell[nameCell]) {
                    let item = dataCell[nameCell].Cell;
                    item.push(idx);
                }
                if (cell && nameCell != undefined && !dataCell[nameCell]) {
                    let e = {};
                    e.Name = nameCell
                    e.Cell = [];
                    e.Cell.push(idx);
                    dataCell[nameCell] = e;
                }
            });
            let idx = 1;
            return Object.values(dataCell)
                .sort((a, b) => { return a.Name - b.Name })
                .reduce((pre, arr) => {
                    arr.key = idx;
                    pre[idx] = arr;
                    idx++;
                    return pre;
                }, {});
        },
        render: async function (ele, data, isSearch = false) {
            setTimeout(() => {
                let self = this;
                let isChecked = self.settings.fillthead == 1 ? `checked="checked"` : '';
                let stringHeader = ``;
                let stringContent = ``;
                ele.innerHTML = '';
                if (!isSearch) {
                    stringHeader = `
                        <div class="form-check rowfilteruniqueall">
                                <input id="filterunique_0" value="0" class="filteruniqueall form-check-input pr-2" type="checkbox" ${isChecked}>
                            <label class="custom-control-label mb-0" style="vertical-align: bottom;" for="filterunique_0">${Outlang["Sys_tat_ca"]}</label>
                        </div>
                    `
                }
                else {
                    stringHeader = `
                        <div class="form-check rowfilteruniqueall">
                                <input id="filterunique_-1" value="-1" class="filterunique filteruniqueall form-check-input pr-2" type="checkbox" ${isChecked}>
                            <label class="custom-control-label mb-0" style="vertical-align: bottom;" for="filterunique_-1">
                                 Tất cả kết quả tìm kiếm
                            </label>
                        </div>
                    `
                }

                for (let i = 0; i < data.length; i++) {
                    let item = data[i];
                    let cellLength = (item.Cell).length;
                    if (item.Name == '(blank)') {
                        stringHeader += `
                            <div class="rowfilterunique form-check">
                                <input id="filterunique_${item.key}" value="${item.key}" class="filterunique form-check-input pr-2" type="checkbox" ${isChecked}>
                                <label class="custom-control-label mb-0" style="vertical-align: bottom;" for="filterunique_${item.key}">
                                        ${item.Name} <span class="text-danger">(${cellLength})</span>
                                </label>
                            </div>
                        `
                    }
                    else {
                        stringContent += `
                            <div class="rowfilterunique form-check">
                                <input id="filterunique_${item.key}" value="${item.key}" class="filterunique form-check-input pr-2" type="checkbox" ${isChecked}>
                                <label class="custom-control-label mb-0" style="vertical-align: bottom;" for="filterunique_${item.key}">
                                        ${item.Name} <span class="text-danger">(${cellLength})</span>
                                </label>
                            </div>
                        `
                    }
                }
                ele.innerHTML = stringHeader + stringContent;
                self.fillthead();
                self.isComplete(true);
                self.eventClick(ele);
            }, 10)
        },
        fillthead: function () {
            let self = this;
            if (self.settings.fillthead == 0) {
                let thfill = self.settings.thindex[self.settings.thindexcurr]
                let pupopBody = $(self.settings.popup.popupBody);
                let itemAll = pupopBody.find('#filterunique_0');
                if (thfill.includes(0)) {
                    itemAll.prop('checked', true).trigger('change');
                }
                else {
                    for (let i = 0; i < thfill.length; i++) {
                        let item = thfill[i];
                        let itemChk = pupopBody.find('.filterunique[value="' + item + '"]');
                        itemAll.parent().after($(itemChk).parent());
                        itemChk.prop('checked', true).trigger('change');
                    }
                }
                self.settings.fillthead = 1;
            }
        },
        isComplete: function (isBool = false) {
            if (isBool) {
                $("#filterwaiting").hide();
                $(".btnfilterunique_ok").prop("disabled", false)
                
            }
            else {
                $("#filterwaiting").show();
                $(".btnfilterunique_ok").prop("disabled", true)
            }
        },
        eventClick: function (ele) {
            $(ele).on('change', '.filterunique:not(.filteruniqueall)', function (e) {
                e.preventDefault();
                e.stopPropagation();
                let isChecked = $(this).is(":checked");
                if (!isChecked && $(ele).find('.filteruniqueall').is(":checked")) {
                    $(this).parent().siblings().children('.filteruniqueall').prop("checked", false);
                }
            })
            $(ele).find('.filteruniqueall').unbind('change').change(function (e) {
                e.preventDefault();
                e.stopPropagation();
                let isAll = $(this).is(":checked");
                $(this).parent().siblings().children('.filterunique').prop("checked", isAll);
            });
        },
        eventHandle: function (args, index) {
            let self = this;
            let timeOutSearch;
            $(args.popupFooter).on('click', '.btnfilterunique_ok', function (e) {
                e.preventDefault();
                e.stopPropagation();
                self.isComplete(false);
                let arr = [];
                if ($(args.popupBody).find('#filterunique_0').is(':checked')) {
                    arr.push(0);
                }
                else {
                    $(args.popupBody).find('.filterunique').each((function () {
                        if ($(this).is(':checked')) {
                            arr.push(Number($(this).val()));
                        }
                    }));
                }
                self.settings.thindex[index] = arr;
                self.filter(arr);
            });
            $(args.popupFooter).on('click', '.btnfilterunique_close', function (e) {
                e.preventDefault();
                e.stopPropagation();
                self.removePopup();
            });
            $(args.popupHeader).on('keyup', '#inputfilterunique', function (e) {
                e.preventDefault();
                e.stopPropagation();
                let input = $(this);
                clearTimeout(timeOutSearch);
                timeOutSearch = setTimeout(() => {
                    self.searchUnique();
                }, 300)
            });
            $(args.popupHeader).find('.filteruniquesort').unbind('click').on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                self.isComplete(false);
                $(this).addClass('active text-primary').siblings('.filteruniquesort').removeClass('active text-primary');
                timeOutSearch = setTimeout(() => {
                    self.searchUnique();
                }, 100);
            });
        },
        eventHandleBody: function (args, index) {
            let self = this;
            let timeOutSearch;

            $(args).on('keyup', '.inputsearchunique', function (e) {
                e.preventDefault();
                e.stopPropagation();
                let input = $(this);
                let parent = input.parent();
                let { searchIndex } = parent.data();
                self.searchWaiting(parent, false);
                clearTimeout(timeOutSearch);
                timeOutSearch = setTimeout(() => {
                    self.searchUniqueBody(self.deleteMark(input.val()), searchIndex)
                        .finally(() => {
                            self.searchWaiting(parent, true);
                        });
                }, 300)
            });

            $(args).on('focusout', '.inputsearchunique', function (e) {
                e.preventDefault();
                e.stopPropagation();
                let input = $(this);
                let parent = input.parent();
                let { searchIndex } = parent.data();
                self.isWatingSearch[searchIndex] = false;
            });

            $(args).on('focus', '.inputsearchunique', function (e) {
                e.preventDefault();
                e.stopPropagation();
                var table = self.$table;
                let input = $(this);
                let parent = input.parent();
                let { searchIndex } = parent.data();
                let rowsContainer = table.children('tbody:not(".bodyfilterunique")').length > 0 ? table.children('tbody:not(".bodyfilterunique")') : table,
                    rows = rowsContainer.children('tr');
                cells = rows.children(':nth-child(' + (searchIndex + 1) + ')').filter('td, th');
                let dataBody = {};
                cells.each(function (index, ele) {
                    let _e = {
                        element: ele,
                        parent: ele.parentNode,
                        textContent : ele.textContent,
                        textSearch: self.deleteMark(ele.textContent)
                    }
                    dataBody[index] = _e;
                });
                self.dataBodySearch = dataBody;
                self.isWatingSearch[searchIndex] = true;
            });

        },       
        clearTextSearch: function (isAll = true) {
            let self = this;
            if (isAll) {
                let tbody = this.$tbody;
                let tr = self.bodySearchTrElement;
                let input = tr.find('input.inputsearchunique');
                input.val('');

                tbody.children('tr').each(function (ind, ele) {
                    ele.style.display = ''

                })
            }
        },
        searchWaiting: function (element, isSuccess = false) {
            let self = this;
            if (element == 'undefined') return;
            if (!$(element).find('.waitingblock').length) {
                let string = `
                    <div class="waitingblock end-3 position-absolute top-50 translate-middle-y">
                        <div class="waiting z-index-3" style="border:none; height: -webkit-fill-available;">
                            <div class="ui active inverted dimmer">
                                <div class="spinner-border text-primary spinner-border-sm" role="status">
                                    <span class="sr-only">Loading...</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                element.append(string);
            }
            if (isSuccess) element.children('.waitingblock').hide();
            else element.children('.waitingblock').show();
        },
        searchUniqueBody: function (search = '', thindex) {
            return new Promise((resolve) => {
                if (thindex == undefined) return;
                var self = this,
                    cells = this.dataBodySearch;
                if (self.isWatingSearch[thindex] && cells && Object.entries(cells).length != 0) {
                    for (let [key, value] of Object.entries(cells)) {
                        if (search == '' || (value.textSearch).includes(search)) {
                            value.parent.style.display = ''
                        }
                        else {
                            value.parent.style.display = 'none'
                        }
                    }
                }
                resolve();
            });       
        },
        deleteMark: function (text = '') {
            return xoa_dau(text).trim().toLocaleLowerCase()
        },
        searchUnique: function () {

            let self = this;
            let dataFill = [];
            let popup = self.settings.popup;
            let popupHeader = $(popup.popupHeader);
            let input = popupHeader.find("#inputfilterunique");
            let isSearch = false;
            let textsearch = self.deleteMark(input.val());
            let typesort = popupHeader.find('.filteruniquesort.active').length
                ? popupHeader.find('.filteruniquesort.active').attr('data-sort')
                : 'asc';
            if (textsearch == '') {
                dataFill = Object.values(self.datafilter);
            }
            else {
                dataFill = Object.values(self.datafilter).filter((item) => {
                    return (self.deleteMark(item.Name)).includes(textsearch)
                });
                isSearch = true;
            }
            if (typesort == 'asc') {
                dataFill = dataFill.sort((a, b) => {
                    if (a.Name < b.Name) {
                        return -1;
                    }
                    if (a.Name > b.Name) {
                        return 1;
                    }
                    return 0;
                });
            }
            else {
                dataFill = dataFill.sort((a, b) => {
                    if (a.Name > b.Name) {
                        return -1;
                    }
                    if (a.Name < b.Name) {
                        return 1;
                    }
                    return 0;
                })
            }
            self.render(popup.popupBody, dataFill, isSearch);
        },
        removePopup: function () {
            let self = this;
            self.settings.popup.popup.remove();
        },
        filter: async function (arr) {
            setTimeout(() => {
                let self = this;
                if (arr.length != 0) {
                    let isCheckAll = arr.includes(0);
                    if (isCheckAll) {
                        self.rows.each((index, element) => {
                            element.style.display = "";
                        });
                    }
                    else {
                        self.rows.each((index, element) => {
                            element.style.display = "none";
                        });
                        for (let i = 0; i < arr.length; i++) {
                            let item = arr[i];
                            if (item != '-1') {
                                let { Cell } = self.datafilter[item];
                                for (let j = 0; j < Cell.length; j++) {
                                    self.rows[Cell[j]].style.display = "";
                                }
                            }
                        }
                    }
                }
                self.isComplete(true);
            }, 10)
        },
        log: function (msg) {
            if (($.tablecontrol.DEBUG || this.settings.debug) && console && console.log) {
                console.log('[tablecontrol] ' + msg);
            }
        },
        destroy: function () {
            this.$sortCells.children('.vtt-filter-icon').off('click.tablecontrol');
            this.$table.data('tablecontrol', null);
            return null;
        }
    };
    $.tablecontrol.DEBUG = false;
    $.tablecontrol.defaults = {
        bodyappend: 'BodyMainOther',
        databody: [],
        isbodysearch: false,
        debug: $.tablecontrol.DEBUG,
        asc: 'sorted ascending',
        desc: 'sorted descending',
        compare: function (a, b) {
            if (a > b) {
                return 1;
            } else if (a < b) {
                return -1;
            } else {
                return 0;
            }
        },
        popup: {},
        class: {
            popup: 'vtt-filter-popup'
        },
        thindexcurr: 0,
        thindex: {},
        fillthead: 0,
    };
    $.fn.tablecontrol = function (settings) {
        var table, sortable, previous;
        return this.each(function () {
            table = $(this);
            previous = table.data('tablecontrol');
            if (previous) {
                previous.destroy();
            }
            table.data('tablecontrol', new $.tablecontrol(table, settings));
        });
    };

})(window.Zepto || window.jQuery);
