
async function APIDSFeedBack_LoadList(limit = 5, beginid = 0, currentid = 0, beforefunc, successfunc, failurefunc, completefunc) {
    if (typeof beforefunc === 'function') beforefunc();
    new Promise((resolve) => {
        setTimeout(() => {
            try {
                AjaxJWT(url = "/api/DocSys/GetFeedBack"
                    , data = JSON.stringify({
                        "limit": limit,
                        "beginid": beginid,
                        "currentid": currentid,
                    })
                    , async = true
                    , success = function (result) {
                        if (result != "0") {
                            if (typeof successfunc === 'function') successfunc(result);
                        }
                        else {
                            if (typeof failurefunc === 'function') failurefunc();
                        }
                        resolve(result);
                        if (typeof completefunc === 'function') completefunc();
                    }
                );
            }
            catch (ex) {
                resolve();
                if (typeof completefunc === 'function') completefunc();
                if (typeof failurefunc === 'function') failurefunc();
            }

        }, 100)
    })
}

