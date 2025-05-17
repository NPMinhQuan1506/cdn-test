//#region //HOME
async function apicg_home_getIniVer(beforefunc, successfunc, failurefunc, completefunc) {
    if (typeof beforefunc == 'function') beforefunc();
    new Promise((resolve) => {
        setTimeout(() => {
            AjaxJWT(url = "/api/clientgate/Home/GetIniVer"
                , data = null
                , async = true
                , success = function (result) {
                    if (result != "0") {
                        if (typeof successfunc == 'function') successfunc(result);
                    }
                    else {
                        if (typeof failurefunc == 'function') failurefunc(result);
                    }
                    resolve();
                    if (typeof completefunc == 'function') completefunc();
                }
            );
        }, 100)
    })
}
//Type: MiniApp, BookingOnline, ProfileOnline
async function apicg_home_getTheme(type = "BookingOnline", beforefunc, successfunc, failurefunc, completefunc) {
    if (typeof beforefunc == 'function') beforefunc();
    new Promise((resolve) => {
        setTimeout(() => {
            AjaxJWT(url = "/api/clientgate/Home/GetTheme"
                , data = JSON.stringify({ "val": type })
                , async = true
                , success = function (result) {
                    if (result != "0") {
                        if (typeof successfunc == 'function') successfunc(result);
                    }
                    else {
                        if (typeof failurefunc == 'function') failurefunc(result);
                    }
                    resolve();
                    if (typeof completefunc == 'function') completefunc();
                }
            );
        }, 100)
    })
}

async function apicg_home_getIni(beforefunc, successfunc, failurefunc, completefunc) {
    if (typeof beforefunc == 'function') beforefunc();
    new Promise((resolve) => {
        setTimeout(() => {
            AjaxJWT(url = "/api/clientgate/Home/GetIni"
                , data = null
                , async = true
                , success = function (result) {
                    if (result != "0") {
                        if (typeof successfunc == 'function') successfunc(result);
                    }
                    else {
                        if (typeof failurefunc == 'function') failurefunc(result);
                    }
                    resolve();
                    if (typeof completefunc == 'function') completefunc();
                }
            );
        }, 100)
    })
}
async function apicg_home_getGender(beforefunc, successfunc, failurefunc, completefunc) {
    if (typeof beforefunc == 'function') beforefunc();
    new Promise((resolve) => {
        setTimeout(() => {
            AjaxJWT(url = "/api/clientgate/Home/GetGender"
                , data = null
                , async = true
                , success = function (result) {
                    if (result != "0") {
                        if (typeof successfunc == 'function') successfunc(result);
                    }
                    else {
                        if (typeof failurefunc == 'function') failurefunc(result);
                    }
                    resolve();
                    if (typeof completefunc == 'function') completefunc();
                }
            );
        }, 100)
    })
}
//#endregion

//#region //Branch
async function apicg_branch_getArea(beforefunc, successfunc, failurefunc, completefunc) {
    if (typeof beforefunc == 'function') beforefunc();
    new Promise((resolve) => {
        setTimeout(() => {
            AjaxJWT(url = "/api/clientgate/Branch/GetArea"
                , data = null
                , async = true
                , success = function (result) {
                    if (result != "0") {
                        if (typeof successfunc == 'function') successfunc(result);
                    }
                    else {
                        if (typeof failurefunc == 'function') failurefunc(result);
                    }
                    resolve();
                    if (typeof completefunc == 'function') completefunc();
                }
            );
        }, 100)
    })
}

async function apicg_branch_getList(AreaID = 0, beforefunc, successfunc, failurefunc, completefunc) {
    if (typeof beforefunc == 'function') beforefunc();
    new Promise((resolve) => {
        setTimeout(() => {
            AjaxJWT(url = "/api/clientgate/Branch/GetList"
                , data = JSON.stringify({ "ID": AreaID })
                , async = true
                , success = function (result) {
                    if (result != "0") {
                        if (typeof successfunc == 'function') successfunc(result);
                    }
                    else {
                        if (typeof failurefunc == 'function') failurefunc(result);
                    }
                    resolve();
                    if (typeof completefunc == 'function') completefunc();
                }
            );
        }, 100)
    })
}
//#endregion

//#region //Employee
async function apicg_emp_getGroup(para, beforefunc, successfunc, failurefunc, completefunc) {
    if (typeof beforefunc == 'function') beforefunc();
    new Promise((resolve) => {
        setTimeout(() => {
            let data = {
                GroupID: para.GroupID ?? 0,
                GroupToken: para.GroupToken ?? "",

                IsDoctor: para.IsDoctor ?? 0,
                IsAssistant: para.IsAssistant ?? 0,
                IsCSKH: para.IsCSKH ?? 0,
                IsCashier: para.IsCashier ?? 0,
                IsLabo: para.IsLabo ?? 0,
                IsTech: para.IsTech ?? 0,
                IsConsult: para.IsConsult ?? 0,
                IsMarketing: para.IsMarketing ?? 0,
                IsResponsible: para.IsResponsible ?? 0
            };
            AjaxJWT(url = "/api/clientgate/Employee/GetGroup"
                , data = JSON.stringify(data)
                , async = true
                , success = function (result) {
                    if (result != "0") {
                        if (typeof successfunc == 'function') successfunc(result);
                    }
                    else {
                        if (typeof failurefunc == 'function') failurefunc(result);
                    }
                    resolve();
                    if (typeof completefunc == 'function') completefunc();
                }
            );
        }, 100)
    })
}

async function apicg_emp_getList(para, beforefunc, successfunc, failurefunc, completefunc) {
    if (typeof beforefunc == 'function') beforefunc();
    new Promise((resolve) => {
        setTimeout(() => {
            let data = {
                GroupID: para.GroupID ?? 0,
                GroupToken: para.GroupToken ?? "",

                IsDoctor: para.IsDoctor ?? 0,
                IsAssistant: para.IsAssistant ?? 0,
                IsCSKH: para.IsCSKH ?? 0,
                IsCashier: para.IsCashier ?? 0,
                IsLabo: para.IsLabo ?? 0,
                IsTech: para.IsTech ?? 0,
                IsConsult: para.IsConsult ?? 0,
                IsMarketing: para.IsMarketing ?? 0,
                IsResponsible: para.IsResponsible ?? 0
            };
            AjaxJWT(url = "/api/clientgate/Employee/GetList"
                , data = JSON.stringify(data)
                , async = true
                , success = function (result) {
                    if (result != "0") {
                        if (typeof successfunc == 'function') successfunc(result);
                    }
                    else {
                        if (typeof failurefunc == 'function') failurefunc(result);
                    }
                    resolve();
                    if (typeof completefunc == 'function') completefunc();
                }
            );
        }, 100)
    })
}
//#endregion

//#region //App
async function apicg_schedule_insert(para, beforefunc, successfunc, failurefunc, completefunc) {
    if (typeof beforefunc == 'function') beforefunc();
    new Promise((resolve) => {
        setTimeout(() => {
            let appointment = {
                Message: para?.message ?? "",
                BranchID: Number(para?.branchID ?? 0),
                TimePeriod: Number(para?.timePeriod ?? 0),
                DateAppoint: para?.dateAppoint ?? "",
                CustName: para?.custName ?? "",
                Phone: para?.phone ?? "",
                AssistantID: para?.assistantID ?? 0,
                ServiceCare: para?.serviceCare ?? "",
                Email: para?.email ?? "" ,
                NumParticipant: (para?.numParticipant ?? 0) > 0 ? para?.numParticipant : 1
            }
            AjaxJWT(url = "/api/clientgate/Schedule/Insert"
                , data = JSON.stringify(appointment)
                , async = true
                , success = function (result) {
                    if (result != "0") {
                        if (typeof successfunc == 'function') successfunc(result);
                    }
                    else {
                        if (typeof failurefunc == 'function') failurefunc(result);
                    }
                    resolve();
                    if (typeof completefunc == 'function') completefunc();
                }
            );
        }, 100)
    })
}
async function apicg_schedule_getDetail(Code = '', beforefunc, successfunc, failurefunc, completefunc) {
    if (typeof beforefunc == 'function') beforefunc();
    new Promise((resolve) => {
        setTimeout(() => {
            AjaxJWT(url = "/api/clientgate/Schedule/GetDetail"
                , data = JSON.stringify({ "val": Code })
                , async = true
                , success = function (result) {
                    if (result != "0") {
                        if (typeof successfunc == 'function') successfunc(result);
                    }
                    else {
                        if (typeof failurefunc == 'function') failurefunc(result);
                    }
                    resolve();
                    if (typeof completefunc == 'function') completefunc();
                }
            );
        }, 100)
    })
}


async function apicg_schedule_getTimePeriod(beforefunc, successfunc, failurefunc, completefunc) {
    if (typeof beforefunc == 'function') beforefunc();
    new Promise((resolve) => {
        setTimeout(() => {
            AjaxJWT(url = "/api/clientgate/Schedule/GetTimePeriod"
                , data = null
                , async = true
                , success = function (result) {
                    if (result != "0") {
                        if (typeof successfunc == 'function') successfunc(result);
                    }
                    else {
                        if (typeof failurefunc == 'function') failurefunc(result);
                    }
                    resolve();
                    if (typeof completefunc == 'function') completefunc();
                }
            );
        }, 100)
    })
}


async function apicg_service_getServicecare(beforefunc,successfunc,failurefunc,completefunc) {
    if(typeof beforefunc=='function') beforefunc();
    new Promise((resolve) => {
        setTimeout(() => {
            AjaxJWT(url="/api/clientgate/Service/GetServicecare"
                ,data=null
                ,async=true
                ,success=function(result) {
                    if(result!="0") {
                        if(typeof successfunc=='function') successfunc(result);
                    }
                    else {
                        if(typeof failurefunc=='function') failurefunc(result);
                    }
                    resolve();
                    if(typeof completefunc=='function') completefunc();
                }
            );
        },100)
    })
}
//#endregion

//#region //CUSTOMER

async function apicg_cust_getPropertiesCust(beforefunc, successfunc, failurefunc, completefunc) {
    if (typeof beforefunc == 'function') beforefunc();
    new Promise((resolve) => {
        setTimeout(() => {
            AjaxJWT(url = "/api/clientgate/Customer/GetPropertiesCust"
                , data = null
                , async = true
                , success = function (result) {
                    if (result != "0") {
                        if (typeof successfunc == 'function') successfunc(result);
                    }
                    else {
                        if (typeof failurefunc == 'function') failurefunc(result);
                    }
                    resolve();
                    if (typeof completefunc == 'function') completefunc();
                }
            );
        }, 100)
    })
}


async function apicg_cust_getSource(beforefunc, successfunc, failurefunc, completefunc) {
    if (typeof beforefunc == 'function') beforefunc();
    new Promise((resolve) => {
        setTimeout(() => {
            AjaxJWT(url = "/api/clientgate/Customer/GetSource"
                , data = null
                , async = true
                , success = function (result) {
                    if (result != "0") {
                        if (typeof successfunc == 'function') successfunc(result);
                    }
                    else {
                        if (typeof failurefunc == 'function') failurefunc(result);
                    }
                    resolve();
                    if (typeof completefunc == 'function') completefunc();
                }
            );
        }, 100)
    })
}
async function apicg_cust_insert(para, beforefunc, successfunc, failurefunc, completefunc) {
    if (typeof beforefunc == 'function') beforefunc();
    new Promise((resolve) => {
        setTimeout(() => {
            let customerProfile = {
                BranchID: Number(para?.BranchID ?? 0),
                GenderID: Number(para?.GenderID ?? 0),
                Phone: para?.Phone ?? "",
                Name: para?.Name ?? "",
                Email: para?.Email ?? "",
                Address: para?.Address ?? "",
                Birthday: para?.Birthday ?? "",
                ContentSchedule: para?.ContentSchedule ?? "",
                dtPro: para?.dtPro?.map(item => ({
                    "IDPro": item?.IDPro ?? 0,
                    "Value": item?.Value ?? "",
                    "IsCheck": item?.IsCheck ?? 0
                })) ?? []
            }

            AjaxJWT(url = "/api/clientgate/Customer/Insert"
                , data = JSON.stringify(customerProfile)
                , async = true
                , success = function (result) {
                    if (result != "0") {
                        if (typeof successfunc == 'function') successfunc(result);
                    }
                    else {
                        if (typeof failurefunc == 'function') failurefunc(result);
                    }
                    resolve();
                    if (typeof completefunc == 'function') completefunc();
                }
            );
        }, 100)
    })
}
//#endregion

//#region // Other
function Wrap_smoothScroll(target,delta) {
    let start=target.scrollLeft;
    let end=start+delta;
    let duration=300;
    let startTime=null;

    function animateScroll(timestamp) {
        if(!startTime) startTime=timestamp;
        let progress=timestamp-startTime;
        let ease=Math.min(progress/duration,1);

        target.scrollLeft=start+(end-start)*ease;

        if(progress<duration) {
            requestAnimationFrame(animateScroll);
        }
    }

    requestAnimationFrame(animateScroll);
}
function Slide_Step(_old,_new,direction="right") {

    if(direction=="right") {

        _old.removeClass("slide-out-left").removeClass("slide-in-left").removeClass("slide-out").removeClass("slide-in");
        _old.addClass("slide-out");
        setTimeout(() => {
            _old.hide();
            _new.removeClass("slide-out-left").removeClass("slide-in-left").removeClass("slide-out").removeClass("slide-in");
            _new.show().addClass("slide-in");
            _new.on("animationend", function () {
                $(this).removeClass("slide-in");
            });
            $("html, body").animate({scrollTop: 0},200);

        },250);
    }
    if(direction=="left") {

        _old.removeClass("slide-out").removeClass("slide-in").removeClass("slide-out-left").removeClass("slide-in-left");
        _old.addClass("slide-out-left");
        setTimeout(() => {
            _old.hide();
            _new.removeClass("slide-out").removeClass("slide-in").removeClass("slide-out-left").removeClass("slide-in-left");
            _new.show().addClass("slide-in-left");
            $("html, body").animate({scrollTop: 0},200);

        },250);
    }

}

//#endregion

//#region // Color Theme
function CG_IniThems(cookieType,type,callback) {
    let promises=[];
    promises.push(CG_loadDataFromStore(() => CG_ThemeLoad(type),cookieType));
    Promise.all(promises)
        .then(data => {
            if(data.length>0) {
           
                let _dataTheme=data[0];
                CG_ThemeRender(_dataTheme);
                callback();
            }
        })
        .catch(error => console.error(error));
}

async function CG_ThemeLoad(_type) {
    return new Promise(resolve => {
        try {
      
            if(typeof apicg_home_getTheme=="function") {
                apicg_home_getTheme(
                    type=_type
                    ,beforefunc=function() {}
                    ,successfunc=function(_rr) {
                        let _data=[];
                        if(_rr!="0") {
                            _data=JSON.parse(_rr);
                        }
                        resolve(_data);
                    }
                    ,failurefunc=function() {
                        resolve([]);
                    }
                    ,completefunc=function(e) {}
                )
            }
        }
        catch(e) {
            resolve([]);
        }

    })
}
function CG_ThemeRender(data) {
    if(data&&data.length>0) {
        let item=data[0]??{};

        document.documentElement.style.setProperty('--bs-primary',item?.PrimaryColor??"#7928ca");
        document.documentElement.style.setProperty('--bs-primary-soft',item?.PrimaryColorSoft??"#7928ca1A");
        document.documentElement.style.setProperty('--background-light',item?.BackgroundLight??"#f8f8f8");
    }
}
async function CG_loadDataFromStore(funcAsync,nameStore) {
    try {
        if((nameStore??"")=="") return []
        if(typeof funcAsync!="function") return []
        let strStore=getCookie(nameStore);
        let data=(strStore!="")? TryParseObject(strStore)??[]:[];
        if((data?.length??0)==0) {
            data=await funcAsync();
            let jsonData=JSON.stringify(data);
            setCookie(nameStore,jsonData,1/24);
        }

        return data;
    }
    catch(e) {
        return [];
    }
}
function CGxoa_dau(str) {
    try {
        str=str.toString();
        str=str.trim();
        str=str.normalize('NFC');
        str=str.replace(/[\u0300-\u036f]/g,'');
        str=str.replace(/[đĐ]/g,m => m==='đ'? 'd':'D');
        str=str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a");
        str=str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e");
        str=str.replace(/ì|í|ị|ỉ|ĩ/g,"i");
        str=str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o");
        str=str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u");
        str=str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y");
        str=str.replace(/đ/g,"d");
        str=str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g,"A");
        str=str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g,"E");
        str=str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g,"I");
        str=str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g,"O");
        str=str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g,"U");
        str=str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g,"Y");
        str=str.replace(/Đ/g,"D");
        return str;
    }
    catch(ex) {
        return str;
    }

}
//function CG_ChangeMeta(_data,funcname='') {
//    try {
//        if(_data.length!=0) {
//            let _item=_data[0];
   
//            document.title=funcname;
//            document.querySelector("link[rel='shortcut icon']").setAttribute("href",_item.Companylogo);
//            document.querySelector("link[rel='icon']").setAttribute("href",_item.Companylogo);
//            document.querySelector("meta[name='description']").setAttribute("content",_item.CompanyName);
//            document.querySelector("meta[name='keywords']").setAttribute("content",_item.CompanyName);
//            document.querySelector("meta[property='og:site_name']").setAttribute("content",_item.CompanyLink);
//            document.querySelector("meta[property='og:title']").setAttribute("content",_item.CompanyName);
//            document.querySelector("meta[property='og:image']").setAttribute("content",_item.Companylogo);

//        }
//    }
//    catch(ex) {}
//}
//endregion