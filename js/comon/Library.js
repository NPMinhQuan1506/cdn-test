
var LibType = {
    "Cust": "CustImage",
    "Other": "Other"
}

function Lib_CloudItem(type = '') {
    try {
        if (typeof Sys_LibName != "object") return {};
        return Sys_LibName.find((item) => {
            return item.TransferEdge == type;
        }) ?? {}
    }
    catch (ex) {
        return {}
    }
}

function Lib_CheckCloud(type = '') {
    try {
        if (typeof Sys_LibName != "object") return false;
        let cloud =  Sys_LibName.find((item) => {
            return item.TransferEdge.toLowerCase() == type.toLowerCase();
        })
        return (Object.entries(cloud).length > 0)
    }
    catch (ex) {
        return false;
    }
}