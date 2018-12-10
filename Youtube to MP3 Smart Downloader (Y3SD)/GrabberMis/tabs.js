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

/*
 * Updates local file with the spesific URL given.
 */
function updateLocalFIle(song_url) {
	if (typeof(Storage) !== "undefined") {
		// Code for localStorage/sessionStorage.

		// Increase the counter value by one. Save a new song there.
		row_counter = row_counter + 1
		localStorage.setItem("row_counter", row_counter);
		last_counter_value = localStorage.getItem("row_counter");
		localStorage.setItem("url_".last_counter_value, song_url);
		// Retrieve
		//document.getElementById("result").innerHTML = localStorage.getItem("lastname");
	} else {
			// Sorry! No Web Storage support..
	}
}

function youtube_parser(url){
	var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
	var match = url.match(regExp);
	return (match&&match[7].length==11)? match[7] : false;
}

/**
 * listTabs to switch to
 */
function listTabs() {
	//console.log("Function started.");
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
				//document.body.style.border = "5px solid red";
				//console.log("Youtube link found and sended to server...");
				//tabsList.appendChild(tab.url);
				//sendRequestToServer(tab.url);
				updateLocalFile(tab.url);
				var video_link = youtube_parser(tab.url);

			}
			tabLink.textContent = tab.title || tab.id;
			tabLink.setAttribute('href', tab.id);
			tabLink.classList.add('switch-tabs');
			currentTabs.appendChild(tabLink);
		}
		counter += 1;
    }
	
		//tabsList.appendChild(currentTabs);
		
  });
}

document.addEventListener("DOMContentLoaded", listTabs);

/*
 * Returns a list of the current open tabs in the browser.
 */
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



/*file picker */
/*
Listens for a file being selected, creates a ObjectURL for the chosen file, injects a
content script into the active tab then passes the image URL through a message to the
active tab ID.
*/

// Listen for a file being selected through the file picker
const inputElement = document.getElementById("input");
inputElement.addEventListener("change", handlePicked, false);

// Listen for a file being dropped into the drop zone
const dropbox = document.getElementById("drop_zone");
dropbox.addEventListener("dragenter", dragenter, false);
dropbox.addEventListener("dragover", dragover, false);
dropbox.addEventListener("drop", drop, false);

// Get the image file if it was chosen from the pick list
function handlePicked() {
  displayFile(this.files);
}

// Get the image file if it was dragged into the sidebar drop zone
function drop(e) {
  e.stopPropagation();
  e.preventDefault();
  displayFile(e.dataTransfer.files);
}

/* 
Insert the content script and send the image file ObjectURL to the content script using a 
message.
*/ 
function displayFile(fileList) {
  const imageURL = window.URL.createObjectURL(fileList[0]);

  browser.tabs.executeScript({
    file: "/content_scripts/content.js"
    }).then(messageContent)
      .catch(reportError);

  function messageContent() {
    const gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});
    gettingActiveTab.then((tabs) => {
      browser.tabs.sendMessage(tabs[0].id, {imageURL});
    });
  }

  function reportError(error) {
    console.error(`Could not inject content script: ${error}`);
  }
}

// Ignore the drag enter event - not used in this extension
function dragenter(e) {
  e.stopPropagation();
  e.preventDefault();
}

// Ignore the drag over event - not used in this extension
function dragover(e) {
  e.stopPropagation();
  e.preventDefault();
}