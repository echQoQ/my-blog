import{_ as s}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as a,d as i,o as l}from"./app-D39E384z.js";const e="/my-blog/images/20240315172951.png",p="/my-blog/images/20240315175051.png",c="/my-blog/images/20240315175235.png",t="/my-blog/images/20240315175320.png",d="/my-blog/images/20240315175518.png",r="/my-blog/images/20240315175603.png",o="/my-blog/images/20240315175820.png",u="/my-blog/images/20240315191423.png",v={};function m(b,n){return l(),a("div",null,n[0]||(n[0]=[i('<h1 id="编译原理第一次实验" tabindex="-1"><a class="header-anchor" href="#编译原理第一次实验"><span>编译原理第一次实验</span></a></h1><h2 id="_0x01-实验目的" tabindex="-1"><a class="header-anchor" href="#_0x01-实验目的"><span>0x01 实验目的</span></a></h2><blockquote><p>构造一个从中缀表达式到后缀形式的表达式翻译器，初步了解递归下降语法分析原理及语法制导翻译的过程。</p></blockquote><h2 id="_0x02-实验内容" tabindex="-1"><a class="header-anchor" href="#_0x02-实验内容"><span>0x02 实验内容</span></a></h2><ul><li>程序功能 <ul><li>将中缀表达式转换为后缀表达式的翻译器</li></ul></li><li>程序输入 <ul><li>常数、变量以及<code>&#39;+&#39;</code>、<code>&#39;-&#39;</code>、<code>&quot;*&quot;</code>、<code>&quot;\\&quot;</code>、<code>&quot;(&quot;</code>、<code>&quot;)&quot;</code>、空格构成的中缀表达式</li><li>程序使用词法分析功能</li></ul></li><li>原始文法描述 <ul><li><code>expr</code> --&gt; <ul><li><code>expr + term</code></li><li><code>expr - term</code></li><li><code>term</code></li></ul></li><li><code>term</code> --&gt; <ul><li><code>term * factor</code></li><li><code>term / factor</code></li><li><code>factor</code></li></ul></li><li><code>factor</code> --&gt; <ul><li><code>(expr)</code></li><li><code>ID</code></li><li><code>NUM</code></li></ul></li></ul></li><li>消除左递归后的语法制导定义 <ul><li><img src="'+e+`" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></li><li>在原文法的基础上引入rest和t_rest，便于实现递归向下地进行翻译</li></ul></li><li>程序代码：</li></ul><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>#include &lt;stdio.h&gt;  </span></span>
<span class="line"><span>#include &lt;stdlib.h&gt;  </span></span>
<span class="line"><span>#include &lt;string&gt;  </span></span>
<span class="line"><span>using std::string;  </span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>#include &lt;ctype.h&gt;  </span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>using namespace std;  </span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>#define TKN_NUM 500  </span></span>
<span class="line"><span>#define TKN_ID  600  </span></span>
<span class="line"><span>#define TKN_BRACKET 700  </span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>void Expr(string &amp; ExprSyn);  </span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>int LookAhead; //存放当前的词法单元的类型  </span></span>
<span class="line"><span>int tokenval = 0; char lexeme[1024];  </span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>int GetToken() {  </span></span>
<span class="line"><span>    while (true) {  </span></span>
<span class="line"><span>        int t = getchar();  </span></span>
<span class="line"><span>        if (t == &#39; &#39; || t == &#39;\\t&#39;) continue;  </span></span>
<span class="line"><span>        else if (isdigit(t)) {  </span></span>
<span class="line"><span>            tokenval = 0;  </span></span>
<span class="line"><span>            do {  </span></span>
<span class="line"><span>                tokenval = tokenval * 10 + t -&#39;0&#39;;  </span></span>
<span class="line"><span>                t = getchar();  </span></span>
<span class="line"><span>            } while (isdigit(t));  </span></span>
<span class="line"><span>            if (isalpha(t)) {  </span></span>
<span class="line"><span>                printf(&quot;\\n非法变量名\\n&quot;);  </span></span>
<span class="line"><span>                exit(1);  </span></span>
<span class="line"><span>            }  </span></span>
<span class="line"><span>            ungetc(t, stdin);  </span></span>
<span class="line"><span>            return TKN_NUM;  </span></span>
<span class="line"><span>        } else if (t == &#39;(&#39;) {  </span></span>
<span class="line"><span>            string expr_syn_T;  </span></span>
<span class="line"><span>            LookAhead = GetToken();  </span></span>
<span class="line"><span>            Expr(expr_syn_T);  </span></span>
<span class="line"><span>            if( LookAhead !=&#39;)&#39; ) {  </span></span>
<span class="line"><span>                printf(&quot;\\n输入的括号不匹配\\n&quot;);  </span></span>
<span class="line"><span>                exit(1);  </span></span>
<span class="line"><span>            }  </span></span>
<span class="line"><span>            for (int i=0; i&lt;expr_syn_T.length(); i++) {  </span></span>
<span class="line"><span>                lexeme[i] = expr_syn_T[i];  </span></span>
<span class="line"><span>            }  </span></span>
<span class="line"><span>            lexeme[expr_syn_T.length()] = &#39;\\0&#39;;  </span></span>
<span class="line"><span>            return TKN_BRACKET;  </span></span>
<span class="line"><span>        } else if (isalpha(t)) {  </span></span>
<span class="line"><span>            int idx = 0;  </span></span>
<span class="line"><span>            do {  </span></span>
<span class="line"><span>                lexeme[idx++]=t;  </span></span>
<span class="line"><span>                t = getchar();  </span></span>
<span class="line"><span>            } while(isdigit(t) || isalpha(t));  </span></span>
<span class="line"><span>            lexeme[idx] = &#39;\\0&#39;;  </span></span>
<span class="line"><span>            ungetc(t, stdin);  </span></span>
<span class="line"><span>            return TKN_ID;  </span></span>
<span class="line"><span>        } else {  </span></span>
<span class="line"><span>            tokenval = 0;  </span></span>
<span class="line"><span>            return t;  </span></span>
<span class="line"><span>        }  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>}  </span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>void Match(int t)  </span></span>
<span class="line"><span>{  </span></span>
<span class="line"><span>    if( LookAhead==t )  </span></span>
<span class="line"><span>        LookAhead = GetToken();  </span></span>
<span class="line"><span>    else {  </span></span>
<span class="line"><span>        printf(&quot;\\n表达式错误:Match失败。\\n&quot;);  </span></span>
<span class="line"><span>        system(&quot;pause&quot;);  </span></span>
<span class="line"><span>        exit(1);  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>}  </span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>void Factor(string &amp; FactorSyn) {  </span></span>
<span class="line"><span>    char buf[100];  </span></span>
<span class="line"><span>    if( LookAhead==TKN_NUM ) {  </span></span>
<span class="line"><span>        sprintf(buf,&quot;%d &quot;, tokenval);  </span></span>
<span class="line"><span>        FactorSyn = buf; Match(LookAhead);  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>    else if( LookAhead==TKN_ID || LookAhead==TKN_BRACKET) {  </span></span>
<span class="line"><span>        sprintf(buf,&quot;%s &quot;,lexeme);  </span></span>
<span class="line"><span>        FactorSyn = buf; Match(LookAhead);  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>    else {  </span></span>
<span class="line"><span>        printf(&quot;\\n表达式错误:这里需要一个整数或变量或是一个在括号内的表达式。\\n&quot; );  </span></span>
<span class="line"><span>        system(&quot;pause&quot;);  </span></span>
<span class="line"><span>        exit(1);  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>}  </span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>void T_Rest(string &amp; T_RestSyn) {  </span></span>
<span class="line"><span>    string factor_syn, t_rest_syn;  </span></span>
<span class="line"><span>    switch (LookAhead) {  </span></span>
<span class="line"><span>        case &#39;*&#39;:  </span></span>
<span class="line"><span>            Match(&#39;*&#39;); Factor(factor_syn); T_Rest(t_rest_syn);  </span></span>
<span class="line"><span>            T_RestSyn = factor_syn + &quot;* &quot; + t_rest_syn;  </span></span>
<span class="line"><span>            break;  </span></span>
<span class="line"><span>        case &#39;/&#39;:  </span></span>
<span class="line"><span>            Match(&#39;/&#39;); Factor(factor_syn); T_Rest(t_rest_syn);  </span></span>
<span class="line"><span>            T_RestSyn = factor_syn + &quot;/ &quot; + t_rest_syn;  </span></span>
<span class="line"><span>            break;  </span></span>
<span class="line"><span>        default:  </span></span>
<span class="line"><span>            T_RestSyn = &quot;&quot;;  </span></span>
<span class="line"><span>            break;  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>}  </span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>void Term(string &amp; TermSyn) {  </span></span>
<span class="line"><span>    string factor_syn, t_rest_syn;  </span></span>
<span class="line"><span>    Factor(factor_syn);  </span></span>
<span class="line"><span>    T_Rest(t_rest_syn);  </span></span>
<span class="line"><span>    TermSyn = factor_syn + t_rest_syn;  </span></span>
<span class="line"><span>}  </span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>void Rest(string &amp; RestSyn) {  </span></span>
<span class="line"><span>    string term_syn, rest_syn;  </span></span>
<span class="line"><span>    switch (LookAhead) {  </span></span>
<span class="line"><span>        case &#39;+&#39;:  </span></span>
<span class="line"><span>            Match(&#39;+&#39;); Term(term_syn); Rest(rest_syn);  </span></span>
<span class="line"><span>            RestSyn = term_syn + &quot;+ &quot; + rest_syn;  </span></span>
<span class="line"><span>            break;  </span></span>
<span class="line"><span>        case &#39;-&#39;:  </span></span>
<span class="line"><span>            Match(&#39;-&#39;); Term(term_syn); Rest(rest_syn);  </span></span>
<span class="line"><span>            RestSyn = term_syn + &quot;- &quot; + rest_syn;  </span></span>
<span class="line"><span>            break;  </span></span>
<span class="line"><span>        case &#39;\\n&#39;:  </span></span>
<span class="line"><span>        case &#39;)&#39;:  </span></span>
<span class="line"><span>            RestSyn = &quot;&quot;;  </span></span>
<span class="line"><span>            break;  </span></span>
<span class="line"><span>        default:  </span></span>
<span class="line"><span>            printf(&quot;非法字符&quot;);  </span></span>
<span class="line"><span>            exit(1);  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>}  </span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>void Expr(string &amp; ExprSyn) {  </span></span>
<span class="line"><span>    string term_syn, rest_syn;  </span></span>
<span class="line"><span>    Term(term_syn);  </span></span>
<span class="line"><span>    Rest(rest_syn);  </span></span>
<span class="line"><span>    ExprSyn = term_syn + rest_syn;  </span></span>
<span class="line"><span>}  </span></span>
<span class="line"><span></span></span>
<span class="line"><span>int main() {  </span></span>
<span class="line"><span>    string expr_syn;  </span></span>
<span class="line"><span>    printf(&quot;请输入中缀表达式:\\n&quot;);  </span></span>
<span class="line"><span>    LookAhead = GetToken();  </span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>    Expr(expr_syn);  </span></span>
<span class="line"><span>    printf(&quot;其后缀表达式为: &quot;);  </span></span>
<span class="line"><span>    printf( &quot;%s&quot;, expr_syn.c_str() );  </span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>    if( LookAhead !=&#39;\\n&#39; ) {  </span></span>
<span class="line"><span>        printf(&quot;\\n输入的表达式错误\\n&quot;);  </span></span>
<span class="line"><span>        exit(1);  </span></span>
<span class="line"><span>    }  </span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>    printf(&quot;\\n表达式分析成功！\\n&quot;);  </span></span>
<span class="line"><span>    system(&quot;pause&quot;);  </span></span>
<span class="line"><span>    return 0;  </span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li><p>功能实现：</p><ul><li>完成对中缀表达式向后缀表达式的翻译 <ul><li><img src="`+p+'" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></li></ul></li><li>检查括号 <ul><li><img src="'+c+'" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></li></ul></li><li>校验变量名 <ul><li><img src="'+t+'" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></li></ul></li><li>校验num <ul><li><img src="'+d+'" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></li></ul></li><li>检查非法字符 <ul><li><img src="'+r+'" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></li></ul></li><li>表达式错误 <ul><li><img src="'+o+'" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></li></ul></li></ul></li><li><p>程序逻辑讲解</p><ul><li>Expr(string &amp; ExprSyn) <ul><li>将expr看成term 和 rest两部分</li><li>前后分别执行Term()和Rest()进行翻译</li></ul></li><li>Term(string &amp; TermSyn) <ul><li>将term看成factor 和 t_rest两部分</li><li>前后分别执行Factor()和T_Rest()进行翻译</li></ul></li><li>Factor(string &amp; FactorSyn) <ul><li>若词法分析取出的token是num或者Id或者括号括起来的表达式，直接将对应值赋予FactorSyn</li><li>括号表达式的处理： <ul><li>在GetToken()时，若读取到左括号，则认定接下来一段为括号表达式，执行Expr()函数，将括号表达式翻译成后缀形式，将其赋予lexeme（只是为了方便，与id共用变量）</li></ul></li></ul></li><li>Rest(string &amp; RestSyn) <ul><li>对Expr剩余部分进行处理，同样把剩余部分分成term和rest1，根据LookAhead确定执行程序 <ul><li>若是&#39;+&#39;或者&#39;-&#39;，则执行<code>RestSyn = term_syn +/- &quot;+ &quot; + rest_syn</code></li><li>否则说明表达式结束，若还有除了换行符和右括号以外的字符，说明表达式错误</li></ul></li></ul></li><li>T_Rest(string &amp; T_RestSyn) <ul><li>与Rest类似，对Term剩余部分进行处理，把剩余部分分成factor和t_rest1，根据LookAhead确定执行程序</li></ul></li><li>程序开始，会先获取第一个token，然后执行Expr()，将表达式递归翻译成后缀形式</li></ul></li><li><p>解决问题</p><ul><li>问题1：如何解决+、-、*、\\、括号的优先级问题 <ul><li>引入<code>rest</code>、<code>t_rest</code>、并把括号表达式视为factor</li></ul></li><li>问题2：如何检查括号是否匹配 <ul><li><img src="'+u+'" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></li><li>每次读取完括号表达式时，检查下一个字符是否是右括号，若否，说明括号不匹配</li></ul></li></ul></li></ul><h2 id="_0x03-实验总结" tabindex="-1"><a class="header-anchor" href="#_0x03-实验总结"><span>0x03 实验总结</span></a></h2><blockquote><p>通过本次实验，在仔细阅读示例代码后，写出优化版的中缀表达式到后缀形式的表达器翻译器，这让我更加理解了递归下降语法，也熟悉了语法制导翻译的流程。</p></blockquote>',9)]))}const y=s(v,[["render",m],["__file","1.html.vue"]]),_=JSON.parse(`{"path":"/reports/%E7%BC%96%E8%AF%91%E5%8E%9F%E7%90%86/1.html","title":"编译原理第一次实验","lang":"zh-CN","frontmatter":{"title":"编译原理第一次实验","cover":"/assets/images/cover1.jpg","icon":"paper-plane","order":1,"author":"Mr.Liu","date":"2024-03-15T00:00:00.000Z","category":["实验报告"],"tag":["编译原理","实验报告"],"sticky":false,"star":false,"footer":"箱根山岳险天下","copyright":"无版权","description":"编译原理第一次实验 0x01 实验目的 构造一个从中缀表达式到后缀形式的表达式翻译器，初步了解递归下降语法分析原理及语法制导翻译的过程。 0x02 实验内容 程序功能 将中缀表达式转换为后缀表达式的翻译器 程序输入 常数、变量以及'+'、'-'、\\"*\\"、\\"\\\\\\"、\\"(\\"、\\")\\"、空格构成的中缀表达式 程序使用词法分析功能 原始文法描述 expr --> ...","head":[["meta",{"property":"og:url","content":"https://echqoq.github.io/my-blog/my-blog/reports/%E7%BC%96%E8%AF%91%E5%8E%9F%E7%90%86/1.html"}],["meta",{"property":"og:site_name","content":"Mr.Liu"}],["meta",{"property":"og:title","content":"编译原理第一次实验"}],["meta",{"property":"og:description","content":"编译原理第一次实验 0x01 实验目的 构造一个从中缀表达式到后缀形式的表达式翻译器，初步了解递归下降语法分析原理及语法制导翻译的过程。 0x02 实验内容 程序功能 将中缀表达式转换为后缀表达式的翻译器 程序输入 常数、变量以及'+'、'-'、\\"*\\"、\\"\\\\\\"、\\"(\\"、\\")\\"、空格构成的中缀表达式 程序使用词法分析功能 原始文法描述 expr --> ..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://echqoq.github.io/my-blog/my-blog/assets/images/cover1.jpg"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-09-03T05:45:17.000Z"}],["meta",{"name":"twitter:card","content":"summary_large_image"}],["meta",{"name":"twitter:image:src","content":"https://echqoq.github.io/my-blog/my-blog/assets/images/cover1.jpg"}],["meta",{"name":"twitter:image:alt","content":"编译原理第一次实验"}],["meta",{"property":"article:author","content":"Mr.Liu"}],["meta",{"property":"article:tag","content":"编译原理"}],["meta",{"property":"article:tag","content":"实验报告"}],["meta",{"property":"article:published_time","content":"2024-03-15T00:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2024-09-03T05:45:17.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"编译原理第一次实验\\",\\"image\\":[\\"https://echqoq.github.io/my-blog/my-blog/images/20240315172951.png\\",\\"https://echqoq.github.io/my-blog/my-blog/images/20240315175051.png\\",\\"https://echqoq.github.io/my-blog/my-blog/images/20240315175235.png\\",\\"https://echqoq.github.io/my-blog/my-blog/images/20240315175320.png\\",\\"https://echqoq.github.io/my-blog/my-blog/images/20240315175518.png\\",\\"https://echqoq.github.io/my-blog/my-blog/images/20240315175603.png\\",\\"https://echqoq.github.io/my-blog/my-blog/images/20240315175820.png\\",\\"https://echqoq.github.io/my-blog/my-blog/images/20240315191423.png\\"],\\"datePublished\\":\\"2024-03-15T00:00:00.000Z\\",\\"dateModified\\":\\"2024-09-03T05:45:17.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Mr.Liu\\"}]}"]]},"headers":[{"level":2,"title":"0x01 实验目的","slug":"_0x01-实验目的","link":"#_0x01-实验目的","children":[]},{"level":2,"title":"0x02 实验内容","slug":"_0x02-实验内容","link":"#_0x02-实验内容","children":[]},{"level":2,"title":"0x03 实验总结","slug":"_0x03-实验总结","link":"#_0x03-实验总结","children":[]}],"git":{"createdTime":1725342317000,"updatedTime":1725342317000,"contributors":[{"name":"Iwindy","email":"12398041+iwindy0@user.noreply.gitee.com","commits":1}]},"readingTime":{"minutes":4.24,"words":1272},"filePathRelative":"reports/编译原理/1.md","localizedDate":"2024年3月15日","excerpt":"\\n<h2>0x01 实验目的</h2>\\n<blockquote>\\n<p>构造一个从中缀表达式到后缀形式的表达式翻译器，初步了解递归下降语法分析原理及语法制导翻译的过程。</p>\\n</blockquote>\\n<h2>0x02 实验内容</h2>\\n<ul>\\n<li>程序功能\\n<ul>\\n<li>将中缀表达式转换为后缀表达式的翻译器</li>\\n</ul>\\n</li>\\n<li>程序输入\\n<ul>\\n<li>常数、变量以及<code>'+'</code>、<code>'-'</code>、<code>\\"*\\"</code>、<code>\\"\\\\\\"</code>、<code>\\"(\\"</code>、<code>\\")\\"</code>、空格构成的中缀表达式</li>\\n<li>程序使用词法分析功能</li>\\n</ul>\\n</li>\\n<li>原始文法描述\\n<ul>\\n<li><code>expr</code> --&gt;\\n<ul>\\n<li><code>expr + term</code></li>\\n<li><code>expr - term</code></li>\\n<li><code>term</code></li>\\n</ul>\\n</li>\\n<li><code>term</code> --&gt;\\n<ul>\\n<li><code>term * factor</code></li>\\n<li><code>term / factor</code></li>\\n<li><code>factor</code></li>\\n</ul>\\n</li>\\n<li><code>factor</code> --&gt;\\n<ul>\\n<li><code>(expr)</code></li>\\n<li><code>ID</code></li>\\n<li><code>NUM</code></li>\\n</ul>\\n</li>\\n</ul>\\n</li>\\n<li>消除左递归后的语法制导定义\\n<ul>\\n<li><img src=\\"/images/20240315172951.png\\" alt=\\"\\" tabindex=\\"0\\" loading=\\"lazy\\"><figcaption></figcaption></li>\\n<li>在原文法的基础上引入rest和t_rest，便于实现递归向下地进行翻译</li>\\n</ul>\\n</li>\\n<li>程序代码：</li>\\n</ul>","autoDesc":true}`);export{y as comp,_ as data};
