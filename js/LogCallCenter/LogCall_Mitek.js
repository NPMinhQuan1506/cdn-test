function AllLog_Mitek(APIbaseurl, ApiKey, dateFrom, dateTo, extension, page, limit) {
    var data = [];
    var allbound = [];
    if (extension != "") {
        allbound = AllLog_MitekGetLogs(APIbaseurl, ApiKey, dateFrom, dateTo, extension, page, limit);
    }
    for (let i = 0; i < allbound.length; i++) {
        let element = {};
        let item = allbound[i];
        element.from = item?.caller ?? "";
        element.to = item?.called ?? "";
        element.direction = item.calltype != null ? item.calltype : "";
        element.duration = item?.billsec ?? 0;
        element.state = item.callstatus;
        element.recordUrl = item?.recordingfile  ? item.recordingfile : "null";
        element.start = item.calldate.replace("T", " ");
        element.status = (item.callstatus == 'ANSWERED' ? 'SUCCESS' : '')
        data.push(element);
    }
    return data;
}

function AllLog_MitekGetLogs(APIbaseurl, ApiKey, dateFrom, dateTo, extension, page, limit) {
    let dtResult;
    let url = APIbaseurl + "/api/v1/cdr/getCallsLog";

    let objectReq = {};
    objectReq.startDate=dateFrom + " 00:00:00";
    objectReq.endDate=dateTo + " 23:59:59";
    objectReq.secret = ApiKey
    objectReq.extensions = [extension.toString()];
    //objectReq.callStatus = ["ANSWERED", "NOANSWER", "BUSY"];
    objectReq.offset = limit * (page - 1);
    objectReq.limit = limit;

    $.ajax({
        url: url,
        type: "POST",
        data: JSON.stringify(objectReq),
        contentType: 'application/json',
        async: false,
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest);
            console.log(textStatus);
            console.log(errorThrown);
            notiError_SW();
        },
        success: function (result) {
            let data = result
            if (data != null && data.length > 0) {
                dtResult = data;
            } else {
                dtResult = [];
            }
        }
    });
    return dtResult;

}