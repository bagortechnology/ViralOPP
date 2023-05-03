//Load the Google Tag Manager Asynchronously
(function(){
    var script = document.createElement('script');
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-HS1M1LTXEE';
    script.async = true;
    document.head.appendChild(script);
})();

//Initialize the gtag and Data Layer function
window.dataLayer = window.dataLayer || [];
function gtag() {dataLayer.push(arguments)};

//set up the gtag config
gtag('js', new Date());
gtag('config','G-HS1M1LTXEE');