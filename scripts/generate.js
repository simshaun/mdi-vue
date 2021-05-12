const eachLimit = require('async/eachLimit')
const fs = require('fs')
const path = require('path')
const template = require('lodash.template')

const inputIconsDir = path.join(__dirname, '../icons-svg-optimized')
const outputIconsDir = path.join(__dirname, '../icons')

const props = `{ title: { type: String, required: false, default: '' } }`
const icons = []

eachLimit(fs.readdirSync(inputIconsDir), 100, async (file) => {
  const svgString = await fs.promises.readFile(
    path.join(inputIconsDir, file),
    'utf8'
  )
  const svgWithoutWrapper = svgString.replace(/^<svg[^>]*>|<\/svg>$/g, '')
  const svgJson = JSON.stringify(svgWithoutWrapper)
  const iconName = path.parse(file).name

  icons.push({
    name: iconName,
    component: `{
  name: '${iconName}',
  render() {
    return h('svg', {
      focusable: 'false',
      viewBox: '0 0 24 24',
      'aria-hidden': this.title ? null : true,
      role: this.title ? 'img' : null,
      innerHTML: this.innerHTML,
    })
  },
  props: |_PROPS_|,
  computed: { innerHTML() { return (${svgJson} + (this.title ? '<title>' + this.title + '</title>' : '')) } },
}`,
  })
}).then(() => {
  //
  // Generate the mega-file!
  //

  const jumboTemplate = template(
    `import { h } from 'vue'
const props = <%= props %>
<% icons.forEach((icon) => { %>
export const <%- icon.name %> = <%= icon.component.replace(': |_PROPS_|', '') %>
<% } ) %>
`
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
    jumboTemplate({ icons, props }),
    function () {
      console.log('Generated index.js')
    }
  )
  fs.writeFile(
    path.join(outputIconsDir, `index.d.ts`),
    jumboTypesTemplate({ icons, props }),
    function () {
      console.log('Generated index.d.ts')
    }
  )

  //
  // Generate the thousands of individual files!
  //

  const singleTemplate = template(
    `import { h } from 'vue'
export default <%= icon.component.replace('|_PROPS_|', props) %>
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
      singleTemplate({ icon, props })
    )
    await fs.promises.writeFile(
      path.join(outputIconsDir, `${icon.name}.d.ts`),
      singleTypeTemplate({ icon, props })
    )
    console.log(`Generated ${icon.name}.js`)
    console.log(`Generated ${icon.name}.d.ts`)
  })
})
