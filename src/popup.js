window.onload = function(){
	openIndex();

function openIndex() {
 chrome.tabs.create({active: true, url: "index.html"});
}
}