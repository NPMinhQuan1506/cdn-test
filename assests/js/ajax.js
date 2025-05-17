var Blodmax_size = 1500;
var Local_TimeOut = 'TimeOut';
var LocalFlag_TimeOut = false;

//#region // Abort Ajax
var Global_AjaxLoad = {};
function AjaxLoad_XhrIsExist(url) {
    if (url == undefined || url == '') return;
    if (Global_AjaxLoad[url] != undefined) {
        if (Global_AjaxLoad[url].readyState != 4)
            Global_AjaxLoad[url].abort();
        AjaxLoad_XhrDelete(url);
    }
}
function AjaxLoad_XhrPush(url, xhr) {
    if (url == undefined || url == '') return;
    if (Global_AjaxLoad[url] == undefined) {
        Global_AjaxLoad[url] = xhr;
    }
}
function AjaxLoad_XhrDelete(url) {
    if (url == undefined || url == '') return;
    if (Global_AjaxLoad[url] != undefined) {
        delete Global_AjaxLoad[url];
    }
}
function AjaxLoad_XhrComplete() {
    try {
        if (LocalFlag_TimeOut) return;
        let dataTimeOut = JSON.parse(localstorage_get("TimeOut")).data;
        if (dataTimeOut == undefined || dataTimeOut == "" || dataTimeOut?.TimeOut == undefined || dataTimeOut?.TimeOut == 0) return;
        var tnow = new Date();
        var texp = new Date(dataTimeOut?.TimeExpired);



        if (tnow > texp) {
            LocalFlag_TimeOut = true;
            AjaxApi(url = "/api/Author/Clear"
                , data = JSON.stringify({ Islogout: 1 })
                , async = true
            );
            AjaxLoad_SessionExpired();
        }
        else {
            let timeout = '';
            let _e = {};
            let _timeExp = new Date(tnow);
            _timeExp.setMinutes(_timeExp.getMinutes() + dataTimeOut?.TimeOut)
            _e.TimeOut = dataTimeOut?.TimeOut;
            _e.DateTimeNow = tnow
            _e.TimeExpired = _timeExp;
            timeout = _e;
            localstorage_set("TimeOut", timeout);
        }
    }
    catch (ex) {

    }
}
function AjaxLoad_DecomJson(text) {
    try {
        const compressedBytes = Uint8Array.from(atob(text), c => c.charCodeAt(0));
        return pako.inflate(compressedBytes, { to: 'string' }) ?? text;
    }
    catch (ex) {
        return text;
    }
}

function AjaxLoad_SessionExpired() {
    Swal.fire({
        title: `${Outlang["Phien_da_het_han"]}!`,
        imageUrl: "/assests/img/image-session-expired.svg",
        imageWidth: 150,
        width: 600,
        html: decodeHtml(`<span class="text-secondary">${Outlang["Vui_long_dang_nhap_lai"]}</span>`),
        allowOutsideClick: false,
        confirmButtonText: `${Outlang['Lam_moi']}`,
        customClass: {
            popup: "shadow shadow-lg",
            title: "text-dark fs-4",
            htmlContainer: 'mt-0',
            confirmButton: 'btn bg-image-none',
            image: ""
        }
    }).then(function () {
        window.location.replace("/login/login");
    });
}

//#endregion 

function AjaxLoad(url, data, async, error, success, sender, before, complete, nolimit) {
    var xhrequest = $.ajax({
        url: url,
        type: "POST",
        data: data,
        contentType: 'application/x-www-form-urlencoded',
        async: async,
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            if (error != undefined && error != null && error.length != 0) error();
        },
        success: function (result) {
            if (nolimit == undefined) AjaxLoad_XhrDelete(url);
            if (result != undefined)
                if (success != undefined && success != null && success.length != 0) success(AjaxLoad_DecomJson(result));
        },
        beforeSend: function (xhr) {
            if (nolimit == undefined) AjaxLoad_XhrIsExist(url);
            xhr.setRequestHeader("XSRF-TOKEN",
                $('input:hidden[name="__RequestVerificationToken"]').val());
            if (before != undefined && before != null && before.length != 0) before();
            if (sender != undefined && sender != null && sender.length != 0)
                sender.css('pointer-events', 'none');
        },
        complete: function (e) {
            if (complete != undefined && complete != null && complete.length != 0) complete(e);
            if (sender != undefined && sender != null && sender.length != 0) sender.css('pointer-events', 'auto');
            AjaxLoad_XhrComplete();
        }
    });
    if (nolimit == undefined) AjaxLoad_XhrPush(url, xhrequest);
    return xhrequest;
}

function AjaxJWT(url, data, async, success, before, error, complete, sender) {
    var xhrequest = $.ajax({
        url: url,
        type: "POST",
        data: data,
        contentType: 'application/json; charset=utf-8',
        async: async,
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            if (error != undefined && error != null && error.length != 0) error();
        },
        success: function (result) {
            AjaxLoad_XhrDelete(url);
            if (result != undefined)
                if (success != undefined && success != null && success.length != 0)
                    success(AjaxLoad_DecomJson(result));
        }
        , beforeSend: function (xhr) {
            AjaxLoad_XhrIsExist(url);
            xhr.setRequestHeader("Authorization", "Bearer " + (localStorage.getItem("WebToken") != "" ? localStorage.getItem("WebToken") : getCookie("WebToken")));
            if (before != undefined && before != null && before.length != 0) before();
            if (sender != undefined && sender != null && sender.length != 0)
                sender.css('pointer-events', 'none');
        },
        complete: function (e) {
            if (complete != undefined && complete != null && complete.length != 0) complete(e);
            if (sender != undefined && sender != null && sender.length != 0) sender.css('pointer-events', 'auto');
            AjaxLoad_XhrComplete();
        }
    });
    AjaxLoad_XhrPush(url, xhrequest);
    return xhrequest;
}
function AjaxApi(url, data, async, success, before, complete) {
    $.ajax({
        url: url,
        type: "POST",
        data: data,
        contentType: 'application/json; charset=utf-8',
        async: async,
        success: function (result) {
            if (result != undefined)
                if (success != undefined && success != null && success.length != 0)
                    success(AjaxLoad_DecomJson(result));
        },
        beforeSend: function (e) {
            if (before != undefined && before != null && before.length != 0) before();
        },
        complete: function (e) {
            if (complete != undefined && complete != null && complete.length != 0) complete(e);
        }
    });
}

function AjaxUpload(url, inputid, success, error, before, complete) {
    $('#' + inputid).unbind("change");
    $('#' + inputid).change(function () {
        let input = document.getElementById(inputid);
        let files = input.files;
        let formData = new FormData();
        for (let i = 0; i != files.length; i++) {
            formData.append("files", files[i]);
        }
        $.ajax(
            {
                url: url,
                data: formData,
                processData: false,
                contentType: false,
                type: "POST",
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    if (error != undefined && error != null && error.length != 0) error();
                },
                success: function (result) {
                    if (result != undefined)
                        if (success != undefined && success != null && success.length != 0)
                            success(AjaxLoad_DecomJson(result));
                },
                beforeSend: function (xhr) {
                    if (typeof before === 'function') before();
                    xhr.setRequestHeader("Authorization", "Bearer " + (localStorage.getItem("WebToken") != "" ? localStorage.getItem("WebToken") : getCookie("WebToken")));
                },
                complete: function (xhr) {
                    if (typeof complete === 'function') complete();
                    AjaxLoad_XhrComplete();
                }
            }
        );
    })
}
function AjaxUpload_Multi(url, inputid, success, error, before, complete, funmaxrange) {
    $('#' + inputid).unbind("change");
    $('#' + inputid).change(function () {
        var promises = [];
        let input = document.getElementById(inputid);
        let files = input.files;
        if (files.length <= 0 || files.length > 5) {
            if (funmaxrange != undefined && funmaxrange != null)
                funmaxrange();
        }
        else {
            for (let i = 0; i != files.length; i++) {
                let originalFile = files[i];
                let originalName = originalFile.name;
                let extension = originalName.substring(originalName.lastIndexOf('.'));
                let nameOnly = originalName.substring(0, originalName.lastIndexOf('.'));
                let cleanName = nameOnly.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9.\-_]/g, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "") + extension;
                let _newFiles = new File([originalFile], cleanName, {
                    type: originalFile.type,
                    lastModified: originalFile.lastModified
                });
                let dataTransfer = new DataTransfer();
                dataTransfer.items.add(_newFiles);
                input.files = dataTransfer.files;

                promises.push(AjaxUpload_MultiExe(url, _newFiles, _newFiles.name, success, error, before));
            }
            Promise.all(promises).then((values) => { });
        }
    });
}
function AjaxUpload_MultiExe(url, file, namefile, success, error, before) {
    return new Promise(resolve => {
        let formData = new FormData();
        formData.append("files", file);
        $.ajax(
            {
                url: url,
                data: formData,
                processData: false,
                contentType: false,
                type: "POST",
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    if (error != undefined && error != null && error.length != 0) error(namefile);
                },
                success: function (result, e) {
                    if (result != undefined) {
                        if (success != undefined && success != null && success.length != 0)
                            success(AjaxLoad_DecomJson(result), namefile);
                    }
                    resolve(true);
                },
                beforeSend: function (xhr, e) {
                    xhr.setRequestHeader("Authorization", "Bearer " + (localStorage.getItem("WebToken") != "" ? localStorage.getItem("WebToken") : getCookie("WebToken")));
                    if (before != undefined && before != null && before.length != 0)
                        before(namefile);
                },
                complete: function (e) {
                    AjaxLoad_XhrComplete();
                }

            }
        );
    });

}
function AjaxSendEmail(url, formData, async, success, error, before, complete) {
    return new Promise(resolve => {
        $.ajax(
            {
                url: url,
                data: formData,
                processData: false,
                contentType: false,
                async: async,
                type: "POST",
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    if (error != undefined && error != null && error.length != 0) error();
                },
                success: function (result, e) {
                    if (result != undefined)
                        if (success != undefined && success != null && success.length != 0)
                            success(AjaxLoad_DecomJson(result));
                },
                beforeSend: function (xhr, e) {
                    xhr.setRequestHeader("Authorization", "Bearer " + (localStorage.getItem("WebToken") != "" ? localStorage.getItem("WebToken") : getCookie("WebToken")));
                    if (before != undefined && before != null && before.length != 0) before();
                },
                complete: function (e) {
                    if (complete != undefined && complete != null && complete.length != 0) complete(e);
                    AjaxLoad_XhrComplete();
                }
            }
        );
    });
}

function AjaxSendEmailMulti(url, formData, async, success, error, before, complete) {
    return new Promise(resolve => {
        $.ajax(
            {
                url: url,
                data: formData,
                processData: false,
                contentType: false,
                async: async,
                type: "POST",
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    if (error != undefined && error != null && error.length != 0) error();
                },
                success: function (result, e) {
                    if (result != undefined)
                        if (success != undefined && success != null && success.length != 0)
                            success(AjaxLoad_DecomJson(result));
                },
                beforeSend: function (xhr, e) {
                    xhr.setRequestHeader("Authorization", "Bearer " + (localStorage.getItem("WebToken") != "" ? localStorage.getItem("WebToken") : getCookie("WebToken")));
                    if (before != undefined && before != null && before.length != 0) before();
                },
                complete: function (e) {
                    if (complete != undefined && complete != null && complete.length != 0) complete(e);
                    AjaxLoad_XhrComplete();
                }
            }
        );
    });
}

function AjaxUpload_Image(url, inputid) {
    return new Promise((resolve, reject) => {
        let input = document.getElementById(inputid);
        let files = input.files;
        let formData = new FormData();
        for (let i = 0; i != files.length; i++) {
            formData.append("files", files[i]);
        }

        var xhrequest = $.ajax({
            url: url,
            data: formData,
            processData: false,
            contentType: false,
            type: "POST",
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                resolve('');
            },
            success: function (result) {
                AjaxLoad_XhrDelete(url);
                if (result != undefined) resolve(AjaxLoad_DecomJson(result));
            },
            beforeSend: function (xhr) {
                AjaxLoad_XhrIsExist(url);
                xhr.setRequestHeader("Authorization", "Bearer " + (localStorage.getItem("WebToken") != "" ? localStorage.getItem("WebToken") : getCookie("WebToken")));
            },
            complete: function (e) {
                AjaxLoad_XhrComplete();
            }
        });

        AjaxLoad_XhrPush(url, xhrequest);

    });
}
function AjaxUpload_ImageByfile(url, file) {
    return new Promise((resolve, reject) => {
        let formData = new FormData();
        formData.append("files", file);
        var xhrequest = $.ajax({
            url: url,
            data: formData,
            processData: false,
            contentType: false,
            type: "POST",
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                resolve('');
            },
            success: function (result) {
                AjaxLoad_XhrDelete(url);
                if (result != undefined) resolve(AjaxLoad_DecomJson(result));
            },
            beforeSend: function (xhr) {
                AjaxLoad_XhrIsExist(url);
                xhr.setRequestHeader("Authorization", "Bearer " + (localStorage.getItem("WebToken") != "" ? localStorage.getItem("WebToken") : getCookie("WebToken")));
            }
        });
        AjaxLoad_XhrPush(url, xhrequest);
    });
}
//#region //upload customer img
function AjaxUpload_CustImg(url, inputid, isresize, success, error, before, complete, funmaxrange) {
    $('#' + inputid).unbind("change");
    $('#' + inputid).change(function () {
        var promises = [];
        let input = document.getElementById(inputid);
        let files = input.files;
        if (files.length <= 0 || files.length > 5) {
            if (funmaxrange != undefined && funmaxrange != null)
                funmaxrange();
        }
        else {
            for (let i = 0; i != files.length; i++) {
                let originalFile = files[i];
                let originalName = originalFile.name;
                let extension = originalName.substring(originalName.lastIndexOf('.'));
                let nameOnly = originalName.substring(0, originalName.lastIndexOf('.'));
                let cleanName = nameOnly.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9.\-_]/g, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "") + extension;
                let _newFiles = new File([originalFile], cleanName, {
                    type: originalFile.type,
                    lastModified: originalFile.lastModified
                });
                let filesize = _newFiles.size;
                let sizeInMB = (filesize / (1024 * 1024)).toFixed(2);
                if (sizeInMB < 3) {
                    promises.push(AjaxUpload_CustImgExe(url, _newFiles, _newFiles.name, _newFiles.size, success, error, before));
                }
                else {
                    if (isresize == 1) {
                        Imagesize_Resize(_newFiles, before, _newFiles.name
                            , function (resizedImage, _filename) {
                                let _refile = new File([resizedImage], _filename, {
                                    type: resizedImage.type,
                                });
                                promises.push(AjaxUpload_CustImgExe(url, _refile, _filename, _refile.size, success, error, before));
                            }
                        )
                    }
                }
            }
            Promise.all(promises).then((values) => { });
        }
    });
}
async function AjaxUpload_CustImgExe(url, file, namefile, filesize, success, error, before) {
    return new Promise(resolve => {
        let formData = new FormData();
        formData.append("files", file);
        $.ajax(
            {
                url: url,
                data: formData,
                processData: false,
                contentType: false,
                type: "POST",
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    if (error != undefined && error != null && error.length != 0) error(namefile);
                },
                success: function (result, e) {
                    if (result != undefined) {
                        if (success != undefined && success != null && success.length != 0)
                            success(AjaxLoad_DecomJson(result), namefile, filesize);
                    }
                    resolve(true);
                },
                beforeSend: function (xhr, e) {
                    xhr.setRequestHeader("Authorization", "Bearer " + (localStorage.getItem("WebToken") != "" ? localStorage.getItem("WebToken") : getCookie("WebToken")));
                    if (before != undefined && before != null && before.length != 0)
                        before(namefile);
                }
            }
        );
    });
}
async function Imagesize_Resize(fileitem, before, namefile, onCallback) {
    return new Promise(resolve => {
        before(namefile);
        var reader = new FileReader();
        reader.onload = function (readerEvent) {
            var image = new Image();
            image.onload = function () {
                var canvas = document.createElement('canvas'),
                    max_size = Blodmax_size,
                    width = image.width,
                    height = image.height;
                if (width > height) {
                    if (width > max_size) {
                        height *= max_size / width;
                        width = max_size;
                    }
                } else {
                    if (height > max_size) {
                        width *= max_size / height;
                        height = max_size;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                canvas.getContext('2d').drawImage(image, 0, 0, width, height);
                var dataUrl = canvas.toDataURL('image/jpeg');
                var resizedImage = dataURLToBlob(dataUrl);
                onCallback(resizedImage, namefile);
            }
            image.src = readerEvent.target.result;
        }
        reader.readAsDataURL(fileitem);
    });
}
var dataURLToBlob = function (dataURL) {
    var BASE64_MARKER = ';base64,';
    if (dataURL.indexOf(BASE64_MARKER) == -1) {
        var parts = dataURL.split(',');
        var contentType = parts[0].split(':')[1];
        var raw = parts[1];

        return new Blob([raw], { type: contentType });
    }

    var parts = dataURL.split(BASE64_MARKER);
    var contentType = parts[0].split(':')[1];
    var raw = window.atob(parts[1]);
    var rawLength = raw.length;

    var uInt8Array = new Uint8Array(rawLength);

    for (var i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
}
//#endregion