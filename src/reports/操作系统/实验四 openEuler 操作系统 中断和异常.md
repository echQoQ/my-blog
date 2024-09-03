---
# 这是文章的标题
title: 实验四 openEuler 操作系统 中断和异常
# 你可以自定义封面图片
cover: /assets/images/cover2.jpg
# 这是页面的图标
icon: paper-plane
# 这是侧边栏的顺序
order: 4
# 设置作者
author: Mr.Liu
# 一个页面可以有多个分类
category:
  - 实验报告
# 一个页面可以有多个标签
tag:
  - 操作系统
  - 实验报告
# 此页面会在文章列表置顶
sticky: 2
# 此页面会出现在星标文章中
star: false
# 你可以自定义页脚
footer: 箱根山岳险天下
# 你可以自定义版权信息
copyright: 无版权
---

## 0x01 实验介绍

本次实验主要学习Linux中断的相关概念，介绍了共享中断、非共享中断，中断处理机制等；同时详细 对比了tasklet 和 workqueue 两种“下半部”实现机制。具体地，本次实验将带领学生学习如何为指定中断 事件注册中断处理程序，以及基于tasklet和workqueue完成任务的提交，并通过实例引导学生认识并理解 两种任务处理机制的差异。 
在实验开始之前，需要注意以下三点：
	① 本次实验已完成内核编译（openEuler 5.10.0-v8），可直接开始实验；
	② 本次实验可能用到的内核函数和系统调用均已在正文中给出，若要查看内核函数的详细信息，可前 往https://manpages.org/查询。 
	③ 对于任务四，请避免在工作队列尚有任务未执行时卸载模块，否则可能会引起树莓派死机。

## 0x02 实验目的

⚫ 学习掌握Linux中断的基本概念和分类 

⚫ 学习掌握如何为指定中断注册中断处理程序 

⚫ 学习掌握Linux的中断处理机制 

⚫ 学习掌握不同“下半部”处理机制的差异

## 0x03 实验任务

**给出你对内部中断、外部中断，软中断、硬中断分类的理解，以及对中断和异常二者关系的理解**

1. 内部中断和外部中断：
    - 内部中断：由CPU或其它硬件组件内部发出的中断。内部中断通常由CPU自身或者与CPU直接相连的硬件设备发出，不需要外部设备的干预。
    - 外部中断：来自于系统外部设备或者其他外部源的中断。外部中断需要通过系统总线或者专用的中断线与CPU相连，以通知CPU有外部事件需要处理。
2. 软中断和硬中断：
    - 软中断：由软件产生的中断，通常用于请求操作系统的服务或者进行系统调用。是通过特殊的指令或者软件中断指令来触发的。
    - 硬中断：由硬件设备发出的中断，用于通知CPU有外部事件需要处理。硬中断会引起CPU执行相应的中断服务程序。
3. 中断和异常的关系
	- 中断和异常都是计算机系统中用于处理异步事件的机制
	- 中断是一种外部或内部事件触发的机制，用于通知CPU有需要处理的事件，可以是硬件设备的信号或者特定的CPU指令。
	- 异常是指程序运行过程中的错误或者非预期情况，例如除零错误、非法指令等。异常是由于程序执行过程中出现了错误或者不正常的情况而引发的，而不是外部事件触发的。
### 3.1 任务一：利用/proc文件系统查看系统已注册的中断

**请你通过以下命令查看当前系统已注册的中断，并给出输出结果中各列的含义**

```shell
cat /proc/interrupts
```

![](/images/20240503222547.png)

- **第一列**：终端号
- **第二到五列**：分别表示CPU0、CPU1、CPU2、CPU3、CPU4接收到的各个中断的数量
- **第六列**：表示使用的中断控制器，`GICv2`，表示使用的是通用中断控制器的版本2
- **第七列**：中断线号，这是中断控制器分配给该中断请求的具体线号。
- **第八列**：触发类型，`Level`，表示这个中断是电平触发的
- **第九列**：中断源
- **IPI0 到 IPI6**：这些行表示的是CPU间的中断（Inter-Processor Interrupts，IPI），它们是用于在CPU之间进行通信的中断。每个IPI都有一个特定的用途
    - **IPI0**：通常用于调度（Rescheduling interrupts）。
    - **IPI1**：用于函数调用（Function call interrupts）。
    - **IPI2**：CPU停止中断（CPU stop interrupts）。
    - **IPI3**：用于在崩溃转储时停止CPU（CPU stop (for crash dump) interrupts）。
    - **IPI4**：定时器广播中断（Timer broadcast interrupts）。
    - **IPI5**：IRQ工作中断（IRQ work interrupts）。
    - **IPI6**：CPU唤醒中断（CPU wake-up interrupts）。

---
### 3.2 任务二：注册并处理中断

**(1) 请你自行编写Makefile文件，并在安装模块时传递参数并卸载。观察模块卸载前后/proc文件系统中显 示的已注册中断是否有变化。模块安装模块命令如下：**

```shell
insmod interrupt_example.ko irq=31 devname="interrupt_device" 
```

**注意：这里我们只是为31号中断注册了中断事件处理程序，myirq_handler不会立即被执行，只有当发生31 号中断且中断设备号为1900时，中断事件处理程序才会被执行。**

![](/images/20240503224613.png)

可以看到31号中断已被注册成功

Makefile文件为：

```Makefile
ifneq ($(KERNELRELEASE),)
	obj-m := interrupt_example.o
else
	KERNELDIR ?= /root/kernel
	PWD := $(shell pwd)
default:
	$(MAKE) -C $(KERNELDIR) M=$(PWD) modules
endif
.PHONY: clean
clean:
	-rm *.mod.c *.o *.order *.symvers *.ko *.mod
```

---

**(2) 请你参考(1)的步骤，为2号中断注册中断事件处理程序。根据日志判断是否注册成功，并分析成功或失败的原因。**

先运行`rmmod interrupt_example`将刚才的模块卸载

接着终端运行

```shell
insmod interrupt_example.ko irq=2 devname="interrupt_device2" 
```

出现报错![](/images/20240503225413.png)
![](/images/20240503231615.png)

操作不被接受，可以猜测2号中断是保留中断，不能注册
在 Linux 系统中，有一些中断号是保留给特定的硬件设备或者系统使用的，而且通常不允许用户自定义的模块使用这些中断。如果尝试注册这些保留的中断，会收到类似的错误消息，指示操作不被允许。

## 3.3 任务三：tasklet任务的创建

1. **使用tasklet实现两个小任务**

>请你参考tasklet_example内核模块，编写内核模块tasklet_reader_process，在该模块中创建两个小任务，其 中任务一负责读取并打印file文件中的内容（读取文件时分别尝试使用绝对路径和相对路径），任务二负责 打印当前系统的所有进程信息 (输出内容参考内核时间管理实验)。

编写`tasklet_reader_process.c`和Makefile，在附件的exp4/3目录下

编译并导入内核![](/images/20240503231845.png)
查看消息日志如下（绝对路径）

![](/images/20240503231712.png)

2. **请你多次安装并卸载内核，观察日志输出结果。根据你的发现，在使用绝对路径和相对路径的情况下， 基于tasklet的任务一和任务二能否全部正常执行？若不能，请你分析执行失败的原因（可查找相关资料， 结合tasklet的特点进行分析）。**

使用绝对路径时如上所示，读取文件正常

当用相对路径时读取文件失败，读取失败，出现这个：
![](/images/20240503232503.png)

<font color="#e36c09">分析失败原因</font>

- Tasklet 在内核中是一种轻量级的延迟执行机制，它主要用于在中断上下文中执行相对较短的延迟工作。
- 相对路径的解析依赖于当前工作目录等环境变量。在内核初始化阶段或者中断上下文中，这些环境变量可能尚未设置或不可用，导致相对路径解析失败。

**3. **基于tasklet实现中断事件处理程序的下半部处理**

>现要求内核检测到31号中断时，需要执行以上文件读取和进程打印的任务，请你结合任务二中提供的 interrupt_example模块的实现，编写内核模块interrupt_tasklet，完成中断处理程序的注册。

interrupt_tasklet.c 和Makefile在exp4/3/3.3目录下
执行截图如下

![](/images/20240503234923.png)

查看当前系统已注册的中断可看到

![](/images/20240503235145.png)

查看消息日志

![](/images/20240503235208.png)


### 任务四：workqueue工作队列的创建

1. **workqueue任务创建示例——延时与非延时任务**

>思考：请自行编写Makefile并完成内核模块的安装和卸载，查看日志，并结合代码对日志结果进行分析（tips: 结合两个任务打印的时机分析）。

![](/images/20240503235831.png)

根据示例代码片段

```C
queue_delayed_work(queue, &work2, 2500);//add delayed_work work2 to workqueue 
for (; i < times; i++) 
{ 
	queue_work(queue, &work1);//add work1 to workqueue 
	ssleep(5); 
} 
```

可见work2被推迟，在work1执行两遍后才执行了work2，打印出`Delayed Work.`

2. 基于workqueue实现系统状态打印

>请你参考workqueue_example.c，编写内核模块workqueue_system_info，在该模块中创建一个延时任务work， 借助/proc文件系统实现每隔1s (实际打印间隔可能因为字符处理占用时间而变大) 打印一次当前系统的状 态，包括启动时间、内存使用情况，打印10次后停止打印


对应代码在exp4/4/4.2

![](/images/20240504002525.png)

运行结果如下

![](/images/20240504004926.png)

3. 基于workqueue实现中断事件处理程序的下半部处理

>现要求内核检测到31号中断时，执行以上系统状态打印的任务，请你编写内核模块interrupt_workqueue， 完成中断处理程序的注册。

代码在exp4/4/4.3

运行截图如下：

![](/images/20240504011346.png)

![](/images/20240504011419.png)
