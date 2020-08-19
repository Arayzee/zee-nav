let siteList = document.querySelector('#siteList')
let addButton = document.querySelector('#addIcon')
let option = document.querySelector('#option')
let searchInput = document.querySelector('#searchInput')
let submit = document.querySelector('#submit')
let siteData = JSON.parse(localStorage.getItem('siteData'))
let hashMap = siteData || [
  { url: 'https://segmentfault.com/', color: '#009A61' },
  { url: 'https://www.bilibili.com/', color: '#fb7299' },
  { url: 'https://www.zhihu.com/', color: '#0084ff' }
]
let showDelete = false

let simplifyUrl = (url) => {
  return url.replace('https://', '')
    .replace('http://', '')
    .replace('www.', '')
    .replace(/\/.*/, '')
}

let getRamdomLightColor = () => {
  let r = Math.floor(Math.random() * 255 + 1)
  let g = Math.floor(Math.random() * 255 + 1)
  let b = Math.floor(Math.random() * 255 + 1)
  while (r + g < 350 && r + b < 350 && g + b < 350 || r + g > 440 && r + b > 440 && g + b > 440) {
    r = Math.floor(Math.random() * 255 + 1)
    g = Math.floor(Math.random() * 255 + 1)
    b = Math.floor(Math.random() * 255 + 1)
  }
  return `rgb(${r}, ${g}, ${b})`
}

let createElement = (el) => {
  let template = document.createElement('template')
  template.innerHTML = el.trim()
  return template.content.firstChild
}

let render = () => {
  Array.from(siteList.children).forEach((x) => {
    if (x.className === 'site') {
      siteList.removeChild(x)
    }
  })
  hashMap.forEach((node, index) => {
    const simpleUrl = simplifyUrl(node.url)
    const li = createElement(`<li class="site">
    <div class="wrap" style="background: ${node.color}">
      <div class="logo">${simpleUrl[0].toUpperCase()}</div>
      <div class="title">${simpleUrl[0].toUpperCase() + simpleUrl.slice(1)}</div>
      <div class="delete" style="display: ${showDelete ? 'block' : 'none'}">
        <svg class="icon">
          <use xlink:href="#icon-delete"></use>
        </svg>
      </div>
    </div>
  </li>`)
    siteList.insertBefore(li, siteList.lastElementChild)
    li.querySelector('.wrap').addEventListener('click', () => {
      window.open(node.url)
    })
    li.querySelector('.delete').addEventListener('click', (e) => {
      e.stopPropagation()
      hashMap.splice(index, 1)
      localStorage.setItem('siteData', JSON.stringify(hashMap))
      render()
    })
  })
}

addButton.addEventListener('click', () => {
  let url = window.prompt('请输入要添加的网址')
  if (url) {
    if (url.indexOf('http') !== 0) {
      url = 'https://' + url
    }
    hashMap.push({
      url: url,
      color: getRamdomLightColor()
    })
    localStorage.setItem('siteData', JSON.stringify(hashMap))
    render()
  }
})

option.addEventListener('click', () => {
  showDelete = !showDelete
  render()
})

submit.addEventListener('click', () => {
  console.log(searchInput.value)
  window.open('https://www.baidu.com/s?wd=' + searchInput.value)
})

render()