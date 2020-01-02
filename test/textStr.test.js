const puppeteerTest = require('./puppeteerTest')
const testStr = 'a'
const res =
  'a a a a a a a a a '
function MockData() {
  return {
    X100: new Array(100).fill(testStr).join(' '),
    X1000: new Array(1000).fill(testStr).join(' '),
    X10000: new Array(10000).fill(testStr).join(' ')
  }
}
it('should return same string', async () => {
  const resList = await puppeteerTest(MockData())
  resList
    .map(v => v.res)
    .forEach(v => {
      expect(v).toBe(res)
    })
})
