window.onload = function() {
	var els = document.getElementsByTagName('span'), i = 0, price;

	for(i; i < els.length; i++) {
	    prop = els[i].getAttribute('itemprop');
	    if(prop)
	    	alert(els[i].firstChild.innerHTML;)

    if(prop) {
        alert(prop);
        break;
    }
}
};