#! /usr/bin/env node

const fs = require('fs');
const cheerio = require('cheerio')
const markdown = require( "markdown" ).markdown;
const program = require('commander');

program
  .version('0.0.1')
  .option('-d, --directory <directory>', 'Add peppers')
  .parse(process.argv);

//console.log('directory', program.directory);

if(program.directory){
  //读取html页面
  fs.readFile(program.directory, 'utf8', (err, data) => {
    if (err) throw err;

    //let html_content = markdown.toHTML(data);
    let html_content = markdown.toHTML(data);


    //console.log("html_content",html_content);

    let $ = cheerio.load(html_content,{
        decodeEntities: false
    })

    //console.log("data",$.html());

    //读取模板样式
    fs.readFile('./src/css/01/style.css', 'utf8', (error, result) => {
      if (error) throw error;
      let W = cheerio.load(result)



      let title = $('h1').text()
      $('h1').remove();
      let content = $.html()

      //移除之前的body
      $("body").remove();

      let html = `<!DOCTYPE html>
  <html>
       <head>
        <title>${title}</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <link href="//cdn.bootcss.com/highlight.js/9.7.0/styles/vs.min.css" rel="stylesheet">
        <style type="text/css">
        ${W.text()}
        </style>
        </head>
        <body  class="basic">
          <div class="container">
              <div class="row">
                <article class="col-md-12 no-featured-image post-3507 post type-post status-publish format-standard hentry category-skills tag-83 tag-620 tag-383 tag-286" >
                  <h1 class="entry-title">${title}</h1>
                  <div class="entry-content">
                    ${content}
                  </div>
                </article>
              </div>
            </div>
       </body>
       <script src="http://cdn.bootcss.com/highlight.js/8.0/highlight.min.js" charset="utf-8"></script>
       <script charset="utf-8">
       hljs.initHighlightingOnLoad();
       </script>
  </html>
    `

      //console.log('success',html);
      //写入到文件
      fs.writeFile(`./dist/${title}.html`,html, 'utf8',(err) => {
        if (err) throw err;
        console.log('success');
      });
    })
  })
}
