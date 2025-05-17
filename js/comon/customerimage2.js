
var Blodcusmax_size=sys_Custimgblod!=0? sys_Custimgblod:2000;
var Blodcus_blockshare=sys_Custimgblockshare!=0? sys_Custimgblockshare:0;
var Blodcus_iswamark=sys_Custimgwatermark!=""? sys_Custimgwatermark:"";

var dataImageCustomer=[];
var dataFileCustomer=[];
var editteamplate=0;
var dataImageForm;
var DataTemplateList=[];
var DataTemplate=[];
var TemplateID=0;
var pluginInstance=null;
var CIF_dynamicGallery={};
function ImageCustomer_Ini() {
    DragDropEvent_Item_Img();
}

var CloudItem = Lib_CloudItem(LibType.Cust);

//#region // Event
function CustomerImage_Event() {
    $("#lightgalleryEdit .design_img_item").unbind('click').click(function(e) {
        if($(this).hasClass('prepareDetele'))
            $(this).removeClass('prepareDetele');
        else $(this).addClass('prepareDetele');
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        CustomerImage_ModifiyCount(1);
    })
    $("#lightgalleryEdit").unbind('click').click(function(e) {
        e.stopImmediatePropagation();
    })
    $("#lightgallery_FileEdit .file_pdf").unbind('click').click(function(e) {
        if($(this).hasClass('prepareDetele'))
            $(this).removeClass('prepareDetele');
        else $(this).addClass('prepareDetele');
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        CustomerImage_ModifiyCount(2);
    })
}
function CustomerImage_ModifiyCount(type) {
    var _pre=undefined;
    if(type==1) {
          _pre=$(".design_img_item.prepareDetele");
    }
    else {
        _pre=$(".file_pdf.prepareDetele");
    }
    if(_pre!=undefined&&_pre.length!=0) {
        $('#modifyimg_num').html(`( ${_pre.length} file)`);
    }
    else {
        $('#modifyimg_num').html(``);
    }
}
function CustomerImage_GalleryEvent() {
    $("#lightgallery .CustImage_clsLightGallery").unbind('click').click(function(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        let numCreated=$(this).attr('data-numCreated')? $(this).attr('data-numCreated'):"";
        if(numCreated!="") {
            if(CIF_dynamicGallery[numCreated])
                CIF_dynamicGallery[numCreated].openGallery($(this).index());
        }
    })
}

function ImageFile_Insert(type,folderid,name,realname,realnamefeature,SizeByte,exif,cloudID,cloudFeatID,typeUpload) {

    AjaxLoad(url="/Customer/CustomerImage/?handler=InsertImage"
        ,data={
            'type': type
            ,'folderid': folderid
            ,'name': name
            ,'namefeature': ((realnamefeature!=undefined)? realnamefeature:'')
            ,'realname': realname
            ,'sizebyte': SizeByte
            ,'exif': exif
            ,'cloudID': cloudID
            ,'cloudFeatID': cloudFeatID
            ,'typeUpload': typeUpload
        }
        ,async=true
        ,error=function() {notiError_SW();}
        ,success=function(result) {
            if(result!="0") {
                CustomerImage_Load(folderid,result,(type=="image")? 1:2);
            }
        },sender=null,before=null,complete=null,nolimit=1
    );


}
//#endregion

//#region // Edit Image And File
function ImageEdit_Begin() {
    ImageEdit_BeginSH();
    $("#lightgalleryEdit").show();
    $("#lightgallery").hide();
    $("#lightgallery_File").hide();
    $("#lightgallery_FileEdit").hide();
    $('#lightgalleryEdit').html($('#lightgallery').html());
    
    $("#seg_file").hide();
    CustomerImage_Event();
}
function ImageEdit_BeginSH() {
    $('.before_load').remove();
    $('.error_load').remove();
    $('.beforepdf_load').remove();
    $('.errorpdf_load').remove();
    $(".actionImg").hide();
    $(".actionFile").hide();
    $("#list-button_sort").hide();
    $("#noticeDelete").show();
    $('#modifyimg_num').html(``);
}
function ImageEdit_CancelSH() {
    $(".actionImg").show();
    $(".actionFile").show();
    $("#lightgalleryEdit").hide();
    $("#lightgallery_FileEdit").hide();
    $("#lightgallery").show();
    $("#lightgallery_File").show();
    $("#list-button_sort").show();
    $("#noticeDelete").hide();
    $("#seg_image").show();
    $("#seg_file").show();
}
function ImageEdit_Cancel() {
    ImageEdit_CancelSH();
}
function ImageEdit_DeleteAll() {
    const promise=notiConfirm();
    promise.then(function() {

        if($("#lightgallery_FileEdit").is(":visible")) {
            $('#lightgallery_FileEdit .file_pdf').addClass("prepareDetele");
        }
        else {
            $('#lightgalleryEdit .design_img_item').addClass("prepareDetele");
        }
        ImageEdit_DeleteSelected();
    },function() {});

}
function ImageEdit_EditSelected() {
    var x=document.getElementsByClassName("prepareDetele");
    let type=1;
    if($("#lightgallery_FileEdit").is(":visible")) type=2;
    if(x.length>0) {
        let listid="";
        for(let i=0;i<x.length;i++) {
            listid=listid+','+x[i].dataset.id;
        }
        $("#DetailModal_Content").html('');
        $("#DetailModal_Content").load(`/Customer/CustomerImageEdit?type=${type}&idlist="${listid}"&folderid=${CurrentFolderID_Customer}&ver=${versionofWebApplication}`);
        $('#DetailModal').modal('show');
    }
    else {
        $("#delimg_textShowMessage").html(Outlang["Chua_chon_file"]+"!");
    }
}
function ImageEdit_DeleteSelected() {
    let imagedelete=[];
    var x=document.getElementsByClassName("prepareDetele");

    let type=1;
    if($("#lightgallery_FileEdit").is(":visible")) type=2;
    if(x.length>0) {
        for(let i=0;i<x.length;i++) {
            let element={};
            element.id=x[i].dataset.id;
            element.value=x[i].dataset.realname;
            element.feaure=x[i].dataset.feature;
            imagedelete.push(element);
        }
        AjaxLoad(url="/Customer/CustomerImage/?handler=DeleteImage"
            ,data={
                'data': JSON.stringify(imagedelete),"cusID": ser_MainCustomerID
                ,"folder": CurrentFolderName_Customer
                ,"type": type
            }
            ,async=true
            ,error=function() {notiError_SW();}
            ,success=function(result) {
                if(result=="1") {

                    CustomerImage_Load(CurrentFolderID_Customer,0,type);
                    LoadImgByForm(CurrentFolderID_Customer);
                    notiSuccess();
                    syslog_cutimg('d'
                        ,(typeof CurrentFolderName_Customer!=='undefined'&&CurrentFolderName_Customer!='')? CurrentFolderName_Customer:''
                        ,ser_MainCustomerID);
                }
                else {
                    notiError_SW();
                }
                ImageEdit_CancelSH();
            }

        );
    } else {
        $("#delimg_textShowMessage").html(Outlang["Chua_chon_file"]+"!");
    }
}
function FileEdit_Begin() {
    ImageEdit_BeginSH();
    $("#lightgallery_FileEdit").show();
    $("#lightgallery_File").hide();
    $("#lightgallery").hide();
    $("#seg_image").hide();
    $('#lightgallery_FileEdit').html($('#lightgallery_File').html());
    CustomerImage_Event();
}
// #endregion
//#region // Preview all
function ImagePreview_All() {



    let iszoom=0;
    if($('#cbf_preview').attr('data-zoom')==0) {
        $('#cbf_preview .fa-compress').show();
        $('#cbf_preview .fa-expand').hide();
        $('#cbf_preview').attr('data-zoom',1);
        iszoom=1;
    }
    else {
        $('#cbf_preview .fa-compress').hide();
        $('#cbf_preview .fa-expand').show();
        $('#cbf_preview').attr('data-zoom',0);
        iszoom=0;
    }
    let _obj=$('#lightgallery .design_img_item');
    _obj.each(function(i,obj) {
        let _real=$(this)[0].href;
        let _tiny=$(this)[0].style.backgroundImage;
        if(iszoom==1) {
            $(this).css("background-image",`url("${_real}")`);
            $(this).addClass('expand');
        }
        else {
            $(this).removeClass('expand');
        }


    });
}
//#endregion


//#region // Render Image
function CustomerImage_Load(id,detail_id,type) {
     
    let idetail=(detail_id!=undefined)? detail_id:0;
    AjaxLoad(url="/Customer/CustomerImage/?handler=LoadImageByFolder"
        ,data={
            'currentFolderID': id
            ,'idetail': idetail
            ,'type': type
        }
        ,async=false
        ,error=function() {
        }
        ,success=function(result) {
            let data=JSON.parse(result);
            let dataImage=data.Table; let dataFile=data.Table1;
            if(dataImage!=undefined&&dataImage.length!=0) {
                if(idetail!=0) {
                    let dateNum=(dataImage[i]?.CreatedNum).toString().substring(0,8);
                    if(dataImageCustomer&&dataImageCustomer.length>0
                        &&SysDate().FUTCFULLNUM(dataImageCustomer[0]?.CreatedNum).DateText()
                        ==
                        SysDate().FUTCFULLNUM(dataImage[0]?.CreatedNum).DateText()) {
                        let el=ImageCustomer_RenderEach(dataImage[0]);
                        $('#CustImage_lightgallery'+dateNum).prepend(el);
                    }
                    else {
                        let el=ImageCustomer_RenderCollapseImg(dataImage[0]);
                        $('#lightgallery').prepend(el);
                    }
                    CustImage_GaleryUpdate(dataImage[0],1);
                    dataImageCustomer.push(dataImage[0]);
                }
                else {
                    dataImageCustomer=dataImage;
                    if(dataImage!=undefined) {
                        ImageCustomer_Render(dataImage,"lightgallery");
                    }
                }
                ImageCustomer_Ini()
            }
            else {
                if(Number(type==1)) {
                    dataImageCustomer=[];
                    ImageCustomer_Render(dataImageCustomer,"lightgallery");
                }
            }
            if(dataFile!=undefined&&dataFile.length!=0) {
                if(idetail!=0) {
                    let el=FileCustomer_RenderEach(dataFile[0]);
                    $('#'+"lightgallery_File").prepend(el);
                    dataFileCustomer.push(dataFile[0])
                }
                else {
                    dataFileCustomer=dataFile;
                    if(data!=undefined) {
                        FileCustomer_Render(dataFile,"lightgallery_File");
                    }
                }
            }
            else {
                if(Number(type==2)) {
                    dataFileCustomer=[];
                    FileCustomer_Render(dataFileCustomer,"lightgallery_File");
                }
            }
            
            if(id!=0) {
                $("#item_folder_"+id).html(dataImageCustomer.length+dataFileCustomer.length+' files');
                if((dataImageCustomer.length+dataFileCustomer.length)!=0) {
                    $("#item_folder_"+id).removeClass('d-none');
                }
                else {
                    $("#item_folder_"+id).addClass('d-none');
                }
            }
            CustomerImage_GalleryEvent();
        }
        ,sender=null,before=null,complete=null,nolimit=1
    );
}

function FileCustomer_Render(data,id) {
    var myNode=document.getElementById(id);
    if(myNode!=null) {
        myNode.innerHTML='';
        if(data&&data.length>0) {
            for(let i=0;i<data.length;i++) {
                let el=FileCustomer_RenderEach(data[i]);
                $('#'+id).prepend(el);
            }
        }

    }
}
function FileCustomer_RenderEach(item) {
    let link_file=sys_HTTPImageRoot+item.MasterFolder
        +'/'+item.FolderName+'/file/'+item.RealName;
    let typeClass
    let filepath=item.Name.split('.').pop();
    switch(filepath) {
        case 'docx':
        case 'doc':
            typeClass='fa-file-word text-info';
            break;
        case 'pdf':
            typeClass='fa-file-pdf text-dark';
            break;
        case 'xlsx':
            typeClass='fa-file-excel text-success';
            break;
        case 'xls':
            typeClass='fa-file-excel text-success';
            break;
        case 'mp4': case 'wmv': case 'mkv': case 'flv': case 'mpg': case 'mov':
            typeClass='fa-file-video text-warning';
            break;
        case 'mp3': case 'wma': case 'wav': case 'flac': case 'aac': case 'ogg':
            typeClass='fa-file-audio text-warning';
            break;
        default: {
            typeClass='fa-file text-primary';
            break;
        } 
    }
 
    link_file=FileCustomer_GetLink(item.TypeUpload,item.CloudID,link_file);
    let tr='<a class="border-dashed position-relative border-1 border-secondary border-radius-md m-2 file_pdf d-inline-flex" target="_blank" href="'
        +link_file
        +'" data-name="'+item.Name
        +'" data-id="'+item.ID
        +'" data-realname="'+item.RealName
        +'" data-feature="'+''
        +'" data-created="'+item.Created+'" data-createdby="'
        +item.CreatedBy+'"'+'data-title="'
        +item.Name+'" data-content="'
        +item.CreatedBy+'\n'
        +item.Created+'">'
        +'<div class="p-2 d-flex">'
        +'<div class="mx-auto mt-n1">'
        +'<i class="fas '+typeClass+' p-2  fw-bold fs-3" aria-hidden="true" style="font-size: 28px;"></i>'
        +'</div>'
        +'<div class="flex-grow-1 px-2">'
        +'<div class="p-md-0 pt-3"> '
        +'<h6 class="text-sm fw-bolder mb-1">'+item.Name+'</h6>'
        +'<p class="text-dark mb-0">'+item.CreatedBy+'</p>'
        +'<p class="text-dark text-sm mb-0">'+item.Created+'</p> '
        +'</div>'

        +'</div>  '
        +'</div>  '
        +'<div class="blurprepage d-none w-100 h-100 position-absolute"><div class="blurarea rounded-2 w-100 h-100"></div><i class="fas d-none icon position-absolute fs-3 text-white top-50 start-50 translate-middle fa-check"></i></div>'
        +'</a>'
    return tr;
}
function FileCustomer_GetLink(ty,id,link) {
    ty=ty.toLowerCase();
    switch(ty) {
        case "":
            {
                return link;
                break;
            }
        case "gdrive":
            {
                return Driver_GenFileLink(id);
                break;
            }
        case "gworkspace":
            {
                return Driver_GenFileLink(id);
                break;
            }
            
        default: {
            return link;
            break;
        }
    }
}
function ImageCustomer_Render(data,id) {
    var myNode=document.getElementById(id);
    if(myNode!=null) {
        myNode.innerHTML='';
        if(data&&data.length>0) {
            var promises=[];
            CIF_dynamicGallery={};
            for(let i=0;i<data.length;i++) {
                promises.push(new Promise(resolve => {
                    let el='';
                    let dateNum=(data[i]?.CreatedNum).toString().substring(0,8);
                    if(i==0||SysDate().FUTCFULLNUM(data[i]?.CreatedNum).DateText()!=SysDate().FUTCFULLNUM(data[i-1]?.CreatedNum).DateText()) {
                        el=ImageCustomer_RenderCollapseImg(data[i]);
                        $('#'+id).append(el);
                    }
                    else {
                        el=ImageCustomer_RenderEach(data[i]);
                        $('#CustImage_lightgallery'+dateNum).append(el);
                    }

                    CustImage_GaleryUpdate(data[i]);
                    CustomerImage_GalleryEvent();
                    resolve();
                }));
            }
        }
        try {
            if(promises==undefined) return;
            Promise.all(promises).then((values) => {
                $(".description-rp").popup({
                    transition: "vertical flip",
                    on: "hover",
                    position: "bottom center"
                });
                if(sys_Custimgwatermark!="")
                    $('.cuslightblock').each(function(i,obj) {
                        $(this).on('lgAfterAppendSlide ',function(event) {
                            const {index,prevIndex}=event.originalEvent.detail;
                            let _ob=$(".lg-object.lg-image[data-index='"+index+"']")[0];
                            let canvas=document.createElement('canvas');
                            canvas.className="canvaswatermark";
                            canvas.height=_ob.height;
                            canvas.width=_ob.width;
                            let ctx3=canvas.getContext("2d");
                            ctx3.clearRect(0,0,canvas.width,canvas.height);
                            ctx3.fillStyle="#99979708";
                            ctx3.fillRect(0,0,canvas.width,canvas.height);
                            ctx3.fillStyle="#9e9e9e61";
                            ctx3.font='50px sans-serif';
                            ctx3.textBaseline='middle';
                            ctx3.textAlign="center";
                            ctx3.fillText(sys_Custimgwatermark,canvas.width/2,canvas.height/2);
                            _ob.parentElement.appendChild(canvas);
                        });
                    });

            });
        } catch(e) {

        }
    }

    ImageCustomer_EventSH();

}
function CustImage_GaleryUpdate(item,isPop=0) {
     
    if(item) {
        let e={};
        let el=[]
        let link_img=sys_HTTPImageRoot+item.MasterFolder
            + '/' + item.FolderName + '/' +encodeURIComponent(item.RealName);
        let link_imgthum=sys_HTTPImageRoot+item.MasterFolder
            + '/' + item.FolderName + '/' +encodeURIComponent(item.FeatureImage);

        link_img=ImageCustomer_GetLink(item.TypeUpload,item.CloudID,link_img);
        link_imgthum=ImageCustomer_GetLinkThumb(item.TypeUpload,item.CloudFeatID,link_imgthum) ;

        let sub='<div class="text-sm">'+item.CreatedBy+'</div>'
            +`<div>
            ${SysDate().FUTCFULLNUM(item.CreatedNum).DTText()}
            </div>`;
        let dateNum=(item?.CreatedNum).toString().substring(0,8);
        e["src"]=link_img  ;
        e["thumb"]=link_imgthum;
        e["subHtml"]=sub;
        e["exif"]=item?.exif;
        e["customProp"]=item?.exif!=""?"xxxxx":"";
        el.push(e);
        if(CIF_dynamicGallery[dateNum]) {
            let arrGel=[];
            if(isPop==1) {
                arrGel=[...el,...(CIF_dynamicGallery[dateNum]?.galleryItems??[])];
            }
            else {
                arrGel=[...(CIF_dynamicGallery[dateNum]?.galleryItems??[]),...el]
            }
            CIF_dynamicGallery[dateNum].refresh(arrGel);
        }
        else {

            let _objlight=document.getElementById('CustImage_lightgallery'+dateNum);
            var listplugins=[];
            if(Blodcus_blockshare==1) listplugins=[lgZoom,lgAutoplay,lgFullscreen,lgRotate,lgThumbnail];
            else listplugins=[lgZoom,lgAutoplay,lgFullscreen,lgRotate,lgThumbnail];
            CIF_dynamicGallery[dateNum]=lightGallery(_objlight,{
                speed: 300,
                showZoomInOutIcons: true,
                actualSize: false,
                thumbnail: true,
                plugins: listplugins,
                mode: 'lg-fade',
                dynamic: true,
                dynamicEl: el
            })
            _objlight.addEventListener('lgBeforeSlide',() => {
              
            });
          

        }
    }
}
function ImageCustomer_RenderCollapseImg(item) {
    let tr='';
    let dateNum=(item?.CreatedNum).toString().substring(0,8);
    tr='<div class="accordion" id="CustImage_Accordion'+dateNum+'">'
        +'<div class="accordion-item">'
        +'<p class="accordion-header" id="CustImage_AccHeading'+dateNum+'"> '
        +'<button class="accordion-button font-weight-bold collapsed text-dark ms-2" type="button" data-bs-toggle="collapse" '
        +'data-bs-target="#CustImage_Collapse'+dateNum+'" aria-expanded="true" aria-controls="CustImage_Collapse'+dateNum+'">'
        +'<span class="text-sm text-dark">'+SysDate().FUTCFULLNUM(item?.CreatedNum).DateText()+'</span>'
        +'<i class="collapse-close fas fa-chevron-down text-xs pt-1 position-absolute start-0 mb-1" aria-hidden="true"></i>'
        +'<i class="collapse-open fas fa-chevron-up text-xs pt-1 position-absolute start-0 mb-1" aria-hidden="true"></i>'
        +'</button>'

        +'</p>'
        +'<hr class="horizontal dark my-0">'
        +'<div id="CustImage_Collapse'+dateNum+'" class="accordion-collapse mt-2 collapse collapsesticky show" aria-labelledby="CustImage_AccHeading'+dateNum+'" data-bs-parent="#CustImage_Accordion'+dateNum+'" style="">'
        +'<div class="accordion-body text-sm py-0">'
        +'<div class="cuslightblock" id="CustImage_lightgallery'+dateNum+'">'
        +ImageCustomer_RenderEach(item)
        +'</div>'
        +'</div>'
        +'</div>'
        +'</div>'
        +'</div>';
    return tr;
}

function ImageCustomer_EventSH() {
    $('.design_img_item .hide').unbind().click(function(e) {
        let id=$(this).attr('data-id');
        ImageCustomer_ExeSH(id);
        e.preventDefault();
        e.stopImmediatePropagation();
    });
    $('.design_img_item .show').unbind().click(function(e) {
        let id=$(this).attr('data-id');
        ImageCustomer_ExeSH(id);
        e.preventDefault();
        e.stopImmediatePropagation();
    });
}
function ImageCustomer_ExeSH(id) {
    AjaxLoad(url="/Customer/CustomerImage/?handler=ExeSH"
        ,data={
            'imgid': id
        }
        ,async=true
        ,error=function() {notiError_SW();}
        ,success=function(result) {
            if(result!="0") {
                let data=JSON.parse(result);
                if(data.length>0) {
                    let item=data[0];
                    let button=ImageCustomer_RenderIconSH(item.ID,item.MarkVisible);
                    if($("#appsh_"+item.ID).length) {
                        $("#appsh_"+item.ID).replaceWith(button);
                        ImageCustomer_EventSH();
                    }
                }
            }
        }
    );
}
function ImageCustomer_RenderEach(item) {
       
    let button=ImageCustomer_RenderIconSH(item.ID,item.MarkVisible)
    let link_img=sys_HTTPImageRoot+item.MasterFolder
        + '/' + item.FolderName + '/' +encodeURIComponent(item.RealName);
    let link_feaute=sys_HTTPImageRoot+item.MasterFolder
        + '/' + item.FolderName + '/' +encodeURIComponent(item.FeatureImage);
    link_img=ImageCustomer_GetLink(item.TypeUpload,item.CloudID,link_img);
    let link_imgthum="'"+ImageCustomer_GetLinkThumb(item.TypeUpload,item.CloudFeatID,link_feaute)+"'";
    let sub='<div>'+item.CreatedBy+'</div>'
        +`<div>${SysDate().FUTCFULLNUM(item.CreatedNum).DTText()}</div>`;

    let dateNum=(item?.CreatedNum).toString().substring(0,8);
    let tr='<a data-sub-html ="'+sub+'" data-id="'+item.ID+'" class="description-rp design_img_item CustImage_clsLightGallery" data-numCreated="'+dateNum+'" href="'+link_img
        +'" data-name="'+item.Name
        +'" data-realname="'+item.RealName
        +'" data-feature="'+item.FeatureImage

        +'" data-created="'+item.Created
        +'" data-content="'+item.Description+'" data-variation="inverted blueli" data-createdby="'
        +item.Name+'" style="background-image: url('+link_imgthum+')">'
        +button
        +'<div class="blurprepage d-none w-100 h-100 position-relative"><div class="blurarea w-100 h-100"></div><i class="fas d-none icon position-absolute fs-3 text-white top-50 start-50 translate-middle fa-check"></i></div>'
        +'<img class="imgload" style="width: 0px;height: 0px;object-fit: cover;opacity: 0;"  src="'+link_img+'"/> '
        +'</a>';
    return tr;
}
function ImageCustomer_GetLink(ty,id,link) {
    ty=ty.toLowerCase();
    switch(ty) {
        case "":
            {
                return link;
                break;
            }
        case "gdrive":
            {
                return Driver_GenLink(id);
                break;
            }
        case "gworkspace":
            {
                return Driver_GenLink(id);
                break;
            }
            
        default: {
            return link;
            break;
        }
    }
}
function ImageCustomer_GetLinkThumb(ty,id,link) {
    ty=ty.toLowerCase();
    switch(ty) {
        case "":
            {
                return link;
                break;
            }
        case "gdrive":
            {
                return Driver_GenThumbnail(id);
                break;
            }
        case "gworkspace":
            {
                return Driver_GenThumbnail(id);
                break;
            }
        default: {
            return link;
            break;
        }
    }
}
function ImageCustomer_RenderIconSH(ID,MarkVisible) {
    //0: Phải chọn mới show, 1: phải chọn mới ẩn ( hình ảnh)
    let status=false;
    let result='';
    if(Clicktoshow=="-1") {
        return result;
    }
    else {
        if(Clicktoshow=="0") {
            if(MarkVisible=="-1"||MarkVisible=="0") status=false;
            else status=true;
        }
        else {
            if(MarkVisible=="-1"||MarkVisible=="0") status=true;
            else status=false;

        }
    }
    if(status) result=`<i id="appsh_${ID}" data-id="${ID}" class="sh show"></i>`;
    else result=`<i id="appsh_${ID}" data-id="${ID}" class="sh hide"></i>`;
    return result;
}
function Image_BeginUpload(name) {
    if($('#lightgallery').find('[data-name="'+name+'"]').length==0) {
        let tr='<a class="before_load"  data-name="'+name+'">'
            +'<div class="before_load_absolute"></div>'
            +'</a>';
        $('#lightgallery').prepend(tr);
        CustomerImage_GalleryEvent();
    }
}
function Image_FinishUpload(name) {
    $('#lightgallery').find('[data-name="'+name+'"]').remove();
}
function Image_ErrorUpload(name) {
    $('#lightgallery').find('[data-name="'+name+'"]')
        .removeClass('before_load')
        .addClass('error_load');
}

//#endregion

//#region // Folder
function CustFolder_SHPrepare() {
    CurrentFolderName_Customer='';
    $(".actionImg").hide();
    if(document.getElementById("uploadButton")) document.getElementById("uploadButton").style.display="none";
    if(document.getElementById("btnModifiedImage")) document.getElementById("btnModifiedImage").style.display="none";
    if(document.getElementById("btnSetImage")) document.getElementById("btnSetImage").style.display="none";
    if(document.getElementById("btnDeleteImageOK")) document.getElementById("btnDeleteImageOK").style.display="none";
    if(document.getElementById("btnEditInfoImageOK")) document.getElementById("btnEditInfoImageOK").style.display="none";
    
    if(document.getElementById("btnEditImageCancel")) document.getElementById("btnEditImageCancel").style.display="none";

    $(".actionFile").hide();
    if(document.getElementById("uploadButton_File")) document.getElementById("uploadButton_File").style.display="none";
    if(document.getElementById("btnEditImage_File")) document.getElementById("btnEditImage_File").style.display="none";
    if(document.getElementById("btnEditInfoImageOK_File")) document.getElementById("btnEditInfoImageOK_File").style.display="none";
    if(document.getElementById("btnEditImageCancel_File")) document.getElementById("btnEditImageCancel_File").style.display="none";
}
function CustFolder_SHDone() {
    $("#lightgallery").show();
    $("#noticeDelete").hide();
    $("#lightgallery_File").show();
    $("#uploadButton_File").show();
    $("#btnEditImage_File").show();
    $("#uploadButton").show();
    $("#btnModifiedImage").show();
    $("#btnSetImage").show();
}
function CustFolder_CurrentClick() {
    try {
        if(CurrentFolderID_Customer!=undefined)
            $(`#folder_image_${CurrentFolderID_Customer}`).trigger('click');
    }
    catch(ex) {

    }
   
}
function CustFolder_EventClick() {
    $('#TreeFolderName_Customer .foldername').unbind().click(function() {
     
        CurrentFolderID_Type=$(this).attr('data_type');
        CurrentFolderID_Customer=$(this).attr('data_id');
        ContentIMG(CurrentFolderID_Customer);
        $("#CustImg_AreaDetail").show();
        
        $('#TreeFolderName_Customer .foldername').each(function() {
            $(this).removeClass('active');
        })
        $(this).addClass('active');
        $('#seg_image').show();
        $('#seg_file').show();
        CustImage_AllowUpload(CurrentFolderID_Type);
       
        var textTab=$("#TreeFolderName_Customer .foldername.active")[0].getAttribute('data-foldername');
        var CurrentFolderID=$("#TreeFolderName_Customer .foldername.active")[0].getAttribute('data_id');
        if(textTab) {
            CustFolder_SHDone();
        }
        else {
            textTab="Image";
        }
        CurrentFolderName_Customer=textTab;
        $('.btn-sort').each(function() {
            $(this).removeClass('active');
            $(this).css('pointer-events','unset');
        })
        link_Upload_Image='/Api/Upload/Upload?CustomerID='+ser_MainCustomerID+'&FolderName='+CurrentFolderName_Customer+'&FolderID='+CurrentFolderID+'&Type=Image';
        link_Upload_File='/Api/Upload/Upload?CustomerID='+ser_MainCustomerID
            +'&FolderName='+CurrentFolderName_Customer
            +'&FolderNameChild='+"File"
            +'&FolderID='+CurrentFolderID
            +'&Type=AttachmentFile';
        LoadImgByForm(CurrentFolderID_Customer);
    });
}
function CustImage_AllowUpload(ty) {
    try {
      
        ty=ty.toLowerCase();
        if(GD_CloudCust) {
            $('#content_img').addClass('notallow');
            if(ty=="gdrive"||ty=="gworkspace") {
                CustCloud_Check();
            }

        }
        else {
            $('#content_img').removeClass('notallow');
        }
 
    }
    catch(ex) {
        $('#content_img').addClass('notallow');
    }
}
function CustCloud_Check() {
     
    if(GD_CloudCust) {
        if(typeof CloudStatus_Checking==='function') CloudStatus_Checking(
            failfunc=function() {
                $('#content_img').addClass('notallow');
            },succfunc=function() {
                $('#content_img').removeClass('notallow');
            });

    }
}
function CustCloud_Initialize() {

    if(GD_CloudCust) {
        $("#CustImg_LimitFileChoose").html(CloudItem?.LimitFileChoose ?? 5)
        $('#GD_VerifiedArea').removeClass('d-none');
        $('#GD_VerifiedArea').html('');
        $("#GD_VerifiedArea").load("/Cloud3rd/cloundstatus",function() {
            if(typeof CloudStatus_Checking==='function')  CloudStatus_Checking();
        });
    }
}
function CustFolder_TreatEventClick() {
    $('#FolderTreatmentPlan .item').unbind().click(function() {
        CurrentFolderID_Customer=$(this).attr('data_id');
        CurrentFolderID_Type=$(this).attr('data_type');
        ContentIMGByTreatPlan(CurrentFolderID_Customer);
        $('#FolderTreatmentPlan .item').each(function() {
            $(this).removeClass('active');
        })
        $(this).addClass('active');
        var textTab=$("#FolderTreatmentPlan .item.active")[0].getAttribute('data-foldername');
        var CurrentFolderID=$("#FolderTreatmentPlan .item.active")[0].getAttribute('data_id');
        if(textTab) {
            CustFolder_SHDone();
        }
        else {
            textTab="Image";
        }
        CurrentFolderName_Customer=textTab;
        $('.btn-sort').each(function() {
            $(this).removeClass('active');
            $(this).css('pointer-events','unset');
        })
        link_Upload_Image='/Api/Upload/Upload?CustomerID='+ser_MainCustomerID+'&FolderName='+CurrentFolderName_Customer+'&FolderID='+CurrentFolderID+'&Type=Image';
        link_Upload_File='/Api/Upload/Upload?CustomerID='+ser_MainCustomerID
            +'&FolderName='+CurrentFolderName_Customer
            +'&FolderNameChild='+"File"
            +'&FolderID='+CurrentFolderID
            +'&Type=AttachmentFile';
          

        LoadImgByForm(CurrentFolderID_Customer);
    });
}
function CustFolder_Event() {
    $(".image_edit_folder").on('click',function(event) {
        event.stopPropagation();
        event.stopImmediatePropagation();
        editFolder_ImageCustomer($(this).attr('data_id'),$(this).attr('data_name'));
    });
    $(".image_delete_folder").on('click',function(event) {
        event.stopPropagation();
        event.stopImmediatePropagation();
        DeleteFolderImage_Customer($(this).attr('data_id'),$(this).attr('data_name'));
    });

}
function DeleteFolderImage_Customer(id,name) {
    const promise=notiConfirm(Outlang["Chi_duoc_phep_xoa_khi_folder_trong"]+"."+Outlang["Ban_co_muon_tiep_tuc"] + "?");
    promise.then(function() {ExecuteDeleteFolderImage_Customer(id,name);},function() {});
}
function ExecuteDeleteFolderImage_Customer(id,name) {
    AjaxLoad(url="/Customer/CustomerImage/?handler=DeleteFolder"
        ,data={'customer': ser_MainCustomerID,'id': id,'name': name}
        ,async=true
        ,error=function() {notiError_SW();}
        ,success=function(result) {
            if(result=="1") {
                notiSuccess();
                LoadFolderTree_Customer_File_Image();
                syslog_cutimgfo('d'
                    ,name
                    ,ser_MainCustomerID);
            } else {
                notiError_SW();
            }
        }
    );
}
function CustFolder_Render(data,id) {
 
    var myNode=document.getElementById(id);
    if(myNode!=null) {
        myNode.innerHTML='';
        let stringContent='';
        if(data&&data.length>0) {
            for(var i=0;i<data.length;i++) {
                let item=data[i];
                let type=CustFolder_RenderType(item.CloudType);
     
                let tr=
                    ` <li class="nav-item m-1 align-items-center position-relative">
                        <a id="folder_image_${item.ID}" data_id="${item.ID}" data_type="${item.CloudType}" data-foldername="${item.FolderName}" data-masterFolder="${item.MasterFolder}" class="foldername text-sm item-menu detail nav-link cursor-pointer" data-hover data-bs-toggle="tab">
                           
                            <div class="d-flex">
                                <div class="me-2 mt-1 text-center">${type}</div>
                                <div class=" ">
                                    <p class="mb-0 fw-bold ellipsis_two_line text-dark text-sm">
                                        ${item.FolderName}
                                      
                                    </p>
                                    <div class="d-flex align-items-center mb-1  ">
                                        <div class="text-dark text-xs">${SysDate().FUTC(item.Created).DDowText()}</div>
                                        <div class="text-dark text-xs fw-bold ms-2 ${item.Number!="0"? ` `:` d-none `}" id="item_folder_${item.ID}">${item.Number} files</div>
                                    </div>
                                    <div class="ellipsis_two_line ">
                                        ${item.PatientRecordName!=""? `<span class="mb-0 text-dark text-sm pt-0 pe-1">${item.PatientRecordName}</span>`:``}
                                        ${item.Note!=""? `<span class="mb-0 text-secondary text-sm pt-0">${item.Note}</span>`:``}
                                    </div>
                                     
                                </div>
                               
                            </div>
                            <div class="collapse" id="folder${item.ID}">
                                <div class="d-flex">
                                    <button data_name="${item.FolderName}" data_id="${item.ID}" class="image_edit_folder btn btn-dark btn-sm mt-2 ms-auto mx-1">${Outlang["Sua"]}</button>
                                    <button data_name="${item.FolderName}" data_id="${item.ID}" class="image_delete_folder btn btn-danger btn-sm mt-2 mx-1">${Outlang["Xoa"]}</button>
                                </div>
                            </div>
                        </a>
                        <div data-bs-toggle="collapse" href="#folder${item.ID}"
                            class="cursor-pointer ps-3 opacity-10 ms-auto
                            position-absolute top-0 end-0 p-3
                            " data-bs-toggle="tooltip" data-bs-placement="right" >
                            <i class="fas fa-chevron-down fs-6"></i>
                        </div>
                        <hr class="horizontal dark my-0 opacity-2">
                    </li>`;
                stringContent=stringContent+tr;
            }
        }
        document.getElementById(id).innerHTML=stringContent;
    }
    CustFolder_Event();
}
function CustFolder_RenderType(ty ) {
    let result=``;
    let re='';
    ty=ty.toLowerCase();
    switch(ty) {
        case "gdrive": {
            re=`<img style="" onerror="Master_OnLoad_Error_Image(this)" class="border-radius-sm mt-1 avatar-xs" src="/Image/Google_Drive.png" alt="label-image">`;
            break;
        }
        case "gworkspace": {
            re=`<img style="" onerror="Master_OnLoad_Error_Image(this)" class="border-radius-sm mt-1 avatar-xs" src="/Image/Google_Drive.png" alt="label-image">
                <div class="text-xs mt-1">Wspace</div>
                `;
            break;
        }
        case "": {
            re=`<img onerror="Master_OnLoad_Error_Image(this)" class="border-radius-sm  avatar-xs" src="/Image/Folder_Local.png" alt="label-image">`;
            break;
        }
        default: break;
    }
    result=`<div class="me-1 position-relative">
        ${re}
        
        </div>`;
    return result;
}
//#endregion

//#region // Sort
$('#list-button_sort').on('click','.btn-sort',function(e) {
    $(this).addClass('active').siblings().removeClass('active');
})

//function SortAscending() {
//    let filterFile;
//    let filterImage;

//    filterFile = dataFileCustomer.sort(function (a, b) {
//        var name1 = a.Name.toLowerCase();
//        var name2 = b.Name.toLowerCase();
//        return name1 < name2 ? -1 : name1 > name2 ? 1 : 0;
//    })
//    filterImage = dataImageCustomer.sort(function (a, b) {
//        var name1 = a.Name.toLowerCase();
//        var name2 = b.Name.toLowerCase();
//        return name1 < name2 ? -1 : name1 > name2 ? 1 : 0;
//    })
//    FileCustomer_Render(filterFile, "lightgallery_File");
//    ImageCustomer_Render(filterImage, "lightgallery");

//}
//function SortDescending() {
//    let filterFile;
//    let filterImage;
//    filterFile = dataFileCustomer.sort(function (a, b) {
//        var name1 = a.Name.toLowerCase();
//        var name2 = b.Name.toLowerCase();
//        return name1 > name2 ? -1 : name1 < name2 ? 1 : 0;
//    })
//    filterImage = dataImageCustomer.sort(function (a, b) {
//        var name1 = a.Name.toLowerCase();
//        var name2 = b.Name.toLowerCase();
//        return name1 > name2 ? -1 : name1 < name2 ? 1 : 0;
//    })
//    FileCustomer_Render(filterFile, "lightgallery_File");
//    ImageCustomer_Render(filterImage, "lightgallery");

//}
function SortDateAscending() {
    try {
        let filterFile;
        let filterImage;
        filterFile=dataFileCustomer.sort(function(a,b) {
            var date1=a.CreatedNum;
            var date2=b.CreatedNum;
            return date1<date2? -1:date1>date2? 1:0;
        })
        filterImage=dataImageCustomer.sort(function(a,b) {
            var date1=a.CreatedNum;
            var date2=b.CreatedNum;
            return date1<date2? -1:date1>date2? 1:0;
        })
        FileCustomer_Render(filterFile,"lightgallery_File");
        ImageCustomer_Render(filterImage,"lightgallery");

    } catch(ex) {}
}

function SortDateDescending() {
    try {
        let filterFile;
        let filterImage;
        filterFile=dataFileCustomer.sort(function(a,b) {
            var date1=a.CreatedNum;
            var date2=b.CreatedNum;
            return date1>date2? -1:date1<date2? 1:0;
        })
        filterImage=dataImageCustomer.sort(function(a,b) {
            var date1=a.CreatedNum;
            var date2=b.CreatedNum;
            return date1>date2? -1:date1<date2? 1:0;
        })
        FileCustomer_Render(filterFile,"lightgallery_File");
        ImageCustomer_Render(filterImage,"lightgallery");
    } catch(ex) {}
}
//#endregion

//#region // Load form template image
function LoadTemplateForm() {
    AjaxLoad(url="/Customer/CustomerImage/?handler=LoadTemplateForm"
        ,data={
        }
        ,async=false
        ,error=function() {notiError_SW();}
        ,success=function(result) {
            let item=JSON.parse(result);
            if(item.length>0) {
                DataTemplateList_Default=item;
                ReloadTemplateForm();
            }
        }
    );
}

function ReloadTemplateForm() {
    if(CurrentFolderName_Customer!=''&&DataTemplateList_Default.length>0) {
        let NewDataTemplateList=[];
        let item=DataTemplateList_Default;
        for(let i=0;i<item.length;i++) {
            let _temp=DataTemplateList.filter(word => word["TemplateID"]==item[i].TemplateID)
            if(_temp.length==0) {
                NewDataTemplateList.push(item[i]);
            } else if(_temp.length>0) {
                NewDataTemplateList.push(_temp[0]);
            }
        }

        DataTemplateList=NewDataTemplateList;

        if(DataTemplateList!=undefined&&DataTemplateList.length>0) {
            RenderTemplateList(DataTemplateList,"TemplateList");
            for(let i=0;i<DataTemplateList.length;i++) {
                if(DataTemplateList[i].ID) {
                    TemplateID=DataTemplateList[i].TemplateID;
                    break;
                }
            }
            if(TemplateID==0) {
                TemplateID=DataTemplateList[0].TemplateID;
            }
            RenderDataTemplate(TemplateID);
        } else {
        }

    }
}

function RenderDataTemplate(T_ID) {
    if (DataTemplateList.length > 0) {
        let temp = DataTemplateList.filter(word => word["TemplateID"] == T_ID)[0];
        if (temp) {
            TemplateID = T_ID;
            DataTemplate = JSON.parse(temp.DataTemplate);
        }
    }
    RenderImgByForm(DataTemplate, "templateForm");
}

function RenderTemplateList(data,id) {
    var myNode=document.getElementById(id);
    if(myNode!=null) {
        myNode.innerHTML='';
        let stringContent='';
        if(data&&data.length>0) {
            let isChoose_ID=0;
            let first=0;
            for(var i=0;i<data.length;i++) {
                let item=data[i];
                let exist="";
                if(item.ID) {
                    exist="exist";
                }
                if(item.ID&&first==0) {
                    isChoose_ID=item.ID;
                    first=1;
                }
                let tr='<li class="nav-item"><a  data-id="'+item.TemplateID+'" class="text-sm rounded-3 px-2 tempItem '+exist+(isChoose_ID==item.ID? " active":"")+' text-sm p-1 ms-2">'+item.Name+'</a></li>'

                // let tr = '<div class="tempItem ui button ' + exist + (isChoose_ID == item.ID ? " ischoose" : "") + '" data-id="' + item.TemplateID + '">' + item.Name + '</div>';
                stringContent=stringContent+tr;
            }
        }
        document.getElementById(id).innerHTML=stringContent;
    }
}

function RenderImgByForm(dtTemplate,id) {

    var myNode=document.getElementById(id);
    if(myNode!=null) {
        myNode.innerHTML='';
        let stringContent='';
        let Data=dtTemplate;
        if(Data) {
            let key=0;
            for(let i=0;i<Data.rows;i++) {
                let div='';
                let hr='<hr class="horizontal m-0 p-0">';
                for(let j=0;j<Data.columns;j++) {
                    let item=Data.data[key].content;
                    let header=(Data.data[key].header!=""&&item.x!=0)
                        ? '<span class="mx-2 mb-2  d-flex justify-content-center text-dark" style="">'+Data.data[key].header+'</span>'
                        :'';
                    let hasHeader=(Data.data[key].header!=""&&Data.position!="left")? 'header_template':'';
                    if(item.value==1) {
                        let img="";

                        if(dataImageCustomer!=undefined&&dataImageCustomer.find(x => x.ID==item.img)!=undefined) {
                            let ImgCurrent=dataImageCustomer.find(x => x.ID==item.img);

                            let link_feaute=sys_HTTPImageRoot+ImgCurrent.MasterFolder
                                +'/'+ImgCurrent.FolderName+'/'+ImgCurrent.FeatureImage;
                            let link_img=ImageCustomer_GetLinkThumb(ImgCurrent.TypeUpload,ImgCurrent.CloudFeatID,link_feaute);




                          //  let link_img=sys_HTTPImageRoot+ImgCurrent.MasterFolder+'/'+ImgCurrent.FolderName+'/'+ImgCurrent.RealName;
                            img=
                                '<img class="imgform" src="'+link_img+'">'
                                +'<i data-id="'+ImgCurrent.ID+'" data-x="'+item.x+'" data-y="'+item.y+'" class="text-xs text-gradient text-danger button-delete-img-form vtt-icon vttech-icon-cancel-01"></i>'

                        } else {
                            img='<div class="text-dark m-auto text_img text-center">'+item.placehoder+'</div>'
                        }
                        let style=(Data.position=="left"? 'style="display:flex;"':'');
                        let style_img='';
                        div+='<div '+style+' class="d-inline-block img-content '+hasHeader+'">'+header+'<div '+style_img+' data-x="'+item.x+'" data-y="'+item.y+'" class="selectdrop" >'+img+'</div></div>'
                    } else {
                        div+='<div class="d-inline-block img-content">'+header+'<div class="notdrop"></div></div>'
                    }

                    key++;
                }
                stringContent+=hr+div;
            }
            $("#TemplateFormMain").show();
            $("#btnSetImage").attr("disabled",true);
        } else {
            $("#TemplateFormMain").hide();
            $("#btnSetImage").attr("disabled",false);
        }
        document.getElementById(id).innerHTML=stringContent;
    }

    //$(".selectdrop").lightGallery();
    DragDropEvent_Item_Img();
}


function LoadImgByForm(FolderID) {
    if(CurrentFolderName_Customer!='') {
        AjaxLoad(url="/Customer/CustomerImage/?handler=LoadImgByForm"
            ,data={'FolderID': FolderID}
            ,async=true
            ,error=function() {notiError_SW();}
            ,success=function(result) {
                DataTemplateList=JSON.parse(result);
                let data=DataTemplateList[0];
                if(data!=undefined) {
                    TemplateID=data.TemplateID;
                    if(data.DataTemplate) {
                        DataTemplate=JSON.parse(data.DataTemplate);
                    }
                    //ReloadTemplateForm();
                    LoadTemplateForm();
                    RenderImgByForm(DataTemplate,"templateForm");

                    EventImageInFormGalerryClick();
                } else {
                    $("#btnSetImage").attr("disabled",false);
                    $("#TemplateFormMain").hide();
                    $("#templateForm").empty();
                }
            }

        );


    }
}

function DragDropEvent_Item_Img() {
    $(".design_img_item").draggable({
        scroll: false,
        //axis: "x",
        containment: "#seg_image",
        helper: "clone",
        disable: false,
        start: function(event,ui) {
        },
        drag: function(event,ui) {
        },
        stop: function(event,ui) {
        }
    });

    $(".selectdrop").droppable({
        accept: ".design_img_item",
        class: {
            "ui-droppable-active": "ac",
            "ui-droppable-hover": "hv"
        },
        acivate: function(event,ui) {
        },
        over: function(event,ui) {
        },
        out: function(event,ui) {
        },
        drop: function(event,ui) {
            let idImg=ui.helper.attr('data-id');
            let x=$(this).attr('data-x');
            let y=$(this).attr('data-y');

            Add_Item_Image(idImg,x,y);
        },
        deactivate: function(event,ui) {
        },
    });
}

function Add_Item_Image(idImg,x,y) {
    if(DataTemplate) {
        let key=0;
        for(var i=0;i<DataTemplate.rows;i++) {
            for(var j=0;j<DataTemplate.columns;j++) {
                let item=DataTemplate.data[key].content;
                if(item.x==x&&item.y==y) {
                    item.img=idImg;
                }
                key++;
            }
        }
        ExecuteImgForm();
    }
}

function Img_Noti_Success_Save() {
    let _obj=document.getElementById('img_noti_success');
    _obj.classList.remove('show');
    void _obj.offsetWidth;
    _obj.classList.add('show');
}
function Img_Noti_Failure_Save() {
    let _obj=document.getElementById('img_noti_success');
    _obj.classList.remove('show');
    void _obj.offsetWidth;
    _obj.classList.add('show');
}

function ExecuteImgForm() {
    if(CurrentFolderID_Customer!=''&&DataTemplate!=undefined) {
        AjaxLoad(url="/Customer/CustomerImage/?handler=InsertImgForm"
            ,data={
                'folderid': CurrentFolderID_Customer
                ,'templateid': TemplateID
                ,'data': JSON.stringify(DataTemplate)
            }
            ,async=true
            ,error=function() {notiError_SW();}
            ,success=function(result) {
                if(result=="1") {
                    Img_Noti_Success_Save();
                    ReloadImgTemplateList();
                    RenderImgByForm(DataTemplate,"templateForm");
                } else {
                    Img_Noti_Failure_Save();
                }
            }

        );


    }
}

function ReloadImgTemplateList() {
    if(CurrentFolderID_Customer!=''&&DataTemplate!=undefined&&DataTemplateList.length) {
        for(let i=0;i<DataTemplateList.length;i++) {
            if(DataTemplateList[i].TemplateID==TemplateID) {
                DataTemplateList[i].DataTemplate=JSON.stringify(DataTemplate);
            }
        }
    }
}

function EventImageInFormGalerryClick() {
    var $customImgFormEvents=$('#templateForm');
    $customImgFormEvents.on('onAfterOpen.lg',function(event,prevIndex,index) {

        try {
            _dim_galery_3=document.getElementsByClassName('lg-backdrop')[0];
            _dim_galery_4=document.getElementsByClassName('lg')[0];
            _dim_galery_3.style.display="none";
            _dim_galery_4.style.display="none";
            setTimeout(function() {
                if(CurrentEditImageForm==0) {
                    _dim_galery_3.style.display="block";
                    _dim_galery_4.style.display="block";
                }
            },300);
        }
        catch(ex) {

        }
    });

    $("#templateForm").on('click','.button-delete-img-form',function(e) {
        CurrentEditImageForm=1;
        Remove_Item_Image($(this).attr('data-x'),$(this).attr('data-y'));
        e.stopImmediatePropagation();
    });
}
function Remove_Item_Image(x,y) {
    if(DataTemplate) {
        let key=0;
        for(var i=0;i<DataTemplate.rows;i++) {
            for(var j=0;j<DataTemplate.columns;j++) {
                let item=DataTemplate.data[key].content;
                if(item.x==x&&item.y==y) {
                    item.img="";
                }
                key++;
            }
        }
        ExecuteImgForm();
    }
}
//#endregion // Load form template image

//#region //upload customer img

function AjaxUpload_CustLocalImg(url,inputid,isresize,success,error,before,complete,funmaxrange) {
    $('#'+inputid).unbind("change");
    $('#'+inputid).change(async function() {

        var promises=[];
        let input=document.getElementById(inputid);
        let files = input.files;
        
        if (files.length <= 0 || files.length > (CloudItem?.LimitFileChoose ?? 5)) {
            if(funmaxrange!=undefined&&funmaxrange!=null)
                funmaxrange();
        }
        else {

            for (let i = 0; i < files.length; i++) {
                let originalFile = files[i];
                let _newFiles = sys_cleanFile(originalFile);
                loadImage(_newFiles,{meta: true,orientation: true,canvas: true}).then(function(data) {

                    let img=data.image;
                    let _exifori=CustLocalGetExt(data);

                    let filesize=_newFiles.size;
                    let fileext=_newFiles?.name?.split('.')?.pop();
                    fileext=fileext!=undefined? fileext.toLowerCase():"";
                    let fileiphone=["heif","heic"];
                    //let sizeInMB=(filesize/(1024*1024)).toFixed(2);
                    if ($.inArray(fileext, fileiphone) != -1 || (CloudItem?.IsImageResize ?? isresize)==0) {
                        AjaxUpload_CustLocalImgExe(_exifori,url,_newFiles,_newFiles.name,_newFiles.size,success,error,before);
                    }
                    else {
                        CustLocalImagesize_Resize(url,_newFiles,_newFiles.name,_newFiles.size
                                ,function(_resizedImage,_url,_fileitem,_filename,_size) {
                                    let _refile=new File([_resizedImage],_filename,{
                                        type: _resizedImage.type,
                                    });
                                    if(_refile.size!=0) AjaxUpload_CustLocalImgExe(_exifori,_url,_refile,_filename,_refile.size,success,error,before)
                                    else AjaxUpload_CustLocalImgExe(_exifori,_url,_fileitem,_filename,_size,success,error,before)
                                }
                            )
                    }
                })


            }

            //Promise.all(promises).then((values) => { });
        }
    });
}
 

async function AjaxUpload_CustLocalImgExe(_exifori,url,file,namefile,filesize,success,error,before) {
 
    return new Promise(resolve => {
        CustLocalImagesize_Rotate(file,_exifori).then((rotaimg) => {
            let _refile=new File([rotaimg],namefile,{
                type: rotaimg.type,
            });

            let formData=new FormData();
            formData.append("files",_refile);
            $.ajax(
                {
                    url: url,
                    data: formData,
                    processData: false,
                    contentType: false,
                    type: "POST",
                    error: function(XMLHttpRequest,textStatus,errorThrown) {
                        if(error!=undefined&&error!=null&&error.length!=0) error(namefile);
                    },
                    success: function(result,e) {
                        if(result!=undefined) {
                            if(success!=undefined&&success!=null&&success.length!=0)
                                success(result,namefile,filesize,_exifori);
                        }
                        resolve(true);
                    },
                    beforeSend: function(xhr,e) {
                        xhr.setRequestHeader("Authorization","Bearer "+(localStorage.getItem("WebToken")!=""? localStorage.getItem("WebToken"):getCookie("WebToken")));
                        if(before!=undefined&&before!=null&&before.length!=0)
                            before(namefile);
                    }
                }
            );

        });
      
    });
}
 
async function CustLocalImagesize_Resize(url,fileitem,namefile,size,onCallback) {
    return new Promise(resolve => {


        var reader=new FileReader();
        reader.onload=function(readerEvent) {
            var image=new Image();
            image.onload=function() {

                var canvas=document.createElement('canvas'),
                    max_size=Blodcusmax_size,
                    width=image.width,
                    height=image.height;

                if(width>height) {
                    if(width>max_size) {
                        height*=max_size/width;
                        width=max_size;
                    }
                } else {
                    if(height>max_size) {
                        width*=max_size/height;
                        height=max_size;
                    }
                }
                canvas.width=width;
                canvas.height=height;
                canvas.getContext('2d').drawImage(image,0,0,width,height);
                var dataUrl=canvas.toDataURL('image/jpeg');
                var resizedImage=dataURLToBlob(dataUrl);
                //safaii limit 4000px to dataurl
                onCallback(resizedImage,url,fileitem,namefile,size);
            }
            image.onerror=function(e) {

            }
            image.src=readerEvent.target.result;
        }
        reader.readAsDataURL(fileitem);
    });
}
var dataURLToBlob=function(dataURL) {
    var BASE64_MARKER=';base64,';
    if(dataURL.indexOf(BASE64_MARKER)==-1) {
        var parts=dataURL.split(',');
        var contentType=parts[0].split(':')[1];
        var raw=parts[1];

        return new Blob([raw],{type: contentType});
    }

    var parts=dataURL.split(BASE64_MARKER);
    var contentType=parts[0].split(':')[1];
    var raw=window.atob(parts[1]);
    var rawLength=raw.length;

    var uInt8Array=new Uint8Array(rawLength);

    for(var i=0;i<rawLength;++i) {
        uInt8Array[i]=raw.charCodeAt(i);
    }

    return new Blob([uInt8Array],{type: contentType});
}
async function CustLocalImagesize_Rotate(fileitem,_exifori) {
    return new Promise(resolve => {
        _exifori = _exifori != undefined ? _exifori.toLowerCase() : "";
        if ((_exifori.includes('rotate') && _exifori.includes('90') && _exifori.includes('cw')) && CloudItem?.TransferEdge === undefined) {
      
            var reader=new FileReader();
            reader.onload=function(readerEvent) {
                var image=new Image();
                image.onload=function() {
                    var canvas=document.createElement('canvas'),w=image.width,h=image.height;
                    var ctx=canvas.getContext("2d");
                    canvas.width=w;
                    canvas.height=h;
                    //h=canvas.height;
                    //w=canvas.width;
                    ctx.save();
                    ctx.translate(w/2,h/2);
                    ctx.rotate(0*Math.PI/180);
                    ctx.drawImage(image,-(w/2),-(h/2));
                    ctx.restore();
                    let dataUrl=canvas.toDataURL('image/jpeg');
                    var rotateImage=dataURLToBlob(dataUrl);
                    resolve(rotateImage);
                }
                image.onerror=function(e) {

                }
                image.src=readerEvent.target.result;
            }
            reader.readAsDataURL(fileitem);
        }
        else {
            resolve(fileitem);
        }
        
    });
}

function CustLocalGetExt(_data) {
    try {
         
        if(_data!=undefined&&_data.exif!=undefined) {
           // alert(_data.originalWidth.toString()+'x'+_data.originalHeight.toString())
           // alert(JSON.stringify(_data.exif))
           // alert(_data.exif.getText('Orientation'))
           
            return _data.exif.getText('Orientation');
        }
        else return '';

 

    }
    catch(ex) {
        return '';
    }
}
 
//#endregion