/*
 * stores the dom elements represeting forum posts in an 2d array along with the posters name and id
 * [ [dom element, name, id], [...], [...]]
 *
 */
function getPosts() {
	var xPathResult = document.evaluate(
		//all posts are div elements in a container with id = ips_posts
		"//div[@id='ips_Posts']/div",
		document,
		null,
		XPathResult.ORDERED_NODE_ITERATOR_TYPE,
		null);

	var posts = [];
	var xPathNode = xPathResult.iterateNext();
	while (xPathNode) {
		//push the dom element as an array so we can associate it with the posters name and id
		posts.push([xPathNode]);
		xPathNode = xPathResult.iterateNext();
	}
	
	//iterate over all the posts and find the name and ids of the posters then store them in the array
	for (var i = 0; i < posts.length; i++) {
		var id = getPosterID(posts[i][0]);
		posts[i].push(id);
		modifyPost(posts[i][0], posts[i][1]);
	}
}

/*
 * searches through the post for the href containing a link to the user profile then uses a
 * regualr expression to extract the user id
 *
 * @param {DOM node} post - dom node containing one post in the thread
 */
 function getPosterID(post) {
 	var id;
 	var xPathResult = document.evaluate(
 		"./div/div/div/ul/li/a",
 		post,
 		null,
 		XPathResult.FIRST_ORDERED_NODE_TYPE,
 		null);

 	var xPathNode = xPathResult.singleNodeValue;

 	var urlString = xPathNode.href;

	//url is in the form of http://forum.worldofwarships.com/index.php?/user/{username}-{userid}/
	//example http://forum.worldofwarships.com/index.php?/user/mystrl-1013356250/
	//regex looks for a 10 digit group in the url
	var id = urlString.match(/\d{10}/)

	//.match returns an arrary. since we only have 1 match we just take the first element of the array and return it as a string
	return id[0];
}

/*
 * makes an api call to the wargaming api to get data for the specified userid
 * returns the data as a json object
 * 
 * @param {string} userid - userid of the poster
 *
 * returns data for the specified userID as a json
 */
function getUserData(userid) {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "https://api.worldofwarships.com/wows/account/info/?application_id=ed959007246c32a0db3ba867fe835468&extra=statistics.pvp_solo&account_id=" + userid, true);
	xhr.send();

	var json;
	if(xhr.status === 200) {
		json = JSON.parse(xhr.responseText);
	}
	else {
		//handle errors at some point
		alert("error");
	}

	return json;
}

/*
 * modifies a single post in the forum thread
 * 
 * @param {DOM node} post - dom node containing one post in the thread
 * @param {string} userid - userid of the poster
 *
 */
function modifyPost(post, userid) {
	var userInfo = accessCache(userid);

	if (userInfo.data[userid] === null) {
		addListElement(post, "This user has not played any battles");
		return;
	}
	var battlesPVP = userInfo.data[userid].statistics.pvp.battles;
	var winsPVP = userInfo.data[userid].statistics.pvp.wins;

	var battlesPVPSOLO = userInfo.data[userid].statistics.pvp_solo.battles;
	var winsPVPSOLO = userInfo.data[userid].statistics.pvp_solo.wins;

	addListElement(post, "Battles:" + battlesPVP);

	//pvp win rate including divisions
	var winratePVP = winsPVP/battlesPVP;
	winratePVP = winratePVP.toFixed(2);
	addListElement(post, "Win Rate (pvp):" + winratePVP);

	//pvp win rate solo only
	var winratePVPSOLO = winsPVPSOLO/battlesPVPSOLO;
	winratePVPSOLO = winratePVPSOLO.toFixed(2);
	addListElement(post, "Win Rate (solo only):" + winratePVPSOLO);
}

/*
 * caches user data to reduces the number of api calls and loadtime
 *
 * @param {string} userid - userid of the poster
 *
 * returns the part of the json object containing the user data (removes timestamp field)
 */
function accessCache(userid) {
	var userInfoString = localStorage.getItem(userid);
	if (userInfoString !== null) {
		var userInfo = JSON.parse(userInfoString);

		var timestamp = userInfo.timestamp;
		userInfo = userInfo.value;
	}
	else {
		var userInfo = getUserData(userid);
		var storageObject = {value: userInfo, timestamp: new Date().getTime()}
		localStorage.setItem(userid, JSON.stringify(storageObject));
	}

	return userInfo;
}

/*
 * adds a string to the list underneath the profile picture. used to display data on the user in the browser
 *
 * @param {DOM node} post - dom node containing one post in the thread
 * @param {string} string - specific string to be added. set in modifyPost
 *
 */
function addListElement(post, string) {
	//dom node containing details on the poster (member group, posts etc) that was will add info to
	var xPathResult = document.evaluate(
 		"./div//div[@class='user_details']",
 		post,
 		null,
 		XPathResult.FIRST_ORDERED_NODE_TYPE,
 		null);

	var ul = xPathResult.singleNodeValue;
	var li = document.createElement("li");
	li.appendChild(document.createTextNode(string));
	ul.appendChild(li);
}

function init() {
	getPosts();
}

$('document').ready( function(event) {
	init();
});

/*
window.onload = function() {
		getPosts()
};
*.

/*
 * checks if the user is logged in by looking to see if the reply button is enabled in the forum thread
 * alerts the user if they are not logged in
 *
 */

 /*
  * no longer needed. keep just incase we need it in the future`
  *
function checkLoggedIn() {
	var xPathResult = document.evaluate(
 		"//div[@class='topic_controls']/ul/li",
 		document,
 		null,
 		XPathResult.FIRST_ORDERED_NODE_TYPE,
 		null);
 	var xPathNode = xPathResult.singleNodeValue;

 	var result = xPathNode.getAttribute("class");
 	console.log(result);

 	if (result === "disabled") {
 		alert("this extension currently only works if you're logged in")
 		return false;
 	}
 	else
 		return true;
}

*/