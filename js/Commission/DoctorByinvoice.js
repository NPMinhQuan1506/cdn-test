function RevenueDoctorInvoiceTreat({
    DateFrom, DateTo, BranchID, MyLoad, CurrentMaster = 0,
    MAXDATE = 31, LIMITLOAD = 70000,
    fnSetting_Before, fnSetting_Complete, // Callback setting
    fnMaster_Before, fnMaster_Complete, fnMaster_CountComplete, // Callback Master Load
    fnDetail_Before, fnDetail_Complete, fnDetail_CountComplete, // Callback Detail Load
    ver = "0"
}) {
    RevenueDoctorInvoiceTreat.prototype.settings = this;

    //#region //

    this.DateFrom = DateFrom;
    this.DateTo = DateTo;
    this.BranchID = BranchID;
    this.MyLoad = MyLoad;
    this.CurrentMaster = 0

    this.MAXDATE = MAXDATE;
    this.LIMITLOAD = LIMITLOAD;

    this.XhrRevenueLoad = null;

    //#endregion

    //#region // REVENUE SETTINGS

    //# Doctor
    this.IsDocDevide = 0;
    this.IsDocGreater = 0;
    this.CostLabo = 0;

    this.IsDocTreatDevide = 0; // THEO ĐIỀU TRỊ (DoctorByTreat.js)
    this.IsDocTreatExCost = 0;

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

    this.DataRevAll = [];

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
        let settings = RevenueDoctorInvoiceTreat.prototype.settings;
        settings.LoadData_Prepare_Report();
    }

    this.LoadData_Prepare_Report = function () {
        try {
            let settings = RevenueDoctorInvoiceTreat.prototype.settings;
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
                        settings.CostLabo = (Number(_item.Doc_ExCost) > 0 ? 1 : 0);

                        settings.IsDocTreatDevide = Number(_item.Docnomoney_Devide);
                        settings.IsDocTreatExCost = (Number(_item.DocTreat_ExCost) > 0 ? 1 : 0);

                        settings.IsAssDevide = Number(_item.KTVPTM_Devide);
                        settings.IsAssGreater = Number(_item.KTVPTM_Greater);

                        settings.IsTeleFirst = Number(_item.TeleSale_First);
                        settings.IsTeleExProduct = Number(_item.TeleSale_ExProduct);

                        settings.IsConDevide = Number(_item.Consult_Devide);

                        settings.IsCSKHExFirst = Number(_item.Cskh_Exfirst);

                        settings.IsSuppDevide = Number(_item.Support_Devide);
                    }
                    if (typeof settings.fnSetting_Complete === 'function')
                        settings.fnSetting_Complete();
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
        let settings = RevenueDoctorInvoiceTreat.prototype.settings;
        let { BranchID, DateFrom, DateTo, MyLoad, MAXDATE } = settings;
        let date = DateFrom + " to " + DateTo;
        let obj = {};
        obj.date = date;
        obj.maxdate = MAXDATE;
        obj.branch = BranchID;
        obj.empid = MyLoad;
        AjaxJWT(url = "/api/Commission/RevDoctorInvoiceTreat_LoadData"
            , data = JSON.stringify(obj)
            , async = true
            , success = function (result) {
                let data = JSON.parse(result);
                let datatreat = data.Table;
                let datacom = data.Table1;
                let datamerge = datatreat.concat(datacom);
                settings.RevenueAll_Count(datamerge);
                if (Number(MyLoad) != 0) {
                    if (typeof settings.RevenueDetail_Load === 'function')
                        settings.RevenueDetail_Load(MyLoad);
                }
                else {
                    settings.DataRevMaster = settings.RevenueMaster_Count(settings.DataRevAll);
                    if (typeof settings.fnMaster_CountComplete === 'function')
                        settings.fnMaster_CountComplete(settings.DataRevMaster);
                    if (typeof settings.fnMaster_Complete === 'function')
                        settings.fnMaster_Complete();
                }
            }
            , before = function (e) {
                if (typeof settings.fnMaster_Before === 'function') settings.fnMaster_Before();
            }
        );
        return false;
    }
    //#region // ALL
    this.RevenueAll_Count = function (data) {
        new Promise((resolve, reject) => {
            let settings = RevenueDoctorInvoiceTreat.prototype.settings;
            settings.DataRevAll = [];
            let realamount = 0, commission = 0;
            if (data && data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    commission = data[i].Amount != 0
                        ? ((data[i].TotalPaid / data[i].Price) * data[i].Amount * data[i].Quantity)
                        : (data[i].TotalPaid * data[i].Percent) / 100;
                    realamount = (commission * data[i].RePercent / 100);
                    if (data[i].Manual_Revenue == 1) {
                        if (data[i].BS1 != 0) settings.RevenueAll_Push(data[i], "BS1", "RealAmount1", realamount, commission);
                        if (data[i].BS2 != 0) settings.RevenueAll_Push(data[i], "BS2", "RealAmount2", realamount, commission);
                        if (data[i].BS3 != 0) settings.RevenueAll_Push(data[i], "BS3", "RealAmount3", realamount, commission);
                    }
                    else {
                        if (data[i].BS1 != 0) settings.RevenueAll_Push(data[i], "BS1", "RealAmount1", realamount, commission);
                    }
                }
            }
            resolve();
        })
    }

    this.RevenueAll_Push = function (item, fieldemp, fieldamount, realamount, commission) {
        try {
            let e = JSON.parse(JSON.stringify(item));
            let settings = RevenueDoctorInvoiceTreat.prototype.settings;
            e.RealAmount = (item.Manual_Revenue == 0 ? realamount : item[fieldamount]);
            e.Commission = (item.Manual_Revenue == 0 ? commission : item[fieldamount]);
            e.Emp = item[fieldemp];
            e.Empname = settings.RevenueDetail_EmpName(item[fieldemp]);
            e.Empcode = settings.RevenueDetail_EmpCode(item[fieldemp]);
            settings.DataRevAll.push(e);
        }
        catch (ex) {
        }
    }
    //#endreigon

    //#region // Master
    this.RevenueMaster_Count = function (data) {
        let result = [];
        if (data && data.length != 0) {
            let settings = RevenueDoctorInvoiceTreat.prototype.settings;
            let EmpReady = [];
            let arrTab = [];
            let total = {};
            total.emp = 0;
            total.realamount = 0;
            total.paymentperiod = 0;
            total.totalPaid = 0;
            for (let i = 0; i < data.length; i++) {
                let item = data[i];
                if (!EmpReady.includes(item.Emp)) {
                    EmpReady.push(item.Emp);
                    let DataEmp = data.filter(word => { return word.Emp == item.Emp });
                    if (DataEmp && DataEmp.length != 0) {
                        let e = {};
                        e.emp = 0;
                        e.realamount = 0;
                        e.paymentperiod = 0;
                        e.totalPaid = 0;
                        let arrtabemp = [];
                        for (let i = 0; i < DataEmp.length; i++) {
                            let item = DataEmp[i];
                            let emp_sametab = !arrtabemp.includes(item.TabID);
                            if (emp_sametab) arrtabemp.push(item.TabID);
                            e.emp = item.Emp;
                            e.stt = i + 1;
                            e.empName = settings.RevenueDetail_EmpName(item.Emp);
                            e.realamount += item.RealAmount;
                            e.paymentperiod += emp_sametab ? item.PaymentPeriod : 0;
                            e.totalPaid += emp_sametab ? item.TotalPaid : 0;
                            let isSameTab = !arrTab.includes(item.TabID)
                            if (isSameTab) {
                                arrTab.push(item.TabID);
                                total.paymentperiod += item.PaymentPeriod;
                                total.totalPaid += item.TotalPaid;
                            }
                            total.realamount += item.RealAmount;
                        }
                        if (e?.ID != 0) result.push(e);
                    }
                }
            }
            result.unshift(total)
        }
        return result;
    }
    //#endreigon

    //#region // DETAIL
    this.RevenueDetail_Load = function (EmployeeID) {
        let settings = RevenueDoctorInvoiceTreat.prototype.settings;
        if (typeof settings.fnDetail_Before === 'function')
            settings.fnDetail_Before(settings.DataRevDetail);

        if (EmployeeID == 0) settings.DataRevDetail = settings.DataRevAll;
        else {
            settings.DataRevDetail = settings.DataRevAll.filter(word => {
                return word.Emp == EmployeeID
            });
        }

        if (typeof settings.fnDetail_Complete === 'function')
            settings.fnDetail_Complete(settings.DataRevDetail);

        if (typeof settings.fnDetail_CountComplete === 'function')
            settings.fnDetail_CountComplete(settings.DataRevDetail);

        return false;
    }

    //#endregion

    //#region // EXPORT

    this.ExportMaster = async function (filename) {
        let settings = RevenueDoctorInvoiceTreat.prototype.settings;
        let dataExport = { "stt": "STT", "empName": Outlang["Bac_si"], "realamount": Outlang["Hoa_hong"] };
        let nameFile = filename != '' ? filename : Outlang['Doanh_thu_tong_ky_thuat_vien'];
        await exportJsonToExcel(nameFile, settings.DataRevMaster, dataExport);
    }

    this.ExportDetail = async function (filename, isOption, idElement) {
        let settings = RevenueDoctorInvoiceTreat.prototype.settings;
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
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='Source']`)).is(":checked"),
                data: Outlang["Ma_ho_so"]
            }
            , "CustPhone": {
                dataNamePer: 'CustPhone',
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='CustPhone']`)).is(":checked"),
                data: Outlang["So_dien_thoai"]
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
                data: (Outlang["Ma_dich_vu"] != undefined ? Outlang["Ma_dich_vu"] : 'Mã dịch vụ')
            }
            , "ServiceID": [Outlang["Dich_vu"], (v) => { return settings.RevenueDetail_ServiceName(v) }]
            , "ServiceType": (Outlang["Loai_dich_vu"] != undefined ? Outlang["Loai_dich_vu"] : 'Loại dịch vụ')
            , "SaleCode": {
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='SaleCode']`)).is(":checked"),
                data: Outlang["Ma_len_don"]
            }
            , "Qty": {
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='Quantity']`)).is(":checked"),
                data: Outlang["Sl"] ?? "Sl"
            }
            , "Price_Root": {
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='Price_Root']`)).is(":checked"),
                data: (Outlang["Gia_ban_dau"] ?? 'Giá ban đầu')
            }
            , "Price": {
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='Price']`)).is(":checked"),
                data: Outlang["Thanh_tien"]
            }
            , "Paid": {                
                data: Outlang["Sys_thanh_toan"]
            }
            , "Detail": [Outlang["Chi_tiet_dich_vu_dieu_tri"], (v, { TimeTreatIndex, TimeTreat, TeethType, TeethChoosing }) => {
                return ((Number(sys_dencos_Main) == 1)
                    ? (`${(TeethChoosing != '') ? Fun_GetTeeth_ByToken(DataTeeth, TeethChoosing, TeethType) : ''} `)
                    : (Outlang['Lan_dieu_tri'] + ': ' + TimeTreatIndex + ' | ' + TimeTreat));
            }]
            , "NewPer": [`% ${Outlang["Dieu_tri"]}`, (v, { NewPer, TimeTreatIndex, TimeTreat }) => {
                return ((Number(sys_dencos_Main) == 1)
                    ? (NewPer)
                    : (Number(TimeTreat) != 0 ? ((Number(TimeTreatIndex) / Number(TimeTreat)) * 100).toFixed(2) : 0));
            }]
            , "PercentOfService": [(`% ${Outlang["Hoan_thanh"] ?? "Hoàn thành"}`), (v, { TimeTreatIndex, TimeTreat, TreatDetail, PercentOfService, TeethChoosing, TreatPercentDetail, Quantity }) => {
                return this.RevenueDetail_TreatmentOrPercentService(TimeTreatIndex, TimeTreat, TreatDetail, PercentOfService, TeethChoosing, TreatPercentDetail, Quantity)
            }]
            , "Empname": Outlang["Bac_si"]
            , "Empcode": {
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='EmpCode']`)).is(":checked"),
                data: Outlang["Ma_nhan_vien"] ?? "Mã nhân viên"
            }
            , "Commission": Outlang["Hoa_hong"]
            , "RePercent": "%" + (Outlang["Thuc_lanh"] ?? "Thực lãnh")
            , "RealAmount": Outlang["Thuc_lanh"] ?? "Thực lãnh"
            , "NumDateDevide": {
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='datedevide']`)).is(":checked"),
                data: [Outlang["Ngay_chia_hoa_hong"] ?? "Ngày chia", (v) => { return SysDate().FUTCFULLNUM(v).DateText() }]
            }
            , "PaymentPeriod": Outlang["Dt_trong_ky"] ?? 'Dt trong kỳ'
            , "PaymentService": Outlang["Doanh_thu"]
            , "TabNumCreated": {
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='datecreated']`)).is(":checked"),
                data: [Outlang["Ngay_thanh_toan"], (v) => { return SysDate().FUTCFULLNUM(v).DateText() }]
            }
            , "NumDatePay": {
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='datepay']`)).is(":checked"),
                data: [Outlang["Ngay_len_dich_vu"] ?? "Ngày lên dịch vụ", (v) => { return SysDate().FUTCFULLNUM(v).DateText() }]
            }
            , "Date": {
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='Date']`)).is(":checked"),
                data: [Outlang["Ngay_dieu_tri"], (v) => { return SysDate().FUTC(v).DateText() }]
            }
            , "BranchName": {
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='Branch']`)).is(":checked"),
                data: Outlang["Ten_chi_nhanh"]
            }
            , "IsNew": {
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='CusNew']`)).is(":checked"),
                data: [Outlang["Khach_hang_moi"] ?? "Khách hàng mới", (v) => { return v == 1 ? "new" : "" }]
            }
            , "Note": Outlang["Ghi_chu_hoa_hong"] == undefined ? 'Ghi chú hoa hồng' : Outlang["Ghi_chu_hoa_hong"]            
            , "InsurAmount": {
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='amount_insurance']`)).is(":checked"),
                data: [Outlang["Bao_hiem"], (v) => { return v }]
            }
            , "TreatContent": {
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='TreatContent']`)).is(":checked"),
                data: (Outlang["Noi_dung_dieu_tri"] != undefined ? Outlang["Noi_dung_dieu_tri"] : 'Nội dung điều trị')
            }
            , "Manual_Revenue": {
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='Craftsmanship']`)).is(":checked"),
                data: Outlang["Thu_cong"]
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

    this.RevenueDetail_TreatmentOrPercentService = function (TreatIndex, TimeToTreatment, TreatDetail, PercentOfService, TeethChoosing, Treat_Percent_Detail, Quantity) {
        try {
            let result = 100;
            if (sys_dencos_Main == 0) result = TimeToTreatment != 0 ? (100 * TreatIndex / TimeToTreatment) : 0;
            else {
                if (TreatDetail == 0) result = PercentOfService;
                else {
                    if (TeethChoosing != '') result = (Quantity != 0) ? (Treat_Percent_Detail / Quantity) : 0;
                    else result = Treat_Percent_Detail;
                }
            }
            return result;
        }
        catch (ex) {
            return 0;
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