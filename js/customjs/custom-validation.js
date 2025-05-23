﻿//validation settings in formvalidation page
'use strict'
//$('.ui.form1').form({
//    fields: {
//        name: {
//            identifier: 'name',
//            rules: [{
//                type: 'empty',
//                prompt: 'Please enter your name'
//            }]
//        },
//        skills: {
//            identifier: 'skills',
//            rules: [{
//                type: 'minCount[2]',
//                prompt: 'Please select at least two skills'
//            }]
//        },
//        branchwarehouse: {
//            identifier: 'branchwarehouse',
//            rules: [{
//                type: 'minCount[1]',
//                prompt: 'Please select at least two skills'
//            }]
//        },
//        gender: {
//            identifier: 'gender',
//            rules: [{
//                type: 'empty',
//                prompt: 'Please select a gender'
//            }]
//        },
//        username: {
//            identifier: 'username',
//            rules: [{
//                type: 'empty',
//                prompt: 'Please enter a username'
//            }]
//        },
//        password: {
//            identifier: 'password',
//            rules: [{
//                type: 'empty',
//                prompt: 'Please enter a password'
//            }, {
//                type: 'minLength[6]',
//                prompt: 'Your password must be at least {ruleValue} characters'
//            }]
//        },
//        terms: {
//            identifier: 'terms',
//            rules: [{
//                type: 'checked',
//                prompt: 'You must agree to the terms and conditions'
//            }]
//        }
//    }
//});
//$('.ui.form2').form({
//    fields: {
//        field1: {
//            rules: [{
//                type: 'empty'
//            }]
//        },
//        field2: {
//            rules: [{
//                type: 'exactly[dog]',
//                prompt: '{name} is set to "{value}" that is totally wrong. It should be {ruleValue}'
//            }]
//        }
//    }
//});

// AppointmentDetail, CustomerDetail,EmplopyeeDetail,UserDetail
// Customer HistoryDetail,Customer StatusDetail,Customer TabDetail,Customer TreatmentDetail,Customer PaymentDetail
// AccountDetail
// pageServiceTypeDetail,pageServiceDetail
// pageProductTypeDetail,pageProductDetail
// pageSupplierDetail,pageInputDetail, pageOutputDetail
// pageCustomerCareDetail
$('.form3').form({
    inline: true,
    on: 'blur',
    fields: {
        gender: {
            identifier: 'gender', 
            rules: [{
                type: 'checked',      
                prompt: Outlang['Sys_require'] 
            }]
        },
        search: {
            identifier: 'appointment',
            rules: [{
                type: 'empty',
                prompt: Outlang['Sys_require']
            }]
        },
        reasonReturn: {
            identifier: 'reasonReturn',
            rules: [{
                type: 'empty',
                prompt: Outlang['Sys_require']
            }]
        },

        latlong: {
            identifier: 'latlong',
            rules: [{
                type: 'regExp',
                value: /^\s*$|^\s*(-?([1-8]?\d(\.\d+)?|90(\.0+)?))\s*x\s*(-?(1[0-7]\d(\.\d+)?|180(\.0+)?|[1-9]?\d(\.\d+)?))\s*$/i,
                prompt: Outlang['Sai_dinh_dang']
            }]
        },

        branch: {
            identifier: 'branch',
            rules: [{
                type: 'empty',
                prompt: Outlang['Sys_require']
            }]
        },
        tokenServiceCare: {
            identifier: 'tokenServiceCare',
            rules: [
                {
                    type: 'minCount[1]',
                    prompt: Outlang['Sys_require']
                }
            ]
        },
        doctor: {
            identifier: 'doctor',
            rules: [{
                type: 'empty',
                prompt: Outlang['Sys_require']
            }]
        },
        skills: {
            identifier: 'skills',
            rules: [{
                type: 'minCount[1]',
                prompt: Outlang['Sys_require']
            }]
        },
        //gender: {
        //    identifier: 'gender',
        //    rules: [{
        //        type: 'empty',
        //        prompt: Outlang['Sys_require']
        //    }]
        //},
        State: {
            identifier: 'State',
            rules: [{
                type: 'empty',
                prompt: Outlang['Sys_require']
            }]
        },
        Employee: {
            identifier: 'Employee',
            rules: [{
                type: 'empty',
                prompt: Outlang['Sys_require']
            }]
        },
        GroupUser: {
            identifier: 'GroupUser',
            rules: [{
                type: 'empty',
                prompt: Outlang['Sys_require']
            }]
        },

        username: {
            identifier: 'username',
            rules: [{
                type: 'empty',
                prompt: Outlang['Sys_require']
            }]
        },
        //password: {
        //    identifier: 'password',
        //    rules: [{
        //        type: 'empty',
        //        prompt: Outlang['Sys_require']
        //    }, {
        //        type: 'minLength[6]',
        //        prompt: 'Your password must be at least {ruleValue} characters'
        //    }]
        //},
        passwordUser: {
            identifier: 'passwordUser',
            rules: [{
                type: 'regExp',
                value: /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d#$@!%&*?]{6,15}$/,
                prompt: Outlang['Sai_dinh_dang']

            }]
        },
        terms: {
            identifier: 'terms',
            rules: [{
                type: 'checked',
                prompt: Outlang['Sys_require']
            }]
        },
        emailValidate: {
            identifier: 'emailValidate',
            rules: [
                {
                    type: 'emailValidate',
                    prompt: Outlang['Sai_dinh_dang'] + ': mail'
                }
            ]
        },
        email: {
            identifier: 'email',
            rules: [{
                type: 'regExp',
                value: /^$|^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
                prompt: Outlang['Sai_dinh_dang'] + ': mail'
            }]
        },
        emailCompany: {
            identifier: 'emailCompany',
            rules: [{
                type: 'regExp',
                value: /^$|^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
                prompt: Outlang['Sai_dinh_dang'] + ': mail'
            }]
        },
        emailEmpty: {
            identifier: 'emailEmpty',
            rules: [
                {
                    type: 'empty',
                    prompt: Outlang['Sys_require']
                },
                {
                    type: 'regExp',
                    value: /^$|^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
                    prompt: Outlang['Sai_dinh_dang'] + ': mail'
                }
            ]
        },
        phonenumber: {
            identifier: 'phonenumber',
            rules: [
                {
                    type: 'minLength[10]',
                    prompt: Outlang['Sai_dinh_dang'] + ': ' + Outlang['Sys_Min'] + ' 10 ' + Outlang['Sys_Chars']
                },
                {
                    type: 'maxLength[16]',
                    prompt: Outlang['Sai_dinh_dang'] + ': ' + Outlang['Sys_Max'] + ' 16 ' + Outlang['Sys_Chars']
                },
                {
 
                    type: 'regExp',
                    value: /^$|^[0-9+]+$/g,
                    prompt: Outlang['Sai_dinh_dang']+': '+Outlang["Sys_sdt"]
                }
            ]
        },
        phonenumberNotVN: {
            identifier: 'phonenumberNotVN',
            rules: [
                {
                    type: 'minLength[6]',
                    prompt: Outlang['Sai_dinh_dang'] + ': ' + Outlang['Sys_Min'] + ' 6 ' + Outlang['Sys_Chars']
                },
                {
                    type: 'maxLength[16]',
                    prompt: Outlang['Sai_dinh_dang'] + ': ' + Outlang['Sys_Max'] + ' 16 ' + Outlang['Sys_Chars']
                },
                {
                    type: 'regExp',
                    value: /^$|^[0-9+]+$/g,
                    prompt: Outlang['Sai_dinh_dang']+': '+Outlang["Sys_sdt"]
                }
            ]
        },
        phonenumberNotMain: {
            identifier: 'phonenumberNotMain',
            rules: [
                {
                    type: 'regExp',
                    value: /^$|^[0-9+]+$/g,
                    prompt: Outlang['Sai_dinh_dang']+': '+Outlang["Sys_sdt"]
                }
            ]
        },
        codewarehouse: {
            identifier: 'codewarehouse',
            rules: [
                {
                    type: 'exactLength[5]',
                    prompt: Outlang['Sai_dinh_dang'] + ': ' + '10 ' + Outlang['Sys_Chars']
                },
                {
                    type: 'empty',
                    prompt: Outlang['Sys_require']
                }
            ]
        },
        currency: {
            identifier: 'currency',
            rules: [{
                type: 'exactLength[3]',
                prompt: Outlang['Sai_dinh_dang'] + ': ' + '3 ' + Outlang['Sys_Chars']
            }]
        },
        name: {
            identifier: 'name',
            rules: [{
                type: 'empty',
                prompt: Outlang['Sys_require']
            }]
        },
        subject: {
            identifier: 'subject',
            rules: [{
                type: 'empty',
                prompt: Outlang['Sys_require']
            }]
        },
        source: {
            identifier: 'source',
            rules: [{
                type: 'empty',
                prompt: Outlang['Sys_require']
            }]
        },
        language: {
            identifier: 'language',
            rules: [{
                type: 'empty',
                prompt: Outlang['Sys_require']
            }]
        },
        department: {
            identifier: 'department',
            rules: [{
                type: 'empty',
                prompt: Outlang['Sys_require']
            }]
        },
        cmnd: {
            identifier: 'cmnd',
            rules: [
                {
                    type: 'number',
                    prompt: Outlang['Sai_dinh_dang'] + ': ' + Outlang['Sys_number']
                }
            ]
        },
        basicsalary: {
            identifier: 'basicsalary',
            rules: [
                {
                    type: 'number',
                    prompt: Outlang['Sai_dinh_dang'] + ': ' + Outlang['Sys_number']
                },
                {
                    type: 'empty',
                    prompt: Outlang['Sys_require']
                }
            ]
        },
        salaryagreed: {
            identifier: 'salaryagreed',
            rules: [
                {
                    type: 'number',
                    prompt: Outlang['Sai_dinh_dang'] + ': ' + Outlang['Sys_number']
                },
                {
                    type: 'empty',
                    prompt: Outlang['Sys_require']
                }
            ]
        },
        employee: {
            identifier: 'employee',
            rules: [{
                type: 'empty',
                prompt: Outlang['Sys_require']
            }]
        },
        userGroup: {
            identifier: 'userGroup',
            rules: [{
                type: 'empty',
                prompt: Outlang['Sys_require']
            }]
        },
        historyType: {
            identifier: 'historyType',
            rules: [{
                type: 'empty',
                prompt: Outlang['Sys_require']
            }]
        },
        complainType: {
            identifier: 'complainType',
            rules: [{
                type: 'empty',
                prompt: Outlang['Sys_require']
            }]
        },
        statusType: {
            identifier: 'statusType',
            rules: [{
                type: 'empty',
                prompt: Outlang['Sys_require']
            }]
        },
        discountType: {
            identifier: 'discountType',
            rules: [{
                type: 'empty',
                prompt: Outlang['Sys_require']
            }]
        },
        serviceTab: {
            identifier: 'serviceTab',
            rules: [{
                type: 'empty',
                prompt: Outlang['Sys_require']
            }]
        },
        numberService: {
            identifier: 'numberService',
            rules: [{
                type: 'integer[1..100]',
                prompt: Outlang['Sai_dinh_dang'] + ': ' + Outlang['Sys_number'] + ' (1-100)'
            }]
        },
        discountForCust: {
            identifier: 'discountForCust',
            rules: [{
                type: 'integer[0..100]',
                prompt: Outlang['Sai_dinh_dang'] + ': ' + Outlang['Sys_number'] + ' (0-100)'
            }]
        },

        discountPercent: {
            identifier: 'discountPercent',
            rules: [{
                type: 'integer[1..100]',
                prompt: Outlang['Sai_dinh_dang'] + ': ' + Outlang['Sys_number'] + ' (1-100)'
            }]
        },

        discountAmount: {
            identifier: 'discountAmount',
            rules: [{
                type: 'regExp[/^(?:\\d{1,3}(?:,\\d{3})*|\\d+)(?:\\.\\d{1,2})?$/]',
                prompt: Outlang['Sys_Money']
            }]
        },
        moneyAmount: {
            identifier: 'moneyAmount',
            rules: [{
                type: 'regExp[/^(?:\\d{1,3}(?:,\\d{3})*|\\d+)(?:\\.\\d{1,2})?$/]',
                prompt: Outlang['Sys_Money']
            }]
        },
        discountOther: {
            identifier: 'discountOther',
            rules: [{
                type: 'regExp[/^(?:\\d{1,3}(?:,\\d{3})*|\\d+)(?:\\.\\d{1,2})?$/]',
                prompt: Outlang['Sys_Money']
            }]
        },
        accountType: {
            identifier: 'accountType',
            rules: [{
                type: 'empty',
                prompt: Outlang['Sys_require']
            }]
        },
        accountMethod: {
            identifier: 'accountMethod',
            rules: [{
                type: 'empty',
                prompt: Outlang['Sys_require']
            }]
        },
        accountAmount: {
            identifier: 'accountAmount',
            rules: [{
                type: 'empty',
                prompt: Outlang['Sys_require']
            }, {
                type: 'regExp[/^(?:\\d{1,3}(?:,\\d{3})*|\\d+)(?:\\.\\d{1,2})?$/]',
                prompt: Outlang['Sys_Money']
            }]
        },
        productType: {
            identifier: 'productType',
            rules: [{
                type: 'empty',
                prompt: Outlang['Sys_require']
            }]
        },
        productUnit: {
            identifier: 'productUnit',
            rules: [{
                type: 'empty',
                prompt: Outlang['Sys_require']
            }]
        },
        serviceType: {
            identifier: 'serviceType',
            rules: [{
                type: 'empty',
                prompt: Outlang['Sys_require']
            }]
        },
        unitServiceType: {
            identifier: 'unitServiceType',
            rules: [{
                type: 'empty',
                prompt: Outlang['Sys_require']
            }]
        },
        unitCountService: {
            identifier: 'unitCountService',
            rules: [{
                type: 'empty',
                prompt: Outlang['Sys_require']
            }]
        },
        serviceCode: {
            identifier: 'serviceCode',
            rules: [
                {
                    type: 'empty',
                    prompt: Outlang['Sys_require']
                },
                {
                    type: 'regExp[/^[a-zA-Z0-9-_/]{1,20}$/]',
                    prompt: Outlang['Sai_dinh_dang']
                }
            ]
        },
        greater0: {
            identifier: 'greater0',
            rules: [
                {
                    type: 'empty',
                    prompt: Outlang['Sys_require']
                },
                {
                    type: 'integer[1..10000]',
                    prompt: Outlang['Sai_dinh_dang'] + ': ' + Outlang['Sys_number'] + ' (1-10000)'
                }]
        },
        greaterequal0: {
            identifier: 'greaterequal0',
            rules: [
                {
                    type: 'integer[0..10000]',
                    prompt: Outlang['Sai_dinh_dang'] + ': ' + Outlang['Sys_number'] + ' (0-10000)'
                }]
        },
        membercode: {
            identifier: 'membercode',
            rules: [
                {
                    type: 'regExp[/^[a-zA-Z0-9-_/]{1,20}$/]',
                    prompt: Outlang['Sai_dinh_dang']
                }
            ]
        },
        servicePrice: {
            identifier: 'servicePrice',
            rules: [{
                type: 'empty',
                prompt: Outlang['Sys_require']
            }, {
                type: 'regExp[/^(?:\\d{1,3}(?:,\\d{3})*|\\d+)(?:\\.\\d{1,2})?$/]',
                prompt: Outlang['Sai_dinh_dang']
            }]
        },
        clientCode: {
            identifier: 'clientCode',
            rules: [
                {
                    type: 'empty',
                    prompt: Outlang['Sys_require']
                },

                {
                    type: 'regExp[/^[a-zA-Z0-9-/]{3,10}$/]',
                    prompt: Outlang['Sai_dinh_dang']
                }
            ]
        },
        numberFloat: {
            identifier: 'numberFloat',
            rules: [
                {
                    type: 'empty',
                    prompt: Outlang['Sys_require']
                },
                {
                    type: 'regExp[/^[0-9./]{1,10}$/]',
                    prompt: Outlang['Sai_dinh_dang']
                }
            ]
        },
        IdentificationCode: {
            identifier: 'IdentificationCode',
            rules: [
                {
                    type: 'regExp[/^[a-zA-Z0-9-_/]{0,100}$/]',
                    prompt: Outlang['Sai_dinh_dang']
                }
            ]
        },
        product: {
            identifier: 'product',
            rules: [{
                type: 'empty',
                prompt: Outlang['Sys_require']
            }]
        },
        wareto: {
            identifier: 'wareto',
            rules: [{
                type: 'empty',
                prompt: Outlang['Sys_require']
            }]
        },
        reasonex: {
            identifier: 'reasonex',
            rules: [{
                type: 'empty',
                prompt: Outlang['Sys_require']
            }]
        },
        supplier: {
            identifier: 'supplier',
            rules: [{
                type: 'empty',
                prompt: Outlang['Sys_require']
            }]
        },
        unitProduct: {
            identifier: 'unitProduct',
            rules: [{
                type: 'empty',
                prompt: Outlang['Sys_require']
            }]
        },
        numberProduct: {
            identifier: 'numberProduct',
            rules: [{
                type: 'integer[1..100]',
                prompt: Outlang['Sai_dinh_dang'] + ': ' + Outlang['Sys_number'] + ' (1-100)'
            }]
        },
        numberOfMonth: {
            identifier: 'numberOfMonth',
            rules: [{
                type: 'integer[1..12]',
                prompt: Outlang['Sai_dinh_dang'] + ': ' + Outlang['Sys_number'] + ' (1-12)'
            }]
        },
        numberOfDay: {
            identifier: 'numberOfDay',
            rules: [{
                type: 'integer[1..31]',
                prompt: Outlang['Sai_dinh_dang'] + ': ' + Outlang['Sys_number'] + ' (1-31)'
            }]
        },
        quantitylabo: {
            identifier: 'quantitylabo',
            rules: [{
                type: 'integer[1..32]',
                prompt: Outlang['Sai_dinh_dang'] + ': ' + Outlang['Sys_number'] + ' (1-32)'
            }]
        },
        productPrice: {
            identifier: 'productPrice',
            rules: [{
                type: 'empty',
                prompt: Outlang['Sys_require']
            }, {
                type: 'regExp[/^(?:\\d{1,3}(?:,\\d{3})*|\\d+)(?:\\.\\d{1,2})?$/]',
                prompt: Outlang['Sai_dinh_dang']
            }]
        },
        date: {
            identifier: 'date',
            rules: [{
                type: 'empty',
                prompt: Outlang['Sys_require']
            }]
        },
        folderName: {
            identifier: 'folderName',
            rules: [{
                type: 'empty',
                prompt: Outlang['Sys_require']
            }, {
                type: 'regExp[/^[a-zA-Z0-9-/]{0,50}$/]',
                prompt: Outlang['Sai_dinh_dang']
            }]
        },
        dateValid: {
            identifier: 'dateValid',
            rules: [{
                type: 'regExp[/(([1-9]|[0-2][0-9]|[3][0-1])[-/.]([1-9]|[1][0-2]|[0][0-9])[-/.]([1][9]([0-9]{2})|[2]([0-9]{3})))/]',
                prompt: Outlang['Sai_dinh_dang']
            }]
        },
        dateSystemValid: {
            identifier: 'dateSystemValid',
            rules: [{
                type: 'regExp[/^(0[1-9]|[12][0-9]|3[01])([\\/\\.-])(0[1-9]|1[0-2])\\2\\d{4}$/]',
                prompt: Outlang['Sai_dinh_dang']
            }]
        },
        dateValidNotEmpty: {
            identifier: 'dateValidNotEmpty',
            rules: [{
                type: 'empty',
                prompt: Outlang['Sys_require']
            }, {
                type: 'regExp[/(([1-9]|[0-2][0-9]|[3][0-1])[-|/|\.]([1-9]|[1][0-2]|[0][0-9])[-|/|\.]([1][9]([0-9]{2})|[2]([0-9]{3})))/]',
                prompt: Outlang['Sai_dinh_dang']
            }]
        },
        NotEmpty: {
            identifier: 'NotEmpty',
            rules: [{
                type: 'empty',
                prompt: Outlang['Sys_require']
            }]
        },
        RepresentName: {
            identifier: 'RepresentName',
            rules: [{
                type: 'empty',
                prompt: Outlang['Sys_require']
            }]
        },
        RepresentPhone: {
            identifier: 'RepresentPhone',
            rules: [
                {
                    type: 'minLength[10]',
                    prompt: Outlang['Sai_dinh_dang'] + ': ' + Outlang['Sys_Min'] + ' 10 ' + Outlang['Sys_Chars']
                },
                {
                    type: 'maxLength[16]',
                    prompt: Outlang['Sai_dinh_dang'] + ': ' + Outlang['Sys_Max'] + ' 16 ' + Outlang['Sys_Chars']
                },
                {
                    type: 'number',
                    prompt: Outlang['Sai_dinh_dang'] + ': ' + Outlang['Sys_number']
                }
            ]
        },
        IdentityCard: {
            identifier: 'IdentityCard',
            rules: [{
                type: 'empty',
                prompt: Outlang['Sys_require']
            }]
        },
        RelationshipPerson: {
            identifier: 'RelationshipPerson',
            rules: [{
                type: 'empty',
                prompt: Outlang['Sys_require']
            }]
        },
        Relationship: {
            identifier: 'Relationship',
            rules: [{
                type: 'empty',
                prompt: Outlang['Sys_require']
            }]
        },
        CountTypeDefault: {
            identifier: 'CountTypeDefault',
            rules: [{
                type: 'empty',
                prompt: Outlang['Sys_require']
            }]
        },
        ware: {
            identifier: 'ware',
            rules: [{
                type: 'empty',
                prompt: Outlang['Sys_require']
            }]
        },
        sourceType: {
            identifier: 'sourceType',
            rules: [{
                type: 'empty',
                prompt: Outlang['Sys_require']
            }]
        },
        url: {
            identifier: 'url',
            rules: [
                {
                    type: 'url',
                    prompt: Outlang['Sys_require']
                }
            ]
        },
        urlZalo: {
            identifier: 'urlZalo',
            rules: [
                {
                    type: 'url',
                    prompt: Outlang['Sys_require']
                }
            ]
        },
        urlMess: {
            identifier: 'url1',
            rules: [
                {
                    type: 'url',
                    prompt: Outlang['Sys_require']
                }
            ]
        },
        lineWidth: {
            identifier: 'lineWidth',
            rules: [{
                type: 'integer[1..10]',
                prompt: Outlang['Sai_dinh_dang'] + ': ' + Outlang['Sys_number'] + ' (1-10)'
            }]
        },
        opacityDegree: {
            identifier: 'opacityDegree',
            rules: [{
                type: 'integer[1..10]',
                prompt: Outlang['Sai_dinh_dang'] + ': ' + Outlang['Sys_number'] + ' (1-10)'
            }]
        },
        cardissue: {
            identifier: 'cardissue',
            rules: [{
                type: 'integer[0..999]',
                prompt: Outlang['Sai_dinh_dang'] + ': ' + Outlang['Sys_number'] + ' (0-999)'
            }]
        },
        grouptele: {
            identifier: 'grouptele',
            rules: [
                {
                    type: 'empty',
                    prompt: Outlang['Sys_require']
                }
            ]
        },
        namelevel: {
            identifier: 'namelevel',
            rules: [
                {
                    type: 'empty',
                    prompt: Outlang['Sys_require']
                }
            ]
        },
        pageName: {
            identifier: 'pageName',
            rules: [
                {
                    type: 'empty',
                    prompt: Outlang['Sys_require']
                }
            ]
        },
        controlName: {
            identifier: 'controlName',
            rules: [
                {
                    type: 'empty',
                    prompt: Outlang['Sys_require']
                }
            ]
        },
        controlValue: {
            identifier: 'controlValue',
            rules: [
                {
                    type: 'empty',
                    prompt: Outlang['Sys_require']
                }
            ]
        },
        typecontrol: {
            identifier: 'typecontrol',
            rules: [
                {
                    type: 'empty',
                    prompt: Outlang['Sys_require']
                }
            ]
        },
        paymentMethod: {
            identifier: 'paymentMethod',
            rules: [
                {
                    type: 'empty',
                    prompt: Outlang['Sys_require']
                }
            ]
        },
        paymentMethodType: {
            identifier: 'paymentMethodType',
            rules: [
                {
                    type: 'empty',
                    prompt: Outlang['Sys_require']
                }
            ]
        },
        InvidualTeleFrom: {
            identifier: 'InvidualTeleFrom',
            rules: [
                {
                    type: 'empty',
                    prompt: Outlang['Sys_require']
                }
            ]
        },
        InvidualTeleTo: {
            identifier: 'InvidualTeleTo',
            rules: [
                {
                    type: 'empty',
                    prompt: Outlang['Sys_require']
                }
            ]
        },
        serviceTabChange: {
            identifier: 'serviceTabChange',
            rules: [
                {
                    type: 'empty',
                    prompt: Outlang['Sys_require']
                }
            ]
        },
        newStatusApp: {
            identifier: 'newStatusApp',
            rules: [
                {
                    type: 'empty',
                    prompt: Outlang['Sys_require']
                }
            ]
        },
        password: {
            identifier: 'password',
            rules: [
                {
                    type: 'empty',
                    prompt: Outlang['Sys_require']
                },
                {
                    type: 'minLength[6]',
                    prompt: Outlang['Sai_dinh_dang'] + ': ' + Outlang['Sys_Min'] + ' 6 ' + Outlang['Sys_Chars']
                },
                {
                    type: 'maxLength[30]',
                    prompt: Outlang['Sai_dinh_dang'] + ': ' + Outlang['Sys_Max'] + ' 30 ' + Outlang['Sys_Chars']
                }
            ]
        },
        freetext: {
            identifier: 'freetext',
            rules: [
                {
                    type: 'maxLength[4000]',
                    prompt: Outlang['Sai_dinh_dang'] + ': ' + Outlang['Sys_Max'] + ' 4000 ' + Outlang['Sys_Chars']
                }
            ]
        },

        usernameCreate: {
            identifier: 'usernameCreate',
            rules: [
                {
                    type: 'empty',
                    prompt: Outlang['Sys_require']
                },
                {
                    type: 'minLength[6]',
                    prompt: Outlang['Sai_dinh_dang'] + ': ' + Outlang['Sys_Min'] + ' 6 ' + Outlang['Sys_Chars']
                },
                {
                    type: 'maxLength[15]',
                    prompt: Outlang['Sai_dinh_dang'] + ': ' + Outlang['Sys_Max'] + ' 15 ' + Outlang['Sys_Chars']
                }
            ]
        },
        usernamemin6: {
            identifier: 'usernamemin6',
            rules: [{
                type: 'empty',
                prompt: Outlang['Sys_require']
            }, {
                type: 'minLength[6]',
                prompt: Outlang['Sai_dinh_dang'] + ': ' + Outlang['Sys_Min'] + ' 6 ' + Outlang['Sys_Chars']
            }]
        },
        usernamemin5: {
            identifier: 'usernamemin5',
            rules: [{
                type: 'empty',
                prompt: Outlang['Sys_require']
            }, {
                type: 'minLength[5]',
                prompt: Outlang['Sai_dinh_dang'] + ': ' + Outlang['Sys_Min'] + ' 5 ' + Outlang['Sys_Chars']
            }]
        },
        passwordNew: {
            identifier: 'passwordNew',
            rules: [
                {
                    type: 'empty',
                    prompt: Outlang['Sys_require']
                },
                {
                    type: `regExp[/^[^'"]*$/]`,
                    prompt: Outlang['Sai_dinh_dang']
                },
                {
                    type: 'minLength[6]',
                    prompt: Outlang['Sai_dinh_dang'] + ': ' + Outlang['Sys_Min'] + ' 6 ' + Outlang['Sys_Chars']
                },
                {
                    type: 'maxLength[15]',
                    prompt: Outlang['Sai_dinh_dang'] + ': ' + Outlang['Sys_Max'] + ' 15 ' + Outlang['Sys_Chars']
                }
            ]
        },
        passwordAgain: {
            identifier: 'passwordAgain',
            rules: [
                {
                    type: 'empty',
                    prompt: Outlang['Sys_require']
                },
                {
                    type: `regExp[/^[^'"]*$/]`,
                    prompt: Outlang['Sai_dinh_dang']
                },
                {
                    type: 'minLength[6]',
                    prompt: Outlang['Sai_dinh_dang'] + ': ' + Outlang['Sys_Min'] + ' 6 ' + Outlang['Sys_Chars']
                },
                {
                    type: 'maxLength[15]',
                    prompt: Outlang['Sai_dinh_dang'] + ': ' + Outlang['Sys_Max'] + ' 15 ' + Outlang['Sys_Chars']
                }
            ]
        },
        branchCode: {
            identifier: 'branchCode',
            rules: [
                {
                    type: 'empty',
                    prompt: Outlang['Sys_require']
                },
                {
                    type: 'minLength[2]',
                    prompt: Outlang['Sai_dinh_dang'] + ': ' + Outlang['Sys_Min'] + ' 2 ' + Outlang['Sys_Chars']
                },
                {
                    type: 'maxLength[4]',
                    prompt: Outlang['Sai_dinh_dang'] + ': ' + Outlang['Sys_Max'] + ' 4 ' + Outlang['Sys_Chars']
                }
            ]
        },
        voucherCode: {
            identifier: 'voucherCode',
            rules: [
                {
                    type: 'empty',
                    prompt: Outlang['Sys_require']
                },
                {
                    type: 'regExp[/^[a-zA-Z0-9]+$/]',
                    prompt: Outlang['Sai_dinh_dang']
                },
                {
                    type: 'minLength[6]',
                    prompt: Outlang['Sai_dinh_dang'] + ': ' + Outlang['Sys_Min'] + ' 6 ' + Outlang['Sys_Chars']
                },
                {
                    type: 'maxLength[20]',
                    prompt: Outlang['Sai_dinh_dang'] + ': ' + Outlang['Sys_Max'] + ' 20 ' + Outlang['Sys_Chars']
                }
            ]
        },
        ShortBranch: {
            identifier: 'ShortBranch',
            rules: [
                {
                    type: 'empty',
                    prompt: Outlang['Sys_require']
                }
            ]
        },
        CompanyAddress: {
            identifier: 'CompanyAddress',
            rules: [
                {
                    type: 'empty',
                    prompt: Outlang['Sys_require']
                }
            ]
        },
        phone: {
            identifier: 'phone',
            rules: [
                {
                    type: 'empty',
                    prompt: Outlang['Sys_require']
                },
                {
                    type: 'minLength[8]',
                    prompt: Outlang['Sai_dinh_dang'] + ': ' + Outlang['Sys_Min'] + ' 8 ' + Outlang['Sys_Chars']
                },
                {
                    type: 'maxLength[16]',
                    prompt: Outlang['Sai_dinh_dang'] + ': ' + Outlang['Sys_Max'] + ' 16 ' + Outlang['Sys_Chars']
                }
            ]
        },
        ferature: {
            identifier: 'ferature',
            rules: [
                {
                    type: 'empty',
                    prompt: Outlang['Sys_require']
                },

                {
                    type: 'maxLength[20]',
                    prompt: Outlang['Sai_dinh_dang'] + ': ' + Outlang['Sys_Max'] + ' 20 ' + Outlang['Sys_Chars']
                }
            ]
        },
        telesaledivision: {
            identifier: 'telesaledivision',
            rules: [
                {
                    type: 'empty',
                    prompt: Outlang['Sys_require']
                }
            ]
        },
        chattingdivision: {
            identifier: 'chattingdivision',
            rules: [
                {
                    type: 'empty',
                    prompt: Outlang['Sys_require']
                }
            ]
        },
        hidecomment: {
            identifier: 'hidecomment',
            rules: [
                {
                    type: 'empty',
                    prompt: Outlang['Sys_require']
                }
            ]
        },
        alias: {
            identifier: 'alias',
            rules: [
                {
                    type: 'empty',
                    prompt: Outlang['Sys_require']
                },
                {
                    type: 'maxLength[15]',
                    prompt: Outlang['Sai_dinh_dang'] + ': ' + Outlang['Sys_Max'] + ' 15 ' + Outlang['Sys_Chars']
                }
            ]
        },
        SourceMainkey: {
            identifier: 'SourceMainkey',
            rules: [
                {
                    type: 'empty',
                    prompt: Outlang['Sys_require']
                }
            ]
        },
        element: {
            identifier: 'element',
            rules: [
                {
                    type: 'empty',
                    prompt: Outlang['Sys_require']
                }
            ]
        },
        typeelement: {
            identifier: 'typeelement',
            rules: [
                {
                    type: 'empty',
                    prompt: Outlang['Sys_require']
                }
            ]
        },
        ruleoptioncombo: {
            identifier: 'ruleoptioncombo',
            rules: [
                {
                    type: 'empty',
                    prompt: Outlang['Sys_require']
                }
            ]
        },
        ruleoptiontreatmutildoc: {
            identifier: 'ruleoptiontreatmutildoc',
            rules: [
                {
                    type: 'empty',
                    prompt: Outlang['Sys_require']
                }
            ]
        },
        ruleoptiontreatmutilass: {
            identifier: 'ruleoptiontreatmutilass',
            rules: [
                {
                    type: 'empty',
                    prompt: Outlang['Sys_require']
                }
            ]
        },
        ruleoptiontext: {
            identifier: 'ruleoptiontext',
            rules: [
                {
                    type: 'empty',
                    prompt: Outlang['Sys_require']
                }
            ]
        },
        rulecontenttext: {
            identifier: 'rulecontenttext',
            rules: [
                {
                    type: 'empty',
                    prompt: Outlang['Sys_require']
                }
            ]
        },
        documentCode: {
            identifier: 'documentCode',
            rules: [{
                type: 'empty',
                prompt: Outlang['Sys_require']
            }, {
                type: 'regExp[/^[a-zA-Z0-9-/]{1,3}$/]',
                prompt: Outlang['Sai_dinh_dang']
            }]
        },
        code: {
            identifier: 'code',
            rules: [{
                type: 'empty',
                prompt: Outlang['Sys_require']
            }, {
                type: 'regExp[/^[a-zA-Z0-9-/]{1,50}$/]',
                prompt: Outlang['Sai_dinh_dang']
            }]
        },
        packagenumber: {
            identifier: 'packagenumber',
            rules: [{
                type: 'empty',
                prompt: Outlang['Sys_require']
            }, {
                type: `regExp[/^[a-zA-Z0-9_-]+$/]`,
                prompt: Outlang['Sai_dinh_dang']
            }]
        },
        folderimage: {
            identifier: 'folderimage',
            rules: [
                {
                    type: 'empty',
                    prompt: Outlang['Sys_require']
                },
                {
                    type: 'regExp[/^[a-zA-Z0-9-/]{1,100}$/]',
                    prompt: Outlang['Sai_dinh_dang']
                },
                {
                    type: 'minLength[5]',
                    prompt: Outlang['Sai_dinh_dang'] + ': ' + Outlang['Sys_Min'] + ' 5 ' + Outlang['Sys_Chars']
                },
                {
                    type: 'maxLength[30]',
                    prompt: Outlang['Sai_dinh_dang'] + ': ' + Outlang['Sys_Max'] + ' 30 ' + Outlang['Sys_Chars']
                }
            ]
        },
        warecode: {
            identifier: 'warecode',
            rules: [{
                type: 'empty',
                prompt: Outlang['Sys_require']
            }, {
                type: 'regExp[/^[a-zA-Z0-9-/]{1,10}$/]',
                prompt: Outlang['Sai_dinh_dang']
            }]
        },
        cardcode: {
            identifier: 'cardcode',
            rules: [{
                type: 'empty',
                prompt: Outlang['Sys_require']
            }
                , {
                type: 'regExp[/^[a-zA-Z0-9]{1,30}$/]',
                prompt: Outlang['Sai_dinh_dang']
            }
            ]
        },
        Propertiescode: {
            identifier: 'Propertiescode',
            rules: [{
                type: 'empty',
                prompt: Outlang['Sys_require']
            }
                , {
                type: 'regExp[/^[a-zA-Z0-9]{1,6}$/]',
                prompt: Outlang['Sai_dinh_dang']
            }
            ]
        },
        cardcodeprint: {
            identifier: 'cardcodeprint',
            rules: [{
                type: 'empty',
                prompt: Outlang['Sys_require']
            }, {
                type: 'regExp[/^[a-zA-Z0-9-/]{1,10}$/]',
                prompt: Outlang['Sai_dinh_dang']
            }
                ,
            {
                type: 'maxLength[3]',
                prompt: Outlang['Sai_dinh_dang'] + ': ' + Outlang['Sys_Max'] + ' 3 ' + Outlang['Sys_Chars']
            }
            ]
        },
        slidecode: {
            identifier: 'slidecode',
            rules: [{
                type: 'empty',
                prompt: Outlang['Sys_require']
            }
            ]
        },
        webpageproperty: {
            identifier: 'webpageproperty',
            rules: [{
                type: 'empty',
                prompt: Outlang['Sys_require']
            }, {
                type: 'regExp',
                value: /^[A-Za-z\d#$@!%&*?,.'"\{\}`\/\\\]\[\-\_\=\+\:\;\~\|\^\(\)]{1,}$/,
                prompt: Outlang['Sai_dinh_dang']
            }]
        },
        timeBegin: {
            identifier: 'timeBegin',
            rules: [
                {
                    type: 'empty',
                    prompt: Outlang['Sys_require']
                }
            ]
        },
        timeEnd: {
            identifier: 'timeEnd',
            rules: [
                {
                    type: 'empty',
                    prompt: Outlang['Sys_require']
                }
            ]
        },
        teacher: {
            identifier: 'teacher',
            rules: [
                {
                    type: 'empty',
                    prompt: Outlang['Sys_require']
                }
            ]
        },
        manuclass: {
            identifier: 'manuclass',
            rules: [
                {
                    type: 'empty',
                    prompt: Outlang['Sys_require']
                }
            ]
        },
    }
});

//$('.ui.form4').form({
//    fields: {
//        name: {
//            identifier: 'name',
//            rules: [{
//                type: 'empty',
//                prompt: 'Please enter data'
//            }]
//        },
//        phonenumber: {
//            identifier: 'phonenumber',
//            rules: [
//                {
//                    type: 'minLength[8]',
//                    prompt: 'Please enter exactly 8 characters'
//                },
//                {
//                    type: 'maxLength[16]',
//                    prompt: 'Please enter exactly 12 characters'
//                },
//                {
//                    type: 'number',
//                    prompt: 'Please enter number'
//                }
//            ]
//        },
//        skills: {
//            identifier: 'skills',
//            rules: [{
//                type: 'minCount[2]',
//                prompt: 'Please select at least two skills'
//            }]
//        },
//        gender: {
//            identifier: 'gender',
//            rules: [{
//                type: 'empty',
//                prompt: 'Please select a gender'
//            }]
//        },
//        username: {
//            identifier: 'username',
//            rules: [{
//                type: 'empty',
//                prompt: 'Please enter a username'
//            }]
//        },
//        password: {
//            identifier: 'password',
//            rules: [{
//                type: 'empty',
//                prompt: 'Please enter a password'
//            }, {
//                type: 'minLength[6]',
//                prompt: 'Your password must be at least {ruleValue} characters'
//            }]
//        },
//        terms: {
//            identifier: 'terms',
//            rules: [{
//                type: 'checked',
//                prompt: 'You must agree to the terms and conditions'
//            }]
//        },
//        sourceType: {
//            identifier: 'sourceType',
//            rules: [{
//                type: 'empty',
//                prompt: 'Please enter a sourceType'
//            }]
//        },

//        fileUpload: {
//            identifier: 'fileUpload',
//            rules: [{
//                type: 'empty',
//                prompt: 'Please enter a fileUpload'
//            }]
//        },
//        reasonCancel: {
//            identifier: 'reasonCancel',
//            rules: [{
//                type: 'empty',
//                prompt: 'Please enter a reasonCancel'
//            }]
//        },

//    }
//});
//$(".setdata.button").on("click", function () {
//    $('.ui.form3')
//        // set one value
//        .form('set value', 'name', 'Jack')
//        // set several values
//        .form('set values', {
//            name: 'Joshua',
//            gender: 'male',
//            colors: ['red', 'grey'],
//            username: 'q_joshua',
//            password: 'passw0rd',
//            terms: true
//        });
//})

//$(".clear.button").on("click", function () {
//    $('form').form('clear')
//});
//$(".reset.button").on("click", function () {
//    $('form').form('reset')
//});
//$('.ui.form5').form({
//    inline: true,
//    on: 'blur',
//    fields: {
//        name: {
//            identifier: 'first-name',
//            rules: [{
//                type: 'empty',
//                prompt: 'Please enter data'
//            }]
//        },
//        skills: {
//            identifier: 'last-name',
//            rules: [{
//                type: 'minCount[2]',
//                prompt: 'Please enter your last name'
//            }]
//        },

//        username: {
//            identifier: 'username',
//            rules: [{
//                type: 'empty',
//                prompt: 'Please enter a username'
//            }]
//        },
//        password: {
//            identifier: 'password',
//            rules: [{
//                type: 'empty',
//                prompt: 'Please enter a password'
//            }, {
//                type: 'minLength[6]',
//                prompt: 'Your password must be at least {ruleValue} characters'
//            }]
//        },
//        terms: {
//            identifier: 'terms',
//            rules: [{
//                type: 'checked',
//                prompt: 'You must agree to the terms and conditions'
//            }]
//        }
//    }
//});

//$('.ui.form6').form({
//    on: 'blur',
//    inline: true,
//    fields: {
//        integer: {
//            identifier: 'integer',
//            rules: [
//                {
//                    type: 'integer[1..100]',
//                    prompt: 'Please enter an integer value'
//                }
//            ]
//        },
//        decimal: {
//            identifier: 'decimal',
//            rules: [
//                {
//                    type: 'decimal',
//                    prompt: 'Please enter a valid decimal'
//                }
//            ]
//        },
//        number: {
//            identifier: 'number',
//            rules: [
//                {
//                    type: 'number',
//                    prompt: 'Please enter a valid number'
//                }
//            ]
//        },
//        emailValidate: {
//            identifier: 'emailValidate',
//            rules: [
//                {
//                    type: 'email',
//                    prompt: 'Please enter a valid e-mail'
//                }
//            ]
//        },
//        url: {
//            identifier: 'url',
//            rules: [
//                {
//                    type: 'url',
//                    prompt: 'Please enter a url'
//                }
//            ]
//        },
//        regex: {
//            identifier: 'regex',
//            rules: [
//                {
//                    type: 'regExp[/^[a-z0-9_-]{4,16}$/]',
//                    prompt: 'Please enter a 4-16 letter username'
//                }
//            ]
//        }
//    }
//})
//    ;

//$('.ui.form7').form({
//    on: 'blur',
//    fields: {
//        card: {
//            identifier: 'card',
//            rules: [
//                {
//                    type: 'creditCard',
//                    prompt: 'Please enter a valid credit card'
//                }
//            ]
//        },
//        exactCard: {
//            identifier: 'exact-card',
//            rules: [
//                {
//                    type: 'creditCard[visa,amex]',
//                    prompt: 'Please enter a visa or amex card'
//                }
//            ]
//        }
//    }
//})
//    ;

//$('.ui.form8').form({
//    on: 'blur',
//    fields: {
//        match: {
//            identifier: 'match2',
//            rules: [
//                {
//                    type: 'match[match1]',
//                    prompt: 'Please put the same value in both fields'
//                }
//            ]
//        },
//        different: {
//            identifier: 'different2',
//            rules: [
//                {
//                    type: 'different[different1]',
//                    prompt: 'Please put different values for each field'
//                }
//            ]
//        }
//    }
//})
//    ;
//$('.ui.form9').form({
//    on: 'blur',
//    fields: {
//        minLength: {
//            identifier: 'minLength',
//            rules: [
//                {
//                    type: 'minLength[100]',
//                    prompt: 'Please enter at least 100 characters'
//                }
//            ]
//        },
//        exactLength: {
//            identifier: 'exactLength',
//            rules: [
//                {
//                    type: 'exactLength[6]',
//                    prompt: 'Please enter exactly 6 characters'
//                }
//            ]
//        },
//        maxLength: {
//            identifier: 'maxLength',
//            rules: [
//                {
//                    type: 'maxLength[100]',
//                    prompt: 'Please enter at most 100 characters'
//                }
//            ]
//        },
//    }
//})
//    ;

//$('.ui.form10').form({
//    on: 'blur',
//    fields: {
//        is: {
//            identifier: 'is',
//            rules: [
//                {
//                    type: 'is[dog]',
//                    prompt: 'Please enter exactly "dog"'
//                }
//            ]
//        },
//        isExactly: {
//            identifier: 'isExactly',
//            rules: [
//                {
//                    type: 'isExactly[dog]',
//                    prompt: 'Please enter exactly "dog"'
//                }
//            ]
//        },
//        not: {
//            identifier: 'not',
//            rules: [
//                {
//                    type: 'not[dog]',
//                    prompt: 'Please enter a value, but not "dog"'
//                }
//            ]
//        },
//        notExactly: {
//            identifier: 'notExactly',
//            rules: [
//                {
//                    type: 'notExactly[dog]',
//                    prompt: 'Please enter a value, but not exactly "dog"'
//                }
//            ]
//        },
//        contains: {
//            identifier: 'contains',
//            rules: [
//                {
//                    type: 'contains[dog]',
//                    prompt: 'Please enter a value containing "dog"'
//                }
//            ]
//        },
//        containsExactly: {
//            identifier: 'containsExactly',
//            rules: [
//                {
//                    type: 'containsExactly[dog]',
//                    prompt: 'Please enter a value containing exactly "dog"'
//                }
//            ]
//        },
//        doesntContain: {
//            identifier: 'doesntContain',
//            rules: [
//                {
//                    type: 'doesntContain[dog]',
//                    prompt: 'Please enter a value not containing "dog"'
//                }
//            ]
//        },
//        doesntContainExactly: {
//            identifier: 'doesntContainExactly',
//            rules: [
//                {
//                    type: 'doesntContainExactly[dog]',
//                    prompt: 'Please enter a value not containing exactly "dog"'
//                }
//            ]
//        }
//    }
//})
//    ;

//$('.ui.form11').form({
//    on: 'blur',
//    fields: {
//        minCount: {
//            identifier: 'minCount',
//            rules: [
//                {
//                    type: 'minCount[2]',
//                    prompt: 'Please select at least 2 values'
//                }
//            ]
//        },
//        maxCount: {
//            identifier: 'maxCount',
//            rules: [
//                {
//                    type: 'maxCount[2]',
//                    prompt: 'Please select a max of 2 values'
//                }
//            ]
//        },
//        exactCount: {
//            identifier: 'exactCount',
//            rules: [
//                {
//                    type: 'exactCount[2]',
//                    prompt: 'Please select 2 values'
//                }
//            ]
//        }
//    }
//});
//$('.ui.form12').form({
//    dog: {
//        identifier: 'dog',
//        rules: [
//            {
//                type: 'empty',
//                prompt: 'You must have a dog to add'
//            },
//            {
//                type: 'contains[fluffy]',
//                prompt: 'I only want you to add fluffy dogs!'
//            },
//            {
//                type: 'not[mean]',
//                prompt: 'Why would you add a mean dog to the list?'
//            }
//        ]
//    }
//});






