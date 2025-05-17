
//#region // Event
function MS_MainEvent() {
    $("#MS_FilterAct .filter").unbind().click(function() {
        $("#MS_FilterAct .filter").removeClass('active');
        $(this).addClass('active');
        let tyfile=$(this).attr('data-filter');
        if(tyfile==1)  $('#MS_NotiContent').addClass('unreadonly');
        else $('#MS_NotiContent').removeClass('unreadonly');
        
    });

    $("#MS_NotiClear").click(function () {

        MS_NotiUpdateRead(-1, 0);
        $(".ms_notiitem").remove();
        $("#MS_NotiContent hr").remove();

    });
    $("#MS_NotiReadAll").click(function () {
        MS_NotiUpdateRead(1, 0);
        $(".ms_notiitem").removeClass("unread");
        $("#MS_NotiTotal").html("0");
        $("#MS_NotiTotal").parent().removeClass('notiRing');
    });
 
    $("#MS_NotiSysReadAll").click(function() {
        MS_NotiSysUpdateRead(0);
        $("#MS_NotiSysTotal").parent().removeClass('notiRing');
        $("#MS_NotiSysTotal").addClass("unread");
        $(".ms_notiitemsys").removeClass("unread");
    });

    $(document).on("mousedown", function (e) {
        let search = $("#MS_SearchMainResult");
        if (!$(search).is(e.target) && $(search).has(e.target).length === 0) {
            $("#MS_SearchMainResult").hide();
        }
        let noti = $("#MS_NotiArea");
        if (!$(noti).is(e.target) && $(noti).has(e.target).length === 0) {
            $("#MS_NotiArea").hide();
        }
        let notisys=$("#MS_NotiAreaSys");
        if(!$(notisys).is(e.target)&&$(notisys).has(e.target).length===0) {
            $("#MS_NotiAreaSys").hide();
        }
        

        let popup = $("#MS_PopupArea");
        if (!$(popup).is(e.target) && $(popup).has(e.target).length === 0) {
            $("#MS_PopupArea").hide();
        }
        let popupmini = $("#MS_MinialArea");
        if (!$(popupmini).is(e.target) && $(popupmini).has(e.target).length === 0) {
            $("#MS_MinialArea").hide();
        }
        let popuplanguage = $("#MS_LanguageArea");
        if (!$(popuplanguage).is(e.target) && $(popuplanguage).has(e.target).length === 0) {
            $("#MS_LanguageArea").hide();
        }
    });

    $("#Master_Top .MS_DashboardDetail").click(function () {
        window.location.href = "/Dash/Dash_Master?ver=" + versionofWebApplication;
    });
    $(".title-popup").popup({
        transition: "scale up",
        position: "right center"
    });

    $("#MS_PopupLanguage").on('click', '.flag-item', function () {
        let lang = $(this).attr('data-value');
        MS_ChangeLanguage(lang);
    })

}
//#endregion

//#region // Popup
function MS_PopupUserShow () {
    let position = MS_GET_Position_Popup($('#MS_PopupArea').parent(), $('#MS_PopupArea'));
    $("#MS_PopupArea").css({
        "display": "block"
        , "top": position.top + 10
        , "left": position.left-30
        , "width": ((position.width != undefined) ? (position.width) : "")
    }).animate({
        top: position.top + 20
    }, 300);
    event.stopPropagation();
}
function MS_MinialShow () {
    let position = MS_GET_Position_Popup($('#MS_MinialArea').parent(), $('#MS_MinialArea'));
    $("#MS_MinialArea").css({
        "display": "block"
        , "top": position.top + 10
        , "left": position.left - 30
        , "width": ((position.width != undefined) ? (position.width) : "")
    }).animate({
        top: position.top + 20
    }, 300);
    event.stopPropagation();
}

function MS_PopupFillData () {
    $('#MS_PopupAvatar').attr({'src': Master_circleAvatar, 'title': sys_userName_Main});
    $('#MS_PopupName').html(sys_userName_Main);
    $('#MS_PopupGroupName').html(Master_roleGroupCurrent);
    $('#MS_PopupEmpName').html(sys_employeeName_Main);

}
//#endregion

//#region // Searching
$('#MS_SearchInput').keyup(function () {

    if ($(this).val().length > 0) {
        $("#MS_SearchContent .btnsear_clear")
            .removeClass('opacity-1')
            .addClass('d-none');
    }
    else {
        $("#MS_SearchContent .btnsear_clear")
            .addClass('opacity-1')
            .addClass('d-none');
    }
    $("#MS_SearchContent .spinner-border").show();
    clearTimeout(Timer_Search_Customer);
    Timer_Search_Customer = setTimeout(function (e) {
        let text = $('#MS_SearchInput').val().toLowerCase().trim();
        let textnosign = removeSpecChar(xoa_dau(text));
        MS_SearchExecute(text, textnosign);
    }, 500);
    setTimeout(function (e) {
        $("#MS_SearchContent .spinner-border").hide();
    }, 1000);
});

$('#MS_SearchInput').focus(function () {
    clearTimeout(Timer_Search_Customer);
    Timer_Search_Customer = setTimeout(function (e) {
        let text = $('#MS_SearchInput').val().toLowerCase().trim();
        let textnosign=removeSpecChar(xoa_dau(text));
        MS_SearchExecute(text,textnosign);
    }, 500);
});

$("#MS_SearchContent").on('click', '.btnsear_clear', function (e) {
    $('#MS_SearchInput').val('');
    $("#MS_SearchContent .btnsear_clear").addClass('opacity-1');
    $("#MS_SearchResult").empty();
    Count_Up("MS_CountResult", 0);
    $("#MS_SearchMainResult").hide();
 
    $("#MS_SearchContent .spinner-border").hide();
});

function MS_SearchText(text) {
    try {
        return removeSpecChar(xoa_dau(text)).toLowerCase();
    }
    catch (ex) {
        return '';
    }
}
function levenshteinDistance(s1, s2) {
    const m = s1.length;
    const n = s2.length;
    const dp = Array(m + 1)
        .fill(null)
        .map(() => Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) {
        dp[i][0] = i;
    }
    for (let j = 0; j <= n; j++) {
        dp[0][j] = j;
    }
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
            dp[i][j] = Math.min(
                dp[i - 1][j] + 1,
                dp[i][j - 1] + 1,
                dp[i - 1][j - 1] + cost
            );
        }
    }
    return dp[m][n];
}
function calculateSimilarity(obj, search) {
    let totalDistance = 0;
    let totalLength = 0;

    for (const field in obj) {
        const distance = levenshteinDistance(obj[field].toString(), search);
        const length = Math.max(obj[field].toString().length, search.length);
        totalDistance += distance;
        totalLength += length;
    }
    return 1 - totalDistance / totalLength; 
}
function searchWithSimilarity(data, search) {
    const results = [];
    for (const obj of data) {
        const similarity = calculateSimilarity(obj, search);
        if (similarity > 0) {
            results.push({ obj, similarity });
        }
    }
    results.sort((a, b) => b.similarity - a.similarity);
    return results;
}
function MS_SearchExecute(_text,_text_nosign) {

    if (seaching_ajax_request && seaching_ajax_request.readyState != 4) seaching_ajax_request.abort();
    if(_text_nosign.length>=2||_text.length>=2) {
        seaching_ajax_request = AjaxLoad(url = "/Master/Master_Top/?handler=SearchQuick"
            , data = {
                'text': _text,
                'text_nosign': _text_nosign
            }
            , async = true
            , error = function () {notiError_SW();}
            , success = function (result) {
                if (result != "0") {
                    let _isresult = 1;
                    let data=JSON.parse(result);
            
                    let _datapri = [];
                    let _datanopri = [];
                    let _datafilter = [];
                    _text_nosign=_text_nosign.toLowerCase();
                    _text=_text.toLowerCase()

                    if(data!=undefined&&data.length!=0) {

                        for(let i=0;i<data.length;i++) {
                            let item=data[i];
                            if(item["CustomerName"].toLowerCase()==_text
                                ||item["LastName"].toLowerCase()==_text
                                ||item["CustCodeOld"].toLowerCase()==_text
                                ||item["CustCode"].toLowerCase()==_text
                                ||item["DocumentCode"].toLowerCase()==_text
                                ||item["CustomerPhone"].toLowerCase()==_text
                                ||item["CustomerPhone2"].toLowerCase()==_text
                                ||item["MemberCode"].toLowerCase()==_text
                            ) {
                                _datapri.push(item);
                            }
                            else {
                                _datanopri.push(item);
                            }
                        }
                                      
                        _datafilter = _datapri.concat(_datanopri);
                        if (_datafilter != undefined && _datafilter.length != 0) {
                            _isresult = 1;
                        }
                        else _isresult = 0;
                    }
                    else _isresult = 0;
                    if (_isresult == 1) {
                        MS_SearchRender(_datafilter, "MS_SearchResult");
                        Count_Up("MS_CountResult", _datafilter.length);
                        sys_Hightlight(_text_nosign, "search_text_name");
                        sys_Hightlight(_text_nosign, "search_text_phone");
                        sys_Hightlight(_text_nosign, "search_text_code");
                        sys_Hightlight(xoa_dau(_text), "search_text_name");
                        sys_Hightlight(xoa_dau(_text), "search_text_phone");
                        sys_Hightlight(xoa_dau(_text), "search_text_code");
 
                        $("#MS_SearchMainResult").show();
                        let pos_top = $('#MS_SearchMainResult').parent().position().top;
                        $("#MS_SearchMainResult").css({
                            "display": "block"
                            , "top": pos_top + 20
                        }).animate({
                            top: pos_top + 40
                        }, 300);

                        Checking_TabControl_Permission();
                    }
                    else {
                        $("#MS_SearchResult").empty();
                        Count_Up("MS_CountResult", 0);
                        $("#MS_SearchMainResult").hide();
                        $("#MS_SearchContent .btnsear_clear").removeClass('d-none');
                        $("#MS_SearchMainResult").show();
                        let pos_top = $('#MS_SearchMainResult').parent().position().top;
                        $("#MS_SearchMainResult").css({
                            "display": "block"
                            , "top": pos_top + 20
                        }).animate({
                            top: pos_top + 40
                        }, 300);
                    }
                }
            }
            , sender = null, before = null
            , complete = function (e) {
                $("#MS_SearchContent .spinner-border").hide();
                $("#MS_SearchContent .btnsear_clear").removeClass('d-none')
            }
        );
    }
    else {
        $("#MS_SearchContent .spinner-border").hide();
        $("#MS_SearchResult").empty();
        Count_Up("MS_CountResult", 0);
        $("#MS_SearchMainResult").hide();
        $("#MS_SearchContent .btnsear_clear").removeClass('d-none')
    }
}

function MS_SearchRender (data, id) {
    var myNode = document.getElementById(id);
    if (myNode != null) {
        myNode.innerHTML = '';
        if (data && data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                let item = data[i];
                let gender = (item.Gender == 61)
                    ? `<i class="me-1 fas fa-venus" style="color: rgb(255, 107, 133);"></i>`
                    : `<i class="me-1 fas fa-mars" style="color: rgb(47, 137, 255);"></i>`;
                gender = `<div class="position-absolute top-0 start-0">${gender}</div>`;
                let redirect = item.CustomerID != 0
                    ? '/Customer/MainCustomer?CustomerID=' + item.CustomerID
                    : '/Marketing/TicketAction?CustomerID=0&TicketID=' + item.TicketID;
                let address = '';
                if (item.Commune != "") address = address + item.Commune + ',';
                if (item.District != "") address = address + item.District + ',';
                if (item.City != "") address = address + item.City + ',';
                if (address != "" && address.charAt(0) == ',') address = address.substring(1);
                if (address != "" && address.charAt(address.length - 1) == ',') address = address.slice(0, -1);
                if (address != "") {
                    address = `<div class="mb-0 toogleitem" data-name="MS_Address">
                                <p class="text-sm text-dark mb-0 search_text_address">
                                    ${address}
                                </p>
                            </div>`;
                }
                let birthday = ''; let phone = ''; let member = ''; let codeold = ''; let doccode = ''; let note = '';
                if (!item.Birthday.includes("1900")) {
                    birthday = `<div class="mb-0 toogleitem " data-name="MS_Birthday">
                                <div class="d-flex align-items-center">
                                    <p class=" mb-0 pe-2 text-sm text-secondary title">${Outlang["Ns_ghitat"]} : </p>
                                    <p class="text-sm text-dark mb-0 search_text_phone value">
                                        ${SysDate().FUTC(item.Birthday).DateText() }
                                    </p>
                                 </div>
                            </div>`;
                }
                if (item.MemberCode != "") {
                    member = `<div class="mb-0 toogleitem " data-name="MS_Membercode">
                                <div class="d-flex align-items-center">
                                    <p class="mb-0 pe-2 text-sm text-secondary title">${Outlang["Thanh_vien"]} : </p>
                                    <p class="text-sm text-dark mb-0 search_text_phone value">
                                        ${item.MemberCode}
                                    </p>
                                 </div>
                            </div>`;
                }
                if (item.CustomerPhone != "") {
                    phone = phone
                        + `<p class="text-sm text-dark mb-0 _tab_control_ search_text_phone" data-staff="${item.StaffID}" data-tab="phone_customer" >
                                    ${item.CustomerPhone}
                                </p>`
                }
                if (item.CustomerPhone2 != "") {
                    phone = phone
                        + ` <span class="px-2 text-xs fw-bolder text-dark">|</span>
                            <p class="value text-sm text-dark mb-0 _tab_control_ search_text_phone" data-staff="${item.StaffID}" data-tab="phone_customer" >
                                    ${item.CustomerPhone2}
                                </p>`
                }
                if (item.CustCodeOld != "" && item.CustCodeOld != '0' ) {
                    codeold = `<div class="mb-0 toogleitem " data-name="MS_CodeCusOld">
                                <div class="d-flex align-items-center">
                                    <p class="mb-0 pe-2 text-sm text-secondary title">${Outlang["KH_cu"]} : </p>
                                    <p class="text-sm text-dark mb-0 search_text_phone value">
                                        ${item.CustCodeOld}
                                    </p>
                                 </div>
                            </div>`;
                }
                if (item.DocumentCode != "") {
                    doccode = `<div class="mb-0 toogleitem" data-name="MS_DocumentCode">
                                <div class="d-flex align-items-center">
                                    <p class="mb-0 pe-2 text-sm text-secondary title">${Outlang["Ho_so"]} : </p>
                                    <p class="text-sm text-dark mb-0 search_text_phone value">
                                        ${item.DocumentCode}
                                    </p>
                                 </div>
                            </div>`;
                }
                if (item.Note != "") {
                    note = `<div class="mb-0 toogleitem" data-name="MS_Note">
                                <div class="d-flex align-items-center">
                                    <p class="mb-0 pe-2 text-sm text-secondary title">${Outlang["Ghi_chu"]} : </p>
                                    <p class="text-sm text-dark mb-0 search_text_phone value ellipsis_two_line">
                                        ${item.Note}
                                    </p>
                                 </div>
                            </div>`;
                }

                phone = `<div class="mb-0 mb-0 d-flex align-items-center">
                                <p class="mb-0 pe-2 text-sm text-secondary title">${Outlang["SDT_ghitat"]} : </p>
                                ${phone}
                            </div>`;

                let tr = `
                    <li class="border-0 border-bottom-sm list-group-item p-0 rounded-0">
                        <a class="search_result d-block px-4 py-2" target="_blank" href="${redirect}&ver=${versionofWebApplication}">
                            <div class="position-relative ps-3 d-flex flex-column justify-content-center ps-2">
                                ${gender}
                                <div class="text-md mb-0">
                                    <h1 class="search_text_name fw-bold text-sm text-dark pe-2  mb-0 d-inline">
                                        ${item.CustomerName}
                                    </h1>
                                    <p class="search_text_code mb-0 text-primary text-sm d-inline">
                                        <span>${((item.CustCode != '') ? item.CustCode : MS_SearchRender_GeneralCode(item.TicketID))}</span>
                                    </p>
                                </div>
                                ${doccode}
                                ${codeold}
                                ${phone}
                                ${member}
                                ${birthday}
                                ${address}
                                ${note}
                            </div>
                        </a>
                    </li>
                `
                myNode.insertAdjacentHTML("beforeend", tr);
            }
            MS_ShTable.Refresh();
        }
    }
}

function MS_SearchRender_GeneralCode(id) {
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
//#endregion

//#region // LANGUAGE
function MS_LangShow() {
    let position = MS_GET_Position_Popup($('#MS_LanguageArea').parent(), $('#MS_LanguageArea'));
    $("#MS_LanguageArea").css({
        "display": "block"
        , "top": position.top + 30
        , "left": position.left - 30
        , "width": ((position.width != undefined) ? (position.width) : "")
    }).animate({
        top: position.top + 20
    }, 300);
    event.stopPropagation();
}

//#endregion

//#region // Noti
 
function MS_NotiLoad () {
    AjaxLoad(url = "/Master/Master_Top/?handler=NotiItemCount"
        , data = ({})
        , async = true
        , error = function () {notiError_SW()}
        , success = function (result) {
            if (result != "0") {
                let data = JSON.parse(result);
                let _num = data[0].Number_UnRead;
                if (Number(_num) != 0) {
                    $("#MS_NotiTotal").removeClass('d-none');
                    $("#MS_NotiTotal").parent().addClass('notiRing');
                    $("#MS_NotiTotal").html(data[0].Number_UnRead);

                }
                else {
                    $("#MS_NotiTotal").addClass('d-none')
                    $("#MS_NotiTotal").parent().removeClass('notiRing');
                }
            }
            else {
                $("#MS_NotiTotal").addClass('d-none')
            }
        }
        , sender = null

    );
}
function MS_NotiUpdateRead (isread_all, id, todo) {
    AjaxLoad(url = "/Master/Master_Top/?handler=NotiExecute"
        , data = {
            'IsReadAll': isread_all
            , 'NotiID': id
            , 'todo': (todo != undefined) ? todo : 0
        }
        , async = true
        , error = function () {notiError_SW();}
        , success = function (result) {
            if (result == "1") {
                MS_NotiLoad();
            }
        }
        , sender = null
    );
}

function MS_NotiEvent() {
    $("#MS_NotiContent .ms_notiitem").unbind().click(function(event) {
        let _id_noti = $(this).attr("data-id");
        let _is_todo = $(this).attr("data-todo");
        $(this).removeClass("unread");
        MS_NotiUpdateRead(0, _id_noti, _is_todo);
    });
}

function MS_NotiShow () {
    let position = MS_GET_Position_Popup($('#MS_NotiArea').parent(), $('#MS_NotiArea'));
    $("#MS_NotiArea").css({
        "display": "block"
        , "top": position.top + 10
        , "left": position.left
        , "width": ((position.width != undefined) ? (position.width) : "")
    }).animate({
        top: position.top + 20
    }, 300);
    AjaxLoad(url = "/Master/Master_Top/?handler=NotiItemLoad"
        , data = {}
        , async = true
        , error = function () {notiError_SW();}
        , success = function (result) {
            if (result != "0") {
                let data = JSON.parse(result);
                MS_NotiRender(data, "MS_NotiContent");
                ToolPopper();
                if (data && data.length != 0) {
                    $("#MS_NotiEmpty").hide();
                   // $("#MS_NotiClear").show();
                   // $("#MS_NotiReadAll").show();
                }
                else {
                    //$("#MS_NotiArea_action").hide();
                    $("#MS_NotiEmpty").show();
                    //$("#MS_NotiClear").hide();
                   // $("#MS_NotiReadAll").hide();
                }
            }
            else {
                //$("#MS_NotiArea_action").hide();
                $("#MS_NotiEmpty").show();
               // $("#MS_NotiClear").hide();
                //$("#MS_NotiReadAll").hide();
            }
            $('#MS_NotiWaiting').hide();
        }
        , sender = null
        , before = function (e) {
            $('#MS_NotiContent').empty();
            $('#MS_NotiContent').hide();
            $('#MS_NotiWaiting').show();
        }
        , complete = function (e) {
            $('#MS_NotiContent').show();
            
        }
    );
    event.stopPropagation();
}
function MS_NotiRender_GetLinkText (_todo, _type, _link, _custid, _ticketid,_content) {
    let relink='',retext='';
    _content=_content.trim().toLowerCase();
    if (_todo == 0) {
        switch (_type) {
            case 1:
                {
                    retext=Outlang["Sys_gui_du_lieu"];
                    relink=_link+'?ver='+versionofWebApplication;
                }
                break;
            case 2:
                {
                    retext=Outlang["Sys_gui_du_lieu"];
                    relink=_link+'?ver='+versionofWebApplication;
                }
                break;
            case 4:
                {
                    retext=Outlang["Sys_gui_yeu_cau"];
                    relink=_link+'?ver='+versionofWebApplication;
                }
                break;
            case 5:
                {
                    if(_content.includes('approved')) retext=Outlang["Sys_duyet_phieu"];
                    else if(_content.includes('rejected')) retext=Outlang["Sys_tu_choi"];
                    else if(_content.includes('undo')) retext=Outlang["Sys_hoan_tac"];
                    relink = _link + '?ver=' + versionofWebApplication;
                }
                break;
            case 9:
                {
                    retext=Outlang["Sys_cham_soc_khach_hang"];
                    relink = _link + '?ver=' + versionofWebApplication;
                }
                break;
            case 3:
                {
                    retext=Outlang["Khach_hang"];
                    relink = _link + _custid + '&ver=' + versionofWebApplication;
                }
                break;
            case 6:
                {
                    relink = _link + _ticketid + '&CustomerID=' + _custid+ '&ver=' + versionofWebApplication;
                }
                break;
            case 7:
                {
                    relink = _link + '?ver=' + versionofWebApplication;
                }
                break;
            case 8:
                {
                    retext=Outlang["Sys_lich_lam_viec"];
                    relink = _link + '?ver=' + versionofWebApplication;
                }
                break;
            case 9:
                {
                    retext = Outlang["Sys_lich_lam_viec"];
                    relink = _link + '?ver=' + versionofWebApplication;
                }
            case 10:
                {
                    retext = "Gửi tin nhắn mới";
                    relink = _link + '?ver=' + versionofWebApplication;
                }
            default: break;
        }
        relink=`<a href="${relink}" target="_blank" class="access opacity-0 p-2 d-flex start-0 position-absolute w-100 h-100 mt-n2" >
                <i style="font-size:14px;" class="pe-1 mt-4 ms-auto fas text-primary  fa-chevron-right"></i>
            </a>`;
 

    }
    return [relink,retext];
}
function MS_NotiRender_GetAction (_todo, _type) {
    let result = '';
    if (_todo == 0) {
        switch (_type) {
            case 1:
            case 2:
                {
                    result=`<p class="text-info fw-bold mb-0 pe-2 text-xs">${_type}</p>`;
                    result = '<span class="badge badge-sm badge-circle badge-floating bg-gradient-info position-absolute border-white" style="bottom: -3px;right: -4px;border: 2px solid white;">'
                        + '<i class="vtt-icon vttech-icon-list-ticket-file text-white" style="font-size: 10px;"></i>'
                        + '</span>';
                }
                break;
            case 3:
                {
                    result = '<span class="badge badge-sm badge-circle badge-floating bg-gradient-success position-absolute border-white" style="bottom: -3px;right: -4px;border: 2px solid white;">'
                        + '<i class="fas fa-chevron-right text-white" style="font-size: 10px;"></i>'
                        + '</span>';


                }
                break;
            default: break;
        }
    }
    else {
        result = '<span class="badge badge-sm badge-circle badge-floating bg-gradient-success position-absolute border-white" style="bottom: -3px;right: -4px;border: 2px solid white;">'
            + '<i class="vtt-icon vttech-icon-task  text-white" style="font-size: 10px;"></i>'
            + '</span>';

    }
    return result;
}
function MS_NotiRender (data, id) {
    var myNode = document.getElementById(id);
    if (myNode != null) {
        myNode.innerHTML = '';
        let stringContent = '';
        if (data && data.length > 0) {

            for (let i = 0; i < data.length; i++) {
                let item = data[i];
                let _classname = (Number(item.IsRead) == 1) ? '' : 'unread';
                let sendername = '', senderimage = '', _type = '';
                let isUnRead = (Number(item.IsRead) == 1) ? ''
                    : `<span class="unread badge badge-md badge-dot me-2 ms-auto position-absolute" style="top: 13px;left: 22px;">
                        <i class="bg-gradient-success" style="width: .85rem;height: .85rem;border: 2px solid white !important;"></i>
                    </span>`;
 
                let obj = Fun_GetObject_ByID(MTDataEmployee, item.EmpSend);
                if (obj != null) {
                    senderimage = obj.Avatar;
                    sendername = obj.Name;
                }
                else {
                    senderimage = Master_Default_Pic;
                    sendername = '';
                }
                sendername=sendername=="-"? "":sendername;
                let parts=sendername.trim().split(' ');
                sendername= parts[parts.length-1];

                let _timeago=SysDate().FUTC(item.DateNoti).AgoText();
                _timeago=_timeago!=""? _timeago:SysDate().FUTC(item.DateNoti).DateText();
                let ltobj=MS_NotiRender_GetLinkText(item.IsTodo,item.Type,item.Link,item.CustomerID,item.TicketID,item.ContentNoti);
                let _link=ltobj[0];
                let _text = ltobj[1];
                let imageLeft = `<img style="height: 30px;width: 30px;border: 1px solid #c6c8c9;" src="${senderimage}" class="rounded-circle ">`
                if (item.Type == 10 && item.CustomerID != 0) {
                    isUnRead = `
                        <span class="unread badge badge-md badge-dot position-absolute" style="top: 20px;left: 22px; z-index:2;">
                            <i class="bg-gradient-success" style="width: .85rem;height: .85rem;border: 2px solid white !important;"></i>
                        </span>
                    `
                    imageLeft = `
                        <div style="height: 30px; width: 30px;">
                            <img
                                src="${senderimage}"
                                class="rounded-2 position-absolute"
                                style="height: 30px; width: 30px; border: 1px solid #c6c8c9; top: 0; right: -5px;">

                            <div class="position-absolute d-flex align-items-center justify-content-center"
                                style="height: 18px; width: 18px; bottom: 0; left: 0; border: 1px solid #c6c8c9; border-radius: 50%; background-color: #f0f0f0; z-index: 2"
                                data-bs-toggle="tooltip" data-bs-original-title="Hello World">
                            <i style="font-size:14px;" class="fas fa-user"></i>
                            </div>
                        </div>
                    `
                }


                stringContent = stringContent
                    +`<li class="ms_notiitem rounded-3 list-group-item border-0 position-relative d-flex p-2 px-2 rounded-0 ${_classname}" data-id="${item.ID}"  data-todo="${item.IsTodo}">
                        <div class="me-2 position-relative">
                            ${isUnRead}
                            ${imageLeft}
                        </div> 
                        <div class="ms-1"> 
                            <div style="line-height: 1.35 !important;" class="text-dark mb-n1 w-100 mb-0 text text-sm ellipsis_two_line">${item.ContentNoti}</div>
                            <div class="ellipsis_one_line mt-1 ">
                                 <div class="d-inline  text-sm text-lowercase">
                                   
                                    <span class="text-secondary  mb-0  text-sm  ">${sendername}</span>
                                    ${_text!=""? `<i class="px-1 text-xs fas fa-caret-right"></i><span>${_text}</span>`:`` }
                                </div>
                            </div>
                        </div>
                        <div class="text-dark text-end text-xs ms-auto">
                             <div>   ${_timeago}</div>
                     
                        </div>
                        ${_link}    
                    </li> `;
            }
        }
        document.getElementById(id).innerHTML = stringContent;
        MS_NotiEvent();
    }
}



// #endregion

//#region // Sys Noti
function MS_NotiSysEvent() {
    $("#MS_NotiSysContent .ms_notiitemsys").unbind().click(function(event) {
        let _id_noti=$(this).attr("data-id");

        $(this).removeClass("unread");
        MS_NotiSysUpdateRead(_id_noti);
    });
}
async function MS_NotiSysLoad() {
    await new Promise((resolve,reject) => {
        setTimeout(
            () => {
                try {
             
                    let _stList=localstorage_get("sysnoti");
                    if(_stList!="") {
                        _notilist=JSON.parse(_stList).data;
                        _notilist=_notilist!=""? _notilist:{};

                        if(Object.values(_notilist).filter(v => v===0).length) {
                            let $noti=$("#MS_NotiSysTotal")
                            if($noti.length) {

                                if($noti.hasClass('d-none')) {
                                    $noti.parent().addClass('notiRing');
                                    $noti.removeClass('d-none');
                                }
                            }
                        }
                    }


                } catch(e) {}
                resolve()
            }
        )
    });
}
function MS_NotiSysShow() {
    let position=MS_GET_Position_Popup($('#MS_NotiAreaSys').parent(),$('#MS_NotiAreaSys'));
    $("#MS_NotiAreaSys").css({
        "display": "block"
        ,"top": position.top+10
        ,"left": position.left
        ,"width": ((position.width!=undefined)? (position.width):"")
    }).animate({
        top: position.top+20
    },300);
    AjaxLoad(url="/Master/Master_Top/?handler=NotiItemLoadSys"
        ,data={}
        ,async=true
        ,error=function() {notiError_SW();}
        ,success=function(result) {
            if(result!="0") {
                let data=JSON.parse(result);
                MS_NotiSysRender(data,"MS_NotiSysContent");
                if(data&&data.length!=0) {
                    $("#MS_NotiSysEmpty").hide();
                }
                else {

                    $("#MS_NotiSysEmpty").show();
                }
            }
            else {

                $("#MS_NotiSysEmpty").show();
            }
            $('#MS_NotiSysWaiting').hide();
        }
        ,sender=null
        ,before=function(e) {
            $('#MS_NotiSysContent').empty();
            $('#MS_NotiSysContent').hide();
            $('#MS_NotiSysWaiting').show();
        }
        ,complete=function(e) {
            $('#MS_NotiSysContent').show();

        }
    );
    event.stopPropagation();
}
function MS_NotiSysRender(data,id) {
    var myNode=document.getElementById(id);
    if(myNode!=null) {
        myNode.innerHTML='';
        let stringContent='';
        if(data&&data.length>0) {
            let _notilist={};
            let _stList=localstorage_get("sysnoti");
            if(_stList!="") _notilist=JSON.parse(_stList).data;
            _notilist=_notilist!=""? _notilist:{};
      
            for(let i=0;i<data.length;i++) {
                let item=data[i];
                let _header=``;
                let isUnRead=``,_classname=``;
    
                if(_notilist[item.ID]==0) {
                   
                    _classname='unread';
                    isUnRead=
                        `<span class="unread badge badge-md badge-dot me-2 ms-auto position-absolute" style="top: 13px;left: 22px;">
                        <i class="bg-gradient-success" style="width: .85rem;height: .85rem;border: 2px solid white !important;"></i>
                    </span>`;
                }



                let _timeago=SysDate().FUTC(item.DateNoti).AgoText();
                _timeago=_timeago!=""? _timeago:SysDate().FUTC(item.DateNoti).DateText();
                let _icon=``,_title=``;
                if(item.Topic=="payment") {
                    _icon=`<div class="avatar imi payment rounded-circle p-1">
                        <i class="fas fa-shopping-cart"></i>
                        </div>`;
                    _header=item.CustName;
                    if(!isNaN(item.Content)) {
                        _title=Outlang["Sys_thanh_toan"]+': '+formatNumber(item.Content);
                    }
                    else _title=item.Content;
                }
                if(item.Topic=="booking") {
                    _icon=`<div class="avatar imi booking rounded-circle p-1" >
                        <i class="fas fa-calendar-check "></i>
                        </div>`;
                    _header=item.Content;
                    _title = Outlang["Sys_dat_lich_hen_online"] ?? "Đặt lịch hẹn online";
                }
                if (item.Topic == "rating") {
                    _icon=`<div class="avatar imi rating rounded-circle p-1" >
                        <i class="fas fa-star"></i>
                        </div>`;
                    _header=item.Content;
                    _title = Outlang["Sys_dat_lich_hen_online"] ?? "Đặt lịch hẹn online";
                }
                if(item.Topic=="profileonline") {
                    _icon=`<div class="avatar imi profileonline rounded-circle p-1">
                        <i class="fas fa-user-plus "></i>
                        </div>`;
                    _header=item.CustName;
                    _title=Outlang["Tao_ho_so_thanh_cong"] ?? "Tạo hồ sơ thành công";
                }

                let _link=MS_NotiRender_GetLinkSys(item.Topic,item.CustomerID);
                stringContent=stringContent
                    +`<li class="ms_notiitemsys rounded-3 list-group-item border-0 position-relative d-flex ${_classname}  p-0 rounded-0 px-2" data-id="${item.ID}">
                        <div class="d-flex w-100 border-bottom py-2">
                            <div class="me-2 position-relative">
                                <div class="  border-1 fea mt-1" >
                                     ${isUnRead}
                                     ${_icon}
                                </div>
                            </div> 
                            <div class="ms-1"> 
                                <div style="line-height: 1.35 !important;" class="text-dark mb-n1 w-100 mb-0 text text-sm ellipsis_two_line">
                                    <span class="text-dark text-sm  fw-bold">${_header}</span>
                                
                             
                                </div>
                                <div class="ellipsis_one_line ">
                                     <div class="d-inline ">
                                      <span class="opacity-7  text-lowercase text-dark text-sm">${_title}</span>
                               
                                   
                                    </div>
                                </div>
                            </div>
                            <div class="text-dark text-xs ms-auto">
                                ${_timeago}
                            </div>
                            ${_link}
                        </div>
                    </li> `;
            }
        }
        document.getElementById(id).innerHTML=stringContent;
        MS_NotiSysEvent();
    }
}
function MS_NotiRender_GetLinkSys(_topic,_custid) {
    let result='';
    switch(_topic) {

        case "payment":
            {
                result=`/Customer/MainCustomer?CustomerID=${_custid}&ver=${versionofWebApplication}&tab=thanh-toan`;
            }
            break;
        case "booking":
            {

                result=`/appcustomer/desk/general?ver=${versionofWebApplication}&slug=lich-hen`;
            }
            break;
        case "rating":
            {

                result = `/appcustomer/desk/general?ver=${versionofWebApplication}&slug=danh-gia`;
            }
            break;
        case "profileonline":
            {
                result=`/Customer/MainCustomer?CustomerID=${_custid}&ver=${versionofWebApplication}`;
            }
            break;

        default: break;
    }
    result=`<a href="${result}" target="_blank" class="access opacity-0 p-2 d-flex start-0 position-absolute w-100 h-100 mt-n2" >
                <i style="font-size:14px;" class="pe-1 mt-4 ms-auto fas text-primary  fa-chevron-right"></i>
            </a>`;
    return result;
}
function MS_NotiSysUpdateRead(_id=0) {
    try {

        let _notilist={};
        let _stList=localstorage_get("sysnoti");
        if(_stList!="") _notilist=JSON.parse(_stList).data;
        _notilist=_notilist!=""? _notilist:{};
        if(_id==0) {
            _notilist= {}
        }
        else {
            _notilist[_id]=1;
        }
        _notilist=Noti_Trim(_notilist,20);
        localstorage_set("sysnoti",_notilist);
        let $noti=$("#MS_NotiSysTotal")
        if(Object.values(_notilist).filter(v => v===0).length) {
            $noti.parent().addClass('notiRing');
            $noti.removeClass('d-none');
        }
        else {
            $noti.addClass('d-none');
            $noti.parent().removeClass('notiRing');
        }
        

    } catch(e) {}
}
// #endregion



//#region // Other
function MS_SearchEnterExecute () {
    let _page = location.pathname.split('/').slice(-1)[0];
    let search = xoa_dau($("#MS_SearchInput").val().toLowerCase()).trim();
    if (_page == "Searching") {
        window.open("/Searching/Searching?SeachingText=" + search, "_self");
    }
    else {
        window.open("/Searching/Searching?SeachingText=" + search);
    }
}



function MS_GET_Position_Popup (parent, child, isScroll = false) {
    let position = {
        top: 0,
        left: 0
    };
    let windowWidth = $(window).width();
    let parentHeight = parent.outerHeight();
    let parentWidth = parent.outerWidth();
    let childHeight = child.outerHeight();
    let childWidth = child.outerWidth();

    let parentOffset = parent.offset();
    let parentTop = parentOffset.top;
    let parentLeft = parentOffset.left;


    if (windowWidth - parentLeft > childWidth) {
        position.left = 0;
    }
    else if (parentLeft - childWidth + parentWidth > 0) {
        position.left = -childWidth + parentWidth;
    }
    else {
        position.left = -parentLeft + 10;
        position.width = windowWidth - 20;
    }
    position.top = parentHeight;
    return position;
}
//#endregion

//#region // Sidebar

if (document.querySelector('.fixed-plugin')) {
    let fixedPlugin = document.querySelector('.fixed-plugin');
    let fixedPluginButton = document.querySelector('.fixed-plugin-button');
    //let fixedPlugin = document.querySelector('.fixed-plugin');
    let fixedPluginButtonNav = document.querySelectorAll('.fixed-plugin-button-nav');
    let fixedPluginCloseButton = document.querySelectorAll('.fixed-plugin-close-button');
    let fixedPluginCard = document.querySelector('.fixed-plugin .card');

    let navbar = document.getElementById('navbarBlur');
    let buttonNavbarFixed = document.getElementById('navbarFixed');

    if (fixedPluginButton) {
        fixedPluginButton.onclick = function () {
            if (!fixedPlugin.classList.contains('show')) {
                fixedPlugin.classList.add('show');
            } else {
                fixedPlugin.classList.remove('show');
            }
        }
    }

    if (fixedPluginButtonNav) {
        fixedPluginButtonNav.forEach(element => {
            element.onclick = function () {
                if (!fixedPlugin.classList.contains('show')) {
                    fixedPlugin.classList.add('show');
                } else {
                    fixedPlugin.classList.remove('show');
                }
            }
        })
    }
    fixedPluginCloseButton.forEach(function (el) {
        el.onclick = function () {
            //fixedPlugin.classList.remove('show');
            document.querySelectorAll('.fixed-plugin')
                .forEach(function (el) {
                    el.classList.remove('show');
                })
        }
    })

    document.querySelector('body').onclick = function (e) {
        if (e.target != fixedPluginButton
            && e.target != fixedPluginButtonNav[0]
            && e.target != fixedPluginButtonNav[1]
            && e.target.closest('.fixed-plugin .card') != fixedPluginCard) {
            fixedPlugin.classList.remove('show');
           
        }
    }

    if (navbar) {
        if (navbar.getAttribute('data-scroll') == 'true' && buttonNavbarFixed) {
            //buttonNavbarFixed.setAttribute("checked", "false");
        }
    }

}

// click to minimize the sidebar or reverse to normal
if (document.querySelector('.sidenav-toggler')) {

    var sidenavToggler = document.querySelectorAll('.sidenav-toggler');
    var sidenavShow = document.getElementsByClassName('g-sidenav-show')[0];
    var toggleNavbarMinimize = document.getElementById('navbarMinimize');

    if (sidenavShow) {
        sidenavToggler.forEach(element => {
            element.onclick = function () {

                if (!sidenavShow.classList.contains('g-sidenav-hidden')) {
                    sidenavShow.classList.remove('g-sidenav-pinned');
                    sidenavShow.classList.add('g-sidenav-hidden');
                    if (toggleNavbarMinimize) {
                        toggleNavbarMinimize.click();
                        toggleNavbarMinimize.setAttribute("checked", "true");
                    }
                } else {
                    sidenavShow.classList.remove('g-sidenav-hidden');
                    sidenavShow.classList.add('g-sidenav-pinned');
                    if (toggleNavbarMinimize) {
                        toggleNavbarMinimize.click();
                        toggleNavbarMinimize.removeAttribute("checked");
                    }
                }
            };
        })
    }

    if (window.innerWidth < 1200) {
        var mainbody = document.getElementById('BodyMain');
        if (mainbody)
            mainbody.classList.add('g-sidenav-hidden');
    }
}

//#endregion


