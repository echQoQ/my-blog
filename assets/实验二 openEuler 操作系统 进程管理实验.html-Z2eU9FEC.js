import{_ as n}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as s,o as a,d as i}from"./app--uBxqO_k.js";const e="/my-blog/images/20240322171539.png",l="/my-blog/images/20240322171842.png",p="/my-blog/images/20240322181311.png",d="/my-blog/images/20240322180700.png",c="/my-blog/images/20240322181804.png",t="/my-blog/images/20240322181727.png",r="/my-blog/images/20240322182154.png",o="/my-blog/images/20240322182418.png",u="/my-blog/images/20240405193518.png",m="/my-blog/images/20240405193117.png",v="/my-blog/images/20240405194201.png",b="/my-blog/images/20240405212713.png",g="/my-blog/images/20240405212329.png",h="/my-blog/images/20240405213841.png",_="/my-blog/images/20240405213906.png",k="/my-blog/images/20240405214743.png",f="/my-blog/images/20240405214827.png",E="/my-blog/images/20240405214847.png",x="/my-blog/images/20240405215201.png",y={},q=i(`<blockquote><p>[! col2] 实验人</p><ul><li>姓名：刘志豪</li><li>学号：22920212204174</li></ul></blockquote><h2 id="_0x01-实验目的" tabindex="-1"><a class="header-anchor" href="#_0x01-实验目的"><span>0x01 实验目的</span></a></h2><p>⚫ 学习掌握Linux内核线程的创建；</p><p>⚫ 学习掌握Linux内核线程的状态转换；</p><p>⚫ 了解如何通过/proc文件系统获取系统当前运行状态；</p><p>⚫ 了解cgroup进程分组化管理工具，学习如何限制内核线程的CPU核心数和利用率。</p><h2 id="_0x02-实验任务" tabindex="-1"><a class="header-anchor" href="#_0x02-实验任务"><span>0x02 实验任务</span></a></h2><h3 id="_1-任务一-创建并运行内核线程" tabindex="-1"><a class="header-anchor" href="#_1-任务一-创建并运行内核线程"><span>1 任务一：创建并运行内核线程</span></a></h3><h4 id="_1-1-基本知识——内核线程相关函数" tabindex="-1"><a class="header-anchor" href="#_1-1-基本知识——内核线程相关函数"><span>1.1 基本知识——内核线程相关函数</span></a></h4><ul><li><code>kthread_create()</code>： <ul><li><strong>参数</strong>： <ul><li><code>threadfn</code>：指向线程函数的指针，这是新线程将要执行的函数。</li><li><code>data</code>：传递给线程函数的参数。</li><li><code>namefmt</code>：线程名称的格式字符串，可以像<code>printf</code>一样包含格式化选项。</li></ul></li><li><strong>作用</strong><ul><li>创建一个新的内核线程，但不立即启动它。返回一个<code>task_struct</code>结构体指针，代表新线程。</li></ul></li></ul></li><li><code>kthread_run()</code>： <ul><li><strong>参数</strong>： <ul><li><code>threadfn</code>：指向线程函数的指针，这是新线程将要执行的函数。</li><li><code>data</code>：传递给线程函数的参数。</li><li><code>namefmt</code>：线程名称的格式字符串，可以像<code>printf</code>一样包含格式化选项。</li></ul></li><li><strong>作用</strong>：创建并立即启动一个内核线程。这是<code>kthread_create()</code>和<code>wake_up_process()</code>的便捷组合。</li></ul></li><li><code>wake_up_process()</code>： <ul><li><strong>参数</strong>： <ul><li><code>p</code>：指向<code>task_struct</code>的指针，代表要唤醒的线程。</li></ul></li><li><strong>作用</strong>：唤醒处于休眠状态的线程。如果线程已经在运行，调用此函数没有效果。</li></ul></li><li><code>kthread_stop()</code>： <ul><li><strong>参数</strong>： <ul><li><code>k</code>：指向<code>task_struct</code>的指针，代表要停止的线程。</li></ul></li><li><strong>作用</strong>：请求停止线程，并等待线程响应并退出。设置线程的<code>kthread_should_stop</code>标志为<code>true</code>，并唤醒线程以便它可以检查该标志。</li></ul></li><li><code>kthread_should_stop()</code>： <ul><li><strong>参数</strong>：无。</li><li><strong>作用</strong>：线程函数可以调用此函数来检查是否有停止线程的请求。如果有，线程应当清理资源并退出。</li></ul></li></ul><h4 id="_1-2-实验任务" tabindex="-1"><a class="header-anchor" href="#_1-2-实验任务"><span>1.2 实验任务</span></a></h4><blockquote><p>任务一：要求编写内核模块kthread_stu_id，要求在创建模块时传入学号。在内核模块中创建线程stuIdThread， 在该线程里每隔3秒打印学号的各个字符（从第一位开始，一直到学号的最后一位结束）。例如对于学号 “230201911”，应每隔3秒依次打印出2,3,0,2,0,1,9,1,1。若学号每一位都打印完毕但线程仍处于运行状态， 调整打印信息为“All digits of student ID have been printed”，且打印频率为5秒一次。 任务二：自行编写Makefile，完成源码的编译、内核模块安装和卸载的过程，查看内核日志，验证结果的正 确性。</p></blockquote><h5 id="_1-2-1-代码" tabindex="-1"><a class="header-anchor" href="#_1-2-1-代码"><span>1.2.1 代码</span></a></h5><p><em><strong>stuldThread.c</strong></em></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>#include &lt;linux/kthread.h&gt;</span></span>
<span class="line"><span>#include &lt;linux/module.h&gt; </span></span>
<span class="line"><span>#include &lt;linux/delay.h&gt; </span></span>
<span class="line"><span></span></span>
<span class="line"><span>MODULE_LICENSE(&quot;GPL&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>##define BUF_SIZE 20 </span></span>
<span class="line"><span></span></span>
<span class="line"><span>static struct task_struct *stuldThread = NULL; //进程</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static char* stu_id; // 学号</span></span>
<span class="line"><span>module_param(stu_id, charp, 0644); //模块初始化时输入</span></span>
<span class="line"><span>MODULE_PARM_DESC(stu_id,&quot;char* param --&gt; STUDENT ID.&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static int print(void *data)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span> char *sid = (char*)data; //格式转化</span></span>
<span class="line"><span> int i=0; //记录序号</span></span>
<span class="line"><span> while(!kthread_should_stop()){</span></span>
<span class="line"><span>  if(sid[i] != &#39;\\0&#39;){ //判断是否到字符串结尾</span></span>
<span class="line"><span>         printk(&quot;Index %d of Student ID: %c&quot;,i,sid[i]); //格式化打印字符串</span></span>
<span class="line"><span>         i++;</span></span>
<span class="line"><span>         msleep(3000); //停3秒</span></span>
<span class="line"><span>  } else {</span></span>
<span class="line"><span>          printk(&quot;All digits of student ID have been printed.&quot;);</span></span>
<span class="line"><span>          msleep(5000); //停5秒</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span> }</span></span>
<span class="line"><span> return 0;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static int __init kthread_init(void)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span> printk(&quot;Create kthread stuldThread.\\n&quot;);</span></span>
<span class="line"><span> stuldThread = kthread_run(print, stu_id, &quot;stuldThread&quot;); //创建并启动进程，并将其赋予变量stuldThread</span></span>
<span class="line"><span> return 0;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static void __exit kthread_exit(void)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span> printk(&quot;Kill kthread stuldThread.\\n&quot;);</span></span>
<span class="line"><span> if(stuldThread)</span></span>
<span class="line"><span>  kthread_stop(stuldThread); //结束进程</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>module_init(kthread_init);</span></span>
<span class="line"><span>module_exit(kthread_exit);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><em><strong>Makefile</strong></em></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>ifneq ($(KERNELRELEASE),)</span></span>
<span class="line"><span>        obj-m := stuldThread.o</span></span>
<span class="line"><span>else</span></span>
<span class="line"><span>        KERNELDIR ?= /root/kernel</span></span>
<span class="line"><span>        PWD := $(shell pwd)</span></span>
<span class="line"><span>default:</span></span>
<span class="line"><span>        $(MAKE) -C $(KERNELDIR) M=$(PWD) modules</span></span>
<span class="line"><span>endif</span></span>
<span class="line"><span>.PHONY: clean</span></span>
<span class="line"><span>clean:</span></span>
<span class="line"><span>        -rm *.mod.c *.o *.order *.symvers *.ko *.mod</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="_1-2-2实验过程及结果" tabindex="-1"><a class="header-anchor" href="#_1-2-2实验过程及结果"><span>1.2.2实验过程及结果</span></a></h5><ol><li><code>make</code>编译</li><li><code>insmod stuldThread.ko stu_id=&quot;22920212204174&quot;</code>将模块导入内核并输入学号</li><li><code>lsmod</code>查看导入情况<img src="`+e+'" alt="" loading="lazy"></li><li><code>dmesg | tail -n 25</code> 查看内核消息队列<img src="'+l+'" alt="" loading="lazy"></li></ol><h2 id="_2-任务二-绑定内核线程到指定cpu" tabindex="-1"><a class="header-anchor" href="#_2-任务二-绑定内核线程到指定cpu"><span>2 任务二：绑定内核线程到指定CPU</span></a></h2><h4 id="_2-1-基本知识" tabindex="-1"><a class="header-anchor" href="#_2-1-基本知识"><span>2.1 基本知识</span></a></h4><ul><li><code>kthread_bind()</code><ul><li><strong>参数</strong>： <ul><li><code>k</code>：指向<code>task_struct</code>的指针，代表要绑定的线程。</li><li><code>cpu</code>：整数，表示CPU的编号，线程将被绑定到这个CPU上。</li></ul></li><li><strong>作用</strong>： <ul><li>将指定的线程绑定到特定的CPU，以确保线程总是在该CPU上运行。</li></ul></li></ul></li></ul><h3 id="_2-2-任务2-1" tabindex="-1"><a class="header-anchor" href="#_2-2-任务2-1"><span>2.2 任务2.1</span></a></h3><blockquote><p>你知道MyPrintk中current全局变量的含义吗？请你编写kthread_bind_test.c，通过实验判断将线程绑定到指定CPU核心时，线程应当处于什么状态？唤醒线程后能否通过kthread_bind()切换线程所在CPU？ 通过命令查看当前机器的CPU核数，若在绑定时设定的CPU核心ID超过机器本身的CPU核数，会产生什 么结果？请结合实验结果验证你的结论。</p></blockquote><ul><li>根据示例中MyPrink代码推断，current全局变量应该是指运行中的线程本身对应的指针</li><li>当将线程唤醒之后不能通过<code>kthread_bind</code>切换线程所在CPU，验证代码如下<img src="'+p+'" alt="" loading="lazy">其他与示例一致</li><li>实验结果如下]]<img src="'+d+'" alt="" loading="lazy"></li><li>可以看见出现了报错，且线程并未切换到指定的1号，可见前面的结论是正确的</li></ul><hr><ul><li>将线程绑定到指定CPU核心时，线程应当处于什么状态，下面也将通过实验求证，代码如下<img src="'+c+'" alt="" loading="lazy"></li><li>实验结果为<img src="'+t+'" alt="" loading="lazy"></li><li>线程状态为2，代表<code>TASK_UNINTERRUPTIBLE</code>，这意味着线程正在等待某个特定条件，且不能被信号中断。</li></ul><hr><ul><li>通过命令查看当前机器的CPU核数 <ul><li><code>nproc</code><img src="'+r+'" alt="" loading="lazy"></li></ul></li><li>若在绑定时设定的CPU核心ID超过机器本身的CPU核数<img src="'+o+`" alt="" loading="lazy"></li><li>可见未切换到指定的5号，则说明ID超过机器本身CPU核数时切换不成功</li></ul><h4 id="_2-3-任务2-2" tabindex="-1"><a class="header-anchor" href="#_2-3-任务2-2"><span>2.3 任务2.2</span></a></h4><blockquote><p>假设当前服务器CPU的核数为N，请你编写<code>kthread_bind_cores.c</code>，实现创建N个线程，每个线程与一个CPU核心绑定，并在各个线程运行时每隔2秒打印一次当前线程名和占用的CPU ID，要求每个线程使用同一个MyPrintk()打印函数。</p></blockquote><ol><li>代码</li></ol><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>#include &lt;linux/module.h&gt;</span></span>
<span class="line"><span>#include &lt;linux/kernel.h&gt; </span></span>
<span class="line"><span>#include &lt;linux/init.h&gt; </span></span>
<span class="line"><span>#include &lt;linux/kthread.h&gt;</span></span>
<span class="line"><span>#include &lt;linux/sched.h&gt;</span></span>
<span class="line"><span>#include &lt;linux/delay.h&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static struct task_struct *kt = NULL;</span></span>
<span class="line"><span>static char *kt_names[] = {&quot;kt_1&quot;, &quot;kt_2&quot;, &quot;kt_3&quot;, &quot;kt_4&quot;};</span></span>
<span class="line"><span>#define KT_COUNT 4</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static int MyPrintk(void *data)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    while (!kthread_should_stop())</span></span>
<span class="line"><span>    {</span></span>
<span class="line"><span>        int cpu = get_cpu();</span></span>
<span class="line"><span>        put_cpu();</span></span>
<span class="line"><span>        printk(&quot;kthread %s is running on cpu %d\\n&quot;, current-&gt;comm, cpu);</span></span>
<span class="line"><span>        msleep(2000);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return 0;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static int __init init_kthread(void)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    int i;</span></span>
<span class="line"><span>    for (i = 0; i &lt; KT_COUNT; i++) {</span></span>
<span class="line"><span>        kt = kthread_create(MyPrintk, NULL, &quot;%s&quot;, kt_names[i]);</span></span>
<span class="line"><span>        if (kt) {</span></span>
<span class="line"><span>            kthread_bind(kt, i);</span></span>
<span class="line"><span>            wake_up_process(kt);</span></span>
<span class="line"><span>            printk(&quot;kthread %s bound to cpu %d and started\\n&quot;, kt_names[i], i);</span></span>
<span class="line"><span>        } else {</span></span>
<span class="line"><span>            printk(&quot;Failed to create kthread %s\\n&quot;, kt_names[i]);</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    return 0;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static void __exit exit_kthread(void)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span></span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>module_init(init_kthread);</span></span>
<span class="line"><span>module_exit(exit_kthread);</span></span>
<span class="line"><span>MODULE_LICENSE(&quot;GPL&quot;);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="2"><li>运行 <ol><li>编译，<code>make</code></li><li>将模块导入内核，<code>insmod kthread_bind_cores.ko</code></li><li>查看消息缓冲区，<code>dmesg | tail -n 50</code></li><li>运行截图![[Pasted image 20240405180439.png]]![[Pasted image 20240405180508.png]]</li></ol></li></ol><h3 id="_2-4-任务2-3" tabindex="-1"><a class="header-anchor" href="#_2-4-任务2-3"><span>2.4 任务2.3</span></a></h3><blockquote><p>自行编写Makefile，完成源码的编译、内核模块安装和卸载的过程，查看内核日志，验证结果的正确性。</p></blockquote><ul><li>任务二的Makefile</li></ul><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>ifneq ($(KERNELRELEASE),)</span></span>
<span class="line"><span>	obj-m := kthread_bind_cores.o</span></span>
<span class="line"><span>else</span></span>
<span class="line"><span>	KERNELDIR ?= /root/kernel</span></span>
<span class="line"><span>	PWD := $(shell pwd)</span></span>
<span class="line"><span>default:</span></span>
<span class="line"><span>	$(MAKE) -C $(KERNELDIR) M=$(PWD) modules</span></span>
<span class="line"><span>endif</span></span>
<span class="line"><span>.PHONY: clean</span></span>
<span class="line"><span>clean:</span></span>
<span class="line"><span>	-rm *.mod.c *.o *.order *.symvers *.ko *.mod</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>运行过程上面已经描述了</li></ul><h3 id="_3-任务三-内核线程的睡眠和唤醒" tabindex="-1"><a class="header-anchor" href="#_3-任务三-内核线程的睡眠和唤醒"><span>3 任务三：内核线程的睡眠和唤醒</span></a></h3><h4 id="_3-1-基本知识" tabindex="-1"><a class="header-anchor" href="#_3-1-基本知识"><span>3.1 基本知识</span></a></h4><blockquote><p>Linux提供了schedule_timeout_uninterruptible()函数用于将当前正在运行的线程进入睡眠状态，处于睡眠状 态的线程可以通过wake_up_process()唤醒进入运行状态。</p></blockquote><h4 id="_3-2-请你自行编写makefile-完成源码的编译、内核模块安装和卸载的过程-查看内核日志-回答以下问题" tabindex="-1"><a class="header-anchor" href="#_3-2-请你自行编写makefile-完成源码的编译、内核模块安装和卸载的过程-查看内核日志-回答以下问题"><span>3.2 请你自行编写Makefile，完成源码的编译、内核模块安装和卸载的过程，查看内核日志，回答以下问题</span></a></h4><p>示例代码中的<code>current_kernel_time()</code>已被废弃，部分代码更改如下</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>static int __init wake_up_process_init(void)</span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>    struct timespec64 current_time;</span></span>
<span class="line"><span>    long loop_end_ts;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    wake_up_thread = current;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Create a new thread </span></span>
<span class="line"><span>    new_thread = kthread_create_on_node(myPrintk, NULL, -1, &quot;new_thread&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Wake up the new thread and run it </span></span>
<span class="line"><span>    wake_up_process(new_thread);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>     ktime_get_real_ts64(&amp;current_time);</span></span>
<span class="line"><span>    loop_end_ts = current_time.tv_sec + 5;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Make current thread run for 5 seconds </span></span>
<span class="line"><span>    while (current_time.tv_sec &lt;= loop_end_ts) {</span></span>
<span class="line"><span>         ktime_get_real_ts64(&amp;current_time);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Make current thread sleep for some time </span></span>
<span class="line"><span>    schedule_timeout_uninterruptible(1000 * 5);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    // Wake up current thread </span></span>
<span class="line"><span>    wake_up_process(current);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return 0;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>运行截图 <img src="`+u+'" alt="" loading="lazy"></p><blockquote><p>[! question] 问题一 阅读程序打印日志，内核初始化模块中，schedule_timeout_uninterruptible ()方法将哪个线程（给出线程名称comm）进入了睡眠状态？日志中线程状态是以long类型输出的，你能给出各个long类型状态数值代表的含义吗 (如运行状态、结束状态、睡眠状态等)？</p></blockquote><p>根据运行日志<img src="'+m+'" alt="" loading="lazy"> 可以看到是<code>wake_up_thread</code>进入了睡眠状态 <em><strong>各个long类型状态数值代表的含义</strong></em></p><ul><li><strong>0</strong>：TASK_RUNNING（运行状态）</li><li><strong>1</strong>：TASK_INTERRUPTIBLE（可中断的睡眠状态）</li><li><strong>2</strong>：TASK_UNINTERRUPTIBLE（不可中断的睡眠状态）</li><li><strong>4</strong>：TASK_STOPPED（停止##状态）</li><li><strong>8</strong>：TASK_TRACED（跟踪状态）</li><li><strong>64</strong>：TASK_DEAD（结束状态）</li><li><strong>128</strong>：TASK_WAKEKILL（即将被杀死状态）</li><li><strong>256</strong>：TASK_WAKING（唤醒中状态）</li><li><strong>512</strong>：TASK_PARKED（停泊状态）</li><li><strong>1024</strong>：TASK_NOLOAD（不加载状态）</li></ul><blockquote><p>[! question] 问题二 执行线程睡眠方法前后以及内核模块卸载前后，线程new_thread和wake_up_thread的PID和状态 是否发生变化？这种变化是必然发生的吗？如有变化，请你结合代码和线程的实际运行情况，分析PID或状态变化的原因。提示：可以从线程状态转换图、Linux中task_struct结构体复用等角度进行分析。</p></blockquote><figure><img src="'+v+`" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>根据日志来看执行睡眠方法和模块卸载前后，两个线程的PID都未发生改变 但在<code>wake_up_thread</code>执行睡眠方法后，其状态由0变为2，表示从运行状态变为睡眠状态</p><p><code>wake_up_thread</code>后面状态又有0变为128，推测是函数执行完毕，进入即将被杀死的状态</p><h3 id="_4-任务四-利用-proc文件系统实时获取系统状态信息" tabindex="-1"><a class="header-anchor" href="#_4-任务四-利用-proc文件系统实时获取系统状态信息"><span>4 任务四：利用/proc文件系统实时获取系统状态信息</span></a></h3><ol><li>代码</li></ol><p><strong>cycle_print_kthread.c</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>#include &lt;linux/module.h&gt;</span></span>
<span class="line"><span>#include &lt;linux/kernel.h&gt;</span></span>
<span class="line"><span>#include &lt;linux/kthread.h&gt;</span></span>
<span class="line"><span>#include &lt;linux/delay.h&gt;</span></span>
<span class="line"><span>#include &lt;linux/fs.h&gt;</span></span>
<span class="line"><span>#include &lt;linux/slab.h&gt;</span></span>
<span class="line"><span>#include &lt;linux/string.h&gt;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>##define UPTIME_FILE &quot;/proc/uptime&quot;</span></span>
<span class="line"><span>#define MEMINFO_PATH &quot;/proc/meminfo&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static struct task_struct *kthread;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static int cycle_print_kthread(void *data) {</span></span>
<span class="line"><span>    struct file *file;</span></span>
<span class="line"><span>    char *line = NULL;</span></span>
<span class="line"><span>    size_t len = 256; // Initial length of the buffer</span></span>
<span class="line"><span>    ssize_t read;</span></span>
<span class="line"><span>    unsigned long uptime;</span></span>
<span class="line"><span>    int total_mem = 0, free_mem = 0, used_mem;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    printk(KERN_INFO &quot;cycle_print_kthread started\\n&quot;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    line = kmalloc(len, GFP_KERNEL); // Allocate memory for the buffer</span></span>
<span class="line"><span>    if (!line) {</span></span>
<span class="line"><span>        printk(KERN_ERR &quot;Failed to allocate memory\\n&quot;);</span></span>
<span class="line"><span>        return -ENOMEM;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    while (!kthread_should_stop()) {</span></span>
<span class="line"><span>        // Read uptime</span></span>
<span class="line"><span>        file = filp_open(UPTIME_FILE, O_RDONLY, 0);</span></span>
<span class="line"><span>        if (!file) {</span></span>
<span class="line"><span>            printk(KERN_ERR &quot;Error opening uptime file\\n&quot;);</span></span>
<span class="line"><span>            kfree(line);</span></span>
<span class="line"><span>            return -ENOENT;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span>        kernel_read(file, line, len - 1, 0);</span></span>
<span class="line"><span>        sscanf(line, &quot;%lu&quot;, &amp;uptime);</span></span>
<span class="line"><span>        filp_close(file, NULL);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        // Read memory info</span></span>
<span class="line"><span>        file = filp_open(MEMINFO_PATH, O_RDONLY, 0);</span></span>
<span class="line"><span>        if (!file) {</span></span>
<span class="line"><span>            printk(KERN_ERR &quot;Error opening meminfo file\\n&quot;);</span></span>
<span class="line"><span>            kfree(line);</span></span>
<span class="line"><span>            return -ENOENT;</span></span>
<span class="line"><span>        }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        read = kernel_read(file, line, len - 1, 0);</span></span>
<span class="line"><span>        line[read] = &#39;\\0&#39;; // Add null terminator</span></span>
<span class="line"><span>        sscanf(line, &quot;MemTotal:%*s %d kB\\nMemFree:%*s %d kB&quot;, &amp;total_mem, &amp;free_mem );</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        filp_close(file, NULL);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        used_mem = total_mem - free_mem;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        total_mem /= 1024;</span></span>
<span class="line"><span>        free_mem /= 1024;</span></span>
<span class="line"><span>        used_mem /= 1024;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        printk(KERN_INFO &quot;current uptime: %lu s\\n&quot;, uptime);</span></span>
<span class="line"><span>        printk(KERN_INFO &quot;total memory: %d MB\\n&quot;, total_mem);</span></span>
<span class="line"><span>        printk(KERN_INFO &quot;free memory: %d MB\\n&quot;, free_mem);</span></span>
<span class="line"><span>        printk(KERN_INFO &quot;occupy memory: %d MB\\n&quot;, used_mem);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>        msleep(3000); // Sleep for 3 seconds</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    kfree(line);</span></span>
<span class="line"><span>    return 0;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static int __init init_cycle_print_kthread(void) {</span></span>
<span class="line"><span>    kthread = kthread_create(cycle_print_kthread, NULL, &quot;cycle_print_kthread&quot;);</span></span>
<span class="line"><span>    if (IS_ERR(kthread)) {</span></span>
<span class="line"><span>        printk(KERN_ERR &quot;Failed to create kernel thread\\n&quot;);</span></span>
<span class="line"><span>        return PTR_ERR(kthread);</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>    wake_up_process(kthread);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    return 0;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>static void __exit exit_cycle_print_kthread(void) {</span></span>
<span class="line"><span>    kthread_stop(kthread);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>module_init(init_cycle_print_kthread);</span></span>
<span class="line"><span>module_exit(exit_cycle_print_kthread);</span></span>
<span class="line"><span>MODULE_LICENSE(&quot;GPL&quot;);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>Makefile</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>ifneq ($(KERNELRELEASE),)</span></span>
<span class="line"><span>    obj-m := cycle_print_kthread.o</span></span>
<span class="line"><span>else</span></span>
<span class="line"><span>    KERNELDIR ?= /root/kernel</span></span>
<span class="line"><span>    PWD := $(shell pwd)</span></span>
<span class="line"><span>    EXTRA_CFLAGS := $(filter-out -mgeneral-regs-only, $(EXTRA_CFLAGS))</span></span>
<span class="line"><span></span></span>
<span class="line"><span>default:</span></span>
<span class="line"><span>	$(MAKE) -C $(KERNELDIR) M=$(PWD) modules</span></span>
<span class="line"><span>endif</span></span>
<span class="line"><span></span></span>
<span class="line"><span>.PHONY: clean</span></span>
<span class="line"><span>clean:</span></span>
<span class="line"><span>	-rm *.mod.c *.o *.order *.symvers *.ko *.mod</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="2"><li>编译运行</li></ol><figure><img src="`+b+'" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><figure><img src="'+g+'" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h3 id="_5-任务五-使用cgroup限制cpu核数" tabindex="-1"><a class="header-anchor" href="#_5-任务五-使用cgroup限制cpu核数"><span>5 任务五：使用cgroup限制CPU核数</span></a></h3><ol><li>基本知识——cgroup</li></ol><blockquote><p>cgroup (Control Groups)是Linux中对任意线程进行分组化管理的工具。</p></blockquote><ol start="2"><li>复现实验流程，实现对进程使用CPU核数的限制</li></ol><p>运行截图： <img src="'+h+'" alt="" loading="lazy"><img src="'+_+'" alt="" loading="lazy"></p><h3 id="_6-任务六-使用cgroup限制cpu利用率" tabindex="-1"><a class="header-anchor" href="#_6-任务六-使用cgroup限制cpu利用率"><span>6 任务六：使用cgroup限制CPU利用率</span></a></h3><ol start="2"><li>复现实验流程 <img src="'+k+'" alt="" loading="lazy"><img src="'+f+'" alt="" loading="lazy"><img src="'+E+`" alt="" loading="lazy"></li></ol><p>可见经过设置CPU利用限制，进程<code>cgroup_cpu</code>的CPU利用率下降至19.9%</p><p><code>cpu.cfs_quota_us</code> 和 <code>cpu.cfs_period_us</code> 是 Linux 内核中控制 CFS (Completely Fair Scheduler) CPU 配额的两个参数。CFS 是 Linux 内核中的一种调度器，负责在多个进程之间分配 CPU 时间。</p><p>这两个参数的含义如下：</p><ol><li><code>cpu.cfs_quota_us</code>：这个参数定义了在一段时间内一个 cgroup 可以使用 CPU 的总时间量。单位是微秒（μs）。例如，如果 <code>cpu.cfs_quota_us</code> 设置为 100000，那么表示在 <code>cpu.cfs_period_us</code> 定义的时间内（通常是1秒），这个 cgroup 可以使用 CPU 100毫秒。如果设置为 -1，则表示没有限制。</li><li><code>cpu.cfs_period_us</code>：这个参数定义了一个周期的长度，用于计算 <code>cpu.cfs_quota_us</code> 中定义的 CPU 时间量。单位也是微秒（μs）。例如，如果 <code>cpu.cfs_period_us</code> 设置为 1000000（即1秒），而 <code>cpu.cfs_quota_us</code> 设置为 500000（即0.5秒），那么这个 cgroup 在每秒的时间内可以使用 CPU 50%。</li></ol><p>运行如下指令使cgroup_cpu的利用率维持在40%</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span>echo 40000 &gt; /sys/fs/cgroup/cpu/mycpu/cpu.cfs_quota_us </span></span>
<span class="line"><span>echo 486 &gt; /sys/fs/cgroup/cpu/mycpu/tasks</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><figure><img src="`+x+'" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure>',76),A=[q];function P(L,C){return a(),s("div",null,A)}const R=n(y,[["render",P],["__file","实验二 openEuler 操作系统 进程管理实验.html.vue"]]),T=JSON.parse('{"path":"/reports/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/%E5%AE%9E%E9%AA%8C%E4%BA%8C%20openEuler%20%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%20%E8%BF%9B%E7%A8%8B%E7%AE%A1%E7%90%86%E5%AE%9E%E9%AA%8C.html","title":"实验二 openEuler 操作系统 进程管理实验","lang":"zh-CN","frontmatter":{"title":"实验二 openEuler 操作系统 进程管理实验","cover":"/assets/images/cover2.jpg","icon":"paper-plane","order":2,"author":"Mr.Liu","category":["实验报告"],"tag":["操作系统","实验报告"],"sticky":false,"star":false,"footer":"箱根山岳险天下","copyright":"无版权","description":"[! col2] 实验人 姓名：刘志豪 学号：22920212204174 0x01 实验目的 ⚫ 学习掌握Linux内核线程的创建； ⚫ 学习掌握Linux内核线程的状态转换； ⚫ 了解如何通过/proc文件系统获取系统当前运行状态； ⚫ 了解cgroup进程分组化管理工具，学习如何限制内核线程的CPU核心数和利用率。 0x02 实验任务 1 任务一...","head":[["meta",{"property":"og:url","content":"https://fancxx.github.io/my-blog/reports/%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/%E5%AE%9E%E9%AA%8C%E4%BA%8C%20openEuler%20%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F%20%E8%BF%9B%E7%A8%8B%E7%AE%A1%E7%90%86%E5%AE%9E%E9%AA%8C.html"}],["meta",{"property":"og:site_name","content":"Mr.Liu"}],["meta",{"property":"og:title","content":"实验二 openEuler 操作系统 进程管理实验"}],["meta",{"property":"og:description","content":"[! col2] 实验人 姓名：刘志豪 学号：22920212204174 0x01 实验目的 ⚫ 学习掌握Linux内核线程的创建； ⚫ 学习掌握Linux内核线程的状态转换； ⚫ 了解如何通过/proc文件系统获取系统当前运行状态； ⚫ 了解cgroup进程分组化管理工具，学习如何限制内核线程的CPU核心数和利用率。 0x02 实验任务 1 任务一..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://fancxx.github.io/my-blog/assets/images/cover2.jpg"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-09-03T05:45:17.000Z"}],["meta",{"name":"twitter:card","content":"summary_large_image"}],["meta",{"name":"twitter:image:src","content":"https://fancxx.github.io/my-blog/assets/images/cover2.jpg"}],["meta",{"name":"twitter:image:alt","content":"实验二 openEuler 操作系统 进程管理实验"}],["meta",{"property":"article:author","content":"Mr.Liu"}],["meta",{"property":"article:tag","content":"操作系统"}],["meta",{"property":"article:tag","content":"实验报告"}],["meta",{"property":"article:modified_time","content":"2024-09-03T05:45:17.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"实验二 openEuler 操作系统 进程管理实验\\",\\"image\\":[\\"https://fancxx.github.io/my-blog/images/20240322171539.png\\",\\"https://fancxx.github.io/my-blog/images/20240322171842.png\\",\\"https://fancxx.github.io/my-blog/images/20240322181311.png\\",\\"https://fancxx.github.io/my-blog/images/20240322180700.png\\",\\"https://fancxx.github.io/my-blog/images/20240322181804.png\\",\\"https://fancxx.github.io/my-blog/images/20240322181727.png\\",\\"https://fancxx.github.io/my-blog/images/20240322182154.png\\",\\"https://fancxx.github.io/my-blog/images/20240322182418.png\\",\\"https://fancxx.github.io/my-blog/images/20240405193518.png\\",\\"https://fancxx.github.io/my-blog/images/20240405193117.png\\",\\"https://fancxx.github.io/my-blog/images/20240405194201.png\\",\\"https://fancxx.github.io/my-blog/images/20240405212713.png\\",\\"https://fancxx.github.io/my-blog/images/20240405212329.png\\",\\"https://fancxx.github.io/my-blog/images/20240405213841.png\\",\\"https://fancxx.github.io/my-blog/images/20240405213906.png\\",\\"https://fancxx.github.io/my-blog/images/20240405214743.png\\",\\"https://fancxx.github.io/my-blog/images/20240405214827.png\\",\\"https://fancxx.github.io/my-blog/images/20240405214847.png\\",\\"https://fancxx.github.io/my-blog/images/20240405215201.png\\"],\\"dateModified\\":\\"2024-09-03T05:45:17.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Mr.Liu\\"}]}"]]},"headers":[{"level":2,"title":"0x01 实验目的","slug":"_0x01-实验目的","link":"#_0x01-实验目的","children":[]},{"level":2,"title":"0x02 实验任务","slug":"_0x02-实验任务","link":"#_0x02-实验任务","children":[{"level":3,"title":"1 任务一：创建并运行内核线程","slug":"_1-任务一-创建并运行内核线程","link":"#_1-任务一-创建并运行内核线程","children":[]}]},{"level":2,"title":"2 任务二：绑定内核线程到指定CPU","slug":"_2-任务二-绑定内核线程到指定cpu","link":"#_2-任务二-绑定内核线程到指定cpu","children":[{"level":3,"title":"2.2 任务2.1","slug":"_2-2-任务2-1","link":"#_2-2-任务2-1","children":[]},{"level":3,"title":"2.4 任务2.3","slug":"_2-4-任务2-3","link":"#_2-4-任务2-3","children":[]},{"level":3,"title":"3 任务三：内核线程的睡眠和唤醒","slug":"_3-任务三-内核线程的睡眠和唤醒","link":"#_3-任务三-内核线程的睡眠和唤醒","children":[]},{"level":3,"title":"4 任务四：利用/proc文件系统实时获取系统状态信息","slug":"_4-任务四-利用-proc文件系统实时获取系统状态信息","link":"#_4-任务四-利用-proc文件系统实时获取系统状态信息","children":[]},{"level":3,"title":"5 任务五：使用cgroup限制CPU核数","slug":"_5-任务五-使用cgroup限制cpu核数","link":"#_5-任务五-使用cgroup限制cpu核数","children":[]},{"level":3,"title":"6 任务六：使用cgroup限制CPU利用率","slug":"_6-任务六-使用cgroup限制cpu利用率","link":"#_6-任务六-使用cgroup限制cpu利用率","children":[]}]}],"git":{"createdTime":1725342317000,"updatedTime":1725342317000,"contributors":[{"name":"Iwindy","email":"12398041+iwindy0@user.noreply.gitee.com","commits":1}]},"readingTime":{"minutes":10.49,"words":3148},"filePathRelative":"reports/操作系统/实验二 openEuler 操作系统 进程管理实验.md","localizedDate":"2024年9月3日","excerpt":"<blockquote>\\n<p>[! col2] 实验人</p>\\n<ul>\\n<li>姓名：刘志豪</li>\\n<li>学号：22920212204174</li>\\n</ul>\\n</blockquote>\\n<h2>0x01 实验目的</h2>\\n<p>⚫ 学习掌握Linux内核线程的创建；</p>\\n<p>⚫ 学习掌握Linux内核线程的状态转换；</p>\\n<p>⚫ 了解如何通过/proc文件系统获取系统当前运行状态；</p>\\n<p>⚫ 了解cgroup进程分组化管理工具，学习如何限制内核线程的CPU核心数和利用率。</p>\\n<h2>0x02 实验任务</h2>\\n<h3>1 任务一：创建并运行内核线程</h3>","autoDesc":true}');export{R as comp,T as data};
