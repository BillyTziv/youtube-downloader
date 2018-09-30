const ZOOM_INCREMENT = 0.2;
const MAX_ZOOM = 3;
const MIN_ZOOM = 0.3;
const DEFAULT_ZOOM = 1;

function updateFolderName() {
	alert("asdasd");
	var fName = document.getElementByTagName('folderName');

	selectedFolder.textContent = fname;
}

function sendRequestToServer(ylink) {
	var xhr = new XMLHttpRequest();
		xhr.open('PUT', 'http://localhost:8090', true);

		xhr.onload = function () {
		  // Request finished. Do processing here.
		};

		xhr.send('hello.txt');
}

/**
 * listTabs to switch to
 */
function listTabs() {
	console.log("Function started.");
	getCurrentWindowTabs().then((tabs) => {
    let tabsList = document.getElementById('tabs-list');
    let currentTabs = document.createDocumentFragment();
    let limit = 5;
    let counter = 0;

    tabsList.textContent = '';

    for (let tab of tabs) {
		if (!tab.active && counter <= limit) {
			let tabLink = document.createElement('a');
			// Check if the tab is the youtube
			
			if(tab.title.includes("YouTube") == true) {
				document.body.style.border = "5px solid red";
				//console.log("Youtube link found and sended to server...");
				sendRequestToServer(tab.url);
			}
			tabLink.textContent = tab.title || tab.id;
			tabLink.setAttribute('href', tab.id);
			tabLink.classList.add('switch-tabs');
			currentTabs.appendChild(tabLink);
		}
		counter += 1;
    }
	
    tabsList.appendChild(currentTabs);
  });
}

document.addEventListener("DOMContentLoaded", listTabs);

function getCurrentWindowTabs() {
	return browser.tabs.query({currentWindow: true});
}

document.addEventListener("click", (e) => {
	function callOnActiveTab(callback) {
		getCurrentWindowTabs().then((tabs) => {
		  for (var tab of tabs) {
			if (tab.active) {
			  callback(tab, tabs);
			}
		  }
		});
	}
	e.preventDefault();
});

