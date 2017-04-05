# eg.Transform
A method extended from the jQuery animate() method. It supports CSS transform property and 3D acceleration.

## Documentation
* API Documentation
    - Latest: [http://naver.github.io/egjs/latest/doc/jQuery.html#animate](http://naver.github.io/egjs/latest/doc/jQuery.html#animate)
    - Specific version: [http://naver.github.io/egjs/[VERSION]/doc/jQuery.html#animate](http://naver.github.io/egjs/[VERSION]/doc/jQuery.html#animate)
* An advanced demo is under construction.

## Supported Browsers
The following table shows browsers supported by eg.Transform

|Internet Explorer|Chrome|Firefox|Safari|iOS|Android|
|---|---|---|---|---|---|
|10+|Latest|Latest|Latest|7+|2.3+(except 3.x)|



## Dependency
eg.Transform has the dependencies for the following libraries:

|[jquery](https://jquery.com)|
|----|
|1.7.0+|

## How to Use
### 1. Load dependency library before transform.js (or transform.min.js) load.
```html
<script src="../node_modules/jquery/jquery.js"></script>
```

### 2. Load transform.js
```html
<script src="../dist/transform.js"></script>
```

### 3. Make a target element
```html
<!-- Target DOM -->
<div id="area"></div>
```

### 4. Use eg.Transform
```javascript
var $el = $("#area");
$el.animate({"transform": "translate(100px) rotate(30deg)"});
```

## Bug Report

If you find a bug, please report it to us using the [Issues](https://github.com/naver/egjs-transform/issues) page on GitHub.


## License
eg.Transform is released under the [MIT license](http://naver.github.io/egjs/license.txt).

```
Copyright (c) 2015 NAVER Corp.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```
