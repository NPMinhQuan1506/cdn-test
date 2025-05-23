﻿//#region // note service
function Add_new_row_price_service() {
    let element = {};
    let id = (new Date()).getTime();
    element.id = 0;
    element.branchid = 0;
    element.exchangeid = '';
    element.exname = 0;
    element.exvalue = 0;
    element.pricemin = 0;
    element.pricemax = 0;
    data_price_service[id] = element;

    Render_PriceService_Add(id, element, 'dtTablePriceServiceBody');
    return id;
}

async function Render_PriceService_Add(key, value, id) {
    return new Promise((resolve) => {
        setTimeout(() => {
            var myNode = document.getElementById(id);
            if (myNode != null) {
                let tr =
                    '<td class="d-none">' + key + '</td>'
                    + '<td class="vt-number-order"></td>'
                    + '<td>' + AddCell_Price_MinNumber(key, value.pricemin) + '</td>'
                    + '<td>' + AddCell_Price_MaxNumber(key, value.pricemax) + '</td>'
                    + '<td>' + AddCell_Price_Currency(key) + '</td>'
                    + '<td>' + AddCell_Price_ExchangeRate(key, value.exvalue) + '</td>'
                    + '<td>' + AddCell_Price_Branch(key) + '</td>'
                    + '<td style="width: 50px;">'
                    + '<button class="buttonGrid"><i class="buttonDeleteClass vtt-icon vttech-icon-delete"></i></button>'
                    + '</td>'
                tr = '<tr class="rowPriceService vt-number"  id="rowPrice_' + key + '">' + tr + '</tr>';
                myNode.insertAdjacentHTML('beforeend', tr);
            }
            Fill_data_price_service_To_Design(data_price_service);
            Event_Element_Service_Price();
        }, 10);
    })
}
function AddCell_Price_MinNumber(randomNumber, number) {
    let resulf = '<input class="price_min form-control amount_thousand" id="price_min_' + randomNumber + '"  value="' + number + '" />';
    resulf = resulf;
    return resulf;
}
function AddCell_Price_MaxNumber(randomNumber, number) {
    let resulf = '<input class="price_max form-control amount_thousand" id="price_max_' + randomNumber + '"  value="' + number + '" />';
    resulf = resulf;
    return resulf;
}
function AddCell_Price_Currency(randomNumber) {
    let resulf = '<div class="ui fluid search selection dropdown currencyPrice form-control" title="' + randomNumber + '"  id="currencyPrice_' + randomNumber
        + '"><input type="hidden"/><i class="dropdown icon"></i>' +
        '<input id="currencyPriceSearch_' + randomNumber + '" class="search" autocomplete="off" tabindex="0" /><div class="default text">' + Outlang["Sys_ty_gia_tien_te"]+'</div><div id="cbbcurrencyPrice_' + randomNumber + '" class="menu" tabindex="-1">';

    for (i = 0; i < data_currency.length; i++) {
        resulf = resulf + '<div class="item" data-value=' + data_currency[i].ID + '><div class="iti__flag-box"><div class="' + data_currency[i].Flag + ' iti__flag"></div></div>' + data_currency[i].Name + '</div>'
    }
    resulf = resulf + '</div>';
    return resulf;

}
function AddCell_Price_ExchangeRate(randomNumber, value) {
    if (value == "1") value = '-'
    else value = formatNumber(value);
    let resulf = '<div style="text-align:center" class="exchangePriceService" data-exchange="' + value + '" id="exchangePriceService_' + randomNumber + '" >'
        + (value != 0 ? (value) : "") + '</div>';
    resulf = resulf;
    return resulf;
}
function AddCell_Price_Branch(randomNumber) {
    let resulf = '<div class="ui fluid multiple search selection dropdown branchPrice form-control" title="' + randomNumber + '"  id="branchPrice_' + randomNumber
        + '"><input type="hidden"/><i class="dropdown icon"></i>' +
        '<input id="branchPriceSearch_' + randomNumber + '" class="search" autocomplete="off" tabindex="0" /><div class="default text">' + Outlang["Chi_nhanh"] +'</div><div id="cbbbranchPrice_' + randomNumber + '" class="menu" tabindex="-1">';

    for (i = 0; i < data_branch.length; i++) {
        resulf = resulf + '<div class="item" data-value=' + data_branch[i].ID + '>' + data_branch[i].ShortName + '</div>'
    }
    resulf = resulf + '</div>';
    return resulf;
}

function Fill_data_price_service_To_Design(data) {
    for ([key, value] of Object.entries(data)) {
        $("#currencyPrice_" + key).dropdown("refresh");
        $("#currencyPrice_" + key).dropdown("set selected", value.exchangeid);
        $('#price_min_' + key).val(value.pricemin);
        $('#price_max_' + key).val(value.pricemax);

        if (value.branchid != '') {
            $('#branchPrice_' + key).dropdown('refresh')
            $('#branchPrice_' + key).dropdown('set selected', value.branchid.split(","));
        }
    }
}
function Event_Element_Service_Price() {
    $('#dtTablePriceService .ui.dropdown').dropdown(initSettingDropdown);
    $(".branchPrice").change(function () {
        let id = this.id.replace("branchPrice_", "")
        let _v = $('#' + this.id).dropdown('get value');
        data_price_service[id].branchid = _v;
    });

    $(".price_min").change(function () {
        let id = this.id.replace("price_min_", "")
        data_price_service[id].pricemin = this.value;
    });
    $(".price_max").change(function () {
        let id = this.id.replace("price_max_", "");
        data_price_service[id].pricemax = this.value;
    });
    $(".currencyPrice").change(function () {
        let idcom = this.id;
        let id = idcom.replace("currencyPrice_", "")
        let currencyid = Number($('#' + idcom).dropdown('get value')) ? Number($('#' + idcom).dropdown('get value')) : 0;
        data_price_service[id].exchangeid = currencyid;
        let _data = data_currency.filter(word => {
            return (word["ID"] == currencyid);
        });
        if (_data != undefined && _data.length != 0) {
            if (formatNumber(_data[0].Exchange) == "1") {
                $('#exchangePriceService_' + id).html('-');
            }
            else $('#exchangePriceService_' + id).html(formatNumber(_data[0].Exchange));
        }

    });
    $('#dtTablePriceService tbody').on('click', '.buttonDeleteClass', function (event) {
        let timespan = Number($(this).closest('tr')[0].childNodes[0].innerHTML);
        delete data_price_service[timespan];
        $('#rowPrice_' + timespan).remove();
        event.stopPropagation();
    });
    $(".amount_thousand").divide();
}

function Checking_Validate_Price_Service() {
    let isprice_ = 0;
    let ismatch = 0;
    let exchangeRatecheck = '';
    let branchcheck = '';
    for ([key, value] of Object.entries(data_price_service)) {
   
        value.pricemax = value.pricemax.toString().includes(',') ? Number(value.pricemax.replaceAll(',', '')) : Number(value.pricemax);
        value.pricemin = value.pricemin.toString().includes(',') ? Number(value.pricemin.replaceAll(',', '')) : Number(value.pricemin);
        if (Number(value.exchangeid) == 0) {
            $('#currencyPrice_' + key).addClass('error'); isprice_ = 1;
        }
        else $('#currencyPrice_' + key).removeClass('error');

        if (value.branchid == '') {
            $('#branchPrice_' + key).addClass('error'); isprice_ = 1;
        }
        else $('#branchPrice_' + key).removeClass('error');



        if (!$.isNumeric(value.pricemin) || Number(value.pricemin) < 0) {
            $('#price_min_' + key).addClass('error'); isprice_ = 1;
        }
        else $('#price_min_' + key).removeClass('error');


        if (!$.isNumeric(value.pricemax) || Number(value.pricemax) < 0) {
            $('#price_max_' + key).addClass('error'); isprice_ = 1;
        }
        else $('#price_max_' + key).removeClass('error');



        if (Number(value.pricemin) >= 0 && Number(value.pricemax) >= 0
            && $.isNumeric(value.pricemin) && $.isNumeric(value.pricemax)
        ) {
            if (Number(value.pricemin) > Number(value.pricemax)) {
                $('#price_min_' + key).addClass('error');
                $('#price_max_' + key).addClass('error');
                isprice_ = 1;
            } else {
                $('#price_max_' + key).removeClass('error');
                $('#price_min_' + key).removeClass('error');
            }
        }

        //if ((exchangeRatecheck.includes('[' + value.exchangeid + ']')) || !Price_Branch_Check_MatchBranch(branchcheck, value.branchid)) {
        //    ismatch = 1;
        //    $('#rowPrice_' + key).addClass('error');
        //}
        //else {
        //    $('#rowPrice_' + key).removeClass('error');
        //}


        exchangeRatecheck = exchangeRatecheck + '[' + value.exchangeid + ']'
        branchcheck = branchcheck + value.branchid;
    }
    if (isprice_ == 1 || ismatch == 1) $('#textShowMessage').html(Outlang["Kiem_tra_du_lieu_gia_theo_chi_nhanh"]);
}

function Price_Branch_Check_MatchBranch(master, detail) {
    try {
        if (detail == '') return true;
        master = ',' + master + ',';
        _x = detail.split(',');
        for (i = 0; i < _x.length; i++) {
            if (master.includes(',' + _x[i] + ',')) {
                i = _x.length;
                return false;
            }
        }
        return true;
    }
    catch (ex) {
        return true;
    }
}
    //#endregion