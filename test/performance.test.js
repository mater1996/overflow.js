const puppeteerTest = require('./puppeteerTest')
const cTable = require('console.table');
const testStr = 'a'
function MockData() {
  return {
    strX100: new Array(100).fill(testStr).join(' '),
    strX1000: new Array(1000).fill(testStr).join(' '),
    strX10000: new Array(10000).fill(testStr).join(' ')
  }
}
it('should return Array', async () => {
  const resList = await puppeteerTest(MockData())
  console.table(resList)
  expect(Array.isArray(resList)).toBe(true)
})