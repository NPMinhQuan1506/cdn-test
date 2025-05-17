function RevenueTelesale({
    DateFrom, DateTo, BranchID, MyLoad, CurrentMaster = 0,
    MAXDATE = 31, LIMITLOAD = 70000,
    fnSetting_Before, fnSetting_Complete, // Callback setting
    fnMaster_Before, fnMaster_Complete, fnMaster_CountComplete, // Callback Master Load
    fnDetail_Before, fnDetail_Complete, fnDetail_CountComplete, // Callback Detail Load
    ver = "0"
}) {

    RevenueTelesale.prototype.settings = this;

    //#region //

    this.DateFrom = DateFrom;
    this.DateTo = DateTo;
    this.BranchID = BranchID;
    this.MyLoad = MyLoad ?? 0;
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
    this.IsTeleDevide = 0; // Tele (tele.js)

    this.IsTeleCostLabo = 0;
    this.IsTeleCostComsum = 0;
    this.IsTeleCostVat = 0;
    this.IsTeleCostIns = 0;

    //# Consult
    this.IsConDevide = 0;

    //# CSKH
    this.IsCSKHExFirst = 0;

    //# Support
    this.IsSuppDevide = 0;

    //#endregion

    //#region // DATA MASTER & DETAIL

    this.DataRevAll = [];

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
        let settings = RevenueTelesale.prototype.settings;
        settings.LoadData_Prepare_Report();
    }

    this.LoadData_Prepare_Report = function () {
        try {
            let settings = RevenueTelesale.prototype.settings;
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
                        settings.IsTeleDevide = Number(_item.TeleSale_Devide);


                        settings.IsTeleCostLabo = (Number(_item.TeleSale_CostLabo) > 0 ? 1 : 0);
                        settings.IsTeleCostComsum = (Number(_item.TeleSale_CostComsum) > 0 ? 1 : 0);
                        settings.IsTeleCostVat = (Number(_item.TeleSale_CostVat) > 0 ? 1 : 0);
                        settings.IsTeleCostIns = (Number(_item.TeleSale_CostIns) > 0 ? 1 : 0);

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
        let settings = RevenueTelesale.prototype.settings;
        let { BranchID, DateFrom, DateTo, MAXDATE, LIMITLOAD, XhrRevenueLoad } = settings;
        let date = DateFrom + " to " + DateTo;
        let obj = {};
        obj.date = date;
        obj.maxdate = MAXDATE;
        obj.limit = LIMITLOAD;
        obj.empid = settings.MyLoad;
        obj.branch = BranchID;
        AjaxJWT(url = "/api/Commission/RevTele_LoadData"
            , data = JSON.stringify(obj)
            , async = true
            , success = function (result) {
                if (result != "" && result != "null" && result != "0") {
                    let data = JSON.parse(result);
                    let datemerge = [];
                    datemerge = datemerge.concat(data.Table, data.Table1);
                    settings.RevenueAll_Count(datemerge); 
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
            }
            , before = function (e) {
                if (typeof settings.fnMaster_Before === 'function')
                    settings.fnMaster_Before();
            }
        );
        return false;

    }

    this.RevenueAll_Count = function (data) {
        let settings = RevenueTelesale.prototype.settings;
        let { IsTeleFirst, IsTeleExProduct, IsTeleDevide } = settings;
        settings.DataRevDetail = [];
        let realamount = 0, commisson = 0;
        if (data && data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                let itemComm = data[i];
                let isManual = itemComm.Manual_Revenue;

                if ((IsTeleFirst == 0 || (IsTeleFirst == 1 && Number(itemComm.IsFirstDay) == 1)) || isManual == 1) {
                    if ((IsTeleExProduct == 0 || (IsTeleExProduct == 1 && Number(itemComm.IsProduct) == 0)) || isManual == 1) {
                        let ratio = (itemComm.Amount != 0
                            ? (itemComm.Price != 0 ? itemComm.Price : 1)
                            : 100); // Tỉ lệ theo giá nếu HH theo tiền mặt và 100% khi HH theo %
                        data[i].PriceAfterCost = data[i].Price;
                        let totalCost = data[i].CostManual;

                        if (settings.IsTeleCostLabo == 1) { // Kiểm tra trừ chi phí labo
                            data[i].PriceAfterCost -= data[i].CostLabo;
                            totalCost += data[i].CostLabo
                        }
                        if (settings.IsTeleCostVat == 1) { // VAT
                            data[i].PriceAfterCost -= data[i].CostVat;
                            totalCost += data[i].CostVat
                        }
                        if (settings.IsTeleCostIns == 1) { // Ins
                            data[i].PriceAfterCost -= data[i].CostIns;
                            totalCost += data[i].CostIns
                        }

                        let totalPercentCost = (data[i].Price > 0 && itemComm.Amount == 0)
                            ? (((data[i].Paid * 100) / data[i].Price) * totalCost / 100)
                            : 0;

                        commisson =  Number((((itemComm.Amount != 0 ? (itemComm.Amount * itemComm.Quantity) : itemComm.Percent)
                            * (itemComm.Paid - totalPercentCost)
                        ) / ratio).toFixed(2));

                        if (IsTeleDevide == 1) {
                            persons = (itemComm.Emp != 0 ? 1 : 0) + (itemComm.Emp2 != 0 ? 1 : 0) + (itemComm.Emp3 != 0 ? 1 : 0);;
                            commisson = persons != 0 ? commisson / persons : 0;
                        }

                        realamount =  Number(((commisson * itemComm.PerRevenue) / 100).toFixed(2));
                        if (itemComm.Emp != 0) settings.RevenueAll_Push(itemComm, "Emp", "RealAmount1", realamount, commisson);
                        if (isManual == 0) {
                            if (itemComm.Emp2 != 0) settings.RevenueAll_Push(itemComm, "Emp2", "RealAmount2", realamount, commisson);
                            if (itemComm.Emp3 != 0) settings.RevenueAll_Push(itemComm, "Emp3", "RealAmount3", realamount, commisson);
                        }
                        else {
                            if (itemComm.Emp2 != 0) settings.RevenueAll_Push(itemComm, "Emp2", "RealAmount2", realamount, commisson);
                            if (itemComm.Emp3 != 0) settings.RevenueAll_Push(itemComm, "Emp3", "RealAmount3", realamount, commisson);
                        } 
                    }
                }
            }
        }
    }

    this.RevenueMaster_Count = function (data) { 
        let result = [];
        if (data && data.length != 0) {
            let settings = RevenueTelesale.prototype.settings; 
            let EmpReady = []; 
            let total = {};
            total.emp = 0;
            total.realamount = 0;
            for (let i = 0; i < data.length; i++) {
                let item = data[i];
                if (!EmpReady.includes(item.Emp)) {
                    EmpReady.push(item.Emp);
                    let DataEmp = data.filter(word => { return word.Emp == item.Emp });                    
                    if (DataEmp && DataEmp.length != 0) {
                        let e = {};
                        e.emp = 0;
                        e.realamount = 0; 
                        let arrtabemp = [];
                        for (let i = 0; i < DataEmp.length; i++) {
                            let item = DataEmp[i]; 
                            let emp_sametab = !arrtabemp.includes(item.TabID);
                            if (emp_sametab) arrtabemp.push(item.TabID); 
                            e.emp = item.Emp;
                            e.stt = i + 1;
                            e.empName = settings.RevenueDetail_EmpName(item.Emp);
                            e.realamount += item.RealAmount;                            
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

    //#endregion

    //#region // DETAIL

    this.RevenueDetail_Load = function (EmployeeID) {
         let settings = RevenueTelesale.prototype.settings; 
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

    

    this.RevenueAll_Push = function (item, fieldemp, fieldamount, realamount, commission) {
        try {
            let e = JSON.parse(JSON.stringify(item));
            let settings = RevenueTelesale.prototype.settings;
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

    //#endregion

    //#region // EXPORT

    this.ExportMaster = async function (filename) {
        let settings = RevenueTelesale.prototype.settings;
        let dataExport = { "stt": "STT", "empName": Outlang["Ten_nhan_vien"], "realamount": Outlang["Tong_tien"] };
        let nameFile = filename != '' ? filename : Outlang['Doanh_thu_tong'];
        await exportJsonToExcel(nameFile, settings.DataRevMaster, dataExport);
    }

    this.ExportDetail = async function (filename, isOption , idElement) {
        let settings = RevenueTelesale.prototype.settings;
        let isAll = (isOption == 0);
        let eleContainer = $('#' + idElement || ''); 
        let dataExport = {
            "CustCode": {
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='CustCode']`)).is(":checked"),
                data:Outlang["Ma_khach_hang"]
            }
            , "CustName": Outlang["Khach_hang"] 
            , "SourceID": {
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='Source']`)).is(":checked"),
                data : [Outlang["Sys_nguon_khach_hang"], (v) => { return Fun_GetName_ByID(RP_DataCustomerSource, v) }]
            }
            , "DocCode": Outlang["Ma_ho_so"]
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
                data: [Outlang["Tuoi"]!=undefined? Outlang["Tuoi"]:'Tuổi',(v) => {return (!v.includes('1900')? Sys2Date().FUTC(new Date(v),new Date()).YDistance() : "") } ]
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
            , "PricePer": Outlang["Ds_trong_ky"] ?? "Ds trong kỳ"
            , "Empname": "TeleSale" 
            , "Empcode": {
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='EmpCode']`)).is(":checked"),
                data: Outlang["Ma_nhan_vien"] ?? "Mã nhân viên"      
            }
            , "Commission": Outlang["Hoa_hong"]
            , "PerRevenue": "%" + (Outlang["Thực lãnh"] ?? "Thực lãnh")
            , "RealAmount": Outlang["Thực lãnh"] ?? "Thực lãnh"
            , "Paid": Outlang["Sys_thanh_toan"] ?? "Thanh toán"
            , "TotalPaid": Outlang["Doanh_thu"] ?? "Doanh thu"
            , "TotalPaidPer": Outlang["Dt_trong_ky"] ?? "Dt trong kỳ"
            , "TotalDepositUsed": Outlang["Tien_coc_can_tru"] ?? "Tiền cọc cấn trừ"            
            , "IsNew": {
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='CusNew']`)).is(":checked"),
                data: [Outlang["Khach_hang_moi"] ?? "Khách hàng mới", (v) => { return v == 1 ? "new" : "" }]
            }
            , "BranchName": {
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='Branch']`)).is(":checked"),
                data: Outlang["Chi_nhanh"]
            }
            , "Date": {
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='Date']`)).is(":checked"),
                data:[Outlang["Ngay_tao_dich_vu"], (v) => { return SysDate().FUTC(v).DateText() }]
            }
            , "DatePaid": {
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='DatePay']`)).is(":checked"),
                data:[Outlang["Ngay_thanh_toan"], (v) => { return SysDate().FUTC(v).DateText() }]
            }
            , "Invoice": {
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='Invoice']`)).is(":checked"),
                data:Outlang["Ma_hoa_don"]
            }
            , "Manual_Revenue": {
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='Invoice']`)).is(":checked"),
                data:[Outlang["Chi_thu_cong"] ?? "Chi thủ công", (v) => { return v != 0 ? 'x' : '' }]
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

