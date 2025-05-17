function apia_getpath() {
    try {
        return location.pathname;
    }
    catch (e) {
        return "";
    }
}
var $orderSelf = 0, $item = {}, $dataKeys = {}; //Key condition in sql VTT_API_MappingField.Warning don't change var names when change name must change conditions data in sql.
function apia_mapping(dataSetting) {

    function rsGetNode(item, objRes, countRec = 0, itemMain, itemFirst, orderSelf, index) {

        if (item.Path == "") {
            setValue(objRes, item, itemMain, itemFirst, orderSelf)
        }
        else {
            let pr = JSON.parse(item.Path);
            if (countRec < item.LevelPath) {
                let indArr = item.IsMaster == 1 ? itemMain.IndexMaster : itemMain.IndexDetail;
                indArr = ((indArr - 1) * item.CountSelf + orderSelf)
                let field = pr[countRec];
                let objPara;
                if (objRes[field]) {
                    objPara = objRes[field] ?? {};
                }
                else {
                    let posPara = index != undefined ? index - 1 : indArr;
                    objPara = objRes[posPara][field] ?? {};
                }
                if (countRec == item.LevelPath - 1 && Object.keys(objPara).length > 0) {
                    if (objPara[indArr] == undefined) objPara[indArr] = {};
                    let obj = objPara[indArr];
                    setValue(obj, item, itemMain, itemFirst, orderSelf)
                }
                let settMast = dataSetting[dataSetting.findIndex(e => e.ParaName == field)];
                index = settMast.IsMaster == 1 ? itemMain.IndexMaster : itemMain.IndexDetail;
                //index = ((index - 1) * item.CountSelf + orderSelf)
                rsGetNode(item, objPara, countRec + 1, itemMain, itemFirst, orderSelf, index);
            }
        }

    }
    function setValue(obj, item, itemMain, itemFirst, orderSelf) {
        switch (item.TypeData) {
            case "string":
            case "number":
            case "boolean":
            case "datetime":
                if (obj[item.ParaName] == undefined)
                    if ((item.IsMaster == 1 && itemMain.IndexDetail == 1) || item.UseDataFirst == 1 || (item.IsMaster == 0)) {

                        let data = item.UseDataFirst == 1 ? { ...itemFirst } : { ...itemMain };

                        if (item.MapField != '') {
                            obj[item.ParaName] = convertDyType(data[item.MapField], item.TypeData, item.TypeItem);
                        }
                        else {
                            if (item.Conditions != '') {
                                let val = handleDyCondition(item, data, orderSelf);
                                obj[item.ParaName] = convertDyType(val, item.TypeData, item.TypeItem);
                            }
                            else {
                                obj[item.ParaName] = convertDyType(item.DefaultValue, item.TypeData, item.TypeItem);
                            }
                        }
                    }
                break;
            case "array":
                switch (item.TypeItem) {
                    case "object":
                        if (obj[item.ParaName] == undefined) {
                            obj[item.ParaName] = [{}];
                        }
                        else {
                            //if (obj[item.ParaName][indArr - 1] == undefined)
                            //    obj[item.ParaName][indArr - 1] = {}
                        }
                        break;
                    case "string":
                    case "number":
                    case "boolean":
                    case "datetime":
                        if (obj[item.ParaName] == undefined) {
                            obj[item.ParaName] = [];
                        }
                        if ((item.IsMaster == 1 && itemMain.IndexDetail == 1) || item.UseDataFirst == 1 || (item.IsMaster == 0)) {

                            let data = item.UseDataFirst == 1 ? { ...itemFirst } : { ...itemMain };
                            let values;
                            if (item.MapField != '') {
                                values = data[item.MapField];
                            }
                            else {
                                if (item.Conditions != '') {
                                    let val = handleDyCondition(item, data, orderSelf);
                                    values = convertDyType(val, item.TypeData, item.TypeItem);
                                }
                                else {
                                    values = convertDyType(item.DefaultValue, item.TypeData, item.TypeItem);

                                }
                            }
                            obj[item.ParaName].push(values);
                        }
                        break;
                }
        }
    }
    function convertDyType(value, type, typeitem) {
        try {
            let res;
            switch (type) {
                case "string":
                    res = value.toString();
                    break;
                case "number":
                    res = !isNaN(Number(value)) ? Number(value) : value;
                    break;
                case "boolean":
                    res = (String(value).toLowerCase() === 'true');
                    break;
                case "datetime":
                    res = convertDateType(value, type, typeitem);
                    break;
                case "default":
                    res = value;
                    break;
            }
            return res;
        }
        catch {
            return value;
        }
    }
    function convertDateType(value, type, typeitem) {
        try {
            let res;
            if (type == 'datetime') {
                let d = new Date(value),
                    mon = (d.getMonth() + 1) < 10 ? `0${(d.getMonth() + 1)}` : (d.getMonth() + 1),
                    dd = d.getDate() < 10 ? `0${d.getDate()}` : d.getDate(),
                    yy = d.getFullYear(),
                    hh = d.getHours() < 10 ? `0${d.getHours()}` : d.getHours(),
                    mm = d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes(),
                    ss = d.getSeconds() < 10 ? `0${d.getSeconds()}` : d.getSeconds();
                switch (typeitem) {
                    case "yyyy-mm-dd":
                        res = `${yy}-${mon}-${dd}`;
                        break;
                    case "yyyy-mm-dd hh:mm:ss":
                        res = `${yy}-${mon}-${dd} ${hh}:${mm}:${ss}`;
                        break;
                    case "dd-mm-yyyy":
                        res = `${dd}-${mon}-${yy}`;
                        break;
                    case "dd/mm/yyyy":
                        res = `${dd}/${mon}/${yy}`;
                        break;
                    case "dd-mm-yyyy hh:mm:ss":
                        res = `${dd}-${mon}-${yy} ${hh}:${mm}:${ss}`;
                        break;
                    case "dd/mm/yyyy hh:mm:ss":
                        res = `${dd}/${mon}/${yy} ${hh}:${mm}:${ss}`;
                        break;
                    case "":
                        res = value;
                        break;
                }
            }
            else {
                res = value;
            }
            return res;
        }
        catch {
            return value;
        }
    }
    function handleDyCondition(item, data, orderSelf) {
        try {
            let result = '';
            let conds = JSON.parse(item.Conditions);
            $orderSelf = orderSelf;
            $item = { ...data };
            $dataKeys = { ...item };
            if (typeof $item != 'undefined' && typeof $orderSelf != 'undefined') {
                for (let i = 0; i < conds.length; i++) {

                    if (eval(conds[i].condi)) {
                        result = eval(conds[i].result);
                        break;
                    }

                }
            }
            return result;

        }
        catch (e) {
            return '';
        }
    }

    const action = (dataMain) => {
        try {
            let objResult = {};
            let dataVoucher = [];
            let itemFirst = {};
            for (let i = 0; i < dataMain.length; i++) {
                let itemMain = dataMain[i];
                if (itemMain.IndexDetail == 1) {
                    dataVoucher.push({
                        ID: itemMain.ID, Type: itemMain.Type, MasterGuid: itemMain.MasterGuid, IsSuccess: 0
                    })
                    itemFirst = { ...itemMain };
                }
                for (let j = 0; j < dataSetting.length; j++) {
                    let itemSet = dataSetting[j];
                    let orderSelf = 0
                    while (orderSelf < itemSet.CountSelf) {
                        rsGetNode(itemSet, objResult, countRec = 0, itemMain, itemFirst, orderSelf)
                        orderSelf++;
                    }
                }
            }
            return { objResult, dataVoucher };
        }
        catch(e) {
            return {};
        }
    }

    return action;
}


