﻿var BlockControl = (function () {
    let Data = {
        Static: [
            {
                ChildNode: [
                    { Selector: "#sidenav-collapse-main a[href*='/Appointment/AppointmentCalendar']", IsDisable: false, ParrentSelector: ".nav-item", Note: "Lịch hẹn calendar" },
                    { Selector: "#sidenav-collapse-main a[href*='/Appointment/AppointmentDoctorScheduler_Mine']", ParrentSelector: ".nav-item", IsDisable: false, Note: "Lịch hẹn cá nhân bác sĩ" },
                    { Selector: "#sidenav-collapse-main a[href*='/Account/PaymentSupplier/PaymentList']", ParrentSelector: ".nav-item", IsDisable: false, Note: "Kế toán thanh toán ncc" },
                    { Selector: "#sidenav-collapse-main a[href*='/DeleteMergeCus/MergeCustomer']", ParrentSelector: ".nav-item", IsDisable: false, Note: "Khách hàng gộp khách hàng" },
                    { Selector: "#sidenav-collapse-main a[href*='/DeleteMergeCus/DeleteCustomer']", ParrentSelector: ".nav-item", IsDisable: false, Note: "Khách hàng xóa khách hàng" },
                    { Selector: "#sidenav-collapse-main a[href*='/Customer/Room/RoomStatus']", ParrentSelector: ".nav-item", IsDisable: false, Note: "Khách hàng trạng thái phòng" },
                    { Selector: "#sidenav-collapse-main a[href*='/Service/ServiceCombo']", ParrentSelector: ".nav-item", IsDisable: false, Note: "Dịch vụ combo dịch vụ" },
                    { Selector: "#sidenav-collapse-main a[href*='/Marketing/FilterTicket']", ParrentSelector: ".nav-item", IsDisable: false, Note: "marketing lọc ticket" },
                    { Selector: "#sidenav-collapse-main a[href*='/Marketing/StatusSendSMS']", ParrentSelector: ".nav-item", IsDisable: false, Note: "marketing trạng thái gửi sms" },
                    { Selector: "#sidenav-collapse-main a[href*='/Marketing/Call/MyExtensionCall']", ParrentSelector: ".nav-item", IsDisable: false, Note: "marketing extension call" },
                    { Selector: "#sidenav-collapse-main a[href*='/Marketing/Finance/ExpenseAdsList']", ParrentSelector: ".nav-item", IsDisable: false, Note: "marketing chi phí marketing" },
                    { Selector: "#sidenav-collapse-main a[href*='/HR/Employee/Punish/PunishEmployee']", ParrentSelector: ".nav-item", IsDisable: false, Note: "nhân viên chế tài" },
                    { Selector: "#sidenav-collapse-main a[href*='/HR/Employee/Payroll']", ParrentSelector: ".nav-item", IsDisable: false, Note: "nhân viện bảng luong" },
                    { Selector: "#sidenav-collapse-main a[href*='/Disease/DiseaseGeneral']", ParrentSelector: ".nav-item", IsDisable: false, Note: "cau hinh benh ly" },
                    { Selector: "#sidenav-collapse-main a[href*='/Report/ListReport/ListReportShow/']", ParrentSelector: ".nav-item", IsDisable: false, Note: "bao cao thong tin bao cao" },
                    { Selector: "#sidenav-collapse-main a[href*='/Report/sheetlist/']", ParrentSelector: ".nav-item", IsDisable: false, Note: "report sheet" },
                    { Selector: "#sidenav-collapse-main a[href*='/Report/Taglist/']", ParrentSelector: ".nav-item", IsDisable: false, Note: "report tag" },
                    //{ Selector: "#sidenav-collapse-main a[href*='/AppCustomer/Desk/General']", ParrentSelector: "#menuDesktopCategory li.nav-item", IsDisable: false, Note: "Mobile" },
                    { Selector: "#sidenav-collapse-main a[href='#menumain50']", ParrentSelector: ".nav-item", IsDisable: false, Note: "Mobile" },
                    { Selector: "#sidenav-collapse-main a[href='#menumain62']", ParrentSelector: ".nav-item", IsDisable: false, Note: "Labo" },
                    { Selector: "#sidenav-collapse-main a[href='#menumain68']", ParrentSelector: ".nav-item", IsDisable: false, Note: "Quản Lý Đào Tạo" },
                    { Selector: "#sidenav-collapse-main a[href='#menumain75']", ParrentSelector: ".nav-item", IsDisable: false, Note: "Trang khách hàng" },
                ]
            }
        ],
        Dynamic: [
            {
                MutationParent: "divCustomerTabContent",
                ChildNode: [
                    { Selector: "#divCustomerTabContent a[data-tab*='/Customer/DentistChart/DentistChart']", ParrentSelector: ".nav-item", IsDisable: false, Note: "Cust Tab - Tỉnh trạng răng" },
                    { Selector: "#divCustomerTabContent a[data-tab*='/Customer/LaboCustomerList']", ParrentSelector: ".nav-item", IsDisable: false, Note: "Cust Tab - Labo" },
                    { Selector: "#divCustomerTabContent a[data-tab*='/Customer/StatusList']", ParrentSelector: ".nav-item", IsDisable: false, Note: "Cust Tab - Tư vấn" },
                    //{ Selector: "#divCustomerTabContent a[data-tab*='/Customer/Diagnose/DiagnoseList']", ParrentSelector: ".nav-item", IsDisable: false, Note: "Cust Tab - Chẩn Đoán" },
                    { Selector: "#divCustomerTabContent a[data-tab*='/Customer/Assay/AssayList']", ParrentSelector: ".nav-item", IsDisable: false, Note: "Cust Tab - Xét nghiệm" },
                ],
                IsRecursion: true
            },
            {
                MutationParent: "divMainPage",
                ChildNode: [
                    { Selector: "#Div_Tab_Service_Detail #Consult2", ParrentSelector: ".field", IsDisable: true, Note: "Cust Tab - Dich vu - them moi nguoi chiu trach" },
                    { Selector: "#Div_Tab_Service_Detail #tab_insurance", ParrentSelector: "", IsDisable: true, Note: "Cust Tab - Dich vu - them moi muc khac bao hiem" },
                    { Selector: "#Div_Tab_Service_Detail #tab_min_payment", ParrentSelector: ".field", IsDisable: true, Note: "Cust Tab - Dich vu - them moi muc khac thanh toan toi thieu" },
                    { Selector: "#Div_Tab_Service_Detail #per_tab_sourceSpecific", ParrentSelector: ".field", IsDisable: true, Note: "Cust Tab - Dich vu - them moi muc khac nguon dich vu" },
                    { Selector: "#Div_Tab_List_Service_Master #patient_record_list", IsDisable: false, ParrentSelector: "", Note: "Cust Tab - Dich vu - Danh Sach Benh An" },
                    { Selector: "#Div_Tab_List_Service_Master #cus_using_treatment_plan", IsDisable: false, ParrentSelector: "", Note: "Cust Tab - Dich vu - Nút them ke hoac" },
                    { Selector: "#Div_Tab_List_Service_Master #colLists ul>li input[data-name='file']", IsDisable: false, ParrentSelector: "li", Note: "Cust Tab - Dich vu - Nút xem thêm file" },
                    { Selector: "#Div_Tab_List_Service_Master #colLists ul>li input[data-name='warranty']", IsDisable: false, ParrentSelector: "li", Note: "Cust Tab - Dich vu - Nút xem thêm bảo hành" },
                    { Selector: "#per_colRightInfoCustomer #per_consultStatus", IsDisable: false, ParrentSelector: "", Note: "Cust Tab - thong tin tu van" },
                    { Selector: "#per_colRightInfoCustomer #per_galleryList", IsDisable: false, ParrentSelector: "", Note: "Cust Tab - hinh anh" },
                    { Selector: "#tabTreatmentWork", IsDisable: false, ParrentSelector: "", Note: "Cust Tab - dieu tri - tab cong viec dieu tri" },
                    { Selector: "#Div_Treament_List_Master #FilterPatientRecord", IsDisable: false, ParrentSelector: "div.row", Note: "Cust Tab - dieu tri filter" },
                    { Selector: "#Div_Treament_List_Master #btnAddNoteTreatment", IsDisable: false, ParrentSelector: "", Note: "Cust Tab - dieu tri - nut cong viec dieu tri" },
                    { Selector: "#Div_Treament_List_Master #btnPrintProfileTreatmentNew", IsDisable: false, ParrentSelector: "", Note: "Cust Tab - dieu tri - nut in dieu tri" },
                    { Selector: "#Div_Treament_List_Master #colLists ul>li input[data-name='file']", IsDisable: false, ParrentSelector: "li", Note: "Cust Tab - dieu tri - Nút xem thêm bảo hành" },
                    { Selector: "#Div_Treament_List_Detail #Treat_Filter #choose_treat", IsDisable: true, ParrentSelector: ".form-check", Note: "Cust Tab - dieu tri - them dieu tri - radio chọn trạng thái đang điều trị" },
                    { Selector: "#Div_Treament_List_Detail #Treat_Filter #choose_treatdone", IsDisable: true, ParrentSelector: ".form-check", Note: "Cust Tab - dieu tri - them dieu tri - radio chọn trạng thái điều trị xong" },
                    { Selector: "#Div_Payment_List_Service_Master #btn_unlockpaymentfull", IsDisable: false, ParrentSelector: "", Note: "Cust Tab - Thanh toan - dich vu san pham" },
                    { Selector: "#tabPaymentMedicine", IsDisable: false, ParrentSelector: "", IsDisable: false, Note: "Cust Tab - Thanh toan - tab don thuoc" },
                    { Selector: "#HisLCare_btnComplaint", IsDisable: false, ParrentSelector: "", IsDisable: false, Note: "Cust Tab - Lich su gop y" },
                    { Selector: "#per_btnReExamination", IsDisable: false, ParrentSelector: "", IsDisable: false, Note: "Cust Tab - Lich hen - nut xem lich tai kham" },
                ],
                IsRecursion: true
            },
            {
                MutationParent: "MainAppointmentDetail",
                ChildNode: [
                    { Selector: "#MainAppointmentDetail #colLists ul>li input[data-name='room']", IsDisable: false, ParrentSelector: "li", Note: "Lịch hẹn trong ngày - nút xem thêm phòng" },
                ],
                IsRecursion: false
            },
            {
                MutationParent: "ServiceDetail_Div",
                ChildNode: [
                    { Selector: "#ServiceDetail_Div #ck_labo", ParrentSelector: ".field", IsDisable: true, Note: "Dịch vụ - Chi tiết dịch vụ - Nút Checkbox Labo" },
                    { Selector: "#ServiceDetail_Div ul>li#tabPriceService", ParrentSelector: "", IsDisable: true, Note: "Dịch vụ - Chi tiết dịch vụ - Tab bãng giá" },
                    { Selector: "#ServiceDetail_Div ul>li#tabStageService", ParrentSelector: "", IsDisable: true, Note: "Dịch vụ - Chi tiết dịch vụ - Tab Bước điều trị" },
                    { Selector: "#ServiceDetail_Div ul>li#tabDocWarranty", ParrentSelector: "", IsDisable: true, Note: "Dịch vụ - Chi tiết dịch vụ - Tab Bão hành" },
                    { Selector: "#ServiceDetail_Div ul>li#tabOther", ParrentSelector: "", IsDisable: true, Note: "Dịch vụ - Chi tiết dịch vụ - Tab Khác" },
                    { Selector: "#ServiceDetail_Div #time_to_treatment", ParrentSelector: "", IsDisable: true, Note: "Dịch vụ - Chi tiết dịch vụ - Field Số lần điều trị" },
                    { Selector: "#ServiceDetail_Div #teethChoosing", ParrentSelector: "", IsDisable: true, Note: "Dịch vụ - Chi tiết dịch vụ - Field Răng" },
                    { Selector: "#ServiceDetail_Div #divCbbMediaFolder", ParrentSelector: "", IsDisable: true, Note: "Dịch vụ - Chi tiết dịch vụ - Field Phương tiện" },
                ],
                IsRecursion: true
            },
            {
                MutationParent: "SettingListParamDiv",
                ChildNode: [
                    { Selector: "#setting_parent a[data-id='4']", ParrentSelector: ".nav-item", IsDisable: false, Note: "Cài Đặt - Co so ha tầng" },
                    { Selector: "#setting_parent a[data-id='12']", ParrentSelector: ".nav-item", IsDisable: false, Note: "Cài Đặt - HR" },
                ],
                IsRecursion: false
            },
            {
                MutationParent: "Setting_group",
                ChildNode: [
                    { Selector: "#Setting_group a[data-link*='/Setting/StatusCustomer/CustomerCareStatusList']", ParrentSelector: ".nav-item", IsDisable: false, Note: "Cài Đặt Trang thai thu van" },
                    { Selector: "#Setting_group hr[data-link*='/Setting/StatusCustomer/CustomerCareStatusList']", ParrentSelector: "", IsDisable: false, Note: "Cài Đặt Trang thai thu van" },
                    { Selector: "#Setting_group a[data-link*='/Setting/EvaluateTreatmentResultList']", ParrentSelector: ".nav-item", IsDisable: false, Note: "Cài Đặt danh gia sau dieu tri" },
                    { Selector: "#Setting_group hr[data-link*='/Setting/EvaluateTreatmentResultList']", ParrentSelector: "", IsDisable: false, Note: "Cài Đặt danh gia sau dieu tri" },
                    { Selector: "#Setting_group a[data-link*='/Setting/Insurance/InsuranceList']", ParrentSelector: ".nav-item", IsDisable: false, Note: "Cài Đặt bao hiem" },
                    { Selector: "#Setting_group hr[data-link*='/Setting/Insurance/InsuranceList']", ParrentSelector: "", IsDisable: false, Note: "Cài Đặt bao hiem" },
                    { Selector: "#Setting_group a[data-link*='/Setting/Teeth/TeethList']", ParrentSelector: ".nav-item", IsDisable: false, Note: "Cài Đặt rang" },
                    { Selector: "#Setting_group hr[data-link*='/Setting/Teeth/TeethList']", ParrentSelector: "", IsDisable: false, Note: "Cài Đặt rang" },
                    { Selector: "#Setting_group a[data-link*='/Setting/Treatment/TreatmentTask/TreatmentTaskList']", ParrentSelector: ".nav-item", IsDisable: false, Note: "Cài Đặt rang" },
                    { Selector: "#Setting_group hr[data-link*='/Setting/Treatment/TreatmentTask/TreatmentTaskList']", ParrentSelector: "", IsDisable: false, Note: "Cài Đặt rang" },
                    { Selector: "#Setting_group a[data-link*='/Setting/ExchangeRate/ExchangeRateList']", ParrentSelector: ".nav-item", IsDisable: false, Note: "Cài Đặt ty gia tien te" },
                    { Selector: "#Setting_group hr[data-link*='/Setting/ExchangeRate/ExchangeRateList']", ParrentSelector: "", IsDisable: false, Note: "Cài Đặt ty gia tien te" },
                    { Selector: "#Setting_group a[data-link*='/Setting/PatientRecord/PatientRecordImageList']", IsDisable: false, ParrentSelector: ".nav-item", Note: "Cài Đặt hinh anh venh an" },
                    { Selector: "#Setting_group hr[data-link*='/Setting/PatientRecord/PatientRecordImageList']", IsDisable: false, ParrentSelector: "", Note: "Cài Đặt hinh anh venh an" },
                    { Selector: "#Setting_group a[data-link*='/Setting/Labo/LaboReason']", ParrentSelector: ".nav-item", IsDisable: false, Note: "Cài Đặt ly do labo" },
                    { Selector: "#Setting_group hr[data-link*='/Setting/Labo/LaboReason']", ParrentSelector: "", IsDisable: false, Note: "Cài Đặt ly do labo" },
                    { Selector: "#Setting_group a[data-link*='/Setting/SyntaxList']", ParrentSelector: ".nav-item", IsDisable: false, Note: "Cài Đặt cau truc ma" },
                    { Selector: "#Setting_group hr[data-link*='/Setting/SyntaxList']", ParrentSelector: "", IsDisable: false, Note: "Cài Đặt cau truc ma" },
                    { Selector: "#Setting_group a[data-link*='/Setting/TreatmentStageList']", ParrentSelector: ".nav-item", IsDisable: false, Note: "Cài Đặt buoc dieu tri" },
                    { Selector: "#Setting_group hr[data-link*='/Setting/TreatmentStageList']", ParrentSelector: "", IsDisable: false, Note: "Cài Đặt buoc dieu tri" },
                    { Selector: "#Setting_group a[data-link*='/Setting/SettingCustomerDetail']", ParrentSelector: ".nav-item", IsDisable: false, Note: "Cài Đặt /Setting/SettingCustomerDetail" },
                    { Selector: "#Setting_group hr[data-link*='/Setting/SettingCustomerDetail']", ParrentSelector: "", IsDisable: false, Note: "Cài Đặt /Setting/SettingCustomerDetail" },
                ],
                IsRecursion: true
            },
            {
                MutationParent: "ListFormDiv",
                ChildNode: [
                    { Selector: "#lf_listtype a[data-id='7']", ParrentSelector: ".nav-item", IsDisable: false, Note: "Cài Đặt - Cấu hình mẫu in - mau in benh an" },
                    { Selector: "#lf_listtype a[data-id='8']", ParrentSelector: ".nav-item", IsDisable: false, Note: "Cài Đặt - Cấu hình mẫu in - yeu cau lab" },
                    { Selector: "#lf_listtype a[data-id='9']", ParrentSelector: ".nav-item", IsDisable: false, Note: "Cài Đặt - Cấu hình mẫu in - xet nghei" },
                    { Selector: "#lf_listtype a[data-id='13']", ParrentSelector: ".nav-item", IsDisable: false, Note: "Cài Đặt - Cấu hình mẫu in - ke hoach dieu tri" },
                    { Selector: "#lf_listtype a[data-id='14']", ParrentSelector: ".nav-item", IsDisable: false, Note: "Cài Đặt - Cấu hình mẫu in - ho so dieu tri" },
                    { Selector: "#lf_listtype a[data-id='15']", ParrentSelector: ".nav-item", IsDisable: false, Note: "Cài Đặt - Cấu hình mẫu in - hop dong thuoc" },
                    { Selector: "#lf_listtype a[data-id='17']", ParrentSelector: ".nav-item", IsDisable: false, Note: "Cài Đặt - Cấu hình mẫu in - hd lab" },
                    { Selector: "#lf_listtype a[data-id='21']", ParrentSelector: ".nav-item", IsDisable: false, Note: "Cài Đặt - Cấu hình mẫu in - hd dieu tri" },
                    { Selector: "#lf_listtype a[data-id='23']", ParrentSelector: ".nav-item", IsDisable: false, Note: "Cài Đặt - Cấu hình mẫu in - the bao hanh dich vu" },
                ],
                IsRecursion: false
            },
            {
                MutationParent: "ReportGeneral_ContainerDiv",
                ChildNode: [
                    { Selector: "#report_parent li[data-groupid='11']", ParrentSelector: "", IsDisable: false, Note: "Bao cao nhóm dieu tri" },
                    { Selector: "#report_parent li[data-groupid='16']", ParrentSelector: "", IsDisable: false, Note: "Bao cao nhóm hoc vien" },
                    { Selector: "#report_parent li[data-groupid='17']", ParrentSelector: "", IsDisable: false, Note: "Bao cao nhóm csha tang" },
                    { Selector: "#report_parent li[data-groupid='14'] li>a[data-id='147']", ParrentSelector: ".nav-item", IsDisable: false, Note: "Bao cao tinh trang dich vu bao hanh" },
                    { Selector: "#report_parent li[data-groupid='14'] hr[data-id='147']", ParrentSelector: "", IsDisable: false, Note: "Bao cao  trang dich vu bao hanh" },
                    { Selector: "#report_parent li[data-groupid='14'] li>a[data-id='146']", ParrentSelector: ".nav-item", IsDisable: false, Note: "Bao cao  trang dich vu bao hiem" },
                    { Selector: "#report_parent li[data-groupid='14'] hr[data-id='146']", ParrentSelector: "", IsDisable: false, Note: "Bao cao  trang dich vu bao hiem" },
                    { Selector: "#report_parent li[data-groupid='14'] li>a[data-id='149']", ParrentSelector: ".nav-item", IsDisable: false, Note: "Bao cao tinh trang dich vu tra gop" },
                    { Selector: "#report_parent li[data-groupid='14'] hr[data-id='149']", ParrentSelector: "", IsDisable: false, Note: "Bao cao  trang dich vu tra gop" },
                    { Selector: "#report_parent li[data-groupid='3'] li>a[data-id='144']", ParrentSelector: ".nav-item", IsDisable: false, Note: "Bao cao - kế toán kho - xuất nhập tồn kho" },
                    { Selector: "#report_parent li[data-groupid='3'] hr[data-id='144']", ParrentSelector: "", IsDisable: false, Note: "Bao cao - kế toán kho - xuất nhập tồn kho" },
                ],
                IsRecursion: false
            }, {
                MutationParent: "DetailModal_Content",
                ChildNode: [
                    { Selector: "#ServiceType_Container #btn_delete_service_type", ParrentSelector: "", IsDisable: false, Note: "Nav Service - Service - Service Type - btnDel" },
                    { Selector: "#ServiceType_Container #btn_save_service_type", ParrentSelector: "", IsDisable: false, Note: "Nav Service - Service - Service Type - btnSave" },
                    { Selector: "#CLE_DivCardDetail #CLE_ExecutedEdit", ParrentSelector: "", IsDisable: false, Note: "Nav Card - Card Status - btnSave" },
                    { Selector: "#MaterialType_Container #btn_delete_material_type", ParrentSelector: "", IsDisable: false, Note: "Nav Warehouse - Material - btnDel" },
                    { Selector: "#MaterialType_Container #btn_save_material_type", ParrentSelector: "", IsDisable: false, Note: "Nav Warehouse - Material - btnSave" },
                    { Selector: "#WSUD_Container #WSUD_btnSave", ParrentSelector: "", IsDisable: false, Note: "Nav Warehouse - Setting - UnitDetail - btnSave" },
                    { Selector: "#WSSD_Container #WSSD_btnSave", ParrentSelector: "", IsDisable: false, Note: "Nav Warehouse - Setting - QuotaDetail - btnSave" },
                    { Selector: "#WSSupD_Container #WSSupD_btnSave", ParrentSelector: "", IsDisable: false, Note: "Nav Warehouse - Setting - SupDetail - btnSave" },
                    { Selector: "#WSEReasonD_Container #WSEReasonD_btnSave", ParrentSelector: "", IsDisable: false, Note: "Nav Warehouse - Setting - ExportReasonDetail - btnSave" },
                    { Selector: "#DLD_Container #DLD_btnSave", ParrentSelector: "", IsDisable: false, Note: "Nav Marketing - Promotion - PromotionDetail - btnSave" },
                    { Selector: "#EGD_Container #EGD_btnSave", ParrentSelector: "", IsDisable: false, Note: "Nav Staff - Staff - StaffGroupDetail - btnSave" },
                    { Selector: "#empdetail_container #button_customer_detail_save", ParrentSelector: "", IsDisable: false, Note: "Nav Staff - Staff - StaffDetail - btnSave" },

                    { Selector: ".setting_projectclosure", ParrentSelector: "", IsDisable: false, Note: "Nav Config - Service interest - btnSave" },


                    { Selector: '#CD_DivCusDetail #CD_AvtBtnCusUpload', ParrentSelector: "", IsDisable: false, Note: "btn upload avatar customer" }, // New
                    { Selector: '#brd_btnUpload', ParrentSelector: "", IsDisable: false, Note: "btn upload avatar customer" }, // New
                    { Selector: "#empdetail_container #Emp_btnSave", ParrentSelector: "", IsDisable: false, Note: "Nav Staff - Staff - StaffGroupDetail - btnSave" }, // New
                ],
                IsMutation: true
            },
            {
                MutationParent: "ServiceDetail_Div",
                ChildNode: [
                    { Selector: "#ServiceDetail_Div #divServiceDetailMain #ServiceDetail_btnSave", IsDisable: false, ParrentSelector: "", AttrMuta: ['style'], Note: "ServiceDatail btnSave" },
                    { Selector: "#ServiceDetail_Div #divServiceDetailMain #ServiceDetail_btndele", IsDisable: false, ParrentSelector: "", AttrMuta: ['style'], Note: "ServiceDatail btnSave" },


                    { Selector: "#ServiceDetail_Div #SD_Fileup_LoadImage", IsDisable: false, ParrentSelector: "", AttrMuta: ['style'], Note: "Upload image" }, // New
                ],
                IsMutation: true
            },
            {
                MutationParent: "MaterialDetail",
                ChildNode: [
                    { Selector: "#MaterialDetail #btn_delete_material", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "btnDel" }, 
                    { Selector: "#MaterialDetail #Material_btnUpload", IsDisable: false, ParrentSelector: "", AttrMuta: null, Note: "btn Upload" }, 
                ],
                IsMutation: true
            },
        ]
    }
    return Data;
})();
