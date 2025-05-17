async function APIDSSampleImage_LoadList(IsDencos = 0, Category = 'servicecare', beforefunc, successfunc, failurefunc, completefunc) {
    if (typeof beforefunc === 'function') beforefunc();
    new Promise((resolve) => {
        setTimeout(() => {
            try {
                AjaxJWT(url = "/api/DocSys/SampleImage/LoadList"
                    , data = JSON.stringify({
                        "IsDencos": IsDencos,
                        "Category": Category,
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