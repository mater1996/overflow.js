class EllipsisText {
  constructor(container, options) {
    if (!container) {
      throw new Error('EllipsisText need a dom')
    }
    this.options = EllipsisText._mergeOptions(
      {
        str: '',
        row: 3
      },
      options
    )
    EllipsisText._init.call(this, container, this.options)
  }

  static _init(container, options) {
    const _container = (this._container = container)
    const _computedStyle = (this._computedStyle = window.getComputedStyle(
      _container,
      null
    ))
    this.$readMoreBtn = EllipsisText._createReadmoreBtn(options.more, options.less)
    this.readMore = false
    const testLineHeightDom = EllipsisText._createTestLineHeghtDom(container)
    testLineHeightDom.innerHTML = 'a'
    _container.appendChild(testLineHeightDom)
    setTimeout(() => {
      this.lineHeight = EllipsisText._getLineHeight(testLineHeightDom)
      _container.removeChild(testLineHeightDom)
      const _testOverflowDom = (this._testOverflowDom = EllipsisText._createTestOverflowDom(
        _container,
        this.lineHeight * options.row,
        options
      ))
      const _testOverflowCtx = (this._testOverflowCtx = EllipsisText._createTestOverflowCtx(
        _computedStyle.width,
        this.lineHeight * options.row,
        _computedStyle.fontSize,
        options
      ))
      _testOverflowDom.innerHTML = options.str
      _container.appendChild(_testOverflowDom)
      setTimeout(() => {
        let res = options.str
        if (!EllipsisText._testOverflow(_testOverflowDom)) {
          _container.removeChild(_testOverflowDom)
        } else {
          res = EllipsisText._computedOverflowDomContent(
            _testOverflowDom,
            _testOverflowCtx,
            this.lineHeight,
            parseFloat(_computedStyle.fontSize, 10)
          )
        }
        options.callback && options.callback(res)
      })
    })
  }

  static _mergeOptions(defaultOptions, options) {
    const mergedOptions = Object.assign(defaultOptions, options)
    return mergedOptions
  }

  static _createReadmoreBtn(more, less) {
    let btn = document.createElement('div')
    btn.style.display = 'inline-block'
    btn.setAttribute('more', more)
    btn.setAttribute('more', less)
    btn.innerText = more
    return btn
  }

  static _createTestLineHeghtDom(container) {
    let testLineHeightDom = container.cloneNode(false)
    const style = testLineHeightDom.style
    style.overflow = style.visibility = 'hidden'
    style.position = 'absolute'
    style.opacity = 0
    style.left = 0
    style.right = 0
    return testLineHeightDom
  }

  static _createTestOverflowDom(container, height, options) {
    let testOverflowDom = (this.testOverflowDom = container.cloneNode(true))
    const style = testOverflowDom.style
    style.height = height + 'px'
    style.overflow = style.visibility = 'hidden'
    style.position = 'absolute'
    style.opacity = 0
    style.left = 0
    style.right = 0
    return testOverflowDom
  }

  static _createTestOverflowCtx(width, height, fontSize, options) {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    canvas.width = parseFloat(width, 10)
    canvas.height = parseFloat(height, 10) * 1.5
    context.textBaseline = 'top'
    context.font = `${fontSize} normal`
    return context
  }

  static _computedOverflowDomContent(target, ctx, lineHeight, fontSize) {
    let textContent, lastChild
    while (target.lastChild) {
      lastChild = target.lastChild
      textContent = lastChild.textContent
      if (EllipsisText._testOverflow(target)) {
        target.removeChild(lastChild)
      } else {
        break
      }
    }

    if (textContent) {
      lastChild.textContent = EllipsisText._computeLastText(
        textContent,
        target,
        ctx,
        lineHeight,
        fontSize
      )
    }
    return target.innerHTML
  }

  static _testOverflow(test) {
    const { scrollHeight, clientHeight } = test
    return scrollHeight > clientHeight
  }

  static _computeSimilarText(str, ctx, lineHeight) {
    const canvas = ctx.canvas
    const arrText = str.trim().split('')
    const maxWidth = canvas.width
    let y = 0
    let x = 0
    var line = ''
    let n = 0
    for (; n < arrText.length; n++) {
      var testLine = line + arrText[n]
      var metrics = ctx.measureText(testLine)
      var testWidth = metrics.width
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, y)
        line = arrText[n]
        y += lineHeight
      } else {
        line = testLine
      }
      if (y > canvas.height) {
        break
      }
      ctx.fillText(line, x, y)
    }
    return arrText.slice(0, n).join('')
  }

  static _computeLastText(str, testOverflowDom, ctx, lineHeight, fontSize) {
    str = EllipsisText._computeSimilarText(str, ctx, lineHeight, fontSize)
    testOverflowDom.innerHTML = str
    while (testOverflowDom) {
      const { scrollHeight, clientHeight } = testOverflowDom
      const length = str.length
      if (scrollHeight > clientHeight) {
        str = str.substr(0, length - 1)
      } else {
        break
      }
      testOverflowDom.innerHTML = str
    }
    return str
  }

  static _getLineHeight(element) {
    return element.clientHeight
  }
}

export default EllipsisText
