﻿

//#region // Ticket Action Execute
function TicketAction_Edit () {
    $("#DetailModal_Content").html('');
    $("#DetailModal_Content").load("/Marketing/TicketDetail?CurrentID=" + ser_ActionTicketID + "&CustomerID=" + ser_ActionCustomerID + "&ver=" + versionofWebApplication);
    $('#DetailModal').modal('show');
    return false;
}
function TicketAction_Call () {
    let phone = $('#actionticket_phone').attr("data-info");
    if (phone != "" && typeof CCF_OutcomCall !== 'undefined' && $.isFunction(CCF_OutcomCall)) {
        CCF_OutcomCall(phone, ser_ActionCustomerID, ser_ActionTicketID, 0);
    }
}
function TicketAction_NewInput () {
    $("#DetailModal_Content").html('');
    $("#DetailModal_Content").load("/Marketing/CallDetailInput?"
        + "MasterID=" + ser_ActionMaster
        + "&CustomerID=" + ser_ActionCustomerID
        + "&TicketID=" + ser_ActionTicketID
        + "&ver=" + versionofWebApplication);
    $('#DetailModal').modal('show');
    return false;
}
function TicketAction_NewCustomer () {
    AjaxLoad(url = "/Marketing/Ticket/TicketActionTable/?handler=CheckCustomerExist"
        , data = {'TicketID': ser_ActionTicketID}
        , async = true
        , error = function () {notiError_SW();}
        , success = function (result) {
            if (result != "0") {
                location.reload();
            } else {
                $("#DetailModal_Content").html('');
                $("#DetailModal_Content").load("/Customer/CustomerDetail?TicketID=" + ser_ActionTicketID + "&ver=" + versionofWebApplication);
                $('#DetailModal').modal('show');
            }
        }
    );
    return false;
}

function TicketAction_DeleteTicket() {
    $("#DetailModal_Content").html('');
    $("#DetailModal_Content").load("/Marketing/TicketDelete?TicketID=" + ser_ActionTicketID + "&ver=" + versionofWebApplication);
    $('#DetailModal').modal('show');
    return false;
}


function TicketAction_ChangeGroup () {
    $("#DetailModal_Content").html('');
    $("#DetailModal_Content").load("/Customer/CustomerGroupDetail?CustomerID=" + ser_ActionCustomerID + "&TicketID=" + ser_ActionTicketID + "&GroupID=" + ser_ActionCustomerGroupID + "&ver=" + versionofWebApplication);
    $('#DetailModal').modal('show');
    return false;
}
function TicketAction_ChangeTag () {
    $("#DetailModal_Content").html('');
    $("#DetailModal_Content").load("/Marketing/TicketTagDetail" + "?TicketID=" + ser_ActionTicketID + "&ver=" + versionofWebApplication);
    $('#DetailModal').modal('show');
    return false;
}
function TicketAction_SendSMS () {
    $("#DetailModal_Content").html('');
    $("#DetailModal_Content").load("/SMS/SmsDetail?CustomerID=" + ser_ActionCustomerID + "&TicketID=" + ser_ActionTicketID + "&Type=" + "SMSContentGeneral" + "&TypeCare=" + ser_ActionType + "&AppID=" + ser_ActionAppID + "&ver=" + versionofWebApplication);
    $('#DetailModal').modal('show');
    return false;
}
function TicketAction_SchedulerNew () {
    $("#DetailModal_Content").html('');
    $("#DetailModal_Content").load("/Appointment/AppointmentDetail?CustomerID=" + ser_ActionCustomerID + "&TicketID=" + ser_ActionTicketID + "&ver=" + versionofWebApplication);
    $('#DetailModal').modal('show');
}

function TicketAction_CreateAppTemp() {
    $("#vtt_teamporaryarea").html('');
    $("#vtt_teamporaryarea").load("/Appointment/AppointmentTemporary?CurrentID=" + 0
        + "&BranchID=" + Master_branchID
        + "&TimeFrame=" + ""
        + "&DateFrom=" + SysDate().FNOW().UTCDateText()
        + "&DoctorID=" + 0
        + "&TicketID=" + ser_ActionTicketID);
    $('#vtt_master').addClass('opacity-3 pe-none');
    $('#vtt_teamporaryarea').removeClass('d-none');
}


function TicketAction_Move () {
    $("#DetailModal_Content").html('');
    $("#DetailModal_Content").load("/Marketing/TicketMoveDetail_One?TicketID=" + ser_ActionTicketID + "&ver=" + versionofWebApplication);
    $('#DetailModal').modal('show');
    return false;
}

function TicketAction_ChangePanTag() {
    $("#DetailModal_Content").html('');
    $("#DetailModal_Content").load("/Marketing/Pancake/ConverTagDetail?TicketID=" + ser_ActionTicketID + "&ver=" + versionofWebApplication);
    $('#DetailModal').modal('show');
    return false;
}
//#endregion

//#region // Load Info
async function TicketAction_LoadInfo () {
    new Promise((resolve, reject) => {
        AjaxLoad(url = "/Marketing/Ticket/TicketActionTable/?handler=Loadata_Info"
            , data = {
                'TicketID': ser_ActionTicketID
                , 'CustomerID': ser_ActionCustomerID
                , 'UserTeleLevel': sys_TeleLevel
                , 'UserTeleGroup': sys_TeleGroup
            }
            , async = true
            , error = function () {notiError_SW();}
            , success = function (result) {
                if (result != "0") {

                    let data = JSON.parse(result);
                    TicketAction_FillInfo(data.Table, data.Table1, data?.PancakeTag)
                }
            }
        );
        resolve();
    });
}
async function TicketAction_FillInfo (dataInfo, dataStic, dataPanTag) {
    new Promise((resolve, reject) => {
        let item = dataInfo[0];
        if (item != undefined) {
            ser_ActionCustomerID = item.CustomerID;
            ser_ActionTicketID = item.TicketID;
            ser_ActionCustomerCode = item.CustomerCode;
            let service_care = Fun_GetStringButStringID_ByToken(DataServiceCare, item.ServiceCare, item.ServiceCareID);
            $('#actionticket_phone').html(item.Phone);
            $('#actionticket_phone').attr('data-info', (item.Phone.length > 0 ? encrypt_phone(item.Phone.replace(" ", "")) : ""));
            $('#actionticket_phone2').html(item.Phone2);
            $('#actionticket_phone2').attr('data-info', (item.Phone2.length > 0 ? encrypt_phone(item.Phone2.replace(" ", "")) : ""));
            TicketAction_RecordLoad(item.Phone, item.Phone2);
            $('#actionticket_gender').html(item.GenderName);
            $('#actionticket_source').html(item.Source + `${item?.SourceDetail != '' ? ' - ' + item?.SourceDetail : '' }`);
            $('#actionticket_address').html(item.Address);
            $('#actionticket_RepresentService').html(Fun_GetString_ByToken(DataServiceCare,item.ServiceCareID));
            $('#actionticket_servicecare').html(service_care);
            $('#actionticket_note').html(item.Content);
            let CustomerCode = item.CustomerCode;
            let TicketCode = TicketAction_CodeTicket(item.TicketID);
            if (CustomerCode != '') {
                $("#actionTicket_CreatCustomer").hide();
                $("#actionTicket_CreateAppointmentTemp").hide();
                $("#actionTicket_CreatAppointment").show();
                $('#actionticket_name').html(item.Name);
                $("#actionticket_ticketcode, #actionticket_custcode").removeClass('d-none');
                $("#actionticket_ticketcode").html( TicketCode)
                $("#actionticket_custcode").html( CustomerCode)
                $('#actionticket_name').addClass('cursor-pointer');
                $('#actionticket_custcode').unbind().click(function () {
                    let link = '/Customer/MainCustomer?CustomerID=' + ser_ActionCustomerID + '&ver=' + versionofWebApplication;
                    let win = window.open(link, '_blank');
                    win.focus();
                });

            }
            else {
                $("#actionticket_custcode").html('');
                $('#actionticket_name').removeClass('cursor-pointer')
                $("#actionTicket_CreatCustomer").show();
                $("#actionTicket_CreateAppointmentTemp").show();
                $("#actionTicket_CreatAppointment").hide();
                $("#actionticket_ticketcode").removeClass('d-none');
                $("#actionticket_ticketcode").html( TicketCode)
                $('#actionticket_name').html(item.Name);
                $("#actionticket_name").unbind("click");
            }
            $("#ticketaction_staffcurrentname").html(item.CurrentStaff);
            if (item.StaffOld != "" && item.StaffID != item.StaffOld && item.StaffOld != 0) {
                $("#ticketaction_staffoldname").html(item.StaffOld+' '+ConvertToDateRemove1900(SysDate().FUTC(item.executedOld).DTText()));
                $("#ticketaction_divStaffOld").removeClass('d-none');
            }
            if (item.NameDevide != '') {
                $("#ticketaction_divDevide").removeClass('d-none');
                $("#ticketaction_devidename").html(item.NameDevide+' '+SysDate().FUTC(item.DateDevide).DTText())
            }
            if (item.NameCreated != '') {
                $("#ticketaction_divCreated").removeClass('d-none');
                $("#ticketaction_createdname").html(item.NameCreated+' '+SysDate().FUTC(item.DateCreated).DTText())
            }
            $("#ticketaction_staffcurrentname").html(item.CurrentStaff);
            $("#ticketaction_staffcurrent_image").attr("src", item.AvatarStaff != '' ? item.AvatarStaff : Master_Default_Pic);
            let _age = Sys2Date().FUTC(new Date(item.Birthday), new Date()).YDistance();
            if (_age > 0 && _age < 100) {
                let birth = SysDate().FUTC(item.Birthday).DateText() + ' [ ' + _age + ' Tuổi ] ';
                $('#actionticket_birthday').html(birth);
            }
            else {
                $('#actionticket_birthday').html('');
            }
            ser_ActionCustomerGroupID = Number(item.GroupCustomerID);

            $('#actionticket_group_img').attr('src', (item.ImageGroup != '') ? item.ImageGroup : Master_Default_Pic);
            $('#actionticket_group').html((item.GroupName != '') ? item.GroupName : 'no group');

            //(item.GroupName != '') ? $('#actionticket_group').prop("title", item.GroupName) : 'no group';
            $("#actionticket_group").popup({
                transition: "scale up",
                position: "bottom left",
            });
            let FPageID = "", FUID = "";
            if ((syn_PancakeURL ?? "") != "") {
               
                FPageID = item?.PID ?? "";
                FUID = item?.PSID ?? "";
            }

            if (FPageID != "" && FUID != "") {
                let fanpage = `
                        <div class="d-flex">
                            <div class="col-auto p-1 text-xs me-1 rounded-2 bg-primary-soft">
                                <i class="fab fa-facebook-f me-1 text-sm text-dark"></i>
                                <a target="_blank" class="fw-bold text-primary text-xs pt-1" href="https://www.facebook.com/${FPageID}/">
                                            ${item.PancakePage ?? Outlang["Sys_page_facebook"]}
                                </a>
                            </div>
                            <div class="col-auto ms-2  p-1 text-xs me-1 rounded-2 bg-primary-soft">
                                <i class="mx-1 text-sm text-dark fab fa-facebook-messenger"></i>
                                <a target="_blank" class=" fw-bold text-primary text-xs pt-1" href="https://pancake.vn/${FPageID}?c_id=${FPageID}_${FUID}">
                                    ${item.PancakeConver ?? Outlang["Sys_thong_tin_chat_page"]}
                                </a>
                            </div>
                        </div>

                `
                $('#actionticket_fanpage').html(fanpage);
                $('#actionticket_fanpagediv').removeClass('d-none');

                let pantag = TicketAction_RenderPanTag(FPageID, item.PancakeConverTag, (dataPanTag ?? []));
                $('#actionticket_fanpageTag').html(pantag);
                $('#actionticket_fanpagetagdiv').removeClass('d-none');
            }
            else {
                $('#actionticket_fanpage').html('');
                $('#actionticket_fanpagediv').addClass('d-none');

                $('#actionticket_fanpageTag').html('');
                $('#actionticket_fanpagetagdiv').addClass('d-none');
            }          




            TicketAction_FillLink("actionticket_facebook", item.Facebook != '' ? TicketAction_CheckDataLinkOld(item.Facebook,'facebook') : '');
            TicketAction_FillLink("actionticket_mess", item.Messenger != '' ? TicketAction_CheckDataLinkOld(item.Messenger,'messenger') : '');
            TicketAction_FillLink("actionticket_zalo", item.Zalo != '' ? TicketAction_CheckDataLinkOld(item.Zalo,'zalo') :'');
            TicketAction_FillLink("actionticket_viber", item.Viber != '' ? TicketAction_CheckDataLinkOld(item.Viber,'viber') : '');
            TicketAction_FillLink("actionticket_ins", item.Instgram != '' ? TicketAction_CheckDataLinkOld(item.Instgram,'instagram'):'');
        }

        let itemStic = dataStic[0];
        if (itemStic != undefined) {
            //$('#actionticket_ticketdate').html(SysDate().FUTC(itemStic.Ticket_Date).DateText());
            $('#actionticket_profiledate').html(SysDate().FUTC(itemStic.Profile_Date).DateText());
            $('#actionticket_appointmentdate').html(SysDate().FUTC(itemStic.Appoiment_Date).DateText());
            if (SysDate().FUTCFULLNUM(itemStic.Customer_Date).DateText()!="")  {
                $('#actionticket_custdate').removeClass('fas fa-ban text-secondary').addClass('fas fa-check text-success');
            } else {
                $('#actionticket_custdate').removeClass('fas fa-check text-success').addClass('fas fa-ban text-secondary');
            }
            $('#actionticket_numapp').html(itemStic.Num_App);
            $('#actionticket_numapp_checked').html(itemStic.Num_App_Checked);
            $('#actionticket_numexecute').html(itemStic.Num_Execute);

            if (itemStic.IsDeleteTicket == 1) $('#actionTicket_DeleteTicket').removeClass('d-none');
            else $('#actionTicket_DeleteTicket').remove();

        }
        Checking_TabControl_Permission();
        resolve();
    });
}

function TicketAction_RenderPanTag(pagecode, tag, dataTag) {
    try {
        let objDataTag = dataTag?.reduce((pre, arr) => { if (arr["ID"]) pre[arr.ID.toString() + '-' + arr.PageID] = arr; return pre }, {});
        let _ob = tag.split(',');
        let _dy = [];
        let _maxblock = 5;
        let _indexblock = 0;
        let _content = '';
        for (let ii = 0; ii < _ob.length; ii++) {
            if (_ob[ii] != "") {
                _dy.push(_ob[ii]);
            }
        }

        for (ii = 0; ii < _dy.length; ii++) {
            _indexblock = _indexblock + 1;
            if (_indexblock <= _maxblock) {
                let item = objDataTag[_dy[ii].toString() + '-' + pagecode];
                if (item != undefined && item != "") {
                    _content = _content +
                        `<div  onclick="event.preventDefault(); return TicketAction_ChangePanTag()" class="col-auto cursor-pointer py-1 text-xs me-1 rounded-2" title="${item.Name}"  style="background: ${item.Color}2b; color: ${item.Color};">
                        ${item.Name}
                    </div>`
                }
            }
            else {
                let _moretag = '';
                for (k = _maxblock; k < _dy.length; k++) {
                    let _m = objDataTag[_dy[k].toString() + '-' + pagecode];
                    if (_m != undefined && _m != "") {
                        _moretag = _moretag +
                            `<div class="col-auto text-xs py-1 fw-bold px-2  me-1 rounded-2" title="${_m.Name}"  style="background: ${_m.Color}2b; color: ${_m.Color};">
                                ${_m.Name} </div>`
                    }
                }
                _content = _content +
                    `<div class="position-relative d-inline ps-0 col-auto">
                            <a class="col-auto text-xs py-1 px-2  me-1 rounded-2"  data-bs-toggle="collapse" href="#tagmore${ser_ActionTicketID}" role="button" aria-expanded="false" aria-controls="collapseExample" style="background: #bdbdbd29;color: #000000;" >
                                + ${_dy.length - _indexblock + 1} Tags
                            </a>
                            <div class="collapse position-absolute z-index-4 end-1 more top-100 mt-2" id="tagmore${ser_ActionTicketID}" style="min-width: 250px; z-index: 1000;">
                                <div class="card p-2 card-body shadow-lg">
                                    ${_moretag}
                                </div>
                            </div>
                        </div>`
                break;
            }
        }
        if (_content == "") {
            _content = `<div onclick="event.preventDefault(); return TicketAction_ChangePanTag()" class="col-auto mb-1 bg-primary-soft text-primary me-1 p-2 py-1 rounded-2 text-xs cursor-pointer" title="@Local["Chưa gán tag"]">
                             no tag
                        </div>`
        }

        return _content;
    }
    catch (e) {
        console.log(e);
        return "";
    }
}

async function TicketAction_FillLink (id, link) {
    new Promise((resolve, reject) => {
        if ($('#' + id).length) {
            $('#' + id).unbind('click');
            if (link != '') {
                $('#' + id).removeClass("nolink");
                $('#' + id).attr("data-link", link);
                $('#' + id).click(function () {
                    let link = $(this).attr('data-link');
                    if (link != '') {
                        let win = window.open(link, '_blank');
                        win.focus();
                    }
                });
            }
            else $('#' + id).addClass("nolink");
        }
        resolve();
    });
}
async function TicketAction_HistoryRender (data, id) {
    new Promise((resolve, reject) => {
        var myNode = document.getElementById(id);
        if (myNode != null) {
            if (data && data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    let item = data[i];
                     
                    let tr =
                        `
                        <li  class="type${item.Type} type p-0 list-group-item border-0 rounded-0 justify-content-between  border-radius-lg">
                            <div class="d-flex px-2 w-100 border-1 border-bottom">
                                <div class="ps-3 row p-2 w-100">
                                    <div class="col-12 col-sm-12 col-md-4 col-xl-3 p-1 flex-grow-1">
                                        <span class="mb-0 text-dark fw-bold text-sm">${item.CreatedName}</span>
                                        <div>
                                            <span class="mb-0 text-secondary pe-1 text-sm">${SysDate().FUTC(item.Created).TimeText()}</span>
                                            <span class="mb-0 text-secondary text-sm">${SysDate().FUTC(item.Created).DateText()}</span>
                                        </div>
                                    </div>
                                     
                                    <div class="col-12 col-sm-12 col-md-8 col-xl-9 p-1 flex-grow-1">
                                        <h6 class="mb-0 fw-bold text-sm">${ Outlang["Noi_dung"] }</h6>
                                        <span class="mb-0 text-dark text-sm" style="white-space: pre-line;">${((item.Status) != '' ? (`<b>${item.Status} -${item.StatusCall}</b> `)  : '')  }${(item.Content).trim()}</span>
                                    </div>
                                </div>

                            </div>
                             
                        </li>`;
                    myNode.insertAdjacentHTML('beforeend', tr);
                }
            }
            TicketAction_HistoryFilter();
        }
        resolve();
    });
}
async function TicketAction_HistoryLoad (isLoadMore = 0) {
    new Promise((resolve, reject) => {
        setTimeout(() => {
            if (isLoadMore == 0) {
                ta_begincc = 0;
                ta_beginval = 0;
                ta_beginhis = 0;
                ta_beginnote = 0;
                $('#TicketAction_History').html('');
            }
            AjaxLoad(url = "/Marketing/Ticket/TicketActionTable/?handler=Loadata_History"
                , data = {
                    'TicketID': ser_ActionTicketID, 'CustomerID': ser_ActionCustomerID
                    , 'BeginCC': ta_begincc
                    , 'BeginValue': ta_beginval
                    , 'BeginHist': ta_beginhis
                    , 'BeginNote': ta_beginnote
                }
                , async = true
                , error = function () {notiError_SW();}
                , success = function (result) {
                    if (result != "0") {
                        let data = JSON.parse(result);
                        let dataHistory = data.filter(word => Number(word["Type"]) == 8);
                        let dataFol = data.filter(word => Number(word["Type"]) == 7);
                        let dataCC = data.filter(word => Number(word["Type"]) != 7 && Number(word["Type"]) != 8 && Number(word["Type"]) != 11);
                        let dataNote = data.filter(word => Number(word["Type"]) == 11);
                        if (dataHistory != undefined && dataHistory.length != 0) ta_beginhis = Number(dataHistory[dataHistory.length - 1].ID);
                        if (dataFol != undefined && dataFol.length != 0) ta_beginval = Number(dataFol[dataFol.length - 1].ID);
                        if (dataCC != undefined && dataCC.length != 0) ta_begincc = Number(dataCC[dataCC.length - 1].ID);
                        if (dataNote != undefined && dataNote.length != 0) ta_beginnote = Number(dataNote[dataNote.length -1].ID)

                        TicketAction_HistoryRender(data, 'TicketAction_History');
                        if (data && data.length != 0) {
                            $("#btnTicketHistory").show();
                            $("#per_DeleteHistoryTele").removeClass('d-none');
                        }
                        else $("#btnTicketHistory").hide();

                    }
                    else {
                        notiError_SW();
                    }
                }
            );

        }, 200);

        resolve();
    });
}

function TicketAction_HistoryFilter () {
    let type = Number($('#ticketaction_typecare').dropdown('get value'));
    $('#TicketAction_History .type').addClass('d-none');
    if (type == 0) $('#TicketAction_History .type').removeClass('d-none');
    else $('#TicketAction_History .type' + type).removeClass('d-none');
}
async function TicketAction_SMSLoad () {
    new Promise((resolve, reject) => {
        AjaxLoad(url = "/Marketing/Ticket/TicketActionTable/?handler=Loadata_SMS"
            , data = {'TicketID': ser_ActionTicketID, 'CustomerID': ser_ActionCustomerID}
            , async = true
            , error = function () {notiError_SW();}
            , success = function (result) {
                if (result != "0") {
                    let data = JSON.parse(result);
                    TicketAction_SMSRender(data, "actionticket_sms");
                } else {
                    notiError_SW();
                }
            }
        );
        resolve();
    });
}
async function TicketAction_SMSRender (data, id) {
    new Promise((resolve, reject) => {
        var myNode = document.getElementById(id);
        if (myNode != null) {
            myNode.innerHTML = '';
            let stringContent = '';
            if (data && data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    let item = data[i];
                    stringContent = stringContent +
                        `
                        <li class="px-2 list-group-item border-0 d-flex justify-content-between  border-radius-lg">
                            <div class="d-flex w-100">
                                <div class="ps-3 row px-2 w-100">
                                    <div class="col-12 col-sm-6 col-xl-2 p-1 flex-grow-1">
                                        <h6 class="mb-0 text-secondary text-sm">${SysDate().FUTC(item.Created).TimeText()}</h6>
                                        <span class="mb-0 text-dark fw-bold text-sm">${SysDate().FUTC(item.Created).DateText()}</span>
                                    </div>
                                    <div class="col-12 col-sm-6 col-xl-2 p-1 flex-grow-1">
                                        <h6 class="mb-0 text-secondary text-sm">${ Outlang["Nguoi_gui"] }</h6>
                                        <span class="mb-0 text-dark fw-bold text-sm">${item.CreatedName}</span>
                                    </div>
                                    <div class="col-12 col-sm-6 col-xl-8 p-1 flex-grow-1">
                                        <h6 class="mb-0 text-secondary text-sm">${ Outlang["Noi_dung"] }</h6>
                                        <span class="mb-0 text-dark fw-bold text-sm">${item.Content}</span>
                                    </div>
                                </div>
                            </div>
                        </li>
                        <hr class="horizontal dark my-0">
                        `;

                }
            }
            document.getElementById(id).innerHTML = document.getElementById(id).innerHTML + stringContent;
        }
        resolve();
    });
}
async function TicketAction_SchedulerLoad () {
    new Promise((resolve, reject) => {
        $("#actionticket_Scheduler").empty();
        $("#actionticket_Scheduler").load("/Customer/ScheduleList_Schedule?CustomerID=" + ser_ActionCustomerID + "&TicketID=" + ser_ActionTicketID);
        resolve();
    });
}
function TicketAction_RecordLoad (phone, phone2) {
    $("#actionticket_CallHistory").empty();
    $('#actionticket_CallHistory').load("/Marketing/Call/HistoryCallByPhone?phone1=" + encrypt_phone(phone).toString() + "&phone2=" + encrypt_phone(phone2).toString() + "&ver=" + versionofWebApplication);
}
async function TicketAction_TodoLoad () {

    new Promise((resolve, reject) => {
        setTimeout(() => {
            AjaxLoad(url = "/Marketing/Ticket/TicketActionTable/?handler=Loadata_Todo"
                , data = {'TicketID': ser_ActionTicketID}
                , async = true
                , error = function () {notiError_SW();}
                , success = function (result) {
                    if (result != "0") {
                        let data = JSON.parse(result);
                        if (data.length > 0) {
                            $("#color_todo").css("background-color", data[0].Color);
                            $("#color_todo").attr('data-id', data[0].ID);
                            $("#color_todo").attr('data-assign', data[0].IsAssign);
                            $("#color_todo").attr('data-isclose', data[0].IsClose);
                            $("#content_todo").html(data[0].StatusName);
                            $("#ticketAction_popup_todo").attr('data-id', data[0].ID);
                            $("#ticketAction_popup_todo").prop('title', data[0].Content);

                            $("#color_todo").popup({
                                transition: "scale up",
                                position: "top left",
                            });
                            $("#ticketAction_popup_todo").popup({
                                transition: "scale up",
                                position: "bottom left",
                            });

                        } else {
                            $("#color_todo").css("background-color", "#cccccc;");
                            $("#color_todo").removeAttr("title");
                            $("#color_todo").removeAttr("data-id");
                            $("#color_todo").removeAttr("data-assign");
                            $("#color_todo").removeAttr("data-isclose");

                            $("#content_todo").html("Note here");

                            $("#ticketAction_popup_todo").removeAttr('data-id');
                            $("#ticketAction_popup_todo").removeAttr('title');
                            $("#color_todo").html();

                        }


                    }
                }
            );
        }, 100);

        resolve();
    });
}
function TicketAction_TodoEvent () {
    $("#color_todo").unbind('click').click(function () {
        let Todo_CurrentID = $(this).attr("data-id");
        let IsAssign = Number($(this).attr("data-assign"));
        let IsClose = Number($(this).attr("data-isclose"));
        if (IsAssign != 1 && IsClose == 0) {
            let TicketID = ser_ActionTicketID;
            let CustID = 0;
            Master_Todo_Open_Popup_ChangeStatus(this, Todo_CurrentID, CustID, TicketID);
        }
    });
}
function TicketAction_CheckDataLinkOld(value, type) {
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
function TicketAction_TodoOpen (e) {
    let currentid = 0;
    let custid = 0;
    let ticketid = ser_ActionTicketID;
    currentid = $(e).attr("data-id");
    Master_Todo_Open_Popup_Detail(e, currentid, custid, ticketid);
}
//#endregion



async function TicketAction_TagLoad () {
    new Promise((resolve, reject) => {
        AjaxLoad(url = "/Marketing/Ticket/TicketActionTable/?handler=Loadata_Tag"
            , data = {'TicketID': ser_ActionTicketID}
            , async = true
            , error = function () {notiError_SW();}
            , success = function (result) {
                if (result != "0") {
                    let data = JSON.parse(result);
                    if (data && data.length > 0) {
                        var item = data[0];
                        if (item.TagID != 0) {
                            $("#actionticket_Tag").html(item.TagName)
                            $("#ColorTag").css("background-color", data[0].Color);
                        }
                        else {
                            $("#actionticket_Tag").html('no tag')
                            $("#ColorTag").css("background-color", "#cccccc;");
                        }
                    }
                    else {
                        $("#actionticket_Tag").html('no tag')
                        $("#ColorTag").css("background-color", "#cccccc;");
                    }
                }
            }
        );
        resolve();
    });
}

function TicketAction_CodeTicket (id) {
    try {
        let result = '';
        let stringTemm = '00000000';
        stringTemm = stringTemm + id.toString();
        let lengthTemp = stringTemm.length;
        result = stringTemm.slice(lengthTemp - 8, lengthTemp)
        return result;
    }
    catch (ex) {
        return '';
    }
}

function TicketAction_HistoryTeleDelete() {
    let id = ser_ActionTicketID;
    const promise = notiConfirm();
    promise.then(function () { TicketAction_ExcHistoryTeleDelete(id); }, function () { });
}

async function TicketAction_ExcHistoryTeleDelete(TicketID) {
    new Promise((resolve, reject) => {
        AjaxLoad(url = "/Marketing/Ticket/TicketActionTable/?handler=HistoryTeleDelete"
            , data = {
                'TicketID': TicketID
            }
            , async = true
            , error = function () { notiError_SW(); }
            , success = function (result) {
                if (result == "1") {
                    notiSuccess();
                    TicketAction_HistoryLoad();
                }
            }
        );
        resolve();
    });
}