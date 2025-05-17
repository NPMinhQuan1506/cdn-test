//function Pan_Listpage () {
//    AjaxJWT(url = "/api/Pancake/Listpage"
//        , data = JSON.stringify({

//        })
//        , async = true
//        , success = function (result) {
//            if (result != "0") {
//                console.log(JSON.parse(result))
//            }
//            else {

//            }
//        }
//    );
//}
//function Pan_Listconver (since, until, page_number, pageid) {

//    AjaxJWT(url = "/api/Pancake/ListConver"
//        , data = JSON.stringify({
//            'since': since,
//            'until': until,
//            'page_number': page_number,
//            'pageid': pageid,
//        })
//        , async = true
//        , success = function (result) {
//            if (result == "1") {
//                notiSuccess();
//            }
//            else {
//                notiError();
//            }
//        }
//    );
//}
function Pan_download(dateto, page_number = 1, fnbefore, fncomplete) {
    try {
        dateto = dateto ?? new Date();
        let diffDay = -30;
        let util = Math.round((dateto).getTime() / 1000);
        let since = Math.round((dateto).addDays(diffDay).getTime() / 1000);
        Pan_ListTagAll();
        Pan_ListconverAll(since.toString(), util.toString(), page_number
            , fnbefore
            , fncomplete);
    }
    catch (e) {

    }

}
function Pan_ListTagAll () {
    if ((syn_PancakeURL ?? "") != "") {
        AjaxJWT(url = "/api/Pancake/ListTagAll"
            , data = JSON.stringify({})
            , async = true
            , success = function (result) {
                if (result == "1") {
                    notiSuccess();
                }
                else {
                    notiError();
                }
            }
        );
    }
    else {
        notiError();
    }
}

async function Pan_UpdateTag(converid, uid, pid, tagid, action, fnbefore, fncomplete) {
    return new Promise(resolve => {
        if ((syn_PancakeURL ?? "") != "") {
            AjaxJWT(url = "/api/Pancake/UpdateTag"
                , data = JSON.stringify({
                    'converid': converid,
                    'uid': uid,
                    'pid': pid,
                    'tagid': tagid,
                    'action': action
                })
                , async = true
                , success = function (result) {
                    if (result == "1") {
                        notiSuccess();                        
                    }
                    else {
                        notiError();
                    }
                    if (typeof fncomplete === "function") fncomplete();
                }
                , before = function (e) {
                    if (typeof fnbefore === "function") fnbefore();
                }
            );
        }
        else {
            notiError();
        }
        resolve(1);
    })

}
function Pan_ListconverAll(since, until, page_number, fnbefore, fncomplete) {
    if ((syn_PancakeURL ?? "") != "") {
        AjaxJWT(url = "/api/Pancake/ListConverAll"
            , data = JSON.stringify({
                'since': since,
                'until': until,
                'page_number': page_number
            })
            , async = true
            , success = function (result) {
                if (result == "1") {
                    notiSuccess();
                   
                }
                else {
                    notiError();
                }
                if (typeof fncomplete === "function") fncomplete();
            }
            , before = function (e) {
                if (typeof fnbefore === "function") fnbefore();
            }
        );
    }
    else {
        notiError();
    }

}