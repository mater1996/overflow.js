const EllipsisText = require('../dist/ellipsis-text.umd')
const puppeteer = require('puppeteer')

it('should return same string', () => {
  const testStr = 'a'
  const res =
    'a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a a'
  function MockData() {
    return {
      X100: new Array(100).fill(testStr).join(' '),
      X1000: new Array(1000).fill(testStr).join(' '),
      X10000: new Array(10000).fill(testStr).join(' ')
    }
  }
  ;(async () => {
    const browser = await puppeteer.launch({})
    const page = await browser.newPage()
    await page.addScriptTag({
      content: EllipsisText.toString()
    })
    const resList = await page.evaluate(
      options => {
        return new Promise(resolve => {
          const data = options.data
          const performance = {}
          const keys = Object.keys(data)
          let n = 0
          function test(n) {
            const key = keys[n]
            if (!key) {
              resolve(performance)
            }
            const div = document.createElement('div')
            div.style.fontSize = '16px'
            div.style.width = '80px'
            div.style.height = '80px'
            document.body.appendChild(div)
            new EllipsisText(div, {
              str: data[key],
              callback: function(res) {
                document.body.removeChild(div)
                performance.push(res)
                test(++n)
              }
            })
          }
          test(n)
        })
      },
      {
        data: MockData()
      }
    )
    await browser.close()
    resList.forEach(v => {
      expect(v).toBe(res)
    })
  })()
})
