/**
 * 对象转换成URL字符串
 */
export const urlEncode = (param, key, encode) => {
	  if(param==null) return '';  
	  var paramStr = '';  
	  var t = typeof (param);  
	  if (t == 'string' || t == 'number' || t == 'boolean') {  
	    paramStr += '&' + key + '=' + ((encode==null||encode) ? encodeURIComponent(param) : param);  
	  } else {  
	    for (var i in param) {  
	      var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);  
	      paramStr += urlEncode(param[i], k, encode);  
	    }  
	  }  
  	  return paramStr; 
}
/**
 * 判断浏览器是否支持html5本地存储
 */
export const localStorageSupport = () => {
	return (('localStorage' in window) && window['localStorage'] !== null)
}

/**
 * 存储一个新的localStorage记录
 * @param   {String}    name    key值
 * @param   {String}    content 内容
 */
export const setLocalStore = (name, content) => {
	if (!name) return;
	if (typeof content !== 'string') {
		content = JSON.stringify(content);
	}
	window.localStorage.setItem(name, content);
}

/**
 * 根据key值获取localStorage的一条记录
 * @param   {String}    name    key值
 */
export const getLocalStore = name => {
	if (!name) return;
	return window.localStorage.getItem(name);
}

/**
 * 根据key值删除localStorage的一条记录
 * @param   {String}    name    key值
 */
export const removeLocalStore = name => {
	if (!name) return;
	window.localStorage.removeItem(name);
}

/**
 * 存储一个新的sessionStorage记录
 * @param   {String}    name    key值
 * @param   {String}    content 内容
 */
export const setSessionStore = (name, content) => {
	if (!name) return;
	if (typeof content !== 'string') {
		content = JSON.stringify(content);
	}
	window.sessionStorage.setItem(name, content);
}

/**
 * 根据key值获取sessionStorage的一条记录
 * @param   {String}    name    key值
 */
export const getSessionStore = name => {
	if (!name) return;
	return window.sessionStorage.getItem(name);
}

/**
 * 根据key值删除sessionStorage的一条记录
 * @param   {String}    name    key值
 */
export const removeSessionStore = name => {
	if (!name) return;
	window.sessionStorage.removeItem(name);
}


/**
 * 去除数组中假值元素，比如undefined,null,0,"",NaN都是假值
 * @param   {Array}    arr
 * @return  {Array} 
 */
export const compactArray = arr => {
	var index=-1,
        resIndex=-1,
        result=[],
        len=arr?arr.length:0;
    while(++index<len){
        var value=arr[index];
        if(value){
            result[++resIndex]=value;
        }
    }
    return result;
}


/**
 * 判断非null,undefined和空字符以外的值
 * @param   {Mixed}    value
 * @return  {Boolean}
 */
export const isExpect = value => {
	return value!==null && value!==undefined && value!=='';
}

/**
 * ES5中使用全等===会出现以下情况
 * +0 === -0 //true
 * NaN === NaN // false
 * 此方法可以弥补这个缺陷
 * @param   {Mixed}   x
 * @param   {Mixed}   y
 */
export const is = (x, y) => {
	if (x === y) {
        // 针对+0 不等于 -0的情况
        return x !== 0 || 1 / x === 1 / y;
    }
    // 针对NaN的情况
    return x !== x && y !== y;
}


/**
 * 是否为正整数
 * @param   {Mixed}    value
 * @return  {Boolean} 
 */
export const isNumber  = (value) => {
	 var re = /^[0-9]+$/ ;
     return re.test(value)
}



/**
 * 是否为NaN
 * @param   {Mixed}    value
 * @return  {Boolean} 
 */
export const isNaN  = (value) => {
	  return (typeof value === 'number' && isNaN(value));
}

/**
 * 是否为字符串
 * @param   {Mixed}    value
 * @return  {Boolean} 
 */
export const isString  = (value) => {
	  return (typeof value === 'string');
}

/**
 * 复制对象，浅拷贝
 * @param {Object} obj
 * @return {Object} 返回新对象
 */
export const copyObject  = (obj) => {
	  return JSON.parse(JSON.stringify(obj));
}

/**
 * 复制对象，深拷贝
 * @param {Object} obj
 * @return {Object} 返回新对象
 */
export const deepCopy = (source) => {
	var result={};
	for (var key in source) {
		result[key] = typeof source[key]==='object'? this.deepcopy(source[key]): source[key];
	} 
   	return result; 
}

/**
 * 邮箱判断
 * @param   {String}   val
 * @return  {Boolean}
 */
export const isEmail = (val) => {
	var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
	if(!myreg.test(val))
	  {
	      return false;
	  }else{
	  	  return true;
	  }
}

/**
 * 判断一个对象是否为Dom对象
 * @param   {Object}   obj
 * @return  {Boolean}
 */
export const isDom  = (obj) => {
	return obj && obj.nodeType === 1 && typeof(obj.nodeName) == 'string';
}

/**
 * 将一组值转换为数组
 * @return  {Array} 
 */
export const arrayOf  = arr => {
	return arr.slice.call(arguments);
}

/**
 * 净字符转换成大写
 * @return  {String} 
 */
export const upperCase  = str => {
	const strUpperCase = str.replace(/\b\w+\b/g,function(word){
		return word.substring(0,1).toUpperCase() + word.substring(1);
	});
	return strUpperCase;
}

/**
 * 数组中查找某个元素是否存在
 * @return  {array} 
 */
export const getDictionaryFromArray  = (array,str) => {
	const newArray = array.find(function(value, index, arr) {
		if(typeof(value[str])=="undefined"){ 
			return false;
		} else{
			return true
		}
	})
	if(typeof(newArray)=="undefined"){ 
		return [];
	}else{
		return newArray[str];
	}
}

/*
 阻止事件冒泡
 * */
export const stopProp = (e) => {
	e = e || window.event;
	if(e.preventDefault) {
		e.preventDefault();
		e.stopPropagation();
	}else{
		e.returnValue = false;
		e.cancelBubble = true;
	}
}



/*
 将图片转换为base64格式
 * */
export const convertImgToBase64 = (url, callback, outputFormat) => {
	var canvas = document.createElement('CANVAS'),
	ctx = canvas.getContext('2d'),
	img = new Image;
	img.crossOrigin = 'Anonymous';
	img.onload = function(){
		canvas.height = img.height;
		canvas.width = img.width;
		ctx.drawImage(img,0,0);
		var dataURL = canvas.toDataURL(outputFormat || 'image/png');
		callback.call(this, dataURL);
		canvas = null; 
	};
	img.src = url;
}

