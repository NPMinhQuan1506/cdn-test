//--Description: @Type = 1 Cust - Paid Service / Product
//--				  =	2 Cust - Refund Service / Product
//--   				  = 3 Cust - Paid Deposit
//--   				  =	4 Cust - Refund Deposit
//--   				  = 5 Cust - Paid Card
//--   				  =	6 Cust - Refund Card
//--   				  = 7 Cust - Paid Medicine
//--   				  = 8 Cust - Broker Commission
//--   				  = 9 Branch - Receipt Branch
//--				  = 10 Branch - Expense
var APIAccount_dataSetting = [];
var APIAccount_FinSave = "save" //kế toán tài chính
var APIAccount_FinDel = "save" //kế toán tài chính
var APIAccount_WareSave = "waresave" //kế toán tài chính
var APIAccount_WareDel = "waredel" //kế toán tài chính
//#region //Excute

async function APIAccount_ExcutedEach(dataMain, topic = '', action = 'save') {
    return new Promise(resolve => {
        let paras = apia_mapping(APIAccount_dataSetting)(dataMain);
        let {objResult,dataVoucher}=paras;
        
        if (typeof objResult != 'undefined' && typeof dataVoucher != 'undefined' && Object.keys(objResult).length > 0) {
            let branchid = 0, custid = 0, isupdate = 0;
            let topicVoucher = "";
            branchid = dataMain[0].BranchID;
            custid = dataMain[0].CustID;
            isupdate = dataMain[0].IsUpdate;
            topicVoucher = topic == '' ? dataMain[0].Code : topic;

            AjaxJWT(url = "/api/Accounting/Excuted"
                , data = JSON.stringify({
                    "para": JSON.stringify(objResult),
                    "dataVoucher": JSON.stringify(dataVoucher),
                    "page": apia_getpath(),
                    "branchid": branchid,
                    "custid": custid,
                    "topic": topicVoucher,
                    "action": action,
                    "isupdate": isupdate
                })
                , async = true
                , success = function (result) {
                    resolve(result);
                }
            );
        }
        else {
            //if(typeof failurefunc==='function') failurefunc();
            resolve(0);
        }
    })
}

async function APIAccount_Excute(currentID, type, action = 'save', beforefunc, successfunc, failurefunc, completefunc) {
    if (typeof beforefunc === 'function') beforefunc();
    new Promise((resolve) => {
        setTimeout(() => {
              
            if (typeof syn_Accountbrand != 'undefined' && syn_Accountbrand && syn_Accountbrand != "") {
                AjaxJWT(url = "/api/Accounting/LoadData"
                    , data = JSON.stringify({
                        "currentID": currentID,
                        "type": type,
                        "action": action
                    })
                    , async = true
                    , success = function (result) {
                        if (result != "0") {
                            let datas = JSON.parse(result);
                            APIAccount_dataSetting = datas.DataSetting;
                            let APIAccount_dataMain = datas.DataMain;                            
                            APIAccount_ExcutedEach(APIAccount_dataMain, topic = '', action).then(r => {
                                if (r == "1") {
                                    if (typeof successfunc === 'function') successfunc();
                                }
                                else {
                                    if (typeof failurefunc === 'function') failurefunc();
                                }
                            });
                        }
                        else {
                            if (typeof failurefunc === 'function') failurefunc();
                        }
                        resolve();
                        if (typeof completefunc === 'function') completefunc();
                    }
                );
            }
        }, 100)
    })
}
async function APIAccount_ExcuteMulti(data, action = 'save', beforefunc, successfunc, failurefunc, completefunc) {
    if (typeof beforefunc === 'function') beforefunc();
    new Promise((resolve) => {
        setTimeout(() => {

            if (typeof syn_Accountbrand != 'undefined' && syn_Accountbrand && syn_Accountbrand != "") {
                AjaxJWT(url = "/api/Accounting/LoadDataMulti"
                    , data = JSON.stringify({
                        "data": data
                    })
                    , async = true
                    , success = function (result) {
                        if (result != "0") {
                            let datas = JSON.parse(result);
                            let { DataSetting, ...dataMains } = datas;
                            APIAccount_dataSetting = DataSetting;  
                            let objKeys = Object.keys(dataMains);
                            let accPromises = [];
                            let dateNow = new Date();
                            let topic = `SyncMulti_${SysDate().FUTC(dateNow).UTCDateText()}`;
                            if (dataMains && objKeys.length > 0) {
                                for (let i = 0; i < objKeys.length; i++) {
                                    let key = objKeys[i];
                                    let dataMain = dataMains[key];
                                    accPromises.push(APIAccount_ExcutedEach(dataMain, topic, action));
                                }
                                Promise.all(accPromises).then(v => { });
                                if (typeof successfunc === 'function') successfunc();
                            }
                            else {
                                if (typeof failurefunc === 'function') failurefunc();
                            }
                            let APIAccount_dataMain = datas.DataMain;
                            
                        }
                        else {
                            if (typeof failurefunc === 'function') failurefunc();
                        }
                        resolve();
                        if (typeof completefunc === 'function') completefunc();
                    }
                );
            }
        }, 100)
    })
}

//#endregion
