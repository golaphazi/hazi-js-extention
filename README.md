# NextJs Framework
A Simple and Lightweight JavScript Framework.

## Contents
- [Demo](#demo)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Documentation](#documentation)
- [License](#license)

## Demo
For usage and examples, have a look at :rocket: [online demo]()

## Installation

1. Download the installable nextJs zip.
2. Create index.html file and paste the code.


## Quick Start
1. Create index.html file and paste the code.
```html
<!DOCTYPE html>
<html>
    <head></head>
    <body>
        <div class="app"></div>

        <script src="js/nextJs.js"></script>
        <script src="js/script.js"></script>
    </body>

</html>
```
2. Create Js file `script.js` and start coding here.
```js
let $prefix = 'app-';

hJs.el( document.querySelector('.app'),
    'div',
    {
        class: $prefix+'top-div',
        content: 'Top Div'
    },
    [

    ],
    'after'
);
```
<h3>use the other method</h3>

```js
var hJs = {
    el: HaziExt.createElement,
    parents: HaziExt.instance().getParents,
    parent: HaziExt.instance().getParent,
    getClass: HaziExt.instance().getClass,
    addClass: HaziExt.instance().addClass,
    removeClass: HaziExt.instance().removeClass,
    toggleClass: HaziExt.instance().toggleClass,
    getAttr: HaziExt.instance().getAttr,
    setAttr: HaziExt.instance().setAttr,
    checkAttr: HaziExt.instance().checkAttr,
    append: HaziExt.instance().appendEle,
    after: HaziExt.instance().afterEle,
    before: HaziExt.instance().beforeEle,
    addElement: HaziExt.instance().addElement,
    find: HaziExt.instance().find,
    ajax: HaziExt.instance().ajaxRequest,
    get: HaziExt.instance().getRequest,
    post: HaziExt.instance().postRequest,
    json: HaziExt.instance().getJson,
    jsonToStr: HaziExt.instance().jsonToStr,
    strToJson: HaziExt.instance().strToJson,
};
console.log(hJs);
```

## Support
We are provide [support forum]() for premium version users. You can join to support forum for submit any question after purchasing. Free version users support is limited on [github]().

## Release Notes
Check out the [release notes]()

## License
NextJs Framework have two different version. Free version has limited features and offers only admin option panel feature.  This framework is licensed 100% GPL.
