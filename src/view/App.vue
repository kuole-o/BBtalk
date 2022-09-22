<template>
  <main id="app">
    <p class="tip">共计发送 {{ count }} 条说说</p>
    <div class="timenode wow animate__zoomIn" v-for="item in contents" v-cloak>
      <div class="card-name">
        <div class="avatar">
          <img :src="avatar" class="avatar-img" />
        </div>
        <div class="name">{{ name }}</div>
        <svg class="is-badge" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
          <path
            d="m512 268c0 17.9-4.3 34.5-12.9 49.7s-20.1 27.1-34.6 35.4c.4 2.7.6 6.9.6 12.6 0 27.1-9.1 50.1-27.1 69.1-18.1 19.1-39.9 28.6-65.4 28.6-11.4 0-22.3-2.1-32.6-6.3-8 16.4-19.5 29.6-34.6 39.7-15 10.2-31.5 15.2-49.4 15.2-18.3 0-34.9-4.9-49.7-14.9-14.9-9.9-26.3-23.2-34.3-40-10.3 4.2-21.1 6.3-32.6 6.3-25.5 0-47.4-9.5-65.7-28.6-18.3-19-27.4-42.1-27.4-69.1 0-3 .4-7.2 1.1-12.6-14.5-8.4-26-20.2-34.6-35.4-8.5-15.2-12.8-31.8-12.8-49.7 0-19 4.8-36.5 14.3-52.3s22.3-27.5 38.3-35.1c-4.2-11.4-6.3-22.9-6.3-34.3 0-27 9.1-50.1 27.4-69.1s40.2-28.6 65.7-28.6c11.4 0 22.3 2.1 32.6 6.3 8-16.4 19.5-29.6 34.6-39.7 15-10.1 31.5-15.2 49.4-15.2s34.4 5.1 49.4 15.1c15 10.1 26.6 23.3 34.6 39.7 10.3-4.2 21.1-6.3 32.6-6.3 25.5 0 47.3 9.5 65.4 28.6s27.1 42.1 27.1 69.1c0 12.6-1.9 24-5.7 34.3 16 7.6 28.8 19.3 38.3 35.1 9.5 15.9 14.3 33.4 14.3 52.4zm-266.9 77.1 105.7-158.3c2.7-4.2 3.5-8.8 2.6-13.7-1-4.9-3.5-8.8-7.7-11.4-4.2-2.7-8.8-3.6-13.7-2.9-5 .8-9 3.2-12 7.4l-93.1 140-42.9-42.8c-3.8-3.8-8.2-5.6-13.1-5.4-5 .2-9.3 2-13.1 5.4-3.4 3.4-5.1 7.7-5.1 12.9 0 5.1 1.7 9.4 5.1 12.9l58.9 58.9 2.9 2.3c3.4 2.3 6.9 3.4 10.3 3.4 6.7-.1 11.8-2.9 15.2-8.7z"
            fill="#1da1f2"></path>
        </svg>
        <div class="time">
        <p>
          <time v-bind:datetime="item.attributes.time" :title="item.attributes.Time">
          {{item.attributes.time}}
            </time>
        </p>
      </div>
      </div>
      <div class="body">
        <div class="bbtalk-content">
        <p v-html="item.attributes.content"></p>
      </div>
      <div class="bbtalk-from">
        <span v-html="item.attributes.from"></span>
      </div>
      </div>
    </div>
<!--     <div class="load-ctn">
      <a class="btn" v-on:click="loadMore" v-if="contents" v-cloak>再翻翻</a>
      <p class="tip" v-else>正在加载中…</p>
    </div> -->
    <button class="next" v-on:click="loadMore" v-if="contents.length < count" v-cloak>再翻翻</button>
    <div class="loading" style="text-align: center; margin-top: 20px" v-if="contents.length < 0" v-cloak>{{message}}</div>
  </main>
</template>


<script>
import { urlToLink, format } from "../utils";
const BB_Data = require("leancloud-storage");
var { Query } = BB_Data;
var bb_content;
export default {
  props: ['name', 'avatar', 'fromColor','loadingImg'],
  data() {
    return {
      count: 0,
      page: 0,
      contents: [],
      message: '正在加载...',
      fromColor: '',
      loadingImg: 'https://7.dusays.com/2021/03/04/d2d5e983e2961.gif',
    };
  },
  methods: {
    getContent(page) {
      if (this.contents.length == 0) {
        BB_Data.init({
          appId: this.$bbtalk.appId,
          appKey: this.$bbtalk.appKey,
          serverURLs: this.$bbtalk.serverURLs,
        });
        
        bb_content = new BB_Data.Query("content");
      }
      var pageSize = this.$bbtalk.pageSize
      const _this = this;

      bb_content
        .descending("createdAt")
        .skip(page * (pageSize || 10))
        .limit(pageSize || 10)
        .find()
        .then(
          function (res) {
            if (res.length == 0) {
              console.log("已加载全部闪念");
            } else {
              let resC = res;
              resC.forEach((i) => {
                let dateTmp = new Date(i.createdAt);
                i.attributes.time = format(dateTmp, 'zh_CN');
                i.attributes.Time = dateTmp.getFullYear()+'-'+(dateTmp.getMonth()+1)+'-'+dateTmp.getDate() +' '+dateTmp.getHours()+':'+dateTmp.getMinutes()+':'+dateTmp.getSeconds();
                i.attributes.content = urlToLink(i.attributes.content);
                _this.contents.push(i);
              });
            }
          },
          function (error) {
            console.log(error);
          }
        );

      bb_content.count().then(
        function (count) {
          _this.count = count;
        },
        function (error) {
          console.log(error);
        }
      );
    },
    loadMore() {
      this.getContent(++this.page);
    },
  },
  mounted() {
    this.getContent(this.page);
    this.name = this.$bbtalk.name;
    this.avatar = this.$bbtalk.avatar;
    this.fromColor = this.$bbtalk.fromColor;
    this.loadingImg = this.$bbtalk.loadingImg;
  },
};
</script>


<style>
@font-face {
  font-family: "iconfont";
  src: url("//at.alicdn.com/t/font_1755564_z4mhxbw13mq.eot?t=1586882866168");
  /* IE9 */
  src: url("//at.alicdn.com/t/font_1755564_z4mhxbw13mq.eot?t=1586882866168#iefix")
      format("embedded-opentype"),
    /* IE6-IE8 */
      url("data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAALcAAsAAAAAB2gAAAKPAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCCfgqCUII8ATYCJAMMCwgABCAFhG0HQBuEBsiuMRkynL4YFCHtLKs4b+k7/80U8DwHIB6+xtr7u3vniDZI6tmnkyDS8NC5iFgJlE7pTPcO8e5b+803aYQy8YtH1JPKyZzY3ttb1EonioVGSBAiRJp4JV9cFppCxLpe2z8sUs37O4QEDFRM0lFeAw4XN6bQPG06zTG8DRwHFOBeGEVWIjE+mP8wduVFPCbQNK4ktN8/OgFJhbEqEFemLkEyFVcUVqoL1ZKDRbyIqafb9AA8+9+PX41IklQyY+PBSZ8KnR+9iBx0OxZcp8PxvGDHyFgACnFY6j8QCfMLIppKPmoCrGtW8OG/y0eufLX/8AiJqDKa22AGWpMzUth6p6aARySQQRUUL4AnSBmuyvIwPdbz21OX5ybO5duOJifaLl6cvkrd1HR7kWEy6yikff29PvgO17V/Tf/9f/oN3PDqz22a719IYlZJHQetpLY08MV6fwFDrF0B6F4XyB3/FyEEnZnU2XGtVwHvpxtA1d6pftKB4AcoWo4U1QQbiiy35Xow27whbwK2NNFlhAc99zeOtM4S6ikFQ1IzhqxuglAoC6ho2UBV3Raa5g0cbxnCRURpYM4pQOh3h6TXG7J+j4RCeULFqFdU9UcETYfRdGHLVJjpHk6SIBXlTTQV5mmWS6SD1jHSVx2JJ1U+a4p4YKawvrSSLQ2QR3yMLcGa3hBCQ40zF/vBc+Q4DH3OLFJExRDCb64un5S9qaIwF9L2cEQiEBWSbUImBePR3PFCOvf5MUS3yiHhNR0VySmEC5jTo7qKWgvCgN5r1XEtrwTW6BoEQYM0HONC/cBLHDPPIL98noUohAqjR7uvWVV1HlVbfWV+o/t8J6DJOJ4jRY6idmVKnmVS1q8tK8zfBAAA")
      format("woff2"),
    url("//at.alicdn.com/t/font_1755564_z4mhxbw13mq.woff?t=1586882866168")
      format("woff"),
    url("//at.alicdn.com/t/font_1755564_z4mhxbw13mq.ttf?t=1586882866168")
      format("truetype"),
    /* chrome, firefox, opera, Safari, Android, iOS 4.2+ */
      url("//at.alicdn.com/t/font_1755564_z4mhxbw13mq.svg?t=1586882866168#iconfont")
      format("svg");
  /* iOS 4.1- */
}
#app img {
  display: block;
}
.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-lianjie:before {
  content: "\e6a3";
}

.icon-lianjie-copy:before {
  content: "\e6a4";
}

/* bb样式 */
div.timenode {
  position: relative;
  padding: 10px 20px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 3px 8px 6px rgba(7, 17, 27, 0.06);
  overflow: hidden;
  margin-top: 32px;
  user-select: none;
}
div.timenode:hover {
  box-shadow: 0 2px 10px 5px rgba(7, 17, 27, 0.16);
  transition: all .15s ease-in-out;
}
div.timenode:last-child:after {
  height: calc(100% - 26px - 16px);
  border-bottom-left-radius: 2px;
  border-bottom-right-radius: 2px;
}
div.timenode .time,
div.timenode .body {
  max-width: calc(100% - 24px);
}
div.timenode .time {
  position: relative;
  color: var(--color-meta);
  font-size: 12px;
  line-height: 32px;
  height: 32px;
  margin-left: 10px;
  cursor: pointer;
}
div.timenode .time p {
  font-weight: bold;
  margin: 0 0 0 24px;
}
div.timenode .body {
  margin: 24px;
  padding: 16px;
  border-radius: 8px;
  background: var(--color-block);
  display: block;
  min-width: 210px;
}
div.timenode .body:empty {
  display: none;
}
div.timenode .body > *:first-child {
  margin-top: 0.25em;
}
div.timenode .body > *:last-child {
  margin-bottom: 0.25em;
}
div.timenode .body .highlight {
  border: 1px solid #e4e4e4;
}
div.timenode:hover .time {
  color: var(--color-text);
}
div.timenode:hover .time:before {
  background: rgba(255, 87, 34, 0.5);
}
div.timenode:hover .time:after {
  background: #ff5722;
  transform: scale(1);
}
div.timenode .body {
  margin: 0 24px;
  padding: 0 16px 16px 16px;
  border-radius: 8px;
/*   background: #f6f6f6; */
  display: block;
}
div.timenode .card-name {
  display: flex;
  align-items: center;
  margin: 15px 5px 15px 15px;
}
div.timenode .card-name .is-badge {
  height: 20px;
  width: 20px;
  margin-left: 5px;
}
div.timenode .card-name .avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 10px;
}
div.timenode .card-name .avatar-img {
  width: 100%;
  height: unset;
  border-radius: 50%;
}
div.timenode .bbtalk-from {
    background-color: #f596aa;
    color: #fff;
    font-weight: 600;
    border-radius: 4px;
    box-shadow: inset 0 -1px 0 rgb(27 31 35 / 12%);
    padding: 0 8px 2px 2px;
    width:fit-content;
    width:-webkit-fit-content;
    width:-moz-fit-content;
}
div.timenode .loading {
  text-align: center;
}
@keyframes Gradient {
  0% {
    background-position: 0 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  to {
    background-position: 0 50%;
  }
}
button.next {
  cursor: pointer;
  color: #fff;
  border: 0;
  margin: 20px auto;
  border-radius: 0.3125rem;
  display: block;
  padding: 0 1rem;
  height: 40px;
  font-weight: 500;
  text-align: center;
  transition: all 0.5s ease-out;
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 1000% 1000%;
  animation: Gradient 90s linear infinite;
  outline: 0;
  box-shadow: 0 0px 5px 2px rgb(7 17 27 / 15%);
}
button.next:hover {
  box-shadow: 0 0px 8px 6px rgb(7 17 27 / 16%);
}
#app .load-ctn a{padding:8px 18px;background:#eaeded;border-radius:6px;color:#333}
#app .load-ctn  {padding-top:30px;cursor:pointer;}
</style>