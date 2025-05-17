
function Desk_AppInDay (app_ID, doctor_id, status_id, branch_ID) {
    if (branch_ID == Master_branchID) {
        AjaxLoad(url = "/Desk/DeskMaster/?handler=LoadApp"
            , data = {
                "AppID": app_ID
                , "DoctorID": doctor_id
                , "StatusID": status_id
                , "BranchID": branch_ID
            }, async = true
            , error = function () {
                notiError_SW();
            }
            , success = function (result) {
                let data = JSON.parse(result);
                if (data && data.length == 1) {
                    let item = data[0];
                    Desk_UpdateRow(item);
                }
                else {
                    Desk_RemoveRow(app_ID);
                }
            }
        );
    }
}
function Desk_UpdateRow (item) {
    let ID = item.ID;
    LoadAppointmentListAjax(ID, 1);
}
function Desk_RemoveRow (app_ID) {
    if ($('#Row_App_Inday_' + app_ID).length > 0) $('#Row_App_Inday_' + app_ID).remove();
}
function Desk_RoomInDay (data) {
    
    RealTime_Remove(data.oldroom_id, data.oldchair_id, data.cust_id);
    if (data.newroom_id != 0 || data.newchair_id != 0) {
        RealTime_Add(data.newroom_id, data.newchair_id, data.cust_id, data.cust_name, data.current_doctor, new Date());
    } else {
        RSD_LoadRealtime(data.oldroom_id, data.oldchair_id);
    }
}




