﻿///
/// Thành công trả về data.result ="success" , data.data
/// Lỗi trả về data.result ="error" ,data.data
//cols = {
//    Name: { Validation: { Name: "empty", Value: "" }, ReplaceNull: { isReplace: 1, ColName: "Phone", Value: "Name" } },
//    Phone: { Validation: { Name: "minLength", Value: "8" }, ReplaceNull: { isReplace: 0, ColName: "", Value: "" } },
//    Facebook: { Validation: { Name: "empty", Value: "" }, ReplaceNull: { isReplace: 0, ColName: "", Value: "" } },
//    ServiceCare: { Validation: { Name: "", Value: "" }, ReplaceNull: { isReplace: 0, ColName: "", Value: "" } }
//};
/// Validation: Định dạng Column
/// ReplaceNull: Thay thế khi Column rõng hoặc không tồn tại: isReplace: "1 thay thế, 0 không thay", ColName: "lấy vaule col", Value: "giá trị khi không có col"
/// Name: Tên column trong file

//const { debug } = require('console');

///
function handleFileImport (e, Cols, fnfinish, limit_row = 2000,firstSheet) {
    
     
    let DataTableExcelImport = {};
    var files = e.target.files;
    if (files.length > 0) {
        let filename = e.target.files[0].name;
        let ext = filename.split('.').pop();
        if (ext != "xlsx" && ext != "xls") {
            return fnfinish({result: "error", data: Outlang["Sai_dinh_dang"] + " ( " + Outlang["Chap_nhan_dinh_dang"] + " .xlsx /.xls)"});
        }
        else {
            var i, f, j;
            for (i = 0, f = files[i]; i != files.length; ++i) {
                var reader = new FileReader();
                FileName = f.name;
                reader.onload = function (e) {
                    var data = e.target.result;
                    var _dtExcraw, _dtExc;
                    var workbook = XLSX.read(data, {
                        type: 'binary',
                        cellDates: true,
                        cellNF: false,
                        cellText: false
                    });
                     
                    var sheet_name_list = workbook.SheetNames;
                    var roa=[];
           
                    if(firstSheet!=undefined&&firstSheet==false) {
                        for(let i=0;i<sheet_name_list.length;i++) {
                            let _curretroa=XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[i]],{raw: false,dateNF: 'yyyy-mm-dd'});
                            _curretroa=_curretroa.map((row,index) => ({
                                ...row,
                                sheetID: i
                            }));

                            roa=roa.concat(_curretroa);
                      
                        }
                    }
                    else {
                        roa=XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]],{raw: false,dateNF: 'yyyy-mm-dd'});
                    }
                            
                    if (roa.length > 0) {
                        _dtExcraw = roa;
                    }
                    if (_dtExcraw != undefined && _dtExcraw.length != 0) {
                        _dtExc = [];
                        for (let kk = 0; kk < _dtExcraw.length; kk++) {
                            let props = Object.getOwnPropertyNames(_dtExcraw[kk]);
                            let echange = {};
                            for (let ii = 1; ii < props.length; ii++) {
                                if (/\r|\n|\|/gm.test(props[ii]))
                                    echange[props[ii].substring(0, props[ii].search(/\r|\n|\|/gm)).trim()] = _dtExcraw[kk][props[ii]];
                                else
                                    echange[props[ii]] = _dtExcraw[kk][props[ii]];
                            }
                            _dtExc.push(echange)
                        }
                  
                        for (j = 0; j < _dtExc.length; j++) {
                            if (j < limit_row) {
                                let _iExc = _dtExc[j];
                                let _iReturn = {};
                                let _sts = [];
                         
                                for ([k, _val] of Object.entries(Cols)) {
                                    let _obj = {};
                                    let _iserr = 0;
                                    let _cValid = _val.Validation;
                                    let _cWarn = _val.Warning;
                                    let _cReplace = _val.ReplaceNull;
                                    
                                    _obj = handleFileGetValue(_cValid);
                                     
                                    if (_cReplace.isReplace == 1 && _cReplace.ColName != "" && (!_iExc[k] || _iExc[k] == "")) {
                                        _iExc[k] = (_cReplace.ColName != "" && !_iExc[_cReplace.ColName]) ? _cReplace.Value : _iExc[_cReplace.ColName];
                                    }
                                    _iReturn[k] = (_iExc[k] && _iExc[k] != undefined ? ((_iExc[k].toString().replaceAll("'", "").replace(/&lrm;|\u200E/gi, ' ')).toString().trim()) : "");
                                    _iReturn[k] = (k == "Gender") ? _iReturn[k].toLowerCase() : _iReturn[k];

                                    switch (_cValid.Name) {
                                        case "empty":
                                            if (!_iReturn[k]) {
                                                _iserr = 1;
                                                _sts.push(handleFileSetErr(1, "empty", _obj["Name"], _obj["Format"], _obj["Exam"], ""));
                                            }
                                            break;
                                        case "minLength":
                                            if (!(_iReturn[k] && _iReturn[k].length > _cValid.Value)) {
                                                _iserr = 1;
                                                _sts.push(handleFileSetErr(1, "minLength", _obj["Name"], _obj["Format"], _obj["Exam"], _cValid.Value));
                                            }
                                            break;
                                        case "number":
                                            if (!((_iReturn[k] && (Number(_iReturn[k]) || _iReturn[k])) == 0)) {
                                                _iserr = 1;
                                                _sts.push(handleFileSetErr(1, "number", _obj["Name"], _obj["Format"], _obj["Exam"], ""));
                                            }
                                            break;
                                        case "regExp":
                                            if (!(_iReturn[k] && new RegExp(_cValid.Value).test(_iReturn[k]))) {
                                                _iserr = 1;
                                                _sts.push(handleFileSetErr(1, "regExp", _obj["Name"], _obj["Format"], _obj["Exam"], ""));
                                            }
                                            break;
                                        default:
                                            break;
                                    }
                                    if (typeof _cWarn != 'undefined') {
                                        switch (_cWarn.Name) {
                                            case "regExp":
                                                if (!(_iReturn[k] && new RegExp(_cWarn.Value).test(_iReturn[k])) && _iserr == 0 && _iReturn[k] != "") {
                                                    _sts.push(handleFileSetErr(0, "regExp", _obj["Name"], _obj["Format"], _obj["Exam"], ""));
                                                }
                                                break;
                                            default:
                                                break;
                                        }
                                    }
                                }
                                _iReturn.Status=_sts;
                                DataTableExcelImport[i.toString()+'-'+j.toString()]=_iReturn

                                  //  debugger
                                //if(_iExc["No"]!=undefined) DataTableExcelImport[_iExc["No"].toString()+_iExc["sheetID"]??'']=_iReturn;
                                //else DataTableExcelImport[_iExc["STT"].toString()+_iExc["sheetID"]??''] = _iReturn;
                            }

                        }
                    }
                    fnfinish({result: "success", data: DataTableExcelImport});
                }
            };
            reader.readAsArrayBuffer(f);
        }
    }
    return false;
}
function handleFileGetValue (_cValid) {
    let obj = {
        Name: ''
        , Format: ''
        , Exam: ''
    }
    try {
         
        obj.Name = ((_cValid.ColName != undefined && _cValid.ColName != '') ? k + '(' + _cValid.ColName + ')' : k);
        obj.Format = (_cValid.ColFormat != undefined && _cValid.ColFormat != '' ? Outlang["Chap_nhan_dinh_dang"] + ": " + _cValid.ColFormat + '</br>' : '');
        obj.Exam = (_cValid.ColExam != undefined && _cValid.ColExam != '' ? Outlang["Du_lieu_mau"] ?? "Dữ liệu mẫu" + ": " + _cValid.ColExam + '</br>' : '');

        return obj;
    } catch {
        return obj;
    }
}
function handleFileSetErr (isErr, type, name, format, exam, value) {
    
    let _obj = {
        iserr: 0,
        iswar: 0,
        type: "",
        name: "",
        format: "",
        exam: "",
        value: ""
    };
    try {
        _obj.iserr = isErr;
        _obj.iswar = isErr == 0 ? 1 : 0;
        _obj.type = type;
        _obj.name = name ;
        _obj.format = format;
        _obj.exam = exam;
        _obj.value = value;
 
        return _obj;
    } catch (ex) {
        return _obj;
    }
}