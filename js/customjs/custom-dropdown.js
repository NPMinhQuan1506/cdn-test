var initSettingDropdown = {
    onShow: function () {
        let ui_drop = $(this);
        Dropdown_Set_Position(ui_drop);
    },
    onHide: function () {
        //let ui_drop = $(this);
        //Dropdown_Remove_Position(ui_drop);
    },
    onHideComplete: function () {
        let ui_drop = $(this);
        Dropdown_Remove_Position(ui_drop);
    },
    allowCategorySelection: true,
    forceSelection: false
};
function Dropdown_Set_Position(ele) {
    try {
        let offset = ele.offset();
        let scroll_window = $(window).scrollTop();
        let width = ele.outerWidth();
        let height = ele.outerHeight();

        let arrClass = ele.attr("class").split(/\s+/);
        let classWidth = "";
        let stringClass = arrClass.map((value) => {
            if (!value.includes('w-'))
                return value
            else classWidth += " " + value;
        }).join(" ");
        let dropdown_temp;
        if (ele.siblings(".ui-dropdown-temp").length == 0) {
            dropdown_temp = $(`<div class="ui-dropdown-temp ${stringClass}">${ele.dropdown('get text')}</div>`)
            dropdown_temp.css({ "height": height });
            //if (ele.closest('table.table').length == 0)
                dropdown_temp.css({ "width": width, "min-width": width });
            dropdown_temp.insertAfter(ele); // Thêm 1 element vào nội dung ( Giữ Được Chiều Cao )
        }
        let top = offset.top - parseInt(ele.css('marginTop'))
        ele.attr("data-style", ele.attr('style'))
            .attr("data-classwidth", classWidth)
            .attr("data-Offset", top);
        if (classWidth != "")
            ele.removeClass(classWidth);
        ele.css({ "top": top - scroll_window, "width": width, "max-width": width, "min-width": width, "position": "fixed", "transition": "none" });
        $(window).scroll(function () {
            let windowScroll = $(this).scrollTop();
            let offsetTop = Number(ele.attr("data-Offset"));
            ele.css("top", offsetTop - windowScroll);
        })
    }
    catch (ex) {

    }
}
function Dropdown_Remove_Position(ele) {
    try {
        $(window).unbind('scroll');
        ele.siblings(".ui-dropdown-temp").remove();
        ele.removeAttr("style data-Offset")
            .attr("style", ele.attr('data-style'))
            .addClass(ele.attr('data-classwidth'));
    }
    catch (ex) {

    }
}