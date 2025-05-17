function RevenueManual({
    DateFrom, DateTo, BranchID, MyLoad = 0, CurrentMaster = 0,
    MAXDATE = 31, LIMITLOAD = 70000,
    fnSetting_Before, fnSetting_Complete, // Callback setting
    fnMaster_Before, fnMaster_Complete, fnMaster_CountComplete, // Callback Master Load
    fnDetail_Before, fnDetail_Complete, fnDetail_CountComplete, // Callback Detail Load
    ver = "0"
}) {

    RevenueManual.prototype.settings = this;

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
    this.IsDocExCost = 0;

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
        let settings = RevenueManual.prototype.settings;
        settings.LoadData_Prepare_Report();
    }

    this.LoadData_Prepare_Report = function () {
        try {
            let settings = RevenueManual.prototype.settings;
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
        let settings = RevenueManual.prototype.settings;
        let { BranchID, DateFrom, DateTo, MyLoad, MAXDATE } = settings;
        let date = DateFrom + " to " + DateTo;
        let obj = {};
        obj.date = date;
        obj.maxdate = MAXDATE;
        obj.branch = BranchID;
        AjaxJWT(url = "/api/Commission/RevManual_LoadData"
            , data = JSON.stringify(obj)
            , async = true
            , success = function (result) {
                if (result != "" && result != "null" && result != "0" && MyLoad != 1) {
                    let data = JSON.parse(result);
                    if (typeof settings.RevenueMaster_Count === 'function')
                        settings.RevenueMaster_Count(data.Table);
                }
                if (typeof settings.fnMaster_Complete === 'function') settings.fnMaster_Complete(result);
            }
            , before = function (e) {
                if (typeof settings.fnMaster_Before === 'function') settings.fnMaster_Before();
            }
        );
        return false;

    }

    this.RevenueMaster_Count = async function (datacom) {
        new Promise((resolve, reject) => {
            let settings = RevenueManual.prototype.settings;
            settings.DataRevMaster = [];
            let maindt = [], realamount = 0, commission = 0;
            if (datacom && datacom.length > 0) {
                for (let i = 0; i < datacom.length; i++) {
                    if (datacom[i].EMP1 != 0) {
                        let e = {};
                        e.emp = datacom[i].EMP1;
                        e.commission = datacom[i].Commission1;
                        e.realamount = datacom[i].Commission1;
                        maindt.push(e);
                    }
                    if (datacom[i].EMP2 != 0) {
                        let e = {};
                        e.emp = datacom[i].EMP2;
                        e.commission = datacom[i].Commission2;
                        e.realamount = datacom[i].Commission2;
                        maindt.push(e);
                    }
                    if (datacom[i].EMP3 != 0) {
                        let e = {};
                        e.emp = datacom[i].EMP3;
                        e.commission = datacom[i].Commission3;
                        e.realamount = datacom[i].Commission3;
                        maindt.push(e);
                    }
                }
            }
            
            var result = [];
            let stt = 0;
            maindt.reduce(function (res, value) {

                if (!res[value.emp]) {
                    stt = stt + 1;
                    res[value.emp] = { stt: stt, emp: value.emp, realamount: 0, commission: 0, empName: settings.RevenueDetail_EmpName(value.emp) };
                    result.push(res[value.emp])
                    settings.DataRevMaster.push(res[value.emp]);
                }
                res[value.emp].commission += value.commission;
                res[value.emp].realamount += value.realamount;

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
        let settings = RevenueManual.prototype.settings;
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
        XhrRevenueLoad = AjaxJWT(url = "/api/Commission/RevManual_LoadDetail"
            , data = JSON.stringify(obj)
            , async = true
            , success = function (result) {
                if (typeof settings.fnDetail_Complete === 'function')
                    settings.fnDetail_Complete(result);
                if (result != "0") {
                    let data = JSON.parse(result);
                    let datatabcom = data.Table;
                    let datatelecom = data.Table1;
                    let datacardcom = data.Table2;
                    let datatreatcom = data.Table3;
                    let datamerge = [].concat(datatabcom, datatelecom, datacardcom, datatreatcom);
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
            let settings = RevenueManual.prototype.settings;
            settings.DataRevDetail = [];
            let { CurrentMaster } = settings; 
            let realamount = 0, commission = 0;
            if (data && data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    if (CurrentMaster != 0) {
                        if(data[i].Manual_Revenue == 1){
                            if (data[i].Emp1 == CurrentMaster) settings.RevenueDetail_Push(data[i], "Emp1", "RealAmount1", realamount, commission);
                            if (data[i].Emp2 == CurrentMaster) settings.RevenueDetail_Push(data[i], "Emp2", "RealAmount2", realamount, commission);
                            if (data[i].Emp3 == CurrentMaster) settings.RevenueDetail_Push(data[i], "Emp3", "RealAmount3", realamount, commission);
                        }
                    }
                    else {
                        if(data[i].Manual_Revenue == 1){
                            if (data[i].Emp1 != 0) settings.RevenueDetail_Push(data[i], "Emp1", "RealAmount1", realamount, commission);
                            if (data[i].Emp2 != 0) settings.RevenueDetail_Push(data[i], "Emp2", "RealAmount2", realamount, commission);
                            if (data[i].Emp3 != 0) settings.RevenueDetail_Push(data[i], "Emp3", "RealAmount3", realamount, commission);
                        }
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
            let settings = RevenueManual.prototype.settings;
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
        let settings = RevenueManual.prototype.settings;
        let dataExport = { "stt": "STT", "empName": Outlang["Nhan_vien"], "realamount": Outlang["Tong_tien"] };
        let nameFile = filename != '' ? filename : Outlang['Doanh_thu_tong_ky_thuat_vien'];
        await exportJsonToExcel(nameFile, settings.DataRevMaster, dataExport);
    }

    this.ExportDetail = async function (filename, isOption , idElement) {
        let settings = RevenueManual.prototype.settings;
        let isAll = (isOption == 0);
        let eleContainer = $('#' + idElement || ''); 
        let dataExport = {
            "CustCode": Outlang["Ma_khach_hang"]
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
            , "SerCode": {
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='ServiceCode']`)).is(":checked"),
                data : Outlang["Ma_dich_vu"] != undefined ? Outlang["Ma_dich_vu"] : 'Mã dịch vụ'
            }
            , "ServiceID": [Outlang["Dich_vu"], (v) => {return settings.RevenueDetail_ServiceName(0, v)}] 
            , "SaleCode": {
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='SaleCode']`)).is(":checked"),
                data : Outlang["Ma_len_don"]
            }
            , "Quantity": Outlang["Sl"] ?? "Sl"
            , "Price_Root": Outlang["Gia_ban_dau"] ?? "Giá ban đầu"
            , "Price": Outlang["Thanh_tien"]
            , "Empname": Outlang["Nhan_vien"] 
            , "Empcode": {
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='EmpCode']`)).is(":checked"),
                data: Outlang["Ma_nhan_vien"] ?? "Mã nhân viên"      
            }     
            , "Commission": Outlang["Hoa_hong"]
            , "RePercent": {
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='RePercent']`)).is(":checked"),
                data:["% " + (Outlang["Thuc_lanh"] ?? "Thực lãnh"), (v) => { return (v != 0 ? v : 100) }]
            }
            , "RealAmount": Outlang["Thuc_lanh"] ?? "Thực lãnh"
            , "ServiceType": {
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='ServiceCat']`)).is(":checked"),
                data:Outlang["Nhom_dich_vu"]
            }
            , "PaymentService": Outlang["Sys_thanh_toan"]
            , "Date": {
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='DateService']`)).is(":checked"),
                data:[Outlang["Ngay_tao_dich_vu"], (v) => { return SysDate().FUTC(v).DateText() }]
            }
            , "DatePaid": [Outlang["Ngay_thanh_toan"], (v) => {return SysDate().FUTC(v).DateText()}]            
            , "BranchName": {
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='Branch']`)).is(":checked"),
                data: Outlang["Chi_nhanh"]
            } 
            , "IsNew": {
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='CusNew']`)).is(":checked"),
                data: [Outlang["Khach_hang_moi"] ?? "Khách hàng mới", (v) => { return v == 1 ? "new" : "" }]
            }
            , "TypeCom": [Outlang["Loai_hoa_hong"] ?? "Loại hoa hồng", (v) => {return decodeHtml(RevenueDetail_TypeCommission(v))}]
            , "Manual_Revenue": {
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='Manual_Revenue']`)).is(":checked"),
                data:[Outlang["Thu_cong"], (v) => { return v != 0 ? 'x' : '' }]
            }
            , "Note": {
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='CusNew']`)).is(":checked"),
                data:[Outlang["Ghi_chu_hoa_hong"]]
            }
        };
        dataExport = Checking_TabControl_System_RebuildHeader(dataExport, tableBodyId = 'dtContentReportBody', PermissionTable_TabControl);
        let nameFile = filename != '' ? filename : Outlang["Doanh_thu"];
        await exportJsonToExcel(nameFile, settings.DataRevDetail, dataExport);
    }

    //#endregion

    //#region // OTHER

    this.RevenueDetail_ServiceName = function (card, service) {
        try {
            if (card != 0) return RP_DataCard[card].Name;
            else return RP_DataService[service].Name;
        }
        catch (ex) {
            return "";
        }
    }

    this.RevenueDetail_TypeCommission = function (type) {
        try {
            let result = '';
            switch (type) {
                case 1:
                    result = Outlang["Sys_tu_van"];
                    break
                case 2:
                    result = "Telesale";
                    break
                case 3:
                    result = Outlang["Sys_the"];
                    break
                case 4:
                    result = Outlang["Bac_si"];
                    break
                case 5:
                    result = "KTV";
                    break
                default:
                    result = '';
            }
            return result;
        }
        catch (ex) {
            return "";
        }
    }
     
    this.RevenueDetail_ServiceType = function (type) {
        try {
            let result = '';
            switch (type) {
                case 0: result = Outlang["Dich_vu"] ?? 'Dịch vụ'
                    break;
                case 1: result = Outlang["San_pham"] ?? 'Sản phẩm'
                    break;
                case 2: result = Outlang["The"] ?? 'Thẻ'
                    break;
            }
            return result;
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