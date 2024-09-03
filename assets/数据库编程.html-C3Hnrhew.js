import{_ as i}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as s,o as e,d as a}from"./app-BMjEBszc.js";const n={},t=a(`<h2 id="_0x01-sql流程语句" tabindex="-1"><a class="header-anchor" href="#_0x01-sql流程语句"><span>0x01 SQL流程语句</span></a></h2><p><strong>声明变量</strong><code>Declare @变量名</code></p><p><strong>赋值</strong><code>Set @变量名=值</code></p><p><strong>流程控制</strong></p><div class="language-sql line-numbers-mode" data-highlighter="shiki" data-ext="sql" data-title="sql" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">If</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> case</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> when</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">while</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> begin</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> end</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_0x02-存储过程" tabindex="-1"><a class="header-anchor" href="#_0x02-存储过程"><span>0x02 存储过程</span></a></h2><p><strong>存储过程类型</strong></p><ul><li>系统存储过程</li><li>用户自定义存储过程 <ul><li>SQL <ul><li>SQL 存储过程是指保存的 SQL 语句集合，可以接受和返回用户提供的参数</li></ul></li><li>CLR <ul><li>CLR 存储过程是指对 Microsoft .NET Framework 公共语言运行时 (CLR) 方法的引用，可以接受和返回用户提供的参数</li></ul></li></ul></li></ul><hr><p><strong>创建存储过程</strong></p><div class="language-sql line-numbers-mode" data-highlighter="shiki" data-ext="sql" data-title="sql" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">CREATE</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> PROCEDURE</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> procedure_name</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    [ { </span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">@parameter</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> data_type }</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">        [ VARYING ]</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> [ = default ]</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> [ [ OUT [ PUT ]</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    ] </span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">[ ,...n ]</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">[ WITH ENCRYPTION ]</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">AS</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">{</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">[ BEGIN ]</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> statements </span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">[ END ][;][ ...n ]</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>调用存储过程</strong></p><div class="language-sql line-numbers-mode" data-highlighter="shiki" data-ext="sql" data-title="sql" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">Execute</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> procedure_name</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> [ @parameter = ]</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> { </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">value</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> }     </span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">      [ ,...n ]</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="sql游标" tabindex="-1"><a class="header-anchor" href="#sql游标"><span>SQL游标</span></a></h2><p>游标<code>Cursor</code></p><ol><li>定义  <code>Declare 游标名 Cursor for select ... from</code></li><li>打开  <code>open 游标名</code></li><li>取内容 <code>Fetch Next from 游标名 into 变量名</code></li></ol><div class="language-sql line-numbers-mode" data-highlighter="shiki" data-ext="sql" data-title="sql" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#A0A1A7;--shiki-dark:#7F848E;--shiki-light-font-style:italic;--shiki-dark-font-style:italic;">-- @@Fetch_Status 0-未到达尾部 -1-到达尾部</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">while</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(@@Fetch_Status </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> 0</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">) </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">begin</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">  ...,</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">Fetch</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> Next</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> from</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 游标名 </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">into</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 变量名,...</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">end</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">   \`\`\`</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">   </span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">   4. 关闭 \`</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">close</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 游标名</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">\`</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">   5. 释放 \`</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">deallocate</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> 游标名</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">\`</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,17),l=[t];function h(r,p){return e(),s("div",null,l)}const o=i(n,[["render",h],["__file","数据库编程.html.vue"]]),c=JSON.parse('{"path":"/notes/%E6%95%B0%E6%8D%AE%E5%BA%93/%E6%95%B0%E6%8D%AE%E5%BA%93%E7%BC%96%E7%A8%8B.html","title":"数据库编程","lang":"zh-CN","frontmatter":{"title":"数据库编程","cover":"/assets/images/cover3.jpg","icon":"paper-plane","order":4,"author":"Mr.Liu","category":["笔记"],"tag":["数据库"],"sticky":false,"star":false,"footer":"箱根山岳险天下","copyright":"无版权","description":"0x01 SQL流程语句 声明变量 Declare @变量名 赋值 Set @变量名=值 流程控制 0x02 存储过程 存储过程类型 系统存储过程 用户自定义存储过程 SQL SQL 存储过程是指保存的 SQL 语句集合，可以接受和返回用户提供的参数 CLR CLR 存储过程是指对 Microsoft .NET Framework 公共语言运行时 (C...","head":[["meta",{"property":"og:url","content":"https://fancxx.github.io/my-blog/notes/%E6%95%B0%E6%8D%AE%E5%BA%93/%E6%95%B0%E6%8D%AE%E5%BA%93%E7%BC%96%E7%A8%8B.html"}],["meta",{"property":"og:site_name","content":"Funcxx"}],["meta",{"property":"og:title","content":"数据库编程"}],["meta",{"property":"og:description","content":"0x01 SQL流程语句 声明变量 Declare @变量名 赋值 Set @变量名=值 流程控制 0x02 存储过程 存储过程类型 系统存储过程 用户自定义存储过程 SQL SQL 存储过程是指保存的 SQL 语句集合，可以接受和返回用户提供的参数 CLR CLR 存储过程是指对 Microsoft .NET Framework 公共语言运行时 (C..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://fancxx.github.io/my-blog/assets/images/cover3.jpg"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-09-03T08:57:01.000Z"}],["meta",{"name":"twitter:card","content":"summary_large_image"}],["meta",{"name":"twitter:image:src","content":"https://fancxx.github.io/my-blog/assets/images/cover3.jpg"}],["meta",{"name":"twitter:image:alt","content":"数据库编程"}],["meta",{"property":"article:author","content":"Mr.Liu"}],["meta",{"property":"article:tag","content":"数据库"}],["meta",{"property":"article:modified_time","content":"2024-09-03T08:57:01.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"数据库编程\\",\\"image\\":[\\"https://fancxx.github.io/my-blog/assets/images/cover3.jpg\\"],\\"dateModified\\":\\"2024-09-03T08:57:01.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Mr.Liu\\"}]}"]]},"headers":[{"level":2,"title":"0x01 SQL流程语句","slug":"_0x01-sql流程语句","link":"#_0x01-sql流程语句","children":[]},{"level":2,"title":"0x02 存储过程","slug":"_0x02-存储过程","link":"#_0x02-存储过程","children":[]},{"level":2,"title":"SQL游标","slug":"sql游标","link":"#sql游标","children":[]}],"git":{"createdTime":1725353821000,"updatedTime":1725353821000,"contributors":[{"name":"Iwindy","email":"12398041+iwindy0@user.noreply.gitee.com","commits":1}]},"readingTime":{"minutes":1.28,"words":385},"filePathRelative":"notes/数据库/数据库编程.md","localizedDate":"2024年9月3日","excerpt":"<h2>0x01 SQL流程语句</h2>\\n<p><strong>声明变量</strong>\\n<code>Declare @变量名</code></p>\\n<p><strong>赋值</strong>\\n<code>Set @变量名=值</code></p>\\n<p><strong>流程控制</strong></p>\\n<div class=\\"language-sql line-numbers-mode\\" data-highlighter=\\"shiki\\" data-ext=\\"sql\\" data-title=\\"sql\\" style=\\"--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34\\"><pre class=\\"shiki shiki-themes one-light one-dark-pro vp-code\\"><code><span class=\\"line\\"><span style=\\"--shiki-light:#A626A4;--shiki-dark:#C678DD\\">If</span><span style=\\"--shiki-light:#A626A4;--shiki-dark:#C678DD\\"> case</span><span style=\\"--shiki-light:#A626A4;--shiki-dark:#C678DD\\"> when</span></span>\\n<span class=\\"line\\"><span style=\\"--shiki-light:#A626A4;--shiki-dark:#C678DD\\">while</span><span style=\\"--shiki-light:#A626A4;--shiki-dark:#C678DD\\"> begin</span><span style=\\"--shiki-light:#A626A4;--shiki-dark:#C678DD\\"> end</span></span></code></pre>\\n<div class=\\"line-numbers\\" aria-hidden=\\"true\\" style=\\"counter-reset:line-number 0\\"><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div></div></div>","autoDesc":true}');export{o as comp,c as data};
