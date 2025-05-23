﻿// #region // Free
function onTab_FreeSevice() {

    let reason_free = Number($('#ReasonFreeID').dropdown('get value')) ? Number($('#ReasonFreeID').dropdown('get value')) : 0;
    if (reason_free != 0) {
        $('#ReasonDiscountID').dropdown("clear");
        $('#txtDiscountAmountPer').val(0);
        $("#discountTabCombo").dropdown("clear");
        $("#DiscountVoucherID").dropdown("clear");
        $("#DiscountCustomerGroupID").dropdown("clear");
        $("#TabInsuranceID").dropdown("clear");
        $('#Tabins_Term').dropdown('clear');
        $('#Tabins_Frequency').dropdown('clear');


        $('#Tabins_Sup').dropdown('clear');

        $('#discountTabCombo').addClass('disabled');
        $('#DiscountVoucherID').addClass('disabled');
        $('#DiscountCustomerGroupID').addClass('disabled');
        $("#ReasonDiscountID").addClass('disabled');
        $("#txtDiscountAmountPer").prop("disabled", true);
        $('#DiscountAmountPer').addClass('disabled');
        $('#TabInsuranceID').addClass('disabled');
    }
    else {
        $('#ReasonDiscountID').removeClass('disabled');
        $('#discountTabCombo').removeClass('disabled');
        $('#DiscountVoucherID').removeClass('disabled');
        $('#DiscountCustomerGroupID').removeClass('disabled');
        $("#txtDiscountAmountPer").prop("disabled", false);
        $('#DiscountAmountPer').removeClass('disabled');
        $('#TabInsuranceID').removeClass('disabled');
    }
    Tab_Count_Price_For_All();
}
function Tab_Detail_FreeSevice_Show() {
    $("#ReasonFreeID").dropdown("clear");
}
// #endregion
//#region // Using Point
function onTab_UsingPoint() {
    Tab_Count_Price_For_All();
}
//#endregion
// #region // Insurance
function onTab_Insurance() {
    try {
        $("#Tabinsur_Per").val(0);
        $("#Tabinsur_Amount").val(0);
        let ins_Sup = $('#TabInsuranceID').dropdown('get value') ? $('#TabInsuranceID').dropdown('get value') : '';
        if (ins_Sup != 0) {
            $('#Tabinsur_Per').removeClass('disabled');
            $('#Tabinsur_Amount').removeClass('disabled');
        }
        else {
            $('#Tabinsur_Per').addClass('disabled');
            $('#Tabinsur_Amount').addClass('disabled');
        }

        Tab_Count_Price_For_All();
    }
    catch (e) {

    }
}
function onTab_InsuranceAmount() {
    if (tab_changing_flag == 1) {
        Tab_Count_Price_For_All();

    }
}
function onTab_InsurancePer() {
    if (tab_changing_flag == 1) {
        tab_changing_flag = 0;
        $('#Tabinsur_Amount').val(0);
        tab_changing_flag = 1;
        Tab_Count_Price_For_All();
    }
}
// #endregion

// #region // Self Discount
function Tab_Detail_Self_Discount_Validate_Value(_type, _text, _total_amount
    , is_using, max_amount, max_percent) {

    $('#txtDiscountAmountPer').css('background-color', 'white');
    let _value;
    let _res = {};
    _res.result_percent = 0;
    _res.result_value = 0;
    let is_un_valid = 0;
    if (!isNaN(_text) || _text == '') {
        _value = Number(_text ? _text : 0);
        if (_type == 1 && _value > 100) is_un_valid = 1;
        if (_type == 1 && _value > max_percent && is_using == 1) is_un_valid = 1;
        if (_type == 2 && _value > max_amount && is_using == 1) is_un_valid = 1;
    }
    else {
        is_un_valid = 1;
    }
    if (is_un_valid == 0) {
        if (_type == 1) {
            _res.result_percent = _value;
            _res.result_value = Number((_total_amount / 100) * _value);
        }
        else {
            _res.result_percent = 0;
            _res.result_value = _value;
        }
    }
    else {
        $('#txtDiscountAmountPer').css('background-color', 'rgb(255 216 216)');
        if (is_using == 1) {
            $('#textShowMessage').html(Outlang["Vuot_khoang_giam_duoc_cho_phep"]);
        }
        else {
            $('#textShowMessage').html(Outlang["Sai_dinh_dang"]);
        }
    }
    return _res;
}
function TM_checkdiscount(is_using, max_amount, max_percent, id) {
    if (Number(is_using) == 0) {
        $('#' + id).hide();
    }
    else {
        $('#' + id).show();
        let _re = '<span>(&nbsp' + max_percent + '%&nbsp|&nbsp' + formatNumber(max_amount) + '&nbsp)</span>';
        $('#' + id).html(_re);
    }
}
// #endregion

// #region // Installment


function OnInsSup_Change() {
    try {
        let ins_Sup = $('#Tabins_Sup').dropdown('get value') ? $('#Tabins_Sup').dropdown('get value') : '';
        let _data = data_InstallTerm.filter(word => word["SupCode"] == ins_Sup);

        if (_data != undefined && _data.length != 0) {
            Load_Combo(_data, "ccbTabins_Term", false);
            $("#Tabins_Term").dropdown("refresh");
            $("#Tabins_Term").dropdown("set selected", _data[0].ID);

        }
        else {
            $("#Tabins_Term").dropdown("clear");
            $("#Tabins_Frequency").dropdown("clear");
        }

        Tab_Count_Price_For_All();
    }
    catch (e) {

    }

}
function OnInsSup_Term() {
    let ins_Term = $('#Tabins_Term').dropdown('get value') ? $('#Tabins_Term').dropdown('get value') : '';
    let ins_Sup = $('#Tabins_Sup').dropdown('get value') ? $('#Tabins_Sup').dropdown('get value') : '';
    let _dataFre = data_InstallTerm
        .filter(word => word["SupCode"] == ins_Sup && word.ID == ins_Term)
        .map(item => ({
            ID: item.Frequency,
            Name: `${item.Frequency} ${Outlang["Sys_thang"]} / 1 ${Outlang["Lan"]}`
        })).reduce((acc, curr) => {
            if (!acc.some(item => item.ID === curr.ID)) {
                acc.push(curr);
            }
            return acc;
        }, []);
    if (_dataFre != undefined && _dataFre.length != 0) {
        Load_Combo(_dataFre, "ccbTabins_Frequency", true);
        $("#Tabins_Frequency").dropdown("refresh");
        $("#Tabins_Frequency").dropdown("set selected", _dataFre[0].ID);

    }
    if (tab_changing_flag == 1) {
        Tab_Count_Price_For_All();
    }
}
function OnInsSup_Frequency() {
    if (tab_changing_flag == 1) {
        Tab_Count_Price_For_All();
    }
}

function Tab_Detail_Installment_Show(__ser, service_id) {
    let _is_install = false;
    let _data_install = __ser.filter(word => Number(word["ID"]) == Number(service_id));
    if (_data_install != undefined && _data_install.length == 1) {
        if (Number(_data_install[0].IsInstallment) == 1) _is_install = true;
    }

    if (!_is_install) {
        $("#Tabins_Sup").dropdown("refresh");
        $("#Tabins_Sup").dropdown("clear");
    }


}

// #endregion

// #region // Discount Program
function Tab_Detail_HelpingChoosing_Program(_discountCTKM, _discountCustMem) {
    if (_discountCTKM != 0 && $("#discountTabCombo").length) {
        if (_discountCustMem == 0) {
            // add class css
            if (sys_AutoselectPro == 1) {
                $("#discountTabCombo").dropdown("refresh");
                $("#discountTabCombo").dropdown("set selected", _discountCTKM);
            }
            $("#tab_discount").addClass("tab_noti");
        }
        else {
            if ($("#tab_discount").length != 0) $("#tab_discount").removeClass("tab_noti");
        }
    }
    if (_discountCustMem != 0 && $("#DiscountCustomerMemberID").length) {
        if (_discountCTKM == 0) {
            // add class css
            $("#DiscountCustomerMemberID").dropdown("refresh");
            $("#DiscountCustomerMemberID").dropdown("set selected", _discountCustMem);
            $("#tab_customer_group").addClass("tab_noti");
        }
        else {
            if ($("#tab_customer_group").length != 0) $("#tab_customer_group").removeClass("tab_noti");
        }
    }

    if (_discountCTKM != 0 && _discountCustMem != 0 && $("#DiscountCustomerMemberID").length && $("#discountTabCombo").length) {
        if ($("#helpchosing_program").length) {
            $("#helpchosing_program").show();
            $('#IsCheckChossing_CTKM')[0].dataset.id = _discountCTKM;
            $('#IsCheckChossing_CUSMEM')[0].dataset.id = _discountCustMem;
            help_program_changing_flag = 0;
            let _data_discount_name = data_discount.filter(word => Number(word["ID"]) == Number(_discountCTKM))[0].Name;
            let _data_customer_mem_name = data_customer_mem.filter(word => Number(word["ID"]) == Number(_discountCustMem))[0].Name;
            $('#helpchosing_program_CTKM_name').html(_data_discount_name);
            $('#helpchosing_program_CUSMEM_name').html(_data_customer_mem_name);
        }
    }
    else {
        help_program_changing_flag = 1;
    }
}

function Tab_Detail_Loading_Program_By_Service(__ser, __program, service_id, _id) {

    let type_id = 0;
    let data = [];

    let _data_cat = __ser.filter(word => Number(word["ID"]) == Number(service_id));
    if (_data_cat != undefined && _data_cat.length == 1)
        type_id = Number(_data_cat[0].CatID);

    if (service_id != 0 && __program != undefined) {
        data = __program.filter(word =>
            Tab_Detail_Checking_Service_InJSON(service_id, type_id, word["Rule"]) == true);
    }
    Load_Combo(data, _id, false)
    if (data != undefined && data.length != 0) {
        return data[0].ID;
    }
    else return 0;
}
function Tabdetail_ProValue(__ser, __program, program_id, service_id, service_amount) {
    try {

        let _res = {};
        _res.amount = 0;
        _res.percent = 0;
        if (Number(program_id) != 0) {
            let _max = 0;
            let _all, _type, _detail;
            let _value = '[]';
            let type_id = 0;
            let _data_cat = __ser.filter(word => Number(word["ID"]) == Number(service_id));
            if (_data_cat != undefined && _data_cat.length == 1)
                type_id = Number(_data_cat[0].CatID);
            let _data_fitler = __program.filter(word => Number(word["ID"]) == Number(program_id));
            if (_data_fitler != undefined && _data_fitler.length == 1)
                _value = _data_fitler[0].Rule;
            if (_value != '' && _value != '[]') {
                let _obj = JSON.parse(_value);
                if (_obj != undefined && _obj != null && _obj.length > 0) {
                    _all = Tab_Detail_Get_Largest_Value_InJson(-1, _obj[0].active, _obj[0].amount, _obj[0].percent, _obj[0].value);
                    _type = Tab_Detail_Get_Largest_Value_InJson(type_id, _obj[1].active, _obj[1].amount, _obj[1].percent, _obj[1].value);
                    _detail = Tab_Detail_Get_Largest_Value_InJson(service_id, _obj[2].active, _obj[2].amount, _obj[2].percent, _obj[2].value);
                    if (_all != "0") {
                        if (
                            (Number(_all.percent) * service_amount) / 100 > _max
                            ||
                            Number(_all.amount) > _max
                        ) {
                            _max = ((Number(_all.percent) * service_amount) / 100 > Number(_all.amount))
                                ? (Number(_all.percent) * service_amount) / 100
                                : Number(_all.amount)
                            _res.percent = _all.percent;
                            _res.amount = _all.amount;

                        }
                    }
                    if (_type != "0") {
                        if (
                            (Number(_type.percent) * service_amount) / 100 > _max
                            ||
                            Number(_type.amount) > _max
                        ) {
                            _max = ((Number(_type.percent) * service_amount) / 100 > Number(_type.amount))
                                ? (Number(_type.percent) * service_amount) / 100
                                : Number(_type.amount)
                            _res.percent = _type.percent;
                            _res.amount = _type.amount;

                        }
                    }
                    if (_detail != "0") {
                        if (
                            (Number(_detail.percent) * service_amount) / 100 > _max
                            ||
                            Number(_detail.amount) > _max
                        ) {
                            _max = ((Number(_detail.percent) * service_amount) / 100 > Number(_detail.amount))
                                ? (Number(_detail.percent) * service_amount) / 100
                                : Number(_detail.amount)
                            _res.percent = _detail.percent;
                            _res.amount = _detail.amount;

                        }
                    }
                }
            }
        }
        return _res;
    }
    catch (ex) {
        return "0";
    }
}
function Tabdetail_ProResult(final_PriceRoot, _quantity, _obj, isvoucher) {
    try {
        //Voucher khong quan tam den so luong
        let _res = {};
        _res.result_percent = 0;
        _res.result_value = 0;
        if (_obj.amount != 0) {
            _res.result_value = (isvoucher == 1 ? _obj.amount : (_obj.amount * _quantity));
            _res.result_percent = 0;
        }
        else {
            _res.result_value = final_PriceRoot * _obj.percent / 100;
            _res.result_percent = _obj.percent;
        }

        return _res;
    }
    catch (ex) {
        return "0";
    }
}
//function Tabdetail_ProResult(_price, _quantity, _obj) {
//    try {
//        let _res = {};
//        _res.result_percent = 0;
//        _res.result_value = 0;
//        if (_obj.amount != 0) {
//            _res.result_value = _obj.amount * _quantity;
//            _res.result_percent = 0;
//        }
//        else {
//            _res.result_value = ((_obj.percent * _price) / 100) * _quantity;
//            _res.result_percent = _obj.percent;
//        }

//        return _res;
//    }
//    catch (ex){
//        return "0";
//    }
//}
function onTab_Program_Customer_Member() {
    if (tab_changing_flag == 1) {
        tab_changing_flag = 0;
        let _id = Number($('#DiscountCustomerMemberID').dropdown('get value')) ? Number($('#DiscountCustomerMemberID').dropdown('get value')) : 0;
        if (_id != 0) {
            $("#DiscountCustomerGroupID").dropdown("clear");
            $("#discountTabCombo").dropdown("clear");
        }
        tab_changing_flag = 1;
        Tab_Count_Price_For_All();
    }
}
function onTab_Program_Customer_Group() {
    if (tab_changing_flag == 1) {
        tab_changing_flag = 0;
        let _id = Number($('#DiscountCustomerGroupID').dropdown('get value')) ? Number($('#DiscountCustomerGroupID').dropdown('get value')) : 0;
        if (_id != 0) {
            $("#DiscountCustomerMemberID").dropdown("clear");
            $("#discountTabCombo").dropdown("clear");
        }
        tab_changing_flag = 1;
        Tab_Count_Price_For_All();
    }
}
function onTab_Program_CTKM() {

    if (tab_changing_flag == 1) {
        tab_changing_flag = 0;
        let _id = Number($('#discountTabCombo').dropdown('get value')) ? Number($('#discountTabCombo').dropdown('get value')) : 0;
        if (_id != 0) {
            $("#DiscountCustomerGroupID").dropdown("clear");
            $("#DiscountCustomerMemberID").dropdown("clear");
        }
        tab_changing_flag = 1;
        Tab_Count_Price_For_All();
    }
}
function onTab_Program_Voucher() {
    let _id = Number($('#DiscountVoucherID').dropdown('get value')) ? Number($('#DiscountVoucherID').dropdown('get value')) : 0;
    if (_id != 0) {
        $('#DiscountCamVoucherID').dropdown("clear");
    }
    else {

    }
    Tab_Count_Price_For_All();
}

function onTab_Program_Voucher_KeyDown(e) {
    if (e.which == 13) {
        onTab_Program_Voucher_ByCode();
    }
}
function onTab_Program_Voucher_PasteQR(e) {
    catchPaste(e, this, function (clipData) {
        onTab_Program_Voucher_ByCode(clipData);
    });
}
async function onTab_Program_Voucher_ByCode(code = '') {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let searchtext = code != '' ? code : $('#searchDiscountVoucher').val();
            if (searchtext != undefined && searchtext != '') {
                let datavourcher = data_voucher.find((word) => { return word.Code == searchtext });
                if (datavourcher && datavourcher.ID != 0) {
                    $('#DiscountVoucherID').dropdown('refresh');
                    $('#DiscountVoucherID').dropdown('set selected', datavourcher.ID);
                    $('#searchDiscountVoucher').val('');
                    setTimeout(() => {
                        $('#DiscountVoucherID').dropdown('hide');
                    }, 300)
                }
            }
            resolve()
        })
    })
}


function onTab_Program_VoucherCamVoucher() {
    let _id = Number($('#DiscountCamVoucherID').dropdown('get value')) ? Number($('#DiscountCamVoucherID').dropdown('get value')) : 0;
    if (_id != 0) {
        $('#DiscountVoucherID').dropdown("clear");
    }
    else {

    }
    Tab_Count_Price_For_All();
}
function onTab_Program_CamVoucher_KeyDown(e) {
    if (e.which == 13) {
        onTab_Program_CamVoucher_ByCode();
    }
}
function onTab_Program_CamVoucher_PasteQR(e) {
    catchPaste(e, this, function (clipData) {
        onTab_Program_CamVoucher_ByCode(clipData);
    });
}
async function onTab_Program_CamVoucher_ByCode(code = '') {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let searchtext = code != '' ? code : $('#Tabcamvou_Search').val();
            if (searchtext != undefined && searchtext != '' && searchtext.length >= 6) {

                AjaxLoad(url = "/Customer/Service/TabMulti/?handler=SearchVoucher"
                    , data = {
                        'CustomerID': ser_MultiTabCustomerID,
                        'textSearch': searchtext
                    }
                    , async = true
                    , error = function () { notiError_SW() }
                    , success = function (result) {
                        if (result != "0") {
                            let data_voucher = JSON.parse(result);
                            if (data_voucher && data_voucher.length > 0) {
                                data_camvoucher[CurrentService_Choose] = data_voucher ? (data_voucher).reduce((pre, arr) => { arr.Name = `<span class="text-sm text-primary mb-0">${arr.Code}</span> ${arr.Name}`; pre.push(arr); return pre }, []) : [];
                                Tab_Detail_Loading_Program_By_Service(data_service_root, data_voucher, CurrentService_Choose, "ccbDiscountCamVoucherID");
                                $('#DiscountCamVoucherID').dropdown('refresh');
                                $('#DiscountCamVoucherID').dropdown('set selected', data_voucher[0]?.ID ?? 0);
                                Tab_Count_Price_For_All();
                            }
                        }

                    }
                );
            }
            resolve()
        })
    })
}


// #endregion

// #region // Detect function
function Tab_Detail_Get_Largest_Value_InJson(id, active, amount, percent, value) {
    try {
        let _res = {};
        _res.amount = 0;
        _res.percent = 0;

        if (Number(active) == 1 && id == -1) {
            _res.amount = amount;
            _res.percent = percent;
        }
        else if (Number(active) == 0) {
            _res.amount = 0;
            _res.percent = 0;
        }
        else {
            if (value == "[]" || value == "") _res = false;
            else {
                let _data = value.filter(word => Number(word["id"]) == Number(id));
                if (_data != undefined && _data.length != 0) {
                    _res.amount = _data[0].amount;
                    _res.percent = _data[0].percent;
                }
            }
        }


        return _res;
    }
    catch (ex) {
        return "0";
    }
}
function Tab_Detail_Checking_Service_InJSON(service_id, type_id, json) {
    try {
        let _res = false;
        let _data = JSON.parse(json);
        let _all = {}, _type = {}, _detail = {};
        if (_data != undefined && _data != null && _data.length > 0) {
            _all = _data[0];
            _type = _data[1];
            _detail = _data[2];
            if (Tab_Detail_Checking_Service_InJSON_Detail(-1, _all.active, _all.value)) _res = true;
            else if (Tab_Detail_Checking_Service_InJSON_Detail(type_id, _type.active, _type.value)) _res = true;
            else if (Tab_Detail_Checking_Service_InJSON_Detail(service_id, _detail.active, _detail.value)) _res = true;
            else _res = false;
        }
        return _res;
    }
    catch (ex) {
        return false;
    }
}
function Tab_Detail_Checking_Service_InJSON_Detail(id, active, value) {
    try {
        let _res = false;
        if (Number(active) == 1 && id == -1) _res = true;
        else if (Number(active) == 0) _res = false;
        else {
            if (value == "[]" || value == "") _res = false;
            else {
                let _data = value.filter(word => Number(word["id"]) == Number(id));
                if (_data != undefined && _data.length != 0) {
                    _res = true;
                }
                else _res = false;

            }
        }
        return _res;
    }
    catch (ex) {
        return false;
    }
}
// #endregion

