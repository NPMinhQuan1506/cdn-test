﻿async function sys_Hightlight (keyword, className) {
    return new Promise((resolve, reject) => {
        setTimeout(
            () => {
                if (keyword != undefined && keyword != '' && keyword.length >= 2) {
                    var options = {
                        "accuracy": {
                            "value": "partially",
                            "limiters": [",", "."]
                        }
                    };
                    $("." + className).unmark({
                        done: function () {
                            $("." + className).mark(keyword, options);
                        }
                    });
                }
            }, 300
        )
    })

}

async function ColorSearchFilterText (keyword, className) {
 
}

async function ColorSearchFilterText_Combo (keyword, className) {
    return new Promise((resolve, reject) => {
        setTimeout(
            () => {
                //if (keyword != undefined && keyword.length > 3) {
                //    var options = {
                //        "accuracy": {
                //            "value": "partially",
                //            "limiters": [",", "."]
                //        }
                //    };
                //    $(className).unmark({
                //        done: function () {
                //            $(className).mark(keyword, options);
                //        }
                //    });
                //}
            }, 1000
        )
    })

}