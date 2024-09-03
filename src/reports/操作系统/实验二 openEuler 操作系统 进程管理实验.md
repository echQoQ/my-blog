---
# 这是文章的标题
title: 实验二 openEuler 操作系统 进程管理实验
# 你可以自定义封面图片
cover: /assets/images/cover2.jpg
# 这是页面的图标
icon: paper-plane
# 这是侧边栏的顺序
order: 2
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
sticky: false
# 此页面会出现在星标文章中
star: false
# 你可以自定义页脚
footer: 箱根山岳险天下
# 你可以自定义版权信息
copyright: 无版权
---

>[! col2] 实验人 
>- 姓名：刘志豪
>- 学号：22920212204174

## 0x01 实验目的

⚫ 学习掌握Linux内核线程的创建；

⚫ 学习掌握Linux内核线程的状态转换；

⚫ 了解如何通过/proc文件系统获取系统当前运行状态；

⚫ 了解cgroup进程分组化管理工具，学习如何限制内核线程的CPU核心数和利用率。

## 0x02 实验任务

### 1 任务一：创建并运行内核线程

#### 1.1 基本知识——内核线程相关函数

- `kthread_create()`：
    - **参数**：
        - `threadfn`：指向线程函数的指针，这是新线程将要执行的函数。
        - `data`：传递给线程函数的参数。
        - `namefmt`：线程名称的格式字符串，可以像`printf`一样包含格式化选项。
    - **作用**
	    - 创建一个新的内核线程，但不立即启动它。返回一个`task_struct`结构体指针，代表新线程。
- `kthread_run()`：
    - **参数**：
        - `threadfn`：指向线程函数的指针，这是新线程将要执行的函数。
        - `data`：传递给线程函数的参数。
        - `namefmt`：线程名称的格式字符串，可以像`printf`一样包含格式化选项。
    - **作用**：创建并立即启动一个内核线程。这是`kthread_create()`和`wake_up_process()`的便捷组合。
- `wake_up_process()`：
    - **参数**：
        - `p`：指向`task_struct`的指针，代表要唤醒的线程。
    - **作用**：唤醒处于休眠状态的线程。如果线程已经在运行，调用此函数没有效果。
- `kthread_stop()`：
    - **参数**：
        - `k`：指向`task_struct`的指针，代表要停止的线程。
    - **作用**：请求停止线程，并等待线程响应并退出。设置线程的`kthread_should_stop`标志为`true`，并唤醒线程以便它可以检查该标志。
- `kthread_should_stop()`：
    - **参数**：无。
    - **作用**：线程函数可以调用此函数来检查是否有停止线程的请求。如果有，线程应当清理资源并退出。

#### 1.2 实验任务

>任务一：要求编写内核模块kthread_stu_id，要求在创建模块时传入学号。在内核模块中创建线程stuIdThread， 在该线程里每隔3秒打印学号的各个字符（从第一位开始，一直到学号的最后一位结束）。例如对于学号 “230201911”，应每隔3秒依次打印出2,3,0,2,0,1,9,1,1。若学号每一位都打印完毕但线程仍处于运行状态， 调整打印信息为“All digits of student ID have been printed”，且打印频率为5秒一次。
> 任务二：自行编写Makefile，完成源码的编译、内核模块安装和卸载的过程，查看内核日志，验证结果的正 确性。

##### 1.2.1 代码

***stuldThread.c***

```
#include <linux/kthread.h>
#include <linux/module.h> 
#include <linux/delay.h> 

MODULE_LICENSE("GPL");

##define BUF_SIZE 20 

static struct task_struct *stuldThread = NULL; //进程

static char* stu_id; // 学号
module_param(stu_id, charp, 0644); //模块初始化时输入
MODULE_PARM_DESC(stu_id,"char* param --> STUDENT ID.");

static int print(void *data)
{
 char *sid = (char*)data; //格式转化
 int i=0; //记录序号
 while(!kthread_should_stop()){
  if(sid[i] != '\0'){ //判断是否到字符串结尾
         printk("Index %d of Student ID: %c",i,sid[i]); //格式化打印字符串
         i++;
         msleep(3000); //停3秒
  } else {
          printk("All digits of student ID have been printed.");
          msleep(5000); //停5秒
  }
 }
 return 0;
}

static int __init kthread_init(void)
{
 printk("Create kthread stuldThread.\n");
 stuldThread = kthread_run(print, stu_id, "stuldThread"); //创建并启动进程，并将其赋予变量stuldThread
 return 0;
}

static void __exit kthread_exit(void)
{
 printk("Kill kthread stuldThread.\n");
 if(stuldThread)
  kthread_stop(stuldThread); //结束进程
}

module_init(kthread_init);
module_exit(kthread_exit);
```

***Makefile***

```
ifneq ($(KERNELRELEASE),)
        obj-m := stuldThread.o
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

##### 1.2.2实验过程及结果

1. `make`编译
2. `insmod stuldThread.ko stu_id="22920212204174"`将模块导入内核并输入学号
3. `lsmod`查看导入情况![](/images/20240322171539.png)
4. `dmesg | tail -n 25` 查看内核消息队列![](/images/20240322171842.png)
## 2 任务二：绑定内核线程到指定CPU

#### 2.1 基本知识

- `kthread_bind()`
	- **参数**：
	    - `k`：指向`task_struct`的指针，代表要绑定的线程。
	    - `cpu`：整数，表示CPU的编号，线程将被绑定到这个CPU上。
	- **作用**：
	    - 将指定的线程绑定到特定的CPU，以确保线程总是在该CPU上运行。
### 2.2 任务2.1
>你知道MyPrintk中current全局变量的含义吗？请你编写kthread_bind_test.c，通过实验判断将线程绑定到指定CPU核心时，线程应当处于什么状态？唤醒线程后能否通过kthread_bind()切换线程所在CPU？ 通过命令查看当前机器的CPU核数，若在绑定时设定的CPU核心ID超过机器本身的CPU核数，会产生什 么结果？请结合实验结果验证你的结论。

- 根据示例中MyPrink代码推断，current全局变量应该是指运行中的线程本身对应的指针
- 当将线程唤醒之后不能通过`kthread_bind`切换线程所在CPU，验证代码如下![](/images/20240322181311.png)其他与示例一致
- 实验结果如下]]![](/images/20240322180700.png)
- 可以看见出现了报错，且线程并未切换到指定的1号，可见前面的结论是正确的
---
- 将线程绑定到指定CPU核心时，线程应当处于什么状态，下面也将通过实验求证，代码如下![](/images/20240322181804.png)
- 实验结果为![](/images/20240322181727.png)
- 线程状态为2，代表`TASK_UNINTERRUPTIBLE`，这意味着线程正在等待某个特定条件，且不能被信号中断。
---
- 通过命令查看当前机器的CPU核数
	- `nproc`![](/images/20240322182154.png)
- 若在绑定时设定的CPU核心ID超过机器本身的CPU核数![](/images/20240322182418.png)
- 可见未切换到指定的5号，则说明ID超过机器本身CPU核数时切换不成功

#### 2.3 任务2.2
>假设当前服务器CPU的核数为N，请你编写`kthread_bind_cores.c`，实现创建N个线程，每个线程与一个CPU核心绑定，并在各个线程运行时每隔2秒打印一次当前线程名和占用的CPU ID，要求每个线程使用同一个MyPrintk()打印函数。

1. 代码

```
#include <linux/module.h>
#include <linux/kernel.h> 
#include <linux/init.h> 
#include <linux/kthread.h>
#include <linux/sched.h>
#include <linux/delay.h>

static struct task_struct *kt = NULL;
static char *kt_names[] = {"kt_1", "kt_2", "kt_3", "kt_4"};
#define KT_COUNT 4

static int MyPrintk(void *data)
{
    while (!kthread_should_stop())
    {
        int cpu = get_cpu();
        put_cpu();
        printk("kthread %s is running on cpu %d\n", current->comm, cpu);
        msleep(2000);
    }
    return 0;
}

static int __init init_kthread(void)
{
    int i;
    for (i = 0; i < KT_COUNT; i++) {
        kt = kthread_create(MyPrintk, NULL, "%s", kt_names[i]);
        if (kt) {
            kthread_bind(kt, i);
            wake_up_process(kt);
            printk("kthread %s bound to cpu %d and started\n", kt_names[i], i);
        } else {
            printk("Failed to create kthread %s\n", kt_names[i]);
        }
    }
    return 0;
}

static void __exit exit_kthread(void)
{

}

module_init(init_kthread);
module_exit(exit_kthread);
MODULE_LICENSE("GPL");
```

2. 运行
	1. 编译，`make`
	2. 将模块导入内核，`insmod kthread_bind_cores.ko`
	3. 查看消息缓冲区，`dmesg | tail -n 50`
	4. 运行截图![[Pasted image 20240405180439.png]]![[Pasted image 20240405180508.png]]
### 2.4 任务2.3
>自行编写Makefile，完成源码的编译、内核模块安装和卸载的过程，查看内核日志，验证结果的正确性。

- 任务二的Makefile

```
ifneq ($(KERNELRELEASE),)
	obj-m := kthread_bind_cores.o
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

- 运行过程上面已经描述了

### 3 任务三：内核线程的睡眠和唤醒

#### 3.1 基本知识
>Linux提供了schedule_timeout_uninterruptible()函数用于将当前正在运行的线程进入睡眠状态，处于睡眠状 态的线程可以通过wake_up_process()唤醒进入运行状态。

#### 3.2 请你自行编写Makefile，完成源码的编译、内核模块安装和卸载的过程，查看内核日志，回答以下问题

示例代码中的`current_kernel_time()`已被废弃，部分代码更改如下

```
static int __init wake_up_process_init(void)
{
    struct timespec64 current_time;
    long loop_end_ts;

    wake_up_thread = current;

    // Create a new thread 
    new_thread = kthread_create_on_node(myPrintk, NULL, -1, "new_thread");

    // Wake up the new thread and run it 
    wake_up_process(new_thread);

     ktime_get_real_ts64(&current_time);
    loop_end_ts = current_time.tv_sec + 5;

    // Make current thread run for 5 seconds 
    while (current_time.tv_sec <= loop_end_ts) {
         ktime_get_real_ts64(&current_time);
    }

    // Make current thread sleep for some time 
    schedule_timeout_uninterruptible(1000 * 5);

    // Wake up current thread 
    wake_up_process(current);

    return 0;
}
```

运行截图
![](/images/20240405193518.png)

>[! question] 问题一 
>阅读程序打印日志，内核初始化模块中，schedule_timeout_uninterruptible ()方法将哪个线程（给出线程名称comm）进入了睡眠状态？日志中线程状态是以long类型输出的，你能给出各个long类型状态数值代表的含义吗 (如运行状态、结束状态、睡眠状态等)？

根据运行日志![](/images/20240405193117.png)
可以看到是`wake_up_thread`进入了睡眠状态
***各个long类型状态数值代表的含义***
- **0**：TASK_RUNNING（运行状态）
- **1**：TASK_INTERRUPTIBLE（可中断的睡眠状态）
- **2**：TASK_UNINTERRUPTIBLE（不可中断的睡眠状态）
- **4**：TASK_STOPPED（停止##状态）
- **8**：TASK_TRACED（跟踪状态）
- **64**：TASK_DEAD（结束状态）
- **128**：TASK_WAKEKILL（即将被杀死状态）
- **256**：TASK_WAKING（唤醒中状态）
- **512**：TASK_PARKED（停泊状态）
- **1024**：TASK_NOLOAD（不加载状态）

>[! question] 问题二 
>执行线程睡眠方法前后以及内核模块卸载前后，线程new_thread和wake_up_thread的PID和状态 是否发生变化？这种变化是必然发生的吗？如有变化，请你结合代码和线程的实际运行情况，分析PID或状态变化的原因。提示：可以从线程状态转换图、Linux中task_struct结构体复用等角度进行分析。

![](/images/20240405194201.png)

根据日志来看执行睡眠方法和模块卸载前后，两个线程的PID都未发生改变
但在`wake_up_thread`执行睡眠方法后，其状态由0变为2，表示从运行状态变为睡眠状态

`wake_up_thread`后面状态又有0变为128，推测是函数执行完毕，进入即将被杀死的状态

### 4 任务四：利用/proc文件系统实时获取系统状态信息

1. 代码

**cycle_print_kthread.c**

```
#include <linux/module.h>
#include <linux/kernel.h>
#include <linux/kthread.h>
#include <linux/delay.h>
#include <linux/fs.h>
#include <linux/slab.h>
#include <linux/string.h>

##define UPTIME_FILE "/proc/uptime"
#define MEMINFO_PATH "/proc/meminfo"

static struct task_struct *kthread;

static int cycle_print_kthread(void *data) {
    struct file *file;
    char *line = NULL;
    size_t len = 256; // Initial length of the buffer
    ssize_t read;
    unsigned long uptime;
    int total_mem = 0, free_mem = 0, used_mem;

    printk(KERN_INFO "cycle_print_kthread started\n");

    line = kmalloc(len, GFP_KERNEL); // Allocate memory for the buffer
    if (!line) {
        printk(KERN_ERR "Failed to allocate memory\n");
        return -ENOMEM;
    }

    while (!kthread_should_stop()) {
        // Read uptime
        file = filp_open(UPTIME_FILE, O_RDONLY, 0);
        if (!file) {
            printk(KERN_ERR "Error opening uptime file\n");
            kfree(line);
            return -ENOENT;
        }
        kernel_read(file, line, len - 1, 0);
        sscanf(line, "%lu", &uptime);
        filp_close(file, NULL);

        // Read memory info
        file = filp_open(MEMINFO_PATH, O_RDONLY, 0);
        if (!file) {
            printk(KERN_ERR "Error opening meminfo file\n");
            kfree(line);
            return -ENOENT;
        }

        read = kernel_read(file, line, len - 1, 0);
        line[read] = '\0'; // Add null terminator
        sscanf(line, "MemTotal:%*s %d kB\nMemFree:%*s %d kB", &total_mem, &free_mem );

        filp_close(file, NULL);

        used_mem = total_mem - free_mem;

        total_mem /= 1024;
        free_mem /= 1024;
        used_mem /= 1024;

        printk(KERN_INFO "current uptime: %lu s\n", uptime);
        printk(KERN_INFO "total memory: %d MB\n", total_mem);
        printk(KERN_INFO "free memory: %d MB\n", free_mem);
        printk(KERN_INFO "occupy memory: %d MB\n", used_mem);

        msleep(3000); // Sleep for 3 seconds
    }

    kfree(line);
    return 0;
}

static int __init init_cycle_print_kthread(void) {
    kthread = kthread_create(cycle_print_kthread, NULL, "cycle_print_kthread");
    if (IS_ERR(kthread)) {
        printk(KERN_ERR "Failed to create kernel thread\n");
        return PTR_ERR(kthread);
    }
    wake_up_process(kthread);

    return 0;
}

static void __exit exit_cycle_print_kthread(void) {
    kthread_stop(kthread);
}

module_init(init_cycle_print_kthread);
module_exit(exit_cycle_print_kthread);
MODULE_LICENSE("GPL");
```

**Makefile**

```
ifneq ($(KERNELRELEASE),)
    obj-m := cycle_print_kthread.o
else
    KERNELDIR ?= /root/kernel
    PWD := $(shell pwd)
    EXTRA_CFLAGS := $(filter-out -mgeneral-regs-only, $(EXTRA_CFLAGS))

default:
	$(MAKE) -C $(KERNELDIR) M=$(PWD) modules
endif

.PHONY: clean
clean:
	-rm *.mod.c *.o *.order *.symvers *.ko *.mod
```

2. 编译运行

![](/images/20240405212713.png)

![](/images/20240405212329.png)


### 5 任务五：使用cgroup限制CPU核数

1. 基本知识——cgroup 

>cgroup (Control Groups)是Linux中对任意线程进行分组化管理的工具。


2. 复现实验流程，实现对进程使用CPU核数的限制

运行截图：
![](/images/20240405213841.png)
![](/images/20240405213906.png)

### 6 任务六：使用cgroup限制CPU利用率

2. 复现实验流程
![](/images/20240405214743.png)
![](/images/20240405214827.png)
![](/images/20240405214847.png)

可见经过设置CPU利用限制，进程`cgroup_cpu`的CPU利用率下降至19.9%

`cpu.cfs_quota_us` 和 `cpu.cfs_period_us` 是 Linux 内核中控制 CFS (Completely Fair Scheduler) CPU 配额的两个参数。CFS 是 Linux 内核中的一种调度器，负责在多个进程之间分配 CPU 时间。

这两个参数的含义如下：
1. `cpu.cfs_quota_us`：这个参数定义了在一段时间内一个 cgroup 可以使用 CPU 的总时间量。单位是微秒（μs）。例如，如果 `cpu.cfs_quota_us` 设置为 100000，那么表示在 `cpu.cfs_period_us` 定义的时间内（通常是1秒），这个 cgroup 可以使用 CPU 100毫秒。如果设置为 -1，则表示没有限制。
2. `cpu.cfs_period_us`：这个参数定义了一个周期的长度，用于计算 `cpu.cfs_quota_us` 中定义的 CPU 时间量。单位也是微秒（μs）。例如，如果 `cpu.cfs_period_us` 设置为 1000000（即1秒），而 `cpu.cfs_quota_us` 设置为 500000（即0.5秒），那么这个 cgroup 在每秒的时间内可以使用 CPU 50%。

运行如下指令使cgroup_cpu的利用率维持在40%

```
echo 40000 > /sys/fs/cgroup/cpu/mycpu/cpu.cfs_quota_us 
echo 486 > /sys/fs/cgroup/cpu/mycpu/tasks
```

![](/images/20240405215201.png)