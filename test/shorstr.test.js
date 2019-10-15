const puppeteerTest = require('./puppeteerTest')
it('should return same string', async () => {
  const testStr = 'a'
  const res = new Array(10).fill(testStr).join(' ')
  function MockData() {
    return {
      X100: res
    }
  }
  const resList = await puppeteerTest(MockData())
  resList.forEach(v => {
    expect(v).toBe(res)
  })
})
