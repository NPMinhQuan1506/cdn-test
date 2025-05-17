//#region // Function Global
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
        typeof define === 'function' && define.amd ? define(['exports'], factory) :
            (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.vtt = {}));
}(this, (function (exports) {
    'use strict';

    var fp = typeof window !== "undefined" && window.flatpickr !== undefined
        ? window.flatpickr
        : {
            l10ns: {},
        };
    var VTTLang = {
        weekdays: {
            shorthand: [
                `${Outlang["Sys_sthu_8"] ?? 'Sun'}`,
                `${Outlang["Sys_sthu_2"] ?? 'Mon'}`,
                `${Outlang["Sys_sthu_3"] ?? 'Tue'}`,
                `${Outlang["Sys_sthu_4"] ?? 'Wed'}`,
                `${Outlang["Sys_sthu_5"] ?? 'Thu'}`,
                `${Outlang["Sys_sthu_6"] ?? 'Fri'}`,
                `${Outlang["Sys_sthu_7"] ?? 'Sat'}`,

            ],
            longhand: [
                `${Outlang["Sys_thu_8"] ?? 'Sunday'}`,
                `${Outlang["Sys_thu_2"] ?? 'Monday'}`,
                `${Outlang["Sys_thu_3"] ?? 'Tuesday'}`,
                `${Outlang["Sys_thu_4"] ?? 'Wednesday'}`,
                `${Outlang["Sys_thu_5"] ?? 'Thurday'}`,
                `${Outlang["Sys_thu_6"] ?? 'Friday'}`,
                `${Outlang["Sys_thu_7"] ?? 'Saturday'}`
                ,
            ],
        },
        months: {
            shorthand: [
                `${Outlang["Sys_sthang_1"] ?? 'Jan'}`,
                `${Outlang["Sys_sthang_2"] ?? 'Feb'}`,
                `${Outlang["Sys_sthang_3"] ?? 'Mar'}`,
                `${Outlang["Sys_sthang_4"] ?? 'Apr'}`,
                `${Outlang["Sys_sthang_5"] ?? 'May'}`,
                `${Outlang["Sys_sthang_6"] ?? 'Jun'}`,
                `${Outlang["Sys_sthang_7"] ?? 'Jul'}`,
                `${Outlang["Sys_sthang_8"] ?? 'Aug'}`,
                `${Outlang["Sys_sthang_9"] ?? 'Sep'}`,
                `${Outlang["Sys_sthang_10"] ?? 'Oct'}`,
                `${Outlang["Sys_sthang_11"] ?? 'Nov'}`,
                `${Outlang["Sys_sthang_12"] ?? 'Dec'}`,

            ],
            longhand: [
                `${Outlang["Sys_thang_1"] ?? 'January'}`,
                `${Outlang["Sys_thang_2"] ?? 'February'}`,
                `${Outlang["Sys_thang_3"] ?? 'March'}`,
                `${Outlang["Sys_thang_4"] ?? 'April'}`,
                `${Outlang["Sys_thang_5"] ?? 'May'}`,
                `${Outlang["Sys_thang_6"] ?? 'June'}`,
                `${Outlang["Sys_thang_7"] ?? 'July'}`,
                `${Outlang["Sys_thang_8"] ?? 'August'}`,
                `${Outlang["Sys_thang_9"] ?? 'September'}`,
                `${Outlang["Sys_thang_10"] ?? 'Octorber'}`,
                `${Outlang["Sys_thang_11"] ?? 'November'}`,
                `${Outlang["Sys_thang_12"] ?? 'December'}`,
            ],
        },
        firstDayOfWeek: 1,
        ordinal: function () {
            return "";
        },
        rangeSeparator: " to ",
        weekAbbreviation: `${Outlang["Sys_tuan"] ?? 'Week'}`,
        scrollTitle: "Scrolling to view",
        toggleTitle: "Click to change",
        amPM: [`${Outlang["Sys_ssang"] ?? 'AM'}`, `${Outlang["Sys_schieu"] ?? 'PM'}`],
        yearAriaLabel: `${Outlang["Sys_nam2"] ?? 'Year'}`,
        time_24hr: true,
    };
    fp.l10ns.vtt = VTTLang;
    var vtt = fp.l10ns;

    exports.VTTLang = VTTLang;
    exports.default = vtt;

    Object.defineProperty(exports, '__esModule', { value: true });

})));


(function ($) {
    var VTT_CustomJQueryFPFunc = jQuery.fn.flatpickr;
    var VTT_CustomerFPConstrutor = flatpickr;
    jQuery.fn.flatpickr = function (e) {
        e = { ...e, locale: "vtt" };
        return VTT_CustomJQueryFPFunc.call(this, e);
    }

    flatpickr = function (e, t) {
        t = { ...t, locale: "vtt" };
        return VTT_CustomerFPConstrutor.call(this, e, t);
    }

    $(window).click(function (e) {
        try {
            var clickover = $(e.target);
            if (!clickover.hasClass("collapse")
                && !clickover.hasClass("form-check-input")
                && !clickover.hasClass("form-switch")
                && (clickover.parent() != undefined && !clickover.parent().hasClass("collapse"))) {
                $('.collapse').not('.collapsesticky').collapse('hide');
            }

            let itemmenus = $(".item-menu");
            if ($(itemmenus).is(e.target) || $(itemmenus).has(e.target).length !== 0) {
                let _menu = clickover.closest('.nav-menus');

                if (_menu.hasClass('nav-mobile-toggle')) {
                    _menu.removeClass('nav-mobile-toggle');
                }
                else {
                    $(".nav.nav-menus").removeClass("nav-mobile-toggle");
                    _menu.addClass('nav-mobile-toggle');
                }
            }
            else {
                $(".nav.nav-menus").removeClass("nav-mobile-toggle");
            }

            // SHOW MORE CONTENT
            let content_more = $("#Master_ViewContent");
            let content = $(".content_line_clamp");
            if (!$(content_more).is(e.target) && $(content_more).has(e.target).length === 0
                && !$(content).is(e.target) && $(content).has(e.target).length === 0) {
                $("#Master_ViewContent").removeClass('active');
            }

            // REMOVE TOOLTIP & POPOVER
            let attrTooltip = clickover.attr('data-bs-toggle');
            if (attrTooltip == 'undefined' || (attrTooltip != 'tooltip' && attrTooltip != 'popover')) {
                $('.tooltip.fade.show').remove();
            }

        }
        catch (e) {

        }
    });

    $(window).on('mousewheel mousemove mouseout', function (e) {
        try {
            var clickover = $(e.target);
            let attrTooltip = clickover.attr('data-bs-toggle');
            if (attrTooltip == 'undefined' || (attrTooltip != 'tooltip' && attrTooltip != 'popover')) {
                $('.tooltip.fade.show:not(:last-child)').remove();
            }
        }
        catch (ex) {

        }
    })

    $(document).on("click", ".vtcondition .sign", function (e) {
        try {
            $(this).next().collapse('toggle');
            $(this).attr('aria-expanded', !($(this).attr('aria-expanded') == 'true'))
        }
        catch (e) {
        }
    });

    $(document).on("show.bs.collapse", ".collapse", function (e) {
        try {
            if (!$(this).hasClass('fulllap') && !$(this).hasClass('buttonGridcol')) {
                var popupWidth = $(this).outerWidth()
                var marginLeft = parseInt($("main.main-content").css("marginLeft"));
                var offleft = $(this).parent().offset().left;
                if (offleft - marginLeft < popupWidth) {
                    $(this).css('left', - (offleft - marginLeft) + 20);
                    if (popupWidth > window.outerWidth) {
                        $(this).css({
                            "width": window.outerWidth - 40,
                            "min-width": window.outerWidth - 40,
                            "max-width": window.outerWidth - 40
                        });
                    }
                };
            }
        }
        catch (e) { }
    });

    $(document).on("click", ".nav-menus", function (e) {
        try {







            //var popupWidth = $(this).outerWidth()
            //var marginLeft = parseInt($("main.main-content").css("marginLeft"));
            //var offleft = $(this).parent().offset().left;

            //if (offleft - marginLeft < popupWidth) {
            //    $(this).css('left', - (offleft - marginLeft) + 20);
            //    if (popupWidth > window.outerWidth) {
            //        $(this).css({
            //            "width": window.outerWidth - 40,
            //            "min-width": window.outerWidth - 40,
            //            "max-width": window.outerWidth - 40
            //        });
            //    }
            //};
        }
        catch (e) { }
    });

    $.fn.NavMobile = function (target) {
        let element = $(this);
        switch (target) {
            case 'show':
                element.addClass("nav-mobile-toggle");
                break;
            case 'hide':
                element.removeClass("nav-mobile-toggle");
                break;
        }
    };


})(jQuery);


function Master_OnLoad_Error_Image(image) {

    image.src = Master_Default_Pic;
    return true;
}

function Master_Onload_SuccessPic(img, mwi, mhe) {
    try {
        let wi = img.width;
        let he = img.height;
        if (wi >= he) {
            img.style.maxHeight = mhe.toString() + 'px';
        }
        else img.style.maxWidth = mwi.toString() + 'px';
    }
    catch {

    }
}

function Master_OnLoad_Success_Image() {

}

function Master_Render_Currency_View() {
    $(".master_currency").html((Master_Currency && Master_Currency != '') ? Master_Currency : 'VND');
}

function Count_Up(id, value, isDecimal) {
    if (document.getElementById(id)) {
        let countUp = new CountUp(id, value, { decimalPlaces: (!isDecimal == 1 ? 0 : 2) });
        if (!countUp.error) countUp.start();
    }
}

function ToolPopper() {
    let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    let tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })
    let popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
    let popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl)
    });
}

function ToolPopper_PreviewDetail() {
    ToolPopper();
    $('.sys_previewTooltips').off('click mouseover').on('click mouseover', function (event) {

        event.preventDefault();
        event.stopPropagation();
        var _this = this;
        let currid = !isNaN(Number($(this).attr('data-preview-id'))) ? Number($(this).attr('data-preview-id')) : 0;
        let type = $(this).attr('data-preview-type') ? $(this).attr('data-preview-type') : ""; //Type list were stored in PreviewGeneral page
        $('#sys_previewContainer').remove();
        if (currid != 0 && type != "") {
            //create div
            let tooltip = $('<div id="sys_previewContainer" class="vtt-tooltip-preview card"></div>').appendTo('main');


            //load page
            $("#sys_previewContainer").load(`/Preview/PreviewGeneral?Type=${type}&CurrentID=${currid}&ver=${versionofWebApplication}`, function (responseTxt, statusTxt, xhr) {
                if (statusTxt == "success") {
                    if (typeof pvg_fnSetPostion != "undefined") pvg_fnSetPostion = () => {
                        console.log('set position');
                        //calculator position
                        let rootPosition = _this.getBoundingClientRect();
                        let left = rootPosition.left + window.pageXOffset;
                        let top = rootPosition.top + window.pageYOffset + rootPosition.height;

                        let viewportTop = window.scrollY;
                        let viewportBottom = viewportTop + window.innerHeight;
                        let viewportLeft = window.scrollX;
                        let viewportRight = viewportLeft + window.innerWidth;


                        let componentPos = $("#sys_previewContainer")[0]?.getBoundingClientRect();
                        let componentWidth = componentPos.width;
                        let componentHeight = componentPos.height;

                        if (top + componentHeight > viewportBottom) {
                            top = top - componentHeight - rootPosition.height;
                            if (top < viewportTop) {
                                top = 0;
                            }
                        }
                        if (left + componentWidth > viewportRight) {
                            left = left - componentWidth + rootPosition.width;
                            if (left < viewportLeft) {
                                left = 0;
                            }
                        }
                        let isFixed = 0;
                        let rectFixed = {};
                        if (sys_isMobile == 1 || top == 0 || left == 0) {
                            top = 0;
                            left = 0;
                            isFixed = 1;
                            rectFixed = {
                                width: "100vw",
                                height: "100vh",
                                zIndex: "999999",
                                maxWidth: "100vw",
                                maxHeight: "100vh"
                            }
                        }
                        else {
                            rectFixed = {
                                maxWidth: "350px !important",
                                minWidth: "300px !important",
                                maxHeight: "600px !important"
                            }
                        }
                        $('#sys_previewContainer')
                            .css({
                                left: left,
                                top: top,
                                position: isFixed == 0 ? 'absolute' : 'fixed',
                                ...rectFixed
                            })
                            .hide()
                            .show(300, function () {

                                $('.vtt-loading-overlay')?.fadeOut(200, function () {
                                    $(this).remove();
                                });
                            });

                        $(document).on('click mouseover', function (e) {
                            if (!$(e.target).closest('#sys_previewContainer, .vtt-tooltip-preview').length) {
                                $('#sys_previewContainer').hide(300);
                            }
                        });
                    }

                }
                if (statusTxt == "error") {
                    console.warn("error");
                }
            });


        }


    });
}
//#endregion
//#region // Other
function ChangeAssistname(cn, rep, repted) {
    var x = document.getElementsByClassName(cn);
    if (x != null && x != undefined) {
        for (i = 0; i < x.length; i++) {
            x[i].innerHTML = x[i].innerHTML.replace(rep, repted);
        }
    }

}
$('.ui.dropdown .remove.icon').on('click', function (e) {
    $(this).parent('.dropdown').dropdown('clear');
    e.stopPropagation();
});


//#endregion

//#region  // Validation require
function Checking_Require_Validation(name) {
    Checking_Require_Validation_Exe(RequireValidation, name ?? '');
}
function Checking_Require_Validation_Exe(data, name) {
    if (data != undefined && data != null && data.length > 0) {
        x = document.getElementsByClassName("_validation_option_");
        name = (name.toLowerCase()).startsWith('/pages/') ? (name.toLowerCase()).replace('/pages/', '/') : name;
        let findchar = name.substr(name.length - 1, 1);
        let namecheck = findchar == '/' ? name : name + '/';
        if (x != undefined && x.length != 0) {
            for (i = x.length - 1; i >= 0; i--) {
                let datatab = x[i].attributes["data-validation"].value;
                if (data != undefined && data.length != 0) {
                    for (j = 0; j < data.length; j++) {
                        if (data[j].ControlName == datatab && namecheck === data[j].PagePath) {
                            let fieldName = data[j].FieldName;
                            let active = data[j].Active;
                            if (fieldName == '' && active == 0) {
                                x[i].style.display = "none";
                            }
                            else {
                                switch (x[i].nodeName.toLowerCase()) {
                                    case 'input':
                                        x[i].setAttribute("name", fieldName);
                                        break;
                                    case 'textarea':
                                        x[i].setAttribute("name", fieldName);
                                        break;
                                }
                            }
                            j = data.length;
                        }
                    }
                }
            }
        }
    }
}
//#endregion
//#region  // Noti validation require
(function ($) {
    $.fn.Require_Validation = function () {

        let field = this.find('.field.error');
        let content = '';
        if (field.length > 0) {
            field.each(function (index) {
                if (field[index].children[0].nodeName.toLowerCase() == 'label') {
                    let item = field[index].children[0].textContent;
                    content += item.replace('*', '') + ", ";
                }

            });
            if (this.find('.noti-validate')) {
                $('.noti-validate', this).remove();
            }
            if (content != '') {
                this.append('<div class="noti-validate text-sm">' + Outlang["Yeu_cau"] + ': ' + content + '</div>');
                return false;
            }
        }
        return true;
    };
})(jQuery);
//#endregion
//#region  // Permission
function Checking_TabControl_Permission() {
    Checking_TabControl_Permission_Exe(PermissionTable_TabControl);
}

function CheckPermissionColumnInGrid(dt, name, gridName) {

    if (dt != null && dt != undefined && dt.length != 0) {
        for (var i = 0; i < dt.length; i++) {
            let controlname = dt[i].ControlName;
            let linkPage = dt[i].LinkPage;
            if (linkPage === name && dt[i].ControlType == 2) {
                if ($('#' + controlname).length) {
                    let table = document.getElementById(gridName);
                    let column = table.rows[0];
                    if (column != undefined && column != null && column.cells != null && column.cells != undefined && column.cells.length != 0) {
                        let countNoneDisplay = 0;
                        for (let i = 0; i < column.cells.length; i++) {
                            if (column.cells[i].id != undefined && column.cells[i].id == controlname) {
                                let index = i + 1;
                                $('table#' + gridName + ' td:nth-child(' + index + '),table#' + gridName + ' th:nth-child(' + index + ')').empty();
                                $('table#' + gridName + ' td:nth-child(' + index + '),table#' + gridName + ' th:nth-child(' + index + ')').hide();
                            }
                        }
                    }
                }
            }
        }
    }
}
function CheckPermissionControlInPage(dt, name) {
    try {
        if (dt != null && dt != undefined && dt.length != 0) {
            for (let i = 0; i < dt.length; i++) {
                let controlname = dt[i].ControlName;
                let linkPage = dt[i].LinkPage;
                name = (name.toLowerCase()).startsWith('/pages/') ? (name.toLowerCase()).replace('/pages/', '/') : name;
                let findchar = name.substr(name.length - 1, 1);
                let namecheck = findchar == '/' ? name : name + '/';
                if (linkPage.toLowerCase() === namecheck.toLowerCase() && dt[i].ControlType == 1) {
                    if ($('#' + controlname).length) {
                        $('#' + controlname).hide();
                        $('#' + controlname).empty();
                    }
                }
            }
        }
    }
    catch (ex) {

    }
}

//#endregion
//#region  // Check Connection
function Master_Checking_CallCenter() {
    Callcenter_CheckUsing(usingCallCenter, checkingCallCenter, callextension, linkClickToCall
        , calloutbound, calllogintimeexpired, callport, calldomain, callpassword
    );
}
function CheckCallCenter_Click() {
    Master_Checking_CallCenter();
}

function CheckVoiceDevice_Click() {
    CheckingvoiceDevice();
}
function CheckConnection_Click() {
    let _checkingimageNetwork = Master_Data._checkingimageNetwork;
    CheckConnection(_checkingimageNetwork);
}
//#endregion
//#region // Dark-mode

// Light Mode / Dark Mode
function darkMode(el) {
    const body = document.getElementsByTagName('body')[0];
    const hr = document.querySelectorAll('div:not(.sidenav) > hr');
    const hr_card = document.querySelectorAll('div:not(.bg-gradient-dark) hr');
    const text_btn = document.querySelectorAll('button:not(.btn) > .text-dark');
    const text_span = document.querySelectorAll('span.text-dark, .breadcrumb .text-dark');
    const text_span_white = document.querySelectorAll('span.text-white, .breadcrumb .text-white');
    const text_strong = document.querySelectorAll('strong.text-dark');
    const text_strong_white = document.querySelectorAll('strong.text-white');
    const text_nav_link = document.querySelectorAll('a.nav-link.text-dark');
    const text_nav_link_white = document.querySelectorAll('a.nav-link.text-white');
    const secondary = document.querySelectorAll('.text-secondary');
    const bg_gray_100 = document.querySelectorAll('.bg-gray-100');
    const bg_gray_600 = document.querySelectorAll('.bg-gray-600');
    const btn_text_dark = document.querySelectorAll('.btn.btn-link.text-dark, .material-icons.text-dark');
    const btn_text_white = document.querySelectorAll('.btn.btn-link.text-white, .material-icons.text-white');
    const card_border = document.querySelectorAll('.card.border');
    const card_border_dark = document.querySelectorAll('.card.border.border-dark');

    const svg = document.querySelectorAll('g');

    if (!el.getAttribute("checked")) {
        body.classList.add('dark-version');
        for (var i = 0; i < hr.length; i++) {
            if (hr[i].classList.contains('dark')) {
                hr[i].classList.remove('dark');
                hr[i].classList.add('light');
            }
        }

        for (var i = 0; i < hr_card.length; i++) {
            if (hr_card[i].classList.contains('dark')) {
                hr_card[i].classList.remove('dark');
                hr_card[i].classList.add('light');
            }
        }
        for (var i = 0; i < text_btn.length; i++) {
            if (text_btn[i].classList.contains('text-dark')) {
                text_btn[i].classList.remove('text-dark');
                text_btn[i].classList.add('text-white');
            }
        }
        for (var i = 0; i < text_span.length; i++) {
            if (text_span[i].classList.contains('text-dark')) {
                text_span[i].classList.remove('text-dark');
                text_span[i].classList.add('text-white');
            }
        }
        for (var i = 0; i < text_strong.length; i++) {
            if (text_strong[i].classList.contains('text-dark')) {
                text_strong[i].classList.remove('text-dark');
                text_strong[i].classList.add('text-white');
            }
        }
        for (var i = 0; i < text_nav_link.length; i++) {
            if (text_nav_link[i].classList.contains('text-dark')) {
                text_nav_link[i].classList.remove('text-dark');
                text_nav_link[i].classList.add('text-white');
            }
        }
        for (var i = 0; i < secondary.length; i++) {
            if (secondary[i].classList.contains('text-secondary')) {
                secondary[i].classList.remove('text-secondary');
                secondary[i].classList.add('text-white');
                secondary[i].classList.add('opacity-8');
            }
        }
        for (var i = 0; i < bg_gray_100.length; i++) {
            if (bg_gray_100[i].classList.contains('bg-gray-100')) {
                bg_gray_100[i].classList.remove('bg-gray-100');
                bg_gray_100[i].classList.add('bg-gray-600');
            }
        }
        for (var i = 0; i < btn_text_dark.length; i++) {
            btn_text_dark[i].classList.remove('text-dark');
            btn_text_dark[i].classList.add('text-white');
        }
        for (var i = 0; i < svg.length; i++) {
            if (svg[i].hasAttribute('fill')) {
                svg[i].setAttribute('fill', '#fff');
            }
        }
        for (var i = 0; i < card_border.length; i++) {
            card_border[i].classList.add('border-dark');
        }
        el.setAttribute("checked", "true");
    } else {
        body.classList.remove('dark-version');
        for (var i = 0; i < hr.length; i++) {
            if (hr[i].classList.contains('light')) {
                hr[i].classList.add('dark');
                hr[i].classList.remove('light');
            }
        }
        for (var i = 0; i < hr_card.length; i++) {
            if (hr_card[i].classList.contains('light')) {
                hr_card[i].classList.add('dark');
                hr_card[i].classList.remove('light');
            }
        }
        for (var i = 0; i < text_btn.length; i++) {
            if (text_btn[i].classList.contains('text-white')) {
                text_btn[i].classList.remove('text-white');
                text_btn[i].classList.add('text-dark');
            }
        }
        for (var i = 0; i < text_span_white.length; i++) {
            if (text_span_white[i].classList.contains('text-white') && !text_span_white[i].closest('.sidenav') && !text_span_white[i].closest('.card.bg-gradient-dark')) {
                text_span_white[i].classList.remove('text-white');
                text_span_white[i].classList.add('text-dark');
            }
        }
        for (var i = 0; i < text_strong_white.length; i++) {
            if (text_strong_white[i].classList.contains('text-white')) {
                text_strong_white[i].classList.remove('text-white');
                text_strong_white[i].classList.add('text-dark');
            }
        }
        for (var i = 0; i < text_nav_link_white.length; i++) {
            if (text_nav_link_white[i].classList.contains('text-white') && !text_nav_link_white[i].closest('.sidenav')) {
                text_nav_link_white[i].classList.remove('text-white');
                text_nav_link_white[i].classList.add('text-dark');
            }
        }
        for (var i = 0; i < secondary.length; i++) {
            if (secondary[i].classList.contains('text-white')) {
                secondary[i].classList.remove('text-white');
                secondary[i].classList.remove('opacity-8');
                secondary[i].classList.add('text-dark');
            }
        }
        for (var i = 0; i < bg_gray_600.length; i++) {
            if (bg_gray_600[i].classList.contains('bg-gray-600')) {
                bg_gray_600[i].classList.remove('bg-gray-600');
                bg_gray_600[i].classList.add('bg-gray-100');
            }
        }
        for (var i = 0; i < svg.length; i++) {
            if (svg[i].hasAttribute('fill')) {
                svg[i].setAttribute('fill', '#252f40');
            }
        }
        for (var i = 0; i < btn_text_white.length; i++) {
            if (!btn_text_white[i].closest('.card.bg-gradient-dark')) {
                btn_text_white[i].classList.remove('text-white');
                btn_text_white[i].classList.add('text-dark');
            }
        }
        for (var i = 0; i < card_border_dark.length; i++) {
            card_border_dark[i].classList.remove('border-dark');
        }
        el.removeAttribute("checked");
    }
};
//#endregion

//#region // Get member
function sys_getmember(data, amount) {
    let result = '';
    if (data != undefined && data.length != 0) {
        if (amount != undefined) {
            amount = Number(amount);

            if (amount >= data[data.length - 1].AmountTo) result = data[data.length - 1].Name;
            else if (amount <= data[0].AmountFrom) result = data[0].Name;
            else {
                let member = data.filter(function (wor) {
                    return (Number(wor.AmountFrom) <= amount && Number(wor.AmountTo) >= amount);
                });
                if (member != undefined && member.length > 0) {
                    result = member[0].Name;
                }
            }
        }
    }
    return result;
}

function sys_getmember_color(data, amount) {
    let result = '';
    if (data != undefined && data.length != 0) {
        if (amount != undefined) {
            amount = Number(amount);
            if (amount >= data[data.length - 1].AmountTo) result = data[data.length - 1].ColorCode;
            else if (amount <= data[0].AmountFrom) result = data[0].ColorCode;
            else {
                let member = data.filter(function (wor) {
                    return (Number(wor.AmountFrom) <= amount && Number(wor.AmountTo) >= amount);
                });
                if (member != undefined && member.length > 0) {
                    result = member[0].ColorCode;
                }
            }
        }
    }
    return result;
}

//#endregion
