import { PromisePool } from '@supercharge/promise-pool'
import fetch from 'node-fetch'
import { existsSync, rmSync, mkdirSync, writeFile } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { numToWords } from './utils/numToWords.mjs'
import { ucFirst } from './utils/ucFirst.mjs'
import { snakeToCamel } from './utils/snakeToCamel.mjs'

const MAX_PARALLEL_REQUESTS = 10

const outputIconsDir = fileURLToPath(new URL('../icons-svg-src', import.meta.url))
if (existsSync(outputIconsDir)) rmSync(outputIconsDir, { recursive: true })
mkdirSync(outputIconsDir)

const families = [
  {
    suffix: '',
    family: 'materialicons',
  },
  {
    suffix: 'Outlined',
    family: 'materialiconsoutlined',
  },
  {
    suffix: 'Round',
    family: 'materialiconsround',
  },
  {
    suffix: 'Sharp',
    family: 'materialiconssharp',
  },
  {
    suffix: 'TwoTone',
    family: 'materialiconstwotone',
  },
]

const resp = await fetch('https://fonts.google.com/metadata/icons')
const json = await resp.text()
const iconsMeta = JSON.parse(json.replace(")]}'", ''))

const host = iconsMeta.host // fonts.gstatic.com
const assetUrlPattern = iconsMeta.asset_url_pattern // /s/i/{family}/{icon}/v{version}/{asset}

const downloadQueue = []
iconsMeta.icons.forEach((iconMeta) => {
  /* iconMeta: { name: '10k', unsupported_families: [] } */
  families.forEach((family) => {
    if (iconMeta.unsupported_families.indexOf(family.family) !== -1) {
      return
    }
    // https://fonts.gstatic.com/s/i/materialicons${family}/${icon.name}/v${icon.version}/24px.svg
    const urlPattern = assetUrlPattern
      .replace('{family}', family.family)
      .replace('{icon}', iconMeta.name)
      .replace('{version}', iconMeta.version)
      .replace('{asset}', '24px.svg')
    const url = `https://${host}${urlPattern}`

    let iconName

    const match = iconMeta.name.match(/^(?<num>\d+)(?<lower>[a-z])?(?<rest>.*)/)
    if (match != null) {
      iconName =
        numToWords(match.groups.num).replace(/ /g, '').replace(/-/g, '') +
        (match.groups.lower ? match.groups.lower.toUpperCase() : '') +
        match.groups.rest
    } else {
      iconName = iconMeta.name
    }

    iconName = ucFirst(snakeToCamel(iconName))

    downloadQueue.push({
      name: iconName + family.suffix,
      url,
    })
  })
})

await PromisePool.withConcurrency(MAX_PARALLEL_REQUESTS)
  .for(downloadQueue)
  .process(async (queueItem) => {
    const resp = await fetch(queueItem.url)
    const svg = await resp.text()
    writeFile(join(outputIconsDir, `${queueItem.name}.svg`), svg, () => {
      console.log(`Downloaded ${queueItem.name}.svg`)
    })
  })
