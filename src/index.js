var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

var recognition = new SpeechRecognition();
recognition.interimResults = true;
recognition.maxAlternatives = 1;

var output = document.querySelector('.output');
el1 = document.getElementById('status');
el2 = document.getElementById('language');
el2.textContent = window.navigator.language;
document.body.onclick = function() {
	recognition.start();
}

recognition.onresult = function(event) {
//console.log(window.navigator.language);//works both in Mozilla and chrome
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