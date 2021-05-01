const fs = require('fs')
const path = require('path')
const icons = require('@mdi/js')
const { exit } = require('process')

const templateFile = path.join(__dirname, 'component-template')
const outputDir = path.join(__dirname, '../icons')

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir)
}

const template = fs.readFileSync(templateFile, 'utf-8')

//Generate TitleCase name and replace both ||name|| and ||path|| in template

function titleCase(str) {
  return str.charAt(0).toUpperCase() + str.substring(1, str.length)
}

Object.keys(icons).forEach((name) => {
  if (name === 'default' || name === '__esModule') return

  const titleCaseName = titleCase(name)
  fs.writeFile(
    path.join(outputDir, `${titleCaseName}.vue`),
    template
      .replace('||name||', titleCaseName)
      .replace('||path||', icons[name]),
    function () {
      console.log(`${titleCaseName}.vue`)
    }
  )
})
