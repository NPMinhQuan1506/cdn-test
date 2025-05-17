//ISO 8601
//dd/MM/yyyy : 28/11/2024
//dd-MM-yyyy : 28-11-2024
//dd.MM.yyyy : 28.11.2024

//Method
//DateText      28/11/2024
//TimeText      10:30
//TimeFullText  10:30:10
//DTText        10:30 28/11/2024
Date.prototype.addDays=function(days) {
    var date=new Date(this.valueOf());
    date.setDate(date.getDate()+days);
    return date;
}
Date.prototype.addHours=function(h) {
    this.setTime(this.getTime()+(h*60*60*1000));
    return this;
}
Date.prototype.addMinutes=function(m) {
    this.setTime(this.getTime()+(m*60*1000));
    return this;
}
Date.prototype.addSeconds = function (s) {
    this.setTime(this.getTime() + (s * 1000));
    return this;
}
var syshour_type = Master_TimeFormat;
var sysdate_mark = "/";
var sysdate_format = "ddMMyyyy";
var sysdow_long=[Outlang["Sys_thu_8"],Outlang["Sys_thu_2"],Outlang["Sys_thu_3"],Outlang["Sys_thu_4"],Outlang["Sys_thu_5"],Outlang["Sys_thu_6"],Outlang["Sys_thu_7"]];
var sysdow_short=[Outlang["Sys_ddd_8"],Outlang["Sys_ddd_2"],Outlang["Sys_ddd_3"],Outlang["Sys_ddd_4"],Outlang["Sys_ddd_5"],Outlang["Sys_ddd_6"],Outlang["Sys_ddd_7"]];
var sysmonth_short=[Outlang["Sys_sthang_1"],Outlang["Sys_sthang_2"],Outlang["Sys_sthang_3"],Outlang["Sys_sthang_4"]
    ,Outlang["Sys_sthang_5"],Outlang["Sys_sthang_6"],Outlang["Sys_sthang_7"],Outlang["Sys_sthang_8"]
    ,Outlang["Sys_sthang_9"],Outlang["Sys_sthang_10"],Outlang["Sys_sthang_11"],Outlang["Sys_sthang_12"]];
var sysmonth_long=[Outlang["Sys_thang_1"],Outlang["Sys_thang_2"],Outlang["Sys_thang_3"],Outlang["Sys_thang_4"]
    ,Outlang["Sys_thang_5"],Outlang["Sys_thang_6"],Outlang["Sys_thang_7"],Outlang["Sys_thang_8"]
    ,Outlang["Sys_thang_9"],Outlang["Sys_thang_10"],Outlang["Sys_thang_11"],Outlang["Sys_thang_12"]];



if (Master_DateFormat.includes('/')) sysdate_mark = '/';
else if (Master_DateFormat.includes('-')) sysdate_mark = '-';
else if (Master_DateFormat.includes('.')) sysdate_mark = '.';
switch (sysdate_mark) {
    case ".":
    case "/":
    case "-": {
        sysdate_format = Master_DateFormat.replace(new RegExp('\\' + sysdate_mark, 'g'), '');
        break;
    }
};

function SysDate() {
    
    var dtValue;
    var totalSecond;
 
    return {
        FUTC: function (typeInput) {
            dtValue = new Date(typeInput);
            return this;
        }
        , FNOW: function () {
            dtValue = new Date();
            return this;
        }
        ,FTIMESPAN: function(typeInput) {
            dtValue=STS_UTCDateTime(typeInput);
            return this;
        }
        ,FDTEXT: function(typeInput) {
            dtValue=SDS_UTCDateTime(typeInput,sysdate_format,sysdate_mark);
            return this;
        }
        ,FUTCTIME: function(typeInput) {
            dtValue=SDT_UTCDate(typeInput);          
            return this;
        }
        ,FTIMEINT: function(typeInput) {
            //HHmm  HHmmSS  YYYYMMDDHHmmSS
            typeInput=typeInput.toString();
            dtValue=SDNum_UTCDate(typeInput);
            return this;
        }
        ,FUTCNUM: function(typeInput) {
            //yyyymmdd
            dtValue=SDUTCNUM_UTCDate(typeInput);
            return this;
        },FUTCFULLNUM: function(typeInput) {
            //yyyymmddhhmmss
            dtValue=SDUTCFUNUM_UTCDate(typeInput);
            return this;
        }
        ,FSECNUM: function(typeInput) {
            totalSecond=Number(typeInput);
            return this;
        }
        //////////////////////////////////////////
        , DateText: function () {
            var pd = SDDT_StringDate(dtValue, sysdate_format, sysdate_mark);
            if (pd.includes('1900')) return "";
            else return pd;
        }
        ,DayMonthText: function() {
            var pd=SDDT_StringDate(dtValue,"ddMM",sysdate_mark);
            if(pd.includes('1900')) return "";
            else return pd;
        }
        , TimeText: function () {
            return SDDT_StringTime(dtValue, "hhmm", syshour_type);
        }
        ,TimeText24: function() {
            // 09:10 (Không có giây)
            return SDDT_StringTime(dtValue, "hhmm", "24");
        }
        , TimeFullText: function () {
            return SDDT_StringTime(dtValue, "hhmmss", syshour_type);
        }
        , DOWText: function () {
            return SDDT_StringDOW(dtValue,false);
        }
        ,DayText: function() {
            return SDDT_StringDay(dtValue);
        }
        ,DOWShortText: function() {
            return SDDT_StringDOW(dtValue,true);
        }
        ,LiveText: function(){
            return SDDT_Live(dtValue);
        }
        ,AgoText: function() {
            return SDDT_Ago(dtValue);
        }
        , DTText: function () {
            let pt = SDDT_StringTime(dtValue, "hhmm", syshour_type);
            let pd=SDDT_StringDate(dtValue,sysdate_format,sysdate_mark);
            if(pd.includes('1900')) return "";
            if (pt == '' && pd == '') return '';
            else if (pt == '') return `${pd}`;
            else return `${pt} ${pd}`
        }

        , DTFullText: function () {
            let pt = SDDT_StringTime(dtValue, "hhmmss", syshour_type);
            let pd=SDDT_StringDate(dtValue,sysdate_format,sysdate_mark);
            if(pd.includes('1900')) return "";
            if (pt == '' && pd == '') return '';
            else if (pt == '') return `${pd}`;
            else return `${pt} ${pd}`
        }
        , DDowText: function () {
            let pw=SDDT_StringDOW(dtValue,false);
            let pd=SDDT_StringDate(dtValue,sysdate_format,sysdate_mark);
            if(pd.includes('1900')) return "";
            if (pw == '' && pd == '') return '';
            else if (pw == '') return `${pd}`;
            else return `${pw} , ${pd}`
        }
        ,MonthShortText: function() {
            return SDDT_StringMonth(dtValue,isShort=true);
        }
        ,DDowFullText: function() {
            let pw=SDDT_StringDOW(dtValue,false);
            let pt=SDDT_StringTime(dtValue,"hhmmss",syshour_type);
            let pd=SDDT_StringDate(dtValue,sysdate_format,sysdate_mark);
            if(pd.includes('1900')) return "";
            if(pt==''&&pd=='') return '';
            else if(pt=='') return `${pd}`;
            else return `${pw} , ${pt} ${pd}`
        }
        ,UTCText: function() {
            //2022-06-26 15:21:52
            let pt = SDDT_StringTime(dtValue, "hhmmss", "24");
            let pd = SDDT_StringDate(dtValue, "yyyyMMdd", "-");
            if (pt == '' && pd == '') return '';
            else if (pt == '') return `${pd}`;
            else return `${pd} ${pt}`
        }
        ,UTCDateText: function() {
            //2022-06-26
            let pd=SDDT_StringDate(dtValue,"yyyyMMdd","-");
            if(pd=='') return '';
            else return `${pd}`
        }
        ,UTC_DNum: function() {
            let pd=SDDT_StringDate(dtValue,"yyyyMMdd","-");
            pd=pd.replace(new RegExp('\\'+"-",'g'),'');
            if(pd=='') return 0;
            else return Number(pd)
        }
        ,UTC_TNumHM: function() {
            // 910 (3 - 4 ký tự giờ phút )
            let pt=SDDT_StringTime(dtValue,"hhmm","24");
            pt=pt.replace(/:/g,"");
            if(pt=='') return 0;
            else return Number(pt)
        }
        ,UTC_TimeTextHM: function() {
            // 0910 (4 ký tự giờ phút)
            let pt=SDDT_StringTime(dtValue,"hhmm","24");
            pt=pt.replace(/:/g,"");
            if(pt=='') return '';
            else return pt;
        }
        ,UTC_DTFullNum: function() {

            let pd=SDDT_StringDate(dtValue,"yyyyMMdd","-");
            let pt=SDDT_StringTime(dtValue,"hhmmss","24");
            pd=pd.replace(new RegExp('\\'+"-",'g'),'');
            pt=pt.replace(/:/g,"");
            if(pd=='') return 0;
            else return pd+pt;
        }
        ,UTC_DateTime: function() {
            return dtValue;
        }
        ,UTC_Date: function() {
            return SDDT_UTCDate(dtValue);
        }
        ,DIS_Time: function() {
            return STNum_DistanceTime(totalSecond);
        }
        ,TSPAN_NUM: function() {
            //(new Date()).getTime(): 1734179257737
            return SDDT_TimeSpan(dtValue);
        }
    };
}
function Sys2Date() {
    var dtValue1;
    var dtValue2;
    return {
        FUTC: function(typeInput1,typeInput2) {
            dtValue1=new Date(typeInput1);
            dtValue2=new Date(typeInput2);
            return this;
        },
        FUTCTIME: function(typeInput1,typeInput2) {
         
            dtValue1=SDT_UTCDate(typeInput1) ;
            dtValue2=SDT_UTCDate(typeInput2);
            return this;
        }
        ,FUTCNUM: function(typeInput1,typeInput2) {
            dtValue1=SDUTCNUM_UTCDate(typeInput1);
            dtValue2=SDUTCNUM_UTCDate(typeInput2);
            return this;
        }
        //////////////////////////////////////////
        ,YDistance: function() {
            let dis=SD2DT_YDistance(dtValue1,dtValue2);
            return Number(dis);
        }
        ,MDistance: function() {
            let dis=SD2DT_MDistance(dtValue1,dtValue2);
            return Number(dis);
        }
        ,DaDistance: function() {
            let dis=SD2DT_DaDistance(dtValue1,dtValue2);
            return Number(dis);
        }
        ,MiDistance: function() {
            let dis=SD2DT_MiDistance(dtValue1,dtValue2);
            return Number(dis);
        }
        ,DateText: function() {
            var pd1=SDDT_StringDate(dtValue1,sysdate_format,sysdate_mark);
            var pd2=SDDT_StringDate(dtValue2,sysdate_format,sysdate_mark);
            if(pd1.includes('1900')||pd2.includes('1900')) return "";
            else return `${pd1}<i class="fas fa-caret-right px-2"></i>${pd2}`; 
        }
    }
}

//////////////////////////////////////////////////////////////////////////////////////////
function SDDT_StringDate(_d, _format, _mark) {
    try {
        let _date = "";
        let _obj = {};
        _obj.day = _d.getDay();  // Day of week (0-6)
        _obj.date = _d.getDate();  // Day on month (1-31)
        _obj.monthSys = _d.getMonth();  // (0-11)
        _obj.month = _d.getMonth() + 1;  // (1-12)
        _obj.year = _d.getFullYear();  // (YYYY)
        if (!isNaN(_obj.day) && _obj.day !== null && _obj.day !== "") {
            switch (_format) {
                case "ddMMyyyy":
                    _date = `${_obj.date.toString().padStart(2, '0')}${_mark}${_obj.month.toString().padStart(2, '0')}${_mark}${_obj.year}`;
                    break;
                case "yyyyMMdd":
                    _date = `${_obj.year}${_mark}${_obj.month.toString().padStart(2, '0')}${_mark}${_obj.date.toString().padStart(2, '0')}`;
                    break;
                case "ddMM":
                    _date=`${_obj.date.toString().padStart(2,'0')}${_mark}${_obj.month.toString().padStart(2,'0')}`;
                    break;
                default:
                    console.log('Date format missing: ');
                    return "";
            }
        }
        return _date;
    } catch (ex) {
        console.log('Date error : ' + ex.toString());
        return "";
    }
}
function SDDT_StringTime(_d, _format, _dttype) {
    try {
        let _time = "";
        let _obj = {};
        _obj.hour = _d.getHours();  // (0-23)
        _obj.minute = _d.getMinutes();  // (0-59)
        _obj.second = _d.getSeconds();  // (0-59)
        if (!isNaN(_obj.hour) && _obj.hour !== null && _obj.hour !== "") {
            if (_dttype == "12") {
                let _ampm = '';
                if (_obj.hour == 12) {
                    _ampm = Outlang["Sys_schieu"];  // "PM"
                } else if (_obj.hour > 12) {
                    _ampm = Outlang["Sys_schieu"];  // "PM"
                    _obj.hour = _obj.hour - 12; // Chuyển giờ > 12 thành giờ 12 giờ
                } else {
                    _ampm = Outlang["Sys_ssang"];  // "AM"
                    if (_obj.hour == 0) {
                        _obj.hour = 12;  // Nếu là 00:00 => 12 AM
                    }
                }

                switch (_format) {
                    case "hhmm":
                        _time = `${(_obj.hour?? 0).toString().padStart(2, '0')}:${(_obj.minute ?? 0).toString().padStart(2, '0')}${_ampm !== "" ? ` ${_ampm}` : ""}`;
                        break;
                    case "hhmmss":
                        _obj.second=(_obj.second??0)===0? ':00':(':'+(_obj.second??0).toString().padStart(2,'0'));
                        _time=`${(_obj.hour??0).toString().padStart(2,'0')}:${(_obj.minute??0).toString().padStart(2,'0')}${_obj.second}${_ampm !== "" ? ` ${_ampm}` : ""}`;
                        break;
                    default:
                        console.log('Time format missing: ');
                        return "";
                }
            }
            if (_dttype == "24") {
                switch (_format) {
                    case "hhmm":
                        _time = `${(_obj.hour?? 0).toString().padStart(2, '0')}:${(_obj.minute ?? 0).toString().padStart(2, '0')}`;
                        break;
                    case "hhmmss":
                        _obj.second=(_obj.second??0)===0? ':00':(':'+(_obj.second??0).toString().padStart(2,'0'));
                        _time=`${(_obj.hour??0).toString().padStart(2,'0')}:${(_obj.minute??0).toString().padStart(2,'0')}${_obj.second}`;
                        break;
                    default:
                        console.log('Time format missing: ');
                        return "";
                }
            }
        }
        return _time;
    } catch (ex) {
        console.log('Time error: ' + ex.toString());
        return "";
    }
}
function SDDT_StringDOW(_d,isShort) {
    try {
        let _dow = "";
        let _obj = {};
        _obj.day = _d.getDay();  // Day of week (0-6)
        if (!isNaN(_obj.day) && _obj.day !== null && _obj.day !== "") {
            _dow=isShort? sysdow_short[_obj.day] : sysdow_long[_obj.day];
        }
        return _dow;
    } catch (ex) {
        console.log('Date error : ' + ex.toString());
        return "";
    }
}
function SDDT_StringDay(_d) {
    try {
        let _day=(_d.getDate()<10)? ("0"+_d.getDate()):_d.getDate();
        return _day;
    } catch(ex) {
        console.log('SDDT_StringDay error : '+ex.toString());
        return "";
    }
}
function SDDT_StringMonth(_d,isShort) {
    try {
        let _month="";
        let _obj={};
        _obj.month=_d.getMonth();  // Month (0-11)
        if(!isNaN(_obj.month)&&_obj.month!==null&&_obj.month!=="") {
            _month=isShort? sysmonth_short[_obj.month]:sysmonth_long[_obj.month];
        }
        return _month;
    } catch(ex) {
        console.log('Month error : '+ex.toString());
        return "";
    }
}
function SDDT_Live(_d) {
    try {
        var seconds=Math.floor((new Date()-_d)/1000);
        let _label="";
        let _time="";
        let interval=seconds/2592000;
        if(interval>1) {
            _label='';
            _time='';
           
        }
        else if(seconds/86400>1) {
            _label='';
            _time='';
 
        }
        if(seconds/3600>1) {
            _label='text-secondary';
            _time=`${Math.floor(seconds/3600)} ${Outlang["Gio"]}`;
        }
        else if(seconds/60>5) {
            _label='text-secondary';
            _time=`${Math.floor(seconds/60)} ${Outlang["Phut"]}`;
        }
        else if(seconds/60<5) {
            _label='text-success';
            _time="online";
        }
        if(_label!=""&&_time!="")
            return `<i class="fas fa-circle ${_label} me-1"></i><span class="text-lowercase">${_time}</span>`;
        else return "";
    } catch(ex) {
        console.log('Live error : '+ex.toString());
        return "";
    }
}
function SDDT_Ago(_d) {
    try {
      
        const inputDate=new Date(_d);
        if(isNaN(inputDate)) return ""; 
        const now=new Date();
        const diffMs=now-inputDate;
        if(diffMs<0) return "";
        const diffMinutes=Math.floor(diffMs/(1000*60)); 
        const diffHours=Math.floor(diffMinutes/60);
        if(diffMinutes<1) return `1 ${Outlang["Phut"]}`; 
        if(diffMinutes<60) return `${diffMinutes} ${Outlang["Phut"]}`;
        if(diffHours===1) return `1 ${Outlang["Gio"]}`; 
        if(diffHours<24) return `${diffHours} ${Outlang["Gio"]}`; 
        return ""; 

    } catch(ex) {
        console.log('Live error : '+ex.toString());
        return "";
    }
}
function SDS_UTCDateTime(_text,_format,_mark) {
    try {
        if(_text&&_text.trim()!=="") {
            _mark=new RegExp('\\'+_mark,'g');
            let _dt=_text.split(' ');
            let ry=0,rm=0,rd=0,rh=0,rmin=0,rs=0;

            if(_dt.length>0) {
                let _d=(_dt[0]||"").split(_mark);
                let _t=(_dt[1]||"").split(":");

                switch(_format) {
                    case "ddMMyyyy":
                        if(_d.length>=3) {
                            ry=_d[2];
                            rm=Number(_d[1])-1; // Tháng bắt đầu từ 0 trong JS
                            rd=_d[0];
                        } else {
                            console.error('Invalid date format: ',_text);
                            return "";
                        }
                        break;
                    case "yyyyMMdd":
                        if(_d.length>=3) {
                            ry=_d[0];
                            rm=Number(_d[1])-1;
                            rd=_d[2];
                        } else {
                            console.error('Invalid date format: ',_text);
                            return "";
                        }
                        break;
                    default:
                        console.error('Date format missing:',_format);
                        return "";
                }

                rh=Number(_t[0])||0;
                rmin=Number(_t[1])||0;
                rs=Number(_t[2])||0;

                return new Date(ry,rm,rd,rh,rmin,rs);
            }
        }

        return "";
    } catch(ex) {
        console.error(`UTCDate error: ${ex.toString()} - Input: _text="${_text}", _format="${_format}", _mark="${_mark}"`);
        return "";
    }
}
function SDNum_UTCDate(time) {
    try {
        time=time?.toString()??"";
        if(time==="") return null;

        let year=1900,month=0,day=1,hour=0,minute=0,second=0;

        switch(time.length) {
            case 14: // Format: YYYYMMDDHHmmSS
                second=parseInt(time.substring(12,14),10);
                minute=parseInt(time.substring(10,12),10);
                hour=parseInt(time.substring(8,10),10);
                day=parseInt(time.substring(6,8),10);
                month=parseInt(time.substring(4,6),10)-1;
                year=parseInt(time.substring(0,4),10);
                break;
            case 6: // Format: HHmmSS
                second=parseInt(time.substring(4,6),10);
                minute=parseInt(time.substring(2,4),10);
                hour=parseInt(time.substring(0,2),10);
                break;
            case 4: // Format: HHmm
                minute=parseInt(time.substring(2,4),10);
                hour=parseInt(time.substring(0,2),10);
                break;
            default:
                return null; // Invalid format
        }

        const date=new Date(year,month,day,hour,minute,second);
 
        return date;  
    } catch(ex) {
        console.log("Error in SDNum_UTCDate: ",ex);
        return null;
    }
}
function SDDT_UTCDate(_d) {
    try {
        return new Date(_d.getFullYear(),_d.getMonth(),_d.getDate(),0,0,0,0);
    } catch(ex) {
        return null;
    }
}
function SDT_UTCDate(_t) {
    try {
        let dateNow=new Date();
        let obj=_t.split(':');
        return new Date(dateNow.getFullYear(),dateNow.getMonth(),dateNow.getDate(),obj[0]??0,obj[1]??0,obj[2]??0);
    } catch(ex) {
        return null;
    }
}
function STS_UTCDateTime(_t) {
    try {
        var d=new Date(Number(_t)*1000);
        return d;
    } catch(ex) {
        return null;
    }
}
function SDDT_TimeSpan(x) {
    try {
        if(x!=undefined) {
            return new Date(x).getTime();
        } else {
            return new Date().getTime();
        }
    }
    catch(err) {
        return "";
    }
}
function SDUTCNUM_UTCDate(_d) {
    try {
        _d=_d.toString();
        if(_d==""||_d=="0") return null;
        let month=_d.substring(4,6);
        let day=_d.substring(6,8);
        let year=_d.substring(0,4);

        return new Date(year,Number(month)-1,day,0,0,0,0);
    } catch(ex) {
        return null;
    }
}
function SDUTCFUNUM_UTCDate(_d) {
    try {
        _d=_d.toString();
        if(_d==""||_d=="0") return null;
        let month=_d.substring(4,6);
        let day=_d.substring(6,8);
        let year=_d.substring(0,4);

        let h=_d.substring(8,10);
        let m=_d.substring(10,12);
        let s=_d.substring(12,14);
        return new Date(year,Number(month)-1,day,h??0,m??0,s??0);
    } catch(ex) {
        return null;
    }
}

function STNum_DistanceTime(totalSeconds) {
    try {
        let hours=Math.floor(totalSeconds/3600);
        totalSeconds%=3600;
        let minutes=Math.floor(totalSeconds/60);
        let seconds=totalSeconds%60;
        minutes=String(minutes).padStart(2,"0");
        hours=String(hours).padStart(2,"0");
        seconds=String(seconds).padStart(2,"0");
        return (hours+":"+minutes+":"+seconds);
    } catch(ex) {
        console.log("Error in STNum_DistanceTime: ",ex);
        return "";
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////

function SD2DT_YDistance(d1,d2) {
    try {
       
        return Math.abs(Number(d2.getFullYear()-d1.getFullYear())) ;
    }
    catch(ex) {
        return 0;
    }
}
function SD2DT_MDistance(d1,d2) {
    try {
        const yearDiff=d2.getFullYear()-d1.getFullYear();
        const monthDiff=d2.getMonth()-d1.getMonth();
        return Math.abs(yearDiff*12+monthDiff);
    } catch(ex) {
        return 0;
    }
}
function SD2DT_DaDistance(d1,d2) {
    try {
        const diffTime=Math.abs(d2-d1);
        const diffDays=Math.floor(diffTime/(1000*60*60*24));
        return diffDays;
    } catch(ex) {
        return 0;
    }
}

function SD2DT_MiDistance(d1,d2) {
    try {
 
        const diffInMilliseconds=Math.abs(d2-d1);
        const diffInMinutes=Math.floor(diffInMilliseconds/(1000*60));

        return diffInMinutes;
    } catch(ex) {
        return 0;
    }
}

(function ($) {
    $.fn.date_validate = function (options) {
        var base = this;
        var is_error = true;
        var _sysMarkDV = (sysdate_mark ?? "") ? sysdate_mark : "/";
        var defaults = {
            format: new RegExp(`^(0[1-9]|[12][0-9]|3[01])([${_sysMarkDV}])` +
                `(0[1-9]|1[0-2])\\2(19|20)\\d{2}$`),
            class: 'error-birthday',
            elm_error: '.field',
            maxlength:'10',
            placeholder: Master_DateFormat
        };
        var settings=$.extend({},defaults,options);
        base.attr('placeholder',defaults.placeholder);
        base.attr('maxlength',defaults.maxlength);
        base.init = function () {
            is_error = validate_date(base.val());
        };
        base.init();

        function validate_date(value) {
            if (value && value !== '') {
                if (value.match(settings.format)) {
                    var pdate = value.split(_sysMarkDV);
                    var dd = parseInt(pdate[0]);
                    var mm = parseInt(pdate[1]);
                    var yy = parseInt(pdate[2]);
                    var ListofDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

                    if (mm === 1 || mm > 2) {
                        if (dd > ListofDays[mm - 1]) {
                            return false;
                        }
                    }
                    if (mm === 2) {
                        var lyear = (!(yy % 4) && yy % 100) || !(yy % 400);
                        if ((!lyear && dd >= 29) || (lyear && dd > 29)) {
                            return false;
                        }
                    }
                } else {
                    return false;
                }
                return true;
            } else {
                return true;
            }
        }
        base.on('keydown', function (_e) {
            if(_e.key == 'Backspace' || _e.key == 'Delete') return
            var v = base.val();
            if (v.match(/^\d{2}$/) !== null) {
                base.val(v + _sysMarkDV);
            } else if (v.match(new RegExp(`^\\d{2}\\${_sysMarkDV}\\d{2}$`)) !== null) {
                base.val(v + _sysMarkDV);
            }
        });
        //base.keypress(function (_e) {
        //    var v = base.val();
        //    if (v.match(/^\d{2}$/) !== null) {
        //        base.val(v + _sysMarkDV);
        //    } else if (v.match(new RegExp(`^\\d{2}\\${_sysMarkDV}\\d{2}$`)) !== null) {
        //        base.val(v + _sysMarkDV);
        //    }
        //});

        base.change(function (_e) {
            if (validate_date(base.val()) === false) {
                base.closest(settings.elm_error).addClass(settings.class);
                is_error = false;
            } else {
                base.closest(settings.elm_error).removeClass(settings.class);
                is_error = true;
            }
        });

        var date_validate = {
            get_validate: function (_d) {
                return is_error;
            }
        };
        return date_validate;
    };
}(jQuery));
