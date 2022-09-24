# guole.fun 自用说说修改版
使用`md`文件中如下需配置：
```html
<!-- 存放哔哔的容器 -->
<div id="bbtalk"></div>
<!-- 引用 bbtalk -->
<script src="/js/bbtalk.js"></script>
<script>
bbtalk.init({
  appId: "oSGXRO1S4ATpeXglumaTLDk7-********", //leancloud的AppID
  appKey: "wO0TdoiifUDDIW********",//leancloud的AppKey
  serverURLs: 'https://leancloud.guole.fun',//leancloud的severURLS，必须绑定域名，否则无法使用
  name: '夜的第八章', // 显示的昵称
  pageSize: 9, // 每次加载的条数，默认为5
  avatar: '/img/gl.jpg', // 头像地址
})
</script>
```
- 适配 butterfly图片灯箱；
- 增加wow动画（需网站本身引入wow.js）
- 样式调整
- 说说日期鼠标悬浮样式调整，用了两个颜色（适配暗色模式），直接复用效果异常，可在bb页面的md中加入以下内容：
```css
#app div.timenode time:hover:after {
  background: #333; /* 自定义背景色 */
  color: #fff; /* 自定义文字颜色 */
}
#app div.timenode time:hover:before {
  border: 6px dashed #333; /* #333 替换成自定义小三角填充色 */
  border-color: transparent transparent #333 transparent; /*  #333 替换成自定义小三角填充色 */
}
```

# BBtalk.JS

详细教程请移步 [使用文档](https://bb.js.org/) 

## 🎉特性
- 手机发送
- 方便引用



