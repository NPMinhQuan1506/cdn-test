var BlockControl = (function () {
    let Data = {
        Dynamic: [
            //#region // Custom element
            {
                MutationParent: "Custom",
                ChildNode: [
                
                    // Danh muc - Trang thai lich hen.
                    { Selector: 'button[form="formSettingSchedule"]',IsDisable: false},
                    {Selector: "#ButtonDeleteScheduleStatus",IsDisable: false},
                    // Danh muc - Thoi gian doi.
                    { Selector: "#SWT_dtcontentBody .buttonDeleteClass",IsDisable: false},
                    //Danh muc - Tag lich hen.
                    { Selector: "#TSch_TableBody .buttonDeleteClass", IsDisable: false },
                    // Danh muc - Bo dieu tri.
                    { Selector: ".TKit_btnDelete", IsDisable: false },
                    // Danh muc - Trang thai chan doan - răng. 
                    // Danh muc - Trang thai chan doan - bộ phận. 
                    { Selector: ".distatus_btnDelete", IsDisable: false },
                     // Danh muc - Noi dung tinh trang. 
                    { Selector: "#dtContentMSContentBody .buttonDeleteClass", IsDisable: false },
                     // Danh muc - Loai tinh trang. 
                    { Selector: "#dtContentMSType_Body .buttonHideClass", IsDisable: false },
                     // Danh muc - Cau hinh khach hang
                    { Selector: "#SCus_BtnExecute", IsDisable: false },
                     // Danh muc - Loại vb cam ket khach hang.
                    { Selector: ".RuleType_btnDelete", IsDisable: false },
                     // Danh muc - Đinh khoan ke toan.
                    { Selector: ".AEL_buttonEditClass ", IsDisable: false },
                     // Danh muc - Tang phong
                    { Selector: "#btnDeleteChair", IsDisable: false },
                    // Danh muc - Mau in
                    { Selector: "#lf_btndis", IsDisable: false },
                    { Selector: "#lf_btnenable", IsDisable: false },
                    { Selector: "#lf_btnlock", IsDisable: false },
                    { Selector: "#lf_btnunlock", IsDisable: false },
                    { Selector: "#lf_btnDelete", IsDisable: false },
                    { Selector: "#lf_btnImport", IsDisable: false },
                    { Selector: ".lf_AddEditCount", IsDisable: false },
                    { Selector: "#OF_UploadFile", IsDisable: false },
                    //Kho - Cài đặt - danh sách kho
                    { Selector: "#dtContentWareHouseBody .buttonDeleteClass", IsDisable: false },
                    //Marketing - Cài đặt - danh sách fanpage
                    { Selector: "#panpage_dtContent .buttonDeleteClass", IsDisable: false },

                    //Khách hàng - Hình ảnh
                    { Selector: "#GD_NonVerifieded", IsDisable: false },
                    { Selector: ".image_delete_folder ", IsDisable: false },
                    { Selector: "#INF_btnSave ", IsDisable: false },

                    //Nhân viên - Danh sách nhân viên
                    { Selector: "#EmpIm_BtnExec", IsDisable: false },
                ],
                IsMutation: false
            },
            //#endregion 

            {
                MutationParent: "menuDesktopCategory",
                ChildNode: [
                    {Selector: "#sidenav-collapse-main #menuDesktopCategory a[href*='/employee/userlist']", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "Sidebar - nhân vien, user"},
                    {Selector: "#sidenav-collapse-main #menuDesktopCategory a[href*='/marketing/store/ticketstore']", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "ticketstore"}
                ] ,
                IsMutation: false
            },
            {
                MutationParent: "MS_LanguageArea",
                ChildNode: [
                    { Selector: "#MS_LanguageArea", IsDisable: true, ParrentSelector: "", AttrMuta: null, Note: "Language popup"},
                ] ,
                IsMutation: false
            },
            //#region //NavService
            //#region //Service
            {
                MutationParent: "ServicetList",
                ChildNode: [
                    {Selector: "#ServicetList #SerList_btnAddGroup", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "btnAddGroup"},
                    {Selector: "#ServicetList #SerList_btnAdd", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "btnAdd"},
                    {Selector: "#ServicetList #dtContentService tr th.servicelist_thHanlde", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "thHandle th"},
                ],
                IsMutation: false
            },
            {
                MutationParent: "dtContentServiceBody",
                ChildNode: [
                    {Selector: "#ServicetList #dtContentServiceBody tr td.ServiceList_rowBtnHandle", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "tdHandle td"},
                ],
                IsMutation: true
            },
            {
                MutationParent: "ServiceDetail_Div",
                ChildNode: [
                    {Selector: "#ServiceDetail_Div #divServiceDetailMain #ServiceDetail_btnSave", IsDisable: false, ParrentSelector: "", AttrMuta: ['style'], Note: "ServiceDatail btnSave"},
                    {Selector: "#ServiceDetail_Div #divServiceDetailMain #ServiceDetail_btndele", IsDisable: false, ParrentSelector: "", AttrMuta: ['style'], Note: "ServiceDatail btnSave"},
                    {Selector: "#divServiceDetailMain #tabOther", IsDisable: false, ParrentSelector: "", AttrMuta: ['style'], Note: "ServiceDatail Tab Other" },
                    {Selector: "#ServiceDetail_Div #SD_Fileup_LoadImage", IsDisable: false, ParrentSelector: "", AttrMuta: ['style'], Note: "Upload image"}, // New
                    { Selector: `#divServiceDetailMain #tabNoteService`, IsDisable: false, ParrentSelector: "", AttrMuta: ['style'], Note: "ServiceDatail Tab NoteService" },
                ],
                IsMutation: true
            },
            //#endregion
            //#region //Medicine

            {
                MutationParent: "PrescriptionMedicineList",
                ChildNode: [
                    {Selector: "#PrescriptionMedicineList #Prescription_btnAdd", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "btnAdd"},
                    { Selector: "#PrescriptionMedicineList .Prescription_thHandle", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "btnDelete"},
                ],
                IsMutation: false
            },
            {
                MutationParent: "dtContentPrescriptionMedicineBody",
                ChildNode: [
                    {Selector: "#PrescriptionMedicineList #dtContentPrescriptionMedicineBody tr td.Prescription_rowBtnHandle", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "tdHandle td"},
                ],
                IsMutation: true
            },
            {
                MutationParent: "PrescriptionMedicineDetail",
                ChildNode: [
                    {Selector: "#PrescriptionMedicineDetail #Medicine_Container #Medicine_btnSave",IsDisable: false,ParrentSelector: "",AttrMuta: ['style'],Note: "MedicineDetail - btnSave"},
                   
                ],
                IsMutation: true
            },
            //#endregion
            //#endregion

            //#region //Nav Card
            //#region //PrepaidCard
            {
                MutationParent: "divServiceCardList",
                ChildNode: [
                    {Selector: "#divServiceCardList #SCD_btnAdd", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "btnAdd"},
                    {Selector: "#divServiceCardList #SC_Content tr th.SC_thHandle", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "thHandle th"},
                ],
                IsMutation: false
            },
            {
                MutationParent: "divServiceCardList",
                ChildNode: [
                    {Selector: "#divServiceCardList #SC_ContentBody tr td.SC_rowBtnHandle", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "tdHandle td"},
                ],
                IsMutation: true
            },
            {
                MutationParent: "divServiceCardDetail",
                ChildNode: [
                    { Selector: "#divServiceCardDetail #ServiceCard_btnSave", IsDisable: false, ParrentSelector: "", AttrMuta: ['style'], Note: "PrepaidCardDetail - btnSave" },
                    {Selector: "#divServiceCardDetail #SC_BtnDelete", IsDisable: false, ParrentSelector: "", AttrMuta: ['style'], Note: "PrepaidCardDetail - btnDel"},
                ],
                IsMutation: true
            },
            //#endregion

            //#region //Card Status
            {
                MutationParent: "CLContentBody",
                ChildNode: [
                    {Selector: "#divCardList #CLContentBody tr td.CardList_rowBtnHandle .buttonMoveClass", IsDisable: false, ParrentSelector: "button", AttrMuta: null, Note: "tdHandle td btnMove"},
                ],
                IsMutation: true
            },
            {
                MutationParent: "CLContentBody",
                ChildNode: [
                    {Selector: "#divCardList #CLContentBody tr td.CardList_rowBtnHandle .buttonSendSMSClass", IsDisable: false, ParrentSelector: "button", AttrMuta: null, Note: "tdHandle td btmSMS"},
                ],
                IsMutation: true
            },
            //#endregion
            //#endregion

            //#region //Warehouse
            //#region //Inventory Manag
            {
                MutationParent: "Dw_detail",
                ChildNode: [
                    {Selector: "#Dw_detail #StockOutMain #StockInfo #DetailWare_WareReceiptDiv", IsDisable: false, ParrentSelector: "", AttrMuta: ['style'], Note: "InventoryDetail - WareReceipt"},
                    { Selector: "#Dw_detail #btnSaveDetail", IsDisable: false, ParrentSelector: "", AttrMuta: ['style'], Note: "InventoryDetail - btnSave" },
                    {Selector: "#Dw_detail #DocStock_Main #StockIn_AddNewProduct", IsDisable: false, ParrentSelector: "", AttrMuta: ['style'], Note: "InventoryDetail - btnAddProduct"},
                    { Selector: "#Dw_detail #sid_btnImport", IsDisable: false, ParrentSelector: "", AttrMuta: ['style'], Note: "InventoryDetail - btn save import"},
                ],
                IsMutation: true
            },
            //#endregion
            //#region //Require
            {
                MutationParent: "re_detail",
                ChildNode: [
                    { Selector: "#re_detail #btnSaveDetail", IsDisable: false, ParrentSelector: "", AttrMuta: ['style'], Note: "btnSave" },
                    {Selector: "#re_detail #btnDeleteDetail", IsDisable: false, ParrentSelector: "", AttrMuta: ['style'], Note: "btnDel"},
                    {Selector: "#re_detail #RequireDetail_btnAddProduct", IsDisable: false, ParrentSelector: "", AttrMuta: ['style'], Note: "btnAddProduct"},
                    {Selector: "#re_detail #ReqWareDetail_btnAddProduct", IsDisable: false, ParrentSelector: "", AttrMuta: ['style'], Note: "btnAddProduct"},
                    {Selector: "#re_detail #btnSaveDetail", IsDisable: false, ParrentSelector: "", AttrMuta: ['style'], Note: "btn save"},
                ],
                IsMutation: true
            },
            //#endregion
            //#region //Warehouse Export
            {
                MutationParent: "ExportDetail_Container",
                ChildNode: [
                    {Selector: "#ExportDetail_Container #btnWareHouse_Delete", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "btnDel"},
                ],
                IsMutation: false
            },
            //#endregion
            //#region //Warehouse Export Material
            {
                MutationParent: "divMaterialDetail",
                ChildNode: [
                    {Selector: "#btnWareHouse_UnExport", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "btn cancel exporting"},
                    {Selector: "#btnWareHouse_Save", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "btn save"},
                    {Selector: "#btnWareHouse_Delete", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "btn delete"},
                ],
                IsMutation: true
            },
            //#endregion
            //#region //DrugStor
            {
                MutationParent: "WDS_DetailContainer",
                ChildNode: [
                    {Selector: "#WDS_DetailContainer #DSD_btnWareHouse_Save", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "btnSave"},
                ],
                IsMutation: false
            },
            //#endregion
            //#region //Material 
            {
                MutationParent: "MaterialtList",
                ChildNode: [
                    {Selector: "#MaterialtList #wml_btnAddType", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "btnAddType"},
                    {Selector: "#MaterialtList #wml_btnAdd", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "btnAdd"},
                    {Selector: "#MaterialtList #wml_dtContent tr th.wml_thHandle", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "thHandle th"},
                ],
                IsMutation: false
            },
            {
                MutationParent: "wml_dtContentBody",
                ChildNode: [
                    {Selector: "#MaterialtList #wml_dtContentBody tr td.wml_rowBtnHandle", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "tdHandle td"},
                ],
                IsMutation: true
            },
            {
                MutationParent: "MaterialDetail",
                ChildNode: [
                    {Selector: "#MaterialDetail #btn_delete_material", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "btnDel"},
                    {Selector: "#MaterialDetail #btn_save_material", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "btn Save"},
                ],
                IsMutation: true
            },
            //#endregion
            //#region //Settings
            {
                MutationParent: "divMainPageWareHouse",
                ChildNode: [
                    {Selector: "#WSUnit_Container #WSUnit_btnAdd", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "Unit btnAdd"},
                    {Selector: "#WSUnit_Container #dtContentUnit tr th.WSUnit_thHandle", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "thHandle th"},
                    {Selector: "#WSUnit_Container #dtContentUnitBody tr td.WSUnit_rowBtnHandle", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "tdHandle td"},

                    {Selector: "#WSSup_Container #WSSup_btnAdd", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "Supplier btnAdd"},
                    {Selector: "#WSSup_Container #dtContentSupplier tr th.WSSup_thHandle", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "thHandle th"},
                    {Selector: "#WSSup_Container #dtContentSupplierBody tr td.WSSup_rowBtnHandle", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "tdHandle td"},

                    {Selector: "#WSEReason_Container #WSEReason_btnAdd", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "ExportReason btnAdd"},
                    {Selector: "#WSEReason_Container #dtContentWareHouseExportReason tr th.WSEReason_thHandle", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "thHandle th"},
                    { Selector: "#WSEReason_Container #dtContentWareHouseExportReasonBody tr td.WSEReason_rowBtnHandle", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "tdHandle td" },


                    { Selector: "#orl_Container #orl_btnAdd", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "Reject reason btnAdd" },
                    { Selector: "#orl_Container #orl_dtContent tr th.orl_thHandle", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "thHandle th"},
                    { Selector: "#orl_Container #orl_dtContent tr td.orl_rowBtnHandle", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "tdHandle td" },

                    { Selector: "#dtContentPro2 tr .buttonDeleteClass", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "tdHandle td" },

                    { Selector: "#dtContentProGroup_Body tr th.ProGroup_thHandle", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "thHandle th" },
                    { Selector: "#dtContentProGroup_Body tr td.ProGroup_rowBtnHandle", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "tdHandle td" },
                ],
                IsMutation: true
            },

            //#endregion
            //#endregion

            //#region //Marketing
            //#region //Tiket file
            {
                MutationParent: "TFM_Main",
                ChildNode: [
                    {Selector: "#TFM_Main #TFM_ImportMain #EmployeeMarID", IsDisable: false, ParrentSelector: "div.field", AttrMuta: null, Note: "cbbemployee "},
                    {Selector: "#TFM_Main #TFM_ImportMain #btnTicketExecute", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "button upload "},
                ],
                IsMutation: false
            },
            //#endregion
            //#region //Voucher
            {
                MutationParent: "DiscountVL_Container",
                ChildNode: [
                    {Selector: "#DiscountVL_Container #DiscountVL_btnAdd", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "btnAdd"},
                ],
                IsMutation: false
            },
            {
                MutationParent: "dtContentDiscountVoucherBody",
                ChildNode: [
                    {Selector: "#DiscountVL_Container #dtContentDiscountVoucherBody tr td.DiscountVL_rowBtnHandle .buttonDeleteClass", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "tdHandle td"},
                ],
                IsMutation: true
            },
            {
                MutationParent: "voucherDetail",
                ChildNode: [
                    { Selector: "#voucherDetail #VoucherDetail_btnSave", IsDisable: false, ParrentSelector: "", AttrMuta: ['style'], Note: "btnSave" },
                ],
                IsMutation: true
            },
            //#endregion
            //#region //Promotion
            {
                MutationParent: "discountList",
                ChildNode: [
                    {Selector: "#discountList #discountbtnadd", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "btnAdd"},
                ],
                IsMutation: false
            },
            {
                MutationParent: "dtContentDiscountListBody",
                ChildNode: [
                    {Selector: "#discountList #dtContentDiscountListBody tr td.discountlist_rowBtnHandle .buttonDeleteClass", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "tdHandle td"},
                ],
                IsMutation: true
            },
            {
                MutationParent: "discountDetail",
                ChildNode: [
                    { Selector: "#discountDetail #DiscountDetail_btnSave", IsDisable: false, ParrentSelector: "", AttrMuta: ['style'], Note: "PromotionDatail btnSave" },
                ],
                IsMutation: true
            },
            //#endregion
            //#endregion
            //#region //Staff & User
            //#region //Staff
            {
                MutationParent: "employeeList",
                ChildNode: [
                    {Selector: "#employeeList #employeeList_btnAddGroup", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "btnAddGroup"},
                    {Selector: "#employeeList #dtContentEmpGroupList #grColumnDeleteEmpType", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "btnAddGroup"},
                    {Selector: "#employeeList #employeeList_btnAdd", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "btnAdd"},
                    {Selector: "#employeeList #dtContentEmpList .buttonChangeState", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "tr buttonChangeState"},
                ],
                IsMutation: false
            },
            {
                MutationParent: "dtContentEmpGroupListBody",
                ChildNode: [
                    {Selector: "#employeeList #dtContentEmpGroupListBody tr td.employeeList_btnDelGroup", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "tdHandle td"},
                ],
                IsMutation: true
            },
            {
                MutationParent: "dtContentServiceBody",
                ChildNode: [
                    {Selector: "#ServicetList #dtContentServiceBody tr td.ServiceList_rowBtnHandle", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "tdHandle td"},
                ],
                IsMutation: true
            },
            //#endregion

            //#region //Intergrate - DTQG
            {
                MutationParent: "iml_container",
                ChildNode: [
                    {Selector: "#lbSearchArea #iml_TypeSearch", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "seach customer"},
                    { Selector: "#iml_container #iml_MedUserID", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "input user"},
                ],
                IsMutation: false
            },
            {
                MutationParent: "iml_Detail",
                ChildNode: [
                    {Selector: "#iml_Detail #imd_btnMedSync", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "btn Sync"},
                ],
                IsMutation: true
            },
            //#endregion

            //#region //Calendar
            {
                MutationParent: "WorkScheduleMain",
                ChildNode: [
                    {Selector: "#WorkScheduleMain #EWordSche_btnUpdate", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "btnUpdate"},
                    { Selector: "#WorkScheduleMain #WorkBranchID", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "cbbBranhc"},
                    { Selector: "#WorkScheduleMain #WorkGroupEmpID", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "cbbEmp"},
                    { Selector: "#WorkScheduleMain #WorkSearchEmployee", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "txtSearch"},
                ],
                IsMutation: false
            },
            {
                MutationParent: "popupExecute",
                ChildNode: [
                    {Selector: "#popupExecute #change_work_scheduler", IsDisable: false, ParrentSelector: "", AttrMuta: ['style'], Note: "btnAddGroup"},
                    {Selector: "#popupExecute #off_work_scheduler", IsDisable: false, ParrentSelector: "", AttrMuta: ['style'], Note: "btnAddGroup"},
                ],
                IsMutation: true
            },
            //#endregion
            //#region //Permission
            {
                MutationParent: "divMainAuthorized",
                ChildNode: [
                    {Selector: "#divMainAuthorized .Permission_btnEdit", IsDisable: false, ParrentSelector: "", AttrMuta: ['style'], Note: "btnEdit"},
                ],
                IsMutation: true
            },
            //#endregion
            //#endregion

            //#region //Config
            //#region //Category
            {
                MutationParent: "divMainSettingDetail",
                ChildNode: [
                    {Selector: "#divMainSettingDetail .setting_projectclosure", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: ""},
                    {Selector: "#divMainSettingDetail #SmSOption_btnDisabled", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: ""},
                    { Selector: "#divMainSettingDetail .vtt-icon", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: ""},

                ],
                IsMutation: true
            },

            //#endregion
            //#endregion
            //#region //My Info
            {
                MutationParent: "divmyinfodetail",
                ChildNode: [
                    {Selector: "#divmyinfodetail #empdetail_container #button_customer_detail_save", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: ""},
                ],
                IsMutation: true
            },

            //#endregion
            //#region //Labo
            {
                MutationParent: "ListLabo_Container",
                ChildNode: [
                    {Selector: "#ListLabo_Container #ListLabo_Add", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "btnAdd"},
                    {Selector: "#ListLabo_Container #dtContent_ListLabo tr th.ListLabo_thHanlde", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "thHandle th"},
                ],
                IsMutation: false
            },
            {
                MutationParent: "dtContent_ListLaboBody",
                ChildNode: [
                    {Selector: "#ListLabo_Container #dtContent_ListLaboBody tr td.ListLabo_rowBtnHandle", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "tdHandle td"},
                ],
                IsMutation: true
            },
            {
                MutationParent: "SL_DivSettingLabo",
                ChildNode: [
                    {Selector: "#SL_DivSettingLabo .btnDelete", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "tdHandle td btnDel"},
                    {Selector: "#SL_DivSettingLabo #LStatus_Detail .action_Save", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "Status btnSave"},

                ],
                IsMutation: true
            },
            //#endregion
            //#region //Broker
            {
                MutationParent: "BL_BrokerSearch",
                ChildNode: [
                    {Selector: "#BL_BrokerSearch #BL_BranchDiv", IsDisable: false, ParrentSelector: "div.field", AttrMuta: null, Note: "combobox branch"},
                ],
                IsMutation: false
            },
            //#endregion

            //#region //Comobo Service
            {
                MutationParent: "ServiceComboList",
                ChildNode: [
                    {Selector: "#ServiceComboList #btnAddProduct", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "btnAdd"},
                ],
                IsMutation: false
            },
            {
                MutationParent: "ServiceComboDetail",
                ChildNode: [
                    {Selector: "#ServiceComboDetail #scd_btnsave", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "tdHandle td"},
                    {Selector: "#ServiceComboDetail #scd_btndelete", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "tdHandle td"},
                ],
                IsMutation: true
            },
            //#endregion
            //#region
            {
                MutationParent: "divMainPage",
                ChildNode: [
                    {Selector: "#Labo_Receiverman", IsDisable: false, ParrentSelector: ".field", AttrMuta: ['style'], Note: "Cust Tab - Dich vu - them moi - nguoi chiu trach"},
                    {Selector: ".image_delete_folder", IsDisable: false, ParrentSelector: "", AttrMuta: ['style'], Note: "Cust Tab - Dich vu - them moi - nguoi chiu trach"},
                    {Selector: "#btnEditImage", IsDisable: false, ParrentSelector: "", AttrMuta: ['style'], Note: "Cust Tab - Dich vu - them moi - nguoi chiu trach"},
                    {Selector: "#uploadButton", IsDisable: false, ParrentSelector: "", AttrMuta: ['style'], Note: "Cust Tab - Dich vu - them moi - nguoi chiu trach"},
                    {Selector: "#btnEditImage_File", IsDisable: false, ParrentSelector: "", AttrMuta: ['style'], Note: "Cust Tab - Dich vu - them moi - nguoi chiu trach"},
                    {Selector: "#uploadButton_File", IsDisable: false, ParrentSelector: "", AttrMuta: ['style'], Note: "Cust Tab - Dich vu - them moi - nguoi chiu trach"},
                ],
                IsMutation: true
            },
            //#endregion
            //#region // Modal Popup
            {
                MutationParent: "DetailModal_Content",
                ChildNode: [
                    { Selector: "body:has( #SettingListParamDiv) #DetailModal_Content .action_Save-Content button:not(.btn-secondary)", ParrentSelector: "", IsDisable: false, Note: "Nav Service - Service - Service Type - btnDel"},
                    {Selector: "#ServiceType_Container #btn_delete_service_type", ParrentSelector: "", IsDisable: false, Note: "Nav Service - Service - Service Type - btnDel"},
                    {Selector: "#ServiceType_Container #btn_save_service_type", ParrentSelector: "", IsDisable: false, Note: "Nav Service - Service - Service Type - btnSave"},
                    {Selector: "#CLE_DivCardDetail #CLE_ExecutedEdit", ParrentSelector: "", IsDisable: false, Note: "Nav Card - Card Status - btnSave"},
                    {Selector: "#MaterialType_Container #btn_delete_material_type", ParrentSelector: "", IsDisable: false, Note: "Nav Warehouse - Material - btnDel"},
                    {Selector: "#MaterialType_Container #btn_save_material_type", ParrentSelector: "", IsDisable: false, Note: "Nav Warehouse - Material - btnSave"},
                    {Selector: "#WSUD_Container #WSUD_btnSave", ParrentSelector: "", IsDisable: false, Note: "Nav Warehouse - Setting - UnitDetail - btnSave"},
                    {Selector: "#WSSD_Container #WSSD_btnSave", ParrentSelector: "", IsDisable: false, Note: "Nav Warehouse - Setting - QuotaDetail - btnSave"},
                    { Selector: "#ProductGroupD_btnSave", ParrentSelector: "", IsDisable: false, Note: "Nav Warehouse - Setting - ProductGroup - btnSave"},
                    { Selector: "#DPro2_btnSave", ParrentSelector: "", IsDisable: false, Note: "Nav Warehouse - Setting - ProductProperties - btnSave"},
                    {Selector: "#WSSupD_Container #WSSupD_btnSave", ParrentSelector: "", IsDisable: false, Note: "Nav Warehouse - Setting - SupDetail - btnSave"},
                    {Selector: "#WSEReasonD_Container #WSEReasonD_btnSave", ParrentSelector: "", IsDisable: false, Note: "Nav Warehouse - Setting - ExportReasonDetail - btnSave"},
                    { Selector: "#ord_Container #ord_btnSave", ParrentSelector: "", IsDisable: false, Note: "Nav Warehouse - Setting - RejectReasonDetail - btnSave"},
                    {Selector: "#DLD_Container #DLD_btnSave", ParrentSelector: "", IsDisable: false, Note: "Nav Marketing - Promotion - PromotionDetail - btnSave"},
                    {Selector: "#EGD_Container #EGD_btnSave", ParrentSelector: "", IsDisable: false, Note: "Nav Staff - Staff - StaffGroupDetail - btnSave"},
                    {Selector: "#empdetail_container #Emp_btnSave", ParrentSelector: "", IsDisable: false, Note: "Nav Staff - Staff - StaffGroupDetail - btnSave"},
                    {Selector: "#EGD_Container #EGD_btnDelete", ParrentSelector: "", IsDisable: false, Note: "Nav Staff - Staff - StaffDetail - btnDelete"},
                    {Selector: "#btnSaveMove_TicketDetail", ParrentSelector: "", IsDisable: false, Note: "Nav Ticket - Ticket detail - btnSave"},
                    {Selector: ".setting_projectclosure", ParrentSelector: "", IsDisable: false, Note: "Nav Config - Service interest - btnSave"},
                    {Selector: "#User_MasterList", ParrentSelector: ".row", IsDisable: false, Note: "User List"},
                    //{Selector: "#formfolder #INF_btnSave", ParrentSelector: "", IsDisable: false, Note: "Folder image"},
                    {Selector: "#btn_save_material", ParrentSelector: "", IsDisable: false, Note: "Setting assurance"},
                    {Selector: "#isd_btnSave", ParrentSelector: "", IsDisable: false, Note: "Setting assurance"},
                    {Selector: 'button[form="SCBTD_Form"]', ParrentSelector: "", IsDisable: false, Note: "btn excute service combo"},
                    {Selector: '#CD_DivCusDetail #CD_AvtBtnCusUpload', ParrentSelector: "", IsDisable: false, Note: "btn upload avatar customer"}, // New
                    {Selector: '#brd_btnUpload', ParrentSelector: "", IsDisable: false, Note: "btn upload avatar customer"}, // New
                    {Selector: "#empdetail_container #Emp_btnSave", ParrentSelector: "", IsDisable: false, Note: "Nav Staff - Staff - StaffGroupDetail - btnSave"}, // New
                    {Selector: "#emp_uploadavata", ParrentSelector: "", IsDisable: false, Note: "Nav Staff - Staff - StaffGroupDetail - btnSave"}, // New
                    {Selector: "#scd_btnSave", ParrentSelector: "", IsDisable: false, Note: "Nav Labo - Setting - Color - btnSave"}, // New
                    {Selector: "#sdd_btnSave", ParrentSelector: "", IsDisable: false, Note: "Nav Labo - Setting - Dimension - btnSave"}, // New
                    {Selector: "#smd_btnSave", ParrentSelector: "", IsDisable: false, Note: "Nav Labo - Setting - Type - btnSave"}, // New
                    {Selector: "#spd_btnSave", ParrentSelector: "", IsDisable: false, Note: "Nav Labo - Setting - Properties - btnSave"}, // New
                    {Selector: "#sld_btnSave", ParrentSelector: "", IsDisable: false, Note: "Nav Labo - Setting - Properties - btnSave"}, // New
                    {Selector: "#snd_btnSave", ParrentSelector: "", IsDisable: false, Note: "Nav Labo - Setting - Properties - btnSave"}, // New
                    {Selector: "#std_btnSave", ParrentSelector: "", IsDisable: false, Note: "Nav Labo - Setting - Properties - btnSave"}, // New
                    {Selector: "#btnSaveDetail", ParrentSelector: "", IsDisable: false, Note: "Nav Labo - Setting - Properties - btnSave"}, // New
                    {Selector: "#ICDAreaD_btnSave", ParrentSelector: "", IsDisable: false, Note: "ICD - btnSave"}, // New
                    { Selector: "#LAD_UploadContainer #LAD_input", ParrentSelector: "", IsDisable: false, Note: "Lib - input file"}, // New
                ],
                IsMutation: true
            },
            //#endregion
        ]

        , Standard: [ 
            {
                MutationParent: "divMainPage",
                ChildNode: [
                    { Selector: `#divMainPage #per_btnReExamination`, IsDisable: false, ParrentSelector: "", AttrMuta: ['style'], Note: "Re examination" },
                    { Selector: `#divMainPage #per_btnReweek`, IsDisable: false, ParrentSelector: "", AttrMuta: ['style'], Note: "Calendar" },                    
                    { Selector: `#MainCustomer_Header_Info #tab_master #tab_insurance`, IsDisable: false, ParrentSelector: "button", AttrMuta: ['style'], Note: "Service - Promostion tab_insurance" },
                    { Selector: `#MainCustomer_Header_Info [data-tab^="/Customer/Insurance/InsuranceList"]`, IsDisable: false, ParrentSelector: "button", AttrMuta: ['style'], Note: "Tab insurrance" },
                    { Selector: `#MainCustomer_Header_Info [data-tab^="/Customer/Point/PointList"]`, IsDisable: false, ParrentSelector: "button", AttrMuta: ['style'], Note: "Point accumulate" },
                    { Selector: `.col-12:has(> #DiagnoseStatus_Status)`, IsDisable: false, ParrentSelector: "", AttrMuta: ['style'], Note: "" },
                    
                ],
                IsMutation: true
            },
            {
                MutationParent: "#MainCustomer_Header_Info",
                ChildNode: [
                    { Selector: `#ps_groupadd ul li:has(input[data-name='insurance'])`, IsDisable: false, ParrentSelector: "button", AttrMuta: ['style'], Note: "Insurance in list service" },
                ],
                IsMutation: true
            },
            {
                MutationParent: "divServiceDetailMain",
                ChildNode: [
                    { Selector: `#divServiceDetailMain #tabPriceService`, IsDisable: false, ParrentSelector: "", AttrMuta: ['style'], Note: "ServiceDatail btnSave" },
                    { Selector: `#divServiceDetailMain a[data-bs-target='#divVTTProduct']`, IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "Service consumable supplies" },
                    { Selector: `#divServiceDetailMain .field:has(> #servat_per)`, IsDisable: false, ParrentSelector: "", AttrMuta: ['style'], Note: "" },
                ],
                IsMutation: true
            },
            {
                MutationParent: "marketing",
                ChildNode: [
                    { Selector: `#FC_SetFilter #Fc_btnDevideCustCare`, IsDisable: false, ParrentSelector: "", AttrMuta: ['style'], Note: "ServiceDatail btnSave" },
                ],
                IsMutation: true
            },
            {
                MutationParent: "divMainGeneralUser",
                ChildNode: [
                    { Selector: "#myinfoitem li .btn_areaApproval", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "setting cost customer" },
                ],
                IsMutation: true
            },
            {
                MutationParent: "ServicetList",
                ChildNode: [
                    { Selector: `#ServicetList #dtContentService *[data-name="re_doc_settings"]`, IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "Staff commission in service" },
                    { Selector: `#per_ser_revenuetreatdoc`, IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "" },
                ],
                IsMutation: false
            },

            {
                MutationParent: "divMainSettingDetail",
                ChildNode: [
                    { Selector: "#divMainSettingDetail #RevenueSetting_Container #rs_lbLabo", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "" },
                    { Selector: "#divMainSettingDetail #RevenueSetting_Container #rs_lbVat", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "" },
                    { Selector: "#divMainSettingDetail #RevenueSetting_Container #rs_lbComsum", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "" },
                    { Selector: "#divMainSettingDetail #RevenueSetting_Container #rs_lbIns", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "" },
                    { Selector: "#divMainSettingDetail #branchDetail_Container div.field:has(> #BranchIP)", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "Branch Static IP" },
                    { Selector: `#tab_usingpoint`, IsDisable: false, ParrentSelector: "", AttrMuta: ['style'], Note: "" },
                ],
                IsMutation: true
            },
            {
                MutationParent: "AGMaster",
                ChildNode: [
                    { Selector: `#per_Invoice_FileAttach`, IsDisable: false, ParrentSelector: "button", AttrMuta: null, Note: "tdHandle td btn attach" },
                    { Selector: `#AGMaster #dtContentInvoicePaymentList *[data-name="fileattach"]`, IsDisable: false, ParrentSelector: "button", AttrMuta: null, Note: "tdHandle td btn attach" },
                ],
                IsMutation: true
            },
            {
                MutationParent: "Labo_Detail",
                ChildNode: [
                    { Selector: `#Labo_Detail #LabDetail_Upload`, IsDisable: false, ParrentSelector: "button", AttrMuta: null, Note: "btn attach" },
                    { Selector: `#Labo_Detail div.mt-3:has(> div.accordion > #lb_uploadarea)`, IsDisable: false, ParrentSelector: "button", AttrMuta: null, Note: "btn attach" },
                ],
                IsMutation: true
            },
            {
                MutationParent: "CustomerDetail",
                ChildNode: [
                    { Selector: `#per_TabHistoryPoint`, IsDisable: false, ParrentSelector: "", AttrMuta: ['style'], Note: "" },
                ],
                IsMutation: true
            },
            {
                MutationParent: "divServiceCardDetail",
                ChildNode: [
                    { Selector: `#ServiceCard_Container #per_btn_issuecard`, IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "ServiceDatail btnSave" },

                ],
                IsMutation: true
            },
            {
                MutationParent: "MS_DivDetailMain",
                ChildNode: [
                    { Selector: "#MS_DivDetailMain .MS_UsingAccumulate", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "Setting Accumulate" },

                ],
                IsMutation: true
            },
        ]
        , Basic: [
            {
                MutationParent: "MainCustomer_Header_Info",
                ChildNode: [
                    { Selector: `#MainCustomer_Header_Info #per_btnReExamination`, IsDisable: false, ParrentSelector: "", AttrMuta: ['style'], Note: "Re examination"},
                    { Selector: `#MainCustomer_Header_Info #per_btnReweek`, IsDisable: false, ParrentSelector: "", AttrMuta: ['style'], Note: "Calendar" },
                    { Selector: `#MainCustomer_Header_Info #dtContentScheduler [data-name="StatusHistory"]`, IsDisable: false, ParrentSelector: "", AttrMuta: ['style'], Note: "Status changing history" },
                    { Selector: `#MainCustomer_Header_Info #per_colRightInfoCustomer #generalInfo_DivRelation`, IsDisable: false, ParrentSelector: "", AttrMuta: ['style'], Note: "Relationship in customer info" },
                    { Selector: `#MainCustomer_Header_Info #dia_template`, IsDisable: false, ParrentSelector: "", AttrMuta: ['style'], Note: "template diagnose" },
                    { Selector: `#MainCustomer_Header_Info #tab_customer_vat`, IsDisable: false, ParrentSelector: "", AttrMuta: ['style'], Note: "Service Tab VAT" },
                    { Selector: `#MainCustomer_Header_Info #dtContentSchedulerBody .btnSendMail`, IsDisable: false, ParrentSelector: "button", AttrMuta: ['style'], Note: "btn send mail" },
                    { Selector: `#MainCustomer_Header_Info #TMD_container div.row:has(> div.field> #TMD_StatusICD) `, IsDisable: false, ParrentSelector: "button", AttrMuta: ['style'], Note: "btn send mail" },
                    { Selector: `#MainCustomer_Header_Info #generalInfo #IconCustomerMember`, IsDisable: false, ParrentSelector: "button", AttrMuta: ['style'], Note: "Customer Info - Rank title" },
                    { Selector: `#MainCustomer_Header_Info #generalInfo #txtCustomerMember`, IsDisable: false, ParrentSelector: "button", AttrMuta: ['style'], Note: "Customer Info - Rank title" },
                    { Selector: `#MainCustomer_Header_Info #tab_master #tab_customer_member`, IsDisable: false, ParrentSelector: "button", AttrMuta: ['style'], Note: "Service - Promostion customer_member" },
                    { Selector: `#MainCustomer_Header_Info #tab_master #tab_installment`, IsDisable: false, ParrentSelector: "button", AttrMuta: ['style'], Note: "Service - Promostion tab_installment" },
                    { Selector: `#MainCustomer_Header_Info #tab_master #tab_insurance`, IsDisable: false, ParrentSelector: "button", AttrMuta: ['style'], Note: "Service - Promostion tab_insurance" },
                    { Selector: `#MainCustomer_Header_Info [data-tab^="/Customer/Insurance/InsuranceList"]`, IsDisable: false, ParrentSelector: "button", AttrMuta: ['style'], Note: "Tab insurrance" },
                    { Selector: `#MainCustomer_Header_Info  #tabServiceCard`, IsDisable: false, ParrentSelector: "button", AttrMuta: ['style'], Note: "Tab card" },
                    { Selector: `#MainCustomer_Header_Info  #tab_voucher`, IsDisable: false, ParrentSelector: "button", AttrMuta: ['style'], Note: "Tab voucher" },
                    { Selector: `#MainCustomer_Header_Info [data-tab^="/Customer/Installment/InstallmentList"]`, IsDisable: false, ParrentSelector: "button", AttrMuta: ['style'], Note: "Tab installment" },
                    { Selector: `#MainCustomer_Header_Info [data-tab^="/Customer/LaboCustomerList"]`, IsDisable: false, ParrentSelector: "button", AttrMuta: ['style'], Note: "Tab labo" },
                    { Selector: `#MainCustomer_Header_Info [data-tab^="/Customer/Point/PointList"]`, IsDisable: false, ParrentSelector: "button", AttrMuta: ['style'], Note: "Point accumulate" },
                    { Selector: `#MainCustomer_Header_Info  #tabPaymentbroker`, IsDisable: false, ParrentSelector: "button", AttrMuta: ['style'], Note: "Tab Payment broker" },
                    { Selector: `#ps_groupadd ul li:has(input[data-name='insurance'])`, IsDisable: false, ParrentSelector: "button", AttrMuta: ['style'], Note: "Insurance in list service" },
                    { Selector: `.col-12:has(> #DiagnoseStatus_Status)`, IsDisable: false, ParrentSelector: "", AttrMuta: ['style'], Note: "" },
                ],
                IsMutation: true 
            },
            {
                MutationParent: "MainAppointmentDetail",
                ChildNode: [
                    { Selector: `#MainAppointmentDetail #dtContentAppointmentInDayList .time_ago_status`, IsDisable: false, ParrentSelector: "", AttrMuta: ['style'], Note: "Wating time in schedule" },
                    { Selector: `#ChangeStatus_RoomArea div:first-child`, IsDisable: false, ParrentSelector: "", AttrMuta: ['style'], Note: "Wating time in schedule" },
                    
                ],
                IsMutation: true
            },
            {
                MutationParent: "CustomerDetail",
                ChildNode: [
                    { Selector: `#CD_divTypeCatCus`, IsDisable: false, ParrentSelector: "", AttrMuta: ['style'], Note: "" },
                    { Selector: `#per_TabHistoryPoint`, IsDisable: false, ParrentSelector: "", AttrMuta: ['style'], Note: "" },
                    { Selector: `#tablist_addfastnew`, IsDisable: false, ParrentSelector: "", AttrMuta: ['style'], Note: "" },
                ],
                IsMutation: true
            },
            {
                MutationParent: "divServiceListMain",
                ChildNode: [
                    { Selector: `#dtContentAppointmentInDayListBody .buttonRoomClass`, IsDisable: false, ParrentSelector: "", AttrMuta: ['style'], Note: "ServiceDatail btnSave" },
                    { Selector: `#ps_groupadd #tablist_addcombonew`, IsDisable: false, ParrentSelector: "", AttrMuta: ['style'], Note: "ServiceDatail btnSave" },
                    { Selector: `#patient_record_list div:first-child`, IsDisable: false, ParrentSelector: "", AttrMuta: ['style'], Note: "" },
                    { Selector: `#cus_using_treatment_plan div:first-child`, IsDisable: false, ParrentSelector: "", AttrMuta: ['style'], Note: "" },

                ],
                IsMutation: true
            },
            {
                MutationParent: "divServiceDetailMain",
                ChildNode: [
                    { Selector: `#divServiceDetailMain #tabPriceService`, IsDisable: false, ParrentSelector: "", AttrMuta: ['style'], Note: "Service Tab Price List" },
                    { Selector: `#divServiceDetailMain li a[data-bs-target="#divVTTProduct"]`, IsDisable: false, ParrentSelector: "", AttrMuta: ['style'], Note: "ServiceDatail Tab Consumable" },
                    { Selector: `#divServiceDetailMain #tabDocWarranty`, IsDisable: false, ParrentSelector: "", AttrMuta: ['style'], Note: "ServiceDatail Tab Warranty" },
                    { Selector: `#divServiceDetailMain #tabStageService`, IsDisable: false, ParrentSelector: "", AttrMuta: ['style'], Note: "ServiceDatail Tab StageService" },
                    { Selector: `#divServiceDetailMain .field:has(> #servat_per)`, IsDisable: false, ParrentSelector: "", AttrMuta: ['style'], Note: "" },
                ],
                IsMutation: true
            },
            {
                MutationParent: "marketing",
                ChildNode: [
                    { Selector: `#FC_SetFilter #Fc_btnDevideCustCare`, IsDisable: false, ParrentSelector: "", AttrMuta: ['style'], Note: "ServiceDatail btnSave" },
                ],
                IsMutation: true
            },
            {
                MutationParent: "ServicetList",
                ChildNode: [
                    { Selector: `#ServicetList #dtContentService *[data-name="re_doc_settings"]`, IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "Staff commission in service" },
                    { Selector: `#tabinfo_sercombo li #info_combo`, IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "Staff commission in service" },
                    { Selector: `#per_ser_revenuetreatdoc`, IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "" },
                    
                ],
                IsMutation: false
            },
            {
                MutationParent: "divMainSettingDetail",
                ChildNode: [
                    { Selector: "#divMainSettingDetail #RevenueSetting_Container #rs_lbLabo", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "" },
                    { Selector: "#divMainSettingDetail #RevenueSetting_Container #rs_lbVat", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "" },
                    { Selector: "#divMainSettingDetail #RevenueSetting_Container #rs_lbComsum", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "" },
                    { Selector: "#divMainSettingDetail #RevenueSetting_Container #rs_lbIns", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "" },
                    { Selector: "#divMainSettingDetail #branchDetail_Container div.field:has(> #BranchIP)", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "Branch Static IP" },
                    { Selector: `#tab_usingpoint`, IsDisable: false, ParrentSelector: "", AttrMuta: ['style'], Note: "" },
                ],
                IsMutation: true
            },
            {
                MutationParent: "MS_DivDetailMain",
                ChildNode: [
                    { Selector: "#MS_DivDetailMain .MS_UsingAccumulate", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "Setting Accumulate" },

                ],
                IsMutation: true
            },
            {
                MutationParent: "divMainGeneralUser",
                ChildNode: [
                    { Selector: "#myinfoitem li .btn_areaApproval", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "setting cost customer" },
                ],
                IsMutation: true
            },
            {
                MutationParent: "payment",
                ChildNode: [
                    { Selector: ".tabpayment li#tabPaymentCommissionCard", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "setting cost customer" },
                ],
                IsMutation: true
            },
            {
                MutationParent: "Setting_group",
                ChildNode: [
                    { Selector: `#Setting_group li:has(> a[data-tab="/Setting/EmailOption"])`, IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "setting email option" },
                    { Selector: `#Setting_group hr[data-link="/Setting/EmailOption"]`, IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "setting  email option" },
                    { Selector: `#Setting_group li:has(> a[data-tab="/Setting/EmailSetting"])`, IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "setting  email setting" },
                    { Selector: `#Setting_group hr[data-link="/Setting/EmailSetting"]`, IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "setting email setting" },
                ],
                IsMutation: true
            },
            {
                MutationParent: "CLContentBody",
                ChildNode: [
                    { Selector: "#divCardList #CLContentBody tr td.CardList_rowBtnHandle .buttonSendMailClass", IsDisable: false, ParrentSelector: "button", AttrMuta: null, Note: "tdHandle td btn Send" },
                ],
                IsMutation: true
            },
            {
                MutationParent: "AGMaster",
                ChildNode: [
                    { Selector: `#per_Invoice_FileAttach`, IsDisable: false, ParrentSelector: "button", AttrMuta: null, Note: "tdHandle td btn attach" },
                    { Selector: `#AGMaster #dtContentInvoicePaymentList *[data-name="fileattach"]`, IsDisable: false, ParrentSelector: "button", AttrMuta: null, Note: "tdHandle td btn attach" },
                ],
                IsMutation: true
            },
            {
                MutationParent: "Labo_Detail",
                ChildNode: [
                    { Selector: `#Labo_Detail #LabDetail_Upload`, IsDisable: false, ParrentSelector: "button", AttrMuta: null, Note: "btn attach" },
                    { Selector: `#Labo_Detail div.mt-3:has(> div.accordion > #lb_uploadarea)`, IsDisable: false, ParrentSelector: "button", AttrMuta: null, Note: "btn attach" },
                ],
                IsMutation: true
            },
            {
                MutationParent: "treatment",
                ChildNode: [
                    { Selector: `#tabTreatmentWork`, IsDisable: false, ParrentSelector: "button", AttrMuta: null, Note: "" },
                    { Selector: `#btnAddNoteTreatment`, IsDisable: false, ParrentSelector: "button", AttrMuta: null, Note: "" },
                ],
                IsMutation: true
            },
            {
                MutationParent: "divServiceCardDetail",
                ChildNode: [
                    { Selector: `#ServiceCard_Container #per_btn_issuecard`, IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "ServiceDatail btnSave" },

                ],
                IsMutation: true
            }
        ]
    }
    return Data;
})();
