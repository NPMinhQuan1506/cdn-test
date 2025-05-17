
async function APIDSRoadMap_LoadList(limit = 5, beginid = 0, beforefunc, successfunc, failurefunc, completefunc) {
    if (typeof beforefunc === 'function') beforefunc();
    new Promise((resolve) => {
        setTimeout(() => {
            try {
                AjaxJWT(url = "/api/DocSys/GetRoadMap"
                    , data = JSON.stringify({
                        "limit": limit,
                        "beginid": beginid,
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

async function APIDSRoadMap_Read(userid = 0, roadmapid = 0, username = "", empname = "", timeread = '20230101000000', beforefunc, successfunc, failurefunc, completefunc) {
    if (typeof beforefunc === 'function') beforefunc();
    new Promise((resolve) => {
        setTimeout(() => {
            try {
                AjaxJWT(url = "/api/DocSys/ReadRoadMap"
                    , data = JSON.stringify({
                        "userid": userid,
                        "roadmapid": roadmapid,
                        "username": username,
                        "empname": empname,
                        "timeread": timeread,
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
async function APIDSRoadMap_CheckIsReaded(userid = 0, beforefunc, successfunc, failurefunc, completefunc) {
    if (typeof beforefunc === 'function') beforefunc();
    new Promise((resolve) => {
        setTimeout(() => {
            try {
                AjaxJWT(url = "/api/DocSys/CheckIsReaded"
                    , data = JSON.stringify({
                        "userid": userid,
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
