﻿
function syslog_ser(act, val) {
    syslog_executed(act = act, val = val, type = 'ser', cust = 0, content = '')
}
function syslog_whr(act, val) {
    syslog_executed(act = act, val = val, type = 'whr', cust = 0, content = '')
}
function syslog_acc(act, val) {
    syslog_executed(act = act, val = val, type = 'acc', cust = 0, content = '')
}
function syslog_sca(act, val) {
    syslog_executed(act = act, val = val, type = 'sca', cust = 0, content = '')
}

function syslog_app(act, val) {
    syslog_executed(act = act, val = val, type = 'app', cust = 0, content = '')
}

function syslog_sca(act, val) {
    syslog_executed(act = act, val = val, type = 'sca', cust = 0, content = '')
}

function syslog_mob(act, val) {
    syslog_executed(act = act, val = val, type = 'mob', cust = 0, content = '')
}

function syslog_ExpExcel(act, cont) {
    syslog_executed(act = act, val = '', type = 'eer', cust = 0, content = cont)
}
//#region // Customer
function syslog_cutpaid(act, val, cust, cont = '') {

    syslog_executed(act = act, val = val, type = 'cpa', cust = cust, content = cont)
}
function syslog_cutimg(act, val, cust) {
    syslog_executed(act = act, val = val, type = 'cim', cust = cust, content = '')
}
function syslog_cutimgfo(act, val, cust) {
    syslog_executed(act = act, val = val, type = 'cfo', cust = cust, content = '')
}
function syslog_cutccc(act, cust, content) {

    syslog_executed(act = act, val = '', type = 'ccc', cust = cust
        , content = content != undefined ? content.substring(0, 100) : '')
}
function syslog_cuttreat(act, cust, content) {

    syslog_executed(act = act, val = '', type = 'ctr', cust = cust
        , content = content != undefined ? content.substring(0, 100) : '')
}
function syslog_cutpre(act, cust, content) {

    syslog_executed(act = act, val = '', type = 'cpr', cust = cust
        , content = content != undefined ? content.substring(0, 100) : '')
}
function syslog_cutdia(act, cust, content) {

    syslog_executed(act = act, val = '', type = 'cdi', cust = cust
        , content = content != undefined ? content.substring(0, 100) : '')
}
function syslog_cutcon(act, cust, content) {

    syslog_executed(act = act, val = '', type = 'cco', cust = cust
        , content = content != undefined ? content.substring(0, 100) : '')
}
function syslog_cuttes(act, cust, content) {

    syslog_executed(act = act, val = '', type = 'cte', cust = cust
        , content = content != undefined ? content.substring(0, 100) : '')
}
function syslog_cutteeth(act, cust, content) {
    syslog_executed(act = act, val = '', type = 'cst', cust = cust
        , content = content != undefined ? content.substring(0, 100) : '')
}
function syslog_cutlabo(act, val, cust, content) {
    syslog_executed(act = act, val = val, type = 'cla', cust = cust
        , content = content != undefined ? content.substring(0, 100) : '')
}
function syslog_cutcard(act, val, cust, content) {
    syslog_executed(act = act, val = val, type = 'ccr', cust = cust
        , content = content != undefined ? content.substring(0, 100) : '')
}
function syslog_cutmed(act, val, cust, content) {
    syslog_executed(act = act, val = val, type = 'cme', cust = cust
        , content = content != undefined ? content.substring(0, 100) : '')
}
function syslog_cutser(act, val, cust, content) {
    syslog_executed(act = act, val = val, type = 'cse', cust = cust
        , content = content != undefined ? content.substring(0, 100) : '')
}
function syslog_cutapp(act, val, cust, content) {
    syslog_executed(act = act, val = val, type = 'cap', cust = cust
        , content = content != undefined ? content.substring(0, 100) : '')
}
function syslog_cutsap(act, val, cust, content) {
    syslog_executed(act = act, val = val, type = 'sap', cust = cust
        , content = content != undefined ? content.substring(0, 100) : '')
}
function syslog_cutinsu(act, val, cust, content) {
    syslog_executed(act = act, val = val, type = 'cis', cust = cust
        , content = content != undefined ? content.substring(0, 100) : '')
}
function syslog_cutinta(act, val, cust, content) {
    syslog_executed(act = act, val = val, type = 'cit', cust = cust
        , content = content != undefined ? content.substring(0, 100) : '')
}
function syslog_cutprofile(act, cust, content) {
    syslog_executed(act = act, val = '', type = 'ccp', cust = cust, content = content ?? '')
}
function syslog_cutprofilevalid(act, cust) {
    syslog_executed(act = act, val = '', type = 'ccp', cust = cust, content = 'valid')
}
function syslog_cutctt(act, value = '') {
    syslog_executed(act = act, val = value, type = 'ctt', cust = 0
        , '')
}
function syslog_cutcpc(act, value = '', cust, content = "") {
    syslog_executed(act = act, val = value, type = 'cpc', cust = cust
        , content = content != undefined ? content.substring(0, 100) : '')
}
function syslog_custexa(act, cust, content = "") {
    syslog_executed(act = act, val = '', type = 'cex', cust = cust
        , content = content != undefined ? content.substring(0, 100) : '')
}
//Employee
function syslog_emp(act, val, content) {
    syslog_executed(act = act, val = val, type = 'emp', cust = 0, content = content ?? '')
}

//User
function syslog_usr(act, val, content) {
    syslog_executed(act = act, val = val, type = 'usr', cust = 0, content = content ?? '')
}

//Misa
function syslog_misa(act, val, cust = 0) {
    syslog_executed(act = act, val = val, type = 'mis', cust = cust, content = '')
}
// #endregion

//#region // Call sms
function syslog_call(act, val) {
    syslog_executed(act = act, val = val, type = 'ccl', cust = '', content = '')
}
function syslog_sms(act, val, content) {
    syslog_executed(act = act, val = val, type = 'csm', cust = '', content = content)
}
//#endregion

//#region // Khóa đào tạo

function syslog_stpaid(act, val) {
    syslog_executed(act = act, val = val, type = 'stp', cust = '', content = '')
}

//#endregion

//#region // LOGIN

function syslog_userlogin(act, val, content) {
    syslog_executed(act = act, val = val, type = 'ulg', cust = '', content = content)
}

//#endregion


//#region // TICKET
function syslog_ticket(act, val, content = '') {
    syslog_executed(act = act, val = val, type = 'tic', cust = '', content = content, lengthContent = 1000)
}

function syslog_ticprofile(act, value = '') {
    syslog_executed(act = act, val = value, type = 'tti', cust = 0
        , '')
}

//#endregion


//#region // SETTING

//#2023-02-18
function syslog_settingsbranch(act, val) {
    syslog_executed(act = act, val = val, type = 'sbr', cust = '', content = '')
}

//#endregion

//#region // Execute

async function syslog_executed(act, val, type, cust, content, lengthContent = 100) {
    await new Promise((resolve, reject) => {
        setTimeout(
            () => {
                try {
                    if (typeof sys_userID_Main !== 'undefined' && sys_userID_Main != ''
                        && typeof Master_branchID !== 'undefined' && Master_branchID != '') {
                        let e = {};
                        e.BranchID = Master_branchID;
                        e.UserID = sys_userID_Main;
                        e.CustomerID = (cust != undefined && cust != "") ? cust : 0;
                        e.Type = type;
                        e.Content = content != undefined ? content.substring(0, lengthContent) : '';
                        e.Page = syslog_getpath()
                        e.Action = act;
                        e.Value = val.replaceAll('"', '').toString();
                        AjaxJWT(url = "/api/Log/Add?ver=" + e.Value
                            , data = JSON.stringify(e)
                            , async = true
                            , success = function (result) {
                            }
                        );
                    }
                } catch (e) { }
                resolve();
            }
        )
    });


}

function syslog_getpath() {
    try {
        return location.pathname;
    }
    catch (e) {
        return "";
    }
}
//#endregion