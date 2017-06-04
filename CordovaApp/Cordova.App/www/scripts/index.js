var TEMPO_INICIO = 0;
var TEMPO_FIM = 0;
var db;
var arrTempoExecucao = new Array();
var arrQuantRegistro = [10, 25, 50, 75, 100, 250, 1000];
var indexQuantidadeRegisto = 0;

(function () {
	"use strict";
	document.addEventListener('deviceready', onDeviceReady.bind(this), false);
	function onDeviceReady() {
		document.addEventListener('pause', onPause.bind(this), false);
		document.addEventListener('resume', onResume.bind(this), false);
		db = window.sqlitePlugin.openDatabase({ name: 'my.db', location: 'default' });
	};
	function onPause() { };
	function onResume() { };
	document.getElementById("btnMultMatriz").addEventListener("click", multMatriz);
	document.getElementById("btnInsertWebService").addEventListener("click", webService);
	document.getElementById("btnInsertDB").addEventListener("click", insertdbLocal);
})();

function insertdbLocal() {
	if (indexQuantidadeRegisto >= arrQuantRegistro.length) {
		indexQuantidadeRegisto = 0;
		arrTempoExecucao = new Array();
	}

	dropTable();
	createTable();
	var i = indexQuantidadeRegisto;
	TEMPO_INICIO = Date.now();
	var usuario;
	var usuarios = [];
	for (var j = 1; j <= arrQuantRegistro[i]; j++) {
		usuario = { Id:0, Nome:'', Idade:0, Foto:null, salario:0 };
		usuario.Id = j;
		usuario.Nome = "Nome " + j;
		usuario.Idade = j;
		usuario.Foto = new ArrayBuffer(16);
		usuario.salario = j * 10;
		usuarios.push(usuario);
	}
	insert(usuarios);
	indexQuantidadeRegisto++;
}

function webService() {
	if (indexQuantidadeRegisto >= arrQuantRegistro.length) {
		indexQuantidadeRegisto = 0;
		arrTempoExecucao = new Array();
	}

	var URI = "http://webapiadrtcc.azurewebsites.net/api/Usuarios/";
	console.log(URI + (arrQuantRegistro[indexQuantidadeRegisto] - 1));
	dropTable();
	createTable();

	TEMPO_INICIO = Date.now();
	$.ajax({
		url: URI + (arrQuantRegistro[indexQuantidadeRegisto] -1),
		type: 'Get',
		contentType: 'application/json',
	}).done(function (data) {
		insert(data);
		document.getElementById("lblText").innerHTML = "Dados Recebido";
		indexQuantidadeRegisto += 1;
	}).fail(function (jqXHR, textStatus, msg) {
		document.getElementById("lblText").innerHTML = textStatus + msg;
	});
}

function dropTable() {
	db.transaction(function (tx) {
		tx.executeSql('DROP TABLE IF EXISTS Usuarios');
	}, function (error) {
		console.log('Transaction ERROR: ' + error.message);
	}, function () {
		console.log('Transaction Tabela Excluida');
	});
}

function createTable() {
	db.transaction(function (tx) {
		tx.executeSql('CREATE TABLE IF NOT EXISTS Usuarios(UsuarioId INTEGER, Nome VARCHAR(100), Idade INTEGER, Foto BLOB,Salario DOUBLE, PRIMARY KEY(UsuarioId))');
	}, function (error) {
		console.log('Transaction ERROR: ' + error.message);
	}, function () {
		console.log('Transaction Tabela Criada');
	});
}

function select() {
	db.transaction(function (tx) {
		tx.executeSql('SELECT count(*) AS qtd FROM Usuarios', [], function (tx, rs) {
			console.log('Quantidade de Registro: ' + rs.rows.item(0).qtd);
		}, function (tx, error) {
			console.log('SELECT error: ' + error.message);
		});
	});
}

function insert(Usuarios) {
	var queryInsert = "INSERT INTO Usuarios(UsuarioId, Nome, Idade, Foto, Salario) VALUES (?,?,?,?,?);";
	db.transaction(function (tx) {
		$(Usuarios).each(function (i) {
			tx.executeSql(queryInsert, [Usuarios[i].Id, Usuarios[i].Nome, Usuarios[i].Idade, Usuarios[i].Foto, Usuarios[i].salario]);
		});
	}, function (error) {
		console.log('Transaction ERROR: ' + error.message);
	}, function () {
		//grava o Tempo no Commit
		TEMPO_FIM = Date.now();
		arrTempoExecucao.push(TEMPO_FIM - TEMPO_INICIO);
		exibeTempo();
		console.log('Populated database OK');
	});
}

function exibeTempo() {
	var str = "[";
	for (var i in arrTempoExecucao) {
		str = str + arrTempoExecucao[i] + ",";
	}
	str = str + "]";
	document.getElementById("lblText").innerHTML = str;

	console.log("Tempo Execução :", (TEMPO_FIM - TEMPO_INICIO), " milliseconds");
}

/*----Teste de Matriz -----*/
const DIMENSAO = {
	LEN: [40, 80, 100, 250, 500, 750, 1000],
}

function multMatriz() {
	document.getElementById("lblText").innerHTML = 'Teste 3 em execução'
	arrTempoExecucao = new Array();

	for (var i in DIMENSAO.LEN) {
		MultiplicarMatriz(DIMENSAO.LEN[i]);
		arrTempoExecucao.push(TEMPO_FIM - TEMPO_INICIO);
	}
	exibeTempo();
	document.getElementById("lblText").innerHTML = 'Teste Finalizado'
}

function MultiplicarMatriz(dimensao) {
	var matriz1 = new Array();
	var matriz2 = new Array();
	var matrizResult = new Array();
	var acumulador;
	var resultTemp;

	TEMPO_INICIO = Date.now();
	
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
	
	TEMPO_FIM = Date.now();
}
