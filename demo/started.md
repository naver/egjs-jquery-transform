### Browser support
IE 10+, latest of Chrome/FF/Safari, iOS 7+ and Android 2.3+ (except 3.x)

### Quick steps to use:


#### Set up your HTML

``` html
<div id="area">
```

#### Load files or import library


##### ES5
``` html
{% for dist in site.data.egjs.dist %}
<script src="//{{ site.data.egjs.github.user }}.github.io/{{ site.data.egjs.github.repo }}/{{ dist }}"></script>
{% endfor %}
```

##### ES6+
```js
import "@egjs/transform";
```

### Initialize

```javascript
// Animate element infinitely
var $rectBox = $("#rectBox");

function rotate() {
	$rectBox.animate({"transform": "rotate(360deg)"}, "slow", rotate);
}

rotate();
```
