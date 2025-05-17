var gdata_Package = {
    Pro: {
        title: 'Gói cao cấp',
        icon: '<i class="fas fa-star text-gradient text-primary"></i>',
        url: '/js/ProjectClosure/TrialPro.js',
        content: 'Demo gói cao cấp'
    },
    Standard: {
        title: 'Gói chuyên nghiệp',
        icon: '<i class="fas fa-star-half-alt text-gradient text-primary"></i>',
        url: '/js/ProjectClosure/TrialStandard.js',
        content: 'Demo gói chuyên nghiệp'
    },
    Basic: {
        title: 'Gói cơ bản',
        icon: '<i class="far fa-star text-gradient text-primary"></i>',
        url: '/js/ProjectClosure/TrialBasic.js',
        content: 'Demo gói cơ bản'
    }
}

var gdata_TrialPackage = {
    2: "Basic", 3: "Standard", 4: "Pro"
    , 5: "Basic", 6: "Standard", 7: "Pro"
    , 9: "Basic", 10: "Standard", 11: "Pro"
    , 12: "Basic", 13: "Standard", 14: "Pro"
    , 15: "Basic", 16: "Standard", 17: "Pro"
    , 18: "Basic", 19: "Standard", 20: "Pro"
    , 21: "Basic", 22: "Standard", 23: "Pro"
}
//var gdata_TrialPackageTM = {
//    2: "Basic", 3: "Standard", 4: "Pro"
//    , 5: "Basic", 6: "Standard", 7: "Pro"
//    , 9: "Basic", 10: "Standard", 11: "Pro"
//    , 12: "Basic", 13: "Standard", 14: "Pro"
//    , 15: "Basic", 16: "Standard", 17: "Pro"
//    , 18: "Basic", 19: "Standard", 20: "Pro"
//    , 21: "Basic", 22: "Standard", 23: "Pro"
//}
//var gdata_TrialPackageNK = {
//       2: "Basic", 3: "Standard", 4: "Pro"
//    , 5: "Basic", 6: "Standard", 7: "Pro"
//    , 9: "Basic", 10: "Standard", 11: "Pro"
//    , 12: "Basic", 13: "Standard", 14: "Pro"
//    , 15: "Basic", 16: "Standard", 17: "Pro"
//    , 18: "Basic", 19: "Standard", 20: "Pro"
//    , 21: "Basic", 22: "Standard", 23: "Pro"
//}

var gdata_Group = [
    {
        ID: 2,
        Name: "Quản trị viên",
        Type: "Basic",
        Description: "Cấu hình danh mục, cài đặt hệ thống.Cấu hình phân quyền cho user và quản lý các quy định khác",
        IsActive: true
    },
    {
        ID: 5,
        Name: "Lễ Tân",
        Type: "Basic",
        Description: "Lịch hẹn , checkedin và điều phối khách hàng.Lên dịch vụ,bảo hiểm , trả góp và các thao tác khác",
        IsActive: true
    },
    //{
    //    ID: 9,
    //    Name: "Marketing",
    //    Type: "Basic",
    //    Description: "Quản lý telesale, chương trình giảm giá , voucher và quản lý dữ liệu",
    //    IsActive: true
    //},
    {
        ID: 12,
        Name: "Bác sĩ",
        Type: "Basic",
        Description: "Quá trình điều trị, tái khám và tư vấn. Chẩn đoán và hồ sơ bệnh án , kế hoạch điều trị",
        IsActive: true
    },
    {
        ID: 15,
        Name: "Chăm sóc khách hàng",
        Type: "Basic",
        Description: "Nhắc lịch, chăm sóc sau điều trị, định kỳ, hẹn không đến , khách hàng phàn nàn complain",
        IsActive: true
    },
    {
        ID: 18,
        Name: "Quản lý kho",
        Type: "Basic",
        Description: "Xuất nhập hàng trong kho.Xuất bán hàng,xuất điều trị khách hàng.Order nhà cung cấp",
        IsActive: false
    },
    {
        ID: 21,
        Name: "Kế toán",
        Type: "Basic",
        Description: "Thu chi chi nhánh, công nợ khách hàng nhà cung cấp",
        IsActive: true
    },
    {
        ID: 3,
        Name: "Quản trị viên",
        Type: "Standard",
        Description: "Cấu hình danh mục, cài đặt hệ thống.Cấu hình phân quyền cho user và quản lý các quy định khác",
        IsActive: true
    },
    {
        ID: 6,
        Name: "Lễ Tân",
        Type: "Standard",
        Description: "Lịch hẹn , checkedin và điều phối khách hàng.Lên dịch vụ,bảo hiểm , trả góp và các thao tác khác",
        IsActive: true
    },
    //{
    //    ID: 10,
    //    Name: "Marketing",
    //    Type: "Standard",
    //    Description: "Quản lý telesale, chương trình giảm giá , voucher và quản lý dữ liệu",
    //    IsActive: true
    //},
    {
        ID: 13,
        Name: "Bác sĩ",
        Type: "Standard",
        Description: "Quá trình điều trị, tái khám và tư vấn. Chẩn đoán và hồ sơ bệnh án , kế hoạch điều trị",
        IsActive: true
    },
    {
        ID: 16,
        Name: "Chăm sóc khách hàng",
        Type: "Standard",
        Description: "Nhắc lịch, chăm sóc sau điều trị, định kỳ, hẹn không đến , khách hàng phàn nàn complain",
        IsActive: true
    },
    {
        ID: 19,
        Name: "Quản lý kho",
        Type: "Standard",
        Description: "Xuất nhập hàng trong kho.Xuất bán hàng,xuất điều trị khách hàng.Order nhà cung cấp",
        IsActive: true
    },
    {
        ID: 22,
        Name: "Kế toán",
        Type: "Standard",
        Description: "Thu chi chi nhánh, công nợ khách hàng nhà cung cấp",
        IsActive: true
    },

    {
        ID: 4,
        Name: "Quản trị viên",
        Type: "Pro",
        Description: "Cấu hình danh mục, cài đặt hệ thống.Cấu hình phân quyền cho user và quản lý các quy định khác",
        IsActive: true
    },
    {
        ID: 7,
        Name: "Lễ Tân",
        Type: "Pro",
        Description: "Lịch hẹn , checkedin và điều phối khách hàng.Lên dịch vụ,bảo hiểm , trả góp và các thao tác khác",
        IsActive: true
    },
    {
        ID: 11,
        Name: "Marketing",
        Type: "Pro",
        Description: "Quản lý telesale, chương trình giảm giá , voucher và quản lý dữ liệu",
        IsActive: true
    },
    {
        ID: 14,
        Name: "Bác sĩ",
        Type: "Pro",
        Description: "Quá trình điều trị, tái khám và tư vấn. Chẩn đoán và hồ sơ bệnh án , kế hoạch điều trị",
        IsActive: true
    },
    {
        ID: 17,
        Name: "Chăm sóc khách hàng",
        Type: "Pro",
        Description: "Nhắc lịch, chăm sóc sau điều trị, định kỳ, hẹn không đến , khách hàng phàn nàn complain",
        IsActive: true
    },
    {
        ID: 20,
        Name: "Quản lý kho",
        Type: "Pro",
        Description: "Xuất nhập hàng trong kho.Xuất bán hàng,xuất điều trị khách hàng.Order nhà cung cấp",
        IsActive: true
    },
    {
        ID: 23,
        Name: "Kế toán",
        Type: "Pro",
        Description: "Thu chi chi nhánh, công nợ khách hàng nhà cung cấp",
        IsActive: true
    }
];