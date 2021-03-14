window.onload = function() {
    if( navigator.userAgent.match(/Android/i)|| navigator.userAgent.match(/iPhone/i)|| navigator.userAgent.match(/iPad/i)|| navigator.userAgent.match(/iPod/i)|| navigator.userAgent.match(/BlackBerry/i)|| navigator.userAgent.match(/Windows Phone/i)) {
        if(window.location.href != "https://siddroid.com/" && window.location.href != "http://localhost:1313/" && window.location.href != "http://siddroid.com/") {
        snapTop();
    }
 }
};

function snapTop() {
    var containerId = document.getElementById("main-container");
    containerId.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
}