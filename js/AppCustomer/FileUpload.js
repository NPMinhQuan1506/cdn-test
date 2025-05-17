var bytesToMegaBytes = bytes => (bytes / (1024 ** 2)).toFixed(3);
var fileUpload_oldFile;
function UploadImage({ inputFile, btnInput, avatar, condition, success, error }) {
    let IFile = $("#" + inputFile);
    let BFile = $("#" + btnInput);
    let AView = $("#" + avatar);
    fileUpload_oldFile = null;
    let ExtFormatDF = ['jpg', 'png', 'svg', 'webp', 'jpeg', 'heif', 'heic'];
    if (!condition) condition = {};
    if (!condition || (typeof condition === 'object' && Object.entries(condition).length != 0 && !condition?.format)) { 
        condition.format = ExtFormatDF;
    }
    
    if (BFile && BFile.length != 0) {
        BFile.unbind('click').on("click", function (event) {
            if (IFile && IFile.length != 0) IFile.trigger("click");
        })
    }

    if (IFile && IFile.length != 0) {
        IFile.unbind('change').on("change", function (e) {
            if (!this.files.length) {
                //notiWarning(`Chưa Chọn Hình Ảnh`);
            } else {
                if (this.files.length == 1) {
                    let errorMsgs = [];
                    let originalFile = this.files[0];
                    let file = sys_cleanFile(originalFile);
                    //let file = this.files[0];
                    let imgFile = new Image();
                    imgFile.src = window.URL.createObjectURL(file);
                    imgFile.onload = function () {
                        let isComplete = 1;
                        if (typeof condition === 'object' && Object.entries(condition).length != 0) {
                            let height = imgFile.naturalHeight;
                            let width = imgFile.naturalWidth; 
                            let _ratio = width != 0 && height != 0 ? calculateAspectRatio(width,height) : '';

                            for ([key, value] of Object.entries(condition)) {
                                if (key === 'size' && value != 0) {
                                    if (file.size > value) {
                                        errorMsgs.push(Outlang['Kich_thuoc_hinh_anh_phai_be_hon'] + ` ${bytesToMegaBytes(value)}MB`);
                                        isComplete = 0;
                                    }
                                }
                               
                                if (key === 'format') {
                                    let isCompleteFormat = 0;
                                    let fileExt = file.name.split('.').pop().toLocaleLowerCase();
                                    if (typeof value === 'string' && value != '') {
                                        isCompleteFormat = 1;
                                        if (!fileExt == value) {
                                            errorMsgs.push(Outlang['Hinh_anh_chua_dung_dinh_dang'] + ` ${value}`);
                                            isComplete = 0;
                                        }
                                    }
                                    else if (typeof value === 'object' && value.length != 0) {
                                        value.forEach((item) => {
                                            if (fileExt == item) {
                                                isCompleteFormat = 1;
                                            }
                                        })
                                    }
                                    else isCompleteFormat = 1;

                                    if (isCompleteFormat == 0) {
                                        errorMsgs.push(Outlang['Hinh_anh_chua_dung_dinh_dang'] + ` ${value}`);
                                        isComplete = 0;
                                    }
                                }
                                if (key === "height" && value > 0) {
                                    if (value != height) {
                                        isComplete = 0;
                                        errorMsgs.push(Outlang['Chieu_cao_hinh_anh_phai_bang'] + ` ${value}px`);
                                    }
                                }
                                if (key === "width" && value > 0) { 
                                    if (value != width) {
                                        isComplete = 0;
                                        errorMsgs.push(Outlang['Chieu_rong_hinh_anh_phai_bang'] + ` ${value}px`);
                                    }
                                }
                                if (key === "minheight" && value > 0) { 
                                    if (value > height) {
                                        isComplete = 0;
                                        errorMsgs.push((Outlang['Chieu_cao_hinh_anh_toi_thieu'] ?? "Chiều cao tối thiểu") + ` ${value}px`);
                                    }
                                }
                                if (key === "minwidth" && value > 0) { 
                                    if (value > width) {
                                        isComplete = 0;
                                        errorMsgs.push((Outlang['Chieu_rong_hinh_anh_toi_thieu'] ?? "Chiều rộng tối thiểu") + ` ${value}px`);
                                    }
                                }
                                if (key === "maxheight" && value > 0) { 
                                    if (value < height) {
                                        isComplete = 0;
                                        errorMsgs.push((Outlang['Chieu_cao_hinh_anh_toi_da'] ?? "Chiều cao hình ảnh tối đa") + ` ${value}px`);
                                    }
                                }
                                if (key === "maxwidth" && value > 0) { 
                                    if (value < width) {
                                        isComplete = 0;
                                        errorMsgs.push((Outlang['Chieu_rong_hinh_anh_toi_da'] ?? "Chiều rộng hình ảnh tối đa")+ ` ${value}px`);
                                    }
                                }
                                if (key === "ratio" && value != '') {
                                    if (_ratio != value) {
                                        isComplete = 0;
                                        errorMsgs.push((Outlang['Ty_le_khung_hinh'] ?? "Tỷ lệ khung hình")+ ` ${value}`);
                                    }
                                }
                            }
                        }
                        if (isComplete == 1) {
                            if (AView && AView.length != 0) {
                                AView.attr('src', imgFile.src).load(function () {
                                    URL.revokeObjectURL(this.src);
                                });
                            }
                            fileUpload_oldFile = file;
                            if (typeof success === 'function') success(file);
                        }
                        else {
                            let errorMsg = errorMsgs != []
                                ? (errorMsgs).reduce((previous, current) => {
                                    return previous + "<br>" + current
                                })
                                : "";
                            notiWarning(errorMsg);
                            if (fileUpload_oldFile != null) {
                                if (AView && AView.length != 0) {
                                    let tempImgFile = new Image();
                                    tempImgFile.src = window.URL.createObjectURL(fileUpload_oldFile);
                                    AView.attr('src', tempImgFile.src).load(function () {
                                        URL.revokeObjectURL(tempImgFile.src);
                                    });
                                }
                                const dataTransfer = new DataTransfer();
                                dataTransfer.items.add(fileUpload_oldFile);
                                document.getElementById(`${inputFile}`).files = dataTransfer.files;
                            }
                            else {
                                e.target.value = null;
                            }                           
                            if (typeof error === 'function') error();
                        }
                    }
                }
                else {
                    notiWarning(Outlang['Chi_chon_mot_hinh_anh']);
                }
            }
        })
    }
}

 function calculateAspectRatio(width, height, tolerance = 0.05) {
    // Kiểm tra đầu vào
    if (typeof width !== 'number' || typeof height !== 'number' || width <= 0 || height <= 0) {
        return "";
    }
     
    function gcd(a, b) {
        return b === 0 ? a : gcd(b, a % b);
    }
     
    let gcdValue = gcd(width, height);
    let simpleWidth = width / gcdValue;
    let simpleHeight = height / gcdValue; 
    let ratio = simpleWidth / simpleHeight;

    if (Math.abs(ratio - 1) <= tolerance) {
        return "1:1";
    } else {
        return `${simpleWidth}:${simpleHeight}`;
    }
}

function UploadImage_Validate({ src, condition, success, error }) {
    try {
        let errorMsgs = [];
        let imgFile = new Image();
        imgFile.src = src;
        imgFile.onload = function (event) {
            let isComplete = 1;
            if (typeof condition === 'object' && Object.entries(condition).length != 0) {
                for ([key, value] of Object.entries(condition)) {
                    if (key === 'size' && value != 0) {
                        if (event.size > value) {
                            errorMsgs.push(Outlang['Kich_thuoc_hinh_anh_phai_be_hon'] + `${bytesToMegaBytes(value)}MB`);
                            isComplete = 0;
                        }
                    }
                    if (key === 'format') {
                        let isCompleteFormat = 0;
                        let fileExt = src.split('.').pop().toLocaleLowerCase();
                        if (typeof value === 'string' && value != '') {
                            isCompleteFormat = 1;
                            if (!fileExt == value) {
                                errorMsgs.push(Outlang['Hinh_anh_chua_dung_dinh_dang'] + value);
                                isComplete = 0;
                            }
                        }
                        else if (typeof value === 'object' && value.length != 0) {
                            value.forEach((item) => {
                                if (fileExt == item) {
                                    isCompleteFormat = 1;
                                }
                            })
                        }
                        else isCompleteFormat = 1;

                        if (isCompleteFormat == 0) {
                            errorMsgs.push(Outlang['Hinh_anh_chua_dung_dinh_dang'] + value);
                            isComplete = 0;
                        }
                    }
                    if (key === "height" && value > 0) {
                        let height = imgFile.naturalHeight;
                        if (value != height) {
                            isComplete = 0;
                            errorMsgs.push(Outlang['Chieu_cao_hinh_anh_phai_bang'] + `${value}px`);
                        }
                    }
                    if (key === "width" && value > 0) {
                        let width = imgFile.naturalWidth;
                        if (value != width) {
                            isComplete = 0;
                            errorMsgs.push(Outlang['Chieu_rong_hinh_anh_phai_bang'] + `${value}px`);
                        }
                    }
                }
            } 
            if (isComplete == 1) {
                if (typeof success === 'function') success();
            }
            else {
                let errorMsg = errorMsgs != []
                    ? (errorMsgs).reduce((previous, current) => {
                        return previous + "<br>" + current
                    })
                    : "";
                notiWarning(errorMsg);
                if (typeof error === 'function') error();
            }
        }
    }
    catch (ex) {
        if (typeof error === 'function') error();
    }
}