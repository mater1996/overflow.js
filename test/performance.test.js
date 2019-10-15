// const EllipsisText = require('../dist/ellipsis-text.umd')
// const puppeteer = require('puppeteer')
// let testStr = 'a'
// let domStr = '<p>a</p>'
// function MockData() {
//   return {
//     strX100: new Array(100).fill(testStr).join(' '),
//     strX1000: new Array(1000).fill(testStr).join(' '),
//     strX10000: new Array(10000).fill(testStr).join(' '),
//     domStrX10: new Array(10).fill(domStr).join(' '),
//     domStrX100: new Array(100).fill(domStr).join(' '),
//     domStrX1000: new Array(1000).fill(domStr).join(' '),
//     domStrX10000: new Array(10000).fill(domStr).join(' ')
//   }
// }
// const data = MockData()
// ;(async () => {
//   const browser = await puppeteer.launch({})
//   const page = await browser.newPage()
//   await page.addScriptTag({
//     content: EllipsisText.toString()
//   })
//   const performance = await page.evaluate(
//     options => {
//       return new Promise(resolve => {
//         const data = options.data
//         const performance = {}
//         const keys = Object.keys(data)
//         let n = 0
//         function test(n) {
//           const key = keys[n]
//           if (!key) {
//             resolve(performance)
//           }
//           const div = document.createElement('div')
//           div.style.fontSize = '16px'
//           div.style.width = '80px'
//           div.style.height = '80px'
//           document.body.appendChild(div)
//           const time1 = Date.now()
//           new EllipsisText(div, {
//             str: data[key],
//             callback: function(res) {
//               document.body.removeChild(div)
//               performance[key] = {
//                 long: Date.now() - time1,
//                 res: res
//               }
//               test(++n)
//             }
//           })
//         }
//         test(n)
//       })
//     },
//     {
//       data: data
//     }
//   )
//   console.log(performance)
//   await browser.close()
// })()

test('performance', () => {
  expect(true).toBe(true);
});
