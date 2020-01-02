# EllipsisText

> 生成符合HTML元素高度的文本工具

## 安装

npm:

```sh
npm install ellipsis-text --save-dev
```

## 示例

[示例](https://codepen.io/xbup/pen/eYYZeOd)

## 使用

### 文本输入

```js
import EllipsisText from 'ellipsis-text'
new EllipsisText(document.querySelector('#ellipsis'), {
  str:
    'Fame,wealth and knowledge are merely worldly possessions that are withinthe reach of anybodyFame,wealth and knowledge are merely worldly possessions that are withinthe reach of anybodyFame',
  callback: function(res) {
    console.log(res)
    // output:Fame,wealth and knowledge are merely worldly possessions that are withinthe reach of anybodyFame,wealth and knowled
  }
})
```

你可以用它去生成带省略号的字符串

```js
new EllipsisText(document.querySelector('#ellipsis'), {
  str:
    "You'll pass the churchyard, Mr Lockwood, on your way back to the Grange, and you'll see the three graverestones close to the moor. Catherine's",
  callback: function(res) {
    console.log(this.dotdotdot())
    // output:You'll pass the churchyard, Mr Lockwood, on your way back to the Grange, and you'll see the three grave...
  }
})
```

![example](https://raw.githubusercontent.com/Mater1996/ellipsis-text/master/example.png)

## EllipsisText API

### 选项

```js
new EllipsisText(HTMLElement, {
  str: String,
  row: Number,
  scrollTop: Number, // 偏移量
  callback: function(res) {}
})
```
### 方法

#### ellipsisText.reCompute(str,callback)

重新计算文本

#### ellipsisText.dotdotdot(ellipsis = "...", str)

## 提示

EllipsisText使用画布确定近似的文本数量

如果传入的是HTML的话，EllipsisText将会逐个删除DOM节点，这会浪费一部分时间

方法 dotdotdot仅仅是将最后的三个字符替换为...
你也可以使用 [dotdotdot.js](http://dotdotdot.frebsite.nl/) 进行接下来的替换操作 或者 重写 dotdotdot方法

## 性能

下面是性能展示（ms）
str X 10
代表循环某一段文字累加10次

![](https://raw.githubusercontent.com/Mater1996/ellipsis-text/master/performance.jpg)

## Development setup

```sh
npm install

npm run dev

npm run test
```

## Release History

- 1.0.0
  - The first release

## Meta

Mater1996 – bxh8640@gmail.com

Distributed under the MIT license. See `LICENSE` for more information.

[LICENSE](https://github.com/Mater1996/ellipsis-text/blob/master/LICENSE)

## Contributing

1. Fork it (<https://github.com/Mater1996/ellipsis-text>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request
