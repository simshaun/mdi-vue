const eachLimit = require('async/eachLimit')
const fs = require('fs')
const path = require('path')
const template = require('lodash.template')
const { optimize } = require('svgo')

const props = `{ title: { type: String, required: false, default: '' } }`

const inputIconsDir = path.join(__dirname, '../icons-svg-src')
const outputIconsDir = path.join(__dirname, '../icons-svg-optimized')
if (fs.existsSync(outputIconsDir)) {
  fs.rmSync(outputIconsDir, { recursive: true })
}
fs.mkdirSync(outputIconsDir)

const files = fs.readdirSync(inputIconsDir)
const icons = []

//
// Optimize the source SVGs
//

eachLimit(files, 200, async (file) => {
  const filePath = path.join(inputIconsDir, file)
  const svgString = await fs.promises.readFile(filePath, 'utf8')
  const result = optimize(svgString, {
    floatPrecision: 4,
    multipass: true,
    plugins: [
      'cleanupAttrs',
      'removeDoctype',
      'removeXMLProcInst',
      'removeComments',
      'removeMetadata',
      'removeTitle',
      'removeDesc',
      'removeUselessDefs',
      'removeXMLNS',
      'removeEditorsNSData',
      'removeEmptyAttrs',
      'removeHiddenElems',
      'removeEmptyText',
      'removeEmptyContainers',
      'cleanupEnableBackground',
      'minifyStyles',
      'convertStyleToAttrs',
      'convertColors',
      'convertPathData',
      'convertTransform',
      'removeUnknownsAndDefaults',
      'removeNonInheritableGroupAttrs',
      { name: 'removeUselessStrokeAndFill', params: { removeNone: true } },
      'removeUnusedNS',
      'cleanupIDs',
      'cleanupNumericValues',
      'cleanupListOfValues',
      'moveElemsAttrsToGroup',
      'moveGroupAttrsToElems',
      'collapseGroups',
      'removeRasterImages',
      'mergePaths',
      'convertShapeToPath',
      'sortAttrs',
      'removeDimensions',
      // 'removeAttrs',
      'removeElementsByAttr',
      'removeStyleElement',
      'removeScriptElement',
      'removeViewBox',
    ],
  })

  fs.writeFile(path.join(outputIconsDir, file), result.data, () => {
    console.log(`Optimized ${file}`)
  })

  const optimizedSvgString = result.data.replace(/^<svg[^>]*>|<\/svg>$/g, '')
  const iconName = path.parse(file).name

  console.log(`Optimized ${file}`)

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
    }, [
      ${JSON.stringify(optimizedSvgString)},
      this.title ? h('title', {}, [this.title]) : null,
    ])
  },
  props: |_PROPS_|
}`,
  })
})
