// Initialize Bootstrap tooltips
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
});

// Show/hide input fields based on select dropdown value
document.getElementById('usageType').addEventListener("change", function(event) {
  var value = event.target.value;
  document.getElementById('kwhAmountContainer').style.display = (value === 'kwh') ? 'flex' : 'none';
  document.getElementById('unknownContainer').style.display = (value === 'unknown') ? 'flex' : 'none';
});
