export default function loadBMap () {
    return new Promise(function (resolve, reject) {
      if (typeof window.BMap !== 'undefined') {
        resolve(window.BMap)
        return true
      }
      window.onBMapCallback = function () {
        resolve(window.BMap)
      }
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src =
        "//api.map.baidu.com/getscript?type=webgl&v=1.0&ak=kn5uUi7MAsHnGhz8TBSYlSOZi0cLi6iq"
      script.onerror = reject
      document.head.appendChild(script)
    })
  }