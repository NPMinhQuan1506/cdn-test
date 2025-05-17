function RevenueAssistant({
    DateFrom, DateTo, BranchID, MyLoad , CurrentMaster = 0,
    MAXDATE = 31, LIMITLOAD = 70000,
    fnSetting_Before, fnSetting_Complete, // Callback setting
    fnMaster_Before, fnMaster_Complete, fnMaster_CountComplete, // Callback Master Load
    fnDetail_Before, fnDetail_Complete, fnDetail_CountComplete, // Callback Detail Load
    ver = "0"
}) {

    RevenueAssistant.prototype.settings = this;

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
    this.IsAssCostLabo = 0;
    this.IsAssCostComsum = 0;
    this.IsAssCostVat = 0;
    this.IsAssCostIns = 0;


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
        let settings = RevenueAssistant.prototype.settings;
        settings.LoadData_Prepare_Report();
    }

    this.LoadData_Prepare_Report = function () {
        try {
            let settings = RevenueAssistant.prototype.settings;
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

                        settings.IsAssCostLabo = (Number(_item.KTVPTM_CostLabo) > 0 ? 1 : 0);
                        settings.IsAssCostComsum = (Number(_item.KTVPTM_CostComsum) > 0 ? 1 : 0);
                        settings.IsAssCostVat = (Number(_item.KTVPTM_CostVat) > 0 ? 1 : 0);
                        settings.IsAssCostIns = (Number(_item.KTVPTM_CostIns) > 0 ? 1 : 0);

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
        let settings = RevenueAssistant.prototype.settings;
        let { BranchID, DateFrom, DateTo, MyLoad, MAXDATE } = settings;
        let date = DateFrom + " to " + DateTo;
        let obj = {};
        obj.date = date;
        obj.maxdate = MAXDATE;
        obj.branch = BranchID;
        obj.empid = MyLoad;
        AjaxJWT(url = "/api/Commission/RevAssistant_LoadData"
            , data = JSON.stringify(obj)
            , async = true
            , success = function (result) { 
                if (result != "" && result != "null" && result != "0") {
                    let data = JSON.parse(result);
                    let datamerge = [];
                    datamerge = datamerge.concat(data.Table, data.Table1);
                    settings.RevenueAll_Count(datamerge);
                    if (Number(MyLoad) != 0) {
                        if (typeof settings.RevenueDetail_Load === 'function')
                            settings.RevenueDetail_Load(MyLoad);
                    } else {
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
        let settings = RevenueAssistant.prototype.settings;
        let { IsAssDevide, IsAssGreater, CurrentMaster } = settings;
        settings.DataRevAll = [];

        let realamount = 0, perjson = 0, commission = 0;

        if (data && data.length > 0) {
            let tabindex = 0;
            let amountindex = 0

            for (let i = 0; i < data.length; i++) {
                let newpercent = (sys_dencos_Main == 1) ? data[i].NewPer : (data[i].TimeTreat != 0
                    //? (100 * data[i].TimeTreatIndex / data[i].TimeTreat)
                    ? (100 * 1 / data[i].TimeTreat)
                    : 0);

                data[i].PriceAfterCost = data[i].Price - data[i].CostManual;
                let totalCost = data[i].CostManual;

                if (settings.IsAssCostLabo == 1) { // Kiểm tra trừ chi phí labo
                    data[i].PriceAfterCost -= data[i].CostLabo;
                    totalCost += data[i].CostLabo
                }
                if (settings.IsAssCostVat == 1) { // VAT
                    data[i].PriceAfterCost -= data[i].CostVat;
                    totalCost += data[i].CostVat
                }
                if (settings.IsAssCostComsum == 1) { // VTTH
                    data[i].PriceAfterCost -= data[i].CostComsum;
                    totalCost += data[i].CostComsum
                }
                if (settings.IsAssCostIns == 1) { // Ins
                    data[i].PriceAfterCost -= data[i].CostIns;
                    totalCost += data[i].CostIns
                }
                let totalPercentCost = data[i].Price > 0 ? (((data[i].TotalPaid * 100) / data[i].Price) * totalCost / 100) : 0;

                let amountequalper = newpercent != 0 ? ((data[i].TotalPaid - totalPercentCost) * newpercent / 100) : 0;
                let revenue = data[i].Amount != 0 ? data[i].Amount : Number((amountequalper * data[i].Percent) / 100);
                if (data[i].TabID != tabindex) {
                    tabindex = data[i].TabID;
                    amountindex = Number(data[i].TotalPaid) - Number(data[i].TotalCurrentPaid);
                }
                if (amountindex > 0) {
                    if (Number(data[i].TreatInDate) == 0) {
                        data[i].OldRealAmount = 0;
                        if (amountindex >= amountequalper) data[i].OldRealAmount = revenue;
                        else if (amountindex > 0) {
                            if (IsAssGreater == 0) data[i].OldRealAmount = (amountindex < revenue ? amountindex : revenue);
                            else data[i].OldRealAmount = 0;
                        }
                        else data[i].OldRealAmount = 0;
                    }
                    amountindex = amountindex != 0 ? (amountindex - amountequalper) : 0;
                }
                else data[i].OldRealAmount = 0;
            }
            tabindex = 0;
            amountindex = 0;

            for (let i = 0; i < data.length; i++) {
                let newpercent = (sys_dencos_Main == 1) ? data[i].NewPer : (data[i].TimeTreat != 0
                    // ? (100 * data[i].TimeTreatIndex / data[i].TimeTreat)
                    ? (100 * 1 / data[i].TimeTreat)
                    : 0);

                data[i].PriceAfterCost = data[i].Price - data[i].CostManual;
                let totalCost = data[i].CostManual;

                if (settings.IsAssCostLabo == 1) { // Kiểm tra trừ chi phí labo
                    data[i].PriceAfterCost -= data[i].CostLabo;
                    totalCost += data[i].CostLabo
                }
                if (settings.IsAssCostVat == 1) { // VAT
                    data[i].PriceAfterCost -= data[i].CostVat;
                    totalCost += data[i].CostVat
                }
                if (settings.IsAssCostComsum == 1) { // VTTH
                    data[i].PriceAfterCost -= data[i].CostComsum ?? 0;
                    totalCost += data[i].CostComsum ?? 0;
                }
                if (settings.IsAssCostIns == 1) { // Ins
                    data[i].PriceAfterCost -= data[i].CostIns;
                    totalCost += data[i].CostIns
                }
                let totalPercentCost = data[i].Price > 0 ? (((data[i].TotalPaid * 100) / data[i].Price) * totalCost / 100) : 0;

                let amountequalper = newpercent != 0 ? ((data[i].TotalPaid - totalPercentCost) * newpercent / 100) : 0;
                let revenue = data[i].Amount != 0 ? data[i].Amount : Number((amountequalper * data[i].Percent) / 100);
                if (data[i].TabID != tabindex) {
                    tabindex = data[i].TabID;
                    amountindex = Number(data[i].TotalPaid);
                }
                if (amountindex > 0) {
                    if (amountindex >= amountequalper) data[i].RealAmount = revenue;
                    else if (amountindex > 0) {
                        if (IsAssGreater == 0) data[i].RealAmount = (amountindex < revenue ? amountindex : revenue);
                        else data[i].RealAmount = 0;
                    }

                    else data[i].RealAmount = 0;
                    if (Number(data[i].TreatInDate) == 1 && data[i].RealAmount != 0) {
                        data[i].Havingrevenue = 1;
                    }
                    if (Number(data[i].TreatInDate) == 0 && data[i].RealAmount > data[i].OldRealAmount) {
                        data[i].Havingrevenue = 1;
                        data[i].RealAmount = data[i].RealAmount - data[i].OldRealAmount;
                    }
                    amountindex = amountindex != 0 ? (amountindex - amountequalper) : 0;
                }
                else {
                    data[i].Havingrevenue = 0;
                    data[i].RealAmount = 0;
                }

            }

            for (let i = 0; i < data.length; i++) {
                if (data[i].Manual_Revenue == 0) {
                    if (Number(data[i].Havingrevenue) == 1) {
                        commission = data[i].RealAmount;
                        let RePercent = Number(data[i].RePercent);
                        RePercent = (RePercent > 0 && RePercent <= 100) ? RePercent : 100;
                        realamount = commission * RePercent / 100;
                        if (IsAssDevide == 1) {
                            perjson = (data[i].PT1 != 0 ? 1 : 0) + (data[i].PT2 != 0 ? 1 : 0) + (data[i].PT3 != 0 ? 1 : 0) + (data[i].PT4 != 0 ? 1 : 0);
                            realamount = perjson != 0 ? realamount / perjson : 0;
                            commission = perjson != 0 ? commission / perjson : 0;
                        }
                        if (data[i].PT1 != 0) settings.RevenueAll_Push(data[i], "PT1", "RealAmount1", commission, realamount);
                        if (data[i].PT2 != 0 && IsAssDevide == 1) settings.RevenueAll_Push(data[i], "PT2", "RealAmount2", commission, realamount);
                        if (data[i].PT3 != 0 && IsAssDevide == 1) settings.RevenueAll_Push(data[i], "PT3", "RealAmount3", commission, realamount);
                        if (data[i].PT4 != 0 && IsAssDevide == 1) settings.RevenueAll_Push(data[i], "PT4", "RealAmount4", commission, realamount);

                    }
                }
                else {
                    if (data[i].PT1 != 0) settings.RevenueAll_Push(data[i], "PT1", "RealAmount1", commission, data[i].RealAmount1);
                    if (data[i].PT2 != 0) settings.RevenueAll_Push(data[i], "PT2", "RealAmount2", commission, data[i].RealAmount2);
                    if (data[i].PT3 != 0) settings.RevenueAll_Push(data[i], "PT3", "RealAmount3", commission, data[i].RealAmount3);
                }
            }             
        }
    }

    this.RevenueMaster_Count = function (data) { 
        let result = [];
        if (data && data.length != 0) {
        let settings = RevenueAssistant.prototype.settings; 
        let EmpReady = [];
        let arrTab = [];
        let total = {};
        total.emp = 0;
        total.realamount = 0;
        total.paymentPeriod = 0;
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
                    e.paymentPeriod = 0;
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
                        e.paymentPeriod += emp_sametab ? item.PaymentPeriod : 0;
                        e.totalPaid += emp_sametab ? item.TotalPaid : 0;
                        let isSameTab = !arrTab.includes(item.TabID)
                        if (isSameTab) {
                            arrTab.push(item.TabID);
                            total.paymentPeriod +=  item.PaymentPeriod ;
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

    //#endregion

    //#region // DETAIL

    this.RevenueDetail_Load = function (EmployeeID) {
        let settings = RevenueAssistant.prototype.settings; 
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

    this.RevenueAll_Push = function (item, fieldemp, fieldamount, commission, realamount) {
        try {
            let e = JSON.parse(JSON.stringify(item));
            let settings = RevenueAssistant.prototype.settings;
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
        let settings = RevenueAssistant.prototype.settings;
        let dataExport = { "stt": "STT", "empName": Outlang["Ky_thuat_vien"] ?? "Kỹ thuật viên", "realamount": Outlang["Hoa_hong"] };
        let nameFile = filename != '' ? filename : Outlang['Doanh_thu_tong'];
        await exportJsonToExcel(nameFile, settings.DataRevMaster, dataExport);
    }

    this.ExportDetail = async function (filename,isOption,idElement) {
        let settings = RevenueAssistant.prototype.settings;
        let isAll = (isOption == 0);
        let eleContainer = $('#' + idElement || ''); 
        let dataExport = {
            "CustCode": Outlang["Ma_khach_hang"]
            , "CustName": Outlang["Khach_hang"]
            , "SourceID": {
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='custsource']`)).is(":checked"),
                data:[Outlang["Sys_nguon_khach_hang"], (v) => { return Fun_GetName_ByID(RP_DataCustomerSource, v) }]
            }
                
            , "DocCode": {
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='custdoccode']`)).is(":checked"),
                data: [Outlang["Ma_ho_so"]]
            }                
            , "CustPhone": {
                dataNamePer: 'custphone',
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='phone_customer']`)).is(":checked"),
                data: [Outlang["So_dien_thoai"]] 
            }
            , "CustCodeOld":{
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='custoldcode']`)).is(":checked"),
                data: [Outlang["Ma_khach_hang_cu"] != undefined ? Outlang["Ma_khach_hang_cu"] : 'Mã khách hàng cũ']
            }            
            , "CustAge":{
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='custage']`)).is(":checked"),
                data: [ Outlang["Tuoi"] != undefined ? Outlang["Tuoi"] : 'Tuổi']
            }   
            , "CustGender":{
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='custgender']`)).is(":checked"),
                data: [Outlang["Gioi_tinh"], (v, { CustGender }) => { return (CustGender == 60 ? Outlang["Sys_nam"] : Outlang["Sys_nu1"]) }]
            }    
            , "CustAddress": {
                dataNamePer: 'custaddress',
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='custaddress']`)).is(":checked"),
                data: [Outlang["Sys_dia_chi_khach_hang1"]]
            }
            , "CustCommuneID": {
                dataNamePer: 'custcommu',
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='custcommu']`)).is(":checked"),
                data: [Outlang["Phuong_xa"] ?? 'Phường xã', (v) => { return (Fun_GetName_ByID(RP_DataCommune, v)) }]
            }
            , "CustDistrictID": {
                dataNamePer: 'custdistrict',
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='custdistrict']`)).is(":checked"),
                data: [Outlang["Quan_huyen"] ?? 'Quận huyện', (v) => { return (Fun_GetName_ByID(RP_DataDistrict, v)) }]
            }
            , "CustCityID": {
                dataNamePer: 'custcity',
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='custcity']`)).is(":checked"),
                data: [Outlang["Sys_thanh_pho"] ?? 'Thành phố', (v) => { return (Fun_GetName_ByID(RP_DataCity, v)) }]
            }
            , "Service_Code":{
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='sercode']`)).is(":checked"),
                data: [ Outlang["Ma_dich_vu"] != undefined ? Outlang["Ma_dich_vu"] : 'Mã dịch vụ']
            }     
            , "ServiceID": [Outlang["Dich_vu"], (v) => { return settings.RevenueDetail_ServiceName(v) }]


            , "ServiceType":{
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='sertype']`)).is(":checked"),
                data: [ (Outlang["Loai_dich_vu"] != undefined ? Outlang["Loai_dich_vu"] : 'Loại dịch vụ')]
            }     
            , "SalesCode":{
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='sersalecode']`)).is(":checked"),
                data: [Outlang["Ma_len_don"]]
            }      
            , "Quantity": {
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='serqty']`)).is(":checked"),
                data: [Outlang["Sl"] ?? "Sl"]
            }      
            , "Price_Root": Outlang["Gia_ban_dau"] ?? "Giá ban đầu"
            , "Price": Outlang["Thanh_tien"]
            , "Detail": [Outlang["Chi_tiet_dich_vu_dieu_tri"], (v, { TimeTreatIndex, TimeTreat, TeethType, TeethChoosing, }) => {
                return ((Number(sys_dencos_Main) == 1)
                    ? (`${(TeethChoosing != '') ? Fun_GetTeeth_ByToken(DataTeeth, TeethChoosing, TeethType) : ''} `)
                    : (Outlang['Lan_dieu_tri'] + ': ' + TimeTreatIndex + ' | ' + TimeTreat));
            }]
            , "NewPer":{
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='pertreat']`)).is(":checked"),
                data: [`% ${Outlang["Dieu_tri"]}`, (v, { NewPer, TimeTreatIndex, TimeTreat }) => {
                    return ((Number(sys_dencos_Main) == 1)
                        ? (NewPer)
                        : (Number(TimeTreat) != 0 ? ((Number(TimeTreatIndex) / Number(TimeTreat)) * 100).toFixed(2) : 0));
                }]
            }
            
            , "PercentOfService":{
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='percomplete']`)).is(":checked"),
                data: [ "%" + Outlang["Hoan_thanh"]]
            }      
            , "Empname": Outlang["Ky_thuat_vien"] ?? "Kỹ thuật viên"
            , "Empcode": Outlang["Ma_nhan_vien"] ?? "Mã nhân viên"
            , "Commission": Outlang["Hoa_hong"]
            , "RePercent": ["%" + (Outlang["Thuc_lanh"] ?? "Thực lãnh"), (v) => { return (v != 0 ? v : 100) }]
            , "RealAmount": Outlang["Thuc_lanh"] ?? "Thực lãnh"
            , "PaymentPeriod":{
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='reveperiod']`)).is(":checked"),
                data: [ Outlang["Dt_trong_ky"] ?? "Dt trong kỳ"]
            }      
            , "PaymentService":{
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='revenue']`)).is(":checked"),
                data: [ Outlang["Doanh_thu"] ?? "Doanh thu"]
            }      
            , "Date":{
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='notecommis']`)).is(":checked"),
                data: [Outlang["Ngay_chia_hoa_hong"] ?? "Ngày chia hoa hồng", (v) => { return SysDate().FUTC(v).DateText() }]
            }      
            , "BranchName": Outlang["Chi_nhanh"]
            , "IsNew": {
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='custnew']`)).is(":checked"),
                data: [Outlang["Khach_hang_moi"] ?? "Khách hàng mới", (v) => { return v == 1 ? "new" : "" }]
            }
            , "Note": Outlang["Ghi_chu_hoa_hong"] == undefined ? 'Ghi chú hoa hồng' : Outlang["Ghi_chu_hoa_hong"]
            , "Content_Follow": (Outlang["Noi_dung_dieu_tri"] != undefined ? Outlang["Noi_dung_dieu_tri"] : 'Nội dung điều trị')
            , "Manual_Revenue": Outlang["Chi_thu_cong"] ?? "Chi thủ công"
        };
        dataExport = Checking_TabControl_System_RebuildHeader(dataExport, tableBodyId = 'dtContentReportBody', PermissionTable_TabControl);
        let nameFile = filename != '' ? filename : Outlang["Doanh_thu_ky_thuat_vien"];
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
    this.RevenueDetail_GetName = function (data, id) {
        try {

            return data[id] != undefined ? data[id].Name : '';
        }
        catch (ex) {
            return "";
        }
    }

    //#endregion

}