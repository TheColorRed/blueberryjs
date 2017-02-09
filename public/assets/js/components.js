var __extends=this&&this.__extends||function(d,b){function __(){this.constructor=d}for(var p in b)b.hasOwnProperty(p)&&(d[p]=b[p]);d.prototype=null===b?Object.create(b):(__.prototype=b.prototype,new __)},__awaiter=this&&this.__awaiter||function(thisArg,_arguments,P,generator){return new(P||(P=Promise))(function(resolve,reject){function fulfilled(value){try{step(generator.next(value))}catch(e){reject(e)}}function rejected(value){try{step(generator.throw(value))}catch(e){reject(e)}}function step(result){result.done?resolve(result.value):new P(function(resolve){resolve(result.value)}).then(fulfilled,rejected)}step((generator=generator.apply(thisArg,_arguments||[])).next())})},__generator=this&&this.__generator||function(thisArg,body){function verb(n){return function(v){return step([n,v])}}function step(op){if(f)throw new TypeError("Generator is already executing.");for(;_;)try{if(f=1,y&&(t=y[2&op[0]?"return":op[0]?"throw":"next"])&&!(t=t.call(y,op[1])).done)return t;switch(y=0,t&&(op=[0,t.value]),op[0]){case 0:case 1:t=op;break;case 4:return _.label++,{value:op[1],done:!1};case 5:_.label++,y=op[1],op=[0];continue;case 7:op=_.ops.pop(),_.trys.pop();continue;default:if(t=_.trys,!(t=t.length>0&&t[t.length-1])&&(6===op[0]||2===op[0])){_=0;continue}if(3===op[0]&&(!t||op[1]>t[0]&&op[1]<t[3])){_.label=op[1];break}if(6===op[0]&&_.label<t[1]){_.label=t[1],t=op;break}if(t&&_.label<t[2]){_.label=t[2],_.ops.push(op);break}t[2]&&_.ops.pop(),_.trys.pop();continue}op=body.call(thisArg,_)}catch(e){op=[6,e],y=0}finally{f=t=0}if(5&op[0])throw op[1];return{value:op[0]?op[1]:void 0,done:!0}}var f,y,t,_={label:0,sent:function(){if(1&t[0])throw t[1];return t[1]},trys:[],ops:[]};return{next:verb(0),throw:verb(1),return:verb(2)}},LoopType;!function(LoopType){LoopType[LoopType.None=0]="None",LoopType[LoopType.Repeat=1]="Repeat",LoopType[LoopType.PingPong=2]="PingPong"}(LoopType||(LoopType={}));var TweenType;!function(TweenType){TweenType[TweenType.Move=0]="Move",TweenType[TweenType.Scale=1]="Scale",TweenType[TweenType.Color=2]="Color"}(TweenType||(TweenType={}));var EaseType;!function(EaseType){EaseType[EaseType.EaseInBounce=0]="EaseInBounce",EaseType[EaseType.EaseOutBounce=1]="EaseOutBounce",EaseType[EaseType.EaseInOutBounce=2]="EaseInOutBounce",EaseType[EaseType.EaseInBack=3]="EaseInBack",EaseType[EaseType.EaseOutBack=4]="EaseOutBack",EaseType[EaseType.EaseInOutBack=5]="EaseInOutBack",EaseType[EaseType.EaseInElastic=6]="EaseInElastic",EaseType[EaseType.EaseOutElastic=7]="EaseOutElastic",EaseType[EaseType.EaseInOutElastic=8]="EaseInOutElastic",EaseType[EaseType.EaseInCirc=9]="EaseInCirc",EaseType[EaseType.EaseOutCirc=10]="EaseOutCirc",EaseType[EaseType.EaseInOutCirc=11]="EaseInOutCirc",EaseType[EaseType.EaseInExpo=12]="EaseInExpo",EaseType[EaseType.EaseOutExpo=13]="EaseOutExpo",EaseType[EaseType.EaseInOutExpo=14]="EaseInOutExpo",EaseType[EaseType.EaseInSine=15]="EaseInSine",EaseType[EaseType.EaseOutSine=16]="EaseOutSine",EaseType[EaseType.EaseInOutSine=17]="EaseInOutSine",EaseType[EaseType.EaseInQuint=18]="EaseInQuint",EaseType[EaseType.EaseOutQuint=19]="EaseOutQuint",EaseType[EaseType.EaseInOutQuint=20]="EaseInOutQuint",EaseType[EaseType.EaseInQuart=21]="EaseInQuart",EaseType[EaseType.EaseOutQuart=22]="EaseOutQuart",EaseType[EaseType.EaseInOutQuart=23]="EaseInOutQuart",EaseType[EaseType.EaseInQuad=24]="EaseInQuad",EaseType[EaseType.EaseOutQuad=25]="EaseOutQuad",EaseType[EaseType.EaseInOutQuad=26]="EaseInOutQuad",EaseType[EaseType.EaseInCubic=27]="EaseInCubic",EaseType[EaseType.EaseOutCubic=28]="EaseOutCubic",EaseType[EaseType.EaseInOutCubic=29]="EaseInOutCubic",EaseType[EaseType.Clerp=30]="Clerp",EaseType[EaseType.Spring=31]="Spring",EaseType[EaseType.Linear=32]="Linear"}(EaseType||(EaseType={}));var TweenFx=function(){function TweenFx(){}return TweenFx.easeInBounce=function(start,end,value){return end-=start,end-TweenFx.easeOutBounce(0,end,1-value)+start},TweenFx.easeOutBounce=function(start,end,value){return value/=1,end-=start,value<1/2.75?end*(7.5625*value*value)+start:value<2/2.75?(value-=1.5/2.75,end*(7.5625*value*value+.75)+start):value<2.5/2.75?(value-=2.25/2.75,end*(7.5625*value*value+.9375)+start):(value-=2.625/2.75,end*(7.5625*value*value+.984375)+start)},TweenFx.easeInOutBounce=function(start,end,value){return end-=start,value<.5?.5*TweenFx.easeInBounce(0,end,2*value)+start:.5*TweenFx.easeOutBounce(0,end,2*value-1)+.5*end+start},TweenFx.easeOut=function(start,end,value){return Mathf.lerp(start,end,Math.sin(value*Math.PI*.5))},TweenFx.easeInOut=function(start,end,value){return Mathf.lerp(start,end,value*value*(3-2*value))},TweenFx.easeInBack=function(start,end,value){end-=start,value/=1;var s=1.70158;return end*value*value*((s+1)*value-s)+start},TweenFx.easeOutBack=function(start,end,value){var s=1.70158;return end-=start,value=value/1-1,end*(value*value*((s+1)*value+s)+1)+start},TweenFx.easeInOutBack=function(start,end,value){var s=1.70158;return end-=start,value/=.5,value<1?(s*=1.525,end/2*(value*value*((s+1)*value-s))+start):(value-=2,s*=1.525,end/2*(value*value*((s+1)*value+s)+2)+start)},TweenFx.easeInElastic=function(start,end,value){end-=start;var p=.3,s=0,a=0;return 0==value?start:1==(value/=1)?start+end:(0==a||a<Math.abs(end)?(a=end,s=p/4):s=p/(2*Math.PI)*Math.asin(end/a),-(a*Math.pow(2,10*(value-=1))*Math.sin((1*value-s)*(2*Math.PI)/p))+start)},TweenFx.easeOutElastic=function(start,end,value){end-=start;var p=.3,s=0,a=0;return 0==value?start:1==(value/=1)?start+end:(0==a||a<Math.abs(end)?(a=end,s=p/4):s=p/(2*Math.PI)*Math.asin(end/a),a*Math.pow(2,-10*value)*Math.sin((1*value-s)*(2*Math.PI)/p)+end+start)},TweenFx.easeInOutElastic=function(start,end,value){end-=start;var p=.3,s=0,a=0;return 0==value?start:2==(value/=.5)?start+end:(0==a||a<Math.abs(end)?(a=end,s=p/4):s=p/(2*Math.PI)*Math.asin(end/a),value<1?-.5*(a*Math.pow(2,10*(value-=1))*Math.sin((1*value-s)*(2*Math.PI)/p))+start:a*Math.pow(2,-10*(value-=1))*Math.sin((1*value-s)*(2*Math.PI)/p)*.5+end+start)},TweenFx.easeInCirc=function(start,end,value){return end-=start,-end*(Math.sqrt(1-value*value)-1)+start},TweenFx.easeOutCirc=function(start,end,value){return value--,end-=start,end*Math.sqrt(1-value*value)+start},TweenFx.easeInOutCirc=function(start,end,value){return value/=.5,end-=start,value<1?-end/2*(Math.sqrt(1-value*value)-1)+start:(value-=2,end/2*(Math.sqrt(1-value*value)+1)+start)},TweenFx.easeInExpo=function(start,end,value){return end-=start,end*Math.pow(2,10*(value/1-1))+start},TweenFx.easeOutExpo=function(start,end,value){return end-=start,end*(-Math.pow(2,-10*value/1)+1)+start},TweenFx.easeInOutExpo=function(start,end,value){return value/=.5,end-=start,value<1?end/2*Math.pow(2,10*(value-1))+start:(value--,end/2*(-Math.pow(2,-10*value)+2)+start)},TweenFx.easeInSine=function(start,end,value){return end-=start,-end*Math.cos(value/1*(Math.PI/2))+end+start},TweenFx.easeOutSine=function(start,end,value){return end-=start,end*Math.sin(value/1*(Math.PI/2))+start},TweenFx.easeInOutSine=function(start,end,value){return end-=start,-end/2*(Math.cos(Math.PI*value/1)-1)+start},TweenFx.easeInQuint=function(start,end,value){return end-=start,end*value*value*value*value*value+start},TweenFx.easeOutQuint=function(start,end,value){return value--,end-=start,end*(value*value*value*value*value+1)+start},TweenFx.easeInOutQuint=function(start,end,value){return value/=.5,end-=start,value<1?end/2*value*value*value*value*value+start:(value-=2,end/2*(value*value*value*value*value+2)+start)},TweenFx.easeInQuart=function(start,end,value){return end-=start,end*value*value*value*value+start},TweenFx.easeOutQuart=function(start,end,value){return value--,end-=start,-end*(value*value*value*value-1)+start},TweenFx.easeInOutQuart=function(start,end,value){return value/=.5,end-=start,value<1?end/2*value*value*value*value+start:(value-=2,-end/2*(value*value*value*value-2)+start)},TweenFx.easeInCubic=function(start,end,value){return end-=start,end*value*value*value+start},TweenFx.easeOutCubic=function(start,end,value){return value--,end-=start,end*(value*value*value+1)+start},TweenFx.easeInOutCubic=function(start,end,value){return value/=.5,end-=start,value<1?end/2*value*value*value+start:(value-=2,end/2*(value*value*value+2)+start)},TweenFx.easeInQuad=function(start,end,value){return end-=start,end*value*value+start},TweenFx.easeOutQuad=function(start,end,value){return end-=start,-end*value*(value-2)+start},TweenFx.easeInOutQuad=function(start,end,value){return value/=.5,end-=start,value<1?end/2*value*value+start:(value--,-end/2*(value*(value-2)-1)+start)},TweenFx.clerp=function(start,end,value){var min=0,max=360,half=Math.abs((max-min)/2),retval=0,diff=0;return end-start<-half?(diff=(max-start+end)*value,retval=start+diff):end-start>half?(diff=-(max-end+start)*value,retval=start+diff):retval=start+(end-start)*value,retval},TweenFx.spring=function(start,end,value){return value=Mathf.clamp01(value),value=(Math.sin(value*Math.PI*(.2+2.5*value*value*value))*Math.pow(1-value,2.2)+value)*(1+1.2*(1-value)),start+(end-start)*value},TweenFx.animate=function(start,end,time,easeType){switch(void 0===easeType&&(easeType=EaseType.Linear),easeType){case EaseType.Linear:return Mathf.lerp(start,end,time);case EaseType.EaseInBounce:return TweenFx.easeInBounce(start,end,time);case EaseType.EaseOutBounce:return TweenFx.easeOutBounce(start,end,time);case EaseType.EaseInOutBounce:return TweenFx.easeInOutBounce(start,end,time);case EaseType.EaseInBack:return TweenFx.easeInBack(start,end,time);case EaseType.EaseOutBack:return TweenFx.easeOutBack(start,end,time);case EaseType.EaseInOutBack:return TweenFx.easeInOutBack(start,end,time);case EaseType.EaseInElastic:return TweenFx.easeInElastic(start,end,time);case EaseType.EaseOutElastic:return TweenFx.easeOutElastic(start,end,time);case EaseType.EaseInOutElastic:return TweenFx.easeInOutElastic(start,end,time);case EaseType.EaseInCirc:return TweenFx.easeInCirc(start,end,time);case EaseType.EaseOutCirc:return TweenFx.easeOutCirc(start,end,time);case EaseType.EaseInOutCirc:return TweenFx.easeInOutCirc(start,end,time);case EaseType.EaseInExpo:return TweenFx.easeInExpo(start,end,time);case EaseType.EaseOutExpo:return TweenFx.easeOutExpo(start,end,time);case EaseType.EaseInOutExpo:return TweenFx.easeInOutExpo(start,end,time);case EaseType.EaseInSine:return TweenFx.easeInSine(start,end,time);case EaseType.EaseOutSine:return TweenFx.easeOutSine(start,end,time);case EaseType.EaseInOutSine:return TweenFx.easeInOutSine(start,end,time);case EaseType.EaseInQuint:return TweenFx.easeInQuint(start,end,time);case EaseType.EaseOutQuint:return TweenFx.easeOutQuint(start,end,time);case EaseType.EaseInOutQuint:return TweenFx.easeInOutQuint(start,end,time);case EaseType.EaseInQuart:return TweenFx.easeInQuart(start,end,time);case EaseType.EaseOutQuart:return TweenFx.easeOutQuart(start,end,time);case EaseType.EaseInOutQuart:return TweenFx.easeInOutQuart(start,end,time);case EaseType.EaseInCubic:return TweenFx.easeInCubic(start,end,time);case EaseType.EaseOutCubic:return TweenFx.easeOutCubic(start,end,time);case EaseType.EaseInOutCubic:return TweenFx.easeInOutCubic(start,end,time);case EaseType.EaseInQuad:return TweenFx.easeInQuad(start,end,time);case EaseType.EaseOutQuad:return TweenFx.easeOutQuad(start,end,time);case EaseType.EaseInOutQuad:return TweenFx.easeInOutQuad(start,end,time);case EaseType.Clerp:return TweenFx.clerp(start,end,time);case EaseType.Spring:return TweenFx.spring(start,end,time)}},TweenFx}();Blueberry.register(function(_super){function Tween(){var _this=null!==_super&&_super.apply(this,arguments)||this;return _this.isRunning=!1,_this.reverse=!1,_this.percentage=0,_this.time=0,_this.initPos=Vector2.zero,_this.initScale=Vector2.zero,_this.runningTime=0,_this.settings={},_this.duration=_this.settings.duration||2,_this.easeType=_this.settings.easeType||EaseType.Linear,_this.loopType=_this.settings.loopType||LoopType.None,_this.units=_this.settings.units||"px",_this.endPos=new Vector2(_this.settings.endx||0,_this.settings.endy||0),_this}return __extends(Tween,_super),Tween.prototype.created=function(){this.isRunning=!1,this.percentage=0,this.time=0,this.initPos=Vector2.zero,this.runningTime=0,this.parent.style.set({position:"relative"}),this.style.set({position:"absolute"}),this.settings=eval("("+this.attrs.settings+")"),this.duration=this.settings.duration||2,this.easeType=this.settings.easeType||EaseType.Linear,this.loopType=this.settings.loopType||LoopType.None,this.units=this.settings.units||"px",this.endPos=new Vector2(this.settings.endx||0,this.settings.endy||0),this.tweenType==TweenType.Scale?this.endVector=this.settings.endScale||Vector2.one:this.tweenType==TweenType.Move&&(this.endVector=this.settings.endPos||Vector2.one)},Tween.prototype.update=function(){this.isRunning&&(this.reverse?this.percentage>0?this.tweenUpdate():this.tweenComplete():this.percentage<1?this.tweenUpdate():this.tweenComplete())},Tween.prototype.updatePercentage=function(){this.runningTime+=Time.deltaTime,this.reverse?(this.percentage=1-this.runningTime/this.duration,this.time-=Time.deltaTime/this.duration):(this.percentage=this.runningTime/this.duration,this.time+=Time.deltaTime/this.duration)},Tween.prototype.tweenUpdate=function(){switch(this.settings.tweenType){case TweenType.Move:this.moveTarget();break;case TweenType.Scale:this.scaleTarget()}this.updatePercentage()},Tween.prototype.tweenComplete=function(){if(this.loopType==LoopType.None)this.isRunning=!1;else switch(this.loopType){case LoopType.Repeat:this.percentage=0,this.runningTime=0,this.time=0,this.style.set({left:this.initPos.x.toString()+this.units,top:this.initPos.y.toString()+this.units});break;case LoopType.PingPong:this.reverse=!this.reverse,this.runningTime=0}},Tween.prototype.moveTarget=function(){var end=(this.settings.startPos||Vector2.zero,this.endPos||Vector2.zero);this.style.set({left:TweenFx.animate(this.initPos.x,end.x,this.time,this.easeType).toString()+this.units,top:TweenFx.animate(this.initPos.y,end.y,this.time,this.easeType).toString()+this.units})},Tween.prototype.scaleTarget=function(){var end=this.settings.endScale||Vector2.one;this.style.set({width:TweenFx.animate(this.initScale.x,end.x,this.time,this.easeType).toString()+this.units,height:TweenFx.animate(this.initScale.y,end.y,this.time,this.easeType).toString()+this.units})},Tween.prototype.start=function(){this.isRunning=!0},Tween.prototype.stop=function(){this.isRunning=!1},Tween.prototype.toggle=function(){this.isRunning=!this.isRunning},Tween}(Component)),Blueberry.register(function(_super){function Number(){return null!==_super&&_super.apply(this,arguments)||this}return __extends(Number,_super),Number.prototype.created=function(){this.dom.content(this.toNumber(this.dom.value))},Number.prototype.input=function(value){this.dom.content(this.toNumber(value))},Number.prototype.toNumber=function(value){return value.replace(/[^0-9-.]/g,"").replace(/(?!^)-/g,"").replace(/(\..*)\.$/,"$1").replace(/\.(?=.*\.)/g,"")},Number}(Component)),Blueberry.register(function(_super){function Letter(){return null!==_super&&_super.apply(this,arguments)||this}return __extends(Letter,_super),Letter.prototype.created=function(){this.dom.content(this.toLetter(this.dom.value))},Letter.prototype.input=function(value){this.dom.content(this.toLetter(value))},Letter.prototype.toLetter=function(value){return value.replace(/[^a-zA-Z ]/g,"")},Letter}(Component)),Blueberry.register(function(_super){function ImageBlend(){var _this=null!==_super&&_super.apply(this,arguments)||this;return _this._settings=[],_this._master={canvas:null,context:null},_this._canvases=[],_this}return __extends(ImageBlend,_super),ImageBlend.prototype.created=function(){var _this=this;this._master.canvas=document.createElement("canvas"),this._master.context=this._master.canvas.getContext("2d"),this._settings=eval("("+this.attrs.settings+")"),this._settings.forEach(function(setting){var cvs=document.createElement("canvas"),ctx=cvs.getContext("2d");_this._canvases.push({canvas:cvs,context:ctx,settings:setting})})},ImageBlend.prototype.ready=function(){return __awaiter(this,void 0,void 0,function(){var i,l,item,img,canvas;return __generator(this,function(_a){switch(_a.label){case 0:i=0,l=this._canvases.length,_a.label=1;case 1:return i<l?(item=this._canvases[i],[4,this.loadImage(item.settings.url)]):[3,4];case 2:img=_a.sent(),item.canvas.width=img.width,item.canvas.height=img.height,item.context.drawImage(img,0,0),0==i?(this._master.canvas.width=img.width,this._master.canvas.height=img.height,this._master.context.drawImage(item.canvas,0,0)):(canvas=this.blend(this._master.canvas,item.canvas,item.settings.blendType),this._master.context.drawImage(canvas,0,0)),_a.label=3;case 3:return i++,[3,1];case 4:return this.dom.html('<img src="'+this._master.canvas.toDataURL()+'">'),[2]}})})},ImageBlend.prototype.loadImage=function(url){return new Promise(function(resolve){var img=new Image;img.src=url,img.onload=function(){resolve(img)}})},ImageBlend.prototype.blend=function(a,b,blendType){var can=document.createElement("canvas");can.width=a.width,can.height=a.height;for(var ctx=can.getContext("2d"),ad=a.getContext("2d").getImageData(0,0,a.width,a.height).data,bd=b.getContext("2d").getImageData(0,0,b.width,b.height).data,d=ctx.createImageData(a.width,a.height),i=0,l=ad.length;i<l;i+=4){var c=Color.blend(new Color(ad[i],ad[i+1],ad[i+2],ad[i+3]),new Color(bd[i],bd[i+1],bd[i+2],bd[i+3]),blendType);d.data[i+0]=c.r,d.data[i+1]=c.g,d.data[i+2]=c.b,d.data[i+3]=c.a}return ctx.putImageData(d,0,0),can},ImageBlend}(Component));