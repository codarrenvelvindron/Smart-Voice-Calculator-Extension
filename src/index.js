var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

var recognition = new SpeechRecognition();
recognition.interimResults = false;
recognition.maxAlternatives = 1;

function languageOverride(){
	if (this.value != 0){
		recognition.lang =  this.value;
}
}
var languageList = ["ar", "am", "bg", "bn", "ca", "cs", "da", "de", "el", "en", "en_GB", "en_US", "es", "es_419", "et", "fa", "fi", "fil", "fr", "gu", "he", "hi", "hr", "hu", "id", "it", "ja", "kn", "ko", "lt", "lv", "ml", "mr", "ms", "nl", "no", "pl", "pt_BR", "pt-PT", "ro", "ru", "sk", "sl", "sr", "sv", "sw", "ta", "te", "th", "tr", "uk", "vi", "zh_CN", "zh_TW"];
var output = document.getElementById('output');
var el1 = document.querySelector('.status');
var el2 = document.querySelector('.language');
el2.textContent = window.navigator.language;
el3 = document.getElementById('confidence');
var el4 = document.getElementById('dLanguages');
for(var i = 0; i < languageList.length; i++){
	var langs = document.createElement('option');
	langs.textContent = languageList[i];
	langs.value = languageList[i];
	el4.appendChild(langs);
}

var el5 = document.getElementById('tempresults');
var el6 = document.getElementById('approxim');
var el7 = document.getElementById('muted');
var el8 = document.getElementById('calcbackground');
var el9 = document.getElementById('tinstructions');
var el10 = document.getElementById('instructions');
var el11 = document.getElementById('tinst');
var el12 = document.getElementById('adv');
var el13 = document.getElementById('tadv');
var el14 = document.getElementById('tlanguageoverride');
var el15 = document.getElementById('ttempresults');
var el16 = document.getElementById('tmuted');
var el17 = document.getElementById('tapproxim');

function interrimcheck() {
	if (el5.checked == true){
		recognition.stop();		
		recognition.interimResults = true;
}
	else {
		recognition.stop();		
		recognition.interimResults = false;
}
}

el8.onclick = function() {
	recognition.start();
}

el9.onclick = function() {
	if (el9.hidden == false) {
		el9.hidden = true;
		el10.hidden =false;
		el11.hidden =false;
		instructions.checked = false;
	}
	else { el9.hidden = false;}
}

function showinst(){
	if (instructions.checked == true){
		el10.hidden = true;
		el11.hidden = true;
		el9.hidden = false;
		}
}

function showadv(){
	if (adv.checked == true){
		el4.hidden = false;
		el5.hidden = false;
		el5.hidden = false;		
		el6.hidden = false;
		el7.hidden = false;		
		el14.hidden = false;
		el15.hidden = false;
		el16.hidden = false;
		el17.hidden = false;
		}
	else {
		el4.hidden = true;
		el5.hidden = true;
		el5.hidden = true;		
		el6.hidden = true;
		el7.hidden = true;		
		el14.hidden = true;
		el15.hidden = true;
		el16.hidden = true;
		el17.hidden = true;
		}	
}
recognition.onresult = function(event) {
	var last = event.results.length - 1;
	var number = event.results[last][0].transcript;
	num = number.toString();
	var x = num.replace(/plus/g,"+").replace(/minus/g,"-").replace(/x/g,"*").replace(/X/g,"*").replace(/divide/g,"/").replace(/d/g,"").replace(/ by/g,"");
	x = x.replace(/to the /g,"").replace(/ of/g,"").replace(/power/g, "^").replace(/puissance/g, "^");
	var res = x.trim();
	res = res.toString();
	res = res.split(" ");

	//var charpattern = new RegExp(/[\d\(\)\+\-\*\/\.]/);
	var charpattern = new RegExp(/^[0-9\(\)\+\-\*\./\"]/);
	//console.log(charpattern.test(res));
	if (charpattern.test(x)){
	var div='/';
	var add='+';
	var sub='-';
	var mul='*';
    var po='^';
		
	function getAllIndexes(arr, ope) {
    var indexes = [], i;
    for(i = 0; i < arr.length; i++)
        if (arr[i] === ope)
            indexes.push(i);
    return indexes;
	}
	function powerof(arr){
		var index = getAllIndexes(res,po);
		index.forEach(function (v, i){
			res[index[i]+1] = Math.pow(res[index[i]-1],res[index[i]+1]);		
		});
		cleanup(index);
	}
		
	function divisor(arr){
		var index = getAllIndexes(res,div);
		index.forEach(function (v, i){
			res[index[i]+1] = res[index[i]-1] / res[index[i]+1];		
		});
		cleanup(index);
	}
	function multiplier(arr){
		var index = getAllIndexes(res,mul);
		index.forEach(function (v, i){
			res[index[i]+1] = res[index[i]-1] * res[index[i]+1];
		});
		cleanup(index);
	}
	function adder(arr){
		var index = getAllIndexes(res,add);
		index.forEach(function (v, i){
		res[index[i]+1] = +res[index[i]-1] + +res[index[i]+1];
		});
		cleanup(index);
	}
	function subtracker(arr){
		var index = getAllIndexes(res,sub);
		index.forEach(function (v, i){
		res[index[i]+1] = res[index[i]-1] - res[index[i]+1];
		});
		cleanup(index);
	}
	function cleanup(ind){
		ind = ind.reverse();
		ind.forEach(function (v, i){
		var value = 0;
		value = v;
		var value2 = 0;
		value2 = v-1;
		var oldope = value;
		if (oldope > -1){res.splice(oldope, 1); }
		var old = value2;	
		if (old > -1){res.splice(old, 1); }

		});
	}
	powerof(res);	
	divisor(res);
	multiplier(res);
	subtracker(res);
	adder(res);
	displayresults();
	if (muted.checked == true){
		recognition.stop();}
	else {
		speakresults();
	}

	function displayresults(){
	var res2 = res[0];
	var n = Number.isInteger(res2);
	if (el6.checked == true){
		if (n){
			res2 = res2;
		}
		else {
		var decimalplaces =  2;
		res2 = parseFloat(Math.round(res2 * 100) / 100).toFixed(decimalplaces);}
		}
		var resultfinal = x+' = '+res2;
	resultfinal = resultfinal.replace(/\*/g," x")	
	var li = document.createElement("li");
	while (output.children.length > 4){
		output.removeChild(output.firstChild);
	}
	li.appendChild(document.createTextNode(resultfinal));
	output.appendChild(li);
	confidenceLevels = (event.results[0][0].confidence * 100);
	el3.textContent = confidenceLevels.toFixed(0) + "%";
	}
	}
	else { var resultfinal = "letters detected, please try again";
			output.textContent = resultfinal;		 
		 }
	function speakresults(){
		var message = new SpeechSynthesisUtterance();
		var allvoices = window.speechSynthesis.getVoices();
		message.allvoices = allvoices[9];
		message.voiceURI = 'native';
		message.volume = 1;
		message.rate = 1; 
		message.pitch = 0;
	var res2 = res[0];
	var n = Number.isInteger(res2);
	if (el6.checked == true){
		if (n){
			res2 = res2;
		}
		else {
		var decimalplaces =  2;
		res2 = parseFloat(Math.round(res2 * 100) / 100).toFixed(decimalplaces);}
		}
		var resultfinal = x+' = '+res2;
		resultfinal = resultfinal.replace(/\*/g," x")	
		message.text = resultfinal;
		message.lang = recognition.lang;
	speechSynthesis.speak(message);
	}
	
}
function muter(){
	if (el7.checked == true){
		speechSynthesis.cancel();
}
}

recognition.onstart = function() {
  el1.textContent ="Listening...";	
  recognition.stop();
}

recognition.onspeechend = function() {
  el1.style.backgroundColor="#00FFFF";
  el1.textContent ="Done!";
  
  recognition.stop();
}

recognition.onnomatch = function(event) {
  el1.textContent = "Number not recognized";
}

recognition.onerror = function(event) {
  el1.textContent = 'Error occured:' + event.error;
}

document.getElementById("dLanguages").addEventListener("change",languageOverride);
el5.addEventListener("change",interrimcheck);
el10.addEventListener("change",showinst);
el12.addEventListener("change",showadv);
el7.addEventListener("change",muter);