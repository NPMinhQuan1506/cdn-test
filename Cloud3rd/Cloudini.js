 
var GD_CloudUsed=false;
var GD_CloudValid=false;
var GD_CloudCust=false;
GD_DetectUsing();
function GD_DetectUsing() {
    try {
        if(Sys_LibName.length>0) {
            GD_CloudUsed=true;
            let _gd=Sys_LibName.filter(word => {
                return (word.TransferEdge.toLowerCase()=="custimage");
            });
            if(_gd.length!=0) GD_CloudCust=true;
            else GD_CloudCust=false;
        }
        else GD_CloudUsed=false;
      
    }
    catch(e) {
        GD_CloudUsed=false;
 
    }
}
function Cloud_Ini() {
    if(GD_CloudUsed) {
        $('#MS_CloudInfo').removeClass('d-none');
    }
}


function GD_gapiLoaded() {
    
}
 
function GD_gisLoaded() {
    
}

 
 

//#region // DRIVER GOOGLE

function GD_SignOut() {
    try {

        setCookie("GAccesstoken", '', 0);
        setCookie("GRefreshToken", '', 0);
        author_set("GoogleInfo", '');
        if(typeof CloudStatus_Checking==='function') CloudStatus_Checking();
        if(typeof CustFolder_CurrentClick==='function') CustFolder_CurrentClick();
       
    }
    catch(ex) {

    }

   
}
function GD_RefreshToken(successfun,failurefunc) {
    let _tokenaccess = getCookie('GAccesstoken');
    let _refreshaccess = getCookie('GRefreshToken');
    if (_tokenaccess != undefined && _tokenaccess != "" && _refreshaccess != undefined && _refreshaccess != "") {
        AjaxJWT(url = "/Api/Google/RefreshToken"
            , data = JSON.stringify({
                "GAccesstoken": _tokenaccess,
                "GRefreshToken": _refreshaccess,
            })
            , async = true
            , success = function (result) {
                if (result != undefined && result != "") {
                    setCookie('GAccesstoken', result, 365);
                    successfun();
                }
                else failurefunc();
            }
            , error = function () {
                failurefunc();
            }
        );
    }
    else {
        failurefunc();
    }
}
async function GD_LoginSuccessFromCloud(json) {
    await new Promise((resolve,reject) => {
        setTimeout(
            () => {
    
                let data=JSON.parse(json);
                if(data!=undefined) {
                    let userId=data.userid;
           
                    if(Number(userId)==Number(sys_userID_Main)) {
                        setTimeout(() => {
                            
                            if (typeof CloudStatus_Checking === 'function') {
                                CloudStatus_Checking();
                                window.location.reload();
                            }
                            if(typeof fbu_CheckingAuthor==='function') fbu_CheckingAuthor();
                            if(typeof CustFolder_CurrentClick === 'function') CustFolder_CurrentClick();


                        },1000)
                        
                    }
                }
                resolve()
            }
        );
    });

}

 
async function Driver_GetCurrentInfo(successfun,failurefunc) {
    return new Promise((resolve, reject) => {
        try {
            let _tokenaccess = getCookie('GAccesstoken');
            if (_tokenaccess != undefined && _tokenaccess != "") {
                $.ajax({
                    url: "https://www.googleapis.com/drive/v3/about?fields=user",
                    type: "GET",
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('Authorization','Bearer '+_tokenaccess);
                    },
                    async: true,
                    contentType: 'application/json; charset=utf-8',
                    success: function(data,textStatus,jqXHR) {
                        if(data!=undefined&&data?.user!=undefined) {
                            author_set("GoogleInfo", JSON.stringify(data.user));
                            successfun(data);
                        }
                        else GD_RefreshToken(successfun,failurefunc)
                    },
                    error: function(XMLHttpRequest,textStatus,errorThrown) {
                        GD_RefreshToken(successfun,failurefunc)
                    },
                });
            }
            else if (failurefunc != undefined) failurefunc();
            resolve();
        }
        catch (ex) {
            //alert("Lỗi khi lấy thông tin Google Drive - " + ex.toString());
            failurefunc();
        }
    })
    
}
//function sendLog(level,message) {
//    fetch("https://3fhtlh66-44300.asse.devtunnels.ms/api/log",{ // Thay localhost:5000 bằng URL tunnel của bạn
//        method: "POST",
//        headers: {
//            "Content-Type": "application/json"
//        },
//        body: JSON.stringify({level,message})
//    }).catch(err => console.error("Failed to send log:",err));
//}
//console.log=function(message) {
//    sendLog("info",message);
//    window.console.info(message);
//};

//console.error=function(message) {
//    sendLog("error",message);
//    window.console.warn(message);
//};

async function Driver_GetPermissionOnFile(fileid,successfun,failurefunc) {
    try {
        return new Promise((resolve,reject) => {
            let _tokenaccess = getCookie('GAccesstoken');
            if(_tokenaccess!=undefined&&_tokenaccess!="") {
                $.ajax({
                    url: `https://www.googleapis.com/drive/v3/files/${fileid}/permissions?fields=permissions(emailAddress,role)`,
                    type: "GET",
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('Authorization','Bearer '+_tokenaccess);
                    },
                    async: true,
                    contentType: 'application/json; charset=utf-8',
                    success: function(data,textStatus,jqXHR) {
                        if(successfun!=undefined)  successfun(data)
                    },
                    error: function(XMLHttpRequest,textStatus,errorThrown) {
                        if(failurefunc!=undefined) failurefunc();
                    },
                });
            }
            else if(failurefunc!=undefined) failurefunc();
            resolve();
        })
    }
    catch(ex) {
        if(failurefunc!=undefined) failurefunc();
    }
}
async function Driver_GetPermissionOnFolder(folderid,successfun,failurefunc) {
    try {
        return new Promise((resolve,reject) => {
            let _tokenaccess = getCookie('GAccesstoken');
        
            if(_tokenaccess!=undefined&&_tokenaccess!="") {
                $.ajax({
                     
                    url: `https://www.googleapis.com/drive/v3/files/${folderid}/permissions?fields=permissions(id,emailAddress,role,displayName,photoLink)&supportsAllDrives=true` ,
                    type: "GET",
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('Authorization','Bearer '+_tokenaccess);
                    },
                    async: true,
                    contentType: 'application/json; charset=utf-8',
                    success: function(data,textStatus,jqXHR) {
                        if(successfun!=undefined) successfun(data)
                    },
                    error: function(XMLHttpRequest,textStatus,errorThrown) {
                        if(failurefunc!=undefined) failurefunc();
                    },
                });
            }
            else if(failurefunc!=undefined) failurefunc();
            resolve();
        })
    }
    catch(ex) {
        if(failurefunc!=undefined) failurefunc();
    }
}
async function Driver_PostPermissionOnFolder(folderid,email, role,successfun,failurefunc) {
    try {
        return new Promise((resolve,reject) => {
            let _tokenaccess = getCookie('GAccesstoken');

            if(_tokenaccess!=undefined&&_tokenaccess!="") {
                $.ajax({
                    url: `https://www.googleapis.com/drive/v3/files/${folderid}/permissions?supportsAllDrives=true&sendNotificationEmail=true`,
                    type: "POST",
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('Authorization','Bearer '+_tokenaccess);
                        xhr.setRequestHeader('Content-Type','application/json');
                    },
                    data: JSON.stringify({
                        "role": role,  // quyền: "reader", "writer", "owner"
                        "type": "user",
                        "emailAddress": email
                    }),
                    async: true,
                    success: function(data,textStatus,jqXHR) {
                        if(successfun!=undefined) successfun(data);
                    },
                    error: function(XMLHttpRequest,textStatus,errorThrown) {
                        console.error("Lỗi khi thêm quyền:",errorThrown);
                        if(failurefunc!=undefined) failurefunc();
                    }
                });
            }
            else if(failurefunc!=undefined) failurefunc();
            resolve();
        })
    }
    catch(ex) {
        if(failurefunc!=undefined) failurefunc();
    }
}
async function Driver_RemovePermissionFromFolder(folderid,permissionId,successfun,failurefunc) {
    try {
        return new Promise((resolve,reject) => {
            let _tokenaccess=getCookie('GAccesstoken');

            if(_tokenaccess!=undefined&&_tokenaccess!="") {
                $.ajax({
                    url: `https://www.googleapis.com/drive/v3/files/${folderid}/permissions/${permissionId}?supportsAllDrives=true`,
                    type: "DELETE",
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader('Authorization','Bearer '+_tokenaccess);
                    },
                    async: true,
                    success: function(data) {
                        if(successfun!=undefined) successfun(data);
                    },
                    error: function(XMLHttpRequest,textStatus,errorThrown) {
                        console.error("Lỗi khi xóa quyền:",errorThrown);
                        if(failurefunc!=undefined) failurefunc();
                    },
                });
            } else if(failurefunc!=undefined) failurefunc();
            resolve();
        });
    } catch(ex) {
        if(failurefunc!=undefined) failurefunc();
    }
}
async function Driver_GetMetafile(fileid,access,callback) {
    $.ajax({
        url: "https://www.googleapis.com/drive/v3/files/"+fileid,
        type: "GET",
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization','Bearer '+access);
        },
        async: true,
        contentType: 'application/json; charset=utf-8',
        success: function(data,textStatus,jqXHR) {
            callback(data)
        },
        error: function(XMLHttpRequest,textStatus,errorThrown) {

        },
    });
}
 
function Driver_GenThumbnail(id) {
    //return `https://drive.google.com/thumbnail?id=${id}&sz=w1000`
    // return `https://lh3.googleusercontent.com/d/${id}`
    return `https://lh3.googleusercontent.com/d/${id}=w1000?authuser=0`;

}
function Driver_GenLink(id) {
    return `https://lh3.googleusercontent.com/d/${id}=w1000?authuser=0`;                
     //return `https://lh3.googleusercontent.com/d/${id}`
    //return `https://drive.google.com/file/d/${id}/view`;
}
function Driver_GenFileLink(id) {
    return `https://drive.google.com/file/d/${id}/view?usp=drive_link`
}

 



//#endregion
