function xoa_dau(str) {
    try {
        str = str.toString();
        str = str.trim();
        str = str.normalize('NFC');
        str = str.replace(/[\u0300-\u036f]/g, '');
        str = str.replace(/[đĐ]/g, m => m === 'đ' ? 'd' : 'D');
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ/g, "d");
        str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
        str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
        str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
        str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
        str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
        str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
        str = str.replace(/Đ/g, "D");
        return str;
    }
    catch (ex) {
        return str;
    }

}

function normalizeSpaces(input) {
    try {
        return input.replace(/\s+/g, ' ').trim();
    }
    catch (e) {
        return input
    }

}
function removeSpecChar(str) {
    if(str==undefined||str==null) return '';

    const regex=new RegExp(
        '[^a-zA-Z0-9\\s'+
        '\u0E00-\u0E7F'+ // Thai
        '가-힣'+         // Korean
        'ぁ-んァ-ン'+     // Japanese Hiragana/Katakana
        '一-龯'+         // Kanji
        'äöüßÄÖÜñáéíóúàèìòùâêîôûçãõẽñÑÁÉÍÓÚÀÈÌÒÙÂÊÎÔÛÇÃÕẼÕёЁ'+ // Latin with accents
        'ក-\u17FF'+     // Khmer
        'ກ-\u17D6'+     // Lao
        '\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF'+
        '\u3040-\u309F\u30A0-\u30FF\u31F0-\u31FF'+
        '\u2E80-\u2EFF\u1100-\u11FF\u3130-\u318F\uAC00-\uD7AF\u31A0-\u31BF'+
        '\uFF00-\uFFEF\u0370-\u03FF\u0400-\u04FF'+
        ']+','g'
    );

    return str.replace(regex,'');
}

function sys_cleanFile(originalFile) {
    try {
        let originalName = originalFile.name;
        let extension = originalName.substring(originalName.lastIndexOf('.'));
        let nameOnly = originalName.substring(0, originalName.lastIndexOf('.'));
        let cleanName = nameOnly.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9.\-_]/g, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "") + extension;
        let _newFiles = new File([originalFile], cleanName, {
            type: originalFile.type,
            lastModified: originalFile.lastModified
        });
        return _newFiles
    }
    catch (err) {
        return originalFile;
    }
}

function decodeHtmlEntity(text) {
    return text.replace(/&#x([0-9a-f]+);/gi, function (match, dec) {
        return String.fromCharCode(parseInt(dec, 16));
    });
}
function formatHTML(str) {
    str = $('<p>' + str + '</p>').text();
    return str;
}
function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}
function extract_numberic(str) {
    try {
        str = str.match(/\d/g);
        str = str.join("");
        return str;
    }
    catch (err) {
        return "";
    }
}
function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[arr.length - 1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}

//! Encrypt the phone number into 10 character string
function encrypt_phone(phone) {
    try {
        let result = "";
        if (phone != undefined && phone.length > 0) {
            phone = phone.replace(/[^0-9]/g, '');
            let date = new Date();
            let day = ("0" + date.getDate()).slice(-2);
            let month = ("0" + (date.getMonth() + 1)).slice(-2);
            let year = date.getFullYear();

            let stringdate = year.toString() + month.toString() + day.toString() + phone;
            result = btoa(stringdate)
        }
        return result;
    } catch (ex) {
        return "";
    }
}

function decrypt_phone(phone_encrypt) {
    let result = "";
    if (phone_encrypt != undefined && phone_encrypt.length > 0) {
        let temp = atob(phone_encrypt);
        result = temp.substr(8);
    }
    return result;
}

function isFunction(func) {
    if (typeof func === 'function') return true;
    return false;
}
//#region // Cookie
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    try {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";

    }
    catch (ex) {
        return "";
    }

}
//#endregion


//#reigon // PASTE DATA
function catchPaste(evt, elem, callback) {
    if (evt.originalEvent && evt.originalEvent.clipboardData) {
        callback(evt.originalEvent.clipboardData.getData('text'));
    } else if (evt.clipboardData) {
        callback(evt.clipboardData.getData('text/plain'));
    } else if (window.clipboardData) {
        callback(window.clipboardData.getData('Text'));
    } else {
        setTimeout(function () {
            callback(elem.value)
        }, 100);
    }
}
//#endregion


//#region // Search Last Name

function getLastName(text = '') {
    //try{
    let name = text?.trim()?.split(' ');
    return name[name.length - 1] ?? "";
    //}
    //catch(ex){
    //    return '';
    //}
}

function CheckIsSeachLastName(fullname = '') {
    try {
        let name = fullname?.trim()?.split(' ');
        if (((name.length - 1) ?? 1) == 0 && name != xoa_dau(fullname)) return true;
        return false;
    }
    catch (ex) {
        return fasle;
    }
}


//#endregion

//#region // Load image empty
function syschart_nodata(id) {
    try {
        let tagname = $("#" + id).get(0).tagName;
        if (tagname.toLowerCase() == "canvas") {
            let canvas = document.getElementById(id);
            let ctx3 = canvas.getContext("2d");
            ctx3.clearRect(0, 0, canvas.width, canvas.height);
            ctx3.fillStyle = "#99979708";
            ctx3.fillRect(0, 0, canvas.width, canvas.height);
            ctx3.fillStyle = "#9e9e9e61";
            ctx3.font = '20px sans-serif';
            ctx3.textBaseline = 'middle';
            ctx3.textAlign = "center";
            ctx3.fillText('No data available', canvas.width / 2, canvas.height / 2);

            //var base_image = new Image();
            //base_image.onload = function () {
            //   // let canvas = document.getElementById(id);
            //   // let ctx3 = canvas.getContext("2d");
            //   // ctx3.clearRect(0, 0, canvas.width, canvas.height);
            //   // ctx3.drawImage(base_image,
            //   //     canvas.width / 2 - base_image.width / 2,
            //   //     canvas.height / 2 - base_image.height / 2
            //   // );
            //   //// ctx3.drawImage(base_image, 0, 0, 100, 100 * base_image.height / base_image.width)



            //}
            //base_image.src = '/Image/empty.svg';
        }
    }
    catch (ex) {
    }
}
//#endregion


//#region // TriggerTab
$.fn.triggerTab = function (callback) {
    return this.each(function () {
        var $triggerEl = $(this);
        var tabTrigger = new bootstrap.Tab($triggerEl[0]);
        $triggerEl.on('click', function (event) {
            event.preventDefault();
            tabTrigger.show();
            if (typeof callback === 'function') {
                callback.call(this);
            }
        });
    });
};

//#endregion

function Base64ToFile(base64Data, filename, mimeType) {
    try {

        base64Data = window.btoa(unescape(encodeURIComponent(base64Data)));
        var byteString = atob(base64Data);
        var arrayBuffer = new ArrayBuffer(byteString.length);
        var int8Array = new Uint8Array(arrayBuffer);
        for (let i = 0; i < byteString.length; i++) {
            int8Array[i] = byteString.charCodeAt(i);
        }
        var blob = new Blob([arrayBuffer], { type: mimeType });
        return new File([blob], filename, { type: mimeType });
    }
    catch (ex) {
        return undefined;
    }
}

function TryParseObject(json) {
    try {
        return JSON.parse(json);
    }
    catch {
        return undefined;
    }
}
function NumberToStringUnit(str, fixnum, isshort, classunit) {
    try {

        let unit;
        if (isshort == true) {
            unit = [Outlang["Dv_tyshort"], Outlang["Dv_trieushort"], Outlang["Dv_nginshort"]];
        }
        else {
            unit = [Outlang["Dv_ty"], Outlang["Dv_trieu"], Outlang["Dv_ngin"]];
        }
        let re = "0";
        let bil = 1000000000;
        let mil = 1000000;
        let thou = 1000;
        if (!isNaN(str) && !isNaN(parseFloat(str))) {
            if (str >= bil) {
                let devi = str / bil;
                if (devi == devi.toFixed(fixnum)) re = devi;
                else re = devi.toFixed(fixnum);
                if (classunit != undefined && classunit != "") {
                    re = formatNumber(re) + `<span class="${classunit}">${unit[0]}</span>`;
                }
                else re = formatNumber(re) + " " + unit[0];
            }
            else if (str >= mil) {
                let devi = str / mil;
                if (devi == devi.toFixed(fixnum)) re = devi;
                else re = devi.toFixed(fixnum);
                if (classunit != undefined && classunit != "") {
                    re = formatNumber(re) + `<span class="${classunit}">${unit[1]}</span>`;
                }
                else re = formatNumber(re) + " " + unit[1];



            }
            else if (str >= thou) {
                let devi = str / thou;
                if (devi == devi.toFixed(fixnum)) re = devi;
                else re = devi.toFixed(fixnum);
                if (classunit != undefined && classunit != "") {
                    re = formatNumber(re) + `<span class="${classunit}">${unit[2]}</span>`;
                }
                else re = formatNumber(re) + " " + unit[2];
            }
            else {
                re = formatNumber(str);
            }
        }
        return re;
    }
    catch {
        return "0";
    }
}

function sys_GetWordName(name, numword = 2, minChar = 6, maxChar = 15) {
    try {
        let parts = xoa_dau(name).split(" ");
        let lngName = parts.length;
        let condi = (lngName - numword) > 0 ? (lngName - numword) : 0;
        let result = [];
        for (let i = lngName - 1; i >= condi; i--) {
            let word = parts[i];
            result.push((word ?? ""));
        }

        result = result.reverse().join('') || "vt12345";
        let subChar = result.length - minChar;
        let strPadEnd = subChar < 0 ? Array.from({ length: Math.abs(subChar) }, (_, i) => i + 1).join('') : result
        result = result.padEnd(minChar, strPadEnd).substring(0, maxChar);

        return result;
    }
    catch (ex) {
        return "vt12345".padEnd(minChar, '@').substring(0, maxChar);
    }

}

function sys_GetFirstCharName(text) {
    try {
        let parts = text.split(" ");
        let lastname = parts[parts.length - 1];
        return lastname.charAt(0);
    }
    catch (ex) {
        return "VT";
    }

}

function sys_ValidPhoneNotVN(idInputPhone, isVN, attrName) {
    if (isVN && isVN == 1) {
        $(`#${idInputPhone}`).attr('name', attrName ?? '');
        $(`#${idInputPhone}`).attr("maxlength", "16");
    } 
}

//function sys_GetValue_ByControl(data, type) {
//    try {
//        let _r = {};
//        switch (type) {
//            case "d":
//                if (data && data != '') {
//                    if (data.includes('to')) {
//                        let dateTemp = data.split(" to ");
//                        _r.DateFrom = dateTemp[0];
//                        _r.DateTo = dateTemp[1];
//                    } else {
//                        _r.DateFrom = data;
//                        _r.DateTo = data;
//                    }
//                } else {
//                    _r.DateFrom = "1900-01-01";
//                    _r.DateTo = "1900-01-01";
//                }
//                break;
//            case "s":
//                if (data && data != '') {
//                    _r.value = ',' + data + ',';
//                } else {
//                    _r.value = "";
//                }
//                break;
//            case "n":
//                if (data && data != '' && data != "0") {
//                    _r.value = Number(data);
//                } else {
//                    _r.value = 0;
//                }
//                break;
//            case "b":
//                if (data && data != '') {
//                    if (data.includes('to')) {
//                        let dateTemp = data.split(" to ");
//                        let DateFrom = dateTemp[0].split("-");
//                        let DateTo = dateTemp[1].split("-");

//                        _r.DateFrom = DateFrom[1] + '-' + DateFrom[0];
//                        _r.DateTo = DateTo[1] + '-' + DateTo[0];
//                    } else {
//                        _r.DateFrom = data;
//                        _r.DateTo = data;
//                    }
//                } else {
//                    _r.DateFrom = '00-00';
//                    _r.DateTo = '00-00';
//                }
//                break;
//        }
//        return _r;
//    } catch (ex) {
//        return "";
//    }
//}
