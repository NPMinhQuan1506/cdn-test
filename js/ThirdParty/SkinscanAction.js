function APISkinscan_Getdata(unions, scanId = "", token, skinPerson = 0, beforefunc, successfunc, failurefunc, completefunc) {
    if (typeof beforefunc === 'function') beforefunc();
    new Promise((resolve) => {
        setTimeout(() => {

            if (typeof syn_Skinscanbrand != "undefined" && syn_Skinscanbrand && syn_Skinscanbrand != "") {
                AjaxJWT(url = "/api/Skinscan/GetResultScan"
                    , data = JSON.stringify({
                        "unionid": unions,
                        "scanId": scanId,
                        "token": token,
                        "skinPerson": skinPerson,
                    })
                    , async = true
                    , success = function (result) {
                        if (result != "0") {
                            if (typeof successfunc === 'function') successfunc(result)
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