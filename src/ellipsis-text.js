class EllipsisText {
  constructor(el, options) {
    if (!el) {
      throw new Error('EllipsisText need a dom')
    }
    this.options = EllipsisText._mergeOptions(
      EllipsisText._defaultOptions(),
      options
    )
    EllipsisText._init.call(this, el, this.options)
  }

  static _defaultOptions() {
    return {
      str: '',
      row: 3
    }
  }

  static _init(el, options) {
    const _el = (this._el = el)
    const _computedStyle = (this._computedStyle = window.getComputedStyle(
      _el,
      null
    ))
    EllipsisText._getLineHeight(_el, lineHeight => {
      this._lineHeight = lineHeight || 0
      const _testOverflowDom = (this._testOverflowDom = EllipsisText._createTestOverflowDom(
        _el,
        lineHeight * options.row,
        options
      ))
      const _testOverflowCtx = (this._testOverflowCtx = EllipsisText._createTestOverflowCtx(
        _computedStyle.width,
        lineHeight * (options.row + 1),
        _computedStyle.fontSize,
        options
      ))
      EllipsisText._computeResult(
        _el,
        options.str,
        _testOverflowDom,
        _testOverflowCtx,
        lineHeight,
        _computedStyle,
        res => {
          this._result = res
          options.callback && options.callback.call(this, res)
        }
      )
    })
  }

  static _mergeOptions(defaultOptions, options) {
    const mergedOptions = Object.assign(defaultOptions, options)
    return mergedOptions
  }

  static _computeResult(
    el,
    str,
    testOverflowDom,
    testOverflowCtx,
    lineHeight,
    computedStyle,
    cb
  ) {
    testOverflowDom.innerHTML = str
    el.appendChild(testOverflowDom)
    setTimeout(() => {
      let res = str
      if (EllipsisText._testOverflow(testOverflowDom)) {
        res = EllipsisText._computedOverflowDomContent(
          testOverflowDom,
          testOverflowCtx,
          lineHeight,
          parseFloat(computedStyle.fontSize, 10)
        )
      }
      el.removeChild(testOverflowDom)
      cb && cb(res)
    })
  }

  static _createTestLineHeghtDom(el) {
    let testLineHeightDom = el.cloneNode(false)
    const style = testLineHeightDom.style
    style.overflow = style.visibility = 'hidden'
    style.position = 'absolute'
    style.opacity = 0
    style.left = 0
    style.right = 0
    testLineHeightDom.innerHTML = 'a'
    return testLineHeightDom
  }

  static _createTestOverflowDom(el, height, options) {
    let testOverflowDom = (this.testOverflowDom = el.cloneNode(true))
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
    canvas.height = parseFloat(height, 10)
    context.textBaseline = 'top'
    context.font = `${fontSize} normal`
    return context
  }

  static _computedOverflowDomContent(
    testOverflowDom,
    ctx,
    lineHeight,
    fontSize
  ) {
    let lastChild = testOverflowDom.lastChild
    let textContent = lastChild.textContent
    while (testOverflowDom.childNodes.length > 1 && lastChild) {
      if (EllipsisText._testOverflow(testOverflowDom)) {
        testOverflowDom.removeChild(lastChild)
      } else {
        testOverflowDom.appendChild(lastChild)
        break
      }
      lastChild = testOverflowDom.lastChild
      textContent = lastChild.textContent
    }
    if (textContent) {
      lastChild.textContent = EllipsisText._computeLastText(
        testOverflowDom,
        lastChild,
        textContent,
        ctx,
        lineHeight,
        fontSize
      )
    }
    return testOverflowDom.innerHTML
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

  static _computeLastText(
    testOverflowDom,
    target,
    str,
    ctx,
    lineHeight,
    fontSize
  ) {
    str = EllipsisText._computeSimilarText(str, ctx, lineHeight, fontSize)
    return EllipsisText._halfComputeLastText(testOverflowDom, target, '', str)
  }

  static _halfComputeLastText(testOverflowDom, target, total, str) {
    var max = str.length
    var middle = Math.floor(max / 2)
    var halfStr = str.slice(0, middle)
    target.textContent = total + halfStr
    if (EllipsisText._testOverflow(testOverflowDom)) {
      return EllipsisText._halfComputeLastText(testOverflowDom, target, total, halfStr)
    } else if (middle + 1 < max) {
      return EllipsisText._halfComputeLastText(
        testOverflowDom,
        target,
        total + halfStr,
        str.slice(middle, max)
      )
    } else {
      return target.textContent
    }
  }

  static _getLineHeight(el, cb) {
    const testLineHeightDom = EllipsisText._createTestLineHeghtDom(el)
    el.appendChild(testLineHeightDom)
    setTimeout(() => {
      cb && cb(testLineHeightDom.clientHeight)
      el.removeChild(testLineHeightDom)
    })
  }

  reCompute(str, cb) {
    const options = EllipsisText._mergeOptions(this.options, {
      str: str || this.options.str
    })
    EllipsisText._computeResult(
      this._el,
      options.str,
      this._testOverflowDom,
      this._testOverflowCtx,
      this._lineHeight,
      this._computedStyle,
      res => {
        this._result = res
        cb && cb.call(this, res)
      }
    )
  }

  dotdotdot(ellipsis, str) {
    str = str || this._result
    ellipsis = ellipsis || '...'
    return str.substring(0, str.length - ellipsis.length) + ellipsis
  }
}

export default EllipsisText
