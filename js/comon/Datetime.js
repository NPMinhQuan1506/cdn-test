// Easy 1
////////////////////////////////////////

//THONG
function formatDMYHHMM_To_Date(date) {
    try {
        if(date!=undefined&&date!="") {
            dates=date.split(' ');
            dates1=dates[0]?.split('-');
            dates2=dates[1]?.split(':');
            let y=dates1[2]??0;
            let m=dates1[1]??0;
            let d=dates1[0]??0;
            let hh=dates2[0]??0;
            let mm = dates2[1] ?? 0;
            let ss = dates2[2] ?? 0;
            return new Date(y, m - 1, d, hh, mm, ss,0);
        }
        else {
            return new Date();
        }
    }
    catch(e) {
        return new Date();
    }
}
function ConvertDMY_ToInt(date) {
    try {
        date=date.split('-');
        return Number(date[2]+date[1]+date[0]);
    }
    catch(ex) {
        return 0;
    }
}
 

//KHANH
//function ConvertStringDMY_YMD(x) {
//    try {
//        let j=x.split('-');
//        return (j[2]+"-"+j[1]+"-"+j[0]);
//    }
//    catch(err) {
//        return "";
//    }
//}
function formatDateClient(date) {
    if(date!=undefined&&date!="") {
        var d=new Date(date),
            month=''+(d.getMonth()+1),
            day=''+d.getDate(),
            year=d.getFullYear();

        if(month.length<2) month='0'+month;
        if(day.length<2) day='0'+day;

        return [day,month,year].join('-');
    }
    else {
        return '01-01-1900';
    }
}
function ConvertDateTime_To_Timespan_TimeZone(_dd) {
    try {
        return (_dd.getTime()+(_dd.getTimezoneOffset()*60*1000*-1));
    } catch(ex) {
        return 0;
    }
}
function ConvertString_DMY_To_StringYMD(x) {
    try {
        let _d=x.split(' ')[0];
        return _d.split('-')[2]+'-'+_d.split('-')[1]+'-'+_d.split('-')[0];

    }
    catch(err) {
        return "";
    }
}
// TY
//function ConvertDateTimeToString(x) {
//    try {
//        let j=x.split('-');
//        return ('ngày '+j[0]+' tháng '+j[1]+' năm '+j[2]);
//    }
//    catch(err) {
//        return "";
//    }
//}
//function ConvertOnly_DMY_To_DateTime(x) {
//    try {
//        return new Date(x.split('-')[2],Number(x.split('-')[1])-1,x.split('-')[0]);
//    }
//    catch(err) {
//        return "";
//    }
//}
//function ConvertString_YMD_To_DateTime(x) {
//    try {
//        let _d=x.split(' ')[0];
//        return new Date(_d.split('-')[0],Number(_d.split('-')[1])-1,_d.split('-')[2]);
//    }
//    catch(err) {
//        return "";
//    }
//}

//Còn sử dụng trong chi tiết lịch hẹn, có sử dụng trong flatpicker chọn thời gian. Sửa sau
function ConvertString_DMYHM_To_DateTime(x) {
    try {
        let _d=x.split(' ')[0];
        let _h=x.split(' ')[1];
        return new Date(_d.split('-')[2],Number(_d.split('-')[1])-1,_d.split('-')[0],_h.split(':')[0],_h.split(':')[1]);
    }
    catch(err) {
        return "";
    }
}
////////////////////////////////////////
// Hard 1
////////////////////////////////////////
function GetDateTime_String_DMYHMSS(x) {
    try {
        var d=new Date(x);
        let _month=d.getMonth()+1;
        let month=(_month<10)? ("0"+_month):_month;
        let date=(d.getDate()<10)? ("0"+d.getDate()):d.getDate();
        let hour=(d.getHours()<10)? ("0"+d.getHours()):d.getHours();
        let minute=(d.getMinutes()<10)? ("0"+d.getMinutes()):d.getMinutes();
        let second=(d.getSeconds()<10)? ("0"+d.getSeconds()):d.getSeconds();
        return date+'-'+month+'-'+d.getFullYear()+' '+hour+":"+minute+":"+second;
    }
    catch(err) {
        return "";
    }
}
function GetDateTime_String_DMYHM(x) {
    try {
        var d=new Date(x);
        let _month=d.getMonth()+1;
        let month=(_month<10)? ("0"+_month):_month;
        let date=(d.getDate()<10)? ("0"+d.getDate()):d.getDate();
        let hour=(d.getHours()<10)? ("0"+d.getHours()):d.getHours();
        let minute=(d.getMinutes()<10)? ("0"+d.getMinutes()):d.getMinutes();
        return date+'-'+month+'-'+d.getFullYear()+' '+hour+":"+minute;
    }
    catch(err) {
        return "";
    }
}
function GetDateTime_String_DMY(x) {
    try {
        var d=new Date(x);
        let _month=d.getMonth()+1;
        let month=(_month<10)? ("0"+_month):_month;
        let date=(d.getDate()<10)? ("0"+d.getDate()):d.getDate();
        return date+'-'+month+'-'+d.getFullYear();
    }
    catch(err) {
        return "";
    }
}
////////////////////////////////////////
// Hard 2
////////////////////////////////////////
function ConvertToDateRemove1900(x) {

    try {
        var d=new Date(x);
        if(Number(d.getFullYear())==1900) return "";
        else return x
    }
    catch(err) {
        return x;
    }
}
function ConvertString_DMY_To_DateTime(x) {
    try {
        let _d=x.split(' ')[0];
        return new Date(_d.split('-')[2],Number(_d.split('-')[1])-1,_d.split('-')[0]);
    }
    catch(err) {
        return "";
    }
}
function ConvertDT_To_StringYMD(x) {
    try {
        var d=new Date(x);
        let _month=d.getMonth()+1;
        let month=(_month<10)? ("0"+_month):_month;
        let date=(d.getDate()<10)? ("0"+d.getDate()):d.getDate();
        return d.getFullYear()+'-'+month+'-'+date;

    }
    catch(err) {
        return "";
    }
}
////////////////////////////////////////