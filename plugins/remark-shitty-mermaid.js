import visit from 'unist-util-visit'

const crypto = require('crypto')
const path = require('path')
const execSync = require('child_process').execSync
const os = require('os')
const fs = require('fs-extra')
const which = require('npm-which')(__dirname)
const npp = require('npm-path')
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'mermaidFix'))
/** @type {import('unified').Plugin<[], import('mdast').Root>} */
const shittyMermaid = function () {
  return function transformer (ast, _vFile) {
    visit(ast, 'code', (node, index, parent) => {
      const { lang, value } = node
      const destinationDir = dir

      // If this codeblock is not mermaid, bail.
      if (lang !== 'mermaid') {
        return node
      }

      let svgPath
      try {
        const unique = crypto.createHmac('sha1', 'remark-shitty-mermaid').update(value).digest('hex')
        const mmdcExecutable = which.sync('mmdc', { env: { PATH: npp.PATH } })
        const mmdPath = path.join(destinationDir, `${unique}.mmd`)
        const svgFilename = `${unique}.svg`
        svgPath = path.join(destinationDir, svgFilename)

        // Write temporary file
        fs.outputFileSync(mmdPath, value)

        // Invoke mermaid.cli
        execSync(`${mmdcExecutable} -i ${mmdPath} -o ${svgPath} -t dark`)

        // Clean up temporary file
        fs.removeSync(mmdPath)

        // vFile.info(`${lang} code block replaced with graph`, position, PLUGIN_NAME);
      } catch (error) {
        // console.log(error)
        // vFile.message(error, position, PLUGIN_NAME);
        return node
      }

      const newNode = {
        type: 'html',
        value: fs.readFileSync(svgPath, { encoding: 'utf8' }),
        position: undefined
      }

      parent.children.splice(index, 1, newNode)

      return node
    })
  }
}

module.exports = shittyMermaid
