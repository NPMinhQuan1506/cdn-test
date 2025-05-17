//start notiApp
//var IncommingaudioApp = new Audio('/assests/img/Call/incommingCall.mp3');
function InccomingApp(data) {
    try {

        //IncommingaudioApp.loop = true;
        //IncommingaudioApp.play();
        $('#AppNotiDiv').show();
        $('#AppNotiDiv').attr('data-id', data.ID);
        $('#AppPageName').html(data.TypeName);
        $('#AppRecipientName').html('UserName App: ' + data.UserName);
        $('#AppageNoti').html(data.Message);
        $('#AppPageBranch').html(data.BranchName);

    }
    catch (err) {
        console.log("Sound Error");
    }
}
function AcceptAppNoti() {
    //IncommingaudioApp.pause();
    //IncommingaudioApp.currentTime = 0;
    $('#AppNotiDiv').hide();
    //show
    window.location.href = '/Notification/NotificationList?Value=' + $('#AppNotiDiv').attr('data-id');
    return false;
}
function DeclineApp() {
    //IncommingaudioApp.pause();
    //IncommingaudioApp.currentTime = 0;
    $('#AppNotiDiv').hide();
    return false;
}
function LoadNotiCountUnRead() {
    //AjaxLoad(url = "/Notification/NotificationList/?handler=LoadNotiReadUnCount"
    //    , data = {}, async = true, error = null
    //    , success = function (result) {
    //        let data = JSON.parse(result)[0];
    //        if (data.CountUnRead > 0) {
    //            $('#icon-noti-app1').css('display', 'block');
    //            $('#icon-noti-app2').css('display', 'block');
    //            $('#icon-noti-app1').html(data.CountUnRead);
    //            $('#icon-noti-app2').html(data.CountUnRead);

    //        } else {
    //            $('#icon-noti-app1').css('display', 'none');
    //            $('#icon-noti-app2').css('display', 'none');
    //        }
    //        SetAlarmSchedule(data, exdays, second_alram, empid);
            
    //    });
}
//end notiapp

//start notiPage
function InccomingPage(pageName, RetName, MessageNoti) {
    try {
        $('#MessPageDiv').show();
        Messagegaudio.loop = true;
        Messagegaudio.play();
        $('#MessPageName').html(pageName);
        $('#MessRecipientName').html('( ' + RetName + ' )');
        $('#MessageNoti').html(MessageNoti);

    }
    catch (err) {
        console.log("Sound Error");
    }
}






async function NotiExe_ToUser(json) {
    await new Promise((resolve, reject) => {
        setTimeout(
            () => {
                let data = JSON.parse(json);
                if (data != undefined) {
                    let empid = data.empid;
                    let title = data.title;
                    let message = data.message;
                    if (Number(empid) == Number(sys_employeeID_Main)) {
                        notiMess10( message);
                    }
                }
                resolve()
            }
        );
    });

}
async function NotiExe_ToStringUser(json) {
    await new Promise((resolve, reject) => {
        setTimeout(
            () => {
                let data = JSON.parse(json);
                if (data != undefined) {
                    let userid = data.userid;
                    let userfrom = data.userfrom;
                    let title = data.title;
                    let message = data.message;
                    userid = ',' + userid + ','; 
                    let _myuserid = ',' + sys_userID_Main + ','; 
                    if (Number(sys_userID_Main) != Number(userfrom) && userid.includes(_myuserid)) {
                        notiMess10( message);
               
                    }                   
                }
                resolve()
            }
        );
    });

}

async function Noti_And_LogoutUser(json) {
    await new Promise((resolve, reject) => {
        setTimeout(
            () => {
                let data = JSON.parse(json);
                if (data != undefined) {
                    let userId = data.userid;
                    let title = data.title;
                    let message = data.message;
                    if (Number(userId) == Number(sys_userID_Main)) {
                        notiMessage(title, '', message);
                        let timeoutId = setTimeout(() => {
                            MS_HandleLogout()
                            clearTimeout(timeoutId);
                        },5000)
                    }
                }
                resolve()
            }
        );
    });

}
async function Noti_BookingOnline(json) {
    await new Promise((resolve,reject) => {
        setTimeout(
            () => {
                let data=JSON.parse(json);
                if(data!=undefined&&data.length==1) {
                    let _item=data[0];
                    let branch=_item.Branch;
                    let phone=_item.Phone;
                    let name=_item.Name;
                    let NotiID=_item.NotiID;
                    if ((Master_branchID)===Number(branch)) {
                        noti_sysInsertStore(NotiID);
                        if(Noti_DetectTopic('bookingonline')==1)
                            notiMessage(Outlang["Sys_dat_lich_hen_online"] ?? "Đặt lịch hẹn online",'/Image/bookingonline.png?ver=1',name);
                        noti_sysupdateCount()
                    }
                }
                resolve()
            }
        );
    });
}
async function Noti_RatingApp(json) {
    await new Promise((resolve, reject) => {
        setTimeout(
            () => {
                let data = JSON.parse(json);
                if (data != undefined && data.length == 1) {
                    let _item = data[0];
                    let branch = _item.Branch;
                    let Content = _item.Content;
                    let NotiID = _item.NotiID;
                    if (branch == 0 || NumberNumber(Master_branchID) === Number(branch)) {
                        noti_sysInsertStore(NotiID);
                        if (Noti_DetectTopic('appnotification') == 1)
                            notiMessage(Outlang["Danh_gia_ung_dung"], '/Image/notirating.png?ver=1', Content);
                        noti_sysupdateCount()
                    }
                }
                resolve()
            }
        );
    });
}
async function Noti_ProfileOnline(json ) {
    await new Promise((resolve,reject) => {
        setTimeout(
            () => {
                let datas=JSON.parse(json);
                if(datas!=undefined) {
                    data=datas.Table;
                    let dataNoti=datas.Table2;
                    if(data!=undefined&&data.length==1) {
                        let _item=data[0];
                        let _itemNoti=dataNoti[0];
                        let branch=_item.BranchID;
                        let phone=_item.Phone;
                        let name=_item.Name;
                        let NotiID=_itemNoti.NotiID;
                             
                        if(Number(Master_branchID)===Number(branch)&&_item.ErrorCode==1) {
                            noti_sysInsertStore(NotiID);

                            if(Noti_DetectTopic('customergate')==1)
                                notiMessage(Outlang["Tao_ho_so_thanh_cong"],'/Image/profileonline.png?ver=1',name);
                            noti_sysupdateCount()
                        }

                    }
                }
                resolve()
            }
        );
    });

}

async function Noti_PaymentTrack(json) {
    await new Promise((resolve,reject) => {
        setTimeout(
            () => {
                 
                let data=JSON.parse(json);
                if(data!=undefined) {
                    let _item=data;
                    let branch=_item.branch;
                    let amount=formatNumber(_item.amount);
                    let NotiID=_item.notiid;
                    let isRemove=_item.isRemove;
                    if(Number(Master_branchID)===Number(branch)) {
                        noti_sysInsertStore(NotiID);
                        if(Noti_DetectTopic('payment')==1) {
                            if(isRemove==1) {
                                notiMessage(Outlang["Sys_thanh_toan"],'/Image/payment.png?ver=1',Outlang["Sys_xoa_thanh_toan_khach_hang"]);
                            }
                            else {
                                notiMessage(Outlang["Sys_thanh_toan"],'/Image/payment.png?ver=1',amount);
                            }
                            
                        }
                        noti_sysupdateCount()
                    }
                }
                resolve()
            }
        );
    });

}

async function noti_sysInsertStore(id) {
    await new Promise((resolve,reject) => {
        setTimeout(
            () => {
                try {
                    let _notilist={};
                    let _stList=localstorage_get("sysnoti");
                    if(_stList!="") _notilist=JSON.parse(_stList).data;
                    _notilist=_notilist!=""? _notilist:{};
                    _notilist[id]=0;
                     _notilist=Noti_Trim(_notilist,20);
                    localstorage_set("sysnoti",_notilist)

                } catch(e) {}
                resolve()
            }
        )
    });
}
function Noti_Trim(obj,maxItems=20) {
    const keys=Object.keys(obj);
    const total=keys.length;
    if(total>maxItems) {
        let keysToRemove=[];
        keysToRemove=keys.slice(0,total-maxItems);
        for(const key of keysToRemove) {
            delete obj[key];
        }
    }

    return obj;
}
async function noti_sysupdateCount() {
    await new Promise((resolve,reject) => {
        setTimeout(
            () => {
                try {
                    let $noti=$("#MS_NotiSysTotal")
                    if($noti.length) {
                  
                        if($noti.hasClass('d-none')) {
                            $noti.parent().addClass('notiRing');
                            $noti.removeClass('d-none');
                        }
                    }
                } catch(e) {}
                resolve()
            }
        )
    });
}
function Noti_DetectTopic(topiccheck) {
    try {
        let isReceipt=0;
        let TokenTopic=author_get('TokenTopic');
        let Setting=author_get('setting');
        if(TokenTopic!=undefined&&TokenTopic!="") {
            let topic=JSON.parse(TokenTopic);
            for(let ii=0;ii<topic.length;ii++) {
                if(Number(topic[ii].ISREGIS)==1&&topic[ii].Topic==topiccheck) {
                    if(Setting==undefined||Setting=="") {
                        isReceipt=1;
                    }
                    else {
                        let objSetting=JSON.parse(Setting);
                        if(objSetting[topiccheck]==0) isReceipt=0;
                        else isReceipt=1;
                    }
                }
            }
        }
        return isReceipt;
    }
    catch(ex) {
        return 0;
    }
}