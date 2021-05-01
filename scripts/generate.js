const fs = require('fs')
const mdiIcons = require('@mdi/js')
const path = require('path')
const template = require('lodash.template')

const outputDir = path.join(__dirname, '..')
const outputIconsDir = path.join(__dirname, '../icons')

const props = `{ title: { type: String, required: false, default: '' } }`

const icons = Object.keys(mdiIcons)
  .filter((name) => {
    return name !== 'default' && name !== '__esModule'
  })
  .map((name) => {
    const titleCaseName = name.charAt(0).toUpperCase() + name.substring(1, name.length)
    return {
      name: titleCaseName,
      path: mdiIcons[name],
      component: `{
  name: '${titleCaseName}',
  render() {
    return h('svg', {
      focusable: 'false',
      viewBox: '0 0 24 24',
      'aria-hidden': this.title ? null : true,
      role: this.title ? 'img' : null,
    }, [
      h('path', { d: 'M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z' }),
      this.title ? h('title', {}, [this.title]) : null,
    ])
  },
  props: |_PROPS_|
}`
    }
  })

//
// Generate the mega-file!
//

const jumboTemplate = template(
  `import { h } from 'vue'
const props = <%= props %>
<% icons.forEach((icon) => { %>
export const <%- icon.name %> = <%= icon.component.replace(': |_PROPS_|', '') %>
<% } ) %>
`)

fs.writeFile(path.join(outputDir, `mdi.js`), jumboTemplate({ icons, props }), function () {
  console.log('Generated mdi.js')
})

//
// Generate the thousands of individual files!
//

if (fs.existsSync(outputIconsDir)) {
  fs.rmSync(outputIconsDir, { recursive: true })
}
fs.mkdirSync(outputIconsDir)

const singleTemplate = template(
  `import { h } from 'vue'
export default <%= icon.component.replace('|_PROPS_|', props) %>
`)

icons.forEach((icon) => {
  fs.writeFile(
    path.join(outputIconsDir, `${icon.name}.js`),
    singleTemplate({ icon, props }),
    () => {
      console.log(`Generated ${icon.name}.vue`)
    }
  )
})
