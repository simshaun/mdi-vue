const fs = require('fs')
const mdiIcons = require('@mdi/js')
const path = require('path')
const template = require('lodash.template')

const outputDir = path.join(__dirname, '..')
const outputIconsDir = path.join(__dirname, '../icons')

const icons = Object.keys(mdiIcons)
  .filter((name) => {
    return name !== 'default' && name !== '__esModule'
  })
  .map((name) => {
    return {
      name: name.charAt(0).toUpperCase() + name.substring(1, name.length),
      path: mdiIcons[name],
    }
  })

//
// Generate the mega-file!
//

const compiled = template(
  `import { defineComponent as dc } from 'vue'
const props = {
  viewBox: {
    type: String,
    required: false,
    default: '0 0 24 24',
  },
  titleAccess: {
    type: String,
    required: false,
    default: '',
  },
}
<% icons.forEach((icon) => { %>
export const <%- icon.name %> = /*#__PURE__*/ dc({
  name: '<%- icon.name %>',
  template: \`<svg focusable="false" :viewBox="viewBox" :aria-hidden="titleAccess ? null : true" :role="titleAccess ? 'img' : null">
  <path d="<%- icon.path %>" />
  <title v-if="titleAccess">{{ titleAccess }}</title>
</svg>\`,
  props,
})
<% } ) %>
`
)

fs.writeFile(path.join(outputDir, `mdi.js`), compiled({ icons }), function () {
  console.log('Generated mdi.js')
})

//
// Generate the thousands of individual files!
//

if (fs.existsSync(outputIconsDir)) {
  fs.rmSync(outputIconsDir, { recursive: true })
}
fs.mkdirSync(outputIconsDir)

icons.forEach((icon) => {
  fs.writeFile(
    path.join(outputIconsDir, `${icon.name}.vue`),
    `<template>
  <svg focusable="false" :viewBox="viewBox" :aria-hidden="titleAccess ? null : true" :role="titleAccess ? 'img' : null">
    <path d="||path||" />
    <title v-if="titleAccess">{{ titleAccess }}</title>
  </svg>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: '||name||',

  props: {
    viewBox: {
      type: String,
      required: false,
      default: '0 0 24 24',
    },
    titleAccess: {
      type: String,
      required: false,
      default: '',
    },
  },
})
</script>
`
      .replace('||name||', icon.name)
      .replace('||path||', icon.path),
    () => {
      console.log(`Generated ${icon.name}.vue`)
    }
  )
})
