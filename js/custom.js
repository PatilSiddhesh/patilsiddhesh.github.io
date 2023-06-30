window.onload = function() {
//     if( navigator.userAgent.match(/Android/i)|| navigator.userAgent.match(/iPhone/i)|| navigator.userAgent.match(/iPad/i)|| navigator.userAgent.match(/iPod/i)|| navigator.userAgent.match(/BlackBerry/i)|| navigator.userAgent.match(/Windows Phone/i)) {
//         if(window.location.href != "https://siddroid.com/" && window.location.href != "http://localhost:1313/" && window.location.href != "http://siddroid.com/") {
//         snapTop();
//     }
//  }
};

function snapTop() {
    var containerId = document.getElementById("main-container");
    containerId.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
}

function copyToClipboard(toCopy) {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.value = toCopy
    $temp.val($(element).text()).select();
    document.execCommand("copy");
    $temp.remove();
}

let slideIndex = 0;
showSlides();

function showSlides() {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slideIndex++;
  if (slideIndex > slides.length) {slideIndex = 1}
  slides[slideIndex-1].style.display = "block";
  setTimeout(showSlides, 3000); // Change image every 2 seconds
}
  