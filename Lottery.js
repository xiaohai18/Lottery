(function(){
/**
 * Date: 2017/8/18
 * Email: 506713930@qq.com
 * Author: hishion
 * 
 * [Lottery 大转盘抽奖js插件, 无依赖, 简单易用]
 * @param  {[Dom Object]} oCanvas [canvas对象]
 * @param  {[Object]}     options [配置参数, 请参考底部的_setOptions方法中的config对象]
 */
function Lottery(){
    return this._init.apply(this, arguments);
}
Lottery.prototype = {
    _init: function(oCanvas, options){
        if(!oCanvas)return false;
        this.oCanvas  = oCanvas;
        this.options  = this._setOptions(options);
        this.size     = (this.options.products || []).length;
        this.angle    = 2 * Math.PI / this.size;
        this.sAngle   = 1.5*Math.PI - this.angle/2;
        this.ctx      = oCanvas.getContext("2d");

        this.rotate   = 0;
        /*存储图片元素*/
        this.oImages  = [];
        /*存储图片链接*/
        this.imgUrl   = [];
        this.isOver   = true;

        this._setLayout();
        this._fixOptions();

        this._draw();
        this._start();
        
        //this._resize();
    },
    /*修正options参数*/
    _fixOptions: function(){
        this.options.dpr   = this.options.dpr || 1;
        this.outerRadius   = parseInt(this.options.outerRadius) || this.radius;
        this.innerRadius   = parseInt(this.options.innerRadius) || 0;
        this.options.speed = Math.min(Math.max(5, this.options.speed), 30);

        if(String(this.options.font.y).indexOf('%') > 0){
            this.options.font.y = this.outerRadius * parseInt(this.options.font.y)/100;
        }
        
        if(String(this.options.images.y).indexOf('%') > 0){
            this.options.images.y = this.outerRadius * parseInt(this.options.images.y)/100;
        }
    },
    /*重置canvas尺寸*/
    _setLayout: function(){
        var oCanvas = this.oCanvas;
        var options = this.options;
        var iWidth  = oCanvas.offsetWidth;

        oCanvas.width  = iWidth;
        oCanvas.height = iWidth;
        oCanvas.style.height = iWidth + 'px';

        this.diameter = iWidth;
        this.radius   = iWidth/2;
    },
    /*获取文字的样式*/
    _getFontStyle: function(){
        var dpr = this.options.dpr;
        var fontStyle = this.options.font;
        return '{{style}} {{weight}} {{size}}/{{lineHeight}} {{family}}'.replace(/\{\{([^}]*)\}\}/g, function(a, b){
            return b == 'size' ? parseInt(fontStyle[b]) * dpr + 'px' : fontStyle[b];
        })
    },
    /*重置窗口*/
   /* _resize: function(){
        var self = this;
        window.addEventListener('resize', function(){
            self._setLayout();
            self._fixOptions();
            self._draw();
        }, false);
    },*/

    /*画扇形*/
    _drawArc: function(){
        this.ctx.save();
        var fillStyle = this.options.fillStyle;
        for(var i = 0; i < this.size; i++){
            var sAngle = this.sAngle + this.angle*i;
            this.ctx.beginPath();
            this.ctx.fillStyle = fillStyle[i%fillStyle.length];
            this.ctx.arc(this.radius, this.radius, this.innerRadius, sAngle, sAngle + this.angle, false);
            this.ctx.arc(this.radius, this.radius, this.outerRadius, sAngle + this.angle, sAngle, true);
            this.ctx.closePath();
            this.ctx.fill();
        }
        this.ctx.restore();
    },
    /*画扇形上的文字*/
    _drawText: function(){
        var fonts = this.options.font;
        for(var i = 0; i < this.size; i++){
            var textArr  = this._cleverBreak(this.options.products[i].name);
            this.ctx.save();
            this.ctx.translate(this.radius, this.radius);
            this.ctx.rotate(this.angle * i);
            this.ctx.fillStyle = fonts.color;
            this.ctx.font = this._getFontStyle();

            this.ctx.fillText(textArr[0], -this.ctx.measureText(textArr[0]).width/2, - fonts.y);

            if(textArr[1]){
                this.ctx.fillText(textArr[1], -this.ctx.measureText(textArr[1]).width/2, -(fonts.y - (parseInt(fonts.size)||12)));
            }
            this.ctx.restore();

            this.options.products[i].imgUrl && this.imgUrl.push(this.options.products[i].imgUrl);
        }
    },
    /*文字断行*/
    _cleverBreak: function(str){
        var res, keys = this.options.breakText;
        if(!str){return res}
        for(var i = 0; i < keys.length; i++){
            var idx = str.indexOf(keys[i]);
            if(idx > -1){
                res = [str.substr(0, idx), str.substr(idx)];
                break;
            }
        }
        return res || [str];
    },
    /*绘制图片*/
    _drawImg: function(){
        var self   = this, 
            width  = this.options.images.width,
            height = this.options.images.height;

        this._loadImg(this.imgUrl, function(img){
            for(var i = 0; i < img.length; i++){
                var ret = img[i], 
                    w   = (width || ret.width) * self.options.dpr,
                    h   = (height || ret.height) * self.options.dpr;

                self.ctx.save();
                self.ctx.translate(self.radius, self.radius);
                self.ctx.rotate(self.angle * i);
                self.ctx.drawImage(ret, -w/2 , -self.options.images.y, w, h);
                self.ctx.restore();
            };
        });
    },
    /*绘制画布*/
    _draw: function(){
        var options  = this.options,
            products = options.products,
            cx = this.cx, imgArr = [];

        this.ctx.clearRect(0, 0, this.diameter, this.diameter);
        this._drawArc();
        this._drawText();
        this._drawImg();
    },
    /*加载要绘制的图片*/
    _loadImg: function(srcArr, callback){
        var img  = document.createElement('img');
        var cur  = cur || 0;
        var self = this;

        if(!self.cur){
            self.cur = 0;
            self.oImages = [];
        }

        var src = srcArr[self.cur++];
        img.src = src + '?' + self.cur;

        img.onload = function(){
            self.oImages.push(this);
            if(self.cur < srcArr.length){
                self._loadImg(srcArr, callback);
            }else{
                self.cur = false;
                callback(self.oImages);
            }
            this.onload = false;
        };

        img.onerror = function(){
            //console.log(this.src);
        }
    },
    /*开始旋转转盘*/
    _beginRotate: function(){
        var self = this, iSpeed = this.options.speed;
        self.isOver = false;
        clearInterval(self.timer);
        self.timer = setInterval(function(){
            self.setRotateStyle(self.rotate + iSpeed);
            self.rotate += iSpeed;
        }, 30);
    },
    /*开始抽奖*/
    _start: function(){
        var self = this;
        if(!this.options.handler)return;
        this._fastClick(this.options.handler, function(ev){
            if(self.hasClass(this, 'disabled'))return;
            if(self.isOver){
                self._beginRotate();
                typeof self.options.handlerCallback === 'function' && self.options.handlerCallback.call(this, self);
            }
        });
    },
    _off: function(elemet, eventType, callback){
        elemet.removeEventListener(eventType, callback, false);
    },
    _fastClick: function(elemet, callback){
        if('ontouchstart' in document){
            elemet.addEventListener('touchstart', callback, false);
        }else{
            elemet.addEventListener('click', callback, false);
        }
    },
    /*简单的继承*/
    extend: function(source, distance){
        for(var attr in distance){
            if(distance[attr] !== undefined){
                source[attr] = distance[attr];
            }
        }
        return source;
    },
    /*设置旋转*/
    setRotateStyle: function(rotate){
        this.oCanvas.style.webkitTransform = 'rotate(' + rotate + 'deg)';
        this.oCanvas.style.mozTransform = 'rotate(' + rotate + 'deg)';
        this.oCanvas.style.oTransform = 'rotate(' + rotate + 'deg)';
        this.oCanvas.style.transform = 'rotate(' + rotate + 'deg)';
        this.rotate = rotate;
    },
    /*判断指定className是否存在*/
    hasClass: function(elemet, className){
        var cls = elemet.className;
        return !!cls.match(new RegExp('\\b' + className + '\\b'));
    },
    /*停止转动, idx为指定停止的位置*/
    stop: function(idx, callback){
        if(this.options.interval > 0){
            this._stop(idx, function(_interface){
                _interface.isOver = false;
                _interface.intervalTimer = setTimeout(function(){
                    _interface.isOver = true;
                    callback && callback(_interface);
                }, _interface.options.interval)
            });
        }else{
            this._stop.apply(this, arguments);
        }
    },
    _stop: function(idx, callback){
        var stopTimer  = null, self = this, iAngle = 360/self.size;
        var iTarget    = self.rotate + 360*5 + (self.size - idx - self.rotate%360/iAngle) * iAngle;
        var speedRatio = 35 - this.options.speed;

        this.timer && clearInterval(this.timer);
        function move(){
            var iSpeed = (iTarget - self.rotate)/speedRatio;
                iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);

            self.rotate += iSpeed;
            self.rotate >= iTarget && (self.rotate = iTarget, self.isOver = true);
            self.setRotateStyle(self.rotate);

            if(self.isOver){clearInterval(stopTimer); callback && callback(self);}
        }
        stopTimer = setInterval(move, 45);
    },
    /*设置配置项*/
    _setOptions: function(options){
        /*默认配置项*/
        var config = {
            /*点击抽奖元素*/
            handler: '',
            /*点击抽奖的回调*/
            handlerCallback: function(_interface){},
            outerRadius: 150,
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
                /*{
                    imgUrl: 'http://',
                    text: '苹果手机',
                }*/
            ]
        };
        return this.extend(config, options);
    }
};

window.Lottery = Lottery;
}());
