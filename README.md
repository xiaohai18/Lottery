#Lottery.js   
#html5移动端大转盘抽奖插件, 简单、易用、无依赖。

<p align="center">
    <img width="240px" src="https://raw.githubusercontent.com/hishion/Lottery/master/images/pic-preview.png">
</p>
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
    outerRadius: '',
    innerRadius: 0,
    /*循环填充数组颜色*/
    fillStyle: ['#ffdf8a', '#fffdc9'],
    /*重复触发的间距时间*/
    interval: 1000,
    /*速度越大越快*/
    speed: 12,
    /*运动最少持续时间*/
    duration: 3000,
    /*字体位置与样式*/
    /*画布显示缩放比例,值为1 安卓模糊*/
    scale: this.ua.isIos ? 1 : 4,
    /*字体样式,浅拷贝 需整个font对象传入*/
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
    breakText: ['金币', '红包'],
    /*礼物*/
    products: [
        /*{
            imgUrl: 'http://',
            text: '苹果手机',
        }*/
    ]
});

/*指定停止位置, index为索引 0-products.length */
_lottery.stop(index, function(){

});
````
