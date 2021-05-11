const fs = require('fs')
const path = require('path')

const outputDir = path.join(__dirname, '..')
const iconsDir = path.join(__dirname, '../icons')

fs.readdirSync(iconsDir).forEach((file) => {
  fs.renameSync(path.join(iconsDir, file), path.join(outputDir, file))
})
