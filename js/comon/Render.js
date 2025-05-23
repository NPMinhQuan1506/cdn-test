﻿//#region   Menu,poup up user
function MS_PopupRender(data, id) {
    var myNode = document.getElementById(id);
    if (myNode != null) {
        myNode.innerHTML = "";
        let stringContent = "";
        if (data && data.length > 0) {
            let idGroup = "0";
            for (var i = 0; i < data.length; i++) {
                let item = data[i];
                if (item.Group.length > 0) {
                    if (item.Group != idGroup) {
                        stringContent = stringContent
                            + '<div class="item d-block ps-3"><span class="text">' + item.Group + '</span>'
                            + '<i class="right dropdown icon"></i>'
                            + '<div class="left menu transition hidden">';
                    }
                    stringContent = stringContent
                        + '<div id="' + item.Name + '"><a class="item d-block ps-3" href="' + item.Link + "?ver=" + versionofWebApplication + '">'
                        + Outlang[item.TextLangKey];

                    if (item.Name == "notificationList")
                        stringContent = stringContent
                            + '<span id="icon-noti-app2" class="icon-noti-dow" ></span>';

                    stringContent += '</a></div>';

                    idGroup = item.Group;
                } else {
                    if (item.Group != idGroup) {
                        stringContent = stringContent + '</div></div>';
                    }
                    if (item.Name == "authorizeSetting") {
                        stringContent =
                            stringContent + '<li class="border-0 ps-4 list-group-im list-group-item rounded-0 pe-0" id="' + item.Name + '"><a class="text-dark w-100 d-flex" href="' + item.Link + '?ver=' + versionofWebApplication + '">'
                            + Outlang[item.TextLangKey];
                        if (item.Name == "notificationList")
                            stringContent +=
                                '<span id="icon-noti-app2" class="icon-noti-dow" ></span>';
                        stringContent += "</a></li>";
                    } else {
                        stringContent =
                            stringContent + '<li id="' + item.Name + '" class="border-0 ps-4 list-group-im list-group-item rounded-0 pe-0" ><a class="text-dark w-100 d-flex" href="' + item.Link + '?ver=' + versionofWebApplication + '">' + Outlang[item.TextLangKey] + '</a></li>';
                        if (i != data.length - 1) {
                            stringContent = stringContent + '<hr class="horizontal dark mt-0 mb-0">';
                        }
                    }
                }
            }
        }
        myNode.innerHTML = stringContent;
    }
}
function MS_LanguageRender(data, id) {
    var myNode = document.getElementById(id);
    if (myNode != null) {
        myNode.innerHTML = "";
        let stringContent = "";
        if (data && data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                let item = data[i];
                let tr = `
                    <li class="flag-item item ps-4 overflow-hidden text-nowrap" data-value="${item.ID}">
                        <div class="d-flex align-items-center ">
                            <div class="circle"><img onerror="Master_OnLoad_Error_Image(this)" class="flag-image " src="${item.Avatar}"> </div>
                            <span class="text-center text-sm flag-title">${item.Name}</span>
                        </div>
                    </li>
                `
                stringContent += tr
            }
        }
        myNode.innerHTML = stringContent;
    }
}
function RenderMenuDesktop(data, id, topid) {

    var myNode = document.getElementById(id);
    var myNodeTop = document.getElementById(topid);
    if (myNode != null && myNodeTop != null) {
        myNode.innerHTML = "";
        myNodeTop.innerHTML = "";
        let stringContent = "";
        let _topstringContent = "";
        if (data && data.length > 0) {
            let datagroup = groupBy(data, 'GroupID');
            if (datagroup != undefined && Object.keys(datagroup).length != 0) {
                let dataGroupTemp = Object.values(datagroup).sort((a, b) => { return a[0]?.IndexGroup - b[0]?.IndexGroup });
                for (let i = 0; i < dataGroupTemp.length; i++) {
                    stringContent = stringContent + RenderMenuDesktop_each(i, dataGroupTemp[i]);
                    _topstringContent = _topstringContent + RenderMenuDesktop_Topeach(i, dataGroupTemp[i]);

                }
            }
            else {
                return;
            }
        }
        myNode.innerHTML = stringContent;
        myNodeTop.innerHTML = _topstringContent;
    }

    if (typeof Checking_TabControl_Permission === 'function') Checking_TabControl_Permission();
    if (typeof ChangeLan_Menu_NotMutaion == 'function') ChangeLan_Menu_NotMutaion();
    if (typeof Master_EventAddCustomer == 'function') Master_EventAddCustomer();
    Render_EventHide();
}
function RenderMenuDesktop_each(i, _data) {
    let result = '';
    for (let ii = 0; ii < _data.length; ii++) {
        let item = _data[ii];
        result = result + `<li class="nav-item ">
                        <a id="${item.MenuIDText !== "" ? item.MenuIDText : ""}" data-name="${item.MenuText}" data-tab="${item.MenuTab}" class="my-1 mx-0 nav-link _tab_control_ menudesktop_render" href="${item.MenuURL}">
                            <span class="sidenav-mini-icon">${(Outlang[item.MenuTextLangKey] !== undefined ? Outlang[item.MenuTextLangKey]?.charAt(0) : "")}</span>
                            <h6 class="sidenav-normal text-sm mb-0">${(Outlang[item.MenuTextLangKey] !== undefined ? Outlang[item.MenuTextLangKey] : item.MenuText)}</h6>
                        </a>
                    </li>`;
    }
    let menuname = 'menumain' + i;
    let textGroup = Outlang[_data[0].GroupTextLangKey] != undefined ? Outlang[_data[0].GroupTextLangKey] : _data[0].GroupText;
    result = `<li class="nav-item">
                <a data-bs-toggle="collapse" href="#${menuname}" class="ps-1 nav-link menuparent_render" aria-controls="${menuname}" role="button"
                   aria-expanded="false">
                    <div class="icon iconmenu p-1 icon-shape icon-sm border-radius-md text-center d-flex align-items-center justify-content-center"
                    style="-webkit-mask-image: url(/icon/${_data[0].GroupImage});
                            mask-image: url(/icon/${_data[0].GroupImage});
                            -webkit-mask: url(/icon/${_data[0].GroupImage}) no-repeat 50% 50%;
                            mask: url(/icon/${_data[0].GroupImage}) no-repeat 50% 50%;
                    ">

                    </div>
                    <h6 class=" mb-0 text-sm nav-link-text ms-2">${textGroup}</h6>
                </a>
                <div class="collapsesticky collapse" id="${menuname}">
                    <ul class="nav ms-4 ps-3 mt-2 bg-transparent" data-name="${textGroup}">
                        ${result}
                    </ul>
                </div>
            </li>`;
    return result;
}
function RenderMenuDesktop_Topeach(i, _data) {
    let result_sm = '';
    let result_lg = '';
    for (let ii = 0; ii < _data.length; ii++) {
        let item = _data[ii];
        result_lg = result_lg
            + `  <li class="nav-item dropdown dropdown-hover dropdown-subitem list-group-item border-0 p-0">
                    <a  id="${item.MenuIDText !== "" ? item.MenuIDText : ""}" data-name="${item.MenuText}" data-tab="${item.MenuTab}" class="my-1 dropdown-item py-2 ps-3 border-radius-md mx-0 nav-link _tab_control_ menudesktop_render" href="${item.MenuURL}">
                        <div class="d-flex">
                            <div class="w-100 d-flex align-items-center ">
                                <i class="fas fa-circle" ></i>
                                <p class="dropdown-header text-dark p-0">${(Outlang[item.MenuTextLangKey] !== undefined ? Outlang[item.MenuTextLangKey] : item.MenuText)}</p>
                            </div>
                        </div>
                    </a>
                </li>`;
        result_sm = result_sm
            + `    <a id="${item.MenuIDText !== "" ? item.MenuIDText : ""}" class="py-2 ps-3 border-radius-md" href="${item.MenuURL}">
                    <div class="d-flex">
                        <div class="w-100 d-flex align-items-center justify-content-between">
                            <div class="w-100 d-flex align-items-center ps-3">
                                <i class="fas fa-circle" ></i>
                                <p class="dropdown-header text-dark p-0">${(Outlang[item.MenuTextLangKey] !== undefined ? Outlang[item.MenuTextLangKey] : item.MenuText)}</p>
                            </div>
                        </div>
                    </div>
                </a>`;
    }

    let menuname = 'menumain' + i;
    let textGroup = Outlang[_data[0].GroupTextLangKey] != undefined ? Outlang[_data[0].GroupTextLangKey] : _data[0].GroupText;
    let result
        = `<li class="nav-item dropdown dropdown-hover mx-2">
                <a role="button" href="#${menuname}" class="nav-link ps-2 d-flex justify-content-between cursor-pointer align-items-center " id="${menuname}" data-bs-toggle="dropdown" aria-expanded="false">
                    ${textGroup}
                    <i class="fas fa-angle-down arrow ms-1 d-lg-block d-none"></i>
                    <i class="fas fa-angle-down arrow ms-1 d-lg-none d-block"></i>

                </a>
                <div class="dropdown-menu dropdown-menu-animation dropdown-md overflow-hidden dropdown-md-responsive p-3 border-radius-lg mt-0" aria-labelledby="${menuname}">
                    <div class="d-none d-lg-block">
                        <ul class="list-group" data-name="${textGroup}">
                             ${result_lg}
                        </ul>
                    </div>
                    <div class="row d-lg-none">
                       <div class="col-md-12">
                            ${result_sm}
                        </div>
                    </div>
                </div>
            </li>`;


    return result;
}
function Render_EventHide() {
    $('#menuDesktopCategory .menuparent_render').on('click', function () {
        $('#menuDesktopCategory .collapse').collapse('hide');
    })
}
var groupBy = function (xs, key) {
    return xs.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
};
//#endregion

//#region  Service , Gender
function Render_Gender_Person(data, id, _name) {

    var myNode = document.getElementById(id);
    if (myNode != null) {
        myNode.innerHTML = "";
        let stringContent = "";
        if (data && data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                let item = data[i];
                let tr = "";
                let __name = _name + item.ID;
                //let __check = (i == 1) ? 'checked = "checked"' : '';
                let __check = '';
                tr = '<div class="form-check pr-2">'
                    + '<input class="form-check-input pr-2" type="radio" name="' + _name + '" value="' + item.ID + '" id="' + __name + '" ' + __check + '>'
                    + '<label style="margin-right: 14px;" class="custom-control-label mb-0" for="' + __name + '">' + (Outlang[item.NameLangKey] != undefined ? Outlang[item.NameLangKey] : item.Name) + '</label>'
                    + '</div>';

                stringContent = stringContent + tr;
            }
        }
        document.getElementById(id).innerHTML = stringContent;
    }
}
function Render_Customer_Service_Price(min, max) {
    if (min == max)
        return formatNumber(min);
    else
        return (
            formatNumber(min) + "&nbsp~&nbsp" + formatNumber(max)
        );
}
function Render_Customer_Service_Combo_Div(dataser, data, id) {
    var myNode = document.getElementById(id);
    if (myNode != null) {
        myNode.innerHTML = "";
        let stringContent = "";
        if (data && data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                let item = data[i];
                let ser = '';
                let services = Fun_GetArray_ByJson(dataser, item.ListService);
                for (let i = 0; i < services.length; i++) {
                    ser = ser + '<span class="badge badge-md bg-primary  m-1">' + services[i] + '</span>';
                }
                let tr = '<td class="vt-number-order"></td>'
                    + '<td>' + '<span class="seachRowComboServicediv">' + item.ComboName + '</span>' + '</td>'
                    + '<td class="text-wrap">' + ser + '</td>';

                stringContent = stringContent + '<tr role="row" data-value=' + item.ID + ' class="vt-number rowcombotabservice ">' + tr + '</tr>';
            }
        }
        document.getElementById(id).innerHTML = stringContent;
    }
}
function Render_Customer_Service_Div_From_Combo(data, datafromcombo, id) {

    var myNode = document.getElementById(id);
    if (myNode != null) {
        myNode.innerHTML = "";
        let stringContent = "";
        if (data && data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                let item = data[i];
                let tr = "";
                let discount = '', price = '', timestreat = '';
                let numper = 0, numamount = 0, numtimetreat = 0, numquan = 0;
                let itemcombo = datafromcombo[item.ID];
                if (itemcombo.Times != undefined && itemcombo.Times != 0) {
                    timestreat = `<span class="ps-2  text-dark">x ${formatNumber(itemcombo.Times)} ${Outlang["Lan_dieu_tri"]}</span>`;
                    numtimetreat = itemcombo.Times;
                }
                if (itemcombo.Quantity != undefined && itemcombo.Quantity != 0) {
                    numquan = itemcombo.Quantity;
                }
                //if (itemcombo.Price != undefined && itemcombo.Price != 0) {
                //    price = `<span class="ps-2 fw-bold text-dark">${formatNumber(itemcombo.Price)}</span>`;
                //}
                if (itemcombo.Amount != undefined && itemcombo.Amount != 0) {
                    discount = `<span class="ps-2 text-dark">- ${formatNumber(itemcombo.Amount)}</span>`;
                    numamount = itemcombo.Amount;
                }
                else {
                    if (itemcombo.Percent != undefined && itemcombo.Percent != 0) {
                        discount = `<span class="ps-2 text-dark">- ${formatNumber(itemcombo.Percent)}%</span>`;
                        numper = itemcombo.Percent;
                    }
                }
                tr = `<td class="vt-number-order"></td>
                     <td>
                        <a class="seachRowServicediv border-bottom cursor-pointer">${item.Name}</a>
                        ${discount}
                        ${timestreat}
                     </td>`
                stringContent = stringContent + `<tr role="row" data-value="${item.ID}"
                    data-percent="${numper}"
                    data-amount="${numamount}"
                    data-quantity="${numquan}"
                    data-times="${numtimetreat}" class="vt-number rowCombotabservice ">` + tr + `</tr>`;
            }
        }
        document.getElementById(id).innerHTML = stringContent;

    }

}
async function Render_Customer_Service_Div(_selectedid, data, id) {
    new Promise((resolve, reject) => {
        var myNode = document.getElementById(id);
        if (myNode != null) {
            myNode.innerHTML = "";
            let stringContent = "";
            if (data && data.length > 0) {
                let trselected = "";
                for (let i = 0; i < data.length; i++) {
                    let item = data[i];
                    let tr = "";
                    let serunit = '', serindex = '';
                    let serinstall = (Number(item.IsInstallment) == 1)
                        ? (`<i class="fas fa-exclamation text-success pe-2" title="${Outlang["Sys_tra_gop"]}"></i>`) : '';
                    if (item.UnitName != '') serunit = `<span class="fw-6 text-dark text-lowercase">${item.UnitName}</span>`;
                    if (item.UnitType != '') serindex = `<span class="fw-6 text-dark text-lowercase">${item.TimeToTreatment} ${Outlang['Lan']}</span>`;

                    let serprice = Render_Customer_Service_Price(item.Price, item.Price_Max);

                    if (Number(sys_dencos_Main) == 1) {
                        tr = `<td class="vt-number-order "></td>
                             <td data-name="serimage" class="text-wrap"> 
                                <div class="justify-content-center d-flex">
                                    <img class="avatar avatar-lg m-0"src="${item.Avatar}" alt="label-image" onerror="Master_OnLoad_Error_Image(this)">
                                </div>
                             </td>
                             <td class="text-wrap seachRowServicediv"> 
                                <div>
                                    <span class="text-primary fw-bold sys_previewTooltips  border-bottom "  data-preview-id="${item.ID}" data-preview-type="vttservice" >${item.Service_Code}</span>
                                    <span>${item.Name}</span>
                                </div>
                             </td>
                             <td class="text-wrap">${serunit}</td>
                             <td class="text-wrap">
                                <div class="d-flex align-items-center">
                                    ${serinstall}
                                    <span>${serprice}</span>
                                  </div>
                              </td>`;
                    }
                    else {
                        tr = `<td class="vt-number-order"></td>
                             <td data-name="serimage" class="text-wrap">
                                <div class="justify-content-center d-flex">
                                    <img class="avatar avatar-lg m-0" src="${item.Avatar}" alt="label-image" onerror="Master_OnLoad_Error_Image(this)">
                                </div>
                             </td>
                             <td class="text-wrap seachRowServicediv"> 
                                <div>
                                    <span class="text-primary fw-bold sys_previewTooltips  border-bottom "  data-preview-id="${item.ID}" data-preview-type="vttservice" >${item.Service_Code}</span>
                                    <span>${item.Name}</span>
                                </div>
                             </td>
                             <td class="text-wrap">
                                ${serunit}
                                ${serindex}
                             </td>
                             <td class="text-wrap">
                                <div class="d-flex align-items-center">
                                    ${serinstall}
                                    <span>${serprice}</span>
                                  </div>
                              </td>`;

                    }
                    if (Number(item.ID) == _selectedid) {
                        trselected =
                            `<tr role="row" data-value=${item.ID} class="vt-number rowtabselected rowtabservice">${tr}</tr>`;
                    } else {
                        stringContent = stringContent + `
                        <tr role="row"
                            data-name="${Remove_Char_Tiny_Useless(xoa_dau(item.Name))?.toLowerCase()?.replace(/[^a-zA-Z0-9 ]/g, '')}"
                            data-name-other="${Remove_Char_Tiny_Useless(xoa_dau(item.NameOther))?.toLowerCase()?.replace(/[^a-zA-Z0-9 ]/g, '')}"
                            data-code="${item.Service_Code}"
                            data-shortname="${item.ShortName}"
                            data-value="${item.ID}"
                            class="type_${item.CatID} vt-number rowtabservice">
                            ${tr}
                        </tr>
                        `
                    }
                }
                stringContent = trselected + stringContent;
            }
            myNode.innerHTML = stringContent;
            Tab_Multi_shtable.Refresh();
            ToolPopper_PreviewDetail();
        }
        resolve();
    });
}


function Render_Customer_Service(data, id) {
    var myNode = document.getElementById(id);
    if (myNode != null) {
        myNode.innerHTML = "";
        let stringContent = "";
        if (data && data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                let item = data[i];
                let tr = "";

                if (Number(sys_dencos_Main) == 1 || Number(item.IsProduct) == 0) {
                    tr =
                        '<div class="item seachRowService" data-value=' + item.ID + ">"
                        + '<span>' + item.Name + '</span>'
                        + '<span class="ps-2">' + Render_Customer_Service_Price(item.Price, item.Price_Max) + '</span>'

                        + '</div>';
                } else {
                    tr =
                        '<div class="item seachRowService" data-value=' + item.ID + '>'
                        + '<span>' + item.Name + '</span>'
                        + '<span class="ps-2">' + Render_Customer_Service_Price(item.Price, item.Price_Max) + '</span>'
                        + '</div>';
                }
                stringContent = stringContent + tr;
            }
        }
        myNode.innerHTML = stringContent;
    }
}
//function Render_Customer_Treatment(datateeth, data, id) {
//    var myNode = document.getElementById(id);
//    if (myNode != null) {
//        myNode.innerHTML = "";
//        let stringContent = "";
//        if (data && data.length > 0) {
//            for (var i = 0; i < data.length; i++) {
//                let item = data[i];
//                let tr = "";

//                if (Number(sys_dencos_Main) == 1) {
//                    tr =
//                        '<div class="item seachRowTreatment" data-value=' +
//                        item.ID +
//                        ">" +
//                        '<div class="ellipsis_one_line"><span class="_cus_treat_per ms-2 fw-bold">[ ' +
//                        item.Percent_Complete +
//                        " % ]</span>" +
//                        '<span class="_cus_treat_name">' +
//                        item.Name +
//                        "</span></div><br/>" +
//                        '<span class="_cus_treat_date">' +
//                        item.DateCreated +
//                        "</span>" +
//                        (Fun_GetTeeth_ByToken(datateeth, item.Teeth, item.TeethType) != ""
//                            ? ' - <span class="_cus_treat_teeth">' +
//                            Fun_GetTeeth_ByToken(datateeth, item.Teeth, item.TeethType) +
//                            "</span>"
//                            : "") +
//                        '<i class="angle double right icon"></i>' +
//                        "</div>";
//                } else {
//                    tr =
//                        '<div class="item seachRowTreatment" data-value=' +
//                        item.ID +
//                        ">" +
//                        '<span class="_cus_treat_name">' +
//                        item.Name +
//                        "</span>" +
//                        '<span class="_cus_treat_per ms-2 fw-bold">[ ' +
//                        item.TimeTreat +
//                        " | " +
//                        item.TimeToTreat +
//                        " ]</span><br/>" +
//                        '<span class="_cus_treat_date">' +
//                        item.DateCreated +
//                        "</span>" +
//                        '<i class="angle double right icon"></i>' +
//                        "</div>";
//                }
//                stringContent = stringContent + tr;
//            }
//        }
//        document.getElementById(id).innerHTML = stringContent;
//    }
//}
function Render_Customer_Labo(datateeth, data, id) {
    var myNode = document.getElementById(id);
    if (myNode != null) {
        myNode.innerHTML = "";
        let stringContent = "";
        if (data && data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                let item = data[i];
                let tr = "";
                //<div class="_cus_treat_teeth">
                //            ${Fun_GetTeeth_ByToken(datateeth, item.TeethChoosing, item.TeethType)}
                //        </div>
                tr =
                    `
                    <div class="item seachRowLabo" data-value=${item.ID}>
                        <span class="ms-2 text-primary">
                            ${item.Name} <span class="ps-2 fw-bold">${item.Percent_Complete} %</span>
                            <span class="ms-2 text-dark">
                                 ${item.DateCreated}
                            </span>
                        </span>


                    </div>
                    `;
                stringContent = stringContent + tr;
            }
        }
        myNode.innerHTML = stringContent;
    }
}
function Render_Service_Type(data, id) {
    var myNode = document.getElementById(id);
    if (myNode != null) {
        myNode.innerHTML = "";
        let stringContent = "";
        if (data && data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                let item = data[i];
                let tr =
                    '<div class="item seachRowServiceType" data-value=' + item.ID + ">"
                    + '<span class="_cus_sertype_name">' + item.Name + "</span>"
                    + '<span class="_cus_sertype_unit">[ '
                    + item.ServiceNum + " ]</span>"
                    + (Number(item.IsProduct) == 1
                        ? '<span class="_cus_sertype_product">[ ' + "PR" + " ]</span>"
                        : "")
                    + "</div>";
                stringContent = stringContent + tr;
            }
        }
        document.getElementById(id).innerHTML = stringContent;
    }
}

//#endregion

//#region Render Button collapse
function Render_Button_Grid(buttons) {
    let numbercollap = 2;
    let result = '';
    if (buttons != undefined && buttons.length >= numbercollap) {
        let idrandom = 'col' + (new Date()).getTime() + RandomNumber();
        result = '<div class="text-center ">'
            + '<i class="position-relative vtt-icon  vttech-icon-dot " data-bs-toggle="collapse" href="#' + idrandom + '">'
            + ' <div class="vttcollapse buttonGridcol rounded-3 bg-body collapse-horizontal rounded p-2 position-absolute" id="' + idrandom + '">'
            ;

        $.each(buttons, function (index, value) {
            result = result + value;
        });
        result = result + '</div></i></div>';
    }
    else {
        result = '<div class="text-center ">'
        $.each(buttons, function (index, value) {
            result = result + value;
        });
        result = result + '</div>';
    }
    return result;
}
//#endregion

//#region  Render block
var Render_timeOutBlock = {};

async function fnRenderBlock(data, id, blocknum, fnrender, fnsuccess, fnbegin) {
    try {
        let _dataroot;
        if (typeof data == 'object') {
            _dataroot = Object.keys(data)
                .map(function (key) {
                    return data[key];
                });
        } else {
            _dataroot = data;
        }
        let _data = JSON.parse(JSON.stringify(_dataroot));
        if (typeof fnbegin === 'function') fnbegin();
        new Promise((resolve, reject) => {
            if (Render_timeOutBlock[id] && Render_timeOutBlock[id].length != 0) {
                Render_timeOutBlock[id].forEach(clearTimeout);
                delete Render_timeOutBlock[id]
            }
            var promises = [];
            let array = sliceIntoChunks(_data, blocknum);
            if (array != undefined && array.length != 0) fnrender(array[0], id)
            for (var i = 1; i < array.length; i++) {
                promises.push(fnRenderBlock_Each(fnrender, array[i], id));
            }
            Promise.all(promises).then(() => {
                delete Render_timeOutBlock[id];
                if (typeof fnsuccess === 'function') fnsuccess();
            })

            resolve();
        });
    }
    catch (e) {

    }
}
async function fnRenderBlock_Each(fnrender, data, id) {
    new Promise((resolve, reject) => {
        if (typeof Render_timeOutBlock[id] === 'undefined') Render_timeOutBlock[id] = [];
        Render_timeOutBlock[id].push(
            setTimeout(() => {
                fnrender(data, id);
                resolve();
            }, 200)
        );
    });
}
async function fnRenderArray(data, id, index, fnrender, fnsuccess, fnbegin) {
    if (typeof fnbegin === 'function') fnbegin();
    return new Promise((resolve, reject) => {
        fnrender(data[index], id);
        index = index + 1;
        if (typeof fnsuccess === 'function') fnsuccess();
        resolve(index);
    });
}
function sliceIntoChunks(myArray, chunk_size) {
    try {

        var results = [];

        while (myArray.length) {
            results.push(myArray.splice(0, chunk_size));
        }

        return results;
    }
    catch (ex) {
        return [];
    }
}
//#endregion

function fn_RenderForm(parent, elements, isholder) {

    if (elements != undefined && Object.keys(elements).length != 0) {
        for ([key, value] of Object.entries(elements)) {
            let idrandom;
            if (value.random == undefined) {
                let time = (new Date()).getTime();
                idrandom = time.toString() + RandomNumber().toString();
                value.random = idrandom;
            } else idrandom = value.random;

            let obj;
            obj = fn_RenderFormElement(value.type, value.class, value.style, value.value, value.name, value.id, value.isrepeat
                , value.ismanual, value.isqr, value.issign ?? "0", value.domainimg ?? "", value.formlinkID, value.isprivate, value.typewhole, value.text, idrandom, value.col, isholder
                , value.isboxed, value.totalbox, value.stylebox, value.dyntype
                , value.dashedline, value.minrow ?? "", value.rendergroup, value.format ?? "", value.stylechild

            );
            fn_RenderForm(obj, value.child, isholder);
            if (obj != null && parent != undefined) {
                parent.appendChild(obj);
            }
        }
    }
}
function fn_RenderFormElement(type, classname, style, value, name, id, isrepeat, ismanual, isqr, issign, domainimg, formlinkid
    , isprivate, typewhole, text, idrandom, col, isholder, isboxed, totalbox, stylebox, dyntype
    , dashedline, minrow,rendergroup, format, stylechild
) {
    let p;

    switch (type) {
        case 'teethchild':
        case 'teethadult':
        case 'row':
        case 'col':
            {

                p = document.createElement('div');
                p.id = idrandom;
                p.style.cssText = style;
                p.setAttribute("tabindex", 0);
                p.setAttribute("dataid", id);
                p.setAttribute("class", 'design ' + classname);
                p.setAttribute("datatype", type);
                p.setAttribute("datavalue", value);
                if (isrepeat == 'true' || isrepeat == true) p.setAttribute("datarepeat", true);
                if (typewhole == '1' || typewhole == 1) p.setAttribute("header", true);
                if (dyntype != undefined && dyntype != "") p.setAttribute("dyntype", dyntype);
                if (isholder == true) {
                    if (isrepeat == 'true' || isrepeat == true) {
                        let repeat = document.createElement('p');
                        repeat.setAttribute("class", 'repeatclass pb-0 mb-0 text-xs text-danger');
                        repeat.innerHTML = 'Repeat div';
                        p.appendChild(repeat);
                    }
                }
                if (type == 'teethchild' || type == 'teethadult') {
                    p.setAttribute("data-bs-toggle", "tooltip");
                    p.setAttribute("data-bs-placement", "top");
                    p.setAttribute("data-bs-original-title", type);
                }
                break;
            }
        case 'imagepick':
            {

                p = document.createElement('div');
                p.id = idrandom;
                p.style.cssText = style;
                p.setAttribute("tabindex", 0);
                p.setAttribute("dataid", id);
                p.setAttribute("class", 'design ' + classname);
                p.setAttribute("datatype", type);
                p.setAttribute("datavalue", value);
                p.setAttribute("pickimage", idrandom);

                let btn_pick = document.createElement('a');
                btn_pick.setAttribute("pickimage", idrandom);
                btn_pick.setAttribute("class", 'design w-auto border-bottom text-bold');

                btn_pick.innerHTML = Outlang["Sys_hinh_anh2"];
                p.appendChild(btn_pick);

                let area_pick = document.createElement('div');
                area_pick.setAttribute("class", 'border border-1 min-vh-25 rounded-3 bg-gray-200');

                area_pick.setAttribute("pickimage", idrandom);
                area_pick.style.cssText = stylechild;
                if (isholder == true) {
                    let pretext = document.createElement('div');
                    pretext.setAttribute("class", 'd-flex justify-content-center align-items-center w-100 fs-6');
                    pretext.innerHTML = "image here";
                    area_pick.appendChild(pretext);
                }
                p.appendChild(area_pick);

                break;
            }
        case 'pagebreak':
            {
                p = document.createElement('div');
                p.id = idrandom;
                p.style.cssText = style;
                p.setAttribute("tabindex", 0);
                p.setAttribute("dataid", id);
                p.setAttribute("class", classname);
                p.setAttribute("datatype", type);
                break;
            }
        case 'textarea':
        case 'input':
            {
                p = document.createElement(type);
                p.id = idrandom;
                p.style.cssText = style;
                p.setAttribute("tabindex", 0);
                p.setAttribute("dataid", id);




                p.setAttribute("datatype", type);
                if (dyntype != undefined && dyntype != "") p.setAttribute("dyntype", dyntype);
                p.value = value;
                if (id != "") {
                    p.setAttribute("data-bs-toggle", "tooltip");
                    p.setAttribute("data-bs-placement", "top");
                    p.setAttribute("data-bs-original-title", id);
                }

                if (isholder == true) {
                    p.readOnly = true;
                    if (dashedline == 1) {
                        p.value = p.value + '{ using dashline }';
                    }
                }

                if (dashedline == 1 && type == "textarea") {
                    p.setAttribute("class", 'design position-absolute w-100 h-100 vt-area ' + classname);
                    p.setAttribute("data-dash", idrandom);

                    let dashcon = document.createElement('div');
                    dashcon.setAttribute("data-dash", idrandom);
                    dashcon.setAttribute("class", 'position-relative m-0 p-0 dashcon overflow-hidden');
                    dashcon.appendChild(p);
                    p = dashcon;
                }
                else {
                    p.setAttribute("class", 'design ' + classname);

                }

                break;
            }
        case 'label':
            {
                p = document.createElement('label');
                p.id = idrandom;
                p.style.cssText = style;
                p.setAttribute("tabindex", 0);
                p.setAttribute("dataid", id);
                p.setAttribute("class", 'design ' + classname);
                p.setAttribute("datatype", type);
                p.setAttribute("dataqr", isqr != undefined ? isqr : 0);
                if (isqr == 2) p.setAttribute("datalinkform", formlinkid != undefined ? formlinkid : 0);
                p.setAttribute("dataprivate", isprivate != undefined ? isprivate : false);
                p.setAttribute("datamanual", ismanual != undefined ? ismanual : false);
                p.setAttribute("dataisboxed", isboxed != undefined ? isboxed : "0");
                p.setAttribute("datatotalbox", isboxed != undefined ? totalbox : "");
                p.setAttribute("datastylebox", isboxed != undefined ? stylebox : "");
                p.setAttribute("dataformat", format != undefined ? format : "");
                p.setAttribute("datadomaindefault", domainimg ?? "");
                if (dyntype != undefined && dyntype != "") p.setAttribute("dyntype", dyntype);
                switch (value) {

                    case "sys_username":
                        p.innerHTML = sys_userName_Main != undefined ? sys_userName_Main : value;
                        break;
                    case "sys_empname":
                        p.innerHTML = sys_employeeName_Main != undefined ? sys_employeeName_Main : value;
                        break;

                    case "sys_currentdate":
                        p.innerHTML = SysDate().FNOW().DateText() !== 'undefined' ? SysDate().FNOW().DateText() : value;
                        break;
                    default:
                        p.innerHTML = value;
                        break;
                }
                let _str = '';
                if (isboxed && isboxed == "1" && totalbox > 0) {
                    for (let i = 0; i < totalbox; i++) {
                        _str += `<label class="m-0 bg-transparent text-center border border-1" style="min-width:23px; height:23px;${stylebox}"></label>`
                    }
                    p.innerHTML = _str;
                }
                if (isholder == true) {
                    if (isboxed && isboxed == "1") {
                        let _value = id;
                        _value = _value == '' ? value : '#' + _value;
                        _value = _value.trim().replaceAll(" ", "");
                        let _arrValue = _value != '' ? _value.toString().split('') : [];
                        let _str = '';
                        let _count = totalbox && totalbox > _arrValue.length ? totalbox : _arrValue.length;
                        for (let i = 0; i < _count; i++) {
                            _str += `<label class="m-0 bg-transparent text-center border border-1" style="min-width:23px; height:23px;${stylebox}">${_arrValue[i] ?? ""}</label>`
                        }
                        p.innerHTML = _str;
                    }
                    else {
                        let hod = document.createElement('span');
                        hod.innerHTML = (id != '') ? ('#' + id) : '';
                        p.appendChild(hod);
                    }

                    if (id != "") {
                        p.setAttribute("data-bs-toggle", "tooltip");
                        p.setAttribute("data-bs-placement", "top");
                        p.setAttribute("data-bs-original-title", id);

                    }
                    if (format != "") {
                        p.innerHTML = p.innerHTML + '{' + format + '}';
                    }
                }

                break;
            }
        case 'iframe':
            {

                p = document.createElement('iframe');
                p.id = idrandom;
                p.style.cssText = style;
                p.setAttribute("dataid", id);
                p.setAttribute("tabindex", 0);
                p.setAttribute("class", 'design ' + classname);
                p.setAttribute("datatype", type);
                p.src = value;
                if (id != "") {

                    p.setAttribute("data-bs-toggle", "tooltip");
                    p.setAttribute("data-bs-placement", "top");
                    p.setAttribute("data-bs-original-title", id);
                }

                break;
            }
        case 'img':
            {
                p = document.createElement('img');
                p.id = idrandom;
                p.style.cssText = style;
                p.setAttribute("dataid", id);
                p.setAttribute("tabindex", 0);
                p.setAttribute("class", 'design ' + classname);
                p.setAttribute("datatype", type);
                p.setAttribute("datasign", issign);
                p.setAttribute("datadomaindefault", domainimg ?? "");
                p.src = value;
                if (id != "") {

                    p.setAttribute("data-bs-toggle", "tooltip");
                    p.setAttribute("data-bs-placement", "top");
                    p.setAttribute("data-bs-original-title", id);
                }
                if (issign && issign != '' && issign != '0' && (isholder != true)) {
                    p.addEventListener('click', function () {
                        fn_print_sign(p, '');
                    })
                }
                break;
            }
        case 'radio':
            {
                p = document.createElement('div');
                p.setAttribute("tabindex", 0);
                p.setAttribute("class", 'w-auto form-check');
                let pc = document.createElement('input');
                pc.setAttribute("type", "radio");
                pc.id = idrandom;
                pc.style.cssText = style;
                pc.setAttribute("dataid", id);
                pc.setAttribute("name", name);
                pc.setAttribute("class", 'design ' + classname);
                pc.setAttribute("datatype", type);
                pc.checked = (value == true || value == 'on');
                p.appendChild(pc);
                if (text != "") {
                    let pt = document.createElement('label');
                    pt.setAttribute("class", 'form-check-label my-0 py-0');
                    pt.innerHTML = text;
                    p.appendChild(pt);
                }
                if (id != "") {

                    pc.setAttribute("data-bs-toggle", "tooltip");
                    pc.setAttribute("data-bs-placement", "top");
                    pc.setAttribute("data-bs-original-title", id);
                }
                break;
            }
        case 'checkbox':
            {
                p = document.createElement('div');
                p.setAttribute("tabindex", 0);
                p.setAttribute("class", 'pb-0 mb-0 w-auto form-check');
                let pc = document.createElement('input');
                pc.setAttribute("type", "checkbox");
                pc.id = idrandom;
                pc.style.cssText = style;
                pc.setAttribute("dataid", id);
                pc.setAttribute("class", 'design ' + classname);
                pc.setAttribute("datatype", type);
                if (dyntype != undefined && dyntype != "") pc.setAttribute("dyntype", dyntype);
                pc.checked = (value == true || value == 'true');
                p.appendChild(pc);
                if (text != "") {
                    let pt = document.createElement('label');
                    pt.innerHTML = text;
                    pt.setAttribute("class", 'text-dark fw-normal mb-0 pb-0 text-sm ');
                    pt.setAttribute("for", idrandom ?? "");
                    p.appendChild(pt);
                }
                if (id != "") {

                    pc.setAttribute("data-bs-toggle", "tooltip");
                    pc.setAttribute("data-bs-placement", "top");
                    pc.setAttribute("data-bs-original-title", id);
                }
                break;
            }
        case 'text':
            {
                p = document.createElement('span');
                p.setAttribute("tabindex", 0);
                p.style.cssText = style;
                p.setAttribute("class", 'design ' + classname);
                if (dyntype != undefined && dyntype != "") p.setAttribute("dyntype", dyntype);
                p.id = idrandom;
                p.setAttribute("dataid", id);
                p.innerHTML = value;
                if (id != "") {

                    p.setAttribute("data-bs-toggle", "tooltip");
                    p.setAttribute("data-bs-placement", "top");
                    p.setAttribute("data-bs-original-title", id);
                }
                break;
            }
        case 'tableexcel': {
            p = fn_RenderFormTableExcel(idrandom, id, type, value, classname, style, col, isholder,rendergroup);
            break;
        }
        case 'table': {
            p = fn_RenderFormTable(idrandom, id, type, value, classname, style, col, minrow,rendergroup, isholder);
            break;
        }
    }
    if (p != undefined) return p;
    return null;
}


function fn_RenderFormTableExcel(idrandom, id, type, value, classname, style, tr, isholder) {
    let table = document.createElement('table');
    table.setAttribute("class", 'design ' + classname);
    table.setAttribute("dataid", id);
    table.style.cssText = style;
    table.setAttribute("datatype", type);
    table.id = idrandom;
    if (isholder == true) {
        let _add = document.createElement('i');
        _add.setAttribute("class", 'fas fa-plus addrow  position-absolute top-0 start-100 translate-middle');
        table.appendChild(_add);
    }
    let tbody = document.createElement('tbody');
    let thead = document.createElement('thead');
    for ([key, value] of Object.entries(tr)) {
        let _tr = document.createElement('tr');
        _tr.setAttribute("datatype", 'tr');

        _tr = fn_ConvertStyletr(_tr, value.style);
        _tr.setAttribute("id", value.id);
        if (isholder == true) {
            let _addtr = document.createElement('i');
            _addtr.setAttribute("class", 'fas fa-plus addtd ');
            _tr.appendChild(_addtr);
        }

        if (Object.keys(value.td).length !== 0) {
            for ([_key, _value] of Object.entries(value.td)) {
                let _td = document.createElement('td');
                _td.setAttribute("dataid", _value.id);
                _td.setAttribute("datatype", 'td');
                if (_value.rowspan != undefined && _value.rowspan != "0") _td.setAttribute("rowspan", _value.rowspan);
                if (_value.colspan != undefined && _value.colspan != "0") _td.setAttribute("colspan", _value.colspan);
                _td.setAttribute("style", _value.style);
                _td = fn_ConvertStyletd(_td, _value.style);
                _td.setAttribute("datamanual", _value.ismanual != undefined ? _value.ismanual : false);
                _td.setAttribute("id", _value.random);

                _td.innerHTML = _value.text;
                if (isholder == true && _value.id != "" && _value.id != _value.random) {
                    let hod = document.createElement('span');
                    hod.innerHTML = (_value.id != '') ? ('#' + _value.id) : '';
                    _td.appendChild(hod);
                    _td.setAttribute("data-bs-toggle", "tooltip");
                    _td.setAttribute("data-bs-placement", "top");
                    _td.setAttribute("data-bs-original-title", _value.id);
                }

                let imagelink = _value.image;

                if (imagelink != undefined && imagelink != "") {
                    _td.setAttribute("datalink", imagelink);
                    let _img = document.createElement('img');
                    _img.src = imagelink;
                    _td.appendChild(_img);
                }
                _tr.appendChild(_td);
            }
        }
        tbody.appendChild(_tr);


    }
    if (isholder == true) table.appendChild(thead);
    table.appendChild(tbody);
    return table;
}
function fn_RenderFormTable(idrandom, id, type, value, classname, style, cols, minrow,rendergroup, isholder) {
    let table = document.createElement('table');
    table.setAttribute("class", 'design ' + classname);
    table.setAttribute("dataid", id);
    table.setAttribute("minrow", minrow);
    table.setAttribute("rendergroup", rendergroup);
    table.setAttribute("datavalue", value);
    table.style.cssText = style;
    table.setAttribute("datatype", type);
    table.id = idrandom;
    let thead = document.createElement('thead');
    let tbody = document.createElement('tbody');
    let tfoot = document.createElement('tfoot');
    let _row = document.createElement('tr');
    let _rowfooter = document.createElement('tr');
    for ([key, value] of Object.entries(cols)) {
        let _heading = document.createElement('th');
        _heading.innerHTML = value.text;
        _heading.setAttribute("dataindex", key);
        _heading.setAttribute("dataid", value.id);
        _heading.setAttribute("tabindex", 0);
        _heading.setAttribute("classtd", value.classtd);
        _heading.setAttribute("class", value.class);
        _heading.setAttribute("datastyle", value.style);
        _heading.setAttribute("datastyletd", value.styletd);
        _heading.setAttribute("datamanual", value.ismanual != undefined ? value.ismanual : false);
        _row.appendChild(_heading);

        if (value.style !== undefined) {
            _heading.setAttribute("style", value.style);
            _heading = fn_ConvertStyletd(_heading, value.style);
        }
        let _ftd = document.createElement('td');
        if (value.footerspan != undefined && value.footerspan != "0" && Number(value.footerspan) != 0) {
            _ftd.innerHTML = value.footertext != undefined ? value.footertext : '';
            _ftd.setAttribute("class", 'footer ' + (value.footerclass != undefined ? value.footerclass : ''));
            _ftd.setAttribute("dataid", value.footerid != undefined ? value.footerid : '');
            _ftd.setAttribute("datamanual", value.ismanual != undefined ? value.ismanual : false);
            _ftd.setAttribute("datatype", "td");
            _ftd.colSpan = value.footerspan != undefined ? value.footerspan : '0';
            if (isholder == true) {
                if (value.footerid != "" && value.footerid != undefined) {
                    _ftd.innerHTML = value.footerid + _ftd.innerHTML;
                    _ftd.setAttribute("data-bs-toggle", "tooltip");
                    _ftd.setAttribute("data-bs-placement", "top");
                    _ftd.setAttribute("data-bs-original-title", value.footerid);
                }
            }
            _rowfooter.appendChild(_ftd);
        }
    }
    thead.appendChild(_row);
    tfoot.appendChild(_rowfooter);
    if (isholder == true) {
        let _add = document.createElement('i');
        _add.setAttribute("class", 'fas fa-plus addcol  position-absolute top-50 end-0 translate-middle-y');

        thead.appendChild(_add);

        let _row = document.createElement('tr');
        _row.setAttribute("class", "vt-number");
        for ([key, value] of Object.entries(cols)) {
            let _v = value.id != "" ? value.id : '#field';
            let _td = document.createElement('td');
            _td.innerHTML = _v;
            _td.id = value.random;
            _td.setAttribute("class", 'design ' + value.classtd);
            _td.setAttribute("tabindex", 0);
            _td.setAttribute("datatype", 'td');

            if (value.id != "") {

                _td.setAttribute("data-bs-toggle", "tooltip");
                _td.setAttribute("data-bs-placement", "top");
                _td.setAttribute("data-bs-original-title", value.id);
            }

            _row.appendChild(_td);
        }
        if (Object.keys(cols).length == 0) {
            let _sample = document.createElement('p');
            _sample.innerHTML = Outlang['Khong_co_cot'];
            thead.appendChild(_sample);
        }
        tbody.appendChild(_row);
        if (minrow != undefined && !isNaN(minrow) && minrow > 0) {
            table.setAttribute("data-bs-toggle", "tooltip");
            table.setAttribute("data-bs-placement", "top");
            table.setAttribute("data-bs-original-title", "Min row :" + minrow);
        }
    }
    table.appendChild(thead);
    table.appendChild(tbody);
    table.appendChild(tfoot);
    return table;
}

function fn_ConvertStyletd(ele, style) {
    style = style.replace(/\s/g, '');
    let stobj = style.split(';');
    for (const element of stobj) {

        if (element.includes(':')) {
            let _k = element.split(':')[0].toString();
            let _v = element.split(':')[1].toString();
            ele.setAttribute("data-a-wrap", "true");
            ele.setAttribute("data-a-v", "middle");

            switch (_k.toLowerCase()) {
                case "font-size":
                    if (!isNaN(Number(_v.slice(0, -2)))) ele.setAttribute("data-f-sz", Number(_v.slice(0, -2)));
                    break;
                case "color":
                    ele.setAttribute("data-f-color", _v.replace('#', ''));
                    break;
                case "font-weight":
                    if (!isNaN(Number(_v))) {
                        if (Number(_v) >= 500) ele.setAttribute("data-f-bold", "true");
                    }
                    break;
                case "font-style":
                    if (_v == "italic") ele.setAttribute("data-f-italic", "true");
                    break;
                case "text-decoration":
                    if (_v == "underline") ele.setAttribute("data-f-underline", "true");
                    break;
                case "background":
                    ele.setAttribute("data-fill-color", _v.replace('#', ''));
                    break;
                case "vertical-align":
                    if (_v == "bottom") ele.setAttribute("data-a-v", "bottom");
                    else if (_v == "top") ele.setAttribute("data-a-v", "top");
                    else if (_v == "middle") ele.setAttribute("data-a-v", "middle");

                    break;
                case "text-align":
                case "align-items":
                    if (_v == "start") ele.setAttribute("data-a-h", "left");
                    else if (_v == "center") ele.setAttribute("data-a-h", "center");
                    else if (_v == "end") ele.setAttribute("data-a-h", "right");
                    else ele.setAttribute("data-a-h", "center");
                    break;
                case "border-bottom":
                    if (_v.includes("dotted")) ele.setAttribute("data-b-b-s", "dotted");
                    else if (_v.includes("solid")) ele.setAttribute("data-b-b-s", "thin");

                    break;
            }

        }
    }

    return ele;
    //data-f-sz="25"
    //data-f-color="FFFFAA00"
    //font-size: 34
    //   data-a-h="center"
    //                                data-fill-color="FFFF0000" data-a-v="middle" data-f-underline="true" style="font-name: Arial Black; font-color: { 'argb': '0080FF80' }; font-family: 2; ;
    //                    font-italic: true; alignment-horizontal: center; alignment-vertical: bottom; alignment-wrapText: true; alignment-indent: 1; border-bottom-style: dotted; border-bottom-color: { 'argb': 'FFA07A00' };
    //fill - type: pattern; fill - pattern: solid; fill - fgColor : {'argb': 'FFFF0000'} "
}
function fn_ConvertStyletr(ele, style) {
    style = style.replace(/\s/g, '');
    let stobj = style.split(';');
    for (const element of stobj) {

        if (element.includes(':')) {
            let _k = element.split(':')[0].toString();
            let _v = element.split(':')[1].toString();
            ele.setAttribute("data-a-v", "middle");
            switch (_k.toLowerCase()) {
                case "height":
                    if (!isNaN(Number(_v.slice(0, -2)))) ele.setAttribute("data-height", Number(_v.slice(0, -2)));
                    break;
                case "color":
                    ele.setAttribute("data-f-color", _v.replace('#', ''));
                    break;
                case "font-weight":
                    if (!isNaN(Number(_v))) {
                        if (Number(_v) >= 500) ele.setAttribute("data-f-bold", "true");
                    }
                    break;
                case "font-style":
                    if (_v == "italic") ele.setAttribute("data-f-italic", "true");
                    break;
                case "text-decoration":
                    if (_v == "underline") ele.setAttribute("data-f-underline", "true");
                    break;
                case "background":
                    ele.setAttribute("data-fill-color", _v.replace('#', ''));
                    break;
                case "vertical-align":
                    if (_v == "bottom") ele.setAttribute("data-a-v", "bottom");
                    else if (_v == "top") ele.setAttribute("data-a-v", "top");
                    else if (_v == "middle") ele.setAttribute("data-a-v", "middle");

                    break;
                case "text-align":
                case "align-items":
                    if (_v == "start") ele.setAttribute("data-a-h", "left");
                    else if (_v == "center") ele.setAttribute("data-a-h", "center");
                    else if (_v == "end") ele.setAttribute("data-a-h", "right");
                    else ele.setAttribute("data-a-h", "center");
                    break;

            }
        }
    }

    return ele;
}

function fn_FormUpdate(random, value, elements) {

    if (elements != undefined && Object.keys(elements).length != 0) {
        for ([k, v] of Object.entries(elements)) {
            if (v.random == random) {
                v.value = value;
                break;
            }
            if (v.child != undefined && Object.keys(v.child).length != 0) {
                fn_FormUpdate(random, value, v.child)
            }
        }
    }
}
function fn_RenderFormReRandom(elements) {
    if (elements != undefined && Object.keys(elements).length != 0) {
        for ([k, v] of Object.entries(elements)) {
            delete v.random;
            if (v.child != undefined && Object.keys(v.child).length != 0) {
                fn_RenderFormReRandom(v.child)
            }
        }
    }
}
async function fn_FillForm(item, id, dtManual) {
    return new Promise((resolve, reject) => {
        let obj = $("#" + id + " .design");
        obj.each(function () {
            let dataid = $(this).attr("dataid");
            let datatype = $(this).attr("datatype");
            let dataformat = $(this).attr("dataformat");

            let datavalue = $(this).text() ?? "";
            let value = (item[dataid] && item[dataid] != '') ? item[dataid] : datavalue;
            if (value != '') {
                switch (datatype) {
                    case 'label':
                        {
                            let isOnlyValue = true;
                            let dataqr = $(this).attr("dataqr");
                            let dataprivate = $(this).attr("dataprivate");
                            if (dataprivate != undefined && dataprivate == "true") {
                                if (value.length >= 8 && value.length < 15) {
                                    value = value.replace(value.substring(Math.floor(value.length / 2 - 2), value.length - 4), '***');
                                }
                                else value = value.replace(value, '***********');
                            }
                            if ($(this).attr('datadomaindefault') && $(this).attr('datadomaindefault') != "") {
                                value = $(this).attr('datadomaindefault') + value;
                            }
                            if (dataqr != undefined && (dataqr == "true" || dataqr == "1")) {
                                let ele = this;
                                fn_MakeQRCode(value, ele);
                                isOnlyValue = false
                            }
                            if ($(this).attr('dataisboxed') && $(this).attr('dataisboxed') == "1") {
                                value = value.toString().trim().replaceAll(" ", "");
                                let arrvalue = value != '' ? value.toString().split('').reverse() : [];
                                if (arrvalue && arrvalue.length != 0) {
                                    value = '';
                                    let stylebox = $(this).attr('datastylebox') ?? "";
                                    let totalbox = $(this).attr('datatotalbox') ?? "";
                                    let _count = totalbox != "" && totalbox > arrvalue.length ? totalbox : arrvalue.length;
                                    for (let i = _count - 1; i >= 0; i--) {
                                        value += `<label class="m-0 bg-transparent text-center border border-1" style="min-width:23px; height:23px;${stylebox}">${arrvalue[i] ?? ""}</label>`
                                    }
                                }
                            } 
                            
                            if (isOnlyValue) $(this).html(fn_FillForm_FormatValue(value, dataformat));

                            break;
                        }
                    case 'img':
                        {
                            if ($(this).hasClass('jsbarcode')) {
                                $(this).JsBarcode(value, {
                                    width: 2,
                                    height: '100%',
                                    background: "transparent",
                                });
                            }
                            else {
                                let domainimg = $(this).attr('datadomaindefault') ?? "";
                                if (domainimg != "") value = domainimg + value;
                                $(this).attr("src", value != '' ? value : '/defaul_white.png');
                            }
                            break;
                        }
                    case 'iframe':
                        {
                            if (value != '') {
                                $(this).attr('src', value);
                                $(this).on('load', function () {
                                    $(this)[0].style.height = $(this)[0].contentWindow.document.documentElement.scrollHeight + 'px';
                                });
                            }

                            break;
                        }
                    case 'checkbox':
                        {
                            $(this).prop('checked', Number(value) == 1);
                            $(this).attr('disabled', 'disabled');
                            break;
                        }
                    case 'textarea':
                    case 'input':
                        {
                            if (value != '') $(this).val(value);
                            break;
                        }


                }
            }
        });

    })
}

function fn_FillForm_FormatValue(val, forma) {
    try {
        let _re = "";
        if (forma == "" && val == "") return "";
        switch (forma) {
            case "dd-mm-yyyy": {
                let _dtv = new Date(val);
                _re = SDDT_StringDate(_dtv, "ddMMyyyy", "-");

                break;
            }
            default: _re = val;
                break;
        }

        return _re;
    }
    catch (ex) {
        return "";
    }
}
async function fn_print_sign(element, value) {
    await Signature_Action(value, 1);
    if (Signature_ResultSignation != "") {
        $(element).attr('src', Signature_ResultSignation);
        $(element).val(Signature_ResultSignation);

        if (typeof PR_DataTemplate !== 'undefined' && PR_DataTemplate && Object.keys(PR_DataTemplate).length > 0)
            fn_FormUpdate($(element).attr('id'), Signature_ResultSignation, PR_DataTemplate);
        if (typeof RegimenList !== 'undefined' && RegimenList && Object.keys(RegimenList).length > 0)
            fn_FormUpdate($(element).attr('id'), Signature_ResultSignation, RegimenList);
    }
}
async function fn_FillManual(id, dtManual) {
    return new Promise((resolve, reject) => {

        let obj = $("#" + id + " label, td").filter(function () {
            return ($(this).attr("datamanual") != "false") && ($(this).attr("datamanual") != undefined)
        });
        if (obj != undefined && obj.length != 0) {
            obj.each(function () {
                let datatype = $(this).attr("datatype");
                let dateManual = $(this).attr("datamanual");
                let value = $(this).html();
                switch (datatype) {
                    case 'label':
                    case "td":
                        {
                            let res = fn_FillManualValue(value, dtManual, dateManual);
                            if (res != undefined) {
                                $(this).html(res)
                            }
                            break;
                        }

                }

            });
        }

    })
}
function fn_FillManualValue(val, dtManual, datamanual) {
    let res;
    if ([dtManual] != undefined && [dtManual].length > 0) {
        switch (datamanual) {
            case 'exchange_rate': {
                let value = val && val != '' ? val : '';
                if (value && value != undefined && value != "") {
                    let exchangeRate = dtManual.exchangeRate != "" ? Number(dtManual.exchangeRate) : 1;
                    if (exchangeRate && exchangeRate != 1) {
                        let checkNumber = parseInt(value.replace(/[,]/g, ''));
                        let result = checkNumber / exchangeRate
                        res = formatNumber(Math.round(result + 0.01));
                    }
                }
                break;
            }
            case 'val_input_1': {
                let val_input_1 = dtManual.exchangeRate != "" ? dtManual.exchangeRate : "";
                if (val_input_1 && val_input_1 != "") {
                    if (Number(val_input_1) && typeof Number(val_input_1) == 'number') {
                        res = formatNumber(val_input_1);
                    } else {
                        res = val_input_1;
                    }

                }
                break;
            }
            case 'val_input_2': {
                let val_input_2 = dtManual.valCurrency != "" ? dtManual.valCurrency : "";
                if (val_input_2 && val_input_2 != "") {
                    if (Number(val_input_2) && typeof Number(val_input_2) == 'number') {
                        res = formatNumber(val_input_2);
                    } else {
                        res = val_input_2;
                    }
                }
                break;
            }
        }


    }
    return res;
}
async function fn_FillTables(dataTable, item, id, dtManual) {
    return new Promise((resolve, reject) => {

        let table = $('#' + id + ' table');
        if (table != undefined && table.length != 0) {
            table.each(function () {
                let datavalue = $(this).attr('datavalue');
                let datatype = $(this).attr('datatype');
                let datarendergroup = $(this).attr('rendergroup');
                if (datatype == 'table') {
                    if (datavalue == undefined || datavalue == "") datavalue = 'Table1'; 
                    let data = dataTable[datavalue] ?? []
                    if (datarendergroup && datarendergroup != '' && datarendergroup != 'undefined')
                        data = data.filter(word => { return word?.GroupRender && (word?.GroupRender == datarendergroup) });
                    let ths = $(this).find('th');
                    let tbody = $(this).find('tbody');
                    let cols = {};
                    ths.each(function () {
                        let e = {};
                        e.dataid = $(this).attr("dataid");
                        e.classtd = $(this).attr("classtd");
                        e.datamanual = $(this).attr("datamanual");
                        e.style = $(this).attr("datastyle");
                        e.styletd = $(this).attr("datastyletd");
                        cols[$(this).attr("dataindex")] = e;
                    });
                    let minrow = !isNaN($(this).attr("minrow")) ? Number($(this).attr("minrow")) : 0;
                    fn_FillTable(cols = cols, body = tbody,data ?? [], dtManual = dtManual, minrow = minrow);
                    fn_FillFooterTable(item, $(this), dtManual);
                }
                if (datatype === 'tableexcel') {
                    let tds = $(this).find('td');
                    tds.each(function () {
                        let dataid = $(this).attr("dataid");
                        if (dataid != undefined && dataid != "") {
                            if (item[dataid] != undefined) {
                                let value = item[dataid];
                                $(this).html(value);
                            }
                        }
                    });
                }
            });
        }
        let repeatdiv = $('#' + id).find(`[datarepeat='true']`);
        if (repeatdiv != undefined && repeatdiv.length != 0) {
            repeatdiv.each(function () {
                let datavalue = $(this).attr('datavalue');
                if (datavalue == undefined || datavalue == "") datavalue = 'Table1';
                fn_FillRepeatDiv(objdiv = $(this), data = dataTable[datavalue], dtManual = dtManual);

            });
        }
    })
}
async function fn_FillFooterTable(item, tb, dtManual) {
    return new Promise((resolve, reject) => {
        let obj = tb.find("tfoot td");
        obj.each(function () {
            let dataid = $(this).attr("dataid");
            if (dataid != undefined && dataid != "") {
                if (item[dataid] != undefined) {
                    let value = item[dataid];
                    $(this).html(value);
                }
            }
        });

    })
}
async function fn_FillTable(cols, body, data, dtManual, minrow) {
    return new Promise((resolve, reject) => {
        body.html('');
        if (data) {

            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    let item = data[i];
                    let _row = document.createElement('tr');
                    _row.setAttribute("class", "vt-number");

                    for ([key, value] of Object.entries(cols)) {
                        let _v = item[value.dataid] != undefined ? item[value.dataid] : '';
                        let _td = document.createElement('td');
                        if (value.datamanual && value.datamanual != 'false') {
                            _td.setAttribute("datamanual", value.datamanual);
                            _td.setAttribute("datatype", "td");
                        }
                        _td.innerHTML = _v;
                        _td.setAttribute("class", value.classtd);

                        if (value.styletd !== undefined) {
                            _td.setAttribute("style", value.styletd);
                            _td = fn_ConvertStyletd(_td, value.styletd);
                        }

                        _row.appendChild(_td);
                    }
                    body.append(_row);
                }
            }

            if (minrow != 0 && data.length < minrow) {
                let leftRow = minrow - data.length;
                for (let ii = 0; ii < leftRow; ii++) {
                    let _row = document.createElement('tr');
                    _row.setAttribute("class", "vt-number");
                    for ([key, value] of Object.entries(cols)) {
                        let _td = document.createElement('td');
                        _td.innerHTML = "<br>";
                        _td.setAttribute("style", value.styletd);
                        _td = fn_ConvertStyletd(_td, value.styletd);
                        _row.appendChild(_td);
                    }
                    body.append(_row);
                }

            }
        }
    })
}
async function fn_FillRepeatDiv(objdiv, data, dtManual) {
    return new Promise((resolve, reject) => {
        let child = objdiv.children().clone()[0].outerHTML;
        objdiv.html('');
        let stringContent = "";
        if (data && data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                stringContent += child;
            }
        }
        objdiv.html(stringContent)
        let allchilds = objdiv.children();
        let index = 0;
        allchilds.each(function () {
            fn_FillRepeatDivEach($(this), data[index], dtManual);
            index = index + 1;
        });
    })
}
async function fn_FillRepeatDivEach(rowitem, item, dtManual) {
    return new Promise((resolve, reject) => {
        let repeatdiv = rowitem[0].querySelectorAll('.design [datatype="label"], .design [datatype="img"], .design [datatype="input"], .design [datatype="textarea"]');
        repeatdiv.forEach(function (element) {
            let dataid = element.getAttribute("dataid");
            let datatype = element.getAttribute("datatype");

            if (dataid !== null && dataid !== "") {
                if (item && item[dataid] !== undefined) {
                    let value = item[dataid];

                    switch (datatype) {
                        case 'label':
                            {
                                let dataqr = element.getAttribute("dataqr");
                                if (dataqr !== null && (dataqr === "true" || dataqr === "1")) {
                                    fn_MakeQRCode(value, element);
                                } else {
                                    element.innerHTML = value;
                                }
                                break;
                            }
                        case 'img':
                            {
                                if (element.classList.contains('jsbarcode')) {
                                    $(element).JsBarcode(value, {
                                        width: 2,
                                        height: '100%',
                                        background: "transparent",
                                    });
                                } else {
                                    let domainimg = element.getAttribute("datadomaindefault");
                                    if (domainimg != "") value = domainimg + value;
                                    element.setAttribute("src", value !== '' ? value : "/defaul_white.png");
                                }
                                break;
                            }
                        case 'textarea':
                        case 'input':
                            {
                                if (value !== '') element.value = value;
                                break;
                            }
                    }
                }
            }
        });
    })
}
async function fn_MakeQRCode(value, ele) {
    let { color, backgroundColor } = window.getComputedStyle(ele);
    let widthqr = $(ele).width() != 0 ? $(ele).width() : 50;
    let heightqr = $(ele).height() != 0 ? $(ele).height() : 50;
    let colorqr = rgb2hex(color) != '' ? rgb2hex(color) : '#000000';
    let bgqr = rgb2hex(backgroundColor) != '' ? rgb2hex(backgroundColor) : 'transparent'
    $(ele).html('');
    var qrCode = new QRCode(ele, {
        text: value,
        width: widthqr,
        height: heightqr,
        display: 'none',
        colorDark: colorqr,
        colorLight: bgqr,
        correctLevel: QRCode.CorrectLevel.L,
    });

    qrCode.makeCode(value);
    $(ele).find('canvas').remove()
}
//#endregion
//#region // Fill dynamic

async function fn_FillDynamic(dataTables, id) {
    return new Promise((resolve, reject) => {
        try {

            let obj = $("#" + id + " .design");
            let objdyn = obj.find("[dyntype]").filter(function () {
                return $(this).attr("dyntype") !== "";
            });
            if (objdyn != undefined && objdyn.length > 0) {
                Object.entries(dataTables).forEach(([key, value]) => {
                    if (value != undefined && value.length > 0) {
                        let kv = fn_DynamicCreateKv(value);
                        if (Object.keys(kv).length > 0) {
                            fn_FillDynamicEach(objdyn, kv);
                        }

                    }

                });
            }
        }
        catch (ex) { }
    });
}
function fn_FillDynamicEach(obj, item) {
    try {

        obj.each(function () {

            let dataid = $(this).attr("dataid");
            let datatype = $(this).attr("datatype");
            let dyntype = $(this).attr("dyntype");
            let value = item[dataid];
            let textValue = '';
            if (value != undefined && value != "") {
                switch (datatype) {
                    case 'label':
                    case 'textarea':
                    case 'input':
                        {
                            if (dyntype == 'l') textValue = value.Label;
                            else if (dyntype == 't') textValue = value.Text;
                            else if (dyntype == 'd' && value.IsDate == 1) textValue = SysDate().FUTCNUM(value.Date ?? "").DateText();


                            if (datatype == "label") {
                                $(this).html(textValue);
                            }
                            else {
                                $(this).val(textValue);
                            }

                            break;
                        }

                    case 'checkbox':
                        {
                            if (dyntype == 'c') {
                                if (value.IsCheck == 1) {
                                    $(this).prop('checked', Number(value.Check) == 1);
                                }
                                $(this).attr('disabled', 'disabled');
                            }
                            break;
                        }



                }
            }
        });
    }
    catch (ex) {

    }
}

function fn_DynamicCreateKv(tb) {
    try {
        return Object.fromEntries(tb.map(item => [item.Code, item]));
    }
    catch (ex) {
        return {};
    }
}
//#endregion
//#region // Fill dynamic
async function fn_FillTeethChart(id, type, link) {
    return new Promise((resolve, reject) => {
        try {
            let obj;
            switch (type) {
                case 0: {
                    obj = $("#" + id + " .design.teethadult, #" + id + " .design.teethchild");
                    break;
                }
                case 1: {
                    obj = $("#" + id + " .design.teethadult");
                    break;
                }
                case 2: {
                    obj = $("#" + id + " .design.teethchild");
                    break;
                }
            }

            if (obj != undefined && obj.length > 0) {
                $(obj[0]).load(link);
            }


        }
        catch (ex) { }
    });
}
//#endregion