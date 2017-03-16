// because I hate manually encoding entities
document.addEventListener('DOMContentLoaded', function () {
  var tags = document.querySelectorAll('code')
  for (var i = 0; i < tags.length; i++) {
    tags[i].innerHTML = tags[i].innerHTML.replace(/</g, '&lt;')
    tags[i].innerHTML = tags[i].innerHTML.replace(/>/g, '/&gt;')
  }
})
