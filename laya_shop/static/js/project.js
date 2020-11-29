/* Project specific Javascript goes here. */
function urlBase64ToUint8Array (base64String) {
        var padding = '='.repeat((4 - base64String.length % 4) % 4)
        var base64 = (base64String + padding)
                .replace(/\-/g, '+')
                .replace(/_/g, '/')

        var rawData = window.atob(base64)
        var outputArray = new Uint8Array(rawData.length)

        for (var i = 0; i < rawData.length; ++i) {
                outputArray[i] = rawData.charCodeAt(i)
        }
        return outputArray;
}
function loadVersionBrowser (userAgent) {
        let ua = userAgent
        let tem
        let M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        if (/trident/i.test(M[1])) {
                tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
                return {name: 'IE', version: (tem[1] || '')};
        }
        if (M[1] === 'Chrome') {
                tem = ua.match(/\bOPR\/(\d+)/);
                if (tem != null) {
                        return {name: 'Opera', version: tem[1]};
                }
        }
        M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
        if ((tem = ua.match(/version\/(\d+)/i)) != null) {
                M.splice(1, 1, tem[1]);
        }
        return {
                name: M[0],
                version: M[1]
        };
};
var applicationServerKey = "BLJ7u1uhRIah1L5J3vCJ-p3Lw-wlshF16hdYKI-1d-ZVgWP5GZ0n9Mnz3t6Rz01_ADe-x1LozTYyW5J_O41vuv0";

const getCookie = (name) => {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const requestToServer = (data) => {
    fetch('http://localhost:8000/api/chat-app/device/', {
        method: 'POST',
        headers:{
             "X-CSRFToken": getCookie('csrftoken'),
            'Content-Type':'application/json',
            'Authorication' : 'vapid t=eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJhdWQiOiJodHRwczovL2FuZHJvaWQuZ29vZ2xlYXBpcy5jb20iLCJleHAiOiIxNjA2NzY4NjUyIiwic3ViIjoibWFpbHRvOiByb3NhbmNoZXpAdWFtdi5lZHUubmkifQ.f9Bh97Day1cmDnVnLpDKb-LaSIGtIH7DUaHtIfEG7Rto-6DkjSlluLtX89dWxNkRet2jPgc04qEKWOJqrr6xEA,k=BLJ7u1uhRIah1L5J3vCJ-p3Lw-wlshF16hdYKI-1d-ZVgWP5GZ0n9Mnz3t6Rz01_ADe-x1LozTYyW5J_O41vuv0'
        },
        body: JSON.stringify(data)
    })
}

// In your ready listener
if ('serviceWorker' in navigator) {
        // The service worker has to store in the root of the app
        // http://stackoverflow.com/questions/29874068/navigator-serviceworker-is-never-ready
        var browser = loadVersionBrowser(navigator.userAgent);
        navigator.serviceWorker.register('http://localhost:8000/static/navigatorPush.service.js')
        .then(function (reg) {
                if(reg.active){
                     reg.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: urlBase64ToUint8Array(applicationServerKey)
                }).then(function (sub) {
                        var endpointParts = sub.endpoint.split('/');
                        var registration_id = endpointParts[endpointParts.length - 1];
                        console.log('registration_id',registration_id)
                        var data = {
                                'browser': browser.name.toUpperCase(),
                                'p256dh': btoa(String.fromCharCode.apply(null, new Uint8Array(sub.getKey('p256dh')))),
                                'auth': btoa(String.fromCharCode.apply(null, new Uint8Array(sub.getKey('auth')))),
                                'name': 'Laya Shop',
                                'registration_id': registration_id
                        };
                        // Send request to save device
                        requestToServer(data);
                })
                }
               
        }).catch(function (err) {
                console.log(':^(', err);
        });




// Example navigatorPush.service.js file


}