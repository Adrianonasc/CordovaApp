const PARAMETROS = {
    QTD_REGISTROS : 100,    
}

var db;


(function () {
    "use strict";
    document.addEventListener( 'deviceready', onDeviceReady.bind( this ), false );

    function onDeviceReady() {
        db = window.sqlitePlugin.openDatabase({ name: 'my.db', location: 'default' });
        
        document.addEventListener( 'pause', onPause.bind( this ), false );
        document.addEventListener( 'resume', onResume.bind( this ), false );
        //var parentElement = document.getElementById('deviceready');
        //var listeningElement = parentElement.querySelector('.listening');
        //var receivedElement = parentElement.querySelector('.received');
        //listeningElement.setAttribute('style', 'display:none;');
        //receivedElement.setAttribute('style', 'display:block;');

    };

    function onPause() {};

    function onResume() { };

    document.getElementById("btnMultMatriz").addEventListener("click", multMatriz);
    document.getElementById("btnInsertWebService").addEventListener("click",webService);
    document.getElementById("btnInsertDB").addEventListener("click", insertdbLocal);

})();

function insertdbLocal() {
    console.log(db);
    console.log("!1");
}

function webService() {
    console.log("!2");
}

function multMatriz() {
    console.log("!3");
}

var queryInsert = "INSERT INTO Usuario(UsuarioId, Nome, Idade, Foto, Salario, Ativo) VALUES (?,?,?,?,?,?);";

function createDb(){
	db.transaction(function(tx) {
	    tx.executeSql('CREATE TABLE IF NOT EXISTS Usuario(UsuarioId INTEGER, Nome VARCHAR(100), Idade INTEGER, Foto BLOB,Salario DOUBLE, Ativo SMALLINT, PRIMARY KEY(UsuarioId))');
	}, function(error) {
	    console.log('Transaction ERROR: ' + error.message);
	}, function() {
	    console.log('Populated database OK');	
	});	
}

function insert(){
    db.transaction(function(tx) {
        tx.executeSql(queryInsert, [id, nome, idade, foto, salario, ativo]);
    }, function(error) {
        console.log('Transaction ERROR: ' + error.message);
    }, function() {
        console.log('Populated database OK');	
    });	
}
