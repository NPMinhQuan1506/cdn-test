(async function ($) {
    var keyTrial = '';
    let guideclosure = 0;
    let guidemo_path = window.location.pathname;
    let guidemo_domain = window.location.hostname;
    let dataTrialLocal = localstorage_get("TrialVerLocal");
    let isUsingLocal = (dataTrialLocal !== undefined && dataTrialLocal != "" && JSON.parse(dataTrialLocal).data !== "")
        ? JSON.parse(dataTrialLocal).data
        : false;
    if (guidemo_domain != undefined && guidemo_domain != "") {
        guidemo_domain = guidemo_domain.toLocaleLowerCase();
        if (guidemo_domain == "nkdemocc.vttechsolution.com" || guidemo_domain == "nkdemocn.vttechsolution.com" || guidemo_domain == "nkdemotc.vttechsolution.com" ||
            guidemo_domain == "tmdemocc.vttechsolution.vn" || guidemo_domain == "tmdemocn.vttechsolution.vn" || guidemo_domain == "tmdemotc.vttechsolution.vn" ||
            guidemo_domain == "pkdemocc.vttechsolution.vn" || guidemo_domain == "pkdemocn.vttechsolution.vn" || guidemo_domain == "pkdemotc.vttechsolution.vn" ||
            guidemo_domain == "tmdemo.vttechsolution.com" || guidemo_domain == "nkdemo.vttechsolution.com" || guidemo_domain == "pkdemo.vttechsolution.com" || isUsingLocal)
            guideclosure = 1;
    }

    if (guideclosure == 1) {
        if (guidemo_path.toLowerCase().includes('login/login')) {
            localstorage_set("TrialVerLocal_IsLoaded", false);
        }
        else {
             if(!gd_checkExist()) {
                let _module={};
                let _step={};
                let _style={};
                let _stylePro={};
                let _styleStandard={};
                let _styleBasic={};
                _module=await gd_LoadData();
                _step=await gd_LoadSteps();

                let typecss=["Dynamic","Pro","Standard","Basic"];
                _style=await gd_CreateCssFile(typecss[0]);
                _stylePro=await gd_CreateCssFile(typecss[1]);
                _styleStandard=await gd_CreateCssFile(typecss[2]);
                _styleBasic=await gd_CreateCssFile(typecss[3]);

                localstorage_set("TrialVerLocal_Module",JSON.stringify(_module));
                localstorage_set("TrialVerLocal_Step",JSON.stringify(_step));
                localstorage_set("TrialVerLocal_Style",JSON.stringify(_style));

                localstorage_set("TrialVerLocal_StylePro",JSON.stringify(_stylePro));
                localstorage_set("TrialVerLocal_StyleStandard",JSON.stringify(_styleStandard));
                localstorage_set("TrialVerLocal_StyleBasic",JSON.stringify(_styleBasic));
                localstorage_set("TrialVerLocal_IsLoaded",true);
            }
            $('head').append($('<link rel="stylesheet" type="text/css" />').attr('href', '/js/ProjectClosure/projectclosure.css'));
            let jstyle = localstorage_get("TrialVerLocal_Style");
            var gdata_Style = (jstyle !== undefined && jstyle != "" && JSON.parse(jstyle).data !== "")
                ? JSON.parse(JSON.parse(jstyle).data)
                : "";
            var style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = gdata_Style
            document.getElementsByTagName('head')[0].appendChild(style);

            let jstep = localstorage_get("TrialVerLocal_Step");
            var gdata_Step = (jstep !== undefined && jstep != "" && JSON.parse(jstep).data !== "")
                ? JSON.parse(JSON.parse(jstep).data)
                : {};

            let jmodule = localstorage_get("TrialVerLocal_Module");
            var gdata_Module = (jmodule !== undefined && jmodule != "" && JSON.parse(jmodule).data !== "")
                ? JSON.parse(JSON.parse(jmodule).data)
                : {};

            if (Object.keys(gdata_Module).length == 0) {
                gdata_Module = await gd_LoadData();
            }
            js_require_notasync('/js/ProjectClosure/data.js', true);
            keyTrial = (gdata_TrialPackage[Master_roleID] ?? "") != '' ? gdata_TrialPackage[Master_roleID] : 'Basic';


            let jstyle_package = undefined;

            switch (keyTrial) {
                case "Pro":
                    {
                        jstyle_package = localstorage_get("TrialVerLocal_StylePro");
                        break;
                    }
                case "Standard":
                    {
                        jstyle_package = localstorage_get("TrialVerLocal_StyleStandard");
                        break;
                    }
                case "Basic":
                    {
                        jstyle_package = localstorage_get("TrialVerLocal_StyleBasic");
                        break;
                    }
            }
            if (jstyle_package != undefined) {
                var gdata_StylePackage = (jstyle_package !== undefined && jstyle_package != "" && JSON.parse(jstyle_package).data !== "")
                    ? JSON.parse(JSON.parse(jstyle_package).data)
                    : "";

                var stylePackge = document.createElement('style');
                stylePackge.type = 'text/css';
                stylePackge.innerHTML = gdata_StylePackage
                document.getElementsByTagName('head')[0].appendChild(stylePackge);
            }

            gd_trialgenre();
            guidemo_getstart();
        }

        //#region // Genre and event
        function videoScroll() {
            if (document.querySelectorAll('video[autoplay]').length > 0) {
                var windowHeight = window.innerHeight,
                    videoEl = document.querySelectorAll('video[autoplay]');

                for (var i = 0; i < videoEl.length; i++) {
                    var thisVideoEl = videoEl[i],
                        videoHeight = thisVideoEl.clientHeight,
                        videoClientRect = thisVideoEl.getBoundingClientRect().top;

                    if (videoClientRect <= ((windowHeight) - (videoHeight * .5)) && videoClientRect >= (0 - (videoHeight * .5))) {
                        thisVideoEl.play();
                    } else {
                        thisVideoEl.pause();
                    }
                }
            }
        }

        async function gd_trialgenre() {
            var myNode = document.getElementById("sidenav-collapse-main");
            if (myNode !== null) {
                var blockInfoPack = document.getElementById("blockInfoPackage");
                if (blockInfoPack !== null) blockInfoPack.remove();

                //#region // Tooltip
                let toolTipVer = ``;
                for ([key, value] of Object.entries(gdata_Package)) {
                    let eho = ((keyTrial === key) ? `<div class='fw-bold'>${value.title}</div>` : `<div class='opacity-5'>${value.title}</div>`);
                    if (key !== Object.keys(gdata_Package)[0]) eho = `<hr class='my-1' />` + eho;
                    toolTipVer = toolTipVer + eho;
                }
                toolTipVer = `<div><div class='text-start m-3'>${toolTipVer}</div></div>`
                //#endregion

                let stringTrial = `
                    <div class="mx-3 mt-3 position-relative">
                        <div id="blockTrialName" class="btn btn-outline-primary w-100 border-2 text-start" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-html="true">
                            <div class="my-2">
                                <div class="text-xs text-secondary">Gói demo</div>
                                <span class="text-sm fw-bolder mt-1 text-primary">${gdata_Package[keyTrial]?.title}</span>
                            </div>
                            <hr class="my-2"/>
                            <div class="my-2">
                                <div class="text-xs text-secondary">Nhóm</div>
                                <div class="text-sm fw-bolder  mt-1 text-primary">${Master_roleGroupCurrent}</div>
                            </div>
                        </div>
                    </div>
                `;
                let stringGroup = gdata_Group
                    .filter((word) => { return keyTrial == word.Type })
                    .map((item) => {
                        return `<li class="guidemo_peruser__item" class="nav-item" role="presentation" data-id="${item.ID}">
                        <a class="text-sm nav-link cursor-pointer" data-hover="">${item.Name}</a>
                    </li>`;
                    }).join(`<li><hr class="horizontal dark my-0 opacity-2"></li>`);
                let stringPermis = `
                    <div class="mx-3 mini_grouparea mt-n2 mb-2">
                        <div class="position-relative">
                            <button class="w-100 btn btn-primary my-0 position-relative dropdown-toggle mb-0" data-bs-toggle="collapse" data-bs-target="#mini_group">
                                Chuyển chức năng
                            </button>
                            <div class="collapse position-absolute z-index-3 top-100 mt-2 start-0 w-100" id="mini_group">
                                <ul id="guidemo_peruser" class="nav nav-pills flex-column bg-white border-radius-lg py-3 px-2 shadow-lg">
                                    ${stringGroup}
                                </ul>
                            </div>
                        </div>

                    </div>
                `;
                myNode.insertAdjacentHTML(
                    "beforebegin",
                    `<div id="blockInfoPackage" >${stringTrial + stringPermis}</div>`
                );
                gd_trialevent(toolTipVer);
            }
            var mybody = document.getElementsByTagName("body");
            if (mybody !== null) {
                let socialdiv = `
                        <div id="minisocial_area" class="minisocial_area position-fixed z-index-3">
                            <div class="minisocial_areablock align-items-center bg-gray-100 bg-white d-flex flex-column justify-content-center shadow shadow-lg overflow-hidden"
                                style="border-radius: 30px;width: 58px;min-height: 58px;">
                                <div id="minisocial_btn" class="minisocial_btn bg-transparent btn btn-icon-only btn-lg mb-0 shadow-none text-dark mb-1">
                                    <i class="fas fa-chevron-up"></i>
                                </div>
                                <div class="d-flex flex-column w-100 minisocial_arealist">
                                    <a href="https://m.me/2212806872335658" target="_blank" class="cursor-pointer p-2">
                                       <img src="/image/ic-mess.png" class="w-100 z-index-2 rounded-circle">
                                    </a>
                                     <a href="https://zalo.me/2093355405338256825" target="_blank" class="cursor-pointer p-2">
                                       <img src="/image/ic-zalo.png" class="w-100 z-index-2 rounded-circle">
                                    </a>
                                </div>
                            </div>
                        </div>
                `;

                mybody[0].insertAdjacentHTML(
                    "beforeend",
                    `${socialdiv}`
                );
                gd_socialevent();
            }
        }
        function gd_trialevent(toolTipVer) {
            $("#guidemo_peruser .guidemo_peruser__item").on("click", function (e) {
                let GroupID = Number($(this).attr("data-id"));
                if (
                    isNaN(GroupID) ||
                    sys_userID_Main == undefined ||
                    sys_userID_Main == 0 ||
                    Number(Master_roleID) == GroupID
                ) return;
                gd_changegroup(GroupID);
            });
            setTimeout(() => {
                $("#blockTrialName").attr("data-bs-original-title", toolTipVer);
                ToolPopper();
            }, 1000)
        }
        function gd_socialevent() {
            let objNewFeat = localstorage_get("MiniSocial_Position");
            if (sys_isMobile == 1) {
                $("#minisocial_area").css({
                    "top": (window.innerHeight - $("#minisocial_area").height())
                });
            }
            else if (objNewFeat != "" && sys_isMobile == 0) {
                let posNewFeat = JSON.parse(objNewFeat)?.data;
                if (!isNaN(Number(posNewFeat)))
                    $("#minisocial_area").css({
                        "top": posNewFeat
                    })
            };
            $("#minisocial_area #minisocial_btn").unbind('click').on("click", function (event) {
                event.preventDefault();
                event.stopPropagation();
                $(".minisocial_areablock")
                    .toggleClass('show')
            });

            $("#minisocial_area").draggable({
                handle: ".minisocial_btn",
                axis: 'y',
                start: function (event, ui) {
                },
                drag: function (event, ui) {
                    let leftPosition = ui.position.top;
                    let minTop = 60;
                    let maxTop = window.innerHeight - 220;
                    if (leftPosition < minTop) {
                        ui.position.top = minTop;
                    }
                    if (leftPosition > maxTop) {
                        ui.position.top = maxTop;
                    }
                    $(event.target).data('dragging', true);
                },
                stop: function (event, ui) {
                    $(event.target).data('dragging', false);
                    localstorage_set("MiniSocial_Position", ui.position.top);
                }
            });
            if (sys_isMobile == 1 || sys_isIpad == 1) {
                let position = $("#minisocial_area").offset().top + $("#minisocial_area").outerHeight() + 180;
                let bottomPos = $(window).height() - position + $(window).scrollTop();
                $("#minisocial_area").css("top", bottomPos + "px");
            }

        }

        function gd_checkExist() {
            try {
                let jisloaded = localstorage_get("TrialVerLocal_IsLoaded");
                let checkIsLoaded = (jisloaded !== undefined && jisloaded != "" && JSON.parse(jisloaded).data !== "")
                    ? JSON.parse(JSON.parse(jisloaded).data)
                    : false;
                if (!checkIsLoaded) return false;
                if ((localstorage_get("TrialVerLocal_Module") ?? '') == '') return false;
                if ((localstorage_get("TrialVerLocal_Step") ?? '') == '') return false;
                if ((localstorage_get("TrialVerLocal_Style") ?? '') == '') return false;
                if ((localstorage_get("TrialVerLocal_StylePro") ?? '') == '') return false;
                if ((localstorage_get("TrialVerLocal_StyleStandard") ?? '') == '') return false;
                if ((localstorage_get("TrialVerLocal_StyleBasic") ?? '') == '') return false;
                return true;
            }
            catch (e) {
                return false;
            }
        }
        //#endregion

        //#region // Update Group
        function gd_changegroup(GroupID) {
            try {
                AjaxJWT(
                    url = "/api/Home/UpdateGroupUser",
                    data = JSON.stringify({
                        UserID: sys_userID_Main,
                        GroupID: GroupID,
                    }),
                    async = true,
                    success = function (result) {
                        if (result != "0") {
                            gd_updaterole();
                        }
                    }
                );
            }
            catch (ex) {
            }
        }
        async function gd_updaterole() {
            let objAuthor = author_get("author");
            let objFcm = author_get("fcm");
            if (objAuthor == undefined || objAuthor == "") return;
            let ip = await gd_detectip();

            if (ip == undefined || ip == "" || ip == "0") return;
            let { username, password } = JSON.parse(objAuthor);
            let { token } = objFcm != "" ? JSON.parse(objFcm) : { token: "" };

            AjaxApi((url = "/api/Author/Login"),
                (data = JSON.stringify({
                    UserName: username,
                    Password: "",
                    PasswordEnCrypt: password,
                    IP: ip,
                    TokenFCM: token,
                    From: "",
                    SSO: ""
                })),
                (async = true),
                (success = function (result) {
                    let obj = JSON.parse(result);
                    if (obj.Session) {
                        localStorage.setItem("WebToken", obj.Session);
                        localstorage_set("TokenTopic", obj.TokenTopic);
                    }
                    gd_updatebasedata();
                })
            );
        }
        async function gd_detectip() {
            return new Promise((resolve) => {
                AjaxApi(
                    url = "/api/Author/GetIP",
                    data = JSON.stringify({}),
                    async = true,
                    success = function (result) {
                        if (result != "0") {
                            let d = JSON.parse(result);
                            resolve(d.ip_encry);
                        } else {
                            resolve("0");
                        }
                    },
                    before = function (e) { }
                );
            });
        }
        function gd_updatebasedata() {
            AjaxJWT(url = "/api/Author/BaseData"
                , data = JSON.stringify({})
                , async = true
                , success = function (result) {
                    localstorage_set(session_base, JSON.parse(result));
                    gd_directpage()
                }
            );
        }
        function gd_directpage() {
            try {
                var href = '/Appointment/AppointmentInDay';
                if (session_base && session_base !== '') {
                    var Master_Data = JSON.parse(localstorage_get(session_base)).data;
                    if (Master_Data && Object.values(Master_Data).length !== 0) {
                        var PermissionTableMenu = JSON.parse(Master_Data.PermissionTable_Menu);
                        if (PermissionTableMenu && PermissionTableMenu[0].MenuIDText !== 'menuCustomerCreate' && PermissionTableMenu[0].MenuIDText !== 'menuAppmonitor')
                            href = PermissionTableMenu[0].MenuURL;
                        else href = PermissionTableMenu[1].MenuURL;
                    }
                }
                window.location.href = href;
            }
            catch (ex) {
                window.location.href = '/Appointment/AppointmentInDay';
            }
        }
        //#endregion

        //#region // Welcome and guide
        async function guidemo_getstart() {
            setTimeout(() => {
                gd_Titlerender(); if (sys_isMobile == 0) {
                    document.getElementById('GettingStart_StepDetail').addEventListener('load', videoScroll);
                    document.getElementById('GettingStart_StepDetail').addEventListener('scroll', videoScroll);
                }
                gd_checkTitle();
                gd_PackageRender(function () {
                    gd_InfoAction();
                    gd_PackageEvent();
                });
            }, 500)
        }
        async function gd_PackageRender(callback) {
            try {
                var bodyMain = document.getElementById("BodyMain");
                if (bodyMain === null) return;
                let stringGroupUser = gdata_Group.filter((word) => {
                    return (word.IsActive && keyTrial == word.Type)
                }).map((item) => {
                    return `
                    <div class="col-lg-4 col-md-12 my-0 my-lg-3">
                        <div class="card cursor-pointer groupPerDemo__item mb-4 h-90" data-id="${item.ID}">
                            <div class="card-body p-3">
                                <div class="row">
                                    <div class="col-12">
                                        <div class="numbers">
                                            <p class="text-lg  mb-0 fw-bold text-primary">${item.Name}</p>
                                            <hr class="horizontal dark my-1">
                                            <h5 class="des text-sm text-dark mt-2">
                                                ${item.Description}
                                            </h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    `
                }).join('');

                let stringModalWelcome = `
                <div class="modal fade" id="Welcome_Modal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true" >
                    <div class="modal-dialog modal-xl">
                        <div id="Welcome_ModalContent" class="modal-content bg-gray-100">
                            <div class="container-fluid px-0">
                                <div class="card">
                                    <div class="card-body p-4 p-lg-5">
                                        <button type="button" class="btn-close text-danger fs-1 position-absolute top-1 end-1" data-bs-dismiss="modal" aria-label="Close" >
                                            <span aria-hidden="true">×</span>
                                        </button>
                                        <h4 class="mb-0 fw-bold">VTTECH xin chào Anh/Chị <strong class="text-primary text-uppercase">${sys_userName_Main}!</strong></h4>
                                        <p class="mb-0 mt-3 text-sm text-dark">Đây là <b>phiên bản demo</b>, nhằm mục đích hướng dẫn Anh/chị làm quen với hệ thống phần mềm Vttech.</p>
                                        <p class="mb-0 mt-0 text-sm text-dark">Chúng tôi xin được phép giới thiếu <b>một số chức năng cơ bản, cho từng nhóm user</b> trong quá trình vận hành.</p>
                                        <p class="mb-0 mt-0 text-sm fw-bold text-primary">Khi sử dụng chính thức,có thể có những tùy chỉnh để phù hợp với mô hình thực tế của Quý Anh/Chị.</p>
                                        <hr class="my-4"/>
                                        <div class="col-sm-8 mx-auto">
                                            <div id="groupPerDemo" class="row" >
                                                ${stringGroupUser}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                `;
                bodyMain.insertAdjacentHTML("beforeend", stringModalWelcome);
                callback();
            }
            catch (ex) {
                callback();
            }
        }
        function gd_InfoAction() {
            $('#Welcome_Modal').modal({ backdrop: 'static', keyboard: false })
            let isFirstLogin = localstorage_get("TrialVerFirstLogin");
            if (isFirstLogin === '') $('#btnWelcome_Modal').trigger('click');
            localstorage_set("TrialVerFirstLogin", false);
        }
        function gd_PackageEvent() {
            $("#groupPerDemo .groupPerDemo__item").unbind('click').on("click", function (event) {
                let GroupID = Number($(this).attr("data-id"));
                if (isNaN(GroupID) ||
                    sys_userID_Main == undefined ||
                    sys_userID_Main == 0 ||
                    Number(Master_roleID) == GroupID)
                    return;
                gd_changegroup(GroupID);
            });
        }
        async function gd_Titlerender(path = "") {
            try {
                var btnGetstart = document.getElementById("GettingStart_BlockBtn");
                var modalGetstart = document.getElementById("GettingStart_Modal");
                var btnWelcome = document.getElementById("btnWelcome_Modal");
                if (btnGetstart !== null) btnGetstart.remove();
                if (modalGetstart !== null) modalGetstart.remove();
                if (btnWelcome !== null) btnWelcome.remove();

                let dataPath = gd_TitleDetectPath(path);
                let buttoninfo = `<button id="btnWelcome_Modal" type="button" class="p-2 px-3 bg-primary text-white " data-bs-toggle="modal" data-bs-target="#Welcome_Modal">
                            <i class="fas fa-info"></i>
                        </button>`;

                if (dataPath && Object.entries(dataPath).length !== 0) {
                    var bodyMain = document.getElementById("BodyMain");
                    if (bodyMain === null) return;
                    let stringButton = `

                    <div id="GettingStart_BlockBtn" class="d-flex">
                        <button id="GettingStart_Btn" class="p-2 px-3  btn-primary btn-gettingstart" type="button">
                            <i class="fas fa-rocket me-0 fs-6 gettingstart-icon"></i>
                            <span class="lbguide ps-2">${Outlang["Huong_dan_su_dung"]}</span>
                        </button>
                        <vr class="vr bg-white opacity-3 me-0"></vr>
                    </div>
                    `;
                    let stringModal = `
                    <div class="modal fade" id="GettingStart_Modal" data-bs-backdrop="static" role="dialog">
                        <div class="modal-dialog modal-xl">
                            <div id="GettingStart_ModalContent" class="modal-content bg-gray-100">
                                <div class="container-fluid px-0">
                                    <div class="row">
                                        <div class="col-12">
                                            <div class="card">
                                                <div class="card-body p-3">

                                                    <div class="row">
                                                         <button type="button" class="btn-close d-none d-lg-block text-dark position-absolute top-1 me-3 end-1 p-2" style="z-index-3" data-bs-dismiss="modal" aria-label="Close" >
                                                                   <i class="fas fa-times fs-3 text-danger"></i>
                                                         </button>
                                                        <div class="field col-12 col-md-12 col-lg-3 border-end-sm ">
                                                            <div class="pb-3 border-bottom ps-0 position-relative ">
                                                                <h6 id="GettingStart_Title" class="mb-0 fw-bold ellipsis_one_line">#Title#</h6>
                                                                </br>
                                                                <p id="GettingStart_SubTitle" class="text-sm text-dark mb-0 mt-1">#SubTitle#</p>
                                                                <button type="button" class="d-lg-none d-block btn-close text-dark position-absolute top-1 end-1 p-2" style="z-index-3" data-bs-dismiss="modal" aria-label="Close" >
                                                                   <i class="fas fa-times fs-5 text-danger"></i>
                                                                </button>
                                                            </div>
                                                            <div id="GettingStart_ListStep" class="list-group list-group-flush mt-4 me-3 min-height-300 mb-5">
                                                            </div>
                                                            <div class="flex-fill flex-grow-1 pb-0 overflow-auto mt-2 mt-lg-0">
                                                                <ul id="GettingStart_ListStepSM" class="bg-transparent nav nav-horizontal nav-pills pb-1 permissionlist px-2 pt-0 pb-3" role="tablist" >

                                                                </ul>
                                                            </div>

                                                        </div>
                                                        <div class="field col-12 col-md-12 col-lg-9">
                                                            <div id="GettingStart_StepDetail" class="my-3 px-0 px-lg-3">
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div
                                </div>
                            </div>
                        </div>
                    </div>
                    `;
                    bodyMain.insertAdjacentHTML("beforeend",
                        `<div class="guidetrialarea">${stringButton}${buttoninfo}</div>`

                        + stringModal);
                    gd_DetailFill(dataPath);
                    gd_TitleEvent();
                }
            }
            catch (ex) {
            }
        }
        function gd_TitleEvent() {
            $("#GettingStart_Btn").on("click", function () {
                $("#GettingStart_Modal").modal("show");
                //let data = gd_TitleDetectPath();
                //if (data && Object.entries(data).length != 0) {
                //    $("#GettingStart_Modal").modal("show");
                //    //gd_DetailFill(data);
                //}
            });
            $("#GettingStart_Modal").on("click", function (event) {
                if (!$(event.target).is("#GettingStart_ModalContent") && !$(event.target).closest("#GettingStart_ModalContent").length != 0) {
                    $("#GettingStart_Modal").modal("hide");
                }
            });
        }
        function gd_checkTitle() {
            $('#Welcome_Modal').modal({ backdrop: 'static', keyboard: false })
            let isFirstLogin = localstorage_get("TrialVerFirstLogin");
            if (isFirstLogin === '') $('#btnWelcome_Modal').trigger('click');
            localstorage_set("TrialVerFirstLogin", false);

            var pushState = history.pushState;
            history.pushState = function (state) {
                if (typeof history.onpushstate === "function") {
                    history.onpushstate({ state: state });
                }
                gd_Titlerender(state);
                return pushState.apply(history, arguments);
            };
            window.addEventListener("popstate", function (e) {
                if (e.state) gd_Titlerender(e.state);
            });
        }
        async function gd_DetailFill(data) {
            if (data && Object.keys(data).length != 0) {
                $("#GettingStart_Title").html(data.Title);
                $("#GettingStart_SubTitle").html(data.SubTitle);
                let dataSteps = (data?.Steps ?? "").split(',');
                if (sys_isMobile == 0) {
                    gd_DetailStep_Render(dataSteps, "GettingStart_ListStep", issm = 0, function () {
                        gd_DetailContent_Render(dataSteps, "GettingStart_StepDetail");
                        gd_DetailStep_Event();
                    });
                }
                else {
                    gd_DetailStep_Render(dataSteps, "GettingStart_ListStepSM", issm = 1, function () {
                        gd_DetailContent_Render(dataSteps, "GettingStart_StepDetail");
                        gd_DetailStep_Event();
                    });
                }
            }
        }
        async function gd_DetailStep_Render(data, id, issm, calback) {
            new Promise((resolve) => {
                var myNode = document.getElementById(id);
                if (myNode !== null) {
                    myNode.innerHTML = "";
                    let stringContent = "";

                    if (data !== undefined && data.length !== 0) {
                        for (let i = 0; i < data.length; i++) {
                            let value = gdata_Step[data[i]];
                            if (value !== undefined) {
                                let tr = ``;
                                if (issm == 1) {
                                    tr = `
                                         <li class="nav-item" role="presentation">
                                                <a class="getstep_item nav-link cursor-pointer nav-item-text py-1" data-bs-toggle="pill" data-id="${data[i]}" role="tab">
                                                ${value.Title}
                                                </a>
                                         </li>`;
                                }
                                else {
                                    tr = `
                                        <div class="getstep_item fw-bold text-dark d-flex justify-content-start align-items-center py-2 text-sm ps-4 cursor-pointer mb-1" data-id="${data[i]}">
                                            <span class="text-sm mb-0 ellipsis_two_line">${value.Title}</span>
                                        </div>`;
                                }

                                stringContent += tr;
                            }
                        }
                    }
                    myNode.innerHTML = stringContent;
                    calback();
                }
            });
        }
        async function gd_DetailContent_Render(data, id) {
            new Promise((resolve) => {
                var myNode = document.getElementById(id);
                if (myNode !== null) {
                    myNode.innerHTML = "";
                    let stringContent = "";

                    if (data !== undefined && data.length !== 0) {
                        for (let i = 0; i < data.length; i++) {
                            let item = gdata_Step[data[i]];
                            if (item != undefined) {
                                let _video = ``, _image = ``, _des = ``;
                                if (item.Video != "") {
                                    _video = `<div class="video"><video width="100%" height="100%"  autoplay="false" preload="auto" video autoplay loop muted controls webkit-playsinline playsinline>
                                                      <source src="${item.Video}" type="video/mp4">
                                                      Your browser does not support the video tag.
                                                    </video></div>`;
                                }
                                if (item.Media != "") {
                                    _image = `<div class="image"><img class="w-100 border rounded-3 border-1" src="${item.Media}"/></div>`;
                                }

                                if (item.Description != "") _des = `<p class=" ellipsis_two_line fw-bolder mt-0 text-dark fs-6" >${item.Description}</p>`;
                                let tr = `
                                    <div  class="block pb-3 mb-3">
                                        <a id="pjc_${item.ID}" class="fw-bolder   border-bottom border-primary text-primary text-sm">${item.Title}</a>
                                        <div class="text-sm mt-1">${_des}</div>
                                        <div class="bodys my-2 px-0 px-lg-5">

                                            <div class="d-flex my-3 align-items-center justify-content-center text-center">
                                                ${_video}
                                                ${_image}
                                            </div>
                                            <p class=" ellipsis_three_line mt-3 text-dark text-md" >${item.Content}</p>
                                        </div>
                                     </div>`
                                stringContent = stringContent + tr;
                            }
                        }
                    }
                    myNode.innerHTML = stringContent;
                }
            });
        }

        function gd_DetailStep_Event() {
            $("#GettingStart_ListStep .getstep_item").on("click", function () {
                let id = $(this).attr("data-id");
                document.getElementById("pjc_" + id).scrollIntoView();
                $("#GettingStart_ListStep .getstep_item").removeClass("active");
                $(this).addClass("active");
            });
            $("#GettingStart_ListStepSM .getstep_item").on("click", function () {
                let id = $(this).attr("data-id");
                document.getElementById("pjc_" + id).scrollIntoView();
                $("#GettingStart_ListStepSM .getstep_item").removeClass("active");
                $(this).addClass("active");
            });

            if (sys_isMobile == 0) $("#GettingStart_ListStep .getstep_item:first-child").trigger("click");
            else $("#GettingStart_ListStepSM .nav-item:first-child .getstep_item").trigger("click");
        }

        function gd_TitleDetectPath(path = "") {
            try {
                if (gdata_Module == undefined) return {};
                let getPath = (path != "" ? path : window.location.pathname).toLowerCase();
                for ([key, value] of Object.entries(gdata_Module)) {
                    let arrPath = (value.Paths).split(",");
                    for (let i = 0; i < arrPath.length; i++) {
                        let pathItem = (arrPath[i]).toLowerCase()
                        if (getPath == pathItem || getPath + "/" == pathItem) {
                            return value;
                        }
                    }
                }
                return {};
            } catch {
                return {};
            }
        }
        //#endregion

        //#region //Add chat
        //async function gd_addchat () {
        //    await new Promise((resolve, reject) => {
        //        setTimeout(
        //            () => {
        //                var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
        //                (function () {
        //                    var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
        //                    s1.async = true;
        //                    s1.src = 'https://embed.tawk.to/5e9563fd35bcbb0c9ab0cc4a/1gfq73g16';
        //                    s1.charset = 'UTF-8';
        //                    s1.setAttribute('crossorigin', '*');
        //                    s0.parentNode.insertBefore(s1, s0);

        //                })();
        //            }, 100)
        //    })
        //}
        //async function gd_Mutation () {
        //    await new Promise((resolve, reject) => {
        //        setTimeout(
        //            () => {
        //                //let urlData = `${gdata_Package[keyTrial].url}`;

        //                guidemo_stcontrol();
        //                guidemo_dycontrol(0);
        //                //guidemo_mutabody();
        //                resolve()
        //            })
        //    })
        //}
        //#endregion

        //#region //LoadData
        async function gd_LoadData() {
            return new Promise((resolve) => {
                setTimeout(() => {
                    try {
                        AjaxJWT(url = "/api/DocSys/GetGuideLine"
                            , data = JSON.stringify()
                            , async = true
                            , success = function (result) {
                                if (result != "0") {
                                    let data = JSON.parse(result);
                                    let dataObj = data.reduce((pre, arr) => { if (arr.ID) pre[arr.ID] = arr; return pre; }, {});
                                    resolve(dataObj);
                                }
                                else {
                                    resolve({});
                                }
                                resolve(result);
                            }
                        );
                    }
                    catch (ex) {
                        resolve({});
                    }
                }, 100)
            })
        }
        async function gd_LoadSteps() {
            return new Promise((resolve) => {
                setTimeout(() => {
                    try {
                        AjaxJWT(url = "/api/DocSys/GetGuideLineStep"
                            , data = JSON.stringify({})
                            , async = true
                            , success = function (result) {
                                if (result != "0") {
                                    let data = JSON.parse(result);
                                    let dataObj = data.reduce((pre, arr) => { if (arr.ID) pre[arr.ID] = arr; return pre; }, {});
                                    resolve(dataObj);
                                }
                                else {
                                    resolve({});
                                }
                                resolve(result);
                            }
                        );
                    }
                    catch (ex) {
                        resolve({});
                    }
                }, 100)
            })
        }

        async function gd_CreateCssFile(typestring) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    let result = "";
                    try {
                        
                        jQuery.ajax({
                            url: '/js/ProjectClosure/TrialBasic.js',
                            dataType: 'script',
                            async: false,
                            success: function (res) {
                                let data = BlockControl[typestring];
                                if (data != undefined && data.length != 0) {
                                    for (let i = 0; i < data.length; i++) {
                                        let item = data[i];
                                        let { MutationParent, ChildNode, IsMutation, NotUrl } = item;
                                        if (ChildNode && ChildNode.length > 0) {
                                            for (let j = 0; j < ChildNode.length; j++) {
                                                let ele = ChildNode[j];
                                                let selector = ele.Selector;
                                                if (selector != undefined && selector != "") {
                                                    let styleSelector = ele.IsDisable ? 'pointer-events: none;' : 'display:none !important;';
                                                    result = result + `${selector} { ${styleSelector} }`
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        });

                        resolve(result);
                    }
                    catch (ex) {
                        resolve({});
                    }
                }, 100)
            })
        }
        //#endregion
    }
})(jQuery);