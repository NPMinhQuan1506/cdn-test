function AllLog_CareSoft(APIbaseurl, Api_Key, dateFrom, dateTo, extension, page, limit) {
    var data = [];
    var allbound = [];
    if (extension != "") {
        allbound = LogCall_CareSoft(APIbaseurl, Api_Key, dateFrom, dateTo, extension, page, limit);
    }
    for (var i = 0; i < allbound.length; i++) {
        let element = {};
        let item = allbound[i];
        element.from = formatHTML(item.soGoiDen);
        element.to = item.soNhan;
        element.direction = item.typecall != null ? item.typecall : "";
        element.duration = item.thoiGianThucGoi;
        element.state = item.trangThai;
        element.recordUrl = item.path != "" ? item.path : "null";
        element.start = item.ngayGoi.replace("T", " ");
        element.status = (item.trangThai == 'ANSWERED' ? 'SUCCESS' : '')
        data.push(element);
    }
    return data;
}

function LogCall_CareSoft(APIbaseurl, Api_Key, dateFrom, dateTo, extension, page, limit) {
    let dtResult;
    let _dF = dateFrom + " 00:00:00";
    let _dT = dateTo + " 23:59:59";
    let url = APIbaseurl + `/api/v1/calls?start_time_to=${encodeURIComponent(_dT)}&agent_id=${extension}&start_time_since=${(_dF)}&page=${page}&count=${limit}`;

    $.ajax({
        url: url,
        type: "GET",
        contentType: 'application/json',
        async: false,
        headers: {
            "Authorization": `Bearer ${Api_Key}`,
            "Content-Type": `application/json`
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest);
            console.log(textStatus);
            console.log(errorThrown);
            notiError_SW();
        },
        success: function (result) {
            let data = result.data
            if (data != null && data.length > 0) {
                dtResult = data;
            } else {
                dtResult = [];
            }
        }
    });
    return dtResult;

}