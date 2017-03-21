perftest = {
  run: function (options) {
    for (var key in options) {
      this[key] = options[key]
    }
    window.performance.mark(this.eventStart)
    this.state = 'running'
    this.setup()
    for (var i = 0; i < this.total; i++) {
      this.test()
    }
    this.setErrorTimeout() // for async tests
  },
  result: function () {
    if (this.state !== 'done') {
      return NaN
    }
    // wrapping in try/catch for IE :P
    window.performance.measure(this.eventDuration, this.eventStart, this.eventEnd)
    var results = window.performance.getEntriesByType('measure')
    var duration = 0
    for (var i = 0; i < results.length; i++) {
      duration += results[i].duration
    }
    return duration / this.total
  },
  setErrorTimeout: function () {
    var self = this
    this.timer = setTimeout(function () {
      if (self.state !== 'done') {
        throw new Error('Test timed out after ' + Math.round(self.timeout / 1000) + ' seconds')
      }
    }, this.timeout)
  },
  setup: function () {
    // replace this method
  },
  done: function () {
    // replace this method
  },
  test: function () { // replace this method, call testDone when a test is done
    this.testDone()
  },
  testDone: function () {
    this.elapsed++
    if (this.elapsed === this.total) {
      window.performance.mark(this.eventEnd)
      this.state = 'done'
      this.done()
    }
  },
  elapsed: 0,
  eventDuration: 'script-duration',
  eventStart: 'script-start',
  eventEnd: 'script-end',
  timeout: 10000,
  total: 10000,
  state: 'init' // init, running, done
}
