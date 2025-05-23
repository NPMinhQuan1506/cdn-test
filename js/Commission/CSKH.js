﻿function RevenueCSKH({
    DateFrom, DateTo, BranchID, MyLoad = 0, CurrentMaster = 0,
    MAXDATE = 31, LIMITLOAD = 70000,
    fnSetting_Before, fnSetting_Complete, // Callback setting
    fnMaster_Before, fnMaster_Complete, fnMaster_CountComplete, // Callback Master Load
    fnDetail_Before, fnDetail_Complete, fnDetail_CountComplete, // Callback Detail Load
    ver = "0"
}) {

    RevenueCSKH.prototype.settings = this;

    //#region //

    this.DateFrom = DateFrom;
    this.DateTo = DateTo;
    this.BranchID = BranchID;
    this.MyLoad = MyLoad;
    this.CurrentMaster = CurrentMaster;

    this.MAXDATE = MAXDATE;
    this.LIMITLOAD = LIMITLOAD;

    this.XhrRevenueLoad = null;

    //#endregion

    //#region // REVENUE SETTINGS

    //# Doctor
    this.IsDocDevide = 0;
    this.IsDocGreater = 0;
    this.IsDocTreatDevide = 0; // THEO ĐIỀU TRỊ (DoctorByTreat.js)

    //# Assistant
    this.IsAssDevide = 0;
    this.IsAssGreater = 0;
    this.IsAssTreatDevide = 0; // THEO ĐIỀU TRỊ (AssistantByTreat.js)

    //# Tele
    this.IsTeleFirst = 0;
    this.IsTeleExProduct = 0; // Tele (tele.js)

    //# Consult
    this.IsConDevide = 0;

    //# CSKH
    this.IsCSKHExFirst = 0;

    this.IsCSKHCostLabo = 0;
    this.IsCSKHCostComsum = 0;
    this.IsCSKHCostVat = 0;
    this.IsCSKHCostIns = 0;


    //# Support
    this.IsSuppDevide = 0;

    //#endregion

    //#region // DATA MASTER & DETAIL

    this.DataRevMaster = [];

    this.DataRevDetail = [];

    //#endregion

    //#region // CALL BACK

    this.fnSetting_Before = fnSetting_Before;
    this.fnSetting_Complete = fnSetting_Complete;

    this.fnMaster_Before = fnMaster_Before;
    this.fnMaster_Complete = fnMaster_Complete;
    this.fnMaster_CountComplete = fnMaster_CountComplete;

    this.fnDetail_Before = fnDetail_Before;
    this.fnDetail_Complete = fnDetail_Complete;
    this.fnDetail_CountComplete = fnDetail_CountComplete;

    //#endregion

    this.Ver = ver ?? Math.floor(Math.random() * 1000);

    //#region // INIT

    this.Init = function () {
        let settings = RevenueCSKH.prototype.settings;
        settings.LoadData_Prepare_Report();
    }

    this.LoadData_Prepare_Report = function () {
        try {
            let settings = RevenueCSKH.prototype.settings;
            AjaxJWT(url = "/api/Commission/RevenueSettings?ver=" + settings.Ver
                , data = {}
                , async = true
                , success = function (result) {
                    let _data = [];
                    if (result != "" && result != "null") {
                        _data = JSON.parse(result);
                        let _item = _data[0];
                        settings.IsDocDevide = Number(_item.Doc_Devide);
                        settings.IsDocGreater = Number(_item.Doc_Greater);
                        settings.IsDocTreatDevide = Number(_item.Docnomoney_Devide);

                        settings.IsAssDevide = Number(_item.KTVPTM_Devide);
                        settings.IsAssGreater = Number(_item.KTVPTM_Greater);

                        settings.IsTeleFirst = Number(_item.TeleSale_First);
                        settings.IsTeleExProduct = Number(_item.TeleSale_ExProduct);

                        settings.IsConDevide = Number(_item.Consult_Devide);

                        settings.IsCSKHExFirst = Number(_item.Cskh_Exfirst);
                        settings.IsCSKHCostLabo = (Number(_item.Cskh_CostLabo) > 0 ? 1 : 0);
                        settings.IsCSKHCostComsum = (Number(_item.Cskh_CostComsum) > 0 ? 1 : 0);
                        settings.IsCSKHCostVat = (Number(_item.Cskh_CostVat) > 0 ? 1 : 0);
                        settings.IsCSKHCostIns = (Number(_item.Cskh_CostIns) > 0 ? 1 : 0);

                        settings.IsSuppDevide = Number(_item.Support_Devide);
                    }
                    if (typeof settings.fnSetting_Complete === 'function')
                        settings.fnSetting_Complete(result, _data);
                    settings.LoadData_Report();
                }
                , before = function (e) {
                    if (typeof settings.fnSetting_Before === 'function') settings.fnSetting_Before();
                }
            );
        }
        catch (ex) {

        }
    }

    //#endregion

    //#region // MASTER

    this.LoadData_Report = function () {
        let settings = RevenueCSKH.prototype.settings;
        let { BranchID, DateFrom, DateTo, MyLoad, MAXDATE } = settings;
        let date = DateFrom + " to " + DateTo;
        let obj = {};
        obj.date = date;
        obj.maxdate = MAXDATE;
        obj.branch = BranchID;
        AjaxJWT(url = "/api/Commission/RevCSKH_LoadData"
            , data = JSON.stringify(obj)
            , async = true
            , success = function (result) {
                if (result != "" && result != "null" && result != "0" && MyLoad != 1) {
                    let data = JSON.parse(result);
                    if (typeof settings.RevenueMaster_Count === 'function')
                        settings.RevenueMaster_Count(data.Table, data.Table1);
                }
                if (typeof settings.fnMaster_Complete === 'function')
                    settings.fnMaster_Complete(result);
            }
            , before = function (e) {
                if (typeof settings.fnMaster_Before === 'function')
                    settings.fnMaster_Before();
            }
        );
        return false;

    }

    this.RevenueMaster_Count = async function (data, datacom) {
        new Promise((resolve, reject) => {
            let settings = RevenueCSKH.prototype.settings;
            settings.DataRevMaster = [];
            let { IsCSKHExFirst } = settings;

            let maindt = [], realamount = 0;
            if (data && data.length > 0) {
                for (let i = 0; i < data.length; i++) {

                    if (IsCSKHExFirst == 0 || (IsCSKHExFirst == 1 && Number(data[i].IsFirstDay) == 0)) {

                        data[i].PriceAfterCost = data[i].Price;

                        let totalCost = data[i].CostManual;
                        data[i].PriceAfterCost -= data[i].CostManual;

                        if (settings.IsCSKHCostLabo == 1) { // LABO
                            data[i].PriceAfterCost -= data[i].CostLabo;
                            totalCost += data[i].CostLabo
                        }
                        if (settings.IsCSKHCostVat == 1) { // VAT
                            data[i].PriceAfterCost -= data[i].CostVat;
                            totalCost += data[i].CostVat
                        }
                        if (settings.IsCSKHCostComsum == 1) { // VTTH
                            data[i].PriceAfterCost -= data[i].CostComsum;
                            totalCost += data[i].CostComsum
                        }
                        if (settings.IsCSKHCostIns == 1) { // Ins
                            data[i].PriceAfterCost -= data[i].CostIns;
                            totalCost += data[i].CostIns
                        }

                        let totalPercentCost = data[i].Price > 0
                            ? (((data[i].Paid * 100) / data[i].Price) * totalCost / 100)
                            : 0;

                        commission = data[i].Amount != 0
                            ? (data[i].Amount * ((data[i].Paid * 100) / data[i].Price) / 100)
                            : ((data[i].Percent * (data[i].Paid - totalPercentCost)) / 100);

                        let RePercent = Number(data[i].RePercent);
                        RePercent = (RePercent > 0 && RePercent <= 100) ? RePercent : 100;

                        realamount = commission * RePercent / 100;

                        if (data[i].Emp != 0) {
                            let e = {};
                            e.emp = data[i].Emp;
                            e.realamount = realamount;
                            maindt.push(e);
                        }

                    }

                }

            }
            var result = [];
            let stt = 0;
            maindt.reduce(function (res, value) {
                if (!res[value.emp]) {
                    stt = stt + 1;
                    res[value.emp] = { stt: stt, emp: value.emp, realamount: 0, empName: settings.RevenueDetail_EmpName(value.emp) };
                    result.push(res[value.emp])
                    settings.DataRevMaster.push(res[value.emp]);
                }
                res[value.emp].realamount += value.realamount;
                return res;
            }, {});

            if (typeof settings.fnMaster_CountComplete === 'function')
                settings.fnMaster_CountComplete(result);

        })
    }

    //#endregion

    //#region // DETAIL

    this.RevenueDetail_Load = function (EmployeeID) {
        let settings = RevenueCSKH.prototype.settings;
        settings.CurrentMaster = EmployeeID;
        let { BranchID, DateFrom, DateTo, MAXDATE, LIMITLOAD, XhrRevenueLoad } = settings;
        if (XhrRevenueLoad && XhrRevenueLoad.readyState != 4) XhrRevenueLoad.abort();
        let date = DateFrom + " to " + DateTo;
        let obj = {};
        obj.date = date;
        obj.maxdate = MAXDATE;
        obj.limit = LIMITLOAD;
        obj.empid = settings.CurrentMaster;
        obj.branch = BranchID;
        XhrRevenueLoad = AjaxJWT(url = "/api/Commission/RevCSKH_LoadDetail"
            , data = JSON.stringify(obj)
            , async = true
            , success = function (result) {
                if (typeof settings.fnDetail_Complete === 'function')
                    settings.fnDetail_Complete(result);
                if (result != "0") {
                    let datas = JSON.parse(result);
                    let data = datas.Table;
                    settings.RevenueDetail_Count(data);
                }
            }
            , before = function (e) {
                if (typeof settings.fnDetail_Before === 'function')
                    settings.fnDetail_Before();

            }
        );
        return false;
    }

    this.RevenueDetail_Count = async function (data) {
        new Promise((resolve, reject) => {
            let settings = RevenueCSKH.prototype.settings;
            let { IsCSKHExFirst, CurrentMaster } = settings;
            settings.DataRevDetail = [];

            let realamount = 0;
            if (data && data.length > 0) {

                for (let i = 0; i < data.length; i++) {
                    if (IsCSKHExFirst == 0 || (IsCSKHExFirst == 1 && Number(data[i].IsFirstDay) == 0)) {

                        data[i].PriceAfterCost = data[i].Price;

                        let totalCost = data[i].CostManual;
                        data[i].PriceAfterCost -= data[i].CostManual;

                        if (settings.IsCSKHCostLabo == 1) { // LABO
                            data[i].PriceAfterCost -= data[i].CostLabo;
                            totalCost += data[i].CostLabo
                        }
                        if (settings.IsCSKHCostVat == 1) { // VAT
                            data[i].PriceAfterCost -= data[i].CostVat;
                            totalCost += data[i].CostVat
                        }
                        if (settings.IsCSKHCostComsum == 1) { // VTTH
                            data[i].PriceAfterCost -= data[i].CostComsum;
                            totalCost += data[i].CostComsum
                        }
                        if (settings.IsCSKHCostIns == 1) { // Ins
                            data[i].PriceAfterCost -= data[i].CostIns;
                            totalCost += data[i].CostIns
                        }

                        let totalPercentCost = data[i].Price > 0 ? (((data[i].Paid * 100) / data[i].Price) * totalCost / 100) : 0;

                        commission = data[i].Amount != 0
                           // ? data[i].Amount
                            ? (data[i].Amount * ((data[i].Paid * 100) / data[i].Price) / 100)
                            : ((data[i].Percent * (data[i].Paid - totalPercentCost)) / 100);

                        let RePercent = Number(data[i].RePercent);
                        RePercent = (RePercent > 0 && RePercent <= 100) ? RePercent : 100;

                        realamount = commission * RePercent / 100;

                        if (CurrentMaster != 0) {
                            if (data[i].Emp == CurrentMaster) settings.RevenueDetail_Push(data[i], "Emp", "RealAmount", realamount);
                        }
                        else {
                            if (data[i].Emp != 0) settings.RevenueDetail_Push(data[i], "Emp", "RealAmount", realamount);
                        }

                    }
                }
            }

            if (typeof settings.fnDetail_CountComplete === 'function')
                settings.fnDetail_CountComplete(JSON.parse(JSON.stringify(settings.DataRevDetail)))

            resolve();
        })
    }

    this.RevenueDetail_Push = function (item, fieldemp, fieldamount, realamount) {

        let e = JSON.parse(JSON.stringify(item));
        let settings = RevenueCSKH.prototype.settings;
        e.RealAmount = realamount;
        e.Emp = item[fieldemp];
        e.Empname = settings.RevenueDetail_EmpName(item[fieldemp]);
        e.Empcode = settings.RevenueDetail_EmpCode(item[fieldemp]);
        settings.DataRevDetail.push(e);

    }

    //#endregion

    //#region // EXPORT

    this.ExportMaster = async function (filename) {
        let settings = RevenueCSKH.prototype.settings;
        let dataExport = { "stt": "STT", "empName": Outlang["Nhan_vien_cham_soc"] ?? "Nhân viên chăm sóc", "realamount": Outlang["Hoa_hong"]};
        let nameFile = filename != '' ? filename : Outlang['Doanh_thu_tong'];
        await exportJsonToExcel(nameFile, settings.DataRevMaster, dataExport);
    }

    this.ExportDetail = async function (filename, isOption , idElement) {
        let settings = RevenueCSKH.prototype.settings;
        let isAll = (isOption == 0);
        let eleContainer = $('#' + idElement || ''); 
        let dataExport = {
            "CustCode": {
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='CusCode']`)).is(":checked"),
                data:Outlang["Ma_khach_hang"]
            } 
            , "CustName": Outlang["Khach_hang"] 
            , "SourceID": {
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='Source']`)).is(":checked"),
                data : [Outlang["Sys_nguon_khach_hang"], (v) => { return Fun_GetName_ByID(RP_DataCustomerSource, v) }]
            } 
            , "DocCode": {
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='DocCode']`)).is(":checked"),
                data : Outlang["Ma_ho_so"]
            }
            , "CustPhone": {
                dataNamePer: 'CustPhone',
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='CustPhone']`)).is(":checked"),
                data: [Outlang["So_dien_thoai"]]
            } 
            , "CustCodeOld": {
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='CusCodeOld']`)).is(":checked"),
                data : Outlang["Ma_khach_hang_cu"] != undefined ? Outlang["Ma_khach_hang_cu"] : 'Mã khách hàng cũ'
            } 
            , "CustAge": {
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='CustAge']`)).is(":checked"),
                data : Outlang["Tuoi"] != undefined ? Outlang["Tuoi"] : 'Tuổi' 
            }
            , "CustGender": {
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='CustGender']`)).is(":checked"),
                data:[Outlang["Gioi_tinh"], (v, { CustGender }) => { return (CustGender == 60 ? Outlang["Sys_nam"] : Outlang["Sys_nu1"]) }]
            } 
            , "CustAddress": {
                dataNamePer: 'CustAddress',
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='CustAddress']`)).is(":checked"),
                data : [Outlang["Sys_dia_chi_khach_hang1"]]
            }
            , "CustCommuneID": {
                dataNamePer: 'CustCommu',
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='CustCommu']`)).is(":checked"),
                data: [Outlang["Phuong_xa"] ?? 'Phường xã', (v) => {return (Fun_GetName_ByID(RP_DataCommune, v))}]
            }
            , "CustDistrictID": {
                dataNamePer: 'CustDistrict',
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='CustDistrict']`)).is(":checked"),
                data: [Outlang["Quan_huyen"] ?? 'Quận huyện', (v) => {return (Fun_GetName_ByID(RP_DataDistrict, v))}]
            }
            , "CustCityID": {
                dataNamePer: 'CustCity',
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='CustCity']`)).is(":checked"),
                data: [Outlang["Sys_thanh_pho"] ?? 'Thành phố', (v) => {return (Fun_GetName_ByID(RP_DataCity, v))}]
            } 
            , "ServiceID": [Outlang["Dich_vu"], (v) => { return settings.RevenueDetail_ServiceName(v) }]
            , "Quantity": Outlang["Sl"] ?? "Sl"
            , "Price_Root": Outlang["Gia_ban_dau"] ?? "Giá ban đầu"
            , "Price": Outlang["Thanh_tien"]
            , "Empname": Outlang["Nhan_vien_cham_soc"] ?? "Nhân viên chăm sóc"
            , "Empcode": {
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='EmpCode']`)).is(":checked"),
                data:Outlang["Ma_nhan_vien"] ?? "Mã nhân viên"
            } 
            , "RealAmount": Outlang["Hoa_hong"]
            , "Date": {
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='Date']`)).is(":checked"),
                data:[Outlang["Ngay_tao_dich_vu"], (v) => { return SysDate().FUTC(v).DateText() }]
            }
            , "Paid": Outlang["Sys_thanh_toan"]
            , "BranchName": {
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='Branch']`)).is(":checked"),
                data:Outlang["Chi_nhanh"]
            }
            , "IsNew": {
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='CusNew']`)).is(":checked"),
                data:[Outlang["Khach_hang_moi"] ?? "Khách hàng mới", (v) => { return v == 1 ? "new" : "" }]
            }
            , "DatePaid": {
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='DatePay']`)).is(":checked"),
                data:[Outlang["Ngay_thanh_toan"], (v) => { return SysDate().FUTC(v).DateText() }]
            }
            , "Invoice": {
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='Invoice']`)).is(":checked"),
                data: Outlang["Ma_hoa_don"]
            }
            
        };
        dataExport = Checking_TabControl_System_RebuildHeader(dataExport, tableBodyId = 'dtContentReportBody', PermissionTable_TabControl);
        let nameFile = filename != '' ? filename : Outlang["Doanh_thu"];
        await exportJsonToExcel(nameFile, settings.DataRevDetail, dataExport);
    }

    //#endregion

    //#region // OTHER

    this.RevenueDetail_ServiceName = function (id) {
        try {
            return RP_DataService[id].Name;
        }
        catch (ex) {
            return "";
        }
    }

    this.RevenueDetail_EmpName = function (id) {
        try {

            return RP_DataEmployee[id] != undefined ? RP_DataEmployee[id].Name : '';
        }
        catch (ex) {
            return "";
        }
    }
    this.RevenueDetail_EmpCode = function (id) {
        try {

            return RP_DataEmployee[id] != undefined ? RP_DataEmployee[id].Code : '';
        }
        catch (ex) {
            return "";
        }
    }

    //#endregion

}
