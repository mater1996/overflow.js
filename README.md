# EllipsisText

> A generator that gets the minimum content that corresponds to the height of an element

![](header.png){:height="100px" width="100px"}

## Installation

npm:

```sh
npm install omit --save-dev
```

## Usage example

```js
import EllipsisText from 'ellipsis-text'
new EllipsisText(dom, {
  str:
    'Fame,wealth and knowledge are merely worldly possessions that are withinthe reach of anybodyFame,wealth and knowledge are merely worldly possessions that are withinthe reach of anybodyFame',
  callback:function(res){
      console.log(res) 
      // output:Fame,wealth and knowledge are merely worldly possessions that are withinthe reach of anybodyFame,wealth and knowled
  }
})
```

## EllipsisText API

```js
new EllipsisText(
  HTMLElement,
{
  str: String,
  rows: Number,
  callback:function(res){}
})
```

## Tips

EllipsisText used canvas to determine the number of lines to be intercepted

If you pass in HTML, it deletes the nodes one by one to find the last text node that exceeds the height

## Perfonmance

The following is an EllipsisText performance test (in ms)

![](performance.jpg)


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

[LICENSE](https://github.com/Mater1996/omit/blob/master/LICENSE)

## Contributing

1. Fork it (<https://github.com/Mater1996/Mater1996.github.io>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request
