const puppeteerTest = require('./puppeteerTest')
const testStr = '<p>a</p>'
const res = '<p>a</p> <p>a</p> <p>a</p>'
function MockData() {
  return {
    X100: new Array(100).fill(testStr).join(' ')
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
