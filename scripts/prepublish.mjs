import { readdirSync, renameSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'

const iconsDir = fileURLToPath(new URL('../icons', import.meta.url))
const outputDir = fileURLToPath(new URL('../', import.meta.url))

readdirSync(iconsDir).forEach((file) => {
  renameSync(join(iconsDir, file), join(outputDir, file))
})
