﻿function update_cal_vtt_app (_id, _branch, date_from, type, istemp, isupdate) {
    if (_branch == data_Branch_ID && date_from >= ConvertDT_To_StringYMD_Int(data_Calendar_DateFrom)
        && date_from <= ConvertDT_To_StringYMD_Int(data_Calendar_DateTo)
    ) {
        AjaxLoad(url = "/Appointment/Appointment/?handler=LoadScheduler"
            , data = {
                'datefrom': SysDate().FUTC(new Date()).UTCText() 
                , 'dateto': SysDate().FUTC(new Date()).UTCText() 
                , 'branch': _branch
                , 'DoctorID': 0
                , 'AppID': _id
                , 'type': type
                , 'IsTemp': istemp
            }, async = true
            , error = function () {
                notiError_SW();
            }
            , success = function (result) {
                if (result != "") {
                    let _data = JSON.parse(result);
                    let data_result = callvtt_appget_each(_data);
                    if (isupdate == 1) cal_vtt_delete_app(_data[0].ID, _branch);
                    cal_vtt_insert_app(data_result);
                }
            }
        );
    }
}
function cal_vtt_Manage_Executing (json) {

    let data = JSON.parse(json);
    if (data != undefined && data.length != 0) {
        let userexcept = data.userexcept;
        if (userexcept != sys_userID_Main) {
            let type = data.type;
            let istemp = data.istemp;
            let branch_id = data.branch_id;
            let date_from = ConvertDT_To_StringYMD_Int(data.date_from);
            let appointment_id = Number(data.appointment_id);
            if (istemp == 1) appointment_id = (appointment_id < 0) ? (appointment_id) : (0 - appointment_id);
            switch (type) {
                case "cancel":
                    {
                        if (branch_id == data_Branch_ID) {
                            update_cal_vtt_app(appointment_id, branch_id, date_from, 0, istemp, 1);
                        }
                        break;
                    }
                case "delete":
                    {
                        if (branch_id == data_Branch_ID) cal_vtt_delete_app(appointment_id, branch_id);
                        break;
                    }
                case "insert":
                    {
                        update_cal_vtt_app(appointment_id, branch_id, date_from, 0, istemp, 0);
                        break;
                    }
                case "update":
                    {
                        update_cal_vtt_app(appointment_id, branch_id, date_from, 0, istemp, 1);
                        break;
                    }

                case "change_status":
                    {
                        if (branch_id == data_Branch_ID) {
                            cal_vtt_delete_app(appointment_id, branch_id);
                            update_cal_vtt_app(appointment_id, branch_id, date_from, 0, 0, 0);
                        }
                        break;
                    }
                default: break;
            }
        }
    }

}
function callvtt_appget_each (_data) {
    let _value = {};
    let _doctorid = 0, _e;
    let _m;
    let _c;
    if (_data.length > 0) {
        for (let iii = 0; iii < _data.length; iii++) {
            _e = {}
            _doctorid = _data[iii].DocID;

            let _datefrom_int = ConvertDT_To_StringYMD_Int(_data[iii].DateFrom);
            _e.ID = _data[iii].ID + ((_data[iii].DoctorMain == 0) ? '_temp' : '');
            _e.BranchName = callvtt_branch[_data[iii].BranchID];
            _e.BranchID = _data[iii].BranchID;
            _e.Color = callvtt_appget_colorapp(_data[iii].SchedulerType);
            _e.SchedulerType = _data[iii].SchedulerType;
            _e.SchedulerTypeDetail = _data[iii].SchedulerTypeDetail;
            _e.TagID = _data[iii].TagID;
            _e.ServiceID = 0;
            _e.DocID = _data[iii].DocID;
            _e.DocIDTemp = _data[iii].DocIDTemp;
            _e.DoctorMain = _data[iii].DoctorMain;
            _e.CustCode = _data[iii].CustCode;
            _e.CustCodeOld = _data[iii].CustCodeOld;
            _e.DocumentCode = _data[iii].DocumentCode;
            _e.CustName = _data[iii].CustName;
            _e.CustPhone = _data[iii].CustPhone;
            _e.DateFrom = _data[iii].DateFrom;
            _e.DateTo = _data[iii].DateTo;
            _e.IsPriority = _data[iii].IsPriority;
            _e.Service = ((Number(_data[iii].TypeService) == 1)
                ? (Fun_GetString_ByToken(DataServiceCare, _data[iii].ServiceCare))
                : (Fun_GetString_ByToken(DataService, _data[iii].ServiceTreat)));
            _e.Status = _data[iii].Status;
            _e.Cancel = _data[iii].IsCancel;
            _e.Done = _data[iii].IsDone;
            _e.Type = _data[iii].Type;
            _e.ServiceCare = _data[iii].ServiceCare;
            _e.Content = _data[iii].Content;
            _e.DateFrom_Int = _datefrom_int;
            _e.StatusName = _data[iii].StatusName;
            _e.StatusColor = _data[iii].StatusColor;
            _e.EmpCreated = _data[iii].EmpCreated;
            _e.Created = _data[iii].Created;
            if (_value[_doctorid] == undefined) {
                _m = {};
                _c = {};
                _c[_e.ID] = _e;
                _m[_datefrom_int] = _c;
                _value[_doctorid] = _m;
            }
            else {
                _m = _value[_doctorid];
                if (_m[_datefrom_int] == undefined) {
                    _c = {};
                    _c[_e.ID] = _e;
                    _m[_datefrom_int] = _c;
                    _value[_doctorid] = _m;
                }
                else {
                    _c = _m[_datefrom_int];
                    _c[_e.ID] = _e;
                    _m[_datefrom_int] = _c;
                    _value[_doctorid] = _m;
                }
            }
        }
    }

    return _value;
}

function callvtt_appget_colorapp(typeid) {
    try {
        const hexToRgb = (hex) => {
            const bigint = parseInt(hex.slice(1), 16);
            const r = (bigint >> 16) & 255;
            const g = (bigint >> 8) & 255;
            const b = bigint & 255;
            return [r, g, b];
        }
        const shadeColor = (rgb, percent) => {
            return rgb.map(color => {
                const shaded = color + Math.round((255 - color) * percent / 100);
                return Math.min(255, Math.max(0, shaded));
            });
        }
        const createGradient = (baseColor) => {
            const rgbBase = hexToRgb(baseColor);
            const lightShade = shadeColor(rgbBase, 10);
            const darkShade = shadeColor(rgbBase, -10);
            return `linear-gradient(310deg, rgb(${lightShade.join(", ")}), ${baseColor}, rgb(${darkShade.join(", ")}))`;
        }
        let itemType = data_Calender_ScheType[typeid]
        if (itemType != undefined) {
            return createGradient(itemType?.Option) ?? "white";
        }
        return "white";
    }
    catch (ex) {
        return "white"
    }
}

//#region // Setting
function callvtt_settings () {
    let obj;
    if (localstorage_check('vtt-app')) obj = JSON.parse(JSON.parse(localstorage_get('vtt-app')).data);
    else obj=callvtt_settingsdefault();
    callvtt_settingset(obj);
}
function callvtt_settingsdefault () {
    let e = {};
    e.timerange = 15;
    e.height = 25;
    e.show_app_cancel = true;
    e.show_app_temp = true;
    e.show_app_consul = true;
    e.showdoctornowork = true;
    e.show_app_treat = true;
    e.doctorarr = 'asc';
    e.typeday = 7;
    localstorage_set('vtt-app', JSON.stringify(e));
    return e;
}
function callvtt_settingsreset () {
    let obj;
    obj = callvtt_settingsdefault();
    callvtt_settingset(obj);
    callvtt_executed();
}
function callvtt_settingsaccept () {
    try {
        let e = {};
        e.timerange = Number($('#settingvttLists input[name=minutecell]:checked').val());
        e.height = Number($('#settingvttLists input[name=heightcell]:checked').val());
        e.show_app_cancel = $("#settingvttLists input[name=showcancel]").is(":checked");
        e.show_app_temp = $("#settingvttLists input[name=showtemp]").is(":checked");
        e.show_app_consul = $("#settingvttLists input[name=showconsul]").is(":checked");
        e.show_app_treat = $("#settingvttLists input[name=showtreat]").is(":checked");
        e.showdoctornowork = $("#settingvttLists input[name=showdoctornowork]").is(":checked");
        e.doctorarr = $("#settingvttLists input[name=sortdoctor]:checked").val();
        e.typeday = $("#settingvttLists input[name=typeday]:checked").val();
        localstorage_set('vtt-app', JSON.stringify(e));
        block_height = Number(e.height);
        block_time_range = Number(e.timerange);
        callvtt_isshowcancel = Number(e.show_app_cancel);
        callvtt_isshowtemp = Number(e.show_app_temp);
        callvtt_isshowconsul = Number(e.show_app_consul);
        callvtt_showdoctornowork = e.showdoctornowork;
        callvtt_isshowtreat = Number(e.show_app_treat);
        callvtt_sortdoctor = e.doctorarr;
        callvtt_typeday = e.typeday;
        callvtt_viewbydate();
        callvtt_executed();
    }
    catch (e){
    }
}
function callvtt_settingset (obj) {
    $("#settingvttLists input[name=heightcell][value=" + obj.height + "]").prop('checked', true);
    $("#settingvttLists input[name=minutecell][value=" + obj.timerange + "]").prop('checked', true);
    $('#settingvttLists input[name=showcancel]').prop('checked', obj.show_app_cancel);
    $('#settingvttLists input[name=showtemp]').prop('checked', obj.show_app_temp);
    $('#settingvttLists input[name=showconsul]').prop('checked', obj.show_app_consul);
    $('#settingvttLists input[name=showdoctornowork]').prop('checked', obj.showdoctornowork);
    $('#settingvttLists input[name=showtreat]').prop('checked', obj.show_app_treat);
    $("#settingvttLists input[name=sortdoctor][value=" + obj.doctorarr + "]").prop('checked', true);
    $("#settingvttLists input[name=typeday][value=" + obj.typeday + "]").prop('checked', true);
    block_height = Number(obj.height);
    block_time_range = Number(obj.timerange);
    callvtt_isshowcancel = Number(obj.show_app_cancel);
    callvtt_isshowtemp = Number(obj.show_app_temp);
    callvtt_isshowconsul = Number(obj.show_app_consul);
    callvtt_showdoctornowork = obj.showdoctornowork;
    callvtt_isshowtreat = Number(obj.show_app_treat);
    callvtt_sortdoctor = obj.doctorarr;
    callvtt_typeday = obj.typeday;
                                               
    if (callvtt_typeday != 1) {
        $("#settingvttLists #rowShowDoctorWork").fadeOut();
        callvtt_showdoctornowork = true;
    }
}
//#endregion

//#region // Work Scheduler

function callvtt_getdatawork(data_begin, data_end, branch, doctor) {
    return new Promise((resolve) => {
        AjaxLoad(url = "/Appointment/Appointment/?handler=LoadWorkTimeDoctor"
            , data = {
                'datefrom': SysDate().FUTC(data_begin).UTCText() 
                , 'dateto': SysDate().FUTC(data_end).UTCText() 
                , 'tokenDocID': doctor
            }
            , async = true
            , error = function () {
                resolve({
                    work: [],
                    workSchedule: []
                })
            }
            , success = function (result) {
                if (result != "0") {

                    let _data = JSON.parse(result);
                    let _work = Work_Scheduler_Get_From_TokenDoc(branch, data_begin, data_end, _data.Table, _data.Table1, _data.Table2, _data.Table3);

                    resolve({
                        work: _work,
                        workSchedule: _data.Table
                    })
                }
                else {
                    resolve({
                        work: [],
                        workSchedule: []
                    })
                }
            }
        );
    })
}

async function callvtt_setworkview (_work, _dataWS) {

    var proallcell = callvtt_worksetall(_work, _dataWS);
    Promise.allSettled([proallcell]).then(() => {
        if (_work != undefined && _work.length != 0) {
            for (let ii = 0; ii < _work.length; ii++) {
                var ele = _work[ii];
                callvtt_workseteach(ele);
            }
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

function callvtt_workseteach (e) {
    return new Promise(resolve => {
        let _df = e.Date_From;
        let _dt = e.Date_To;
        if (_df < _dt) {
            _dfh = ConvertDateTimeUTC_Time_OnlyHour_Int(_df);
            _dth = ConvertDateTimeUTC_Time_OnlyHour_Int(_dt);
            while (_dfh < _dth) {
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

//#region // Temporary Delete
//#region //Doctor Arrange
//function PopupArrange_Doctor () {
//    $("#docLists").removeClass("show");
//}
//function Render_List_Doctor_Arrange (data, id) {
//    let data_resouce = {};
//    let _source_sort = [];
//    for (i = 0; i < data.length; i++) {
//        data_resouce[data[i].ID] = data[i].NickName;
//    }
//    let indexdoctor = Get_Value_Doctor_Arrange_Cookie();
//    let data_doctor_json = indexdoctor;

//    if (indexdoctor != undefined && indexdoctor != null && indexdoctor != "") {
//        let __x = indexdoctor.split(',');
//        for (jj = 0; jj < __x.length; jj++) {
//            if (!isNaN(__x[jj]) && __x[jj].trim() != '') {
//                __key = Number(__x[jj]);
//                if (data_resouce[__key] != undefined) {
//                    let _e = {};
//                    _e.ID = __key;
//                    _e.Name = data_resouce[__key];
//                    _source_sort.push(_e);
//                }
//            }
//        }
//        indexdoctor = ',' + indexdoctor + ',';
//        for ([key, value] of Object.entries(data_resouce)) {
//            __key = ',' + key.toString() + ',';
//            if (!indexdoctor.includes(__key)) {
//                let _e = {};
//                _e.ID = __key;
//                _e.Name = data_resouce[key];
//                _source_sort.push(_e);
//                data_doctor_json += key.toString() + ',';
//            }
//        }
//        Set_Value_Doctor_Arrange_Cookie(data_doctor_json, data_Branch_ID)
//    }
//    else {
//        _source_sort = data;
//    }
//    var myNode = document.getElementById(id);
//    if (myNode != null) {
//        myNode.innerHTML = '';
//        let stringContent = '';
//        if (_source_sort && _source_sort.length > 0) {
//            for (let i = 0; i < _source_sort.length; i++) {
//                let item = _source_sort[i];

//                let tr = '<li class="d-flex item py-2 px-3"  data-id="' + item.ID + '">'
//                    + '<p class="text-sm mb-0" >' + item.Name + '</p >'
//                    + '</li >'
//                stringContent = stringContent + tr;
//            }
//        }
//        document.getElementById(id).innerHTML = stringContent;
//    }

//    Event_Sortable_Doctor_Arrange();
//}
//function Event_Sortable_Doctor_Arrange () {
//    $("#div_doctor_arrange_list").sortable({
//        items: "li.item",
//        start: function (event, ui) {
//            $(ui.helper[0]).addClass("cur_doctor");
//        },
//        stop: function (event, ui) {
//            ui.item.removeClass("cur_doctor");
//        }
//    });
//}
//function Get_Value_Doctor_Arrange () {
//    let Token_Doctor = "";
//    $("#div_doctor_arrange_list li.item").each(function () {
//        let id = $(this).attr("data-id");
//        Token_Doctor += id + ",";
//    })
//    Set_Value_Doctor_Arrange_Cookie(Token_Doctor, data_Branch_ID);
//    callvtt_branchonchange()
//    PopupArrange_Doctor();
//}
//function Reset_Value_Doctor_Arrange () {
//    try {
//        let doctor_vttapp_arrange = window.localStorage.getItem('doctor-vttapp-doc');
//        if (doctor_vttapp_arrange != undefined) {
//            window.localStorage.removeItem("doctor-vttapp-doc");
//            callvtt_branchonchange()
//            PopupArrange_Doctor();
//        }
//    }
//    catch {

//    }
//}
//function Get_Value_Doctor_Arrange_Cookie () {
//    try {
//        let obj_doc;
//        let doctor_vttapp_arrange = window.localStorage.getItem('doctor-vttapp-doc');
//        if (doctor_vttapp_arrange != undefined && doctor_vttapp_arrange != '') {
//            obj_doc = JSON.parse(doctor_vttapp_arrange);
//            return (obj_doc[data_Branch_ID] ? obj_doc[data_Branch_ID] : null);
//        } else {
//            return null;
//        }
//    }
//    catch {
//        return null;
//    }

//}
//function Set_Value_Doctor_Arrange_Cookie (_value, _branch) {
//    try {
//        let obj_doc = {};
//        let doctor_vttapp_arrange = window.localStorage.getItem('doctor-vttapp-doc');
//        if (doctor_vttapp_arrange != undefined && doctor_vttapp_arrange != '') {
//            obj_doc = JSON.parse(doctor_vttapp_arrange);
//            obj_doc[_branch] = _value;
//        }
//        else {
//            obj_doc[_branch] = _value;
//        }
//        window.localStorage.setItem('doctor-vttapp-doc', JSON.stringify(obj_doc));
//    }
//    catch {
//        localStorage.removeItem('doctor-vttapp-doc');
//    }

//}
//#endregion

//#region // Color Board Service Care
//function LoadDataColor_ServiceCare() {
//    AjaxLoad(url = "/Appointment/Appointment/?handler=LoadDataColorServiceCare"
//        , data = { }, async = true
//        , error = function () {
//            notiError_SW();
//        }
//        , success = function (result) {
//            //let data_Service_Care = JSON.parse(result).Table;
//            //let data_Service_Type = JSON.parse(result).Table1;
//            //Render_List_Color(data_Service_Care, "div_Color_Service_Care", "care");
//            //Render_List_Color(data_Service_Type, "div_Color_Service_Type", "type");
//            //Event_Checked_Choose_Filter_Service_Care();
//        }
//    );

//}
//function Render_List_Color(data, id, type) {
//    var myNode = document.getElementById(id);
//    if (myNode != null) {
//        myNode.innerHTML = '';
//        let stringContent = '';
//        if (data && data.length > 0) {
//            for (let i = 0; i < data.length; i++) {
//                let item = data[i];
//                let tr = '<a class="item" data-id="' + item.ID + '">'
//                    + '<label for="choose_item_service_' + type + '_' + item.ID + '" class="ellipsis_one_line" style="max-width:120px;line-height: 18px;" title="' + item.Name + '">'
//                    + item.Name
//                    + '</label>'
//                    + '<div class="color">'
//                    + '<div class="ui checkbox">'
//                    + '<input type="checkbox" checked="checked" name="item_service" class="choose_all_service_type" id="choose_item_service_' + type + '_' + item.ID + '" >'
//                    + '<label ><div class="checkbox_color" style="border-color:' + item.Color + ';background:' + item.Color + '"></div></label>'
//                    + '</div>'
//                    + '</div >'
//                    + '</a >'
//                stringContent = stringContent + tr;
//            }
//        }
//        document.getElementById(id).innerHTML = stringContent;
//    }
//}

//function Choose_All_Service_Care() {
//    if ($("#choose_all_service_care").is(":checked")) {
//        $('#div_Color_Service_Care input[name="item_service"]').prop("checked", true);
//    }
//    else {
//        $('#div_Color_Service_Care input[name="item_service"]').prop("checked", false);
//    }
//}
//function Choose_All_Service_Type() {
//    if ($("#choose_all_service_type").is(":checked")) {
//        $('#div_Color_Service_Type input[name="item_service"]').prop("checked", true);
//    }
//    else {
//        $('#div_Color_Service_Type input[name="item_service"]').prop("checked", false);
//    }
//}

//function Event_Checked_Choose_Filter_Service_Care() {
//    $('#div_Color_Service_Care input[name="item_service"]').change(function () {
//        let isChecked = true;
//        $('#div_Color_Service_Care input[name="item_service"]').each(function () {
//            if ($(this).is(":checked") == false) {
//                isChecked = false;
//            }
//        });
//        (isChecked)
//            ? $("#choose_all_service_care").prop("checked", true)
//            : $("#choose_all_service_care").prop("checked", false);
//    })
//    $('#div_Color_Service_Type input[name="item_service"]').change(function () {
//        let isChecked = true;
//        $('#div_Color_Service_Type input[name="item_service"]').each(function () {
//            if ($(this).is(":checked") == false) {
//                isChecked = false;
//            }
//        });
//        (isChecked)
//            ? $("#choose_all_service_type").prop("checked", true)
//            : $("#choose_all_service_type").prop("checked", false);
//    })
//}

//function Filter_Service_Care() {
//    let Token_Service_Care = "";
//    let Token_Service_Type = "";
//    $('#div_Color_Service_Care input[name="item_service"]').each(function () {
//        if ($(this).is(":checked")) {
//            let id = this.id.replace("choose_item_service_care_", "");
//            Token_Service_Care += id + ",";
//        };
//    });
//    $('#div_Color_Service_Type input[name="item_service"]').each(function () {
//        if ($(this).is(":checked")) {
//            let id = this.id.replace("choose_item_service_type_", "");
//            Token_Service_Type += id + ",";
//        };
//    })
//    Token_Service_Care = ',' + Token_Service_Care + ','
//    Token_Service_Type = ',' + Token_Service_Type + ','
//    let xx = document.getElementsByClassName('cal_app');
//    for (ii = 0; ii < xx.length; ii++) {
//        if (Number(xx[ii].dataset.schedulertype) < 2) {
//            if (!Token_Service_Care.includes(',' + xx[ii].dataset.serviceid + ',')) {
//                xx[ii].style.display = "none";
//            }
//            else {
//                xx[ii].style.display = "block";
//            }
//        }
//        else {
//            if (!Token_Service_Type.includes(',' + xx[ii].dataset.serviceid + ',')) {
//                xx[ii].style.display = "none";
//            }
//            else {
//                xx[ii].style.display = "block";
//            }
//        }
//    }
//    PopupColorBoard_ServiceCare();
//}

//function PopupColorBoard_ServiceCare() {
//    $(".divFiterdata,#ColorBoard_ServiceCare .arrow").toggleClass("active");
//}


//#endregion

//#region // Setting Calendar
//function PopupSetting_Calendar () {
//    $(".div_setting_calendar,#Setting_Calendar .arrow").toggleClass("active");
//}







//#endregion

//#region //
//function LoadComboDoctor(data, id) {
//    var myNode = document.getElementById(id);
//    if (myNode != null) {
//        myNode.innerHTML = '';
//        let stringContent = '';
//        if (data && data.length > 0) {
//            let EmpIsDoctor = data.filter(word => Number(word["ID"]) == sys_employeeID_Main);
//            if ($('#all_doctor').length <= 0 && EmpIsDoctor.length > 0) {
//                let item = EmpIsDoctor[0];
//                stringContent = '<div class="item" data-value=' + item.ID + '>' + item.NickName + '</div>';
//                data_Current_Doctor = item.ID;
//            } else {
//                for (var i = 0; i < data.length; i++) {
//                    let item = data[i];
//                    let tr =
//                        '<div class="item" data-value=' + item.ID + '>' + item.NickName + '</div>'
//                    stringContent = stringContent + tr;
//                }
//            }
//        }
//        document.getElementById(id).innerHTML = stringContent;
//    }
//}

//#endregion

//#region //
//function PopupNoteCalendar() {
//    $(".div_note_calendar,#Note_Calendar .arrow").toggleClass("active");
//}
//#endregion
//function cal_vtt_refresh_appointment () {
//    let cal_app = $(".cal_app");
//    if (cal_app.length != 0) {
//        cal_app.css({
//            "display": "block"
//        })
//    }
//}
//#endregion

//#region // Action


function callvtt_action (uid) {
    ser_AppointmentActionID = uid;
    AjaxLoad(url = "/Appointment/Appointment/?handler=LoadDataAction"
        , data = {'appointment': uid}
        , async = true
        , error = function () {notiError_SW();}
        , success = function (result) {
            if (result != "") {
                let data = JSON.parse(result);
                if (data.length > 0) {
                    callvtt_filldata(data[0]);
                    $('#vtt_master').addClass('opacity-3 pe-none');
                    $('#vtt_actiontarea').removeClass('d-none');
                }

                else
                    notiError_SW();
            } else {
                notiError_SW();
            }
        }
        , sender = null
    );
}
function callvtt_filldata (data) {
    if (data != undefined && data != null) {
        let avatar = (data.Avatar != '') ? data.Avatar : Master_Default_Pic;
        $('#Apptem_Avatar').attr('src',  avatar);
        customer_status_app = data.StatusApp;
        customer_id_app = data.CustomerID;
        $('#Apptem_CustName').html(data.CustomerName);
        $('#Apptem_Branch').html(data.BranchName);
        $('#Apptem_Content').html(data.Content);
        if (typeof DataServiceCare !== 'undefined' && typeof DataService !== 'undefined'   ) {
            $('#Apptem_Service').html(((Number(data.TypeID) == 1)
                ? (Fun_GetString_ByToken(DataServiceCare, data.ServiceCare))
                : (Fun_GetString_ByToken(DataService, data.ServiceTreat))));
        }
        $('#Apptem_Doctor').html(data.DoctorName);
        let statusName = author_isotherlang() ? data.StatusNameLangOther : data.StatusName;
        $("#Apptem_Status").html(statusName);


        customer_phone_app = data.Phone;
        if (data?.Schedule_Code != '') {
            JsBarcode("#Apptem_Code2D", data.Schedule_Code, {
                lineColor: "#3A416F",
                textMargin: 0,
                width: 1,
                height: 30,
                displayValue: false
            });
        } else {
            $("#Apptem_Code2D").html('');
        }
        $('#Apptem_Code').html(data.Cust_Code);
        //let CustCodeOld = data.CustCodeOld;
        //if(CustCodeOld!="") $("#Apptem_Code").append(CustCodeOld);
         
        $("#Apptem_DocCode").html(data.DocumentCode);

        if (data.Room != '') $("#Apptem_Room").html(data.Level + ' - ' + data.Room);
        else $("#Apptem_Room").html('');
        if (data.IsCancel != "0") {
            $('#Apptem_Cancel').html(data.ReasonCancel)
            $("#Apptem_Cancel").show();
        }
        else $("#Apptem_Cancel").hide();
        $('#Apptem_DateFrom').html(data.Time_From + ' - ' + data.Time_To + ' ' + SysDate().FUTC(data.Date_From).DDowText());
         
        let groupname=(data.GroupName!='')? data.GroupName:'no group';
        $('#Apptem_Groupname').html(groupname);
        $('#Apptem_Groupimg').attr('src',((data.ImageGroup!='')? data.ImageGroup:Master_Default_Pic));
        if (data.State != 0 && data.StatusApp == 1) {
            $("#Apptem_btnEdit").removeClass("d-none");
            $("#Apptem_btncancel").removeClass("d-none");
            $("#Apptem_btnprint").removeClass("d-none");
            $("#Apptem_btnroom").removeClass("d-none");
        }
        else {
            $("#Apptem_btnEdit").addClass("d-none");
            $("#Apptem_btncancel").addClass("d-none");
            $("#Apptem_btnprint").addClass("d-none");
            $("#Apptem_btnroom").addClass("d-none");
        }
    }
}
function Apptem_CustLink () {
    Apptem_Cancel();
    window.open("/Customer/MainCustomer?CustomerID=" + customer_id_app, '_blank');
    return false;
}
function Apptem_Print () {
    Apptem_Cancel();
    PrintTemplate(ser_AppointmentActionID, 0, 13, versionofWebApplication);
}
function Apptem_DestroyApp () {

    Apptem_Cancel();
    $("#DetailModal_Content").load("/Appointment/AppointmentCancelDetail?CurrentID=" + ser_AppointmentActionID + "&StatusID=" + customer_status_app);
    $('#DetailModal').modal('show');
    return false;
}
function Apptem_Cancel () {
    $('#vtt_master').removeClass('opacity-3 pe-none');
    $('#vtt_actiontarea').addClass('d-none');
    if (typeof DetectFormAppear !== 'undefined') {
        DetectFormAppear = 1;
    }
}
function Apptem_ChangeRoom () {
    Apptem_Cancel();
    $("#DetailModal_Content").load("/Appointment/ChangeRoom?CurrentID=" + ser_AppointmentActionID );
    $('#DetailModal').modal('show');
    return false;
}
function Apptem_Edit () {
    Apptem_Cancel();
    $("#DetailModal_Content").load("/Appointment/AppointmentDetail?CurrentID=" + ser_AppointmentActionID + "&CustomerID=" + customer_id_app );
    $('#DetailModal').modal('show');
    return false;
}
function Apptem_Sms () {
    Apptem_Cancel();
    $('#DetailModal').html('');
    $("#DetailModal_Content").load("/SMS/SmsDetail?CustomerID="
        + customer_id_app
        + "&TicketID=" + 0
        + "&Type=" + "SMSContentGeneral"
        + "&TypeCare=" + 0
        + "&AppID=" + ser_AppointmentActionID);
    $('#DetailModal').modal('show');
    return false;
}
function Apptem_Call () {
    Apptem_Cancel();
    if (typeof CCF_OutcomCall !== 'undefined' && $.isFunction(CCF_OutcomCall)) {
        CCF_OutcomCall(encrypt_phone(customer_phone_app), customer_id_app, 0, 0);
    }
}
//#endregion


//#region //Temporary Noti
function Apptem_notiExcuted(CurrentID,BranchID, DateFrom, Type) {
    AjaxLoad(url = "/Appointment/Appointment/?handler=NotiExcutedAppTemp"
        , data = {
            'CurrentID': CurrentID,
            'BranchID': BranchID,
            'UTCDateFrom': SysDate().FUTC(DateFrom).UTCText(),
            'Type': Type,
        }
        , async = true
        , error = function () { notiError_SW(); }
        , success = function (result) {
            if (result != "0") {
            } else {
                notiError_SW();
            }
        }
        , sender = null
    );
}

function Apptem_OpenTempApp(uid, branch, time, date, doctorid) {
    $("#vtt_teamporaryarea").html('');
    $("#vtt_teamporaryarea").load("/Appointment/AppointmentTemporary?CurrentID=" + uid
        + "&BranchID=" + branch
        + "&TimeFrame=" + time
        + "&DateFrom=" + date
        + "&DoctorID=" + doctorid);
    $('#vtt_master').addClass('opacity-3 pe-none');
    $('#vtt_teamporaryarea').removeClass('d-none');
}
//#endregion