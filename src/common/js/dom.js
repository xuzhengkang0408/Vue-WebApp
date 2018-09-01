export function addClass(el,className){
	if (hasClass(el,className)){
		return 
	}
	let newClass =el.className.split(' ')
	newClass.push(className)
	el.className=newClass.join(' ')

}
export function hasClass(el,className){
	let reg= new RegExp('(^|\\s)'+className+'(\\s|$)')
	return reg.test(el.className)
}
export  function getClass(tagName,className){ 
  if(document.getElementsByClassName) //支持这个函数 
  {    return document.getElementsByClassName(className); 
  } 
  else
  {    var tags=document.getElementsByTagName(tagName);//获取标签 
    var tagArr=[];//用于返回类名为className的元素 
    for(var i=0;i < tags.length; i++) 
    { 
      if(tags[i].class == className) 
      { 
        tagArr[tagArr.length] = tags[i];//保存满足条件的元素 
      } 
    } 
    return tagArr; 
  } 
}

//获取data属性
export function getData(el,name,val){
	const prefix ='data-'
	name = prefix + name
	if(val){
		return el.setAttribute(name,val)
	}else{
		return el.getAttribute(name)
	}

}

let elementStyle = document.createElement('div').style
let vendor = (() => {
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }

  for (let key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key
    }
  }

  return false
})()

export function prefixStyle(style) {
  if (vendor === false) {
    return false
  }

  if (vendor === 'standard') {
    return style
  }

  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}
