### Demo

{% include_relative assets/html/demo.html %}

```js
// Animate element infinitely
var $rectBox = $("#rectBox");

function rotate() {
	$rectBox.animate({"transform": "rotate(360deg)"}, "slow", rotate);
}

rotate();
```
