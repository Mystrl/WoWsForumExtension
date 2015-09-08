window.onload = function() {
	var xPathResult = document.evaluate(
		"//div[@id='ips_Posts']//span[@itemprop='name']",
		document,
		null,
		XPathResult.ORDERED_NODE_ITERATOR_TYPE,
		null);

	var poster_names = [];
	var xPathNode = xPathResult.iterateNext();
	while(temp) {
		poster_names.push(xPathNode.textContent);
		temp =  xPathResult.iterateNext();
	}
	alert(poster_names[0]);
};