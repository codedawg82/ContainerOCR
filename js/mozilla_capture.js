(function () {
    var takePicture = document.querySelector("#take-picture"),
        showPicture = document.querySelector("#show-picture");

    if (takePicture && showPicture) {
        // Set events
        takePicture.onchange = function (event) {
            // Get a reference to the taken picture or chosen file
            var files = event.target.files,
                file;
            if (files && files.length > 0) {
                file = files[0];
                try {

                    // Get window.URL object
                    var URL = window.URL || window.webkitURL;

                    // Create ObjectURL
                    var imgURL = URL.createObjectURL(file);

                    // Set img src to ObjectURL
                    showPicture.src = imgURL;

                    // Revoke ObjectURL after imagehas loaded
                    showPicture.onload = function () {
                        URL.revokeObjectURL(imgURL);
                    };

                    // Send file to ComputerVision
                    var http = new XMLHttpRequest();
                    var urlVision = "https://api.projectoxford.ai/vision/v1.0/ocr?language=en&detectOrientation=true";
                    //var contentType = "multipart/form-data";
                    var contentType = "application/octet-stream";
                    var apikey = "c43bf3b1fd0e413cbea48f33b693cf0f";

                    var fd = new FormData();
                    fd.append("myimg", file);


                    http.open("POST", urlVision, true);
                    http.setRequestHeader('Content-Type', contentType);
                    http.setRequestHeader('Ocp-Apim-Subscription-Key', apikey);

                    http.onreadystatechange = function () {
                        //Call a function when the state changes.
                        if (http.readyState == 4 && http.status == 200) {
                            //alert(http.responseText);
                            var ocr_text = document.querySelector("#ocr_text");
                            ocr_text.innerHTML = http.responseText;
                        }
                        //else {
                        //    var ocr_text = document.querySelector("#ocr_text");
                        //    ocr_text.innerHTML = http.responseText;
                        //}
                    }

                    http.send(file);

                }
                catch (e) {
                    try {
                        // Fallback if createObjectURL is not supported
                        var fileReader = new FileReader();
                        fileReader.onload = function (event) {
                            showPicture.src = event.target.result;
                        };
                        fileReader.readAsDataURL(file);
                    }
                    catch (e) {
                        // Display error message
                        var error = document.querySelector("#error");
                        if (error) {
                            error.innerHTML = "Neither createObjectURL or FileReader are supported";
                        }
                    }
                }
            }
        };
    }
})();