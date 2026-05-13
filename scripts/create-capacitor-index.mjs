import { mkdir, readdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

const clientDir = resolve(process.cwd(), 'dist/client')
const assetsDir = resolve(clientDir, 'assets')
const target = resolve(clientDir, 'index.html')

const assetFiles = await readdir(assetsDir)
const entryScript = assetFiles.find((file) => /^index-.*\.js$/.test(file))
const stylesheet = assetFiles.find((file) => /^styles-.*\.css$/.test(file))

if (!entryScript) {
  throw new Error('Could not find the built client entry script in dist/client/assets.')
}

const stylesheetTag = stylesheet
  ? `\n    <link rel="stylesheet" href="/assets/${stylesheet}" />`
  : ''

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />${stylesheetTag}
    <title>PodTracker</title>
  </head>
  <body>
    <script type="module" src="/assets/${entryScript}"></script>
  </body>
</html>
`

await mkdir(dirname(target), { recursive: true })
await writeFile(target, html, 'utf8')

console.log(`Created ${target}`)