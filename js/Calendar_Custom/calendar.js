﻿
(function ($) {
    $.fn.cal = function (param) {
        var base = this;
        var defaults = {
            resources: "[]",
            datestart: new Date(),
            dateend: new Date(),
            datefocus: new Date(),
            dateselected: new Date(),
            daytimestart: '08:30',
            daytimeend: '20:30',
            width: 90,
            widthtimeline: 60,
            height: 25,
            heightheader: 40,
            events: "[]",
            value: "[]",
            color_background: 'rgb(255, 255 ,255)',
            border_bottom: '1px solid rgb(236, 236, 236)',
            border_right: '1px solid rgb(236, 236 ,236)',
            border_top_hour: '1px solid #c9fffd',
            isbusy: 0,
            timerange: 15,
            colortimeline: ['#F6CEEC', '#f3def9', '#CED8F6', '#CEF6F5', '#D8F6CE', '#F7F2E0', '#F8E0E0'],
            showdoctornowork: true

        };
        var settings = $.extend({}, defaults, param);
        var timeOutRenderBlock = [];

        //#region // VT Calendar Event
        settings.resize = function (e) {
            $(".cal_app_resize").unbind('resizable').resizable({
                helper: "ui-resizable-helper",
                handles: 's',
                ghost: false,
                start: function (event, ui) {
                    _previous_obj = ui.element[0];
                    if (!_previous_obj.className.includes('cal_app_resizing'))
                        _previous_obj.className = _previous_obj.className + ' cal_app_resizing';
                },
                drag: function (event, ui) {

                },
                stop: function (event, ui) {

                    let _isSuccess = false;
                    obj = ui.element[0]
                    _status = obj.dataset.status;
                    _cancel = obj.dataset.cancel;
                    _top = ui.position.top;
                    _id_app = obj.dataset.appid
                    _id_doc = obj.dataset.doctor
                    _timeFrom = obj.dataset.timeFrom
                    _timeTo = obj.dataset.timeTo
                    _dateFrom = obj.dataset.dateFrom;
                    _doctortemp = obj.dataset.doctortemp;
                    _doctormain = obj.dataset.doctormain;

                    _max_height = callvtt_cellincolumn * block_height;
                    _old_height = ((_timeTo - _timeFrom) * block_height) / block_time_range;
                    _current_top = (_timeFrom - begin_range_int) * block_height / block_time_range
                    _bottom = _current_top + obj.clientHeight;

                    let _fixheight = 0;
                    if (_status <= 1 && _cancel == 0) {
                        let a_half = _bottom - Math.floor(_bottom / block_height) * block_height;
                        if (a_half >= (block_height / 2)) {
                            _bottom = (_bottom - a_half) + block_height
                        }
                        else _bottom = _bottom - a_half;
                        if (Number(_doctormain) == 0) _isSuccess = false;
                        else {
                            if (_bottom > _max_height) _isSuccess = false;
                            else {

                                let _in = Math.ceil(_bottom / block_height) - 1;
                                let __id = "cal_cell_" + _id_doc + "_" + _dateFrom + "_" + _in;
                                let cal_cell = $('#' + __id);
                                let _is_busy = cal_cell.attr("data-busy");
                                let _is_aval = cal_cell.attr("data-aval");
                                if (_is_busy == "0" && _is_aval == "1") {

                                    _fixheight = _bottom - _current_top;
                                    let _distanceheight = _fixheight - _old_height;

                                    let _disminute = Math.floor((_distanceheight * block_time_range) / block_height);

                                    if ((Number(_timeTo) + _disminute) - Number(_timeFrom) < 15) {
                                        _isSuccess = false;
                                    }
                                    else {

                                        const promise = notiConfirm(Outlang["Ban_chac_chan_muon_thay_doi_muc_nay"] + "?");
                                        promise.then(function () {
                                            if (settings.handleResize(_id_doc, _doctortemp, _dateFrom, _id_app, _disminute)) _isSuccess = true;
                                            else _isSuccess = false;
                                        }, function () { });
                                    }
                                }
                                else _isSuccess = false;
                            }
                        }
                    }
                    if (obj.className.includes('cal_app_resizing'))
                        obj.className = obj.className.replace(' cal_app_resizing', '');

                    if (_isSuccess) {
                        $(this).height(_fixheight)
                        return true;
                    }
                    else {
                        _fixheight = _old_height;
                        $(this).height(_fixheight)
                        return false;
                    }
                }

            });
        }
        settings.draggable = function (e) {

            $(".cal_app").unbind('draggable').draggable({

                scroll: false,
                scope: 'Box',
                //axis: "y",
                containment: "cal-time",
                revert: true,
                helper: "clone",
                disable: false,
                start: function (event, ui) {

                    _previous_obj = ui.helper.prevObject[0];
                    if (!_previous_obj.className.includes('cal_app_dragging'))
                        _previous_obj.className = _previous_obj.className + ' cal_app_dragging';
                    $(ui.helper).addClass("cal_app_draggable");
                },
                drag: function (event, ui) {

                    obj = ui.helper[0]
                    let app_id = obj.dataset.appid;
                    let _top = ui.position.top;
                    let _id_doc = obj.dataset.doctor;
                    let _dateFrom = obj.dataset.dateFrom;
                    let _in = Math.floor(_top / block_height);
                    let __id = "cal_cell_" + _id_doc + "_" + _dateFrom + "_" + _in;
                    let cal_cell = $('#' + __id)[0];

                    let elements = document.getElementsByClassName("cal-time");
                    for (let i = elements.length - 1; i >= 0; --i) {
                        if (elements[i] != undefined && elements[i].className.includes('cal_time_throwing'))
                            elements[i].className = elements[i].className.replace(' cal_time_throwing', '');
                    }

                    if (cal_cell != undefined && !cal_cell.className.includes('cal_time_throwing'))
                        cal_cell.className = cal_cell.className + ' cal_time_throwing';

                    $("#canvasline").remove();
                    let cal_temp = $("#cal_app_" + app_id + '_temp');
                    if (cal_temp.length > 0) {
                        let cal_left = ui.position.left;
                        let cal_top_temp = cal_temp.position().top
                        let _height_distance = 50;
                        let cal_index = Number($(cal_cell).parent().attr("data-index"));
                        let cal_temp_index = Number(cal_temp.parent().attr("data-index"));
                        let index = cal_index - cal_temp_index;
                        let cell_width = $(cal_cell).innerWidth();
                        let cal_doc = $(cal_cell).closest('.cal_time_doctor');
                        let _top_canvas = _top - _height_distance - ((_top - cal_top_temp > 0) ? (_top - cal_top_temp) : 0);
                        let _heght_canvas = _height_distance + Math.abs(cal_top_temp - _top);
                        let _width_canvas = (Math.abs(index) + 1) * cell_width;
                        let line = $('<canvas id="canvasline" width="' + _width_canvas + '" height="' + _heght_canvas + '"></canvas>');
                        line.css({
                            "position": "absolute",
                            "top": _top_canvas + 'px',
                            "left": (((cal_index > cal_temp_index) ? cal_temp_index : cal_index) - 1) * cell_width,
                            "z-index": 1000
                        })
                        cal_doc.append(line);

                        let doc_width = $(cal_cell).innerWidth();

                        let canvas_line_height_left = _height_distance + ((_top - cal_top_temp > 0) ? (_top - cal_top_temp) : 0)
                        let canvas_line_height_right = _height_distance + ((cal_top_temp - _top < 0) ? 0 : cal_top_temp - _top);

                        let x1 = ((index < 0) ? ((doc_width / 2) + (cal_left / 2)) : (doc_width / 2));
                        let x2 = ((index < 0) ? (_width_canvas - (doc_width / 2)) : ((_width_canvas - (doc_width / 2)) + (cal_left / 2)));

                        let y1 = 20;
                        let y2 = ((index < 0) ? canvas_line_height_left : canvas_line_height_right)
                        let y3 = ((index < 0) ? canvas_line_height_right : canvas_line_height_left);
                        settings.createLineCanvas(x1, x2, y1, y2, y3);

                    }
                },
                stop: function (event, ui) {

                    $(ui.helper).removeClass("cal_app_draggable");
                    //$(this).remove();
                }
            });
        }
        settings.droppable = function (e) {
            $(".cal_time_column").unbind('droppable').droppable({
                accept: ".cal_app",
                scope: 'Box',
                class: {
                    "ui-droppable-active": "ac",
                    "ui-droppable-hover": "hv"
                },
                acivate: function (event, ui) {
                },
                drop: function (event, ui) {
                    $("#canvasline").remove();
                    let _isSuccess = false;
                    obj = ui.helper[0]
                    _status = obj.dataset.status;
                    _cancel = obj.dataset.cancel;
                    _top = ui.position.top;
                    _id_app = obj.dataset.appid
                    _id_doc = obj.dataset.doctor
                    _doctortemp = obj.dataset.doctortemp;
                    _doctormain = obj.dataset.doctormain;

                    _timeFrom = obj.dataset.timeFrom
                    _timeTo = obj.dataset.timeTo
                    _dateFrom = obj.dataset.dateFrom
                    _in = Math.floor(_top / block_height);

                    if (_status <= 1 && _cancel == 0 && Number(_doctormain) == 1) {
                        let __id = "cal_cell_" + _id_doc + "_" + _dateFrom + "_" + _in;
                        let cal_cell = $('#' + __id);

                        let _is_busy = cal_cell.attr("data-busy");
                        let _is_aval = cal_cell.attr("data-aval");
                        if (_is_busy == "0" && _is_aval == "1") {
                            const promise = notiConfirm(Outlang["Ban_chac_chan_muon_thay_doi_muc_nay"] + "?");
                            promise.then(function () {
                                if (settings.handleMove(_id_doc, _doctortemp, _dateFrom, _id_app, _in)) _isSuccess = true;
                                else _isSuccess = false;
                            }, function () { });
                        }

                        if (!_isSuccess) {
                            _previous_obj = ui.helper.prevObject[0];
                            if (_previous_obj.className.includes('cal_app_dragging'))
                                _previous_obj.className = _previous_obj.className.replace('cal_app_dragging', '');
                        }
                        let elements = document.getElementsByClassName("cal-time");
                        for (let i = elements.length - 1; i >= 0; --i) {
                            if (elements[i] != undefined && elements[i].className.includes('cal_time_throwing'))
                                elements[i].className = elements[i].className.replace(' cal_time_throwing', '');
                        }
                        return _isSuccess;
                    }
                    else return false;
                },
                deactivate: function (event, ui) {
                    _previous_obj = ui.draggable[0];
                    if (_previous_obj != undefined && _previous_obj.className.includes('cal_app_dragging'))
                        _previous_obj.className = _previous_obj.className.replace('cal_app_dragging', '');
                    return false;
                },
            });
        }
        settings.removeNote = function (e) {
            $(".cal_app_note_remove").unbind('click').on("click", function (e) {
                let _id = Number($(this).attr("data_id"));
                let _doc = Number($(this).attr("data_doc"));
                let _date = Number($(this).attr("data_date"));

                const promise = notiConfirm();
                promise.then(function () {settings.handleDelete(_id, _doc, _date);}, function () { });

            })
        }
        settings.hoverApp = function (e) {
            //#region //  Hover Lịch Hẹn
            $(".cal_app").unbind("mouseenter").on("mouseenter", function () {
                //close popup type
                let $cal_popup_type = $("#cal_popup_type");
                $cal_popup_type.css({
                    "top": 0,
                    "left": 0,
                    "z-index": 0,
                    "opacity": 0,
                    "display": "none"
                });

                let $cal_popup = $("#cal_popup");
                let $cal_popup_content = $("#cal_popup_content");
                let _doctor_id = $(this).attr("data-doctor");
                let _app_id = $(this).attr("data-appid");
                let _date_app = $(this).attr("data-date-from");

                //Content Popup
                let data_value = settings.value
                let value_item = data_value[_doctor_id][_date_app][_app_id];

                let content = "";
                if (value_item && value_item != undefined) {
                    content = settings.contentPopup(value_item);
                }
                $cal_popup_content.html(content);
                if (typeof settings.eventShowPopup === 'function') {
                    settings.eventShowPopup(_app_id);
                }
                //calculator Popup
                let cal = $(settings.Calendar);
                let cal_top = cal.offset().top
                let cal_left = cal.offset().left

                let cal_scroll_top = cal.scrollTop();
                let cal_scroll_left = cal.scrollLeft();

                let _app_offset = $(this).offset();
                let _app_top = _app_offset.top;
                let _app_left = _app_offset.left;
                let _app_height = $(this).outerHeight(true);
                let _app_width = $(this).outerWidth(true);
                let _popup_width = $cal_popup.outerWidth(true);
                let _popup_height = $cal_popup.outerHeight(true);

                let _height_col = $(this).parent(".cal_time_column").outerHeight(true);
                let _app_offset_top = $(this)[0].offsetTop;

                if (_height_col - _app_offset_top - _app_height < 0) {
                    _app_height = _height_col - _app_offset_top;
                }

                let _app_class = "left";
                let _top = _app_top + cal_scroll_top - cal_top - ((_popup_height - _app_height) / 2);
                let _left = _app_left - cal_left + _app_width + cal_scroll_left + 10;
                let _leftTemp = _left
                if ($(window).outerWidth(true) - _app_width - _app_left < _popup_width) {
                    _left = _left - _app_width - _popup_width - 20;
                    _app_class = "right";
                }
                if ((_top < 0 || ($(window).height() - _app_top - _app_height < _popup_height))
                    && !$(window).outerWidth(true) - _app_width - _app_left < _popup_width) {
                    _app_class = "top"
                    _top = _app_top + cal_scroll_top + _app_height - cal_top + 10;
                    _left = _app_left - cal_left + cal_scroll_left - ((_popup_width - _app_width) / 2);

                    if ($(window).height() - _app_top - _app_height < _popup_height) {
                        _top = _top - _popup_height - _app_height - 20;
                        _app_class = "bottom";
                    }
                }

                $cal_popup.css({
                    top: _top,
                    left: _left,
                    "z-index": 11111,
                    "opacity": 1,
                    "display": "block"
                })

                switch (_app_class) {
                    case "left":
                        $cal_popup.addClass("left").removeClass("right top bottom");
                        break;
                    case "right":
                        $cal_popup.addClass("right").removeClass("left top bottom");
                        break;
                    case "top":
                        $cal_popup.addClass("top").removeClass("left right bottom");
                        break;
                    case "bottom":
                        $cal_popup.addClass("bottom").removeClass("left right top");
                        break;
                    default:
                        break;
                }

                _app_id = _app_id.replace('_temp', '');

                let cal_app = $("#cal_app_" + _app_id);
                let cal_app_temp = $("#cal_app_" + _app_id + '_temp');
                if (cal_app_temp.length > 0) {
                    let cal_top = cal_app.position().top;
                    let cal_top_temp = cal_app_temp.position().top;
                    let cal_left = cal_app.position().left;
                    let _height_distance = 50;
                    let cal_index = Number(cal_app.parent().attr("data-index"));
                    let cal_temp_index = Number(cal_app_temp.parent().attr("data-index"));
                    let index = cal_index - cal_temp_index;
                    let cell_width = cal_app.parent().innerWidth();
                    let divide = cell_width / cal_left;
                    let cal_doc = cal_app.closest('.cal_time_doctor');
                    let _top_canvas = cal_top - _height_distance
                    let _heght_canvas = _height_distance + Math.abs(cal_top_temp - cal_top);
                    let _width_canvas = (Math.abs(index) + 1) * cell_width;
                    let line = $('<canvas id="canvasline" width="' + _width_canvas + '" height="' + _heght_canvas + '"></canvas>');
                    let left_line = ((cal_index > cal_temp_index) ? cal_temp_index : cal_index) - 1;
                    line.css({
                        "position": "absolute",
                        "top": _top_canvas + 'px',
                        "left": left_line * cell_width,
                        "z-index": 1000
                    })
                    cal_doc.append(line);

                    let canvas_line_height_left = _height_distance + ((cal_top - cal_top_temp > 0) ? (cal_top - cal_top_temp) : 0)
                    let canvas_line_height_right = _height_distance + ((cal_top_temp - cal_top < 0) ? 0 : cal_top_temp - cal_top);

                    let x1 = ((index < 0) ? ((cell_width / 2)) : (cell_width / 2)) + (cal_left / divide);
                    let x2 = ((index < 0) ? (_width_canvas - (cell_width / 2)) : ((_width_canvas - (cell_width / 2))));

                    let y1 = 20;
                    let y2 = ((index < 0) ? canvas_line_height_left : canvas_line_height_right)
                    let y3 = ((index < 0) ? canvas_line_height_right : canvas_line_height_left);
                    settings.createLineCanvas(x1, x2, y1, y2, y3);

                }
            })
                .unbind("mouseleave").on("mouseleave", function () {
                    let $cal_popup = $("#cal_popup");
                    $cal_popup.css({
                        "top": 0,
                        "left": 0,
                        "z-index": 0,
                        "opacity": 0,
                        "display": "none"
                    });
                    $("#canvasline").remove();
                });
            //#endregion
        }
        settings.onClickDetail = function (e) {
            $(".cal_app").unbind('dblclick').on("dblclick", function () {
                let Calendar_Value = settings.value;
                let _doctor_id = $(this).attr("data-doctor")
                let _app_id = Number($(this).attr("data-appid").replace("_temp", ""));
                let _date_app = $(this).attr("data-date-from");
                let data_time = Calendar_Value[_doctor_id][_date_app][_app_id];
                if (typeof settings.eventDetail === 'function') {
                    return settings.eventDetail(_app_id, data_time);
                }
            })
        }
        settings.onClickBox = function (e) {
            $(".cal-time").unbind('dblclick').on("dblclick", function (e) {
                let doctorid = $(this).attr("data-doctorid");
                let timebegin = Number($(this).attr("data-time"));
                let is_busy = $(this).attr("data-aval");
                let date = $(this).closest(".cal-week").attr("data-date");
                let obj = {
                    "resource": doctorid,
                    "date": date,
                    "time": Convert_Hour_Time_Int_To_Time(timebegin)
                }
                if (is_busy == 1) {
                    if (typeof settings.eventClick !== 'undefined' && $.isFunction(settings.eventClick)) {
                        return settings.eventClick(obj);
                    }
                }
            })
        }
        settings.callEventHandle = async function (e) {
            new Promise((resolve, reject) => {
                setTimeout(() => {
                    settings.resize();
                    settings.draggable();
                    settings.droppable();
                    settings.removeNote();
                    settings.hoverApp();
                    settings.onClickDetail();
                    settings.onClickBox();
                    if (typeof ToolPopper === 'function') ToolPopper();
                }, 100)
            });
        }
        //#endregion

        //#region // VT Calendar Render Data
        settings.render = function (item_value) {
            let showcancel = settings.showcancel;
            let showtemp = settings.showtemp;
            let showconsul = settings.showconsul;
            let showtreat = settings.showtreat;

            let _dateint = ConvertDT_To_StringYMD_Int(item_value.DateFrom);
            let range_hour_from = Convert_Hour_Time_To_Int(settings.daytimestart);
            let range_hour_to = Convert_Hour_Time_To_Int(settings.daytimeend);
            let isshow = 1;
            if (item_value != undefined) {

                if (showcancel == 0 && item_value.Cancel == 1) isshow = 0;
                else if (showtemp == 0 && Number(item_value.ID) <= 0) isshow = 0;
                else if (showconsul == 0 && item_value.SchedulerType == 1) isshow = 0;
                else if (showtreat == 0 && item_value.SchedulerType == 2) isshow = 0;
                if (isshow == 1) {
                    let _id_column = 'cal_time_column_' + item_value.DocID + '_' + _dateint;
                    let objcolum = document.getElementById(_id_column);

                    if (typeof (objcolum) != 'undefined' && objcolum != null) {
                        let _i_b = objcolum.getAttribute("data-begin_date");
                        let date_from_num = ConvertDateTimeUTC_Time_OnlyHour_Int(item_value.DateFrom);
                        let date_to_num = ConvertDateTimeUTC_Time_OnlyHour_Int(item_value.DateTo);
                        if (date_from_num >= range_hour_from && date_from_num <= range_hour_to) {
                            let _h = (date_to_num - date_from_num) * settings.height / settings.timerange;
                            let _t = (date_from_num - _i_b) * settings.height / settings.timerange;

                            let data_ele_app = {
                                TimeFrom: date_from_num,
                                TimeTo: date_to_num,
                                Top: _t,
                                Left: 0,
                                Width: settings.width,
                                Height: _h,
                                ...item_value
                            }
                            settings.Apprender(objcolum, data_ele_app);
                        }
                    }
                    else {

                    }
                }
            }
        }
        settings.Apprender = function (objcolum, _data) {
            let appointment = document.createElement("div");
            appointment.id = "cal_app_" + _data.ID;
            appointment.style.position = "absolute";
            appointment.style.top = _data.Top + "px"
            appointment.style.left = _data.Left + "px";
            appointment.style.width = _data.Width + "px";
            appointment.style.height = _data.Height + "px";
            appointment.className = 'cal_app ' + ((_data.ID < 0) ? ' cal_temp ' : '') + ' cal_app_resize';

            appointment.setAttribute("data-appid", _data.ID);
            appointment.setAttribute("data-time-from", _data.TimeFrom);
            appointment.setAttribute("data-status", _data.Status);
            appointment.setAttribute("data-cancel", _data.Cancel);
            appointment.setAttribute("data-done", _data.Done);
            appointment.setAttribute("data-date-from", ConvertDT_To_StringYMD_Int(_data.DateFrom));
            appointment.setAttribute("data-time-to", _data.TimeTo);
            appointment.setAttribute("data-doctortemp", _data.DocIDTemp);
            appointment.setAttribute("data-doctormain", _data.DoctorMain);
            appointment.setAttribute("data-doctor", _data.DocID);
            appointment.setAttribute("data-serviceid", _data.ServiceID);
            appointment.setAttribute("data-schedulertype", _data.SchedulerType);
            appointment.setAttribute("data-temp", ((_data.ID > 0) ? 0 : 1));

            //Noi dung hien thi
            let appointment_content = document.createElement("div");
            settings.ApprenderEXE(_data, function (_content) {
                appointment_content.innerHTML = _content;
                appointment.append(appointment_content.firstChild);
                objcolum.append(appointment);
            });

        }
        settings.ApprenderEXE = function (_data, callback) {
            //new Promise((resolve, reject) => {
            //    setTimeout(() => {

            let _classextend = '';
            let text_cell = settings.text_cell_default;
            let _Temp = (_data.ID < 0) ? 1 : 0;
            let _Status = _data.Status;
            let _Current = (ConvertDT_To_StringYMD_Int(_data.DateFrom) == ConvertDT_To_StringYMD_Int(new Date())) ? 1 : 0;
            let _hint = '', _remove = '', _contentbody = '', _time = '', _tag = "";
            let _cancel = '';
            let _classnametype = '';
            if (_Temp == 1) {
                _remove = `<i class="fa fa-times cal_app_note_remove" data_id="${_data.ID}" data_doc="${_data.DocID}" data_date="${ConvertDT_To_StringYMD_Int(_data.DateFrom)}"></i>`
                _classextend = 'cal_app_content_temp'
            }
            else {
                if (_data.Cancel == 1) {
                    _classextend = 'cal_app_content_cancel_op';
                    _cancel = '<div class="cal_app_content_cancel"></div>';
                }
                else {
                    let isHint = 0;
                    if (_Status > 1 && _Current == 1) {
                        isHint = 1;
                        if (_data.Done == 0)
                            _hint = `<div class="cal_app_content_hint cal_app_content_current" data-bs-toggle="tooltip" title="Check-in" data-bs-placement="left"></div>`;
                        else
                            _hint = `<i class="cal_app_content_hint cal_app_content_done" data-bs-toggle="tooltip" title="Done" data-bs-placement="left"></i>`;
                    }
                    _classnametype = (_data.SchedulerType == 1) ? "cal_app_content_service" : "cal_app_content_treatment";
                    _tag = _data.TagID != '' ? settings.ApprenderEXE_Tag(_data.TagID, isHint) : "";
                }
                if (_data.DoctorMain == 0) {
                    _classextend = 'cal_app_content_copy';
                }
            }
            _time = `<div class="cal_app_content_time" style="color:${text_cell}">${SysDate().FUTC(_data.DateFrom).TimeText()} - ${SysDate().FUTC(_data.DateTo).TimeText()}</div>`;
            _contentbody = `<div class="cal_app_content_body"  style="color:${text_cell}">${_data.CustName}</div>`;
            let _content = `<div class="cal_app_content ${_classnametype} ${_classextend} " style="background-image:${_data.Color}">
                    ${_remove}${_cancel}${_hint}${_tag}${_time}${_contentbody}</div>`
            callback(_content);
            //        resolve();
            //    })
            //});
        }
        settings.ApprenderEXE_Tag = function (TagID, isHint) {
            try {
                let result = '';
                let dataTag = TagID.split(',');
                if (dataTag && dataTag.length != 0) {
                    let classIsHint = isHint == 0 ? 'no-hint' : '';
                    result = '<div class="cal_app_content_typedetail ' + classIsHint + '" >__Tag__</div>';
                    let contentTag = '';
                    for (let i = 0; i < dataTag.length; i++) {
                        let tagid = dataTag[i];
                        if (data_Calender_Tag && data_Calender_Tag[tagid] != undefined) {
                            let obj = data_Calender_Tag[tagid];

                            contentTag += '<i  data-bs-toggle="tooltip" data-bs-placement="left" title="' + obj.Name + '" class="' + obj.Icon + '" style="color: ' + obj.ColorCode + '"></i>'
                        }
                    }
                    result = result.replace('__Tag__', contentTag);
                }
                return result;
            }
            catch (ex) {
                return '';
            }
        }
        settings.renderByDate = function (_date) {

            let Calendar_Value = settings.value;
            if (Object.values(Calendar_Value).length > 0) {
                let _value_child;
                let data_date = Convert_DateInt_To_StringYMD(_date);
                if ($('.cal-week[data-date=' + data_date + ']').length)
                    $('.cal-week[data-date=' + data_date + ']').attr("data-isrender", "1");
                if (timeOutRenderBlock && timeOutRenderBlock.length != 0) {
                    timeOutRenderBlock.forEach(clearTimeout);
                    timeOutRenderBlock = [];
                }
                var promises = [];
                for ([keym, valuem] of Object.entries(Calendar_Value)) {
                    _value_child = valuem;
                    promises.push(Render_1Col(keym, _value_child, _date));
                }
                Promise.all(promises).then((values) => {
                    //if ($('.cal-week[data-date=' + data_date + ']').length) $('.cal-week[data-date=' + data_date + ']').attr("data-isrender", "1");
                });
            }
        }
        async function Render_1Col (keym, _value_child, _date) {
            new Promise((resolve, reject) => {
                timeOutRenderBlock.push(
                    setTimeout(() => {
                        for ([_key, _value] of Object.entries(_value_child)) {
                            if (_key == _date) {
                                var promises = [];
                                for ([_key_c, _value_c] of Object.entries(_value)) {
                                    settings.render(_value_c);

                                }
                                settings.renderDevideColumn(keym, _key);
                            }
                        }
                        resolve();
                    })
                );
            });
        }
        settings.RenderUpdate_1Col = function (_keydoc, _keydates) {
            let Calendar_Value = settings.value;
            let _col = "cal_time_column_" + _keydoc + "_" + _keydates;
            $('#' + _col).find('.cal_app').remove();
            var promises = [];
            for ([_key_c, _value_c] of Object.entries(Calendar_Value[_keydoc][_keydates])) {
                promises.push(settings.render(_value_c));
            }
            Promise.all(promises).then((values) => {
                settings.renderDevideColumn(_keydoc, _keydates);
                settings.callEventHandle();
            });

        }
        settings.renderDevideColumn = function (keydoc, keydate) {
            new Promise((resolve, reject) => {
                setTimeout(() => {
                    let _data = settings.value[keydoc][keydate];
    
                    let sortable = [];
                    for ([key, value] of Object.entries(_data)) {
                        let e = {};
                        e.mauso = 1;
                        e.tuso = 0;
                        e.id = value.ID;
                        e.parent = '';
                        e.block = 0;
                        e.min = ConvertDateTimeUTC_Time_OnlyHour_Int(value.DateFrom);
                        e.max = ConvertDateTimeUTC_Time_OnlyHour_Int(value.DateTo);
                        e.doctormain = value.DocID;
                        sortable.push(e);
                    }
                    sortable.sort(function (a, b) {
                        return a.min - b.min;
                    });
                    let max = 100000000000000;
                    let currentblock = 0;
                    let arrayblock = [];
                    for (let q = 0; q < sortable.length; q++) {
                        if (sortable[q].min >= max || q == 0) {
                            currentblock++;
                            arrayblock.push(currentblock)
                        }
                        sortable[q].block = currentblock;
                        max = (max < sortable[q].max || q == 0) ? sortable[q].max : max;
                    }
                    var promisesCol = [];
                    for (let q = 0; q < arrayblock.length; q++) {
                        var ob = sortable.filter(function (event) {
                            return event.block == arrayblock[q];
                        });
                        if (ob.length > 1) {
                            promisesCol.push(executeddevice(ob));

                        }
                        else {
                            promisesCol.push(executefull(ob));
                        }
                    }
                    Promise.all(promisesCol).then((values) => {
                        settings.callEventHandle();
                    });
                }, 10)
            });
        }
        function executefull (arr) {
            return new Promise(resolve => {
                let __id;
                if (arr[0].doctormain == 0) __id = "cal_app_" + arr[0].id + "_temp";
                else __id = "cal_app_" + arr[0].id;
                let calitem = document.getElementById(__id);
                if (calitem) {
                    document.getElementById(__id).style.left = 0 + "%";
                    document.getElementById(__id).style.width = 100 + "%";
                }
                resolve(true);
            });


        }
        function executeddevice (arr) {
            return new Promise(resolve => {
                let as2D = {};
                as2Dval = [0]
                for (let q = 0; q < arr.length; q++) {
                    as2D[arr[q].min] = [0];
                    as2D[arr[q].max] = [0];
                }
                for (let q = 0; q < arr.length; q++) {

                    let result = isfoe(as2D, arr[q].min, arr[q].max, arr[q].id);
                    if (result == 0) {
                        for (const [key, value] of Object.entries(as2D)) {
                            value.push(0);
                        }

                        isfoe(as2D, arr[q].min, arr[q].max, arr[q].id);
                    }

                }
                cssexedevice(as2D, arr);
                resolve(true);
            });


        }
        function isfoe (as2D, min, max, id) {
            let numob = 0, lenob = Object.keys(as2D).length;
            let _begin = -1;
            let _block = -1;

            for (const [key, value] of Object.entries(as2D)) {
                numob++;
                let frcolin = '';
                if (key >= min && key <= max) {
                    if (numob != lenob) {
                        frcolin = findfoe(value);
                        if (frcolin == '-') {
                            return 0;
                        }
                        let frbegin = Number(frcolin.split('-')[0]);
                        let frblock = Number(frcolin.split('-')[1]);

                        let re = isfoecheck(_begin, _block, frbegin, frblock)
                        _begin = Number(re.split('-')[0]);
                        _block = Number(re.split('-')[1]);
                    }

                }

            }
            if (_begin == -1) return 0;
            else {

                for (const [key, value] of Object.entries(as2D)) {
                    if (key >= min && key < max) {
                        upfoe(value, _begin, _block, id)
                    }
                }
                return 1;
            }

        }
        function isfoecheck (becu, blcu, bene, blne) {
            if (becu == -1) return bene + '-' + blne;
            if (becu == bene) {
                if (blcu > blne) return bene + '-' + blne;
                else return becu + '-' + blcu;
            }
            if (becu > bene) return becu + '-' + blcu;
            else return bene + '-' + blne;
        }
        function findfoe (as) {
            let stop = 0;
            let begin = 0;
            for (let i = 0; i < as.length; i++) {
                if (stop != 1) {
                    if (as[i] == 0) {
                        stop = 1;
                        begin = i + 1;
                    }

                }
            }
            if (begin == 0) {
                return '-';
            } else {
                let index = 0;
                stop = 0;
                for (let i = begin - 1; i < as.length; i++) {
                    if (stop != 1) {
                        if (as[i] != 0) stop = 1;
                        else index++;
                    }
                }
                return begin + '-' + index;
            }
        }
        function upfoe (as, begin, block, id) {
            let ii = 1;
            for (let i = begin - 1; i < as.length; i++) {
                if (ii <= block) {
                    as[i] = id;
                    ii++;
                }
            }
        }
        function cssexedevice (as2D, arr) {
            let numlength = 0;
            for (let q = 0; q < arr.length; q++) {
                let fid = arr[q].id;

                let fnnum_inrow = 0;
                let fnindex_inrow = -1;
                for ([key, value] of Object.entries(as2D)) {
                    let num_inrow = 0;
                    let index_inrow = -1;
                    for (let i = 0; i < value.length; i++) {
                        if (value[i] == fid) {
                            index_inrow = (index_inrow != -1) ? index_inrow : i;
                            num_inrow++;
                        }
                    }
                    numlength = value.length;
                    fnnum_inrow = (fnnum_inrow == 0) ? num_inrow : fnnum_inrow;
                    fnindex_inrow = (fnindex_inrow == -1) ? index_inrow : fnindex_inrow;
                }
                let __id;
                if (arr[q].doctormain == 0) __id = "cal_app_" + arr[q].id + "_temp";
                else __id = "cal_app_" + arr[q].id;
                let width = (100 / numlength) * fnnum_inrow;
                let left = (100 / numlength) * fnindex_inrow;
                let calitem = document.getElementById(__id);
                if (calitem) {
                    document.getElementById(__id).style.left = left + "%";
                    document.getElementById(__id).style.width = width + "%";
                }
            }

        }
        //#endregion

        //#region // VT EVENT ON GRID
        settings.onClickDate = function (e) {
            $(".step_by_date").unbind('click').on("click", function () {
                let date = $(this).attr("data-date");
                let $date_week = $('.cal-week[data-date="' + date + '"]');
                if ($date_week.length > 0) {
                    if (input_date && input_date != undefined) {
                        let keydate = YMD_Str_To_DateTime(date.replaceAll("-", ''));
                        input_date.setDate(keydate, false);
                    }
                    let top = $date_week.attr("data-top");
                    $('#cal-container').scrollTop(top);
                    if (typeof settings.eventChangeDate !== 'undefined' && $.isFunction(settings.eventChangeDate)) {
                        settings.eventChangeDate();
                    }
                }
            })
        }
        settings.onClickFirstDate = function (e) {
            let DateFocus = settings.datefocus;
            let _d = ConvertDT_To_StringYMD(DateFocus);
            settings.dateselected = DateFocus;

            let step_date = $('.cal-week[data-date="' + _d + '"]');
            if (step_date.length != 0) {
                let top = step_date.attr("data-top");
                $('#cal-container').scrollTop(top);
                $('.step_by_date[data-date="' + _d + '"]').click();
                $("#cal-container").trigger("scroll");
            } else {
                $('.step_by_date')[0].click();
            }
            if (typeof settings.eventChangeDate !== 'undefined' && $.isFunction(settings.eventChangeDate)) {
                settings.eventChangeDate();
            }
        }
        settings.onScrollByDate = function (e) {
            let timerScroll;
            let cal_container = $("#cal-container");
            let cal_container_height = cal_container.outerHeight();
            cal_container.scroll(() => {
                if (timerScroll) clearTimeout(timerScroll);
                timerScroll = setTimeout(() => {
                    let cal_Scroll = cal_container.scrollTop();
                    $(".cal-week").each(function (index, ele) {
                        let _top = Number($(this).attr("data-top"));
                        let _height = Number($(this).outerHeight());
                        let _height_block = _height + _top;
                        let _date = $(this).attr("data-date");
                        let _isRender = Number($(this).attr("data-isrender"));
                        let _isInBlock = _height_block - cal_Scroll;
                        let _height_scroll = cal_Scroll + _height;
                        if (((cal_Scroll >= _top) && (cal_Scroll <= _height_block) && ((_isInBlock > 0) && (_isInBlock > Math.floor(cal_container_height / 2))))
                            ||
                            ((cal_Scroll < _top) && (_height_scroll > _top) && ((((_height_scroll + _height) - _top) > Math.floor(cal_container_height / 2))))
                        ) {
                            let step_date = $('.step_by_date[data-date="' + _date + '"]');
                            if (step_date.length != 0) {
                                let color = step_date.children(".span_dof").attr("data-color");
                                let parent = step_date.parent(".step")
                                parent.siblings('.step').children(".step_by_date").removeAttr('style')
                                $('.step_by_date').removeAttr('style');
                                step_date.css({
                                    "background-image": "linear-gradient(130deg ," + color + "1f," + color + "8c)"
                                })
                                let keydate = YMD_Str_To_DateTime(_date.replaceAll("-", ''));
                                settings.dateselected = keydate;                                 ;
                                if (input_date && input_date != undefined) {
                                    input_date.setDate(keydate, false);
                                }
                                if (typeof settings.eventScroll !== 'undefined' && $.isFunction(settings.eventScroll)) {
                                    settings.eventScroll(keydate, _isRender);
                                }
                                if (typeof settings.eventChangeDate !== 'undefined' && $.isFunction(settings.eventChangeDate)) {
                                    settings.eventChangeDate(keydate);
                                }
                            };
                            return false;
                        }
                    })
                }, 30);
            });
        }
        settings.onAddOffsetTop = function (e) {
            $(".cal-week").each(function () {
                let cal_top = $(settings.Calendar).offset().top;
                let height_header = settings.height;
                let date_top = $(this).offset().top
                $(this).attr("data-top", date_top - height_header - cal_top - 16);
            })
        }
        settings.onHoverRow = function (e) {
            $(".cal-timeline-item").hover(
                function () {
                    let index = Number($(this).attr("data-index"));
                    let parent = $(this).parent();
                    let parent_time_doctor = parent.siblings(".cal_time_doctor");
                    let col = parent_time_doctor.find(".cal_time_" + index);
                    col.addClass("focus");
                }, function () {
                    let index = Number($(this).attr("data-index"));
                    let parent = $(this).parent();
                    let parent_time_doctor = parent.siblings(".cal_time_doctor");
                    let col = parent_time_doctor.find(".cal_time_" + index);
                    col.removeClass("focus");
                }
            );
        }
        settings.onScrollMove = function (e) {
            let $cal = $("#cal-container")
            $("#cal_move_scroll_right").on("click", function () {
                let _pos_left = $cal.scrollLeft();
                $cal.animate({
                    scrollLeft: _pos_left + 1000
                }, 500);
            })
            $("#cal_move_scroll_left").on("click", function () {
                $cal.animate({
                    scrollLeft: 0
                }, 500);
            })
        }
        settings.onClickChangeWeek = function (e) {
            $("#PriviousDateCalendar").unbind('click').on("click", function () {
                if (typeof settings.onClickPrevDate !== 'undefined' && $.isFunction(settings.onClickPrevDate)) {
                    return settings.onClickPrevDate();
                }
            })

            $("#NextDateCalendar").unbind('click').on("click", function () {
                if (typeof settings.onClickNextDate !== 'undefined' && $.isFunction(settings.onClickNextDate)) {
                    return settings.onClickNextDate();
                }
            })
        }
        settings.callEventGrid = function (e) {
            settings.onAddOffsetTop(); // Thêm data-top cho mỗi block ngày
            settings.onClickDate(); // Click Ngày
            settings.onScrollByDate(); // Scroll từng ngày
            settings.onScrollMove(); // Click scroll trái phải lịch hẹn
            settings.onClickFirstDate(); // Click Ngày Đầu tiên Khi Render Xong
            settings.onHoverRow();  // Hover 1 dòng Theo Giờ
            settings.onClickChangeWeek(); // Thay  đỗi ngày
        }
        //#endregion



        //#region // VT POPUP && VT CANVAS LINE &&  VT Sort
        settings.createPopup = async function (cal) {
            new Promise((resolve, reject) => {
                setTimeout(() => {
                    //Popup Info Calendar
                    let popup = document.createElement("div");
                    popup.id = "cal_popup";
                    popup.className = 'card bg-gradient-primary position-absolute text-sm p-2 pt-3 shadow-lg cal_popup';
                    popup.style.opacity = 0;
                    popup.style.top = 0;
                    popup.style.left = 0;
                    popup.style.zIndex = 0;
                    popup.style.display = "none";
                    let popup_content = document.createElement("div");
                    popup_content.id = "cal_popup_content";
                    popup.append(popup_content);

                    //Popup Type Calendar
                    let popup_type = document.createElement("div");
                    popup_type.id = "cal_popup_type";
                    popup_type.className = 'cal_popup_type';
                    popup_type.style.opacity = 0;
                    popup_type.style.top = 0;
                    popup_type.style.left = 0;
                    popup_type.style.zIndex = 0;
                    popup_type.style.display = "none";

                    let popup_content_type = document.createElement("div");
                    popup_content_type.id = "cal_popup_content_type";
                    popup_type.append(popup_content_type);

                    cal.append(popup);
                    cal.append(popup_type);
                    resolve();
                }, 100)
            });
        }

        settings.contentPopup = function (val) {
            let result = `<div class="text-start">
                    <div class="row px-2">
                        <div class="fw-bold col-12 col-sm-4 p-1">
                             ${val.CustCode}
                        </div>
                        <div class="border-start border-success col-12 col-sm-8 p-1 ps-2">
                            ${val.CustName}
                        </div>
                    </div>
                    <hr class="horizontal bg-white my-1">
                    ${val.CustCodeOld != ''
                    ?
                    `
                        <div class="row px-2">
                            <div class="fw-bold col-12 col-sm-4 p-1">
                                 ${Outlang["Ma_khach_hang_cu"]}
                            </div>
                            <div class="border-start border-success col-12 col-sm-8 p-1  ps-2">
                                ${val.CustCodeOld}
                            </div>
                        </div>

                        <hr class="horizontal bg-white my-1">
                       `
                    : ``
                }

                    <div class="row px-2">
                        <div class="fw-bold col-12 col-sm-4 p-1">
                            ${Outlang["So_dien_thoai"]}
                        </div>
                        <div class="border-start border-success col-12 col-sm-8 p-1 ps-2 _tab_control_"  data-tab="phone_customer">
                            ${val.CustPhone}
                        </div>
                    </div>
                    <hr class="horizontal bg-white my-1">
                    <div class="row px-2">
                        <div class="fw-bold col-12 col-sm-4 p-1">
                            ${Outlang["Ngay"]}
                        </div>
                        <div class="border-start border-success col-12 col-sm-8 p-1  ps-2">
                            ${SysDate().FUTC(val.DateFrom).DateText() + '  ' + SysDate().FUTC(val.DateFrom).TimeText24() + ' - ' + SysDate().FUTC(val.DateTo).TimeText24() }
                        </div>
                    </div>
                    <hr class="horizontal bg-white my-1">
                    <div class="row px-2">
                        <div class="fw-bold col-12 col-sm-4 p-1">
                           ${Outlang["Dich_vu"]}
                        </div>
                        <div class="border-start border-success col-12 col-sm-8 p-1  ps-2">
                            ${val.Service}
                        </div>
                    </div>
                    <hr class="horizontal bg-white my-1">
                    <div class="row px-2">
                        <div class="fw-bold col-12 col-sm-4 p-1">
                            ${Outlang["Noi_dung"]}
                        </div>
                        <div class="border-start border-success col-12 col-sm-8 p-1  ps-2">
                            ${val.Content}
                        </div>
                    </div>
                    <hr class="horizontal bg-white my-1">
                    <div class="row px-2">
                        <div class="fw-bold col-12 col-sm-4 p-1">
                            ${Outlang["Bac_si"]}
                        </div>
                        <div class="border-start border-success col-12 col-sm-8 p-1  ps-2">
                            ${Fun_GetName_ByID(DataEmployee, val.DocID) + ' ' + Fun_GetName_ByID(DataEmployee, val.DocIDTemp)}
                        </div>
                    </div>
                    <hr class="horizontal bg-white my-1">
                    <div class="row px-2">
                        <div class="fw-bold col-12 col-sm-4 p-1">
                            ${Outlang["Nguoi_tao"]}
                        </div>
                        <div class="border-start border-success col-12 col-sm-8 p-1  ps-2">
                            ${Fun_GetName_ByID(DataEmployee, val.EmpCreated)}
                            <div>${SysDate().FUTC(val.Created).DTText()} </div>
                        </div>
                    </div>
                </div>`

            return result;
        }
        settings.createLineCanvas = function (x1, x2, y1, y2, y3) {
            var canvas = document.getElementById('canvasline');
            var ctx = canvas.getContext('2d');

            ///Đường kẻ ngang
            ctx.beginPath();
            ctx.strokeStyle = '#ca2121';
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y1);
            ctx.lineWidth = 2;
            ctx.stroke();

            //Đường kẻ đứng bên trái
            ctx.beginPath();
            ctx.strokeStyle = '#ca2121';
            ctx.moveTo(x1, y1);
            ctx.lineTo(x1, y2);
            ctx.lineWidth = 2;
            ctx.stroke();

            //Đường kẻ đứng bên Phải
            ctx.beginPath();
            ctx.strokeStyle = '#ca2121';
            ctx.moveTo(x2, y1);
            ctx.lineTo(x2, y3);
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        settings.sortByCookie = function (data_resouce) {
            let _source_sort = [];
            for ([key, value] of Object.entries(data_resouce)) {
                let _e = {};
                _e.ID = key;
                _e.Name = value;
                _source_sort.push(_e);
            }
            if (settings.sortkey != undefined && settings.sortkey == 'desc') {
                _source_sort = _source_sort.sort((a, b) => {
                    if (a.Name < b.Name) {return 1;}
                    if (a.Name > b.Name) {return -1;}
                    return 0;
                })
            }
            else {
                _source_sort = _source_sort.sort((a, b) => {
                    if (a.Name < b.Name) {return -1;}
                    if (a.Name > b.Name) {return 1;}
                    return 0;
                })
            }
            return _source_sort;
        }
        //#endregion

        //#region // Draw Grid
        settings.DrawHeader = function (cal) {

            let _source_sort = settings.resources;
            if (_source_sort.length > 0) {
                let length_resouce = _source_sort.length;
                let header_container = document.createElement("div");
                header_container.className = "header_container blur shadow-blur";
                let empty_box = document.createElement("div");
                empty_box.className = "header_container_box";
                empty_box.style.width = settings.widthtimeline + "px";
                empty_box.style.height = settings.heightheader + "px";
                header_container.append(empty_box);

                let cal_header_container = document.createElement("div");
                cal_header_container.className = "cal_header_container";
                cal_header_container.style.display = "flex";
                cal_header_container.style.width = "calc( 100% - " + settings.widthtimeline + "px )";
                header_container.append(cal_header_container);


                for (ii = 0; ii < _source_sort.length; ii++) {
                    if (_source_sort[ii] != undefined) {
                        let item = _source_sort[ii].Name;
                        let obj = Fun_GetObject_ByID(DataEmployee, _source_sort[ii].ID);
                        let avatar = obj.Avatar ? obj.Avatar : Avatar;
                        let header = document.createElement("div");

                        header.innerHTML =
                            `<div>
                            <img src="${avatar}" class="avatar avatar-xs mx-1" alt="avatar image">
                        </div>
                        <div class="d-flex flex-column justify-content-center text-start">
                            <span class="mb-0 text-sm ellipsis_one_line">${item}</span>
                        </div>`;

                        header.style.minWidth = settings.width + "px";
                        header.style.width = ((1 / length_resouce) * 100) + "%";
                        header.style.height = settings.heightheader + "px";
                        header.style.justifyContent = "center";
                        header.style.lineHeight = settings.height + "px";
                        header.setAttribute("data-id", _source_sort[ii].ID);
                        header.className = "cal_header";
                        cal_header_container.append(header);
                    }
                }
                cal.append(header_container);
            }
        }
        settings.DrawButtonStep = function (step) {
            let step_privious = document.createElement("div");
            step_privious.className = "step";
            step_privious.innerHTML =
                `<div id="PriviousDateCalendar" class="number true">
                    <i class="imgGrid text-gradient text-primary fas fa-angle-up"></i>
                </div>`;
            step.prepend(step_privious);
            //Button time step Next
            let step_next = document.createElement("div");
            step_next.className = "step disabled";
            step_next.innerHTML =
                `<div id="NextDateCalendar" class="number true">
                    <i class="imgGrid text-gradient text-primary  fas fa-angle-down"></i>
                 </div>`;
            step.append(step_next);

            let scroll_div = document.createElement("div");
            scroll_div.style.width = "100%";
            scroll_div.style.display = "flex";
            scroll_div.style.height = "50px";
            scroll_div.style.zIndex = "2";
            step.append(scroll_div);


            //Button scroll move left
            let scroll_move_left = document.createElement("div");
            scroll_move_left.className = "arrowed";
            scroll_move_left.innerHTML = `<div class="arrowed_left" id="cal_move_scroll_left"><i class="text-gradient text-primary fas fa-caret-left"></i></div>`;
            scroll_div.append(scroll_move_left);

            //Button scroll move right
            let scroll_move_right = document.createElement("div");
            scroll_move_right.className = "arrowed";
            scroll_move_right.innerHTML = `<div class="arrowed_right" id="cal_move_scroll_right"><i class="text-gradient text-primary fas fa-caret-right"></i></div>`;
            scroll_div.append(scroll_move_right);
        }
        settings.DrawBoxDate = function (steps, date_resource, color) {
            let step=document.createElement('div');
        
            step.innerHTML =
                `<div class="step">
                <div class="number false step_by_date" data-date="${ConvertDT_To_StringYMD(date_resource)}">
                    <span class="span_dof" data-color="${color}">${SysDate().FUTC(date_resource).DayText()}</span>
                    <p class="span_date">${SysDate().FUTC(date_resource).DOWText()}</p>
                </div>
             </div>`;

            steps.append(step.firstChild);
        }
        settings.DrawTimeLine = function (cal_container, color, date) {
            let Time_info = document.createElement("div");
            Time_info.id = "cal_timeinfo_" + ConvertDT_To_StringYMD(date);
            Time_info.innerHTML = SysDate().FUTC(date).DDowText();
            Time_info.className = "cal-timeinfo";

            let Time_line = document.createElement("div");
            Time_line.className = "cal-timeline";
            Time_line.style.width = settings.widthtimeline + "px";
            Time_line.style.minWidth = settings.widthtimeline + "px";

            let hour_from = Convert_Hour_Time_To_Int(settings.daytimestart);
            let hour_to = Convert_Hour_Time_To_Int(settings.daytimeend);
            let TimeRange = settings.timerange;
            let index = 1;
            for (let _time = hour_from; _time <= hour_to; _time += TimeRange) {
                var promises = [];
                promises.push(rendereachTimeLine(Time_line, _time, color, index));
                index++;
            }
            Promise.all(promises).then((values) => {

            });
            cal_container.append(Time_info);
            cal_container.append(Time_line);
        }
        function rendereachTimeLine (Time_line, _time, color, index) {
            return new Promise(resolve => {
                let time_text = Convert_Int_To_Hour_Time(_time);
                let time = document.createElement("div");
                time.style.height = settings.height + "px";
                time.style.borderLeft = "3px solid " + color + '26';
                time.style.background = 'linear-gradient(to right, ' + color + '12, ' + color + '24)';
                time.setAttribute("data-index", index);
                time.className = "cal-timeline-item";
                time.innerHTML = time_text;
                Time_line.append(time);
                resolve(true);

            });
        }
        settings.renderColumnCell = async function (cal_time, _date_resource) {
            new Promise((resolve, reject) => {
                let _source_sort = settings.resources;
                let length_resouce = _source_sort.length;
                let _date = ConvertDT_To_StringYMD_Int(_date_resource);
                if (length_resouce > 0) {
                    var promises = [];
                    for (iii = 0; iii < length_resouce; iii++) {
                        promises.push(rendereachColumnCell(cal_time, _source_sort[iii].ID, _date, length_resouce, iii));
                    }
                    Promise.all(promises).then((values) => {
                        if (ConvertDT_To_StringYMD_Int(settings.datefocus) == _date) {
                            settings.renderByDate(_date);
                            settings.callEventHandle();
                        }
                    });
                }
            });
        }
        function rendereachColumnCell (cal_time, ccid, _date, length_resouce, iii) {
            return new Promise(resolve => {
                setTimeout(() => {
                    let _id = ccid + '_' + _date;
                    let hour_from = Convert_Hour_Time_To_Int(settings.daytimestart);
                    let hour_to = Convert_Hour_Time_To_Int(settings.daytimeend);
                    let time_range = settings.timerange;
                    let cal_time_column = document.createElement("div");
                    cal_time_column.classList.add("cal_time_column");
                    cal_time_column.id = "cal_time_column_" + _id;
                    cal_time_column.setAttribute("data-resouce", ccid);
                    cal_time_column.setAttribute("data-date", _date);
                    cal_time_column.setAttribute("data-begin_date", hour_from);
                    cal_time_column.setAttribute("data-index", iii + 1);
                    cal_time_column.style.minWidth = settings.width;
                    cal_time_column.style.position = "relative";
                    cal_time_column.style.width = ((1 / length_resouce) * 100) + "%";
                    let index = 0;
                    callvtt_cellincolumn = 0;
                    for (let _time = hour_from; _time <= hour_to; _time += time_range) {
                        let time_data = _time;
                        let time = document.createElement("div");
                        time.id = 'cal_cell_' + ccid + '_' + _date + '_' + index;
                        index = index + 1;
                        callvtt_cellincolumn = callvtt_cellincolumn + 1;
                        time.className = "cal-time cal_time_" + index;
                        if (_time % 60 == 0) {
                            time.style.width = "100%";
                            time.style.height = settings.height + 'px';
                            time.style.borderBottom = settings.border_bottom;
                            time.style.borderTop = settings.border_top_hour;
                            time.style.borderRight = settings.border_right;
                            time.style.cursor = "pointer";
                            time.style.backgroundImage = "linear-gradient(310deg," + settings.color_background + "," + settings.color_background + "8c)";
                        }
                        else {
                            time.style.width = "100%";
                            time.style.height = settings.height + 'px';
                            time.style.borderBottom = settings.border_bottom;
                            time.style.borderRight = settings.border_right;
                            time.style.cursor = "pointer";
                            time.style.backgroundImage = "linear-gradient(310deg," + settings.color_background + ", " + settings.color_background + "8c)";
                        }

                        time.setAttribute("data-time", time_data);
                        time.setAttribute("data-doctorid", ccid);
                        time.setAttribute("data-aval", 1);
                        time.setAttribute("data-busy", settings.isbusy);
                        cal_time_column.append(time);
                    }
                    cal_time.append(cal_time_column);
                    resolve(true);
                })
            });
        }
        async function callvtt_setworkview (_work, _dataWS) {

            var proallcell = callvtt_worksetall(_work, _dataWS);
            Promise.all([proallcell]).then(() => {
                var promiseseach = [];
                if (_work != undefined && _work.length != 0) {
                    for (let ii = 0; ii < _work.length; ii++) {
                        var ele = _work[ii];
                        promiseseach.push(callvtt_workseteach(ele));
                    }
                    Promise.all(promiseseach).then((values) => {

                    });
                }
            });
        }
        async function callvtt_worksetall (_work, _dataWS) {
            return new Promise(resolve => {
                let _x = document.getElementsByClassName("cal-time");
                if ((_work != undefined && _work.length != 0) || (_dataWS != undefined && _dataWS.length != 0)) {
                    for (let i = 0; i < _x.length; i++) {
                        _x[i].style.backgroundColor = callvtt_cellnowork;
                        _x[i].dataset.aval = 0;
                    }
                }
                resolve(true);
            });
        }
        async function callvtt_workseteach (e) {
            return new Promise(resolve => {
                let _df = e.Date_From;
                let _dt = e.Date_To;
                if (_df < _dt) {
                    _dfh = ConvertDateTimeUTC_Time_OnlyHour_Int(_df);
                    _dth = ConvertDateTimeUTC_Time_OnlyHour_Int(_dt);
                    while (_dfh <= _dth) {
                        __index = Math.floor((_dfh - begin_range_int) / block_time_range);
                        if (__index >= 0) {
                            __id = 'cal_cell_' + e.EmpID + '_' + e.Date + '_' + __index;
                            $("#" + __id).attr("data-aval", 1);
                            $("#" + __id).css("background-color", callvtt_cellwork);
                        }
                        _dfh = _dfh + block_time_range
                    }
                }
                resolve(true);

            });

        }
        //#endregion

        //#region // VT Handle Operations
        settings.handleResize = function (keydoc, keydoctem, keydates, _id, _disminute) {
            let Calendar_Value = settings.value;
            if (Calendar_Value != undefined) {
                if (Calendar_Value[keydoc] != undefined) {
                    let data = Calendar_Value[keydoc][keydates];
                    if (data[_id] != undefined) {
                        let idapp = "cal_app_" + _id;
                        if ($('#' + idapp).length) {
                            let _app = $('#' + idapp);
                            __to_hour = HHMM_Int_To_Hour(_app.attr('data-time-to'));
                            __to_minute = HHMM_Int_To_Minute(_app.attr('data-time-to'));
                            _to = YMD_Str_To_DateTime(keydates).addHours(__to_hour);
                            _to = _to.addMinutes(__to_minute + _disminute);

                            __from_hour = HHMM_Int_To_Hour(_app.attr('data-time-from'));
                            __from_minute = HHMM_Int_To_Minute(_app.attr('data-time-from'));
                            _from = YMD_Str_To_DateTime(keydates).addHours(__from_hour);
                            _from = _from.addMinutes(__from_minute);

                            if (settings.handleChange(_id, _from, _to, keydoc)) {
                                Calendar_Value[keydoc][keydates][_id].DocID = keydoc;
                                Calendar_Value[keydoc][keydates][_id].DateFrom = _from;
                                Calendar_Value[keydoc][keydates][_id].DateTo = _to;
                                Calendar_Value[keydoc][keydates][_id].DateFrom_Int = ConvertDT_To_StringYMD_Int(_from);
                                Calendar_Value[keydoc][keydates][_id].FromInt = ConvertDateTimeUTC_Time_OnlyHour_Int(_from);
                                Calendar_Value[keydoc][keydates][_id].ToInt = ConvertDateTimeUTC_Time_OnlyHour_Int(_to);
                                if (keydoctem != 0) {
                                    _id = _id + '_temp';
                                    Calendar_Value[keydoctem][keydates][_id].DocID = keydoctem;
                                    Calendar_Value[keydoctem][keydates][_id].DateFrom = _from;
                                    Calendar_Value[keydoctem][keydates][_id].DateTo = _to;
                                    Calendar_Value[keydoctem][keydates][_id].DateFrom_Int = ConvertDT_To_StringYMD_Int(_from);
                                    Calendar_Value[keydoctem][keydates][_id].FromInt = ConvertDateTimeUTC_Time_OnlyHour_Int(_from);
                                    Calendar_Value[keydoctem][keydates][_id].ToInt = ConvertDateTimeUTC_Time_OnlyHour_Int(_to);
                                    settings.RenderUpdate_1Col(keydoctem, keydates);
                                }
                                settings.RenderUpdate_1Col(keydoc, keydates);
                                settings.value = Calendar_Value;
                                return true;
                            }
                        }
                    }
                }
            }
            return false;
        }
        settings.handleMove = function (keydoc, keydoctem, keydates, _id, _in) {
            let Calendar_Value = settings.value;
            if (Calendar_Value != undefined) {
                if (Calendar_Value[keydoc] != undefined) {
                    let data = Calendar_Value[keydoc][keydates];
                    if (data[_id] != undefined) {
                        let idcell = "cal_cell_" + keydoc + "_" + keydates + "_" + _in;
                        let idapp = "cal_app_" + _id;
                        if ($('#' + idapp).length) {
                            let _app = $('#' + idapp);

                            _data_time_from = _app.attr('data-time-from');
                            _data_time_to = _app.attr('data-time-to');
                            _hour_dis = HHMM_Int_To_Hour(Number(_data_time_to - _data_time_from));
                            _minute_dis = HHMM_Int_To_Minute(Number(_data_time_to - _data_time_from));

                            if ($('#' + idcell).length) {
                                let _cell = $('#' + idcell);
                                _data_time = _cell.attr('data-time');
                                _hour = HHMM_Int_To_Hour(Number(_data_time));
                                _minute = HHMM_Int_To_Minute(Number(_data_time));
                                _from = YMD_Str_To_DateTime(keydates).addHours(_hour);
                                _from = _from.addMinutes(_minute);

                                _to = YMD_Str_To_DateTime(keydates).addHours(_hour + _hour_dis);
                                _to = _to.addMinutes(_minute + _minute_dis);
                                if (settings.handleChange(_id, _from, _to, keydoc)) {
                                    Calendar_Value[keydoc][keydates][_id].DocID = keydoc;
                                    Calendar_Value[keydoc][keydates][_id].DateFrom = _from;
                                    Calendar_Value[keydoc][keydates][_id].DateTo = _to;
                                    Calendar_Value[keydoc][keydates][_id].DateFrom_Int = ConvertDT_To_StringYMD_Int(_from);
                                    Calendar_Value[keydoc][keydates][_id].FromInt = ConvertDateTimeUTC_Time_OnlyHour_Int(_from);
                                    Calendar_Value[keydoc][keydates][_id].ToInt = ConvertDateTimeUTC_Time_OnlyHour_Int(_to);
                                    if (keydoctem != 0) {
                                        _id = _id + '_temp';
                                        Calendar_Value[keydoctem][keydates][_id].DocID = keydoctem;
                                        Calendar_Value[keydoctem][keydates][_id].DateFrom = _from;
                                        Calendar_Value[keydoctem][keydates][_id].DateTo = _to;
                                        Calendar_Value[keydoctem][keydates][_id].DateFrom_Int = ConvertDT_To_StringYMD_Int(_from);
                                        Calendar_Value[keydoctem][keydates][_id].FromInt = ConvertDateTimeUTC_Time_OnlyHour_Int(_from);
                                        Calendar_Value[keydoctem][keydates][_id].ToInt = ConvertDateTimeUTC_Time_OnlyHour_Int(_to);
                                        settings.RenderUpdate_1Col(keydoctem, keydates);
                                    }
                                    settings.RenderUpdate_1Col(keydoc, keydates);
                                    settings.value = Calendar_Value;
                                    return true;
                                }
                            }
                        }
                    }
                }
            }
            return false;
        }
        settings.handleDelete = function (__id, __doc, __date) {
            AjaxLoad(url = "/Appointment/Appointment/?handler=DeleteNote"
                , data = {'id': __id}, async = true
                , error = function () {
                    notiError_SW();
                }
                , success = function (result) {
                    if (result != "0") {
                        let id_ = result;
                        let Calendar_Value = settings.value;
                        delete Calendar_Value[__doc][__date][id_];
                        settings.RenderUpdate_1Col(__doc, __date);
                    }
                    else {
                        notiError_SW();
                    }
                }
            );
            return true;
        }
        settings.handleChange = function (__id, __datefrom, __dateto, __docid) {
            AjaxLoad(url = "/Appointment/Appointment/?handler=UpdateScheduler"
                , data = {
                    'datefrom': SysDate().FUTC(__datefrom).UTCText()   
                    ,'dateto': SysDate().FUTC(__dateto).UTCText()   
                    , 'id': __id
                }, async = true
                , error = function () {
                    notiError_SW();
                }
                , success = function (result) {
                    if (result === "0") notiError_SW();
                }
            );
            return true;
        }
        //#endregion

        //#region // VT INIT
        settings.initializationCalendar = function () {
            let calendar = $(settings.Calendar).get(0);

            if (typeof (calendar) !== 'undefined' && calendar !== null) {
                calendar.innerHTML = "";
                let calendar_container = document.createElement("div");
                calendar_container.id = "calendar_container";
                calendar_container.style.display = "flex";
                calendar_container.style.height = "100%";

                //Cột thay đổi tuần
                let calendar_time_step = document.createElement("div");
                calendar_time_step.id = "calendar_time_step";
                calendar_container.append(calendar_time_step);

                //container week
                let cal_week_container = document.createElement("div");
                cal_week_container.id = "cal-container";
                cal_week_container.className = "cal-week-container scrollbar-gutter-y scrollbar-gutter-x";
                cal_week_container.style.width = "calc(100% - 60px)";
                cal_week_container.style.height = "100%";
                cal_week_container.style.overflow = "auto";
                cal_week_container.style.display = "grid";
                let _source_sort = settings.resources; 
                if (settings.showdoctornowork === false
                    && settings.showdate == 1
                    && _source_sort && _source_sort.length > 1
                    && settings.doctorwork
                    && settings["doctorwork"]["work"]
                    && settings["doctorwork"]["work"].length != 0) {
                    let dataWork = settings["doctorwork"]["work"];
                    for (let kk = _source_sort.length - 1; kk >= 0; kk--) {
                        let isWork = dataWork.reduce((pre, arr) => {
                            if (arr.EmpID && arr.EmpID == _source_sort[kk].ID && arr.IsWork == 1) pre++;
                            return pre;
                        }, 0)
                        if (isWork == 0) _source_sort.splice(kk, 1);
                    }
                }

                calendar_container.append(cal_week_container)
                settings.DrawHeader(cal_week_container);
                calendar.append(calendar_container);

                let Distant_In_Days = Caculator_Date(settings.datestart, settings.dateend);
                let date_resource = new Date(settings.datestart.getTime());
                let colortimeline = settings.colortimeline;
                let promiseLayouts = [];

                for (let _i = 0; _i < Distant_In_Days; _i++) {
                    let promiseLayout = settings.DrawLayout(_i, cal_week_container, calendar_time_step, colortimeline[_i], date_resource);
                    promiseLayouts.push(promiseLayout);
                    date_resource.setDate(date_resource.getDate() + 1);
                }
                Promise.all(promiseLayouts).then(() => {
                    settings.DrawButtonStep(calendar_time_step);
                    settings.callEventGrid();
                    if (typeof settings.onComplete === 'function') settings.onComplete();

                })
                settings.createPopup(calendar);
            }
        }
        settings.DrawLayout = async function (index, cal_week_container, calendar_time_step, colortimeline, date_resource) {
            await new Promise((resolve, reject) => {
                let color_time_line = ((colortimeline != undefined) ? colortimeline : "#fff")
                let cal_container = document.createElement("div");
                cal_container.className = 'cal-week';
                cal_container.id = "DoctorCalendar_" + (index + 1);
                cal_container.setAttribute("data-date", ConvertDT_To_StringYMD(date_resource));
                cal_container.setAttribute("data-isrender", 0);
                cal_container.style.borderTop = "30px solid";
                cal_container.style.borderImageSource = "linear-gradient(to right," + color_time_line + "1f, " + color_time_line + "8c)";
                cal_container.style.borderImageSlice = "1";

                settings.DrawTimeLine(cal_container, color_time_line, date_resource);

                //box thời gian
                let cal_time = document.createElement("div");
                cal_time.className = 'cal_time_doctor';
                cal_time.style.width = "calc( 100% - " + settings.widthtimeline + "px )";
                cal_time.setAttribute("data-date", ConvertDT_To_StringYMD(date_resource));
                cal_container.append(cal_time);
                cal_week_container.append(cal_container);
                settings.renderColumnCell(cal_time, new Date(date_resource));
                settings.DrawBoxDate(calendar_time_step, date_resource, color_time_line);
                resolve(true);
            })
        }
        base.init = function () {
            settings.Calendar = this;
            settings.initializationCalendar();
        };
        base.init();
        //#endregion

        //#region Update Cal Object
        var cal = {
            getSettings: settings,
            insert: function (_d) {
                if (_d != undefined && Object.values(_d).length > 0) {
                    let Calendar_Value = settings.value;
                    let _begin = ConvertDT_To_StringYMD_Int(settings.datestart);
                    let _end = ConvertDT_To_StringYMD_Int(settings.dateend);
                    for ([keymain, valuemain] of Object.entries(_d)) {

                        let _key_doc = keymain;
                        let _value_doc = valuemain;

                        let _key_date = Object.keys(_value_doc)[0];
                        let _value_date = _value_doc[_key_date];
                        if (_key_date >= _begin && _key_date <= _end) {
                            let _key_app = Object.keys(_value_date)[0];
                            let _value_app = _value_date[_key_app];
                            if (Calendar_Value[_key_doc] != undefined && Calendar_Value[_key_doc][_key_date] != undefined) {
                                Calendar_Value[_key_doc][_key_date][_key_app] = _value_app;
                            }
                            else {
                                let _dateobj = {};
                                _dateobj[_key_date] = _value_date;
                                Calendar_Value[_key_doc] = _dateobj;
                            }
                            settings.value = Calendar_Value;
                            settings.RenderUpdate_1Col(_key_doc, _key_date);
                        }
                    }
                }
            },
            delete: function (_id) {
                let _idtemp = _id + '_temp';
                let _keydoc = "", _key_date = "";
                let Calendar_Value = settings.value;
                for ([k1, v1] of Object.entries(Calendar_Value)) {
                    for ([k2, v2] of Object.entries(v1)) {
                        if (v2[_id] != undefined) {
                            _keydoc = k1;
                            _key_date = k2;
                            delete v2[_id];
                            settings.RenderUpdate_1Col(_keydoc, _key_date);

                        }
                        if (v2[_idtemp] != undefined) {
                            _keydoc = k1;
                            _key_date = k2;
                            delete v2[_idtemp];
                            settings.RenderUpdate_1Col(_keydoc, _key_date);

                        }
                    }
                }
                settings.value = Calendar_Value;
            }
        };
        //#endregion
        return cal;
    };
})(jQuery)