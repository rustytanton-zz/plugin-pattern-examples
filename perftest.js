var perftest = {
  run (options) {
    Object.assign(this, options)
    window.performance.mark(this.eventStart)
    this.state = 'running'
    this.setup()
    for (var i = 0; i < this.total; i++) {
      this.test()
    }
    this.setErrorTimeout() // for async tests
  },
  result () {
    if (this.state !== 'done') {
      return NaN
    }
    window.performance.measure(this.eventStart, this.eventEnd)
    var results = window.performance.getEntriesByType('measure')
    var duration = 0
    for (var i = 0; i < results.length; i++) {
      duration += results[i].duration
    }
    return duration / this.total
  },
  setErrorTimeout () {
    var self = this
    this.timer = setTimeout(function () {
      if (self.state !== 'done') {
        throw new Error('Test timed out after ' + Math.round(self.timeout / 1000) + ' seconds')
      }
    }, this.timeout)
  },
  setup () {
    // replace this method
  },
  done () {
    // replace this method
  },
  test () { // replace this method, call testDone when a test is done
    this.testDone()
  },
  testDone () {
    this.elapsed++
    if (this.elapsed === this.total) {
      window.performance.mark(this.eventDone)
      this.state = 'done'
      this.done()
    }
  },
  elapsed: 0,
  eventStart: 'script-start',
  eventDone: 'script-done',
  timeout: 10000,
  total: 10000,
  state: 'init' // init, running, done
}