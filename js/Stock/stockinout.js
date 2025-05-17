

//#region // Data 
function sdoc_dataRemove(id) {
    $(`#trGroupNote_${id}`).remove();
    $(`#trGroupSup_${id}`).remove();
    
    $(`#trGroupName_${id}`).remove();
    $(`#rowitem_${id}`).remove();
    delete product_selected[id];
    sdoc_CountTotal();
};

function sdoc_dataAdd(curid,proid,unitid,sku,code,name,supid,unitcountid
    ,packageID,packagenum,numexpired
    ,number,unitamount,iniamount,disamount,disper,amount
    ,note,pricesale,costprice
    ,number_Standard,coef,inputvat)
{
    let el={};
    let _id=proid;
    if (packageID != "" && packageID != "0") _id=proid.toString()+'___'+packageID.toString().toLowerCase();

    el.id=_id;
    el.sku=sku;
    el.code=code;
    el.packageNumber=packagenum;
    el.packageID=packageID;
    el.idProduct=proid;
    el.SupplierID=supid;
    el.UnitCountID=unitcountid;
    el.NameProduct=name;
    el.Number=Number(number) ;
    el.Amount=Number(amount);
    el.Note=note;
    el.Unit_Standard=unitid;
    el.state=1;
    el.idDetail=curid;
    el.ExpiredDay=numexpired;
    el.IniAmount=iniamount;
    el.DiscountAmount=Number(disamount);
    el.DiscountPer=Number(disper);
    el.UnitPrice=Number(unitamount);
    el.PriceSale=Number(pricesale);
    el.CostPrice=Number(costprice);
    el.Number_Standard=Number(number_Standard);
    el.Coef=coef;
    el.InputVat=inputvat;
    
    if(product_selected[_id]!=undefined) sdoc_dataRemove(_id);
    product_selected[_id]=el;
    sdoc_dataRender(_id,el,"sdoc_items");
    sdoc_CountTotal();
}
//#endregion

//#region // Render 
function sdoc_dataRender(key,item,id) {
    var myNode=document.getElementById(id);
    if(myNode!=null) {
        let unitname = ``;
        let packageNum = ``;
        if(data_unitkv[item.Unit_Standard]!=undefined) {
            unitname=data_unitkv[item.Unit_Standard].Name;
        }
        if(item.packageNumber!='') {
            packageNum=` 
               ( <span class="text-dark opacity-8 ps-1">${Outlang["So_lo"]}</span>
                <span class="px-1">${item.packageNumber}</span>
                <span class="px-1 text-dark opacity-8">${Outlang["Het_han"]}</span>
                <span class="pe-1">${SysDate().FUTCFULLNUM(item.ExpiredDay).DateText()}</span>)
             `
        }
        let tr=`
            <tr id="trGroupName_${key}" data-id=${key} class="rounded-3 namemed vt-number" style="border: transparent;">
                <td colspan="100" class="my-0 py-0">
                     <div class="groupname">
                         <div class="d-flex align-items-center">
                             <a class="group  text-dark d-flex align-items-center" data-value=${key}>
                                  <i class="collapse-close opacity-3 fa fa-plus text-xs pt-1 me-2" aria-hidden="true"></i>
                                  <i class="collapse-open opacity-3 fa fa-minus text-xs pt-1 me-2" aria-hidden="true"></i>  
                                   <div class="ms-0 d-flex align-items-center">
                                      <span class="text-dark ps-0 fw-bolder pe-3 vt-number-order">.</span>
                                      <div>
                                        <span class="text-uppercase fw-bold text-dark border-dark border-3 border-bottom pb-0 fs-6">${item.code!=""? item.code:'#'}</span>
                                        <span class="text-uppercase fw-bold text-dark pb-0 fs-6 px-1">${item.sku!=""? item.sku:''}</span>
                                        <span class="text-dark fw-bold pb-0 fs-6">${item.NameProduct}</span>
                                         <span class="text-primary fw-bold pb-0 fs-6 ps-1">${unitname}</span>
                                        ${packageNum}

                                      </div>
                                      
                     
                                  </div>
                              </a> 
                              <a id="trdocdelete_${key}" class="opacity-2 ms-auto remove cursor-pointer" data-id="${key}" ><i class="text-gradient text-danger me-2 fas fa-minus-circle"></i></a>
                          </div>
                      </div>
                 </td>
            </tr>
            <tr id="rowitem_${key}" class="rowitem" data-id="${key}" data-group="${key}"  role="row">
          
                <td>
                     <div class="contain">
                         ${sdoc_renderNumber(key)}
                     </div>
                </td>
                <td style="width: 120px;max-width: 120px;">
                     <div class="contain">
                         ${sdoc_renderUnit(key)}
                     </div>
                </td>
                <td style="width: 70px;max-width: 70px;">
                     <div class="contain">
                         ${sdoc_renderCoe(key)}
                     </div>
                </td>
                <td class="unitprice priceref">
                     <div class="contain">
                         ${sdoc_renderUnitPrice(key)}
                     </div>
                </td>
                <td class="priceref">
                   <div class="contain">
                         ${sdoc_renderprice(key)}
                     </div>
                </td>
                <td class="priceref">
                    <div class="contain">
                         ${sdoc_renderDiscount(key)}
                     </div>
                </td>
                <td class="priceref inputvat">
                    <div class="contain">
                        ${sdoc_renderInputVat(key)}
                     </div>
                </td>
                <td class="priceref">
                   <div class="contain">
                         ${sdoc_renderamount(key)}
                     </div>
                </td>
                 <td>
                   <div class="contain">
                         ${sdoc_rendernorm(key,item.packageNumber)}
                     </div>
                </td>
            </tr>
            <tr data-group="${key}" id="trGroupSup_${key}" >
                <td class="mt-0 py-0" colspan="100" style="border: transparent;">
                    <div class="d-flex">
                        ${sdoc_rendersup(key)}
                    </div>
                 </td>
            </tr>
            <tr data-group="${key}" id="trGroupNote_${key}" >
                <td class="mt-0 py-0" colspan="100" style="border: transparent;">
                    <div class="d-flex">
                        ${sdoc_renderNote(key)}
                    </div>
                 </td>
            </tr>
            `
        myNode.insertAdjacentHTML('beforeend',tr);
    }
 
    sdoc_itemFill(key,item);
    sdoc_itemevent(key);
}
function sdoc_renderNumber(randomNumber) {
    let result=`
      <input id="sdi_number_${randomNumber}" data-id="${randomNumber}" class="itemval num number form-control  ps-2   form-control  d-inline-block" min="0" />
        `
    return result;
}
function sdoc_renderInputVat(randomNumber) {
    let result=`
      <input id="sdi_inputvat_${randomNumber}" data-id="${randomNumber}" class="itemval num inputvat form-control  ps-2   form-control  d-inline-block" min="0" />
        `
    return result;
}

function sdoc_renderCoe(randomNumber) {
   
    let result=`
      <input id="sdi_coef_${randomNumber}" data-id="${randomNumber}" class="itemval num money form-control  ps-2   form-control  d-inline-block" min="0" disabled />
        `
    return result;
}
function sdoc_renderUnitPrice(randomNumber) {
    let result=`
      <input id="sdi_unitprice_${randomNumber}"  data-id="${randomNumber}" class="itemval num money uniprice form-control  ps-2   form-control  d-inline-block" min="0" />
        `
    return result;
}
function sdoc_renderprice(randomNumber) {
    let result=`
      <input id="sdi_price_${randomNumber}" data-id="${randomNumber}" class="itemval num money price form-control  ps-2   form-control  d-inline-block" min="0" disabled />
        `
    return result;
}
function sdoc_renderamount(randomNumber) {
    let result=`
      <input id="sdi_amount_${randomNumber}" data-id="${randomNumber}" class="itemval num money amount form-control  ps-2   form-control  d-inline-block" min="0" disabled />
        `
    return result;
}
function sdoc_rendernorm(randomNumber,packagenum) {
    packagenum=packagenum!=undefined? packagenum:"";
    let packstr=``;
 
    if(packagenum!="") {
 
        packstr=`<div id="sdi_normpackarea_${randomNumber}" class="mt-2 normgroup input-group flex-nowrap">
                <span class="input-group-text itemval w-auto border-end bg-gray-100" style="min-width: 80px;">${Outlang["Sys_lo_hang"]}</span>
                <input id="sdi_norm_${randomNumber}-${packagenum}" data-id="${randomNumber}" class="itemval ms-0 num money norm form-control ps-2 form-control  d-inline-block" min="0" disabled />
                <div class="input-group-text bg-gray-200">
         
                    <i class="fail fas fa-exclamation-circle fw-bold text-danger d-none"></i>
                    <i class="succ fas fa-check-circle fw-bold text-success  d-none"></i>
                </div>
            </div>`
    }
    let result=`
        <div id="sdi_normarea_${randomNumber}" class="input-group normgroup flex-nowrap" >
             <span class="input-group-text itemval w-auto border-end bg-gray-100" style="min-width: 80px;">${Outlang["Sl"]}</span>
                <input id="sdi_norm_${randomNumber}" data-id="${randomNumber}" class="itemval ms-0 num money norm form-control  ps-2   form-control  d-inline-block" min="0" disabled />
                <div class="input-group-text bg-gray-200">
         
                    <i class="fail fas fa-exclamation-circle fw-bold text-danger d-none"></i>
                    <i class="succ fas fa-check-circle fw-bold text-success  d-none"></i>
                </div>
        </div>
        ${packstr} 
        `
    return result;
}

function sdoc_renderNote(randomNumber) {
    let result=`
            <div class="d-flex w-100 align-items-center">
                <div class="text-sm text-dark pe-1">${Outlang["Ghi_chu"]} : </div>
                 <input  id="sdi_note_${randomNumber}" data-id="${randomNumber}" class="note form-control w-100 " type="text" value="" maxlength="500" />
            </div>
             `;
    return result;
}
function sdoc_renderDiscount(randomNumber) {
    let result=  ` 
        <div class="position-relative">
            <input id="sdi_discountvalue_${randomNumber}" data-id="${randomNumber}" class="itemval money discount num form-control  ps-2 pe-5   form-control  d-inline-block" min="0" />
            <div id="sdi_discount_${randomNumber}" data-id="${randomNumber}" class="ui inline dropdown discounttype position-absolute text-sm ms-n3 text-dark top-50 start-100 translate-middle  dropdown-money">
                <input type="hidden" />
                <div class="default text"></div>
                <i class="dropdown icon"></i>
                <div class="menu" tabindex="-1">
                      <div class="item" data-value="1">%</div>
                      <div class="item" data-value="2">VND</div>
                </div>
            </div>
           `; 
    return result;
}
function sdoc_renderUnit(randomNumber) {
    let result=`
          <div id="sdi_unit_${randomNumber}" data-id="${randomNumber}" class="ui fluid search unit selection dropdown form-control itemval text-dark  text-sm   text-nowrap"   >
                <input type="hidden" />
                <i class="dropdown icon"></i>
                <input class="search" autocomplete="off" tabindex="0" />
                <div class="default text">eg .${Outlang["Don_vi"]}</div>
                <div id="sdi_cbbunit_${randomNumber}" class="menu" tabindex="-1">
                </div>
            </div>
        `
    return result;
}
function sdoc_rendersup(randomNumber) {
 
    let result=`
            <div class="suparea d-flex w-100 align-items-center">
                <div class="text-sm  text-dark pe-1">${Outlang["Sys_nha_cung_cap"]} : </div>
                <div id="sdi_sup_${randomNumber}" data-id="${randomNumber}" class="ui fluid  sup search selection dropdown form-control text-dark  text-sm   text-nowrap"   >
                    <input type="hidden" />
                    <i class="dropdown icon"></i>
                    <input class="search" autocomplete="off" tabindex="0" />
                    <div class="default text">eg .${Outlang["Sys_nha_cung_cap"]}</div>
                    <div id="sdi_cbbsup_${randomNumber}" class="menu" tabindex="-1">
                    </div>
                </div>
                 <a id="sdi_supcopy_${randomNumber}" data-bs-toggle="tooltip" data-bs-original-title="${Outlang["Sao_chep"]}" class="copysup ms-2 opacity-1" data-id="${randomNumber}"><i class="far fa-copy"></i></a>
            </div>
             `;

     
    return result;
}
function sdoc_itemFill(key,value) {

    $('#sdi_number_' + key).val(value.Number);
    value.UnitPrice = value.idDetail != 0
        ? value.UnitPrice
        : ((ser_Type == 1 && sdoc_wIsPriceSaleReceipt == 1) || (ser_Type == 2 && sdoc_wIsPriceSaleExport == 1)
            ? value.PriceSale
            : value.CostPrice)
    $('#sdi_unitprice_' + key).val(value.UnitPrice);
    $('#sdi_price_' + key).val(value.IniAmount);
    $('#sdi_amount_' + key).val(value.Amount);
    $('#sdi_note_' + key).val(value.Note);
    $(`#sdi_coef_${key}`).val(value.Coef);
    $(`#sdi_inputvat_${key}`).val(value.InputVat);

    sdoc_itemFillDis(key, value.DiscountPer, value.DiscountAmount);
    sdoc_itemFillSup(key,value.SupplierID);
    sdoc_itemFillUnit(key,value.Unit_Standard,value.UnitCountID);
 
}
 
function sdoc_itemFillSup(key, supid) {
    let { idProduct } = product_selected[key]
    let keystr = "," + idProduct + ",";
    data_supplier.sort(function(a,b) {
        if(a.TokenMaterial.includes(keystr.toString())) {
            a.Name=`<span class="pre">${a.NameString}</span>` ;
            return -1;
        } else {
            a.Name=a.NameString;
        }
        if(b.TokenMaterial.includes(keystr.toString())) {
            b.Name=`<span class="pre">${b.NameString}</span>`;
            //b.Name=`<i class="fas pre fa-caret-right d-none"></i>`+b.NameString;
            return 1;
        } else {
            b.Name=b.NameString;
        }
        return 0;
    });
    Load_Combo(data_supplier,`sdi_cbbsup_${key}`,true);
    $(`#sdi_sup_${key}`).dropdown("refresh");
    $(`#sdi_sup_${key}`).dropdown("set selected",supid); 
}
function sdoc_itemFillUnit(key,unitid,unitchangeid) {
    let _data=[];
    if(data_unitkv[unitid]!=undefined) {
        let namestand = data_unitkv[unitid].Name;
        let { idProduct } = product_selected[key]
        _data.push({"ID": unitid,"Name": namestand});
        let unit = data_productunit.filter(word => word["ProductID"] == idProduct);
        if(unit!=undefined&&unit.length>0) {
            for(let i=0;i<unit.length;i++) {
                _data.push({
                    "ID": unit[i].UnitChange,
                    "Name": unit[i].UnitChangeName
                });
            }
        }
    }
    Load_Combo(_data,`sdi_cbbunit_${key}`,true);
    $(`#sdi_unit_${key}`).dropdown("refresh");
    if(unitchangeid!=0) {
        $(`#sdi_unit_${key}`).dropdown("set selected",unitchangeid);
    }
    else {
        $(`#sdi_unit_${key}`).dropdown("set selected",unitid);
    }
}
function sdoc_itemFillDis(key,per, amount) {
 
    $(`#sdi_discount_${key}`).dropdown("refresh");
    if(Number(per)!=0||(Number(per)==0&&Number(amount)==0)) {
        $(`#sdi_discount_${key}`).dropdown("set selected",1);
        $('#sdi_discountvalue_'+key).val(per); 
    }
    else {
        $(`#sdi_discount_${key}`).dropdown("set selected",2);
        $('#sdi_discountvalue_'+key).val(amount); 
    }
 
}
//#endregion

//#region // Valid
function sdoc_validDis(id) {
    let type=Number($(`#sdi_discount_${id}`).dropdown('get value'))? Number($(`#sdi_discount_${id}`).dropdown('get value')):0;
    let valinput=$(`#sdi_discountvalue_${id}`).val();
    let iniAmount=product_selected[id].IniAmount;
    if(!isNaN(valinput)&&Number(valinput)>=0) {
        $(`#sdi_discountvalue_${id}`).removeClass('error');
        if(type==1) {
            if(valinput>=0&&valinput<=100) {
                $(`#sdi_discountvalue_${id}`).removeClass('error');
                return 1;
            }
            else {
                $(`#sdi_discountvalue_${id}`).addClass('error');
                return 0;
            }
        }
        else {
            if(valinput<=iniAmount) {
                $(`#sdi_discountvalue_${id}`).removeClass('error');
                return 1;
            }
            else {
                $(`#sdi_discountvalue_${id}`).addClass('error');
                return 0;
            }
        }
    }
    else {
        $(`#sdi_discountvalue_${id}`).addClass('error');
        return 0;
    }
}
function sdoc_validVat(id) {
 
    let valinput=$(`#sdi_inputvat_${id}`).val();
    if(!isNaN(valinput)&&Number(valinput)>=0&&Number(valinput)<=100) {
        $(`#sdi_inputvat_${id}`).removeClass('error');
        return 1;
    }
    else {
        $(`#sdi_inputvat_${id}`).addClass('error');
        return 0;
    }
}
function sdoc_validNumber(obj,val,field,gt0) {
    if(obj.length!=0) {
        let iserror=0;
        let id=obj.attr('data-id');
       // id=sdoc_ExtractID(id);
        if(isNaN(val)) iserror=1;
        else {
            if(gt0==1&&Number(val)<=0) iserror=1;
            if(gt0==0&&Number(val)<0) iserror=1;
        }
        if(iserror==0) {
            product_selected[id][field]=Number(val);
            obj.removeClass('error');
        } else {
            product_selected[id][field]=0;
            obj.addClass('error');
        }
    }

}
//#endregion
//#region // Event and count amount 
function sdoc_ItemAllDisAmount(val) {

    sdoc_flag=0;
    val=Number(val);
    let totalAmount=0;

    for([key,value] of Object.entries(product_selected)) {
        totalAmount=totalAmount+Number(value.IniAmount);
        $(`#sdi_discount_${key}`).dropdown("refresh");
        $(`#sdi_discount_${key}`).dropdown("set selected",2);
    }



    let _per=0,_dis=0;
    let _TotalDis=0;

    if(totalAmount!=0) {
        _per=Math.floor((val/totalAmount)*100);
        let array=Object.values(product_selected);
        array.sort((a,b) => a.IniAmount-b.IniAmount);

        for(let i=0;i<array.length;i++) {
            _dis=0;
            if(i==array.length-1) {
                _dis=val-_TotalDis;
            }
            else {
                _dis=Number((array[i].IniAmount*_per)/100);
                _TotalDis=_TotalDis+_dis;
            }

            $(`#sdi_discountvalue_${array[i].id}`).val(_dis);
            sdoc_ItemcountPrice(array[i].id);
        }

    }
    sdoc_flag=1;
}
function sdoc_ItemcountPrice(id) {
    sdoc_flag=0;
    let number=product_selected[id].Number;
    let unitPrice=product_selected[id].UnitPrice;
    let iniamount=number*unitPrice;
    let inputvat=product_selected[id].InputVat;
    let validVat=0;
    product_selected[id].IniAmount=iniamount;
    $(`#sdi_price_${id}`).val(iniamount);
    let isvalid=sdoc_validDis(id);
    let isVatvalid=sdoc_validVat(id);
    if(isvalid==0||isVatvalid==0) {
        product_selected[id].DiscountAmount=0;
        product_selected[id].DiscountPer=0;
        product_selected[id].Amount=product_selected[id].IniAmount;
        product_selected[id].InputVat=0;
        $(`#sdi_amount_${id}`).val(product_selected[id].Amount);
    }
    else {
        let type=Number($(`#sdi_discount_${id}`).dropdown('get value'))? Number($(`#sdi_discount_${id}`).dropdown('get value')):0;
        let valinput=$(`#sdi_discountvalue_${id}`).val();
        if(type==1) {
            product_selected[id].DiscountPer=valinput;
            product_selected[id].DiscountAmount=(iniamount/100)*valinput;
        }
        else {
            product_selected[id].DiscountPer=0;
            product_selected[id].DiscountAmount=valinput;
        }
      
        product_selected[id].Amount=product_selected[id].IniAmount-product_selected[id].DiscountAmount;
        validVat=(product_selected[id].Amount*inputvat)/100;
        product_selected[id].Amount=product_selected[id].Amount+validVat;
        $(`#sdi_amount_${id}`).val(product_selected[id].Amount);

    }

    sdoc_flag=1;
    sdoc_CountTotal();
}
function sdoc_ItemCountUnitPrice(id) {
 
    sdoc_flag=0;
    let proid=product_selected[id].idProduct;
    let unitid=product_selected[id].Unit_Standard;
    let unitchangeid=product_selected[id].UnitCountID;
    let coef=1;
    let unitchange=data_productunitkv[proid+'-'+unitid+'-'+unitchangeid];
    if(unitchange!=undefined) coef=unitchange.Number;
    let costPrice=product_selected[id].CostPrice;
    let priceSale = product_selected[id].PriceSale;
    product_selected[id].UnitPrice = ((ser_Type == 1 && sdoc_wIsPriceSaleReceipt == 1) || (ser_Type == 2 && sdoc_wIsPriceSaleExport == 1))
        ? (priceSale * coef)
        : (costPrice * coef);
 
    product_selected[id].Coef=coef;
    $(`#sdi_coef_${id}`).val(coef);
    product_selected[id].Number_Standard=product_selected[id].Number*coef;
    $(`#sdi_unitprice_${id}`).val(product_selected[id].UnitPrice);
    sdoc_flag=1;
    
}
 
function sdoc_ItemAllSup(id) {
    sdoc_flag=0;
    let val=Number($(`#sdi_sup_${id}`).dropdown('get value'))? Number($(`#sdi_sup_${id}`).dropdown('get value')):0;
    for([key,value] of Object.entries(product_selected)) {
        value.SupplierID=val;
        $(`#sdi_sup_${key}`).dropdown("refresh");
        $(`#sdi_sup_${key}`).dropdown("set selected",val);
    }
    sdoc_flag=1;
}
function sdoc_ItemAllDisPer(val) {
    sdoc_flag=0;

    for([key,value] of Object.entries(product_selected)) {
 
        $(`#sdi_discountvalue_${key}`).val(Number(val));
        $(`#sdi_discount_${key}`).dropdown("refresh");
        $(`#sdi_discount_${key}`).dropdown("set selected",1);
        sdoc_ItemcountPrice(key)
    }
    sdoc_flag=1;
}




function sdoc_itemevent(key) {
    $("#sdoc_items a.group").unbind('click').click(function(event) {
        let key=$(this).attr('data-value');
        if($(this).hasClass('openned')) {
            $(this).removeClass('openned');
            $('#sdoc_items tr[data-group="'+key+'"]').removeClass('d-none');
        }
        else {
            $(this).addClass('openned');
            $('#sdoc_items tr[data-group="'+key+'"]').addClass('d-none');
        }
    });
    $(`#sdi_supcopy_${key}`).unbind('click').click(function(e) {
        if(sdoc_flag==1) {
            let id=$(this).attr('data-id');
            const promise=notiConfirm(Outlang["Sao_chep_nha_cung_cap_cho_tat_ca_san_pham"]);
            promise.then(function() {
                sdoc_ItemAllSup(id);
            },function() {});

            
        }
    });

    
    $(`#sdi_number_${key}`).unbind('change').change(function(e) {
        if(sdoc_flag==1) {
            let id=$(this).attr('data-id');
            sdoc_validNumber($(this),$(this).val(),"Number",1);
            sdoc_ItemCountUnitPrice(id);
            sdoc_ItemcountPrice(id);
        }
    });
    $(`#sdi_inputvat_${key}`).unbind('change').change(function(e) {
        if(sdoc_flag==1) {
            let id=$(this).attr('data-id');
            sdoc_validNumber($(this),$(this).val(),"InputVat",0);
            sdoc_ItemcountPrice(key);
        }
    });
    $(`#sdi_unitprice_${key}`).unbind('change').change(function(e) {
        if(sdoc_flag==1) {
            let id=$(this).attr('data-id');
            sdoc_validNumber($(this),$(this).val(),"UnitPrice",0);
            sdoc_ItemcountPrice(id);
        }
    });
    $(`#sdi_price_${key}`).unbind('change').change(function(e) {
        if(sdoc_flag==1) {
            let id=$(this).attr('data-id');
            sdoc_validNumber($(this),$(this).val(),"IniAmount",0);
            sdoc_ItemcountPrice(id);
        }
    });
    $(`#sdi_amount_${key}`).unbind('change').change(function(e) {
        if(sdoc_flag==1) {
            let id=$(this).attr('data-id');
            sdoc_validNumber($(this),$(this).val(),"Amount",0);
            sdoc_ItemcountPrice(id);
        }

    });
    $(`#sdi_note_${key}`).unbind('change').change(function(e) {
        let id=$(this).attr('data-id');
        let val=$(this).val();
        product_selected[id].Note=val;
    });
    $(`#sdi_unit_${key}`).unbind('change').change(function(e) {
        if(sdoc_flag==1) {
            let id=$(this).attr('data-id');
            let val=Number($(this).dropdown('get value'))? Number($(this).dropdown('get value')):0;
            sdoc_validNumber($(this),val,"UnitCountID",1);
            sdoc_ItemCountUnitPrice(id);
            sdoc_ItemcountPrice(id);
        }
    });
    $(`#sdi_sup_${key}`).unbind('change').change(function(e) {
        if(sdoc_flag==1) {
            let val=Number($(this).dropdown('get value'))? Number($(this).dropdown('get value')):0;
            if(sdoc_suprequire==1) sdoc_validNumber($(this),val,"SupplierID",1);
            else sdoc_validNumber($(this),val,"SupplierID",0);
  
        }
    });
    $(`#sdi_discount_${key}`).unbind('change').change(function(e) {
        if(sdoc_flag==1) {
            let id=$(this).attr('data-id');
            sdoc_ItemcountPrice(id);
        }
    });

    $(`#sdi_discountvalue_${key}`).unbind('change').change(function(e) {
        if(sdoc_flag==1) {
            let id=$(this).attr('data-id');
            sdoc_ItemcountPrice(id);
        }
    }); 
    $(`#trdocdelete_${key}`).unbind('click').click(function(event) {
        let id=$(this).attr('data-id');
        sdoc_dataRemove(id);
       
        
    });

    


    $('#sdoc_items .ui.dropdown').dropdown();
    $('#sdoc_items .money').divide();
    ToolPopper();
}
//#endregion
//#region
function sdoc_ExtractID(__va) {
    try {
        if(__va=="") return "";
        if(__va.includes('___')) return __va.split('___')[0];
    }
    catch(ex) {
        return __va;
    }
   
    
}
    //#endregion