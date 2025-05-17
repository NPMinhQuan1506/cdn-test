//dd/MM/yyyy : d/m/Y
//dd-MM-yyyy : d-m-Y
//dd.MM.yyyy : d.m.Y
var syspciker_format = "d-m-Y";
switch (Master_DateFormat) {
    case "dd/MM/yyyy": {
        syspciker_format = "d/m/Y";
        break;
    }
    case "dd-MM-yyyy": {
        syspciker_format = "d-m-Y";
        break;
    }
    case "dd.MM.yyyy": {
        syspciker_format = "d.m.Y";
        break;
    }
}
function Sys_Picker(selector, enableTime, options = {}) {
    if (enableTime) {
        return $(selector).flatpickr({
            dateFormat: `${syspciker_format} H:i:S`,
            enableTime: true,
            ...options
        });
    }
    else {
        return $(selector).flatpickr({
            dateFormat: `${syspciker_format}`,
            enableTime: false,
            ...options
        });
    }
};
function Sys_PickerGet(id) {
    try {

        if (!id.includes('#')) id = '#' + id;
        const element = document.querySelector(id);
        if (element && element._flatpickr) {
            if (element.value != undefined && element.value != "")
                return SysDate().FDTEXT(element.value).UTC_DateTime();
            else return element._flatpickr.selectedDates[0] || new Date();
        }
        return new Date();
    }
    catch (ex) {
        return null;
    }

}

function Sys_RangePicker(selector, options = {}) {
    return $(selector).flatpickr({
        mode: "range",
        dateFormat: `${syspciker_format}`,
        enableTime: false,
        ...options
    });
};

function Sys_RangePickerGet(id) {
    try {
        if (!id.includes('#')) id = '#' + id;
        const element = document.querySelector(id);
        if (element && element._flatpickr) {
            let arr = ['', ''];
            if (element.value != undefined && element.value != "") {
                if (element.value.includes('to')) {
                    arr = element.value.split(" to ");
                }
                else {
                    arr[0] = element.value;
                    arr[1] = element.value;
                }
                return [SysDate().FDTEXT(arr[0]).UTC_DateTime(), SysDate().FDTEXT(arr[1]).UTC_DateTime()];
            }
            else return [element._flatpickr.selectedDates[0] || new Date(), element._flatpickr.selectedDates[1] || new Date()];
        }
        return new Date();
    }
    catch (ex) {
        return null;
    }

}
function Sys_RangePickerEmpty(id) {
    try {
        if (!id.includes('#')) id = '#' + id;
        const element = document.querySelector(id);
        if (element && element._flatpickr) {
            if (element._flatpickr.selectedDates[0] == undefined || element._flatpickr.selectedDates[1] == undefined) return true;
            else return false;
        }
        return true;
    }
    catch (ex) {
        return true;
    }
}
function Sys_GetYearBirth(year) {
    try {
        if (year == "") return 0;
        if (!isNaN(year)) {
            var x = Number(year);
            var maxx = (new Date()).getFullYear();
            var minx = (new Date()).getFullYear() - 100;
            if (x >= minx && x <= maxx) {
                return x;
            }
            else return 0;
        }
        else return 0;


    } catch (ex) {
        return 0;
    }
}
