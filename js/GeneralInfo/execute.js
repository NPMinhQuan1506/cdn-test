﻿
//#region // Layout
//function GeneralInfo_LayoutRender (data, id) {
//    var myNode = document.getElementById(id);
//    if (myNode != null) {
//        let stringContent = '';
//        if (data && data.length > 0) {
//            for (let i = 0; i < data.length; i++) {
//                let link = '';
//                let tr = '';
//                switch (data[i]) {
//                    case 'anam':
//                        link = '/Customer/GeneralInfo/CustomerAnamnesis';
//                        break;
//                    case 'complain':
//                        link = '/Customer/GeneralInfo/CustomerComplaint';
//                        break;
//                    case 'app':
//                        link = '/Customer/GeneralInfo/CustomerSchedule';
//                        break;
//                    case 'commit':
//                        link = '/Customer/GeneralInfo/CustomerCommitment';
//                        break;
//                    case 'tab':
//                        link = '/Customer/GeneralInfo/CustomerTab';
//                        break;
//                    case 'treat':
//                        link = '/Customer/GeneralInfo/CustomerTreat';
//                        break;
//                    case 'payment':
//                        link = '/Customer/GeneralInfo/CustomerPayment';
//                        break;

//                    default: link = '';
//                        break;
//                }
//                if (link != '') {
//                    tr = '<div  data-link=' + link + ' class="generalinfo_render mb-3 mt-lg-0 mt-4"></div>';
//                }
//                stringContent = stringContent + tr;
//            }
//        }
//        document.getElementById(id).insertAdjacentHTML('beforeend', stringContent);
//    }
//}
//function GeneralInfo_LayoutFill () {
//    $(".generalinfo_render").each(function (index) {
//        let link = $(this).attr('data-link');
//        $(this).load(link, function (e) { });
//    });
//}
//#endregion

//#region // Info

async function GeneralInfo_SignLoad() {
    return new Promise(resolve => {
        $("#tabCust_Sign").load("/Customer/GeneralInfo/CustomerSign?ver=" + versionofWebApplication);
        resolve();
    });

}

async function GeneralInfo_InfoRender(data) {
    return new Promise(resolve => {
        if (data != undefined) {
            $('#txtName').text(data.Name);
            let _age, birth;
            let CusSource = data.CustomerSource;
            if (!data.Birthday.includes('1900')) {
                _age = Sys2Date().FUTC(new Date(data.Birthday), new Date()).YDistance();
                birth = SysDate().FUTC(data.Birthday).DateText();
            }
            else {
                _age = Sys2Date().FUTC(new Date(data.BirthYear, 1, 1), new Date()).YDistance();
                birth = '';
            }
            if (_age == 0) {
                $('#txtBirthday').html(`${birth} <span class="ps-2 fw-bold"> < ${(_age + 1) + ' ' + Outlang["Tuoi"]}</span>`);
            }
            else {
                $('#txtBirthday').html(`${birth}${(_age > 0 && _age < 100) ? `<span class="ps-2 fw-bold ">${_age + ' ' + Outlang["Tuoi"]}</span>` : ``}`);
            }
            if (data.facebookurl != '') {
                $('#buttonfacebook').attr("data-link", GeneralInfo_CheckDataLinkOld(data.facebookurl, 'facebook'));
                $("#buttonfacebook").click(function () {
                    onclicksocial_icon($(this).attr('data-link'));
                });
            }
            else $('#buttonfacebook').addClass('nolink');
            if (data.instgramurl != '') {
                $('#buttoninstagram').attr("data-link", GeneralInfo_CheckDataLinkOld(data.instgramurl, 'instagram'));
                $("#buttoninstagram").click(function () {
                    onclicksocial_icon($(this).attr('data-link'));
                });
            }
            else $('#buttoninstagram').addClass('nolink');
            if (data.viberurl != '') {
                $('#buttonviber').attr("data-link", GeneralInfo_CheckDataLinkOld(data.viberurl, 'viber'));
                $("#buttonviber").click(function () {
                    onclicksocial_icon($(this).attr('data-link'));
                });
            }
            else $('#buttonviber').addClass('nolink');
            if (data.zalourl != '') {
                $('#buttonzalo').attr("data-link", GeneralInfo_CheckDataLinkOld(data.zalourl, 'zalo'));
                $("#buttonzalo").click(function () {
                    onclicksocial_icon($(this).attr('data-link'));
                });
            }
            else $('#buttonzalo').addClass('nolink');
            if (Number(data.Gender) == 60) {
                $('#txtgender').removeClass('fa-venus').addClass('fa-mars');
                $('#txtgender').css('color', '#2f89ff');
            }
            else {
                $('#txtgender').removeClass('fa-mars').addClass('fa-venus');
                $('#txtgender').css('color', '#ff6b85');
            }

            if (data.CustomerSourceDetail != "") {
                CusSource += (" - " + data.CustomerSourceDetail);
            }
            if (data.CustomerBroker != "") {
                CusSource += (" - " + data.CustomerBroker);
                if (data.BrokerPhone != "") {
                    CusSource += (" ( <span class='_tab_control_' data-tab='phone_customer'>" + data.BrokerPhone + "</span>)");
                }
            }

            $('#txtEmail').text(data.Email1);
            $('#txtCarrer').text(data.Carrer);
            $('#txtCustomerSource').html(CusSource);
            $('#txtInfoNote').text(data.Note);
            $('#txtCusCreate').text(`${SysDate().FUTC(data.created).DateText()}${data.BranchAlias != "" ? " | " + data.BranchAlias : ""}`);

            let CustAddress = data.Address != '' ? (data.Address + ', ') : '';
            let CustCommune = data.Commune != '' ? (data.Commune + ', ') : '';
            let CustDistrict = data.District != '' ? (data.District + ', ') : '';
            let CustCity = data.City != '' ? (data.City + ', ') : '';
            let CustNation = data.NationName != '' ? data.NationName : '';
            let _address=CustAddress+CustCommune+CustDistrict+CustCity+(data.NationCode=="4"? CustNation:"");
                      
            _address=_address.trim();
            $('#txtAddress').text(_address.endsWith(',')? _address.slice(0,-1):_address);
            if (Number(data.AppID) == 0) {
                $('#divCheckAppointmentExtra').hide();
            }
            else {
                $('#divCheckAppointmentExtra').show();
            }
            GeneralInfo_SetBarcode(data.Cust_Code);

            if (data.Represent_Name != '') {
                $('#txtrepre_name').text(data.Represent_Name);
                $('#txtrepre_phone').text(data.Represent_Phone);
                $('#txtrepre_id').text(data.Represent_ID);
                $('#txtrepre_type').text(data.Represent_Type);
                $('#tabCust_guardianArea').removeClass('d-none');
            }
            if (ser_IsMobileApp == "1") {
                $("#txtCusAppUser").text(data.AppUser)
                $("#txtCusAppPassword").text(data.AppPassword);
                $("#txtCusAppLastSignin").text(SysDate().FUTC(data.AppLastSignin).DateText());
                $('#tabCust_mobileArea').removeClass('d-none');
            }
            Checking_TabControl_Permission();
        }
        resolve();
    });

}
async function GeneralInfo_SetBarcode(_code) {
    return new Promise(resolve => {
        JsBarcode("#txtCustBarcode", xoa_dau(_code), {
            lineColor: "#031313",
            width: 2,
            height: 30,
            displayValue: false
        });
        setTimeout(function () {
            $('#txtCustBarcode').parent().removeClass('opacity-1');
        }, 100);
        resolve();
    });
}

async function GeneralInfo_InfoLoadGroup() {
    return new Promise(resolve => {
        AjaxLoad(url = "/Customer/GeneralInfo/?handler=LoadCustomerGroup"
            , data = { 'custID': ser_MainCustomerID }
            , async = true
            , error = function () { notiError_SW() }
            , success = function (result) {
                if (result != "0") {
                    let data = JSON.parse(result);
                    if (data[0].GroupName == "") {
                        $("#customerGroupName").html(Outlang["Chon_nhom_khach_hang"]);
                    } else {
                        $("#customerGroupName").html(data[0].GroupName);
                    }

                    if (data[0].Image == '' || data[0].Image == undefined) {
                        $('#avatarCustomerGroup').attr('src', Master_Default_Pic);
                    }
                    else {
                        $('#avatarCustomerGroup').attr('src', data[0].Image);
                    }
                    customerGroupID = data[0].ID;
                    $('#customerGroup').show();
                }
            }
        );
        resolve();
    });
}
async function GeneralInfo_CCLoad() {
    return new Promise(resolve => {
        AjaxLoad(url = "/Customer/GeneralInfo/?handler=LoadCustCare"
            , data = { 'custID': ser_MainCustomerID }
            , async = true
            , error = function () { notiError_SW() }
            , success = function (result) {
                if (result != "0") {
                    let data = JSON.parse(result);
                    if (data != undefined && data.length == 1) {
                        ser_CSKHID = Number(data[0].CSKHID);
                        ser_TeleID = Number(data[0].TeleID);
                        ser_ResponID = Number(data[0].EmpRespon);

                        if (Number(ser_TeleID) != 0) {
                            let obj = Fun_GetObject_ByID(DataEmployee, ser_TeleID);
                            let telename = obj != undefined ? obj.Name : '';
                            let teleimg = obj != undefined ? obj.Avatar : '';
                            $('#infotele_name').html(telename);
                            $('#infotele_img').attr('src', (teleimg != '' ? teleimg : Master_Default_Pic));
                        }
                        else {
                            $('#infotele_name').html('-');
                        }

                        if (Number(ser_CSKHID) != 0) {
                            let obj = Fun_GetObject_ByID(DataEmployee, ser_CSKHID);
                            let cskhname = obj != undefined ? obj.Name : '';
                            let cskhimg = obj != undefined ? obj.Avatar : '';
                            $('#infocskh_name').html(cskhname);
                            $('#infocskh_img').attr('src', (cskhimg != '' ? cskhimg : Master_Default_Pic));
                        }
                        else {
                            $('#infocskh_name').html(Outlang["Chon_cham_soc_vien"]);
                        }

                        if (Number(ser_ResponID) != 0) {
                            let obj = Fun_GetObject_ByID(DataEmployee, ser_ResponID);
                            let resname = obj != undefined ? obj.Name : '';
                            let resimg = obj != undefined ? obj.Avatar : '';
                            $('#infodocres_name').html(resname);
                            $('#infodocres_img').attr('src', (resimg != '' ? resimg : Master_Default_Pic));
                        }
                        else {
                            $('#infodocres_name').html(Outlang["Chon_bac_si"]);
                        }
                    }

                }
            }
        );
        resolve();
    });
}
function EditCustomerGroup() {
    $("#DetailModal_Content").html('');
    $("#DetailModal_Content").load("/Customer/CustomerGroupDetail?CustomerID=" + ser_MainCustomerID + "&GroupID=" + customerGroupID + "&ver=" + versionofWebApplication);
    $('#DetailModal').modal('show');
    return false;
}
function EditCustomerCare(type) {
    $("#DetailModal_Content").html('');
    $("#DetailModal_Content").load(`/Customer/GeneralInfo/CustCareDetail?type=${type}`);
    $('#DetailModal').modal('show');
    return false;
}
//#endregion


//#region // Note
function GeneralInfo_LoadHistory() {
    AjaxLoad(url = "/Customer/GeneralInfo/?handler=LoadHistory"
        , data = {
            'CustomerID': ser_MainCustomerID
        }
        , async = true
        , error = function () {
            notiError_SW();
        }
        , success = function (result) {
            if (result != "0") {
                let data = JSON.parse(result);
                GeneralInfo_NoteRender(data, "generalInfo_note");
            }
        }
    );
}
async function GeneralInfo_NoteRender(data, id) {
    return new Promise(resolve => {
        var myNode = document.getElementById(id);
        if (myNode != null) {
            myNode.innerHTML = '';
            let stringContent = '';
            if (data && data.length > 0) {

                for (var i = 0; i < data.length; i++) {
                    let item = data[i];
                    let itemEmp = item.Employee != 0 ? `<span class="bg-gradient-dark badge me-2 px-2 py-1 rounded-1 text-capitalize text-xs" ><i class="fas fa-user me-1"></i>${item.Employee}</span>` : "";
                    let tr = '<div class="pt-0 p-1 d-flex mb-1">'
                        + '<div class="w-100">'
                        + '<span class="text-sm text-dark">'
                        + '<span data-id="' + item.ID + '" class="text-sm fw-bold text-primary me-2 border-bottom border-primary cursor-pointer buttonEditClass">' + SysDate().FUTC(item.Created).DateText() + '</span>'
                        + '<span class="badge border text-dark fw-bold text-xs text-capitalize px-2 py-1 me-2 rounded-1" style="background-color:' + item.ColorCode + '29">' + item.MasterStatusName + '</span>'
                        + itemEmp
                        + '<span class="content_line_clamp" style="white-space: pre-line">' + item.Content + '</span>'
                        + '</span>'
                        + '</div>'
                        + '</div>'

                    stringContent = stringContent + tr;
                }

            }
            document.getElementById(id).innerHTML = stringContent;
            GeneralInfo_HistoryEvent();
        }
        resolve();
    });
}
function GeneralInfo_HistoryEvent() {
    $('#generalInfo_note .buttonEditClass').unbind('click').on('click', function () {
        let ID = Number($(this).attr('data-id'));
        if (!isNaN(ID))
            editHistory(ID, ser_MainCustomerID);
        //else editAdvice(ID, ser_CustomerHistoryID);
    });
}
function GeneralInfo_HistoryDetail() {
    let objs = $("#divCustomerTabContent [data-tab='/Customer/HistoryList?CustomerID=']");
    if (objs != undefined && objs.length == 1) {
        objs.tab('show')
        $("#divCustomerTabContent a").removeClass('active');
        objs.addClass('active');
    }
}
//#endregion

//#region // Relation Ship
async function GeneralInfo_RelationRender(data, dataship, id) {
    return new Promise(resolve => {
        var myNode = document.getElementById(id);
        if (myNode != null) {
            myNode.innerHTML = '';
            let stringContent = '';
            if (data && data.length >= 0) {
                for (let j = 0; j < data.length; j++) {
                    let item = data[j];
                    let custid = 0, custname = '', custimg = '', custcode = '';
                    if (item.CustID != ser_MainCustomerID) {
                        custid = item.CustID;
                        custname = item.CustName;
                        custimg = item.Image;
                        custcode = item.CustCode;

                    }
                    else if (item.CustID1 != ser_MainCustomerID) {
                        custid = item.CustID1;
                        custname = item.CustName1;
                        custimg = item.Image1;
                        custcode = item.CustCode1;

                    }
                    if (custid != 0) {
                        let tr =
                            `<li class="list-group-item border-0 align-items-center pb-2 cursor-pointer d-flex rounded-3 text-dark text-sm">
                                <img class="border avatar avatar-sm" onerror="Master_OnLoad_Error_Image(this)" src="${custimg != "" ? custimg : "/default.png"}">
                                <div class="ps-2">
                                    <div class="d-inline">
                                        <span class="fw-bold pe-1">${item.RelaName}</span>
                                    </div>
                                    <div class="d-inline">
                                         <a href="/Customer/MainCustomer?CustomerID=${custid}" target="_blank">${custcode}</a>
                                        <div class="fst-italic">${custname}</div>
                                     </div>
                                </div>
                            <hr class="horizontal dark my-0 mt-2">
                        </li>`
                        stringContent = stringContent + tr;
                    }



                }
                for (j = 0; j < dataship.length; j++) {
                    let item = dataship[j];
                    if (item.CustID != ser_MainCustomerID) {
                        let tr =
                            `<li class="list-group-item border-0 align-items-center pb-2 position-relative cursor-pointer d-flex rounded-3 text-dark text-sm">
                             <img class="border avatar avatar-sm" onerror="Master_OnLoad_Error_Image(this)" src="${item.Image != "" ? item.Image : "/default.png"}">
                                <div class="ps-2">
                                    <div class="d-inline">
                                        <a class="text-dark me-2 cursor-pointer" >
                                            <i class="fas fa-users"></i>
                                        </a>
                                        <a href="/Customer/MainCustomer?CustomerID=${item.CustID}" target="_blank">${item.CustCode}</a>
                                        <span class="ps-1">${item.CustName}</span>
                                    </div>
                                    <div class="d-inline">
                                        <div class="fst-italic">${item.Address != "" ? item.Address : "-"}</div>
                                     </div>
                                </div>

                            <hr class="horizontal dark my-0 mt-2">
                        </li>`
                        stringContent = stringContent + tr;
                    }
                }
            }

            document.getElementById(id).innerHTML = stringContent;
        }
        resolve();
    });
}
function GeneralInfo_RelationEdit() {
    $("#DetailModal_Content").html('');
    $("#DetailModal_Content").load("/Customer/RelationshipDetail?CustomerID=" + ser_MainCustomerID);
    $('#DetailModal').modal('show');
}
function GeneralInfo_RelationLoad() {
    AjaxLoad(url = "/Customer/GeneralInfo/?handler=LoadRelation"
        , data = { 'custID': ser_MainCustomerID }
        , async = true
        , error = function () { notiError_SW() }
        , success = function (_result) {
            if (_result != "0") {
                let _datas = JSON.parse(_result);
                GeneralInfo_RelationRender(_datas.Table, _datas.Table1, "generalInfo_relation")

            }
        }
    );
}
//#endregion

//#region //Image
async function GeneralInfo_RenderImage(data, id) {
    return new Promise(resolve => {
        var myNode = document.getElementById(id);
        let dataGal = [];
        if (myNode != null) {
            myNode.innerHTML = '';
            let stringContent = '';
            if (data && data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    let item = data[i];
                    let link_img = sys_HTTPImageRoot + item.MasterFolder
                        + '/' + item.FolderName + '/' + encodeURIComponent(item.RealName);
                    let link_feaute = sys_HTTPImageRoot + item.MasterFolder
                        + '/' + item.FolderName + '/' + encodeURIComponent(item.FeatureImage);
                    link_img = GeneralImg_GetLink(item.TypeUpload, item.CloudID, link_img);
                    link_feaute = GeneralImg_GetLinkThumb(item.TypeUpload, item.CloudFeatID, link_feaute);

                    let link_imgthum = "'" + link_feaute + "'";
                    let sub = `<div class="text-sm">${item?.CreatedBy}</div>
                        <div>${SysDate().FUTC(item?.Created).DTText()}</div>`;

                    tr = `<a data-sub-html="" class="avatar  description-rp design_img_item GeneralInfo_Image" style="background-image: url(${link_imgthum})"> 
                            <img class="imgload" style="width: 0px;height: 0px;object-fit: cover;opacity: 0;"  src="${link_img}"/> 
                         </a>`;

                    stringContent = stringContent + tr;
                    //galery

                    let e = {};
                    e["src"] = link_img ?? "/default.png";
                    e["thumb"] = link_feaute ?? "/default.png";
                    e["subHtml"] = sub;
                    dataGal.push(e);
                }

            }
            document.getElementById(id).innerHTML = stringContent;
        }
        _GeneralInfo_dynamicGallery.refresh(dataGal);
        GeneralInfo_Event();
        resolve();
    });
}
function GeneralImg_GetLink(ty, id, link) {
    ty = ty.toLowerCase();
    switch (ty) {
        case "":
            {
                return link;
                break;
            }
        case "gdrive":
            {
                return Driver_GenLink(id);
                break;
            }
        case "gworkspace":
            {
                return Driver_GenLink(id);
                break;
            }
        default: {
            return link;
            break;
        }
    }
}
function GeneralImg_GetLinkThumb(ty, id, link) {
    ty = ty.toLowerCase();
    switch (ty) {
        case "":
            {
                return link;
                break;
            }
        case "gdrive":
            {
                return Driver_GenThumbnail(id);
                break;
            }
        case "gworkspace":
            {
                return Driver_GenThumbnail(id);
                break;
            }
        default: {
            return link;
            break;
        }
    }
}
function GeneralInfo_Event() {
    $("#lightGallery .GeneralInfo_Image").unbind().click(function (event) {
        _GeneralInfo_dynamicGallery.openGallery($(this).index());
    });
}
function GeneralInfo_ImageDetail() {
    let objs = $("#divCustomerTabContent [data-tab='/Customer/CustomerImage?CustomerID=']");
    if (objs != undefined && objs.length == 1) {
        objs.tab('show')
        $("#divCustomerTabContent a").removeClass('active');
        objs.addClass('active');
    }
}
//#endregion

//#region // App
function GeneralInfo_AddApp() {
    $("#DetailModal_Content").html('');
    $("#DetailModal_Content").load("/Appointment/AppointmentDetail?CustomerID=" + ser_MainCustomerID + "&ver=" + versionofWebApplication);
    $('#DetailModal').modal('show');
}
function GeneralInfo_AppDetail() {

    let objs = $("#divCustomerTabContent [data-tab='/Customer/ScheduleList?CustomerID=']");
    if (objs != undefined && objs.length == 1) {
        objs.tab('show')
        $("#divCustomerTabContent a").removeClass('active');
        objs.addClass('active');
    }

}
function GeneralInfo_LoadApp() {
    AjaxLoad(url = "/Customer/GeneralInfo/?handler=LoadApp"
        , data = { 'custID': ser_MainCustomerID }
        , async = true
        , error = function () { notiError_SW() }
        , success = function (result) {
            if (result != "0") {
                let data = JSON.parse(result);
                GeneralInfo_ShedulerRender(data, "generalInfo_app");
            }
        }
    );
}
async function GeneralInfo_ShedulerRender(data, id) {
    return new Promise(resolve => {
        var myNode = document.getElementById(id);
        if (myNode != null) {
            myNode.innerHTML = '';
            let stringContent = '';
            if (data && data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    let item = data[i];
                    let _avatar = GeneralInfo_ShedulerRender_Doctor(item.DoctorID);
                    let content = item.Content;
                    let typeappp = '';
                    if (item.IsCancel == 1) {
                        content = '<span class="pe-2 text-danger">' + Outlang["Lich_huy"] + ': ' + item.ContentCancel + '</span>';
                    }
                    else {
                        typeappp = item.LangKey != "" ? Outlang[item.LangKey] : item.TypeName;
                        content = `<span class="pe-2 text-dark">${typeappp}</span>` + content;

                    }
                    tr = '<li class="p-3 py-2 border-0 d-flex  mb-0">'
                        + '<div class="avatar avatar-sm me-2" style="min-width: 36px;">'
                        + '<img onerror="Master_OnLoad_Error_Image(this)" src="' + ((_avatar != '') ? _avatar : Master_Default_Pic) + '" class="previewimg border-radius-lg mt-2 ">'
                        + '</div>'
                        + '<div class="d-flex align-items-start flex-column justify-content-center">'
                        + '<span class="text-sm fw-bold">'
                        + '<span data-id="' + item.ID + '" class="text-sm fw-bold text-primary border-bottom border-primary cursor-pointer ' + `${item.IsCancel == 1 ? "" : "buttonEditClass"}` + '">'
                        + SysDate().FUTC(item.Date_From).DTText()
                        + '</span>'
                        + '<span class="ms-2 text-normal text-dark">' + item.ShortName + '</span>'
                        + '</span>'
                        + '<p class="mb-0 mb-0 mt-n0 text-sm text-dark content_line_clamp">' + content + '</p>'
                        + '</div>'

                        + '</li>'
                        + ((i != data.length - 1) ? '<hr class="horizontal dark my-1"  >' : '');

                    stringContent = stringContent + tr;
                }

            }
            document.getElementById(id).innerHTML = stringContent;
            GeneralInfo_ShedulerEvent();
        }
        resolve();
    });
}
function GeneralInfo_ShedulerEvent() {
    $('#generalInfo_app .buttonEditClass').unbind('click').on('click', function () {
        let ID = Number($(this).attr('data-id'));
        if (!isNaN(ID))
            editSchedule(ID, ser_MainCustomerID);
    });
}
function GeneralInfo_ShedulerRender_Doctor(DoctorID) {
    if (Number(DoctorID) != 0) {
        let obj = Fun_GetObject_ByID(DataEmployee, DoctorID);
        if (obj != null) {
            return obj.Avatar;
        }
    }
    return Master_Default_Pic;
}
function GeneralInfo_AddAnamnesis() {
    ser_PatientHistoryID = 0;
    $("#generalInfo_anamnesis").html('');
    $("#generalInfo_anamnesis").load("/Customer/Anamnesis/CustomerAnamnesisDetail?ver=" + versionofWebApplication);
}
function GeneralInfo_LoadAnamnesis() {
    AjaxLoad(url = "/Customer/GeneralInfo/?handler=LoadAnamnesis"
        , data = { 'custID': ser_MainCustomerID }
        , async = true
        , error = function () { notiError_SW() }
        , success = function (result) {
            if (result != "0") {
                let datas = JSON.parse(result);
                let dataSet = datas?.SettingRule ?? []
                let data = datas?.dtMain ?? [];
                $('#GeneralInfo_AnamExprDiv').addClass('d-none');
                if (dataSet?.length == 1) {
                    let Distance = SysDate().FUTC(dataSet[0].LastDate).DTText() != "" ? Sys2Date().FUTC(dataSet[0].LastDate, new Date()).DaDistance() : -1;
                    let maxDay = dataSet[0].MaxDay;
                    if (maxDay > 0) {
                        if (maxDay <= Distance || Distance < 0) {
                            $('#GeneralInfo_AnamExprDiv').removeClass('d-none');
                        }
                        else {
                            if (Distance > 0) $('#GeneralInfo_AnamnesisDisDate').html(`${formatNumber(Distance)} ${Outlang["Ngay"]}`);
                        }
                    }

                }
                if (data.length > 0) {
                    ser_PatientHistoryID = data[0].ID;
                    $("#generalInfo_anamnesis").html('');
                    $("#generalInfo_anamnesis").load("/Customer/Anamnesis/CustomerAnamnesisDetail?ver=" + versionofWebApplication);
                }

            }
        }
    );
}
//#endregion

//#region //Broker

function GeneralInfo_LoadBrokers() {
    try {
        AjaxLoad(url = "/Customer/GeneralInfo/?handler=LoadBroker"
            , data = { 'custID': ser_MainCustomerID }
            , async = true
            , error = function () { notiError_SW() }
            , success = function (result) {
                if (result != "0") {
                    let data = JSON.parse(result);
                    if (data.length > 0) {
                        GeneralInfo_RenderBroker(data, "generalInfo_BodyBrokers");
                    }
                }
            }
        );
    } catch (ex) {
    }
}

async function GeneralInfo_RenderBroker(data, id) {
    return new Promise(resolve => {
        var myNode = document.getElementById(id);
        if (myNode != null) {
            myNode.innerHTML = '';
            let stringContent = '';
            if (data && data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    let item = data[i];
                    tr = `
                        <li class="p-3 py-2 border-0 d-flex  mb-0">
                            <div class="avatar avatar-sm me-2" style="min-width: 36px;">
                                <img onerror="Master_OnLoad_Error_Image(this)" src="${((item.Avatar != '') ? item.Avatar : Master_Default_Pic)}" class="previewimg border-radius-lg mt-2 ">
                            </div>
                            <div class="d-flex align-items-start flex-column justify-content-center">
                                <span class="text-sm fw-bold">
                                    <a class="cursor-pointer fw-bold text-sm" target="_blank" href="/Customer/MainCustomer?CustomerID=${item.RLCustomerID}&ver=${versionofWebApplication}">${item.Code}</a>
                                    <span class="ms-1 text-normal text-dark" >${item.Name}</span>
                                    
                                </span>
                                <div class="text-dark align-items-center d-lg-flex text-sm mt-0 mb-0">
                                    <p class="mb-0 fw-bold">${Outlang["Ngay_tao"] ?? "Ngày tạo"} : </p>
                                    <p class="mb-0 ps-1">
                                        <span class="text-sm text-dark  ">${SysDate().FUTC(item.Created).DateText()}</span>
                                    </p>
                                </div>
                            </div>
                        </li>
                        ${((i != data.length - 1) ? '<hr class="horizontal dark my-1"  >' : '')}
                    `
                    stringContent = stringContent + tr;
                }

            }
            document.getElementById(id).innerHTML = stringContent;
            GeneralInfo_ShedulerEvent();
        }
        resolve();
    });
}

//#endregion
//#region //Point

function GeneralInfo_LoadPoint() {
    try {
        AjaxLoad(url = "/Customer/GeneralInfo/?handler=LoadPoint"
            , data = { 'custID': ser_MainCustomerID }
            , async = true
            , error = function () { notiError_SW() }
            , success = function (result) {
                if (result != "0") {
                    let data = JSON.parse(result);
                    if (data.length > 0) {
                        let TotalRow = data.length;
                        _GeneralInfo_DataPoint = sliceIntoChunks(JSON.parse(JSON.stringify(data)), 3);
                        $(".PointChangePage").attr("total-Page", Math.ceil(TotalRow / 3))
                        GeneralInfo_ExePagePoint();
                        GeneralInfo_EventPoint();
                    }
                }
            }
        );
    } catch (ex) {
    }
}
function GeneralInfo_ExePagePoint(CurrentPage = 0) {
    try {
        if (_GeneralInfo_DataPoint && _GeneralInfo_DataPoint.length > 0) {
            $('.PointChangePage').attr('data-page', CurrentPage);
            GeneralInfo_RenderPoint(_GeneralInfo_DataPoint[CurrentPage], "generalInfo_BodyPoint");
        }
    } catch (ex) { }
}
async function GeneralInfo_RenderPoint(data, id) {
    new Promise(resolve => {
        var myNode = document.getElementById(id);
        if (myNode != null) {
            myNode.innerHTML = '';
            let stringContent = '';
            if (data && data.length > 0) {
                let LastIndex = data.length - 1;
                for (var i = 0; i < data.length; i++) {
                    let item = data[i];
                    let tr = `
                        <li class="border-0 d-flex mb-0 py-0 px-0">
                            <div class="pt-1">
                                <div class="d-lg-flex">
                                    <span class="text-primary text-sm mb-0 fw-bold pe-1"><span>${item.Point > 0 ? `+` + item.Point : item.Point}</span></span>
                                    <h6 class="text-dark text-sm fw-bold mb-0 pe-1">${SysDate().FUTC(item.Created).DTText()}</h6>
                                </div>
                                <div class="text-dark d-flex text-sm mt-0 mb-0 ${item.RLCustomerID == 0 ? `d-none` : ``}">
                                    <p class="mb-0 fw-bold GeneralInfo_FirstUpper">${Outlang["Sys_gioi_thieu"]} ${Outlang["Khach_hang"]}: </p>
                                    <p class="mb-0 ps-1">
                                        <a class="cursor-pointer fw-bold" target="_blank" href="/Customer/MainCustomer?CustomerID=${item.RLCustomerID}&ver=${versionofWebApplication}">${item.CustomerCode}</a>
                                        <span class="text-sm text-dark"> - ${item.CustomerName}</span>
                                    </p>
                                </div>
                                <div class="mb-0 mt-2 border-start border-success border-3">
                                    <span class="content_line_clamp text-dark text-sm ps-2">
                                        <span class="text-pre-wrap">${item.Content}</span>
                                    </span>
                                </div>
                            </div>
                        </li>
                        ${i == LastIndex ? `` : `<hr class="horizontal dark my-1">`}
                    `;

                    stringContent = stringContent + tr;
                }
            }
            document.getElementById(id).innerHTML = stringContent;
        }
        resolve();
    });
}

function GeneralInfo_EventPoint() {
    $('.PointChangePage').unbind('click').click(function () {
        let TotalPage = $(this).attr('total-Page') ? Number($(this).attr('total-Page')) : 0;
        let Page = $(this).attr('data-page') ? Number($(this).attr('data-page')) : 0;
        let ValChange = $(this).attr('data-type') ? $(this).attr('data-type') : '';

        if (ValChange == "Pre") Page = (Page - 1 < 0 ? TotalPage - 1 : Page - 1);
        if (ValChange == "Nex") Page = (Page + 1 == TotalPage ? 0 : Page + 1);

        if (0 <= Page && Page < TotalPage) {
            GeneralInfo_ExePagePoint(Page);
        }
    })
}
//#endregion

//#region //Member
function GeneralInfo_LoadMember() {
    try {
        AjaxLoad(url = "/Customer/GeneralInfo/?handler=LoadMember"
            , data = { 'custID': ser_MainCustomerID }
            , async = true
            , error = function () { notiError_SW() }
            , success = function (result) {
                if (result != "0") {
                    let datas = JSON.parse(result);
                    let dataResult = datas.Table;
                    let data = datas.Table1;
                    if ((dataResult[0]?.Result ?? 0) == 1) {
                        _GeneralInfo_DataMember = [...data]?.reduce((pre, arr) => { if (!pre[arr.RN]) pre[arr.RN] = arr; return pre; }, {});
                        GeneralInfo_RenderMember(data, 'gen_memberContent');
                    }
                    else $("#generalInfo_membershipDiv").addClass('d-none');
                }
            }
        );
    } catch (ex) {
    }
}
async function GeneralInfo_RenderMember(data, id) {
    new Promise(resolve => {

        var myNode = document.getElementById(id);
        let currentMem = 0;
        if (myNode != null) {
            myNode.innerHTML = '';

            let stringContent = '';
            if (data && data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    let item = data[i];
                    let tr = `
                              <li class="nav-item ms-0 position-relative" role="presentation" style="min-width: 85px;">
                                  <a id="gen_memItem${item.RN}" class="gen_memItem cursor-pointer text-center nav-item-text nav-link h-100 w-100" data-bs-toggle="pill" data-id="${item.ID}" data-rownum="${item.RN}" role="tab">
                                      <img alt="Logo" class="avatar avatar-sm mt-2" src="${item.Image}" onerror="Master_OnLoad_Error_Image(this)">
                                      <p class="mb-0 mt-1" style="max-width: 120px;overflow: hidden;">${item.Name}</p>
                                  </a>
                                  <div class="position-absolute rounded-2 top-0 w-100 h-100 opacity-2 gen_mempro" id="gen_memItemPro${item.RN}">
                                  </div>
                              </li>
                    `;

                    currentMem = item.IsCurrent == 1 ? item.RN : currentMem;
                    stringContent = stringContent + tr;
                }
            }
            document.getElementById(id).innerHTML = stringContent;
            $('#' + id).attr('data-memberCust', currentMem);
        }
        GeneralInfo_EventMember();
        $(`#gen_memItem${currentMem}`).trigger('click');
        $(`#gen_memItem${currentMem}`).addClass('active');
        resolve();
    });
}

function GeneralInfo_FillMember(ID) {
    let item = _GeneralInfo_DataMember[ID] ?? {};
    let keys = Object.keys(_GeneralInfo_DataMember);

    let memberCust = $('#gen_memberContent').attr('data-memberCust') ? Number($('#gen_memberContent').attr('data-memberCust')) : 0;
    if (item != undefined && Object.keys(item).length > 0) {
        let remaining = 0;
        let nextRank = ''
        let keyNext = keys.at(keys.indexOf(ID.toString()) + 1);
        let itemNext = _GeneralInfo_DataMember[keyNext];

        if (item.IsCurrent == 1) {
            $('#gen_memLogo').attr("src", item.Image);
            $('#gen_memName').html(item.Name);
            //$('#gen_memName').css({ "color": `${item.ColorText}` });
            $('#generalInfo_membershipDiv .colorMember').attr("style", `color:${item.ColorText}!important`);
            $('#gen_memAmountFrom').html(formatNumber(item.AmountFrom));
            $('#gen_memAmountTo').html(formatNumber(item.AmountTo));

            $('#gen_memTotalPoint').html(formatNumber(item.TotalPoint));

            if (item.ImageBackground && item.ImageBackground != '') {
                $("#GI_memberImgBackground").attr('src', item.ImageBackground);
                $("#GI_memberImgBackground").removeClass('d-none');
            }
            else {
                $("#generalInfo_memberBackground").addClass("gen_imageOverlay");
                $("#generalInfo_memberBackground").css("background-color", item.ColorCode);
                $("#generalInfo_memberBackground").css("min-height", '240px');
                $("#GI_memberImgBackground").addClass('d-none');
            }

            if (itemNext != undefined && Object.keys(itemNext).length > 0) {
                let keyAchieveNext = keys.at(keys.indexOf(memberCust.toString()) + 1);
                let itemAchieveNext = _GeneralInfo_DataMember[keyAchieveNext];
                remaining = (itemAchieveNext?.AmountFrom - item.Paid) ?? 0;
                nextRank = itemAchieveNext.Name;
                $('#gen_memRankNoti').html(`${Outlang["Sys_thanh_toan"]}: <b>${formatNumber(remaining)}</b> ${Outlang["Sys_nang_han"] ?? 'Nâng hạn'} <b>${nextRank}</b> `);
            }
            //else {
            //    $('#gen_memRankNoti').html(Outlang["Sys_hang_thanh_vien_cao_nhat"] ?? "Hạng thành viên cao nhất");
            //}
        }
        for (let [key, value] of Object.entries(_GeneralInfo_DataMember)) {
            if (value.Paid == 0 && value.AmountFrom == 0) {
                $('#gen_memItemPro' + value.RN).removeClass('half').addClass('fill');
                break;
            }
            else {
                if (value.Paid >= value.AmountTo) {
                    $('#gen_memItemPro' + value.RN).removeClass('half').addClass('fill');
                }
                else if (value.Paid < value.AmountFrom) {
                    $('#gen_memItemPro' + value.RN).removeClass('half').removeClass('fill');
                }
                else {
                    $('#gen_memItemPro' + value.RN).removeClass('fill').addClass('half');
                    let range = value.AmountTo - value.AmountFrom;
                    let dis = value.Paid - value.AmountFrom;

                    if (dis != 0 && range != 0) {
                        let per = (dis / range) * 100;
                        $('#gen_memItemPro' + value.RN).attr('style', `width: ${per}% !important`);

                    }

                }
            }
        }
        //$('#gen_memAccumPer').html(item.AccumPer + '%');
    }

}


function GeneralInfo_EventMember() {
    $('.gen_memItem').unbind('click').click(function () {
        let ID = $(this).attr('data-rownum') ? Number($(this).attr('data-rownum')) : 0;
        GeneralInfo_FillMember(ID);
    })
}

function GeneralInfo_AccHistoryDetail() {

    let objs = $("#divCustomerTabContent [data-tab='/Customer/Point/PointList?CustomerID=']");
    if (objs != undefined && objs.length == 1) {
        objs.tab('show')
        $("#divCustomerTabContent a").removeClass('active');
        objs.addClass('active');
    }

}
//#endregion 

//#region // Service
function GeneralInfo_ServiceDetail() {
    let objs = $("#divCustomerTabContent [data-tab='/Customer/TabList?CustomerID=']");
    if (objs != undefined && objs.length == 1) {
        objs.tab('show')
        $("#divCustomerTabContent a").removeClass('active');
        objs.addClass('active');
    }
}
function GeneralInfo_LoadService() {
    try {
        AjaxLoad(url = "/Customer/GeneralInfo/?handler=LoadService"
            , data = { 'custID': ser_MainCustomerID }
            , async = true
            , error = function () { notiError_SW() }
            , success = function (result) {
                if (result != "0") {
                    let data = JSON.parse(result);
                    if (data.length > 0) {
                        GeneralInfo_RenderService(data, "generalInfo_BodyService");
                    }
                }
            }
        );
    } catch (ex) {
    }
}
async function GeneralInfo_RenderService(data, id) {
    new Promise(resolve => {
        var myNode = document.getElementById(id);
        if (myNode != null) {
            myNode.innerHTML = '';
            let stringContent = '';
            if (data && data.length > 0) {
                let LastIndex = data.length - 1;
                for (var i = 0; i < data.length; i++) {
                    let item = data[i];
                    let TeethDetail = Fun_GetTeeth_ByToken(sys_MainTeeth, item.TeethChoosing, item.TeethType);
                    let tr = `
                       <li class="border-0 d-flex mb-0 py-0 px-0">
                            <div class=" ">
                                <div class="d-lg-flex">
                                    <span class="text-primary text-sm mb-0 fw-bold pe-1">${item.IsProduct != 1 ? `${Outlang["Dv"]}` : `${Outlang["Sp"]}`}</span>
                                    <h6 class="text-dark text-sm font-weight-bold mb-0 pe-1">${SysDate().FUTC(item.Created).DTText()} : </h6>
                                    <h6 class="text-dark text-sm  mb-0">${item.Name}</h6>
                                    <h6 class="text-dark text-sm  mb-0">${item.Quantity}</h6>
                                </div>
                                <div class="text-dark d-lg-flex text-sm mt-0 mb-0">
                                    <p class="mb-0 fw-bold">${Outlang["Sys_thanh_toan"]}: </p>
                                    <p class="mb-0 ps-1">${formatNumber(item.AmountPayment)} / ${formatNumber(item.Price)}</p>
                                </div>
                                <div class="mb-3 mt-2 border-start border-success border-3">
                                    <span class="content_line_clamp text-dark text-sm ps-2">
                                        ${TeethDetail != '' ? `<span class="pe-2 fw-bold">${TeethDetail}</span>` : ''}
                                        <span class="text-pre-wrap">${item.Note}</span>
                                    </span>
                                </div>
                            </div>
                        </li>
                        ${i == LastIndex ? `` : `<hr class="horizontal dark my-1">`}
                    `;
                    stringContent = stringContent + tr;
                }
            }
            document.getElementById(id).innerHTML = stringContent;
        }
        resolve();
    });
}
//#endregion

//#region //Treat
function GeneralInfo_TreatDetail() {
    let objs = $("#divCustomerTabContent [data-tab='/Customer/TreatmentList?CustomerID=']");
    if (objs != undefined && objs.length == 1) {
        objs.tab('show')
        $("#divCustomerTabContent a").removeClass('active');
        objs.addClass('active');
    }
}
function GeneralInfo_LoadTreat() {
    try {
        AjaxLoad(url = "/Customer/GeneralInfo/?handler=LoadTreat"
            , data = { 'custID': ser_MainCustomerID }
            , async = true
            , error = function () { notiError_SW() }
            , success = function (result) {
                if (result != "0") {
                    let data = JSON.parse(result);
                    if (data.length > 0) {
                        GeneralInfo_RenderTreat(data, "generalInfo_BodyTreat");
                    }
                }
            }
        );
    } catch (ex) {
    }
}
async function GeneralInfo_RenderTreat(data, id) {
    new Promise(resolve => {
        var myNode = document.getElementById(id);
        if (myNode != null) {
            myNode.innerHTML = '';
            let stringContent = '';
            if (data && data.length > 0) {
                let LastIndex = data.length - 1;
                for (var i = 0; i < data.length; i++) {
                    let item = data[i];
                    let TeethDetail = Fun_GetTeeth_ByToken(sys_MainTeeth, item.TeethTreat, item.TeethType);
                    let _per = GeneralInfo_RenderTreatDetail(item.TimeTreatIndex, item.PercentOfService, item.PercentOfService_New, item.TeethChoosing, item.Quantity, item.StageCurrent);

                    let tr = `
                        <li class="border-0 d-flex mb-0 py-0 px-0">
                            <div class=" ">
                                <div class="d-lg-flex">
                                    <span class="text-primary text-sm mb-0 fw-bold pe-1">${_per}</span>
                                    <h6 class="text-dark text-sm fw-bold mb-0 pe-1">${SysDate().FUTC(item.Created).DTText()} : </h6>
                                    <h6 class="text-dark text-sm  mb-0">${item.Name}</h6>
                                </div>
                                <div class="text-dark d-lg-flex text-sm mt-0 mb-0">
                                    <p class="mb-0 fw-bold">${Outlang["BS/PT"]} : </p>
                                    <p class="mb-0 ps-1">${GeneralInfo_GetNameEmp(item.Doctor, item.Assist)}</p>
                                </div>
                                <div class="mb-3 mt-2 border-start border-success border-3">
                                    <span class="content_line_clamp text-dark text-sm ps-2">
                                        ${TeethDetail != '' ? `<span class="pe-2 fw-bold">${TeethDetail}</span>` : ''}
                                        <span class="text-pre-wrap">${item.Note}</span>
                                    </span>

                                </div>
                            </div>
                        </li>
                        ${i == LastIndex ? `` : `<hr class="horizontal dark my-1">`}
                    `;
                    stringContent = stringContent + tr;
                }
            }
            document.getElementById(id).innerHTML = stringContent;
        }
        resolve();
    });
}
function GeneralInfo_RenderTreatDetail(TimeTreatIndex, PercentOfService, PercentOfService_New, TeethChoosing, Quantity, StageCurrent) {
    try {
        let result = '';

        if (ser_sys_DentistCosmetic == '0') {
            result = (TimeTreatIndex != 0 ? `<span class="text-sm text-dark me-1 fw-bold">${Outlang["Lan"]} ${TimeTreatIndex}</span>` : '');
        } else {
            let PercentCurr = 0;
            if (PercentOfService == 0 && PercentOfService_New == 0) {
                if (TeethChoosing == '') {
                    PercentCurr = (Quantity == 0) ? 0 : StageCurrent;
                }
                else {
                    PercentCurr = (Quantity == 0) ? 0 : StageCurrent / Quantity;
                }
            }
            else { PercentCurr = PercentOfService };
            result = `<span>${Math.round(PercentCurr * 100) / 100} %</span>`;
        }

        return result;
    } catch {
        return '';
    }
}
function GeneralInfo_GetNameEmp(Doctor, Assist) {
    try {
        let result = ``;
        let objDoc = Fun_GetObject_ByID(DataEmployee, Doctor);
        let objAss = Fun_GetObject_ByID(DataEmployee, Assist);
        let NameDoc = objDoc != undefined ? objDoc.Name : '';
        let NameAss = objAss != undefined ? objAss.Name : '';
        let mark = ' / ';
        if (NameDoc == 'unknown' || NameAss == 'unknown' || NameDoc == '' || NameAss == '') { mark = '' };
        if (NameDoc != '' || NameAss != '') {
            result = `
                <span class="text-sm text-dark  ">${NameDoc != 'unknown' ? NameDoc : ''}${mark}${NameAss != 'unknown' ? NameAss : ''}</span>
            `;
        }
        return result;
    } catch {
        return '';
    }
}
//#endregion


//#region //Payment
function GeneralInfo_DepositDetail() {
    $("#DetailModal_Content").html('');
    $("#DetailModal_Content").load("/Customer/Deposit/TabDepositDetail?CustomerID=" + ser_MainCustomerID + "&ver=" + versionofWebApplication);
    $('#DetailModal').modal('show');
}
function GeneralInfo_LoadWalletDeposit() {
    try {
        AjaxLoad(url = "/Customer/GeneralInfo/?handler=LoadWalletDeposit"
            , data = { 'custID': ser_MainCustomerID }
            , async = true
            , error = function () { notiError_SW() }
            , success = function (result) {
                if (result != "0") {
                    let data = JSON.parse(result);
                    if (data.length == 1) {
                        $('#generalInfo_WAmountUsable').html(formatNumber(data[0].AmountUsable));
                        $('#generalInfo_WAmountUsed').html(formatNumber(data[0].AmountUsed));
                        $('#generalInfo_WTotalAmount').html(formatNumber(data[0].TotalAmount));
                    }
                }
            }
        );
    } catch (ex) {
    }
}

//#endregion

//#region //Payment
function GeneralInfo_PaymentDetail() {
    let objs = $("#divCustomerTabContent [data-tab='/Customer/PaymentList?CustomerID=']");
    if (objs != undefined && objs.length == 1) {
        objs.tab('show')
        $("#divCustomerTabContent a").removeClass('active');
        objs.addClass('active');
    }
}
function GeneralInfo_LoadPayment() {
    try {
        AjaxLoad(url = "/Customer/GeneralInfo/?handler=LoadPayment"
            , data = { 'custID': ser_MainCustomerID }
            , async = true
            , error = function () { notiError_SW() }
            , success = function (result) {
                if (result != "0") {
                    let data = JSON.parse(result);
                    if (data.length > 0) {
                        GeneralInfo_RenderPayment(data, "generalInfo_BodyPayment");
                    }
                }
            }
        );
    } catch (ex) {
    }
}
async function GeneralInfo_RenderPayment(data, id) {
    new Promise((resolve) => {
        setTimeout(() => {
            var myNode = document.getElementById(id);
            if (myNode != null) {
                myNode.innerHTML = '';
                let stringContent = '';
                if (data && data.length > 0) {
                    let LastIndex = data.length - 1;
                    for (var i = 0; i < data.length; i++) {
                        let item = data[i];
                        let tr = `
                            <li class="border-0 d-flex mb-0 px-3 py-1">
                                <div class="row w-100 ms-0">
                                    <div class="col-12 col-xl-8 px-0">
                                        <span class="text-xs text-dark">${SysDate().FUTC(item.Created).DTText()}</span>
                                        <p class="text-sm text-dark fw-bold mb-0">${item.Invoice_Num}</p>

                                    </div>
                                    <div class="col-12 col-xl-4 px-0 text-lg-end">
                                        <span class="text-xs text-dark" style="max-width: fit-content;">${Outlang[item.MethodNameLangkey]}</span>
                                        <p class="text-sm text-primary mb-0">${formatNumber(item.Amount)}</p>
                                    </div>
                                </div>
                            </li>
                            ${i == LastIndex ? `` : `<hr class="horizontal dark my-1">`}
                        `;
                        stringContent = stringContent + tr;
                    }
                }
                document.getElementById(id).innerHTML = stringContent;
            }
            resolve();
        }, 30)
    })
}
//#endregion

//#region //Rating
function GeneralInfo_LoadRating() {
    try {
        AjaxLoad(url = "/Customer/GeneralInfo/?handler=LoadRating"
            , data = {
                'custID': ser_MainCustomerID,
                'branchID': ser_MainBranchID

            }
            , async = true
            , error = function () { notiError_SW() }
            , success = function (result) {
                if (result != "0") {
                    let data = JSON.parse(result);
                    if (data.length > 0) {
                        GeneralInfo_RenderRating(data, "generalInfo_BodyRating");
                    }

                }
            }
        );
    } catch (ex) {
    }
}
async function GeneralInfo_RenderRating(data, id) {
    new Promise((resolve) => {
        setTimeout(() => {
            var myNode = document.getElementById(id);
            if (myNode != null) {
                myNode.innerHTML = '';
                let stringContent = '';
                if (data && data.length > 0) {
                    let LastIndex = data.length - 1;
                    for (var i = 0; i < data.length; i++) {
                        let item = data[i];
                        let rateType = '';
                        let rating = '';
                        if (item.RatType != "") {
                            rateType = Outlang[item.RatTypeLang] != undefined ? Outlang[item.RatTypeLang] : item.RatType;
                            rateType = `<p class="pe-1 text-sm text-dark fw-bold mb-0">${rateType}</p>:`;
                        }
                        if (Number(item.Star) > 3) {
                            rating = `<span class="pe-1 text-primary">${item.Star}</span><i class="fas fa-star ps-0 fw-bold text-warning"></i>`;
                        }
                        else {
                            rating = `<span class="pe-1 text-danger">${item.Star}</span><i class="fas fa-star ps-0 fw-bold text-danger"></i>`;
                        }

                        let tr =
                            `<li class="border-0 d-flex mb-0 px-3 py-1">
                                <div class="w-100">
                                    <div class="d-flex align-items-center">
                                        <span class="text-sm">${rating}</span>
                                        <span class="ms-auto text-sm">${SysDate().FUTC(item.Created).DTText()}</span>

                                    </div>
                                    <div class="d-inline">
                                        ${rateType}
                                        <span class="text-sm text-dark" style="max-width: fit-content;">${item.Message}</span>
                                    </div>
                                </div>
                            </li>
                            ${i == LastIndex ? `` : `<hr class="horizontal dark my-1">`}
                        `;
                        stringContent = stringContent + tr;
                    }
                }
                document.getElementById(id).innerHTML = stringContent;
            }
            resolve();
        }, 30)
    })
}

function GeneralInfo_RatingRenderStar(Star) {
    let result = ``;
    let star = !isNaN(Number(Star)) ? Number(Star) : 0;
    let fullStar = Math.floor(star);
    let partStar = star - fullStar;
    let percent = 100;
    for (let i = 0; i < 5; i++) {
        percent = fullStar > 0 ? 100 : (partStar > 0 ? partStar * 100 : 0)
        if (fullStar <= 0) partStar = 0;
        fullStar--;
        result += `<div class="GeneralInfo_RatingStar_item ms-2 position-relative d-flex ms-auto">
                               <span class="GeneralInfo_Ratingstar GeneralInfo_Ratingstar_under far fa-star d-inline-block position-absolute"></span>
                               <span class="GeneralInfo_Ratingstar GeneralInfo_Ratingstar_over fas fa-star d-inline-block position-absolute overflow-hidden" style="width: ${percent}%"></span>
                          </div>`
    }
    return result;
}

//#endregion
function onclicksocial_icon(link) {
    if (link != "") {
        var win = window.open(link, '_blank');
        win.focus();
    }
}

//#endregion

//#region // ConsultStatus
function GeneralInfo_ConsultStatusDetail() {
    let objs = $("#divCustomerTabContent [data-tab='/Customer/StatusList?CustomerID=']");
    if (objs != undefined && objs.length == 1) {
        objs.tab('show')
        $("#divCustomerTabContent a").removeClass('active');
        objs.addClass('active');
    }
}
function GeneralInfo_ConsultStatus() {
    AjaxLoad(url = "/Customer/GeneralInfo/?handler=LoadConsultStatus"
        , data = { 'custID': ser_MainCustomerID }
        , async = true
        , error = function () { notiError_SW() }
        , success = function (result) {
            if (result != "0") {
                let data = JSON.parse(result);
                GeneralInfo_ConsultRender(data, "generalInfo_consultStatus");
            }
        }
    );
}
async function GeneralInfo_ConsultRender(data, id) {
    return new Promise(resolve => {

        var myNode = document.getElementById(id);
        if (myNode != null) {
            myNode.innerHTML = '';
            let stringContent = '';
            let lengthData = 0;
            if (data && data.length > 0) {
                lengthData = data.length - 1;
                for (var i = 0; i < data.length; i++) {
                    let item = data[i];
                    tr = `
                            <div class="row ${(i == 0 ? "" : "d-none")}" id="generalInfo_consultitem${i}">
                                <div class="col-8 d-flex">
                                    ${GeneralInfo_ConsultRenderPerson(item.EmployeeID, item.Created)}
                                </div>
                                <div class="col-4">
                                    <span class="badge ms-auto float-end" style="background-color: ${item.ColorCode};">
                                        ${item.ConsultStatus}
                                    </span>
                                </div>
                                <div class="col-12 pt-2">
                                    <span class="text-sm text-dark content_line_clamp">${item.Content}</span>
                                </div>
                            </div>
                        `;

                    stringContent = stringContent + tr;
                }

            }
            document.getElementById(id).innerHTML = stringContent;
            GeneralInfo_ConsultEvent(lengthData);
        }
        resolve();
    });
}
function GeneralInfo_ConsultRenderPerson(EmployeeID, Create) {
    let obj = Fun_GetObject_ByID(DataEmployee, EmployeeID);
    let name = (obj != null) ? obj.Name : 'unknown';
    let img = (obj != null && obj.Avatar != "") ? obj.Avatar : Master_Default_Pic;
    let result = `
                <div class="avatar icon icon-shape icon-sm me-3 shadow text-center me-3">
                    <img class="border-radius-lg shadow" src="${img}"/>
                </div>
                <div class="d-flex flex-column justify-content-center">
                    <h6 class="mb-0 text-sm text-dark">${name}</h6>
                    <p class="text-sm mb-0">${SysDate().FUTC(Create).DateText()}</p>
                </div>`;
    return result;
}
function GeneralInfo_ConsultEvent(pagenum) {
    let IndexStatus = 0;
    $("#per_statuspreview").unbind("click").click(function () {
        IndexStatus += 1;
        (IndexStatus > pagenum ? IndexStatus = 0 : 0);
        $("#generalInfo_consultitem" + IndexStatus).removeClass("d-none").siblings().addClass("d-none");
    })
    $("#per_statusnext").unbind("click").click(function () {
        IndexStatus -= 1;
        (IndexStatus < 0 ? IndexStatus = pagenum : 0);
        $("#generalInfo_consultitem" + IndexStatus).removeClass("d-none").siblings().addClass("d-none");
    })
}
function GeneralInfo_CheckDataLinkOld(value, type) {
    let result = '';
    switch (type) {
        case 'facebook':
            result = value.split('facebook.com/').length > 1 ? value : 'https://facebook.com/' + value;
            break;
        case 'zalo':
            result = value.split('zalo.me/').length > 1 ? value : 'https://zalo.me/' + value;
            break;
        case 'viber':
            result = value.split('viber.com/').length > 1 ? value : 'https://viber.com/' + value;
            break;
        case 'instagram':
            result = value.split('instagram.com/').length > 1 ? value : 'https://instagram.com/' + value;
            break;
    }
    return result;
}
//#endregion
//#region //Properties
function GeneralInfo_LoadPro(IsNew = 1) {
    try {
        if (IsNew == 1) {
            _GeneralInfo_IndexProperti = 0;
        }
        AjaxLoad(url = "/Customer/GeneralInfo/?handler=LoadProperties"
            , data = { 'custID': ser_MainCustomerID }
            , async = true
            , error = function () { notiError_SW() }
            , success = function (result) {
                if (result != "0") {
                    let datas = JSON.parse(result);
                    let data = datas.Table1;
                    _GeneralInfo_ProSetting = datas.Table;
                    data = GeneralInfo_SlidePro(data);
                    if (data.length > 0) {
                        _GeneralInfo_DataProperti = data;
                        GeneralInfo_BeforeRenderPro();
                        $("#generalInfo_EditPro").removeClass("d-none");
                    } else {
                        $("#generalInfo_EditPro").addClass("d-none");
                    }
                    GeneralInfo_EventInitPro();
                }
            }
        );
    } catch (ex) {
    }
}


function GeneralInfo_SlidePro(data) {
    try {
        let result = [];
        let _ChekDate = ',';
        if (data && data.length > 0) {
            for (let _i = 0; _i < data.length; _i++) {
                let item = data[_i];
                if (!_ChekDate.includes(',' + item["CreInt"] + ',')) {
                    _ChekDate += item["CreInt"] + ',';
                    let _DT = data.filter((word) => { return word["CreInt"] == item["CreInt"] });
                    //_DT.sort((a, b) => a.ProID - b.ProID);
                    result.push(_DT);
                }
            }
        }
        return result;
    } catch {
        return [];
    }
}
function GeneralInfo_BeforeRenderPro() {
    GeneralInfo_RenderPro(_GeneralInfo_DataProperti[_GeneralInfo_IndexProperti], "GeneralInfo_BodyProperties");
}

function GeneralInfo_RenderPro(data, id) {
    var myNode = document.getElementById(id);
    if (myNode != null) {
        myNode.innerHTML = '';
        let body = ``;
        let masterID = 0;
        if (data && data.length > 0) {
            let currentGroupID = -1;
            let indexGroup = 0;
            for (var i = 0; i < data.length; i++) {
                let item = data[i];
                masterID = item.MasID;

                if (i == 0) {
                    $('#generalInfo_DivProperties').removeClass('expired');
                    let Distance = Sys2Date().FUTC(item.Created, new Date()).DaDistance();
                    $('#GeneralInfo_PropertyDate').html(SysDate().FUTC(item.Created).DDowText());
                    if (_GeneralInfo_ProSetting?.length == 1) {
                        let maxDay = _GeneralInfo_ProSetting[0].MaxDay;
                        if (maxDay > 0) {
                            if (Distance > 0) $('#GeneralInfo_DisDate').html(`${Distance} ${Outlang["Ngay"]}`);
                            if (maxDay <= Distance) {
                                $('#generalInfo_DivProperties').addClass('expired');
                            }
                        }
                    }
                }
                let width = item.Width != 0 ? item.Width : 100;
                let groupName = '';
                if (currentGroupID != item.GroupID) {
                    indexGroup = indexGroup + 1;
                    groupName = `<div class="fw-bolder text-primary my-3 d-flex align-items-center text-uppercase">
                            <div class="pe-2">${indexGroup}.</div>
                            <div>${item.GroupName != '' ? item.GroupName : '-'}</div>
                        </div>`;
                    currentGroupID = item.GroupID;

                }
                else {
                    groupName = '';
                } 
                body += `
                ${groupName}
                <div class="mb-3" data-id="${item.ID}" style="width:${width}%">
                    <div class=" d-flex align-items-center">
                        ${item.UseCheckBox == 1
                        ? `<div class="form-check me-2">
                               <input style="background: ${item.Color}2b !important;border: 1px solid ${item.Color} !important;"
                                class="form-check-input fs-6 itemCheckBox ${item.IsCheck == 1 ? `` : ` opacity-3 `}" onclick="return false;" type="checkbox" ${item.IsCheck == 1 ? `checked` : ``}>
                              </div>`
                        : ``
                    }
                        <div class="">
                            <div class="text-dark text-sm ellipsis_one_line pe-1">${i + 1}. ${item.Name}</div>
                            <div class="text-sm text-dark ellipsis_one_line opacity-7" type="text">
                            ${(!isNaN(item.Value) && item.Value.length >= 8 && item.UseDateTime == 1) ? SysDate().FUTCNUM(item.Value ?? "").DDowText() : (item.Value ?? "")}
                            </div>
                        </div>
                    </div>
                </div>
                `;
            }
            document.getElementById(id).innerHTML = `<div class="row" data-masterID="${masterID}" style="max-height: 535px; overflow-y: scroll; overflow-x: hidden;">${body}</div>`;
        }
    }
}
function GeneralInfo_EventInitPro() {
    let LengthDT = _GeneralInfo_DataProperti && _GeneralInfo_DataProperti.length > 0 ? _GeneralInfo_DataProperti.length - 1 : 0;
    $("#GeneralInfo_PropertiPreview").unbind("click").click(function () {
        if (LengthDT != 0) {
            _GeneralInfo_IndexProperti = _GeneralInfo_IndexProperti == 0 ? LengthDT : _GeneralInfo_IndexProperti - 1;
            GeneralInfo_BeforeRenderPro();
        }
    })
    $("#GeneralInfo_PropertiNext").unbind("click").click(function () {
        if (LengthDT != 0) {
            _GeneralInfo_IndexProperti = _GeneralInfo_IndexProperti == LengthDT ? 0 : _GeneralInfo_IndexProperti + 1;
            GeneralInfo_BeforeRenderPro();
        }
    })
}
function GeneralInfo_OpenDetailPro(IsEdit = 0) {
    let CurrID = "0";
    if (IsEdit == 1) CurrID = $("#GeneralInfo_BodyProperties").find(".row").data("masterid") ?? "0";
    $("#DetailModal_Content").html('');
    $("#DetailModal_Content").load("/Customer/Properties/PropertiesDetail?"
        + "CustomerID=" + ser_MainCustomerID
        + "&CurrentID=" + CurrID
        + "&ver=" + versionofWebApplication);
    $('#DetailModal').modal('show');
}
//#endregion
//#region //PrintStatus
function GeneralInfo_PrintStatusLoad() {
    AjaxLoad(url = "/Customer/GeneralInfo/?handler=LoadPrintStatus"
        , data = { 'custID': ser_MainCustomerID }
        , async = true
        , error = function () { notiError_SW() }
        , success = function (result) {
            if (result != "0") {
                let datas = JSON.parse(result);
                let _dtype = datas.Table;
                let _dstatus = datas.Table1;
                let _dser = datas.Table2;
                GeneralInfo_PrintStatusRender(_dtype, _dstatus, _dser, "generalInfo_PrintStatus");
            }
        }
    );
}

function GeneralInfo_PrintStatusRender(_dtype, _dstatus, _dser, id) {
    let mynode = document.getElementById(id);
    if (mynode != null) {
        for (let i = 0; i <= _dtype.length; i++) {
            let item = i == _dtype.length ? { TypeID: 0, TypeName: Outlang["Khac"] ?? "Khác" } : _dtype[i];
            let _ds = _dstatus.filter(ele => { return ele.TypeID == item.TypeID });
            let _ds2 = _dser.filter(ele => { return ele.TypeID == item.TypeID });
            let serstr = _ds2.map(ele => { return ele.TypeID == item.TypeID ? ele.SerName : '' }).join(', ');
            let isPrinted = _ds.length != 0;
            let str = `<li class="px-1 py-2 border-0 d-grid mb-0 w-100 ${(!isPrinted && (i == _dtype.length)) ? "d-none" : ""}">
                <div class="d-flex gap-2 align-items-start">
                    <div class="w-auto mt-1">
                        ${isPrinted
                    ? `<i class="fas text-lg text-success fa-check-circle pe-2" aria-hidden="true"></i>`
                    : `<i class="fas fs-6 text-warning fa-exclamation-triangle pe-2"></i>`}
                    </div>
                    <div class="flex-grow-1">
                        <div class="cursor-pointer mb-2" data-bs-toggle="collapse" data-bs-target="#PType_${item.TypeID}" aria-controls="#PType_${item.TypeID}" href="#PType_${item.TypeID}">
                            <span class="text-dark text-sm fw-bold">${item.TypeName} <i class="fas fa-caret-down ps-2"></i></span>
                            <div class="m-0 text-xs text-dark content_line_clamp ellipsis_two_line">${serstr}</div>
                        </div>
                        <div class="collapsesticky mt-1 collapse" id="PType_${item.TypeID}">
                            ${GeneralInfo_PrintStatusGetForm(_ds)}
                        </div>
                        
                    </div>
                </div>
                <hr class="horizontal dark my-1">
            </li>
            `
            mynode.insertAdjacentHTML('beforeend', str);
        }
        GeneralInfo_PrintStatusEvent();
    }
}

function GeneralInfo_PrintStatusGetForm(_data) {
    let result = '';
    if (_data.length != 0) {
        for (let i = 0; i < _data.length; i++) {
            let item = _data[i];
            result += `
                <div class="${item.Action != 'p' ? 'itemForm cursor-pointer' : ''}" data-type="${item.TypeID}" data-code="${item.CodeForm}">
                    <div class="w-100 position-relative">
                        <div class="w-auto position-absolute end-0 top-0 mt-n1"> 
                            <span class="text-secondary text-sm">${SysDate().FUTC(item.Created).DateText()}</span> 
                        </div>
                        <div>
                            <p class="text-sm text-dark m-0">
                                <span class="fw-bold pe-2">${i + 1}.</span>
                                <span class="text-primary fw-bold">${item?.CodeForm}</span>
                            </p>
                            <p class="m-0 text-sm text-dark text-capitalize w-100 ellipsis_one_line">
                                <span class="text-capitalize">${item.NameForm}</span>                                
                            </p>
                            <p class="m-0 text-sm text-dark text-capitalize">
                                ${item.Action != 'p'
                    ? `<span class="text-danger"> ${Outlang["Da_luu"] ?? "Đã lưu"}: ${item.TotalForm} ${Outlang["Ban_1"] ?? 'Bản'}</span>`
                    : `<span class="text-primary"> ${Outlang["Da_in"] ?? "Đã in"}</span>`}
                            </p>
                        </div>
                    </div> 
                </div>
                <div class="mb-4 mt-1 ms-1">
                    ${item.TabID != 0 ? `
                    <div class="mb-2 text-sm text-dark border-start border-success border-3 ps-3 ellipsis_one_line" data-tab="${item.TabID}">
                        <span class="pe-2">${Outlang["Dich_vu"]} : </span>
                        <span class="text-sm pe-2">${item.TabCode} - ${item.ServiceName}</span>
                    </div>
                    ` : ''}
                </div>
            `
        }
    }

    return result;
}

function GeneralInfo_PrintStatusEvent() {
    $("#generalInfo_PrintStatus .itemForm").unbind('click').click(function () {
        let FormCode = $(this).attr('data-code') ?? 0;
        let Type = $(this).attr("data-type") ?? 0;
        $("#DetailModal_Content").html('');
        $("#DetailModal_Content").load("/Print/FormSavedReview/?FormCode=" + FormCode + "&Type=" + Type + "&ver=" + versionofWebApplication);
        $("#DetailModal").modal('show');
    })

}


function GeneralInfo_PrintMemberCard() {
    syslog_cutcon('p', ser_MainCustomerID, '');
    $("#DetailModal_Content").html('');
    $("#DetailModal_Content").load('/Print/print?Type=custmember_card&DetailID=' + ser_MainCustomerID);
    $('#DetailModal').modal('show');
}
//#endregion //PrintStatus

//#region //Voucher
function GeneralInfo_VoucherLoad(ID) {

    AjaxLoad(url = "/Customer/GeneralInfo/?handler=LoadVoucher"
        , data = {
            'custID': ser_MainCustomerID
            , 'currentID': ID
        }
        , async = true
        , error = function () { notiError_SW() }
        , success = function (result) {
            if (result != "0") {
                let data = JSON.parse(result);
                if (ID == 0) {
                    $("#generalInfo_VoucherBody").empty();
                    GeneralInfo_VoucherRender(data, "generalInfo_VoucherBody");
                } else {
                    let ele = "#VouItem_" + ID.toString();
                    if (data.length == 0) $(ele).remove();
                    else {
                        let tr = GeneralInfo_VoucherRenderEach(data[0]);
                        $("#generalInfo_VoucherBody")[0].insertAdjacentHTML('afterbegin', tr);
                    }
                }
                ToolPopper();
                GeneralInfo_VoucherEvent();
            }
        }
    );
}
function GeneralInfo_VoucherRender(data, id) {
    let myNode = document.getElementById(id);
    if (myNode != null) {
        myNode.innerHTML = '';
        if (data && data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                let item = data[i];
                let tr = GeneralInfo_VoucherRenderEach(item);
                myNode.insertAdjacentHTML('beforeend', tr);
            }
        }
    }
}
function GeneralInfo_VoucherRenderEach(item) {
    let result = '';
    if (item) {
        result = ` <div id="VouItem_${item.ID}" class="col-w-200 bg-gradient-primary position-relative ${item.IsExpired == 1 ? 'opacity-2' : 'VouhcerCop cursor-pointer'} min-height-100 rounded-3 p-2 gen_imageOverlay" data-code="${item.VoucherCode}" style="background-color: #C62026;" data-bs-toggle="tooltip" data-bs-original-title="Copy">
                <p class="mb-0 text-white ellipsis_one_line w-80">${item.VoucherCode}</p>
                <div>
                    <p class="mb-0 text-white ellipsis_one_line w-90">${item.CampainPercent != 0 ? `${item.CampainPercent}%` : `${formatNumber(item.CampainAmount)}VNĐ`}</p>
                </div>
                <div class="position-absolute bottom-0 start-0 w-100 m-0 px-3 bottom-4">
                    <p class="mb-0 text-white ellipsis_one_line w-100 text-end">${item.CampainName}</p> 
                </div>
                <div class="w-auto position-absolute end-3 top-0 mt-2 z-index-1">
                    ${item.IsDelete == 0
                ? `<i class="vtt-icon vttech-icon-delete opacity-2 text-danger cursor-pointer VoucherDeleteItem curson-poiter p-1 text-white " data-id="${item.ID}"></i>`
                : ''}
                </div>
            </div>
            `;
    }
    return result;
}
function GeneralInfo_VoucherEvent() {
    $("#generalInfo_VoucherBody .VoucherDeleteItem").unbind('click').click(function (e) {
        e.preventDefault();
        e.stopPropagation();
        let id = $(this).attr('data-id') ?? 0;
        const promise = notiConfirm();
        promise.then(function () { GeneralInfo_VoucherDelete(id); }, function () { });
    })
    $("#generalInfo_VoucherBody .VouhcerCop").unbind('click').click(function () {
        let code = $(this).attr('data-code') ?? 0;
        GeneralInfo_CopyTextToClipboard(code);
        notiSuccessMess('Copied')
    })
}
function GeneralInfo_VoucherAdd() {
    $("#DetailModal_Content").html('');
    $("#DetailModal_Content").load("/Discount/Campaign/CampaignCodeEditTemp?VoucherCode=" + "" + "&CustomerID=" + ser_MainCustomerID + "&TypeID=" + "1" + "&ver=" + versionofWebApplication);
    $('#DetailModal').modal('show');
}

function GeneralInfo_VoucherDelete(id) {
    AjaxLoad(url = "/Customer/GeneralInfo/?handler=DeleteVoucher"
        , data = { 'currentID': id }
        , async = true
        , error = function () { notiError_SW() }
        , success = function (result) {
            if (result != "0") {
                notiSuccess();
                GeneralInfo_VoucherLoad(id)
            }
        }
    );
}

function GeneralInfo_CopyTextToClipboard(text) {
    var m = document;
    text = m.createTextNode(text);
    var w = window;
    var b = m.body;
    b.appendChild(text);
    if (b.createTextRange) {
        var d = b.createTextRange();
        d.moveToElementText(text);
        d.select();
        m.execCommand('copy');
    }
    else {
        var d = m.createRange();
        var g = w.getSelection;
        d.selectNodeContents(text);
        g().removeAllRanges();
        g().addRange(d);
        m.execCommand('copy');
        g().removeAllRanges();
    }
    text.remove();
    return true;
}


//#endregion //Voucher
//#region //Card
function GeneralInfo_CardLoad() {
    $("#generalInfo_CardBody").empty();
    AjaxLoad(url = "/Customer/GeneralInfo/?handler=LoadCard"
        , data = { 'custID': ser_MainCustomerID }
        , async = true
        , error = function () { notiError_SW() }
        , success = function (result) {
            if (result != "0") {
                let data = JSON.parse(result);
                GeneralInfo_CardRender(data, "generalInfo_CardBody");
            }
        }
    );
}
function GeneralInfo_CardRender(data, id) {
    let myNode = document.getElementById(id);
    if (myNode != null) {
        if (data && data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                let item = data[i];
                let tr = `
                <li class="px-1 py-2 border-0 d-grid mb-0 w-100">
                    <div class="d-flex gap-2 align-items-center">
                        <div class="w-auto px-1" style="min-width: 26px;">
                            ${item.AmountUse != item.PriceUse
                        ? `<i class="fas text-lg text-success fa-check-circle" aria-hidden="true"></i>`
                        : ``}
                        </div>
                        <div>
                            <span class="text-dark text-sm fw-bold text-uppercase">${item.CardCode}</span>
                            <span class="text-dark text-sm">${item.CardName}</span>
                            <div class="m-0 text-xs text-dark">
                                <span class="text-dark text-sm fw-bold">${Outlang["Sys_da_su_dung"] ?? `Đã sử dụng`}: </span>
                                <span class="text-dark text-sm">${formatNumber(item.AmountUse)}/${formatNumber(item.PriceUse)}</span>
                            </div>
                        </div>
                    </div>
                    <hr class="horizontal dark my-1">
                </li>`;
                myNode.insertAdjacentHTML('beforeend', tr);
            }
        }
    }
}
//#endregion