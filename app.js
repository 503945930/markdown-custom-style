const fs = require('fs');
const cheerio = require('cheerio')


//读取html页面
fs.readFile('./public/test.html', 'utf8', (err, data) => {
  if (err) throw err;
  let $ = cheerio.load(data)
  $('style').remove();
  //读取模板样式
  fs.readFile('./src/style.css', 'utf8', (error, result) => {
    if (error) throw error;
    let W = cheerio.load(result)
    $("head").append(W.html())
    let title = $('h1').text()
    $('h1').remove();
    let content = $('body').html()

    let body = `
    <body  class="basic">
      <div class="container">
          <div class="row">
            <article class="col-md-8 no-featured-image post-3507 post type-post status-publish format-standard hentry category-skills tag-83 tag-620 tag-383 tag-286" >
              <h1 class="entry-title">${title}</h1>
              <div class="entry-content">
                ${content}
              </div>
            </article>
          </div>
        </div>
   </body>
  `
    //移除之前的body
    $("body").remove();
    $("html").append(body)
    //写入到文件
    fs.writeFile('article.html', $.html(), (err) => {
      if (err) throw err;
      console.log('success');
    });
  })
})
