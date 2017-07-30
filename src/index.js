var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

var recognition = new SpeechRecognition();
recognition.interimResults = true;
recognition.maxAlternatives = 1;

function languageOverride(){
	if (this.value != 0){
		recognition.lang =  this.value;
}
}

console.log(recognition.lang);
var languageList = ["ar", "am", "bg", "bn", "ca", "cs", "da", "de", "el", "en", "en_GB", "en_US", "es", "es_419", "et", "fa", "fi", "fil", "fr", "gu", "he", "hi", "hr", "hu", "id", "it", "ja", "kn", "ko", "lt", "lv", "ml", "mr", "ms", "nl", "no", "pl", "pt_BR", "pt-PT", "ro", "ru", "sk", "sl", "sr", "sv", "sw", "ta", "te", "th", "tr", "uk", "vi", "zh_CN", "zh_TW"];
var output = document.querySelector('.output');
var el1 = document.querySelector('.status');
var el2 = document.querySelector('.language');
el2.textContent = window.navigator.language;
el3 = document.getElementById('confidence');
el4 = document.getElementById('dLanguages');
for(var i = 0; i < languageList.length; i++){
	var langs = document.createElement('option');
	langs.textContent = languageList[i];
	langs.value = languageList[i];
	el4.appendChild(langs);
}
el5 = document.getElementById('tempresults');

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

document.body.onclick = function() {
	recognition.start();
}

recognition.onresult = function(event) {
	var last = event.results.length - 1;
	var number = event.results[last][0].transcript;
	num = number.toString();
	var x = num.replace("plus","+").replace("minus","-").replace("x","*").replace("X","*").replace("divide","/").replace("d","").replace(" by","");
	var res = x.trim();
	res = res.toString();
	res = res.split(" ");
	
	var div='/';
	var add='+';
	var sub='-';
	var mul='*';

	function getAllIndexes(arr, ope) {
    var indexes = [], i;
    for(i = 0; i < arr.length; i++)
        if (arr[i] === ope)
            indexes.push(i);
    return indexes;
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
	divisor(res);
	multiplier(res);
	adder(res);
	subtracker(res);
	output.textContent = x+'='+res;
	confidenceLevels = (event.results[0][0].confidence * 100);
	el3.textContent = confidenceLevels.toFixed(0) + "%";
	}

recognition.onstart = function() {
  el1.textContent ="Listening...";	
  recognition.stop();
}

recognition.onspeechend = function() {
  el1.style.backgroundColor="#03BC03";
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
document.getElementById("tempresults").addEventListener("change",interrimcheck);