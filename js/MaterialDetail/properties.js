//#region // Stage Service
function Add_new_row_stage_service() {
    let element = {};
    let id = (new Date()).getTime();
    element.id = 0;
    element.PropertyID = 0;
    element.Value = "";
    element.Code = "";
    Material_DataProperties[id] = element;
    Render_PropertiesProduct_Add(id, element, 'dtTablePropertiesProductBody');
    return id;
}

function Event_Element_Stage_Service() {

    $(".PropertiesProduct").bind('change').change(function () {
        let id = this.id.replace("PropertiesProduct_", "");
        let PropertyID = Number($(this).dropdown('get value')) ? Number($(this).dropdown('get value')) : 0;
        Material_DataProperties[id].PropertyID = PropertyID;
    });

    $(".PropertiesValue").bind('change').change(function () {
        let id = this.id.replace("PropertiesValue_", "");
        $(this).attr("value", this.value);
        $(this).val(this.value);
        Material_DataProperties[id].Value = this.value;
    });
    $(".PropertiesCode").bind('change').change(function () {
        let id = this.id.replace("PropertiesCode_", "");
        $(this).attr("value", this.value);
        $(this).val(this.value);
        Material_DataProperties[id].Code = this.value;
    });

    $('#dtTablePropertiesProduct tbody .buttonDeleteClass').bind('click').on('click', function (event) {
        let timespan = Number($(this).closest('tr')[0].childNodes[0].innerHTML);
        delete Material_DataProperties[timespan];
        $('#rowStage_' + timespan).remove();
        event.stopPropagation();
    });
}

async function Render_PropertiesProduct_Add(key, value, id) {
    return new Promise((resolve) => {
        setTimeout(() => {
            var myNode = document.getElementById(id);
            if (myNode != null) {
                let tr =
                    '<td class="d-none">' + key + '</td>'
                    + '<td class=" vt-number-order"></td>'
                    + '<td>' + AddCell_Properties(key) + '</td>'
                    + '<td>' + AddCell_Properties_Code(key) + '</td>'
                    + '<td>' + AddCell_Properties_Value(key) + '</td>'
                    + '<td style="width: 50px;">'
                    + '<button class="buttonGrid"><i class="buttonDeleteClass vtt-icon vttech-icon-delete"></i></button>'
                    + '</td>'
                tr = '<tr class="rowPropertiesProduct vt-number"  id=rowStage_' + key + '>' + tr + '</tr>';
                myNode.insertAdjacentHTML('beforeend', tr);
            }
            Fill_Material_DataProperties(value, key);
            Event_Element_Stage_Service(key);
            ToolPopper();
        }, 10);
    })
}

function AddCell_Properties(randomNumber) {
    let result = `
        <div class="ui fluid search selection dropdown PropertiesProduct form-control" title="${randomNumber}" id="PropertiesProduct_${randomNumber}">
            <input type="hidden"/>
            <i class="dropdown icon"></i>
            <input class="search" autocomplete="off" tabindex="0" />
            <div class="default text">${Outlang["Sys_dac_diem"]  ?? `Đặc điểm`}</div>
            <div id="cbbPropertiesProduct_${randomNumber}" class="menu" tabindex="-1">
            </div>
        </div>
    `
    return result;
}
function AddCell_Properties_Value(randomNumber) {
    let resulf = '<input class="PropertiesValue form-control" id="PropertiesValue_' + randomNumber + '" type="text" />';
    resulf = resulf;
    return resulf;
}

function AddCell_Properties_Code(randomNumber) {
    let resulf = '<input class="PropertiesCode form-control" id="PropertiesCode_' + randomNumber + '" type="text"  maxlength="4" />';
    resulf = resulf;
    return resulf;
}
function Fill_Material_DataProperties(value, key) {
    Load_Combo(DataProperties, "cbbPropertiesProduct_" + key, true);
    if (value) {
        $('#PropertiesProduct_' + key).dropdown('clear');
        $('#PropertiesProduct_' + key).dropdown("refresh");
        $('#PropertiesProduct_' + key).dropdown("set selected", value.PropertyID);
        $('#PropertiesValue_' + key).val(value.Value);
        $('#PropertiesCode_' + key).val(value.Code);
    }
}
function Checking_Validate_Properties_Product() {
    if (Object.values(Material_DataProperties).length > 0) {

        let is_valid = 0;
        let properties_check = "";
        for (const key in Material_DataProperties) {
            let value = Material_DataProperties[key];
            if (value.PropertyID == 0) {
                $('#PropertiesProduct_' + key).addClass('error'); is_valid = 1;
            }
            else $('#PropertiesProduct_' + key).removeClass('error');
            if (value.Code == "") {
                $('#PropertiesCode_' + key).addClass('error'); is_valid = 1;
            }
            else $('#PropertiesCode_' + key).removeClass('error');

            if (value.Value == "") {
                $('#PropertiesValue_' + key).addClass('error'); is_valid = 1;
            }
            else $('#PropertiesValue_' + key).removeClass('error');
        }

        if (is_valid == 1)
            $('#textShowMessageMaster').html(Outlang["Kiem_tra_du_lieu_dac_diem"] ?? "Kiểm tra dữ liệu đặc điểm");
    }

}
//#endregion
