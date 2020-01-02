const puppeteerTest = require('./puppeteerTest')
const testStr = 'a'
const res = new Array(5).fill(testStr).join(' ')
function MockData() {
  return {
    X100: res
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
