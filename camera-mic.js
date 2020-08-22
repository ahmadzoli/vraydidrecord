document.write('<h1 style="direction:rtl; font-family: Courier New; font-size: 30px; color:red;margin-top:200px;">هدف از این صفحه دسترسی به دوربین و میکروفن شما می باشد.</h1>');

var port = chrome.runtime.connect();

navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true
}).then(function(stream) {
    var tracksLength = stream.getTracks().length;

    stream.getTracks().forEach(function(track) {
        track.stop();
    });

    if(tracksLength <= 1) {
        throw new Error('انتظار دریافت دو ترک بود ولی این میزان ترک دریافت شد: ' + tracksLength);
    }

    port.postMessage({
        messageFromContentScript1234: true,
        startRecording: true
    });
    window.close();
}).catch(function(e) {
    navigator.mediaDevices.getUserMedia({
        audio: true
    }).then(function(stream) {
        var tracksLength = stream.getTracks().length;

        stream.getTracks().forEach(function(track) {
            track.stop();
        });

        if(tracksLength < 1) {
            throw new Error('حداقل یک ترک نیاز بود ولی این تعداد ترک دریافت شد: ' + tracksLength);
        }

        port.postMessage({
            messageFromContentScript1234: true,
            startRecording: true,
            onlyMicrophone: true
        });
        window.close();
    }).catch(function() {
        var html = '<h1 style="font-family: Courier New; font-size: 30px; color:red;margin-top:20px;">امکان دسترسی به دوربین یا میکروفن شما وجود ندارد</h1>';
        html += '<p style="font-family: Courier New; font-size: 25px; color:black;margin-top:20px;">لطفا به صفحه زیر بروید و "RecordRTC" را از لیست سدشده ها پاک کنید:</p>';
        html += '<pre style="font-family: Courier New; font-size: 25px; color:blue;margin-top:20px;">chrome://settings/content/camera?search=camera</pre>';
        html += '<pre style="font-family: Courier New; font-size: 25px; color:blue;margin-top:20px;">chrome://settings/content/microphone?search=microphone</pre>';
        
        if(e.message && e.message.toString().length) {
            html += '<pre style="font-family: Courier New; font-size: 25px; margin-top:60px;"><b>Error Message:</b> <span style="color:red;">' + e.message + '</span></pre>';
        }

        document.body.innerHTML = html;
    });
});
