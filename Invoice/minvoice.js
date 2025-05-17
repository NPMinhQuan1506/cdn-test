
//#region // Login and get code
//async function EInvoice_Author (beforefunc, successfunc, failurefunc, completefunc) {
//    beforefunc();
//    new Promise((resolove) => {
//        setTimeout(() => {
//            AjaxJWT(url = "/api/EInvoice/Author"
//                , data = JSON.stringify({})
//                , async = true
//                , success = function (result) {
//                    let issuccess = 0;
//                    let token = "";
//                    if (result != "0") {
//                        let obj = JSON.parse(result);
//                        if (obj != undefined && obj.token != undefined && obj.token != "") {
//                            issuccess = 1;
//                            token = obj.token;
//                        }
//                    }
//                    if (issuccess == 1) {
//                        author_set('invoicetoken', token);
//                        successfunc();
//                    }
//                    else {
//                        author_set('invoicetoken', '0');
//                        failurefunc();
//                    }
//                    completefunc();
//                }
//            );
//        }, 100)
//    })
//}


//async function EInvoice_Syntax () {
//    new Promise((resolove) => {
//        setTimeout(() => {
//            let token = author_get('invoicetoken');
//            if (token != undefined && token !== "" && token !== "0") {
//                AjaxJWT(url = "/api/EInvoice/Syntax"
//                    , data = JSON.stringify({
//                        'type': 1,
//                        'token': token
//                    })
//                    , async = true
//                    , success = function (result) {
//                        let issuccess = 0;
//                        let value = "";
//                        if (result != "0") {
//                            let obj = JSON.parse(result);
//                            if (obj != undefined && obj.data != undefined && obj.data.length == 1) {
//                                issuccess = 1;
//                                value = obj.data[0].value;
//                            }
//                        }
//                        if (issuccess == 1) {
//                            author_set('invoicecode', value);
//                        }
//                        else {
//                            author_set('invoicecode', '0');
//                        }
//                    }
//                );
//            }
//        }, 100)
//    })
//}
//#endregion

async function EInvoice_TT (typett, editmode, invoicenumber, paymentid, beforefunc, successfunc, failfunc, completefunc) {
    beforefunc();
    new Promise((resolove) => {
        setTimeout(() => {
            let _url = editmode == 1 ? "/api/EInvoice/Save" : "/api/EInvoice/Cancel";
            AjaxJWT(url = _url
                , data = JSON.stringify({
                    'typett': typett,//32,78
                    'editmode': editmode,//1:insert,2:edit,3:delete
                    'invoicenumber': invoicenumber,
                    'paymentid': paymentid
                })
                , async = true
                , success = function (result) {
                    let issuccess = 0;
                    let shdon = "";
                    let message = '';
                    if (result != "0") {
                        let obj = JSON.parse(result);
                        if (obj != undefined) {
                            switch (syn_Einvoicebrand.toLowerCase()) {
                                case "minvoice":
                                    if ((obj?.code ?? "") == "00") {
                                        issuccess = 1;
                                        shdon = editmode == 1 ? obj.data.shdon : "";
                                    }

                                    if (obj.message != undefined) {
                                        message = obj.message;
                                    }
                                    break
                                case "easyinvoice":
                                    if ((obj?.Status ?? 0) == 2) {
                                        issuccess = 1;
                                        shdon = editmode == 1 ? obj.Data.Ikeys : "";
                                    }

                                    if (obj.ErrorCode != undefined && obj.Message != undefined) {
                                        message = obj.ErrorCode + ': ' + obj.Message;
                                    }
                                    break
                            }

                        }


                    }
                    if (issuccess == 1) {
                        successfunc(shdon);
                    }
                    else {
                        failfunc(message);
                    }
                    completefunc();
                }
            );
        }, 100)
    })
}


