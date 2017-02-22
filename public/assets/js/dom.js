var __extends=this&&this.__extends||function(d,b){function __(){this.constructor=d}for(var p in b)b.hasOwnProperty(p)&&(d[p]=b[p]);d.prototype=null===b?Object.create(b):(__.prototype=b.prototype,new __)},DOMObject=function(_super){function DOMObject(element){var _this=_super.call(this)||this;return _this.id=Blueberry.uniqId(),element.setAttribute("bluberry-element-id",_this.id),_this.element=element,_this.object=_this,_this.dom=new Dom(element),_this.class=new Class(element),_this.style=new Style(element),_this.getComponents(),_this}return __extends(DOMObject,_super),Object.defineProperty(DOMObject.prototype,"components",{get:function(){return this._components},enumerable:!0,configurable:!0}),DOMObject.initElementsWithComponent=function(){var e=document.querySelectorAll("[component]"),elen=Blueberry.objects.length;loop:for(var i=0,l=e.length;i<l;i++){for(var j=0;j<elen;j++){var obj=Blueberry.objects[j];if(obj instanceof DOMObject&&e[i]==obj.element)continue loop}Blueberry.addElement(new DOMObject(e[i]))}},DOMObject.prototype.getComponents=function(){var comp=this.element.getAttribute("component");comp||(comp=this.element.getAttribute("data-component")),comp=comp?comp:"";for(var i=0,l=this.element.attributes.length;i<l;i++){var attr=this.element.attributes[i];attr.localName&&attr.name.match(/^comp-/)&&(comp+=" "+attr.localName.replace(/comp-/,"").replace(/-/g," ").capitalizeFirstLetter().replace(/ /g,""))}for(var comps=comp.replace(/\s\s+/g,"").trim().split(" "),i=0,l=comps.length;i<l;i++){var name_1=comps[i];if(name_1.length>0)try{var c=new Blueberry.registered[name_1];c.element=this.element,c.object=this,c.id=Blueberry.uniqId(),this.setProperties(c,this.element),c.dom=this.dom,c.class=this.class,c.style=this.style,c.parent=this.parent,this._components.push(c)}catch(e){console.warn("Could not find Component '"+name_1+"'. Did you forget to import it?")}}},DOMObject.prototype.setProperties=function(component,element){for(var i=0,l=element.attributes.length;i<l;i++){var attr=this.element.attributes[i];if(attr.name.match(/^comp-/)){var vals=attr.value.split(";");vals.forEach(function(val){if(0!=val.trim().length){var keyVal=val.trim().split(":",2);component[keyVal[0].trim()]=keyVal[1].trim()}})}}},DOMObject.prototype.hasComponents=function(element){var has=element.hasAttribute("component");return has||(has=element.hasAttribute("data-component")),has},Object.defineProperty(DOMObject.prototype,"parent",{get:function(){for(var pNode=this.element.parentNode,i=0,l=Blueberry.objects.length;i<l;i++){var obj=Blueberry.objects[i];if(obj instanceof DOMObject&&obj.element==pNode)return obj}var de=new DOMObject(pNode);return Blueberry.addElement(de),de},enumerable:!0,configurable:!0}),DOMObject.prototype.findClosestComponent=function(type){var component=null,item=this.element.closest("[component*="+type.prototype.constructor.name+"]");return Blueberry.objects.forEach(function(el){null==component&&el instanceof DOMObject&&el.components.forEach(function(comp){null==component&&comp instanceof type&&comp.element==item&&(component=comp)})}),component},DOMObject.prototype.findChildComponents=function(type){var list=new ComponentList,items=this.element.querySelectorAll("[component]");return Blueberry.objects.forEach(function(el){el instanceof DOMObject&&el.components.forEach(function(comp){for(var i=0,l=items.length;i<l;i++){var item=items[i];comp instanceof type&&comp.element==item&&list.add(comp)}})}),list},DOMObject.prototype.findChild=function(selector){for(var item=this.element.querySelector(selector),i=0,l=Blueberry.objects.length;i<l;i++){var obj=Blueberry.objects[i];if(obj instanceof DOMObject&&obj.element==item)return obj}var de=new DOMObject(item);return Blueberry.addElement(de),de},DOMObject.prototype.findChildren=function(selector){var items=this.element.querySelectorAll(selector),elements=new DOMObjectList;itemLoop:for(var i=0,l=items.length;i<l;i++){for(var item=items[i],j=0,len=Blueberry.objects.length;j<len;j++){var obj=Blueberry.objects[j];if(obj instanceof DOMObject&&obj.element==item){elements.add(obj);continue itemLoop}}var de=new DOMObject(item);Blueberry.addElement(de),elements.add(de)}return elements},DOMObject.toObject=function(element){for(var i=0,l=Blueberry.objects.length;i<l;i++)if(Blueberry.objects[i].element==element)return Blueberry.objects[i];var domObject=new DOMObject(element);return Blueberry.addElement(domObject),domObject},DOMObject.findById=function(id){for(var i=0,l=Blueberry.objects.length;i<l;i++)if(Blueberry.objects[i].elementId==id)return Blueberry.objects[i];return null},DOMObject.find=function(query,type){for(var elements=document.querySelectorAll(query),i=0,l=elements.length;i<l;i++)for(var element=elements[i],e=0,len=Blueberry.objects.length;e<len;e++){var el=Blueberry.objects[e];if(element==el.element)for(var c=0,len2=el.components.length;c<len2;c++)if(el.components[c]instanceof type)return el.components[c]}return null},DOMObject.findWithComponent=function(type){var elements=new DOMObjectList;return Blueberry.objects.forEach(function(el){el instanceof DOMObject&&el.components.forEach(function(comp){comp instanceof type&&elements.add(el)})}),elements},DOMObject.findComponents=function(type){var list=new ComponentList;return Blueberry.objects.forEach(function(el){el instanceof DOMObject&&el.components.forEach(function(comp){comp instanceof type&&list.add(comp)})}),list},DOMObject.prototype.instantiate=function(insert,element,output){var insertType="";switch(insert){case Insert.Before:insertType="beforebegin";break;case Insert.After:insertType="afterend";break;case Insert.Prepend:insertType="afterbegin";break;case Insert.Append:insertType="beforeend"}var de=null;if(output instanceof HTMLElement)element.insertAdjacentElement(insertType,output),de=new DOMObject(output);else if("string"==typeof output){var e=this.createElement(output);element.insertAdjacentElement(insertType,e),de=new DOMObject(e)}return DOMObject.initElementsWithComponent(),de},DOMObject.prototype.createElement=function(html){var div=document.createElement("div");return div.innerHTML=html,div.firstChild},DOMObject.prototype.onObserve=function(observable,element,component,key){if(element instanceof HTMLInputElement)element.value=observable[key];else if(element instanceof HTMLElement)element.innerText=observable[key];else if(element instanceof DOMObject)if(observable[key]instanceof Array){var finalTemplates=this.getFinalTemplates(element,component,observable,key);element.dom.html(finalTemplates.join(""))}else element.dom.content(observable[key])},DOMObject.prototype.getFinalTemplates=function(element,component,observable,key){var finalTemplates=[];if(component.templates&&component.templates[key]){var rootTemplate_1=component.templates[key],items_1=Blueberry.findTemplateItems(rootTemplate_1);observable[key].forEach(function(o,k,v){var template=rootTemplate_1;items_1.forEach(function(item){template="value"==item.value?template.replace(new RegExp(item.placeholder,"g"),o):"key"==item.value?template.replace(new RegExp(item.placeholder,"g"),k):template.replace(new RegExp(item.placeholder,"g"),component.get(key+"["+k+"]."+item.value))}),finalTemplates.push(template)})}else observable[key].forEach(function(item){element instanceof DOMObject&&finalTemplates.push(item)});return finalTemplates},DOMObject}(Addon),DOMObjectList=function(_super){function DOMObjectList(){return null!==_super&&_super.apply(this,arguments)||this}return __extends(DOMObjectList,_super),DOMObjectList}(ObjList),Insert;!function(Insert){Insert[Insert.Before=0]="Before",Insert[Insert.After=1]="After",Insert[Insert.Append=2]="Append",Insert[Insert.Prepend=3]="Prepend",Insert[Insert.Overwrite=4]="Overwrite"}(Insert||(Insert={}));var Dom=function(){function Dom(element){this.element=element}return Object.defineProperty(Dom.prototype,"value",{get:function(){return this.element instanceof HTMLInputElement?this.element.value:this.element.innerText},enumerable:!0,configurable:!0}),Dom.prototype.text=function(text){return this.element.innerHTML=text,this},Dom.prototype.html=function(html){return this.element.innerHTML=html,DOMObject.initElementsWithComponent(),this},Dom.prototype.append=function(html){return this.element.insertAdjacentHTML("beforeend",html),this},Dom.prototype.attr=function(key,value){if(1==arguments.length&&"object"==typeof key)for(var i in key)this.element.setAttribute(i,key[i]);else 2==arguments.length&&"string"==typeof key&&this.element.setAttribute(key,value);return this},Dom.prototype.content=function(data,insertType){if(insertType=insertType?insertType:Insert.Overwrite,data instanceof HTMLElement)insertType==Insert.Overwrite&&(this.element.innerHTML=data.outerHTML);else if(data instanceof HTMLCollection)for(insertType==Insert.Overwrite&&(this.element.innerHTML="");data.length>0;)this.element.appendChild(data[0]);else this.element instanceof HTMLInputElement?this.element.value=data:this.element instanceof HTMLElement&&(this.element.innerText=data);return this},Dom.prototype.fromTemplate=function(templateUrl,data,insertType){var _this=this;return Ajax.request(templateUrl).success(function(response){if("object"==typeof data){var finalTemp=document.createElement("div");for(var key in data){for(var newTemp=_this.getTemplate(response.data),items=newTemp.querySelectorAll("*"),value=data[key],i=0,l=items.length;i<l;i++){var item=items[i],observed=item.getAttribute("observe");observed&&(item.innerText=Blueberry.query(observed,value));for(var a=0,len=item.attributes.length;a<len;a++){for(var attrValue=item.attributes[a].value,attrName=item.attributes[a].name,regex=/\{\{(.+?)\}\}/g,m=void 0,v=attrValue;null!=(m=regex.exec(attrValue));)m.index===regex.lastIndex&&regex.lastIndex++,v=v.replace("{{"+m[1]+"}}",Blueberry.query(m[1],value));item.setAttribute(attrName,v)}}newTemp.firstChild&&finalTemp.appendChild(newTemp.firstChild)}_this.content(finalTemp.children,insertType)}}),this},Dom.prototype.disable=function(){return this.element.disabled=!0,this},Dom.prototype.enable=function(){return this.element.disabled=!1,this},Dom.prototype.getTemplate=function(template){var root=document.createElement("div");return root.innerHTML=template,root},Dom.find=function(selector){var item=document.querySelector(selector);if(item){for(var i=0,l=Blueberry.objects.length;i<l;i++){var obj=Blueberry.objects[i];if(obj instanceof DOMObject&&obj.element==item)return obj}var de=new DOMObject(item);return Blueberry.addElement(de),de}return null},Dom.findAll=function(selector){for(var elements=new DOMObjectList,items=document.querySelectorAll(selector),i=0,l=items.length;i<l;i++){for(var item=items[i],found=!1,j=0,len=Blueberry.objects.length;j<len;j++){var obj=Blueberry.objects[i];if(obj instanceof DOMObject&&obj.element==item){elements.add(obj),found=!0;break}}if(!found){var de=new DOMObject(item);Blueberry.addElement(de),elements.add(de)}}return elements},Dom.initElementsWithComponent=function(){var e=document.querySelectorAll("[component]"),elen=Blueberry.objects.length;loop:for(var i=0,l=e.length;i<l;i++){for(var j=0;j<elen;j++){var obj=Blueberry.objects[j];if(obj instanceof DOMObject&&e[i]==obj.element)continue loop}Blueberry.addElement(new DOMObject(e[i]))}},Dom}(),Class=function(_super){function Class(){return null!==_super&&_super.apply(this,arguments)||this}return __extends(Class,_super),Class.prototype.has=function(className){for(var classes=className.split(" "),i=0,l=classes.length;i<l;i++)if(this.element.classList.contains(classes[i]))return!0;return!1},Class.prototype.add=function(className){var _this=this;className.split(" ").forEach(function(c){_this.element.classList.add(c)})},Class.prototype.remove=function(className){var _this=this;className.split(" ").forEach(function(c){_this.element.classList.remove(c)})},Class.prototype.toggle=function(className){var _this=this;className.split(" ").forEach(function(c){_this.element.classList.toggle(c)})},Class}(Dom),Style=function(_super){function Style(){return null!==_super&&_super.apply(this,arguments)||this}return __extends(Style,_super),Style.prototype.set=function(key,value){if("string"==typeof key)this.element.style[key]=value;else for(var i in key)this.element.style[i]=key[i];return this},Style.prototype.remove=function(key){if("string"==typeof key)delete this.element.style[key];else for(var i in key)delete this.element.style[i];return this},Style}(Dom);Blueberry.registerAddon(function(_super){function DOMObjectAddon(){return null!==_super&&_super.apply(this,arguments)||this}return __extends(DOMObjectAddon,_super),DOMObjectAddon.prototype.init=function(){DOMObject.initElementsWithComponent()},DOMObjectAddon}(Addon));