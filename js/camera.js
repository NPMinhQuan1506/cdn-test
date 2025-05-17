
var Camera_ResultImage="";
var Camera_IsStopTimeout=0;
function Camera_Stop_Timeout() {
    Camera_IsStopTimeout=1;
}
function Camera_Action(signdata) {
    return new Promise((resolve,reject) => {
        setTimeout(
            () => {
                Camera_InitSignation();
                Camera_IsStopTimeout=0;
                Camera_ResultImage="";
                var timeout=setInterval(change,500);
                function change() {
                    if(Camera_IsStopTimeout==1) {
                        clearInterval(timeout);
                        resolve(true)
                    }
                }

            },
        )
    })
}
function Camera_InitSignation() {
    $("#DetailModalCamera_Content").html('');
    $("#DetailModalCamera_Content").load("/Camera/Capture");
    $('#DetailModalCamera').modal('show');

} 