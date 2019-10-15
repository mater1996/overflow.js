const puppeteerTest = require('./puppeteerTest')
const cTable = require('console.table');
const testStr = 'a'
const domStr = '<p>a</p>'
function MockData() {
  return {
    strX100: new Array(100).fill(testStr).join(' '),
    strX1000: new Array(1000).fill(testStr).join(' '),
    strX10000: new Array(10000).fill(testStr).join(' '),
    domStrX10: new Array(10).fill(domStr).join(' '),
    domStrX100: new Array(100).fill(domStr).join(' '),
    domStrX1000: new Array(1000).fill(domStr).join(' '),
    domStrX10000: new Array(10000).fill(domStr).join(' ')
  }
}
it('should return Array', async () => {
  const resList = await puppeteerTest(MockData())
  console.table(resList)
  expect(Array.isArray(resList)).toBe(true)
})