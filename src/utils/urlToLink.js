/* 
  function urlToLink(str) {
    //增加发图片功能
    var re = /\bhttps?:\/\/(?!\S+(?:jpe?g|png|bmp|gif|webp|gif))\S+/g;
    var re_forpic = /\bhttps?:\/\/.*?(\.gif|\.jpeg|\.png|\.jpg|\.bmp|\.webp)/g;
    str = str.replace(re, function (website) {
      return "<a href='" + website + "' target='_blank'> <i class='iconfont icon-lianjie-copy'></i>外部链接 </a>";
    });
    str = str.replace(re_forpic, function (imgurl) {
      return "<img src='" + imgurl + " 'target='_blank' data-fancybox='group' class='fancybox' /> ";
    });
    return str;
  } */

  function urlToLink(str) {
    // const qqWechatEmotionParser = require('qq-wechat-emotion-parser');
    const re =
      /\bhttps?:\/\/(?!\S+(?:jpe?g|png|bmp|gif|webp|gif|mp4))\S+/g;

    // 匹配html标签发布的图片
    const re_tagImg = /<img [^>]*src=['"]([^'"]+)[^>]*>/gm;
    str = str.replace(re_tagImg, function (raw, url, text, uuu) {
      return url;
    });
    // 处理markdown格式的图片
    const re_mdImg = /!\[(.*?)\]\((.*?)\)/gm;
    str = str.replace(re_mdImg, function (raw, text, url) {
      return url;
    });
    // 替换所有图片链接为图片
    //- QQ音乐和网易云音乐处理
    const re_forpic = /\bhttps?:[^:<>"]*\/([^:<>"]*)(\.(jpeg)|(png)|(jpg)|(webp))/g;
  /* Safari上音乐id匹配的正则方法不支持，导致报错无法展示，暂时去掉音乐解析功能
    const qq_music = /y\.qq\.com/g;
    const netease_music = /music\.163\.com/g;
  */
  //  const music_url = /[a-zA-z]+:\/\/[^\s]*/g;
  /*  
    const music_type = /(&songmid=)|(song\?id=)|(songDetail)/g;
    const music_id = /((?<=\?id=)(.*?)(?=&uct))|((?<=\&songmid=)(.*?)(?=&type))|((?<=\&id=)(.*?)(?=&ADTAG=))|((?<=playlist\?id=)(.*?)(?=&userid=))|(?<=playlist\/).*$|((?<=h5_playsong\&mid=)(.*?)(?=\&no_redirect))|((?<=songDetail\/)(.*?)(?=\?songtype=))/g;
      if (music_type.test(str)) {
            var type = 'song';
          } else {
            var type = 'playlist';
          }
      if (qq_music.test(str)) {
        var server = 'tencent';
        var music = str.match(music_id)
        str = str.replace(music_url, function (url) {
        return `<meting-js server="` + server + `" type="` + type + `" id="` + music + `"> </meting-js>`;
        });
      } else if (netease_music.test(str)) {
        var server = 'netease';
        var music = str.match(music_id)
        str = str.replace(music_url, function (url) {
        return `<meting-js server="` + server + `" type="` + type + `" id="` + music + `"> </meting-js>`;
        });
      } else {}
  */
    str = str.replace(re_forpic, function (url) {
      return `<a href="${url}" target="_blank" data-fancybox="group" class="fancybox">
      <img src="${url}" ></a>`;
    });
    str = str.replace(re, function (website) {
      return `<a href='${website}' rel='noopener' target='_blank'>↘外部链接↙</a>`;
    });
    if (window.qqWechatEmotionParser) {
      str = qqWechatEmotionParser(str);
    }
    return str;
  }

export default urlToLink