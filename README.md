# Overflow

> A generator that gets the minimum content that corresponds to the height of an element

- [中文](https://github.com/Mater1996/overflow.js/blob/master/docs/README_CN.md)

## Installation

npm:

```sh
npm install overflow.js --save-dev
```

## Demo

[demo](https://codepen.io/xbup/pen/eYYZeOd)

## Usage example

```html
<div id="overflow" style="width:280px"></div>
```

### string input

```js
import Overflow from 'overflow'
new Overflow(document.querySelector('#overflow'), {
  str:
    'Fame,wealth and knowledge are merely worldly possessions that are withinthe reach of anybodyFame,wealth and knowledge are merely worldly possessions that are withinthe reach of anybodyFame',
  callback: function(res) {
    console.log(res)
    // output:Fame,wealth and knowledge are merely worldly possessions that are withinthe reach of anybodyFame,wealth and knowled
  }
})
```

you can use it to generate text with overflow

```js
new Overflow(document.querySelector('#overflow'), {
  str:
    "You'll pass the churchyard, Mr Lockwood, on your way back to the Grange, and you'll see the three graverestones close to the moor. Catherine's",
  callback: function(res) {
    console.log(this.dotdotdot())
    // output:You'll pass the churchyard, Mr Lockwood, on your way back to the Grange, and you'll see the three grave...
  }
})
```

![example](https://raw.githubusercontent.com/Mater1996/overflow.js/master/example.png)

## Overflow API

### options

```js
new Overflow(HTMLElement, {
  str: String,
  row: Number,
  scrollTop: Number,
  callback: function(res) {}
})
```
### method

#### overflow.reCompute(str,callback)

Recalculate and return the new result,this will save a lot of time than initialization

#### overflow.dotdotdot(ellipsis = "...", str)

## Tips

Overflow used canvas to determine the number of lines to be intercepted

If you pass in HTML, it deletes the nodes one by one to find the last text node that exceeds the height

function dotdotdot just replace last three letter, but you can use [dotdotdot.js](http://dotdotdot.frebsite.nl/) to do the following or rewrite this function

## Performance

The following is an Overflow performance test (in ms)

![](https://raw.githubusercontent.com/Mater1996/overflow.js/master/performance.jpg)

## Development setup

```sh
npm install

npm run dev

npm run test
```

## Release History

- 1.0.17
  - add scrollTop property
- 1.0.0
  - The first release

## Meta

Mater1996 – bxh8640@gmail.com

Distributed under the MIT license. See `LICENSE` for more information.

[LICENSE](https://github.com/Mater1996/overflow.js/blob/master/LICENSE)

## Contributing

1. Fork it (<https://github.com/Mater1996/overflow.js>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request
