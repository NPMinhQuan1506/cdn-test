// sử dụng load dataType: "jsonp",

function AllLog_CMC_V1(Host, Port, Domain, Limit, dateFrom, dateTo, extension
    , page, UserName, Password, URLRecord, callbackfunction) {

    var data = [];
    var offset = 0
    if (page > 1) {
        offset = (page - 1) * 200;
    } 
  
    let _dF=dateFrom + " 00:00:00";
    let _dT=dateTo + " 23:59:59";    
   
    $.ajax({
        url: Host + ":" + Port + "/api/v2/cdrs?domain=" + Domain + "&limit=" + Limit + "&from=" + _dF + "&to=" + _dT + "&caller_id_number=" + extension + "&offset=" + offset,
        dataType: "jsonp", 
        type: "GET", 
        contentType: 'application/json; charset=utf-8',
        async: false,
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            notiError_SW();
        },
        success: function (result) {
            let outbound = []; 

            let dataOutbound = result.data;
            if (dataOutbound != null && dataOutbound.length > 0) {
                outbound = dataOutbound;
            }  
          
            $.ajax({
                url: Host + ":" + Port + "/api/v2/cdrs?domain=" + Domain + "&limit=" + Limit + "&from=" + _dF + "&to=" + _dT + "&destination_number=" + extension + "&offset=" + offset,
                dataType: "jsonp",
                type: "GET",
                contentType: 'application/json; charset=utf-8',
                async: false,
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    notiError_SW();
                },
                success: function (result) {
                    let inbound = [];
                    let dataInbound = result.data;
                 
                    if (dataInbound != null && dataInbound.length > 0) {
                        inbound = dataInbound;
                    }
                    let allbound = $.merge(inbound, outbound);
                    
                   
                    if (allbound != null && allbound.length > 0) {
                        for (var i = 0; i < allbound.length; i++) {
                            let element = {};
                            let item = allbound[i];
                            element.from = item.caller_id_number;
                            element.to = item.destination_number;
                            element.direction = item.direction;
                            element.duration = item.billsec;
                            element.state = item.call_status;
                            element.recordUrl = item.record_path != null ? URLRecord + item.record_path : "";
                            element.start = SysDate().FTIMESPAN(item.start_epoch).UTCText();
                            element.status = (item.call_status == 'ANSWER' ? 'SUCCESS' : '')
                            data.push(element);
                        } 
                    }  
                    callbackfunction(data); 
                }
    
            }); 
             
        }
    }); 
    return data;
}
 