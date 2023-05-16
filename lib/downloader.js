const axios = require('axios');
const cheerio = require('cheerio');
const author = 'KilersBotz'

function cocofun(url) {
  return new Promise((resolve, reject) => {
    axios({url, method: "get",
      headers: {
        "Cookie": "client_id=1a5afdcd-5574-4cfd-b43b-b30ad14c230e",
        "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36",
      }
    }).then(data => {
      $ = cheerio.load(data.data)
      let json
      const res = $('script#appState').get()
      for(let i of res){
        if(i.children && i.children[0] && i.children[0].data){
          ress = i.children[0].data.split('window.APP_INITIAL_STATE=')[1]
          json = JSON.parse(ress)
        }
        const result = {
          topic: json.share.post.post.content ? json.share.post.post.content : json.share.post.post.topic.topic,
          caption: $("meta[property='og:description']").attr('content'),
          play: json.share.post.post.playCount,
          like: json.share.post.post.likes,
          share: json.share.post.post.share,
          duration: json.share.post.post.videos[json.share.post.post.imgs[0].id].dur,
          thumbnail: json.share.post.post.videos[json.share.post.post.imgs[0].id].coverUrls[0],
          watermark: json.share.post.post.videos[json.share.post.post.imgs[0].id].urlwm,
          no_watermark: json.share.post.post.videos[json.share.post.post.imgs[0].id].url
        }
        resolve(result)
      }
    }).catch(reject)
  })
}

async function twitter(url) {
    return new Promise(async (resolve, reject) => {
        const { data } = await axios.request("https://twdown.net/download.php", {
            method: "post",
            data: new URLSearchParams(Object.entries({URL: url})),
            headers: {
                "cookie": "_ga=GA1.2.1719370542.1656221221; _gid=GA1.2.1028366575.1656221221; _gat=1; __gads=ID=cd819a6c3b9f7043-22093ec7c4d30051:T=1656221221:RT=1656221221:S=ALNI_Maq2SzDvBkyA7woO7Z6fNoN2u5VcA; __gpi=UID=0000069511f3d3b8:T=1656221221:RT=1656221221:S=ALNI_Mbkzo4K9cEygIF4hr5wwsKcSobikQ",
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36",
            },
        });
        const $ = cheerio.load(data)
        result = {
            nickname: $('body > div.jumbotron > div > center > div.row > div > div:nth-child(1) > div:nth-child(2) > h4 > strong').text(),
            caption: $('body > div.jumbotron > div > center > div.row > div > div:nth-child(1) > div:nth-child(2) > p').text().trim(),
            thumbnail: $('body > div.jumbotron > div > center > div.row > div > div:nth-child(1) > div:nth-child(1) > img').attr('src'),
            quality_270: $('body > div.jumbotron > div > center > div.row > div > div:nth-child(5) > table > tbody > tr:nth-child(3) > td:nth-child(4) > a').attr('href'),
            quality_360: $('body > div.jumbotron > div > center > div.row > div > div:nth-child(5) > table > tbody > tr:nth-child(2) > td:nth-child(4) > a').attr('href'),
            quality_720: $('body > div.jumbotron > div > center > div.row > div > div:nth-child(5) > table > tbody > tr:nth-child(1) > td:nth-child(4) > a').attr('href'),
            mp3: 'https://twdown.net/' + $('body > div.jumbotron > div > center > div.row > div > div:nth-child(5) > table > tbody > tr:nth-child(4) > td:nth-child(4) > a').attr('href')
        }
        resolve(result)
    });
};

async function tiktok(query) {
  let res = await axios("https://lovetik.com/api/ajax/search", {
    method: "POST",
    data: new URLSearchParams(Object.entries({ query })),
  });
  let ini = res.data
  let result = {
        author: ini.author_name,
        title: ini.desc,
        play: ini.play_url,
        nowm: ini.links[0].a || ini.links[1].a,
        wm: ini.links[2].a,
        ori_sound: ini.links[3].a
  }
return result
}

module.exports = { cocofun, twitter, tiktok }