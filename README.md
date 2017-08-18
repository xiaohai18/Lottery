#Lottery.js   
#html5移动端大转盘抽奖插件, 简单、易用、无依赖。

##step 1: 引入资源

```html
<canvas id="lottery" width="300" height="300"></canvas>
<button id="handler">开始抽奖</button>

<!-- Lottery Javascript file -->
<script src="Lottery.js"></script>
```

##step 2: 调用Lottery

````javascript

new Lottery(document.getElementById('lottery'), {
	handler: document.getElementById('handler'),
	handlerCallback: function(_interface){
		/*ajax获取中奖结果*/
		_ajax(function(response){
			/*指定停止的位置:索引*/
			_interface.stop(response.index, function(){
				console.log('恭喜你中得:' + response.name)
			});
		});
	},
	products: [
		{
			text: '小米电视',
			imgUrl: 'http://www.host.com/img1.png'
		},
		{
			text: '华为手机',
			imgUrl: 'http://www.host.com/img2.png'
		}
		...
	]
});
````


##构造函数 Lottery 的全部配置项.

````javascript

var _lottery = new Lottery(document.getElementById('lottery'),{
    /*点击抽奖元素*/
    handler: '',
    /*点击抽奖的回调*/
    handlerCallback: function(_interface){},
    /*外层半径,非数字值的时候自适应宽度*/
    outerRadius: 150,
    /*内层半径*/
    innerRadius: 0,
    /*循环填充数组颜色*/
    fillStyle: ['#ffdf8a', '#fffdc9'],
    /*请参考 flexible*/
    dpr: 1,
    /*重复触发的间距时间*/
    interval: 1000,
    /*速度5-30越大越快*/
    speed: 8,
    /*字体位置与样式*/
    font: {
        y: '50%',
        color: '#ee6500',
        style: 'normal',
        weight: 500,
        size: '12px',
        lineHeight: 1,
        family: 'Arail'
    },
    /*图片位置与尺寸*/
    images: {
        y: '88%',
        width: 32,
        height: 32
    },
    /*打断文字换行*/
    breakText: ['金币', '红包', '星豆'],
    /*礼物*/
    products: [
	{
		text: '小米电视',
		imgUrl: 'http://www.host.com/img1.png'
	},
	...
    ]
});

/*指定停止位置, index为索引 0-products.length */
_lottery.stop(index, function(){

});
````
