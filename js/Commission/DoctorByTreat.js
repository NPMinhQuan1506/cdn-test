﻿function RevenueDoctorTreat({
    DateFrom, DateTo, BranchID, MyLoad, CurrentMaster = 0,
    MAXDATE = 31, LIMITLOAD = 70000,
    fnSetting_Before, fnSetting_Complete, // Callback setting
    fnMaster_Before, fnMaster_Complete, fnMaster_CountComplete, // Callback Master Load
    fnDetail_Before, fnDetail_Complete, fnDetail_CountComplete, // Callback Detail Load
    ver = "0"
}) {
    RevenueDoctorTreat.prototype.settings = this;

    //#region //

    this.DateFrom = DateFrom;
    this.DateTo = DateTo;
    this.BranchID = BranchID;
    this.MyLoad = MyLoad ?? 0;
    this.CurrentMaster = 0

    this.MAXDATE = MAXDATE;
    this.LIMITLOAD = LIMITLOAD;

    this.XhrRevenueLoad = null;

    //#endregion

    //#region // REVENUE SETTINGS

    //# Doctor
    this.IsDocDevide = 0;
    this.IsDocGreater = 0;
    this.IsDocExCost = 0;

    this.IsDocTreatDevide = 0; // THEO ĐIỀU TRỊ (DoctorByTreat.js)
    this.IsDocTreatCostLabo = 0;
    this.IsDocTreatCostComsum = 0;
    this.IsDocTreatCostVat = 0;
    this.IsDocTreatCostIns = 0;

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
        let settings = RevenueDoctorTreat.prototype.settings;
        settings.LoadData_Prepare_Report();
    }

    this.LoadData_Prepare_Report = function () {
        try {
            let settings = RevenueDoctorTreat.prototype.settings;
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
                        settings.IsDocExCost = (Number(_item.Doc_ExCost) > 0 ? 1 : 0);

                        settings.IsDocTreatDevide = Number(_item.Docnomoney_Devide);

                        settings.IsDocTreatCostLabo = (Number(_item.DocTreat_CostLabo) > 0 ? 1 : 0);
                        settings.IsDocTreatCostComsum = (Number(_item.DocTreat_CostComsum) > 0 ? 1 : 0);
                        settings.IsDocTreatCostVat = (Number(_item.DocTreat_CostVat) > 0 ? 1 : 0);
                        settings.IsDocTreatCostIns = (Number(_item.DocTreat_CostIns) > 0 ? 1 : 0);

                        settings.IsAssDevide = Number(_item.KTVPTM_Devide);
                        settings.IsAssGreater = Number(_item.KTVPTM_Greater);

                        settings.IsTeleFirst = Number(_item.TeleSale_First);
                        settings.IsTeleExProduct = Number(_item.TeleSale_ExProduct);

                        settings.IsConDevide = Number(_item.Consult_Devide);

                        settings.IsCSKHExFirst = Number(_item.Cskh_Exfirst);

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
        let settings = RevenueDoctorTreat.prototype.settings;
        let { BranchID, DateFrom, DateTo, MyLoad, MAXDATE } = settings;
        let date = DateFrom + " to " + DateTo;
        let obj = {};
        obj.date = date;
        obj.maxdate = MAXDATE;
        obj.branch = BranchID;
        AjaxJWT(url = "/api/Commission/RevDoctorTreat_LoadData"
            , data = JSON.stringify(obj)
            , async = true
            , success = function (result) {
                if (result != "" && result != "null" && result != "0" && MyLoad != 1) {
                    let data = JSON.parse(result);
                    if (typeof settings.RevenueMaster_Count === 'function')
                        settings.RevenueMaster_Count(data.Table, data.Table1);
                }
                if (typeof settings.fnMaster_Complete === 'function') settings.fnMaster_Complete(result);
            }
            , before = function (e) {
                if (typeof settings.fnMaster_Before === 'function') settings.fnMaster_Before();
            }
        );
        return false;
    }

    this.RevenueMaster_Count = async function (data, datacom) {
        new Promise((resolve, reject) => {
            let settings = RevenueDoctorTreat.prototype.settings;
            settings.DataRevMaster = [];
            let { IsDocTreatDevide } = settings;
            let maindt = [], realamount = 0, perjson = 0, commission = 0;

            if (datacom && datacom.length > 0) {
                for (let i = 0; i < datacom.length; i++) {
                    if (datacom[i].EMP1 != 0) {
                        let e = {};
                        e.emp = datacom[i].EMP1;
                        e.commission = datacom[i].Commission1;
                        e.realamount = datacom[i].Commission1;
                        e.tabid = datacom[i].TabID;
                        e.paymentperiod = datacom[i].PaymentPeriod;
                        maindt.push(e);
                    }
                    if (datacom[i].EMP2 != 0) {
                        let e = {};
                        e.emp = datacom[i].EMP2;
                        e.commission = datacom[i].Commission2;
                        e.realamount = datacom[i].Commission2;
                        e.tabid = datacom[i].TabID;
                        e.paymentperiod = datacom[i].PaymentPeriod;
                        maindt.push(e);
                    }
                    if (datacom[i].EMP3 != 0) {
                        let e = {};
                        e.emp = datacom[i].EMP3;
                        e.commission = datacom[i].Commission3;
                        e.realamount = datacom[i].Commission3;
                        e.tabid = datacom[i].TabID;
                        e.paymentperiod = datacom[i].PaymentPeriod;
                        maindt.push(e);
                    }
                }
            }
            if (data && data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    let newpercent = (sys_dencos_Main == 1 || data[i].IsStage == 1)
                        ? data[i].NewPer
                        : (data[i].TimeTreat != 0
                            ? (100 * 1 / data[i].TimeTreat)
                            : 0);

                    data[i].PriceAfterCost = data[i].Price - data[i].CostManual;
                    if (settings.IsDocTreatCostLabo == 1) { // Kiểm tra trừ chi phí labo
                        data[i].PriceAfterCost -= data[i].CostLabo;
                    }
                    if (settings.IsDocTreatCostComsum == 1) { // VTTH
                        data[i].PriceAfterCost -= data[i].CostComsum;
                    }
                    if (settings.IsDocTreatCostVat == 1) { // VAT
                        data[i].PriceAfterCost -= data[i].CostVat;
                    }
                    if (settings.IsDocTreatCostIns == 1) { // INS
                        data[i].PriceAfterCost -= data[i].CostIns;
                    }

                    let amountequalper = newpercent != 0 ? (data[i].PriceAfterCost * newpercent / 100) : 0;

                    commission = data[i].Amount != 0
                        ? (((data[i].Amount * newpercent) / 100) * data[i].Quantity).toFixed(2)
                        : ((amountequalper * data[i].Percent) / 100).toFixed(2);

                    if (IsDocTreatDevide == 1) {
                        perjson = (data[i].BS1 != 0 ? 1 : 0) + (data[i].BS2 != 0 ? 1 : 0) + (data[i].BS3 != 0 ? 1 : 0) + (data[i].BS4 != 0 ? 1 : 0);
                        commission = perjson != 0 ? commission / perjson : 0;
                    }

                    realamount = (commission * data[i].RePercent / 100);
                    if (data[i].BS1 != 0) {
                        let e = {};
                        e.emp = data[i].BS1;
                        e.commission = commission;
                        e.realamount = realamount;
                        e.tabid = data[i].TabID;
                        e.paymentperiod = data[i].PaymentPeriod;
                        maindt.push(e);
                    }
                    if (data[i].BS2 != 0) {
                        let e = {};
                        e.emp = data[i].BS2;
                        e.commission = commission;
                        e.realamount = realamount;
                        e.tabid = data[i].TabID;
                        e.paymentperiod = data[i].PaymentPeriod;
                        maindt.push(e);
                    }
                    if (data[i].BS3 != 0) {
                        let e = {};
                        e.emp = data[i].BS3;
                        e.commission = commission;
                        e.realamount = realamount;
                        e.tabid = data[i].TabID;
                        e.paymentperiod = data[i].PaymentPeriod;
                        maindt.push(e);
                    }
                    if (data[i].BS4 != 0) {
                        let e = {};
                        e.emp = data[i].BS4;
                        e.commission = commission;
                        e.realamount = realamount;
                        e.tabid = data[i].TabID;
                        e.paymentperiod = data[i].PaymentPeriod;
                        maindt.push(e);
                    }
                }
            }
            var result = [];
            let stt = 0;
            let dttab = {};
            maindt.reduce(function (res, value) {
                if (!res[value.emp]) {
                    stt = stt + 1;
                    res[value.emp] = { stt: stt, emp: value.emp, realamount: 0, commission: 0, empName: settings.RevenueDetail_EmpName(value.emp), paymentperiod: 0 };
                    result.push(res[value.emp])
                    settings.DataRevMaster.push(res[value.emp]);
                }
                res[value.emp].commission += value.commission;
                res[value.emp].realamount += value.realamount;

                if (dttab?.[value.emp]?.[value.tabid] != 1) {
                    //res[value.emp].totalPaid += value.totalPaid;
                    res[value.emp].paymentperiod += value.paymentperiod;
                    if (dttab[value.emp]) {
                        dttab[value.emp][value.tabid] = 1;
                    }
                    else {
                        dttab[value.emp] = {};
                        dttab[value.emp][value.tabid] = 1;
                    }
                }
                return res;
            }, {});

            if (typeof settings.fnMaster_CountComplete === 'function')
                settings.fnMaster_CountComplete(result);

            resolve();
        });
    }

    //#endreigon

    //#region // DETAIL

    this.RevenueDetail_Load = function (EmployeeID) {
        let settings = RevenueDoctorTreat.prototype.settings;
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
        XhrRevenueLoad = AjaxJWT(url = "/api/Commission/RevDoctorTreat_LoadDetail"
            , data = JSON.stringify(obj)
            , async = true
            , success = function (result) {
                if (typeof settings.fnDetail_Complete === 'function')
                    settings.fnDetail_Complete(result);
                if (result != "0") {
                    let data = JSON.parse(result);
                    let datatreat = data.Table;
                    let datacom = data.Table1;
                    let datamerge = datatreat.concat(datacom);
                    settings.RevenueDetail_Count(datamerge);
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
            let settings = RevenueDoctorTreat.prototype.settings;
            settings.DataRevDetail = [];
            let { IsDocTreatDevide, CurrentMaster } = settings;

            let realamount = 0, perjson = 0, commission = 0;
            if (data && data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    let newpercent = (sys_dencos_Main == 1 || data[i].IsStage == 1)
                        ? data[i].NewPer
                        : (data[i].TimeTreat != 0
                            ? (100 * 1 / data[i].TimeTreat)
                            : 0);

                    data[i].PriceAfterCost = data[i].Price - data[i].CostManual;
                    if (settings.IsDocTreatCostLabo == 1) { // Kiểm tra trừ chi phí labo
                        data[i].PriceAfterCost -= data[i].CostLabo;
                    }
                    if (settings.IsDocTreatCostComsum == 1) { // VTTH
                        data[i].PriceAfterCost -= data[i].CostComsum;
                    }
                    if (settings.IsDocTreatCostVat == 1) { // VAT
                        data[i].PriceAfterCost -= data[i].CostVat;
                    }
                    if (settings.IsDocTreatCostIns == 1) { // INS
                        data[i].PriceAfterCost -= data[i].CostIns;
                    }

                    let amountequalper = newpercent != 0 ? (data[i].PriceAfterCost * newpercent / 100) : 0;

                    commission = data[i].Amount != 0
                        ? ((data[i].Amount * newpercent) / 100) * data[i].Quantity
                        : Number((amountequalper * data[i].Percent) / 100);

                    if (IsDocTreatDevide == 1) {
                        perjson = (data[i].BS1 != 0 ? 1 : 0) + (data[i].BS2 != 0 ? 1 : 0) + (data[i].BS3 != 0 ? 1 : 0) + (data[i].BS4 != 0 ? 1 : 0);
                        commission = perjson != 0 ? commission / perjson : 0;
                    }
                    realamount = (commission * data[i].RePercent / 100);
                    if (CurrentMaster != 0) {
                        if (data[i].BS1 == CurrentMaster) settings.RevenueDetail_Push(data[i], "BS1", "RealAmount1", realamount, commission);
                        if (data[i].BS2 == CurrentMaster) settings.RevenueDetail_Push(data[i], "BS2", "RealAmount2", realamount, commission);
                        if (data[i].BS3 == CurrentMaster) settings.RevenueDetail_Push(data[i], "BS3", "RealAmount3", realamount, commission);
                        if (data[i].BS4 == CurrentMaster) settings.RevenueDetail_Push(data[i], "BS4", "RealAmount4", realamount, commission);
                    }
                    else {
                        if (data[i].BS1 != 0) settings.RevenueDetail_Push(data[i], "BS1", "RealAmount1", realamount, commission);
                        if (data[i].BS2 != 0) settings.RevenueDetail_Push(data[i], "BS2", "RealAmount2", realamount, commission);
                        if (data[i].BS3 != 0) settings.RevenueDetail_Push(data[i], "BS3", "RealAmount3", realamount, commission);
                        if (data[i].BS4 != 0) settings.RevenueDetail_Push(data[i], "BS4", "RealAmount4", realamount, commission);
                    }
                }

                if (typeof settings.fnDetail_CountComplete === 'function') {
                    settings.fnDetail_CountComplete(JSON.parse(JSON.stringify(settings.DataRevDetail)))
                }
            }

            resolve();
        })
    }

    this.RevenueDetail_Push = function (item, fieldemp, fieldamount, realamount, commission) {
        try {
            let e = JSON.parse(JSON.stringify(item));
            let settings = RevenueDoctorTreat.prototype.settings;
            e.RealAmount = (item.Manual_Revenue == 0 ? realamount : item[fieldamount]);
            e.Commission = (item.Manual_Revenue == 0 ? commission : item[fieldamount]);
            e.Emp = item[fieldemp];
            e.Empname = settings.RevenueDetail_EmpName(item[fieldemp]);
            e.Empcode = settings.RevenueDetail_EmpCode(item[fieldemp]);
            settings.DataRevDetail.push(e);
        }
        catch (ex) {
        }
    }

    //#endregion

    //#region // EXPORT

    this.ExportMaster = async function (filename) {
        let settings = RevenueDoctorTreat.prototype.settings;
        let dataExport = { "stt": "STT", "empName": Outlang["Bac_si"], "realamount": Outlang["Hoa_hong"], "paymentperiod": Outlang["Dt_trong_ky"] ?? "DT trong kỳ" };
        let nameFile = filename != '' ? filename : Outlang['Doanh_thu_tong_ky_thuat_vien'];
        await exportJsonToExcel(nameFile, settings.DataRevMaster, dataExport);
    }

    this.ExportDetail = async function (filename, isOption, idElement) {
        let settings = RevenueDoctorTreat.prototype.settings;
        let isAll = (isOption == 0);
        let eleContainer = $('#' + idElement || '');
        let dataExport = {
            "CustCode": Outlang["Ma_khach_hang"]
            , "CustName": Outlang["Khach_hang"]
            , "SourceID": {
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='Source']`)).is(":checked"),
                data: [Outlang["Sys_nguon_khach_hang"], (v) => { return Fun_GetName_ByID(RP_DataCustomerSource, v) }]
            }
            , "DocCode": {
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='DocCode']`)).is(":checked"),
                data: Outlang["Ma_ho_so"]
            }
            , "CustPhone": {
                dataNamePer: 'CustPhone',
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='CustPhone']`)).is(":checked"),
                data: [Outlang["So_dien_thoai"]]
            }
            , "CustCodeOld": {
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='CustCodeOld']`)).is(":checked"),
                data: Outlang["Ma_khach_hang_cu"] != undefined ? Outlang["Ma_khach_hang_cu"] : 'Mã khách hàng cũ'
            }
            , "CustAge": {
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='CustAge']`)).is(":checked"),
                data: Outlang["Tuoi"] != undefined ? Outlang["Tuoi"] : 'Tuổi'
            }
            , "CustGender": {
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='CustGender']`)).is(":checked"),
                data: [Outlang["Gioi_tinh"], (v, { CustGender }) => { return (CustGender == 60 ? Outlang["Sys_nam"] : Outlang["Sys_nu1"]) }]
            }
            , "CustAddress": {
                dataNamePer: 'CustAddress',
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='CustAddress']`)).is(":checked"),
                data: [Outlang["Sys_dia_chi_khach_hang1"]]
            }
            , "CustCommuneID": {
                dataNamePer: 'CustCommu',
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='CustCommu']`)).is(":checked"),
                data: [Outlang["Phuong_xa"] ?? 'Phường xã', (v) => { return (Fun_GetName_ByID(RP_DataCommune, v)) }]
            }
            , "CustDistrictID": {
                dataNamePer: 'CustDistrict',
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='CustDistrict']`)).is(":checked"),
                data: [Outlang["Quan_huyen"] ?? 'Quận huyện', (v) => { return (Fun_GetName_ByID(RP_DataDistrict, v)) }]
            }
            , "CustCityID": {
                dataNamePer: 'CustCity',
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='CustCity']`)).is(":checked"),
                data: [Outlang["Sys_thanh_pho"] ?? 'Thành phố', (v) => { return (Fun_GetName_ByID(RP_DataCity, v)) }]
            }
            , "Service_Code": {
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='ServiceCode']`)).is(":checked"),
                data: Outlang["Ma_dich_vu"] != undefined ? Outlang["Ma_dich_vu"] : 'Mã dịch vụ'
            }
            , "ServiceID": [Outlang["Dich_vu"], (v) => { return settings.RevenueDetail_ServiceName(v) }]
            , "ServiceType": (Outlang["Loai_dich_vu"] != undefined ? Outlang["Loai_dich_vu"] : 'Loại dịch vụ')
            , "SaleCode": {
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='SaleCode']`)).is(":checked"),
                data: Outlang["Ma_len_don"]
            }
            , "Qty": {
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='Quantity']`)).is(":checked"),
                data: Outlang["Sl"] ?? `Sl`
            }
            , "Detail": [Outlang["Chi_tiet_dich_vu_dieu_tri"], (v, { TimeTreatIndex, TimeTreat, TeethType, TeethChoosing, IsStage }) => {
                return ((Number(sys_dencos_Main) == 1 || IsStage == 1)
                    ? (`${(TeethChoosing != '') ? Fun_GetTeeth_ByToken(DataTeeth, TeethChoosing, TeethType) : ''} `)
                    : (Outlang['Lan_dieu_tri'] + ': ' + TimeTreatIndex + ' | ' + TimeTreat));
            }]
            , "NewPer": [`% ${Outlang["Dieu_tri"]}`, (v, { NewPer, TimeTreatIndex, TimeTreat, IsStage }) => {
                return ((Number(sys_dencos_Main) == 1 || IsStage == 1)
                    ? (NewPer)
                    : (Number(TimeTreat) != 0 ? ((Number(TimeTreatIndex) / Number(TimeTreat)) * 100).toFixed(2) : 0));
            }]
            , "PercentOfService": `% ${Outlang["Hoan_thanh"]}`
            , "Empname": Outlang["Bac_si"]
            , "Empcode": {
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='EmpCode']`)).is(":checked"),
                data: Outlang["Ma_nhan_vien"] ?? "Mã nhân viên"
            }
            , "Commission": Outlang["Hoa_hong"]
            , "RePercent": `% ${Outlang["Thuc_lanh"] ?? `Thực lãnh`}`
            , "RealAmount": Outlang["Thuc_lanh"] ?? "Thực lãnh"
            , "PaymentPeriod": Outlang["Thu_trong_ky"]
            , "Price_Root": {
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='PriceRoot']`)).is(":checked"),
                data: Outlang["Gia_ban_dau"] ?? "Giá ban đầu"
            }
            , "PriceIni": {
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='PriceInt']`)).is(":checked"),
                data: Outlang["Thanh_tien"]
            }
            , "PriceIniPer": Outlang["Ds_trong_ky"] ?? "Ds trong kỳ"
            , "TotalPaid": Outlang["Doanh_thu"]
            , "TotalPaidPeriod": Outlang["Dt_trong_ky"] ?? "Dt trong kỳ"
            , "TotalDepositUsed": Outlang["Can_tru_tien_coc"]
            , "PaymentService": Outlang["Tong_tien_thu"]
            , "Date": {
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='Date']`)).is(":checked"),
                data: [Outlang["Ngay_dieu_tri"], (v) => { return SysDate().FUTC(v).DateText() }]
            }
            , "BranchName": {
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='Branch']`)).is(":checked"),
                data: Outlang["Chi_nhanh"]
            }
            , "IsNew": {
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='CusNew']`)).is(":checked"),
                data: [Outlang["Khach_hang_moi"] ?? "Khách hàng mới", (v) => { return v == 1 ? "new" : "" }]
            }
            , "Note": Outlang["Ghi_chu_hoa_hong"] == undefined ? 'Ghi chú hoa hồng' : Outlang["Ghi_chu_hoa_hong"]
            , "TreatContent": {
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='TreatContent']`)).is(":checked"),
                data: (Outlang["Noi_dung_dieu_tri"] != undefined ? Outlang["Noi_dung_dieu_tri"] : 'Nội dung điều trị')
            }
            , "Manual_Revenue": {
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='Craftsmanship']`)).is(":checked"),
                data: [Outlang["Chi_thu_cong"] ?? `Chi thủ công`, (v, { RealAmount }) => { return (v == 1 ? RealAmount : 0) }]
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