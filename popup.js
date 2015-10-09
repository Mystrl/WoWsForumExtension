function saveOptions() {
	var enabled = document.getElementById('myonoffswitch').checked;

	chrome.storage.sync.set({
		enabled:enabled
	}, function() {
		var status = document.getElementById('status');
		status.textContent = 'Saved';
		setTimeout(function() {
			status.textContent = ('');
		}, 1500);
	});
}

function restoreOptions() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
  	enabled: true
  }, function(items) {
    document.getElementById('myonoffswitch').checked = items.enabled;
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('myonoffswitch').addEventListener('click', saveOptions);