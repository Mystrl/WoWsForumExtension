function getPosterNames() {
	var xPathResult = document.evaluate(
		"//div[@id='ips_Posts']//span[@itemprop='name']",
		document,
		null,
		XPathResult.ORDERED_NODE_ITERATOR_TYPE,
		null);

	var poster_names = [];
	var xPathNode = xPathResult.iterateNext();
	while(xPathNode) {
		poster_names.push(xPathNode.textContent);
		xPathNode =  xPathResult.iterateNext();
	}
	alert(poster_names[0]);
	return poster_names;
}

function getPosterID(posterName) {
	var xPathResult = document.evaluate(
		"//div[@id='ips_Posts']//a[@hovercard-id='" + posterName + "']",
		document,
		null,
		XPathResult.FIRST_ORDERED_NODE_TYPE,
		null);

	var xPathNode = xPathResult.singleNodeValue;
	alert(xPathNode);
}

window.onload = function() {
	var names = getPosterNames();
	getPosterID(names[0]);
};