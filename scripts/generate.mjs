import { PromisePool } from '@supercharge/promise-pool'
import { readdirSync, promises, existsSync, rmSync, mkdirSync, writeFile } from 'fs'
import { join, parse } from 'path'
import { fileURLToPath } from 'url'
import template from 'lodash.template'

const inputIconsDir = fileURLToPath(new URL('../icons-svg-optimized', import.meta.url))
const outputIconsDir = fileURLToPath(new URL('../icons', import.meta.url))

const icons = []

await PromisePool.withConcurrency(100)
  .for(readdirSync(inputIconsDir))
  .process(async (file) => {
    const svgString = await promises.readFile(join(inputIconsDir, file), 'utf8')
    const svgWithoutWrapper = svgString.replace(/^<svg[^>]*>|<\/svg>$/g, '')
    const iconName = parse(file).name

    icons.push({ name: iconName, svg: svgWithoutWrapper })
  })

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

if (existsSync(outputIconsDir)) rmSync(outputIconsDir, { recursive: true })
mkdirSync(outputIconsDir)

writeFile(join(outputIconsDir, `index.js`), jumboTemplate({ icons }), function () {
  console.log('Generated index.js')
})
writeFile(join(outputIconsDir, `index.d.ts`), jumboTypesTemplate({ icons }), function () {
  console.log('Generated index.d.ts')
})

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

await PromisePool.withConcurrency(20)
  .for(icons)
  .process(async (icon) => {
    await promises.writeFile(
      join(outputIconsDir, `${icon.name}.js`),
      singleTemplate({ icon })
    )
    await promises.writeFile(
      join(outputIconsDir, `${icon.name}.d.ts`),
      singleTypeTemplate({ icon })
    )
    console.log(`Generated ${icon.name}.js`)
    console.log(`Generated ${icon.name}.d.ts`)
  })
