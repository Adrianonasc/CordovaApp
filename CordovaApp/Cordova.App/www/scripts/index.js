var TEMPO_INICIO = 0;
var TEMPO_FIM = 0;
var db;
var arrTempoExecucaocucao = new Array();

var arrQuantRegistro = [10, 25, 50, 75, 100, 250, 1000];
var indexQuantidadeRegisto = 0;

var queryInsert = "INSERT INTO Usuario(UsuarioId, Nome, Idade, Foto, Salario, Ativo) VALUES (?,?,?,?,?,?);";


(function () {
	"use strict";
	document.addEventListener('deviceready', onDeviceReady.bind(this), false);

	function onDeviceReady() {
		db = window.sqlitePlugin.openDatabase({ name: 'my.db', location: 'default' });

		document.addEventListener('pause', onPause.bind(this), false);
		document.addEventListener('resume', onResume.bind(this), false);
	};

	function onPause() { };

	function onResume() { };

	document.getElementById("btnMultMatriz").addEventListener("click", multMatriz);
	document.getElementById("btnInsertWebService").addEventListener("click", webService);
	document.getElementById("btnInsertDB").addEventListener("click", insertdbLocal);

})();

function insertdbLocal() {
	console.log(db);
	console.log("!1");
}

function webService() {
	var URI = "http://webapiadrtcc.azurewebsites.net/api/Usuarios/";

	console.log(URI + (arrQuantRegistro[indexQuantidadeRegisto] - 1));

	TEMPO_INICIO = performance.now();
	$.ajax({
		url: URI + (arrQuantRegistro[indexQuantidadeRegisto] -1),
		type: 'Get',
		contentType: 'application/json',
	}).done(function (data) {
		TEMPO_FIM = performance.now();
		document.getElementById("lblText").innerHTML = "Dados Recebido";

		arrTempoExecucao.push(TEMPO_FIM - TEMPO_INICIO);
		console.log("Tempo Execução :", (TEMPO_FIM - TEMPO_INICIO), " milliseconds");
		indexQuantidadeRegisto += 1;
	}).fail(function (jqXHR, textStatus, msg) {
		document.getElementById("lblText").innerHTML = textStatus + msg;
	});
}


function createDb() {
	db.transaction(function (tx) {
		tx.executeSql('CREATE TABLE IF NOT EXISTS Usuarios(UsuarioId INTEGER, Nome VARCHAR(100), Idade INTEGER, Foto BLOB,Salario DOUBLE, Ativo SMALLINT, PRIMARY KEY(UsuarioId))');
	}, function (error) {
		console.log('Transaction ERROR: ' + error.message);
	}, function () {
		console.log('Populated database OK');
	});
}

function insert() {
	db.transaction(function (tx) {
		tx.executeSql(queryInsert, [id, nome, idade, foto, salario, ativo]);
	}, function (error) {
		console.log('Transaction ERROR: ' + error.message);
	}, function () {
		console.log('Populated database OK');
	});
}

/*----Teste de Matriz -----*/
const DIMENSAO = {
	LEN: [40, 80, 100, 250, 500, 750, 1000],
}

function multMatriz() {
	document.getElementById("lblText").innerHTML = 'Teste 3 em execução'
	for (var i in DIMENSAO.LEN) {
		MultiplicarMatriz(DIMENSAO.LEN[i]);
		arrTempoExecucao.push(TEMPO_FIM - TEMPO_INICIO);
		console.log("Tempo Execução :", (TEMPO_FIM - TEMPO_INICIO), " milliseconds");
	}
	document.getElementById("lblText").innerHTML = 'Teste Finalizado'
}

function MultiplicarMatriz(dimensao) {
	var matriz1 = new Array();
	var matriz2 = new Array();
	var matrizResult = new Array();
	var acumulador;
	var resultTemp;

	TEMPO_INICIO = performance.now();

	//Cria á matriz e popula 
	for (var i = 0; i < dimensao; i++) {
		matriz1[i] = new Array();
		matriz2[i] = new Array();
		for (var j = 0; j < dimensao; j++) {
			matriz1[i][j] = Math.floor(Math.random() * (1000 - 2 + 1)) + 2;
			matriz2[i][j] = Math.floor(Math.random() * (1000 - 2 + 1)) + 2;
		}
	}

	for (i = 0; i < matriz1.length; i++) {
		acumulador = [];
		for (j = 0; j < matriz2[0].length; j++) {
			resultTemp = 0;
			for (k = 0; k < matriz2.length; k++) {
				resultTemp += matriz1[i][k] * matriz2[k][j];
			}
			acumulador.push(resultTemp);
		}
		matrizResult.push(acumulador);
	}

	TEMPO_FIM = performance.now();
}
