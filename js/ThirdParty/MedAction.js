async function APIMed_AuthBranch(BranchCode, Password, beforefunc, successfunc, failurefunc, completefunc) {
    if (typeof beforefunc === 'function') beforefunc();
    new Promise((resolve) => {
        setTimeout(() => {

            if (typeof syn_Medbrand != 'undefined' && syn_Medbrand && syn_Medbrand != "") {
                AjaxJWT(url = "/api/NationalMed/AuthBranch"
                    , data = JSON.stringify({
                        "ma_lien_thong_co_so_kham_chua_benh": BranchCode,
                        "password": Password,
                    })
                    , async = true
                    , success = function (result) {
                        if (result != "0") {
                            if (typeof successfunc === 'function') successfunc(result);
                        }
                        else {
                            if (typeof failurefunc === 'function') failurefunc();
                        }
                        resolve();
                        if (typeof completefunc === 'function') completefunc();
                    }
                );
            }
        }, 100)
    })
}
async function APIMed_AuthDoc (DocCode, BranchCode , password, beforefunc, successfunc, failurefunc, completefunc) {
    if (typeof beforefunc === 'function') beforefunc();
    new Promise((resolve) => {
        setTimeout(() => {
              
            if (typeof syn_Medbrand != 'undefined' && syn_Medbrand && syn_Medbrand != "") {
                AjaxJWT(url = "/api/NationalMed/AuthDoc"
                    , data = JSON.stringify({
                        "DocCode": DocCode,
                        "BranchCode": BranchCode,
                        "password": password,
                    })
                    , async = true
                    , success = function (result) {
                        if (result != "0") {
                            if (typeof successfunc === 'function') successfunc(result);
                        }
                        else {
                            if (typeof failurefunc === 'function') failurefunc();
                        }
                        resolve();
                        if (typeof completefunc === 'function') completefunc();
                    }
                );
            }
        }, 100)
    })
}
async function APIMed_RegisDoc(Medusername, MedBranchCode, Token, beforefunc, successfunc, failurefunc, completefunc) {
    if (typeof beforefunc === 'function') beforefunc();
    new Promise((resolve) => {
        setTimeout(() => {

            if (typeof syn_Medbrand != 'undefined' && syn_Medbrand && syn_Medbrand != "") {
                AjaxJWT(url = "/api/NationalMed/RegisDoc"
                    , data = JSON.stringify({
                        "DocCode": Medusername,
                        "BranchCode": MedBranchCode,
                        "Token": Token
                    })
                    , async = true
                    , success = function (result) {
                        if (typeof successfunc === 'function') successfunc(result);
                        resolve();
                        if (typeof completefunc === 'function') completefunc();
                    }
                );
            }
        }, 100)
    })
}

async function APIMed_UnRegisDoc(Medusername, MedBranchCode, Token, beforefunc, successfunc, failurefunc, completefunc) {
    if (typeof beforefunc === 'function') beforefunc();
    new Promise((resolve) => {
        setTimeout(() => {

            if (typeof syn_Medbrand != 'undefined' && syn_Medbrand && syn_Medbrand != "") {
                AjaxJWT(url = "/api/NationalMed/UnRegisDoc"
                    , data = JSON.stringify({
                        "DocCode": Medusername,
                        "BranchCode": MedBranchCode,
                        "Token": Token,
                    })
                    , async = true
                    , success = function (result) {
                        if (typeof successfunc === 'function') successfunc(result);
                        resolve();
                        if (typeof completefunc === 'function') completefunc();
                    }
                );
            }
        }, 100)
    })
}

async function APIMed_Create(CurrentID, custid, accountid, token, beforefunc, successfunc, failurefunc, completefunc) {
    if (typeof beforefunc === 'function') beforefunc();
    new Promise((resolve) => {
        setTimeout(() => {

            if (typeof syn_Medbrand != 'undefined' && syn_Medbrand && syn_Medbrand != "") {
                AjaxJWT(url = "/api/NationalMed/Create"
                    , data = JSON.stringify({
                        "PrescriptionID": CurrentID,
                        "page": apia_getpath(),
                        "custid": custid,
                        "accountid": accountid,
                        "userid": sys_userID_Main,
                        "token": token
                    })
                    , async = true
                    , success = function (result) {
                        if (result == "1") {
                            if (typeof successfunc === 'function') successfunc(result);
                        }
                        else {
                            if (typeof failurefunc === 'function') failurefunc(result);
                        }
                        resolve();
                        if (typeof completefunc === 'function') completefunc();
                    }
                );
            }
        }, 100)
    })
}
