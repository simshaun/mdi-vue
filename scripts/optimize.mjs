import { PromisePool } from '@supercharge/promise-pool'
import { existsSync, rmSync, mkdirSync, readdirSync, promises, writeFile } from 'fs'
import difference from 'lodash.difference'
import { join } from 'path'
import { optimize } from 'svgo'
import { fileURLToPath } from 'url'

const inputIconsDir = fileURLToPath(new URL('../icons-svg-src', import.meta.url))
const outputIconsDir = fileURLToPath(new URL('../icons-svg-optimized', import.meta.url))

if (existsSync(outputIconsDir)) rmSync(outputIconsDir, { recursive: true })
mkdirSync(outputIconsDir)

const files = readdirSync(inputIconsDir)

//
// Optimize the source SVGs
//

await PromisePool.withConcurrency(200)
  .for(files)
  .process(async (file) => {
    const filePath = join(inputIconsDir, file)
    const svgString = await promises.readFile(filePath, 'utf8')
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
        // 'removeXMLNS',
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
        'cleanupIds',
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
        'removeElementsByAttr',
        'removeStyleElement',
        'removeScriptElement',
        // 'removeViewBox',
      ],
    })

    if (!result || !result.data) throw new Error(`Error optimizing ${file}`)

    writeFile(join(outputIconsDir, file), result.data, () => {
      console.log(`Optimized ${file}`)
    })
  })

//
// Ensure all files were optimized.
//

const inputFiles = readdirSync(inputIconsDir)
const outputFiles = readdirSync(outputIconsDir)

difference(inputFiles, outputFiles).forEach((f) => {
  console.error(`Missing ${f} in optimized files`)
})

if (inputFiles.length !== outputFiles.length) {
  throw new Error(
    `ERROR! Expected ${inputFiles.length} optimized files. Only found ${outputFiles.length}.`
  )
}
