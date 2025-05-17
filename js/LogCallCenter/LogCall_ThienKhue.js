 
function AllLog_ThienKhue (APIbaseurl, Api_Key, DomainAPI, dateFrom, dateTo, typebound, extension, page) {
     
    let dtResult;
    let url = APIbaseurl + "/call-logs/" + typebound;
    let _dF=new Date(dateFrom) ;
    let _dT=new Date(dateTo);

    let DF_TimeSpan = _dF.getTime();
    let DT_TimeSpan = _dT.addDays(1).addMinutes(-1).getTime();
    let data = {};
    if (extension.length < 9) {
        data = {
            'fromTime': DF_TimeSpan
            , 'queryTime': DT_TimeSpan
            , 'extension': extension
            , 'page': page
        }
    } else {
        data = {
            'fromTime': DF_TimeSpan
            , 'queryTime': DT_TimeSpan
            , 'phonenumber': extension
            , 'page': page
        }
    }

    $.ajax({
        url: url,
        dataType: "json",
        headers: {
            "Authorization": Api_Key,
            "Domain": DomainAPI
        },
        type: "POST",
        data: JSON.stringify(data),
        contentType: 'application/json; charset=utf-8',
        async: false,
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            notiError_SW();
        },
        success: function (result) {
            let data = result.data.items
            if (data.length > 0) {
                dtResult = data;
            } else {
                dtResult = [];
            }
        }
    });
    return dtResult;

}