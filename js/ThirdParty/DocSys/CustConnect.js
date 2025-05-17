

//#region // API Connect Docsys

async function APIDSFeedBack_LoadList(limit = 5, beginid = 0, currentid = 0, beforefunc, successfunc, failurefunc, completefunc) {
    if (typeof beforefunc === 'function') beforefunc();
    new Promise((resolve) => {
        setTimeout(() => {
            try {
                AjaxJWT(url = "/api/DocSys/GetFeedBack"
                    , data = JSON.stringify({
                        "limit": limit,
                        "beginid": beginid,
                        "currentid": currentid,
                    })
                    , async = true
                    , success = function (result) {
                        if (result != "0") {
                            if (typeof successfunc === 'function') successfunc(result);
                        }
                        else {
                            if (typeof failurefunc === 'function') failurefunc();
                        }
                        resolve(result);
                        if (typeof completefunc === 'function') completefunc();
                    }
                );
            }
            catch (ex) {
                resolve();
                if (typeof completefunc === 'function') completefunc();
                if (typeof failurefunc === 'function') failurefunc();
            }

        }, 100)
    })
}

async function APIDSRoadMap_LoadList(limit = 5, beginid = 0, beforefunc, successfunc, failurefunc, completefunc) {
    if (typeof beforefunc === 'function') beforefunc();
    new Promise((resolve) => {
        setTimeout(() => {
            try {
                AjaxJWT(url = "/api/DocSys/GetRoadMap"
                    , data = JSON.stringify({
                        "limit": limit,
                        "beginid": beginid,
                    })
                    , async = true
                    , success = function (result) {
                        if (result != "0") {
                            if (typeof successfunc === 'function') successfunc(result);
                        }
                        else {
                            if (typeof failurefunc === 'function') failurefunc();
                        }
                        resolve(result);
                        if (typeof completefunc === 'function') completefunc();
                    }
                );
            }
            catch (ex) {
                resolve();
                if (typeof completefunc === 'function') completefunc();
                if (typeof failurefunc === 'function') failurefunc();
            }

        }, 100)
    })
}

async function APIDSRoadMap_Read(userid = 0, roadmapid = 0, username = "", empname = "", timeread = '20230101000000', beforefunc, successfunc, failurefunc, completefunc) {
    if (typeof beforefunc === 'function') beforefunc();
    new Promise((resolve) => {
        setTimeout(() => {
            try {
                AjaxJWT(url = "/api/DocSys/ReadRoadMap"
                    , data = JSON.stringify({
                        "userid": userid,
                        "roadmapid": roadmapid,
                        "username": username,
                        "empname": empname,
                        "timeread": timeread,
                    })
                    , async = true
                    , success = function (result) {
                        if (result != "0") {
                            if (typeof successfunc === 'function') successfunc(result);
                        }
                        else {
                            if (typeof failurefunc === 'function') failurefunc();
                        }
                        resolve(result);
                        if (typeof completefunc === 'function') completefunc();
                    }
                );
            }
            catch (ex) {
                resolve();
                if (typeof completefunc === 'function') completefunc();
                if (typeof failurefunc === 'function') failurefunc();
            }

        }, 100)
    })
}

async function APIDSRoadMap_CheckIsReaded(userid = 0, beforefunc, successfunc, failurefunc, completefunc) {
    if (typeof beforefunc === 'function') beforefunc();
    new Promise((resolve) => {
        setTimeout(() => {
            try {
                AjaxJWT(url = "/api/DocSys/CheckIsReaded"
                    , data = JSON.stringify({
                        "userid": userid,
                    })
                    , async = true
                    , success = function (result) {
                        if (result != "0") {
                            if (typeof successfunc === 'function') successfunc(result);
                        }
                        else {
                            if (typeof failurefunc === 'function') failurefunc();
                        }
                        resolve(result);
                        if (typeof completefunc === 'function') completefunc();
                    }
                );
            }
            catch (ex) {
                resolve();
                if (typeof completefunc === 'function') completefunc();
                if (typeof failurefunc === 'function') failurefunc();
            }

        }, 100)
    })
}

//#endregion

//#region // NEW FEATURE
async function Master_CustConnect_Init() {
    if (Sys_AllowNotiNewFeatures != 1) {
        $("#MS_NewFeatureToast").remove()
        return;
    }
    Master_CustFeat_Settings();
    Master_CustFeat_EventInit();
}

function Master_CustFeat_Settings() {

    //#region // LOAD CSS
    css_require("/css/custconnect.css");
    //#endregion

    let objNewFeat = localstorage_get("NewFeat_Position");
    if (sys_isMobile == 1) {
        $("#MS_NewFeatureToast").css({
            "top": (window.innerHeight - $("#MS_NewFeatureToast").height())
        });
    }
    else if (objNewFeat != "" && sys_isMobile == 0) {
        let posNewFeat = JSON.parse(objNewFeat)?.data;
        if (!isNaN(Number(posNewFeat)))
            $("#MS_NewFeatureToast").css({
                "top": posNewFeat
            })
    };
    let objNewFeatCollapse = localstorage_get("NewFeat_Collapse");
    if (objNewFeatCollapse != "") {
        let isShow = JSON.parse(objNewFeatCollapse)?.data;
        if (isShow == true) {
            $("#MS_NewFeatureToast").addClass("collapses");
        }
        else {
            $("#MS_NewFeatureToast").removeClass("collapses");
        }
    }
    else {
        if (sys_isMobile == 1)
            $("#MS_NewFeatureToast").addClass("collapses");
        else
            $("#MS_NewFeatureToast").removeClass("collapses");
    };

    $(document).on("click", function (e) {
        let list = $('.fixed-plugin[data-item]');
        if (!$(list).is(e.target) && $(list).has(e.target).length === 0) {
            $('.fixed-plugin[data-item]').removeClass('show')
        }
    });


    APIDSRoadMap_CheckIsReaded(sys_userID_Main,
        beforefunc = function () { },
        successfunc = function (result) {
            let data = JSON.parse(result);
            if (data && data.length != 0) {
                let { HasNewRM, HasNewFB } = data[0];
                if (HasNewRM != undefined && HasNewRM == 1) {
                    $('.MS_NewFeatureToast_Item[data-item="newfeat"]')
                        .addClass("active");
                }
                if (HasNewFB != undefined && HasNewFB == 1) {
                    $('.MS_NewFeatureToast_Item[data-item="feedback"]')
                        .addClass("active");
                }
                Master_CustFeat_CheckNoti()
            }

        },
        failurefunc = function () { },
        completefunc = function () { },
    )
}

function Master_CustFeat_EventInit() {
    $("#MS_NewFeatureToast .MS_NewFeatureToast_Collapse").unbind('click').on("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        if ($(this).data('dragging')) return;
        $("#MS_NewFeatureToast").toggleClass("collapses");
        localstorage_set("NewFeat_Collapse", $("#MS_NewFeatureToast").hasClass('collapses'));
    });
    $("#MS_NewFeatureToast .MS_NewFeatureToast_Item").unbind('click').on("click", function (event) {
        event.preventDefault();
        event.stopPropagation();

        let dataItem = $(this).attr('data-item');
        switch (dataItem) {
            case "newfeat":
                $('.fixed-plugin[data-item="newfeat"]').addClass("show");
                Master_NewFeature_Init();
                break;
            case "feedback":
                $('.fixed-plugin[data-item="feedback"]').addClass("show");
                Master_FeedBack_Init();
                break;
            default:
        };
    });
    $("#MS_NewFeatureToast").draggable({
        handle: ".MS_NewFeatureToast_Collapse",
        axis: 'y',
        start: function (event, ui) {

        },
        drag: function (event, ui) {
            var leftPosition = ui.position.top;
            var minTop = 0;
            var maxTop = window.innerHeight - $("#MS_NewFeatureToast").height();
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
            localstorage_set("NewFeat_Position", ui.position.top);
        }
    });
    ToolPopper();
}

function Master_NewFeature_Init() {
    Master_NewFeature_Load();
}

function Master_FeedBack_Init() {
    $('.MS_NewFeatureToast_Item[data-item="feedback"]')
        .removeClass('active');
    Checking_TabControl_Permission();
    Master_NewFeature_Read(0);
    Master_FeedBack_Load();
}

async function Master_NewFeature_Load() {
    APIDSRoadMap_LoadList(limit = 20, begin = 0,
        beforefunc = function () {
            $("#MS_NewFeatureWaiting").show();
            $("#MS_NewFeature,#MS_NewFeatureEmpty").hide();
        },
        successfunc = function (result) {
            let data = JSON.parse(result);
            if (data && data.length != 0) {
                $("#MS_NewFeature").show();
                $("#MS_NewFeatureEmpty").hide();
                Master_NewFeature_Render(data, "MS_NewFeature");
            }
            else {
                $("#MS_NewFeature").hide();
                $("#MS_NewFeatureEmpty").show();
            }
        },
        failurefunc = function () { },
        completefunc = function () {
            $("#MS_NewFeatureWaiting").hide();
        }
    )
}

async function Master_FeedBack_Load() {
    if (($('#MS_FeedBack')?.length ?? 0) > 0) {
        APIDSFeedBack_LoadList(limit = 20, begin = 0,
            currentid = 0,
            beforefunc = function () {
                $("#MS_FeedBackWaiting").show();
                $("#MS_FeedBack,#MS_FeedBackEmpty").hide();
            },
            successfunc = function (result) {
                let data = JSON.parse(result);
                if (data && data.length != 0) {
                    $("#MS_FeedBack").show();
                    $("#MS_FeedBackEmpty").hide();
                    Master_FeedBack_Render(data, "MS_FeedBack");
                }
                else {
                    $("#MS_FeedBack").hide();
                    $("#MS_FeedBackEmpty").show();
                }
            },
            failurefunc = function () { },
            completefunc = function () {
                $("#MS_FeedBackWaiting").hide();
            }
        )
    }
    else {
        $("#MS_FeedBackEmpty").show();
    }

}

async function Master_NewFeature_Read(roadmapid) {
    try {
        APIDSRoadMap_Read(sys_userID_Main,
            roadmapid, sys_userName_Main,
            sys_employeeName_Main,
            SysDate().FNOW().UTC_DTFullNum()
        )
    }
    catch {

    }
}

async function Master_NewFeature_Render(data, id) {
    return new Promise((resolve) => {
        setTimeout(() => {
            var myNode = document.getElementById(id);
            if (myNode != null) {
                myNode.innerHTML = "";
                if (data && data.length != 0) {
                    for (let i = 0; i < data.length; i++) {
                        let item = data[i];
                        let tr = `
                                    <div class="mb-3 itemfeat cursor-pointer itemfeat_${i}" data-href="${item.Url}" data-roadmap="${item.ID}">
                                        <div class="lazy" data-src="${item.Image}"></div>
                                        <div class="itemfeat-content" style="display: none;">
                                            <div>
                                                <img class="itemfeat-image card-img-top rounded-2">
                                            </div>
                                            <div class="card-body p-2 px-0 pt-3">
                                                <h5 class="fw-bold text-sm itemfeat-title">
                                                    <span class="ellipsis_two_line">${item.Title}</span>
                                                </h5>
                                                <p class="text-secondary text-sm mb-1 ellipsis_three_line itemfeat-desc">
                                                    ${item.Description ?? ""}
                                                </p>
                                                <a href="${item.Url}" class="icon-move-right text-primary text-sm">
                                                    <span>${Outlang["Chi_tiet"]}</span>
                                                    <i class="fas fa-arrow-right text-xs ms-1" aria-hidden="true"></i>
                                                </a>
                                            </div>
                                        </div>
                                        <div class="skeleton">
                                            <div data-skeleton class="w-100 rounded-2" style="aspect-ratio: 4/3;"></div>
                                            <div data-skeleton class="mt-3" style="--skeleton-lines: 3"></div>
                                            <div data-skeleton class="mt-3" style="--skeleton-lines: 2"></div>
                                            <div data-skeleton class="mt-3" style="width:60px;height: 0.7lh" ></div>
                                        </div>
                                    </div>
                                `
                        myNode.insertAdjacentHTML('beforeend', tr);
                    }
                }
                Master_NewFeature_Event(id);
            }
        }, 10)
    })
}

async function Master_FeedBack_Render(data, id) {
    return new Promise((resolve) => {
        setTimeout(() => {
            var myNode = document.getElementById(id);
            if (myNode != null) {
                myNode.innerHTML = "";
                if (data && data.length != 0) {
                    for (let i = 0; i < data.length; i++) {
                        let item = data[i];
                        let tr = `
                                    <div class="itemfeedback cursor-pointer itemfeedback_${i}" data-href="${item.Url}" data-roadmap="${item.ID}">
                                        <div class="">
                                            <div class="card-body p-2 px-0">
                                                <h5 class="fw-bold text-sm itemfeat-title">
                                                    <a class="text-primary ellipsis_two_line" target="_blank" href="https://vttechsolution.com/feedback/feedbackpublic?uid=${item.ID}">
                                                        ${item.StatusName != ""
                                                            ? `<span class="text-sm" style="color:${item.StatusBgColor} ">${item.StatusName}</span>`
                                                            : ""
                                                        }
                                                        <span class="text-dark">${item.Title}</span>
                                                    </a>
                                                </h5>
                                                <p class="text-dark text-sm mb-1 ellipsis_three_line">
                                                    ${item.Content ?? ""}
                                                </p> 
                                                <div class="d-flex flex-column text-sm text-dark" >
                                                    <div>
                                                        <span>Ngày nhận</span>: ${SysDate().FUTC(item.DateReceipt).DateText()}
                                                    </div>
                                                    ${ !(item.DateExpect).includes('1900-01-01')
                                                        ? `<div>
                                                            <span>Ngày dự kiến</span>: ${SysDate().FUTC(item.DateExpect).DateText()}
                                                        </div>`
                                                        : ``
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <hr/>
                                `
                        myNode.insertAdjacentHTML('beforeend', tr);
                    }
                }
            }
        }, 10)
    })
}

function Master_NewFeature_Event(id) {
    $("#" + id + " .itemfeat").unbind('click').on("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        let href = $(this).attr('data-href') ?? "";
        let roadmapid = $(this).attr('data-roadmap') ?? "";
        if (href != "") {
            window.open(href, "_blank");
            $("#MS_NewFeatureToast .MS_NewFeatureToast_Item").removeClass('active');
            $("#MS_NewFeatureToast").removeClass('noti');
            Master_NewFeature_Read(roadmapid);

        }
    })

    const lazyImages = document.querySelectorAll(".itemfeat .lazy");
    const options = {
        threshold: 0.1
    };
    const handleIntersection = (entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.getAttribute("data-src");

                var newImg = new Image;
                newImg.onload = function () {
                    $(img)
                        .siblings('.itemfeat-content')
                        .find('.itemfeat-image').attr('src', this.src)
                    let content = $(img).siblings('.itemfeat-content');
                    let skeleton = $(img).siblings('.skeleton');
                    content.show();
                    skeleton.hide();
                }
                newImg.src = src;
                observer.unobserve(img);
            }
        });
    };
    const observer = new IntersectionObserver(handleIntersection, options);
    lazyImages.forEach((image) => {
        observer.observe(image);
    });
}

function Master_CustFeat_CheckNoti() {
    if ($(".MS_NewFeatureToast_Item.active").length != 0) {
        $("#MS_NewFeatureToast").addClass('noti');
    }
    else {
        $("#MS_NewFeatureToast").removeClass('noti');
    }
}

//#endregion