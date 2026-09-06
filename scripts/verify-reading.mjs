import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import { chromium } from 'playwright'
const origin = process.env.SITE_URL || 'http://127.0.0.1:4321'
const article = '/posts/let-agents-finish-the-job/'
const out = 'verification'
await mkdir(out, { recursive: true })
const browser = await chromium.launch({ headless: true })
const context = await browser.newContext({ locale: 'zh-CN', colorScheme: 'light' })
const page = await context.newPage()
const errors = []
const badResponses = []
const decorativeFonts = []
page.on('pageerror', error => errors.push(error.message))
page.on('response', response => { if (response.status() >= 400 && response.url().startsWith(origin)) badResponses.push(`${response.status()} ${response.url()}`) })
page.on('request', request => { if (/Snell|EarlySummer|STIX[-/]/i.test(request.url())) decorativeFonts.push(request.url()) })
const checks = []
async function load(path) {
  const response = await page.goto(origin + path, { waitUntil: 'networkidle' })
  assert.equal(response.status(), 200, path)
  await page.evaluate(() => document.fonts.ready)
}
try {
  for (const width of [320, 375, 390, 430, 768, 1440]) {
    await page.setViewportSize({ width, height: width > 700 ? 1000 : 844 })
    await load(article)
    const typography = await page.evaluate(() => {
      const paragraph = document.querySelector('#post-content p')
      const style = getComputedStyle(paragraph)
      const shell = document.querySelector('.reading-shell').getBoundingClientRect()
      return { width: innerWidth, scrollWidth: document.documentElement.scrollWidth, fontSize: style.fontSize, lineHeight: style.lineHeight, align: style.textAlign, spacing: style.letterSpacing, font: style.fontFamily, shellWidth: shell.width, left: shell.left, right: innerWidth - shell.right }
    })
    assert(typography.scrollWidth <= width + 1, `Article overflow: ${width}`)
    assert.equal(typography.align, 'left')
    assert.equal(typography.spacing, 'normal')
    assert(!/Snell|EarlySummer|STIX/.test(typography.font))
    assert(Math.abs(typography.left - typography.right) < 2, 'Column is not centered')
    assert(typography.shellWidth <= 720)
    if (width <= 600) {
      assert.equal(typography.fontSize, '17px')
      assert(Math.abs(parseFloat(typography.lineHeight) - 30.6) < 0.2)
    }
    const body = await page.locator('#post-content').innerText()
    assert(body.length > 2000, 'Existing long article missing')
    const toc = page.locator('details.reading-toc')
    assert.equal(await toc.getAttribute('open'), null)
    await toc.locator('summary').click()
    assert.notEqual(await toc.getAttribute('open'), null)
    await toc.locator('summary').click()
    if (width === 390 || width === 1440) {
      await page.screenshot({ path: `${out}/article-${width}.png` })
      await page.locator('#post-content h2').nth(1).scrollIntoViewIfNeeded()
      await page.screenshot({ path: `${out}/article-body-${width}.png` })
    }
    checks.push({ page: article, ...typography })
    await load('/')
    assert(await page.locator(`main a[href="${article}"]`).count() > 0, 'Article entry missing')
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'Home overflow')
    if (width === 390 || width === 1440) await page.screenshot({ path: `${out}/home-${width}.png`, fullPage: true })
  }
  await page.setViewportSize({ width: 390, height: 844 })
  await page.locator('.reading-nav a[href="/about/"]').click()
  await page.waitForURL('**/about/')
  await page.waitForLoadState('networkidle')
  await page.locator('#theme-toggle-button').click()
  assert(await page.evaluate(() => document.documentElement.classList.contains('dark')))
  await page.locator('.reading-nav a[href="/tags/"]').click()
  await page.waitForURL('**/tags/')
  assert(await page.evaluate(() => document.documentElement.classList.contains('dark')), 'Theme lost during navigation')
  await load(article)
  assert(await page.evaluate(() => document.documentElement.classList.contains('dark')))
  await page.screenshot({ path: `${out}/article-dark-390.png` })
  await page.locator('#theme-toggle-button').click()
  await load('/posts/how-this-blog-works/')
  assert(await page.locator('pre').count() > 0)
  await page.locator('pre').first().scrollIntoViewIfNeeded()
  await page.screenshot({ path: `${out}/code-390.png` })
  // Synthetic long code and wide table test; never saved into article content.
  await page.evaluate(() => {
    const pre = document.createElement('pre'); pre.textContent = 'long_line '.repeat(70)
    const table = document.createElement('table'); const tr = table.insertRow()
    for (let i = 0; i < 10; i++) tr.insertCell().textContent = '很宽的技术表格列'
    document.querySelector('#post-content').append(pre, table)
  })
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'Wide code/table breaks page')
  assert.equal(decorativeFonts.length, 0, 'Decorative fonts still requested')
  assert.deepEqual(errors, [], 'Browser errors')
  assert.deepEqual(badResponses, [], 'Broken local resources')
  await writeFile(`${out}/reading-checks.json`, JSON.stringify({ status: 'pass', checks, navigation: 'pass', theme: 'pass', wideContent: 'pass', decorativeFonts, errors, badResponses }, null, 2))
  console.log('Chinese reading checks passed at six widths, including the real Agent article.')
} finally {
  await browser.close()
}
