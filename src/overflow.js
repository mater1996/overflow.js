var lineBreakRegex = /\n|\r/g
var id = 0

class Overflow {
  /**
   * 省略文本插件构造器
   * @param {HTMLElement} el
   * @param {Object} options
   */
  constructor(el, options) {
    if (!el) {
      throw new Error('Overflow need a dom')
    }
    this._id = id++
    Overflow._init.call(this, el, options)
  }

  /**
   * 获取默认选项
   * @returns {Object}
   */
  static _defaultOptions() {
    return {
      str: '',
      scrollTop: 0,
      row: 3
    }
  }

  /**
   * 初始化
   * @param {HTMLElement} el 某个div
   * @param {Object} options 选项{str,row}
   * 只允许传入文本字符串
   */
  static _init(el, options) {
    options = this._options = Overflow._mergeOptions(
      Overflow._defaultOptions(),
      options
    )
    this._el = el
    const { fontSize, width, lineHeight } = window.getComputedStyle(el, null)
    this._fontSize = parseFloat(fontSize, 10)
    this._width = parseFloat(width, 10)
    /**
     * 获取行高 绘制canvas的时候需要根据行高换行
     */
    Overflow._getLineHeight(el, this._fontSize, lineHeight, _lineHeight => {
      this._lineHeight = _lineHeight
      this._height = _lineHeight * options.row
      /**
       * 计算结果
       */
      this._computeResult(el, res => {
        this._result = res
        options.callback && options.callback.call(this, res)
      })
    })
  }

  /**
   * 合并选项策略
   * @param {Object} defaultOptions
   * @param {Object} options
   * @returns {Object}
   */
  static _mergeOptions(defaultOptions, options) {
    return Object.assign(defaultOptions, options)
  }

  static _strFormat(str) {
    return str.replace(lineBreakRegex, '<br/>')
  }

  /**
   * 创建一个测试行高的元素
   * @param {HTMLElement} el 元素
   * @returns {HTMLElement}
   */
  static _createTestLineHeghtDom(el) {
    let testLineHeightDom = el.cloneNode(false)
    const style = testLineHeightDom.style
    style.visibility = 'hidden'
    style.position = 'absolute'
    style.opacity = 0
    style.left = -9999 + 'px'
    style.top = -9999 + 'px'
    style.margin = style.padding = 0
    style.border = 'none'
    style.outline = 'none'
    testLineHeightDom.innerHTML = 'a'
    return testLineHeightDom
  }

  /**
   * 创建某个测试文本是否超出的元素
   * @param {HTMLElement} el 源元素
   * @returns {HTMLElement}
   */
  static _createTestOverflowDom(el, height) {
    let testOverflowDom = el.cloneNode(true)
    const style = testOverflowDom.style
    style.overflow = style.visibility = 'hidden'
    style.height = height + 'px'
    style.position = 'absolute'
    style.opacity = 0
    style.left = 0
    style.right = 0
    return testOverflowDom
  }

  /**
   * 元素内容是否超出高度
   * @param {HTMLElement} test 元素
   * @returns {Boolean}
   */
  static _testOverflow(test) {
    const { scrollHeight, clientHeight } = test
    return scrollHeight > clientHeight
  }

  /**
   * 创建测试超出高度近似文本的canvas上下文
   * @returns {CanvasRenderingContext2D}
   */
  static _createTestOverflowCtx() {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    return context
  }

  /**
   * 获取上下文
   * @returns {CanvasRenderingContext2D}
   */
  static _getTestOverflowCtx() {
    if (!this._testOverflowCtx)
      Object.defineProperty(this, '_testOverflowCtx', {
        value: this._createTestOverflowCtx()
      })
    return this._testOverflowCtx
  }

  /**
   * 设置测试canvas 上下文的基础配置
   * @param {Object} options
   * @param {Object} computedStyle
   * @returns {CanvasRenderingContext2D}
   */
  static _setTestOverflowCtx(width, height, fontSize) {
    const ctx = this._getTestOverflowCtx()
    const canvas = ctx.canvas
    canvas.width = width
    canvas.height = height
    ctx.font = `${fontSize} normal`
    ctx.textBaseline = 'top'
    return ctx
  }

  /**
   * 二分法计算某个元素最后超出的文本
   * @param {HTMLElement} testOverflowDom
   * @param {HTMLElement} target
   * @param {String} total 当前缓存的结果
   * @param {String} str 、
   * @returns {String}
   */
  static _halfComputeLastText(testOverflowDom, total, str) {
    var max = str.length
    var middle = Math.floor(max / 2)
    var halfStr = str.slice(0, middle)
    testOverflowDom.innerHTML = Overflow._strFormat(total + halfStr)
    if (Overflow._testOverflow(testOverflowDom)) {
      return this._halfComputeLastText(testOverflowDom, total, halfStr)
    } else if (middle + 1 < max) {
      return this._halfComputeLastText(
        testOverflowDom,
        total + halfStr,
        str.slice(middle, max)
      )
    } else {
      return total + halfStr
    }
  }

  /**
   * 二分法计算最后超出的文本 从末尾计算
   * @param {HTMLElement} testOverflowDom
   * @param {HTMLElement} target
   * @param {String} total 当前缓存的结果
   * @param {String} str 、
   * @returns {String}
   */
  static _halfComputeLastTextReverse(testOverflowDom, total, str) {
    var max = str.length
    var middle = Math.ceil(max / 2)
    var halfStr = str.slice(middle, max)
    testOverflowDom.innerHTML = Overflow._strFormat(halfStr + total)
    if (this._testOverflow(testOverflowDom)) {
      return this._halfComputeLastTextReverse(testOverflowDom, total, halfStr)
    } else if (middle > 1) {
      return this._halfComputeLastTextReverse(
        testOverflowDom,
        halfStr + total,
        str.slice(0, middle)
      )
    } else {
      return testOverflowDom.innerHTML
    }
  }

  /**
   * 计算相似超出文本，canvas效率比dom效率高，所以优先使用canvas计算文本
   * @param {String} str
   * @param {CanvasRenderingContext2D} ctx
   * @param {Number} lineHeight
   * @returns {String}
   */
  static _computeSimilarText(str, ctx, lineHeight) {
    const canvas = ctx.canvas
    const arrText = str.trim().split('')
    const maxWidth = canvas.width
    const maxHeight = canvas.height
    let y = 0
    let x = 0
    let n = 0
    let line = ''
    for (; n < arrText.length; n++) {
      const testLine = line + arrText[n]
      const metrics = ctx.measureText(testLine)
      const testWidth = metrics.width
      if (lineBreakRegex.test(arrText[n])) {
        ctx.fillText(line, x, y)
        line = arrText[n + 1]
        y += lineHeight
      } else if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, y)
        line = arrText[n]
        y += lineHeight
      } else {
        line = testLine
      }
      if (y > maxHeight) {
        break
      }
      ctx.fillText(line, x, y)
    }
    return arrText.slice(0, n).join('')
  }

  /**
   * 获取某个元素的行高
   * @param {HTMLElement} el
   * @param {Function} cb
   */
  static _getLineHeight(el, fontSize, lineHeight, cb) {
    if (/normal|unset|inherit|initial/g.test(lineHeight)) {
      const testLineHeightDom = this._createTestLineHeghtDom(el)
      el.appendChild(testLineHeightDom)
      setTimeout(() => {
        cb && cb(testLineHeightDom.clientHeight)
        el.removeChild(testLineHeightDom)
      })
    } else {
      cb && cb(parseFloat(lineHeight, 10) || 1.2 * fontSize)
    }
  }

  /**
   * 计算结果
   * @param {HTMLElement} el
   * @param {Function} cb 回调
   */
  _computeResult(el, cb) {
    const { _height, _options } = this
    const testOverflowDom = (this._testOverflowDom =
      this._testOverflowDom || Overflow._createTestOverflowDom(el, _height))
    testOverflowDom.id = `overflow-test-dom-${this._id}`
    testOverflowDom.innerHTML = Overflow._strFormat(_options.str)
    el.appendChild(testOverflowDom)
    setTimeout(() => {
      let res = _options.str
      if (Overflow._testOverflow(testOverflowDom)) {
        res = this._computedOverflowDomContent()
      }
      el.removeChild(testOverflowDom)
      cb && cb(res)
    })
  }

  /**
   * 计算超出元素的最后一个子元素 并返回恰好不超出的文本
   */
  _computedOverflowDomContent() {
    const { _lineHeight, _options, _width } = this
    const canvasHeight = _lineHeight * (_options.row + 1) + _options.scrollTop
    const canvasWidth = _width
    const str = Overflow._computeSimilarText(
      _options.str,
      Overflow._setTestOverflowCtx(canvasWidth, canvasHeight, _lineHeight),
      _lineHeight
    )
    const res = this._computeLastText(str)
    return res
  }

  /**
   * 计算最后超出元素的恰好不超出的文本
   * @param {HTMLElement} testOverflowDom
   * @param {HTMLElement} target 最后超出高度的元素
   * @param {String} str 超出高度元素的文本
   * @param {CanvasRenderingContext2D} ctx 测试canvas上下文
   * @param {Number} lineHeight
   * @returns {String}
   */
  _computeLastText(str) {
    const { _options, _testOverflowDom, _height } = this
    if (_options.scrollTop > 0) {
      _testOverflowDom.style.height = _height + _options.scrollTop + 'px'
      let res = Overflow._halfComputeLastText(_testOverflowDom, '', str)
      _testOverflowDom.style.height = _height + 'px'
      res = Overflow._halfComputeLastTextReverse(_testOverflowDom, '', res)
      return Overflow._strFormat(res)
    } else {
      return Overflow._strFormat(
        Overflow._halfComputeLastText(_testOverflowDom, '', str)
      )
    }
  }

  /**
   * 对外方法，重新计算文本
   * @param {String} str 需要重新计算的文本
   * @param {Function} cb 回调
   */
  reCompute(options, cb) {
    Overflow._mergeOptions(this._options, options)
    this._computeResult(this._el, res => {
      this._result = res
      cb && cb.call(this, res)
    })
  }

  /**
   * 将最后三个字符设置成 点点点
   * @param {String} ellipsis
   * @param {String} str
   */
  dotdotdot(ellipsis, str) {
    str = str || this._result
    ellipsis = ellipsis || '...'
    return str.substring(0, str.length - ellipsis.length) + ellipsis
  }
}

export default Overflow
