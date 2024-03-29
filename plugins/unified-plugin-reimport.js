module.exports = function (options) {
  async function reimporter (options) {
    const plg = (await import(options.module))
    // console.log(plg)
    return plg.default(this, options.options)
  }
  return reimporter(options)
}
