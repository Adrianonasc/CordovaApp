const PARAMETROS = {
    QTD_REGISTROS : 100,    
}

var db = window.openDatabase(name, version, displayName, estimatedSize);


(function () {
    "use strict";
    document.addEventListener( 'deviceready', onDeviceReady.bind( this ), false );

    function onDeviceReady() {
        
        document.addEventListener( 'pause', onPause.bind( this ), false );
        document.addEventListener( 'resume', onResume.bind( this ), false );
        var parentElement = document.getElementById('deviceready');
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');
        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
    };

    function onPause() {};

    function onResume() { };

    document.getElementById("btnMultMatriz").addEventListener("click", multMatriz);
    document.getElementById("btnInsertWebService").addEventListener("click",webService);
    document.getElementById("btnInsertDB").addEventListener("click", insertdbLocal);

})();

function insertdbLocal() {
    console.log("!1");
}

function webService() {
    console.log("!2");
}

function multMatriz() {
    console.log("!3");
}