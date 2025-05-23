﻿
function RevenueDoctor({
    DateFrom, DateTo, BranchID, MyLoad = 0, CurrentMaster = 0,
    MAXDATE = 31, LIMITLOAD = 70000,
    fnSetting_Before, fnSetting_Complete, // Callback setting
    fnMaster_Before, fnMaster_Complete, fnMaster_CountComplete, // Callback Master Load
    fnDetail_Before, fnDetail_Complete, fnDetail_CountComplete, // Callback Detail Load
    ver = "0"
}) {

    RevenueDoctor.prototype.settings = this;

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

    this.IsDocCostLabo = 0;
    this.IsDocCostComsum = 0;
    this.IsDocCostVat = 0;
    this.IsDocCostIns = 0;


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
        let settings = RevenueDoctor.prototype.settings;
        settings.LoadData_Prepare_Report();
    }

    this.LoadData_Prepare_Report = function () {
        try {
            let settings = RevenueDoctor.prototype.settings;
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
                        settings.IsDocCostLabo = (Number(_item.Doc_CostLabo) > 0 ? 1 : 0);
                        settings.IsDocCostComsum = (Number(_item.Doc_CostComsum) > 0 ? 1 : 0);
                        settings.IsDocCostVat = (Number(_item.Doc_CostVat) > 0 ? 1 : 0);
                        settings.IsDocCostIns = (Number(_item.Doc_CostIns) > 0 ? 1 : 0);

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
        let settings = RevenueDoctor.prototype.settings; 
        let { BranchID, DateFrom, DateTo, MAXDATE, LIMITLOAD } = settings;
        let date = DateFrom + " to " + DateTo;
        let obj = {};
        obj.date = date;
        obj.maxdate = MAXDATE;
        obj.limit = LIMITLOAD; 
        obj.branch = BranchID;
        AjaxJWT(url = "/api/Commission/RevDoctor_LoadDetail"
            , data = JSON.stringify(obj)
            , async = true
            , success = function (result) { 
                if (result != "0") {
                    let data = JSON.parse(result);
                    let datatreat = data.Table;
                    let datacom = data.Table1;
                    let datapay = (data?.Table2)?.reduce((pre, arr) => {
                        if (arr["TabID"]) {
                            if (!pre[arr["TabID"]]) pre[arr["TabID"]] = [];
                            pre[arr["TabID"]].push(arr);
                        } return pre
                    }, {});
                    let datamerge = datatreat.concat(datacom); 
                    settings.RevenueAll_Count(datamerge, datapay); 
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
    
    this.RevenueAll_Count = function (data, datapay) {
        let settings = RevenueDoctor.prototype.settings;
        let { IsDocDevide, IsDocGreater, IsDocCostLabo, DateFrom, DateTo } = settings;
        settings.DataRevAll = []; 
        let realamount = 0, perjson = 0, commission = 0;
        if (data && data.length > 0) {
            if (IsDocGreater == 2) { // Chia HH theo % điều trị
                //Code tạm thời (Nếu dạng YYYY-MM-DD chuyển qua DD-MM-YYYY)
                let DFTemp = DateFrom.split('-');
                let DTTemp = DateTo.split('-');
                if (DFTemp[0].length === 4 && DTTemp[0].length === 4) {
                    DateFrom = DFTemp[2] + "-" + DFTemp[1] + "-" + DFTemp[0];
                    DateTo = DTTemp[2] + "-" + DTTemp[1] + "-" + DTTemp[0];
                }
                //

                let DateFromInt = ConvertDMY_ToInt(DateFrom);
                let DateToInt = ConvertDMY_ToInt(DateTo);
                for (let i = 0; i < data.length; i++) {
                    let item = data[i];
                    if (item.Manual_Revenue == 0) {
                        let tabid = Number(item.TabID)
                        let dateTreat = SysDate().FUTC(item.Date).UTC_DNum();
                        let payTab = datapay[tabid]
                        if (payTab == undefined && payTab.length == 0) continue;
                        let totalDivide = payTab.reduce((pre, arr) => {
                            if (arr != undefined) {
                                if ((arr.NumCreated >= DateFromInt && arr.NumCreated <= DateToInt
                                    && (item.TreatInDate == 1 || dateTreat < DateFromInt))
                                    || (arr.NumCreated < DateFromInt && item.TreatInDate == 1)
                                ) {
                                    pre += arr.Amount
                                }
                            }
                            return pre;
                        }, 0);
                        if (totalDivide != 0) {
                            let newpercent = (sys_dencos_Main == 1) ? item.NewPer : (item.TimeTreat != 0
                                ? (100 * 1 / item.TimeTreat)
                                : 0);
                            item.PriceAfterCost = settings.RevenueAll_PriceAfterCost(item, settings);
                            let amountequalper = newpercent != 0
                                ? (totalDivide * newpercent / 100)
                                : 0;
                            let revenue = item.Amount != 0
                                ? ((item.Amount * newpercent * (totalDivide / item.Price)) / 100)
                                : Number((amountequalper * item.Percent) / 100);

                            if (revenue != 0) {
                                item.Havingrevenue = 1;
                                item.RealAmount = revenue;
                            }
                            else {
                                item.Havingrevenue = 0;
                                item.RealAmount = 0;
                            }
                        }
                    }
                }
            }
            else {
                let tabindex = 0;
                let amountindex = 0
                for (let i = 0; i < data.length; i++) {
                    let newpercent = (sys_dencos_Main == 1) ? data[i].NewPer : (data[i].TimeTreat != 0
                        ? (100 * 1 / data[i].TimeTreat)
                        : 0);
                    data[i].PriceAfterCost = settings.RevenueAll_PriceAfterCost(data[i], settings);
                    let amountequalper = newpercent != 0 ? (data[i].PriceAfterCost * newpercent / 100) : 0;
                    let revenue = data[i].Amount != 0
                        ? (data[i].Amount * newpercent / 100)
                        : Number((amountequalper * data[i].Percent) / 100);
                    if (data[i].TabID != tabindex) {
                        tabindex = data[i].TabID;
                        amountindex = Number(data[i].TotalPaid) - Number(data[i].TotalCurrentPaid);
                    }
                    if (amountindex > 0) {
                        if (Number(data[i].TreatInDate) == 0) {
                            data[i].OldRealAmount = 0;
                            if (amountindex >= amountequalper) data[i].OldRealAmount = revenue;
                            else if (amountindex > 0) {
                                if (IsDocGreater == 0) data[i].OldRealAmount = (amountindex < revenue ? amountindex : revenue);
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
                        //? (100 * data[i].TimeTreatIndex / data[i].TimeTreat)
                        ? (100 * 1 / data[i].TimeTreat)
                        : 0);
                    let amountequalper = newpercent != 0 ? (data[i].PriceAfterCost * newpercent / 100) : 0;
                    let revenue = data[i].Amount != 0
                        ? (data[i].Amount * newpercent / 100)
                        : Number((amountequalper * data[i].Percent) / 100);
                    if (data[i].TabID != tabindex) {
                        tabindex = data[i].TabID;
                        amountindex = Number(data[i].TotalPaid);
                    }
                    if (amountindex > 0) {
                        if (amountindex >= amountequalper) data[i].RealAmount = revenue;
                        else if (amountindex > 0) {
                            if (IsDocGreater == 0) data[i].RealAmount = (amountindex < revenue ? amountindex : revenue);
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
            }

            for (let i = 0; i < data.length; i++) {
                if (data[i].Manual_Revenue == 0) {
                    if (Number(data[i].Havingrevenue) == 1) {
                        commission = data[i].RealAmount;
                        let RePercent = Number(data[i].RePercent);
                        RePercent = (RePercent > 0 && RePercent <= 100) ? RePercent : 100;
                        realamount = commission * RePercent / 100;

                        if (IsDocDevide == 1) {
                            perjson = (data[i].BS1 != 0 ? 1 : 0) + (data[i].BS2 != 0 ? 1 : 0) + (data[i].BS3 != 0 ? 1 : 0) + (data[i].BS4 != 0 ? 1 : 0);
                            realamount = perjson != 0 ? realamount / perjson : 0;
                            commission = perjson != 0 ? commission / perjson : 0;
                        }
                        if (data[i].BS1 != 0) settings.RevenueDetail_Push(data[i], "BS1", "RealAmount1", commission, realamount);
                        if (data[i].BS2 != 0 && IsDocDevide == 1) settings.RevenueDetail_Push(data[i], "BS2", "RealAmount2", commission, realamount);
                        if (data[i].BS3 != 0 && IsDocDevide == 1) settings.RevenueDetail_Push(data[i], "BS3", "RealAmount3", commission, realamount);
                        if (data[i].BS4 != 0 && IsDocDevide == 1) settings.RevenueDetail_Push(data[i], "BS4", "RealAmount4", commission, realamount);
                    }
                }
                else {
                    if (data[i].BS1 != 0) settings.RevenueDetail_Push(data[i], "BS1", "RealAmount1", commission, data[i].RealAmount1);
                    if (data[i].BS2 != 0) settings.RevenueDetail_Push(data[i], "BS2", "RealAmount2", commission, data[i].RealAmount2);
                    if (data[i].BS3 != 0) settings.RevenueDetail_Push(data[i], "BS3", "RealAmount3", commission, data[i].RealAmount3);                    
                }
            }
        } 
    }
    this.RevenueMaster_Count = function (data) {
        let result = [];
        if (data && data.length != 0) {
            let settings = RevenueDoctor.prototype.settings; 
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
    this.RevenueAll_PriceAfterCost = function (item, settings) {
        try {
            let result = 0;
            result = item.Price - item.CostManual;
            if (settings.IsDocCostLabo == 1) {
                result -= item.CostLabo;
            }
            if (settings.IsDocCostComsum == 1) {
                result -= item.CostComsum;
            }
            if (settings.IsDocCostVat == 1) {
                result -= item.CostVat;
            }
            if (settings.IsDocCostIns == 1) {
                result -= item.CostIns;
            }
            return result;
        }
        catch (ex) {
            return 0;
        }
        
    }

    //#region // DETAIL
    this.RevenueDetail_Load = function (EmployeeID) { 
        let settings = RevenueDoctor.prototype.settings; 
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

    this.RevenueDetail_Push = function (item, fieldemp, fieldamount, commission, realamount) {
        try {
            let e = JSON.parse(JSON.stringify(item));
            let settings = RevenueDoctor.prototype.settings;
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
        let settings = RevenueDoctor.prototype.settings;
        let dataExport = {
            "stt": "STT",
            "empName": Outlang["Ten_nhan_vien"],
            "realamount": Outlang["Tong_tien"],
            "paymentPeriod": Outlang["Thu_trong_ky"] ?? 'Thu trong kỳ',
            "totalPaid": Outlang["Tong_tien_thu"] ?? 'Tổng tiền thu'
        };
        let nameFile = filename != '' ? filename : Outlang['Doanh_thu_tong'];
        await exportJsonToExcel(nameFile, settings.DataRevMaster, dataExport);
    }

    this.ExportDetail = async function (filename, isOption , idElement) {
        let settings = RevenueDoctor.prototype.settings; 
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
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='CustCodeOld']`)).is(":checked"),
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
            , "Service_Code": {
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='SerCode']`)).is(":checked"),
                data : Outlang["Ma_dich_vu"] != undefined ? Outlang["Ma_dich_vu"] : 'Mã dịch vụ'
            }
            , "ServiceID": [Outlang["Dich_vu"], (v) => {return settings.RevenueDetail_ServiceName(v)}]
            , "ServiceType": {
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='ServiceType']`)).is(":checked"),
                data : (Outlang["Loai_dich_vu"] != undefined ? Outlang["Loai_dich_vu"] : 'Loại dịch vụ')
            }
            , "SalesCode": {
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='SalesCode']`)).is(":checked"),
                data : Outlang["Ma_len_don"]
            }
            , "Quantity": Outlang["Sl"] ?? "Sl"
            , "Price_Root": {
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='PriceSer']`)).is(":checked"),
                data : Outlang["Gia_ban_dau"] ?? "Giá ban đầu"
            }
            , "Price": {
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='PriceRoot']`)).is(":checked"),
                data : Outlang["Thanh_tien"]
            } 
            , "Detail": [Outlang["Chi_tiet_dich_vu_dieu_tri"], (v, { TimeTreatIndex, TimeTreat, TeethType, TeethChoosing, }) =>
            {
                return ((Number(sys_dencos_Main) == 1)
                    ? (`${(TeethChoosing != '') ? Fun_GetTeeth_ByToken(DataTeeth, TeethChoosing, TeethType) : ''} `)
                    : (Outlang['Lan_dieu_tri'] + ': ' + TimeTreatIndex + ' | ' + TimeTreat));
            }]
            , "NewPer": {
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='PercentNew']`)).is(":checked"),
                data : [`% ${Outlang["Dieu_tri"] ?? 'Điều trị'}`, (v, { NewPer, TimeTreatIndex, TimeTreat }) => {
                    return ((Number(sys_dencos_Main) == 1)
                        ? (NewPer)
                        : (Number(TimeTreat) != 0 ? ((Number(TimeTreatIndex) / Number(TimeTreat)) * 100).toFixed(2) : 0));
                }]
            }
            , "PercentOfService": {
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='PercentOfService']`)).is(":checked"),
                data : "%" + Outlang["Hoan_thanh"]
            } 
            , "Empname": {
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='EmpName']`)).is(":checked"),
                data : Outlang["Bac_si"]   
            }      
            , "Empcode": {
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='EmpCode']`)).is(":checked"),
                data: Outlang["Ma_nhan_vien"] ?? "Mã nhân viên"      
            }     
            , "Commission": Outlang["Hoa_hong"]
            , "RePercent": [`%` + (Outlang["Thuc_lanh"] ?? `Thực lãnh`), (v) => { return (v != 0 ? v : 100) }]
            , "RealAmount": Outlang["Thuc_lanh"] ?? `Thực lãnh`
            , "PaymentPeriod": Outlang["Dt_trong_ky"] ?? `DT trong kỳ`
            , "PaymentService": Outlang["Tong_tien_thu"] == undefined ? 'Tiền thu dịch vụ' : Outlang["Tong_tien_thu"]
            , "Date": {
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='Date']`)).is(":checked"),
                data : [Outlang["Ngay_dieu_tri"], (v) => { return SysDate().FUTC(v).DateText() }]
            }
            , "BranchName": {
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='BranchName']`)).is(":checked"),
                data: Outlang["Chi_nhanh"]
            }
            , "IsNew": {
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='CusNew']`)).is(":checked"),
                data: [Outlang["Khach_hang_moi"] ?? "Khách hàng mới", (v) => { return v == 1 ? "new" : "" }]
            }
            , "Note": Outlang["Ghi_chu_hoa_hong"] == undefined ? 'Ghi chú hoa hồng' : Outlang["Ghi_chu_hoa_hong"]
            , "Content_Follow": {
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='ContentTreat']`)).is(":checked"),
                data : (Outlang["Noi_dung_dieu_tri"] != undefined ? Outlang["Noi_dung_dieu_tri"] : 'Nội dung điều trị')
            }
            , "Manual_Revenue": {
                isShow: isAll || (eleContainer.find(`.shtoogle[data-name='Manual']`)).is(":checked"),
                data : [Outlang["Chi_thu_cong"] ?? `Chi thủ công`, (v, { RealAmount }) => { return (v == 1 ? RealAmount : 0) }]
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
