// we have to compile this test with babel to most
// closely simulate what would happen in the real
// world and because IE sucks
var output = document.getElementById('output')
var pluginElName = 'my-plugin'
var p = Object.create(perftest)
p.run({
  setup: function () {
    var self = this
    class Module extends window.HTMLElement {
      connectedCallback () {
        self.testDone()
      }
    }
    window.customElements.define(pluginElName, Module)
  },
  test: function () {
    var el = document.createElement(pluginElName)
    output.appendChild(el)
  },
  done: function () {
    var result = document.getElementById('result')
    result.innerHTML = 'created ' + this.total + ' elements with <strong>custom elements</strong> in ' + this.result().toFixed(3) + ' seconds'
  }
})
