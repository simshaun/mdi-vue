const eachLimit = require('async/eachLimit')
const fs = require('fs')
const path = require('path')
const template = require('lodash.template')

const inputIconsDir = path.join(__dirname, '../icons-svg-optimized')
const outputIconsDir = path.join(__dirname, '../icons')

const icons = []

eachLimit(fs.readdirSync(inputIconsDir), 100, async (file) => {
  const svgString = await fs.promises.readFile(
    path.join(inputIconsDir, file),
    'utf8'
  )
  const svgWithoutWrapper = svgString.replace(/^<svg[^>]*>|<\/svg>$/g, '')
  const iconName = path.parse(file).name

  icons.push({ name: iconName, svg: svgWithoutWrapper })
}).then(() => {
  //
  // Generate the mega-file!
  //

  const jumboTemplate = template(
    `<% icons.forEach((icon) => { %>export { default as <%- icon.name %> } from './<%- icon.name %>';
<% } ) %>`
  )

  const jumboTypesTemplate = template(
    `interface Component {
  name: string
  props: object
  render: Function
}
<% icons.forEach((icon) => { %>export const <%- icon.name %>: Component\n<% } ) %>`
  )

  if (fs.existsSync(outputIconsDir)) {
    fs.rmSync(outputIconsDir, { recursive: true })
  }
  fs.mkdirSync(outputIconsDir)

  fs.writeFile(
    path.join(outputIconsDir, `index.js`),
    jumboTemplate({ icons }),
    function () {
      console.log('Generated index.js')
    }
  )
  fs.writeFile(
    path.join(outputIconsDir, `index.d.ts`),
    jumboTypesTemplate({ icons }),
    function () {
      console.log('Generated index.d.ts')
    }
  )

  //
  // Generate the thousands of individual files!
  //

  const singleTemplate = template(
    `import createSvgIcon from './utils/createSvgIcon'
export default createSvgIcon(<%= JSON.stringify(icon.name) %>, <%= JSON.stringify(icon.svg) %>)
`
  )

  const singleTypeTemplate = template(
    `import { Component } from './index'
declare const i: Component
export default i
`
  )

  eachLimit(icons, 20, async (icon) => {
    await fs.promises.writeFile(
      path.join(outputIconsDir, `${icon.name}.js`),
      singleTemplate({ icon })
    )
    await fs.promises.writeFile(
      path.join(outputIconsDir, `${icon.name}.d.ts`),
      singleTypeTemplate({ icon })
    )
    console.log(`Generated ${icon.name}.js`)
    console.log(`Generated ${icon.name}.d.ts`)
  })
})
