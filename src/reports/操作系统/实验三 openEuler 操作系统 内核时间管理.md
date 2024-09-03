---
# 这是文章的标题
title: 实验三 openEuler 操作系统 内核时间管理
# 你可以自定义封面图片
cover: /assets/images/cover2.jpg
# 这是页面的图标
icon: paper-plane
# 这是侧边栏的顺序
order: 3
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

## 1. 实验介绍 
本次实验主要学习Linux内核时间管理机制，具体包含内核定时器和内核时钟接口两部分。具体地，本
次实验将带领学生学习内核定时器的创建、修改与删除，并基于内核定时器实现自定义延时任务，加深初学者对Linux 内核定时机制的理解；另外，本次实验还将介绍如何利用Linux内核时钟接口计算任务的执行时间，以便衡量处理具体任务的耗时情况。 
在实验开始之前，需要注意以下三点： 
1. 本次实验服务器已完成内核编译（openEuler 5.10.0-v8），可直接开始实验； 
2. 本次实验可能用到的内核函数和系统调用已在正文中给出，详细信息可在https://manpages.org/查询。 
3. 本次实验中，请不要在timer 定时器尚未触发前卸载模块（任务一、任务二、任务五），否则可能导致树莓派死机。 
## 2. 实验目的 
⚫ 学习掌握Linux内核时间管理机制 

⚫ 学习掌握Linux中jiffies、HZ、tick、节拍、时钟中断的具体含义以及与系统时钟的联系 

⚫ 学习掌握Linux内核时钟接口的使用和调用结果的处理 

⚫ 加深学生理解常用排序算法的时间性能差异 
## 3. 实验任务

### 3.1 内核定时器和时钟接口基本概念和用法
略

### 3.2 任务一：创建定时任务，完成特定时刻执行特定任务

> [!info] ==任务描述== 
> 请你参考example_timer.c，根据提示编写内核模块student_timer和相应的Makefile，基于定时器timer实 现每隔2秒钟依次打印学号的每个字符。

1. 代码

**student_timer.c**

```
##include <linux/module.h> 
##include <linux/timer.h> 
 
MODULE_LICENSE("GPL"); 
 
struct timer_list timer;

static char student_id[] = "22920212204174";

static int idx = 0;

void print(struct timer_list *timer) 
{
 if (student_id[idx] != '\0') {
     printk(KERN_INFO "%c\n",student_id[idx]);
     timer->expires = jiffies + 2 * HZ;
     add_timer(timer); 
     idx = idx+1;
 }
} 
 
static int __init timer_init(void) 
{ 
 printk("timer init\n"); 
 timer.expires = jiffies + 2 * HZ; 
 timer.function = print; 
 add_timer(&timer); 
 printk("timer added\n"); 
 return 0; 
} 
 
static void __exit timer_exit(void) 
{ 
 printk("timer exit\n"); 
} 
 
module_init(timer_init); 
module_exit(timer_exit);
```

**Makefile**

```
ifneq ($(KERNELRELEASE),)
	obj-m := student_timer.o
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

2. 代码描述

声明静态变量`student_id`和`idx`，并改写了示例代码的`print`函数，使得执行`print`时打印`student_id`在`idx`处的字符，并同时修改`timer`使得2秒后再执行`print`函数，每次执行`print`函数会使得`idx`加一，这样就可以遍历`student_id`，直到遇到`'\0'`

3. 运行

- 执行步骤为
	- `make`:编译
	- `insmod student_timer.ko`:导入内核
	- `lsmod`:查看导入情况
	- `dmesg | tail | -n 16`:查看缓冲区消息队列
- 运行截图如下![[Pasted image 20240407160610.png]]![[Pasted image 20240407161546.png]]
### 3.3 任务二：更改定时器的唤醒时间

Linux内核提供了mod_timer()函数用于修改已处于队列中的定时器的过期时间，mod_timer()的函数声明如下：

```
int mod_timer(struct timer_list *timer, unsigned long expires);
```

> [!info] ==任务描述==
> 请你根据提示编写内核模块mod_timer，在该模块中创建定时任务timer，定时器超时回调任务设置为打印 “hello, world!”。注意：你需要将timer的初始过期时间设置为10秒并通过add_timer()添加到定时器队列中。之后通过mod_timer()立即修改定时器的过期时间为15秒。 

1. 代码

**mod_timer.c**

```
##include <linux/module.h>
##include <linux/timer.h>
##include <linux/delay.h>

MODULE_LICENSE("GPL");

static struct timer_list timer;
static int seconds = 0;
static int flag = 0;
void print(struct timer_list *t)
{
    printk(KERN_INFO "hello, world!\n");
    flag = 1;
}

static int __init mod_timer_init(void)
{
    printk(KERN_INFO "timer init\n");
    timer.expires = jiffies + 10 * HZ;
    timer.function = print;
    add_timer(&timer);
    mod_timer(&timer, jiffies + 15*HZ);
    while (!flag){
	   msleep(1000);
	   seconds++;
	   printk(KERN_INFO "%dth second\n",seconds);
    } 
    return 0;
}

static void __exit mod_timer_exit(void)
{
    printk(KERN_INFO "timer exit\n");
}

module_init(mod_timer_init);
module_exit(mod_timer_exit);
```

**Makefile**

```
ifneq ($(KERNELRELEASE),)
	obj-m := mod_timer.o
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

2. 运行截图

![](/images/20240407164422.png)


> [!question] 思考
> 对比任务一，思考直接修改timer的expires字段并重新添加到队列与通过mod_timer()函数更改定时 器唤醒时间两种方式的区别，并编写student_timer_via_mod内核模块，在该模块中利用mod_timer()函数实现任务一。

1. **区别**
直接修改expires字段可以更加灵活地控制定时器的唤醒时间，而无需重复创建和初始化定时器结构体；而mod_timer()函数封装了修改expires字段并重新添加到队列的操作，提供了一种安全和方便的方式来修改定时器的唤醒时间，可以确保在修改定时器时间时不会出现竞态条件和同步问题。

2. 代码

**student_timer_via_mod.c**

```
##include <linux/module.h> 
##include <linux/timer.h> 
 
MODULE_LICENSE("GPL"); 
 
struct timer_list timer;

static char student_id[] = "22920212204174";

static int idx = 0;

void print(struct timer_list *timer) 
{
 if (student_id[idx] != '\0') {
     printk(KERN_INFO "%c\n",student_id[idx]);
     mod_timer(timer, jiffies + 2 * HZ); //只改了这里
     idx = idx+1;
 }
} 
 
static int __init timer_init(void) 
{ 
 printk("timer init\n"); 
 timer.expires = jiffies + 2 * HZ; 
 timer.function = print; 
 add_timer(&timer); 
 printk("timer added\n"); 
 return 0; 
} 
 
static void __exit timer_exit(void) 
{ 
 printk("timer exit\n"); 
} 
 
module_init(timer_init); 
module_exit(timer_exit);
```

3. 运行截图
![](/images/20240407165318.png)


### 3.4 任务三：删除已创建的定时器

Linux内核提供了del_timer()函数将已创建的定时器从内核定时器队列中删除，del_timer()的函数声明如下：

```
int del_timer(struct timer_list * timer);
```

> [!info] ==任务描述==
> 请你编写内核模块del_timer，创建一个timer并设置过期时间，并在timer过期之前停止该timer。实验报告中给出的输出结果或截图需要能够验证该定时器确实已经停止，即timer对应的超时回调函数在timer设 定的expires过期时间之后并未执行。

1. 代码

**del_timer.c**

```
##include <linux/module.h> 
##include <linux/timer.h> 
##include <linux/delay.h>

MODULE_LICENSE("GPL"); 
 
struct timer_list timer;

static int getCurrentTime(void) 
{ 
    int year, mon, day, hour, min, sec; 
    struct timespec64 ts; 
    struct tm tm; 
    ktime_get_real_ts64(&ts); 
    time64_to_tm(ts.tv_sec, 0, &tm); 
    year = tm.tm_year + 1900; 
    mon = tm.tm_mon + 1; 
    day = tm.tm_mday; 
    hour = tm.tm_hour + 8;  
    min = tm.tm_min; 
    sec = tm.tm_sec; 
    printk("Current time:%d-%02d-%02d %02d:%02d:%02d\n", year, mon, day, hour, min, sec); 
    return (int)ts.tv_sec; 
} 

void print(struct timer_list *timer) 
{
 printk(KERN_INFO "Hello, world!\n");
}

static int __init timer_init(void) 
{ 
 printk("timer init\n"); 
 timer.expires = jiffies + 5 * HZ; 
 timer.function = print; 
 add_timer(&timer);
 printk(KERN_INFO "Timer is added.\n");
 getCurrentTime();
 del_timer(&timer);
 printk(KERN_INFO "Timer is deleted.\n");
 msleep(15000);
 getCurrentTime(); 
 return 0; 
} 
 
static void __exit timer_exit(void) 
{ 
 printk("timer exit\n"); 
} 
 
module_init(timer_init); 
module_exit(timer_exit);
```

**Makefile**

```
ifneq ($(KERNELRELEASE),)
	obj-m := del_timer.o
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

2. 代码解释

首先创建一个定时器并且绑定`print`，超时时间是10秒，并且打印时间，接着调用`del_timer`函数删除这个定时器，在15秒后打印时间，此期间`print`函数未被调用说明`timer`未生效

3. 运行结果截图

![](/images/20240407171303.png)

### 3.5 任务四：遍历所有进程，打印进程信息

>[! info] ==任务描述==
>请你根据以上基本知识，编写内核模块process_info，在该模块中打印系统内所有进程的基本信息（进程 名、进程ID、进程状态、进程占用内存大小）

1. 代码

**process_info.c**

```
##include <linux/module.h>
##include <linux/sched/signal.h>
##include <linux/sched.h>

MODULE_LICENSE("GPL");

static int __init processInfo_init(void)
{
    struct task_struct *p;
    int i = 1;
    printk("processInfo init\n");
    printk("id\tname\tpid\tstate\tmem\n");
    for_each_process(p) {
            printk("%d\t%s\t%d\t%ld\t%lu\n",i++,p->comm, p->pid, p->state, p->mm?p->mm->total_vm:0);
    }

    return 0;
}

static void __exit processInfo_exit(void)
{
    printk("processInfo exit\n");
}

module_init(processInfo_init);
module_exit(processInfo_exit);
```

**Makefile**

```
ifneq ($(KERNELRELEASE),)
	obj-m := process_info.o
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

2. 运行截图
![](/images/20240407180113.png)

![](/images/20240407175916.png)

### 3.6 任务五：获取占用内存Top-K的进程列表

> [!info] 任务描述
> 请你编写内核模块topK_process_info，在该模块中创建定时器timer，设置定时时间为5秒。当该timer触发时，打印占用内存最大的10个进程信息，并按照占用内存大小降序排列。

1. 代码

**topK_process_info.c**

```C
##include <linux/module.h>
##include <linux/timer.h>
##include <linux/sched/signal.h>
##include <linux/sched.h>

MODULE_LICENSE("GPL");

##define TOP_K 10

static struct timer_list process_timer;

static void print_top_k_process_info(struct timer_list *t)
{
    struct task_struct *p;
    struct task_struct *top_k_processes[TOP_K] = {NULL};
    int i;

    printk(KERN_INFO "Top %d process using most memory is as follow:\n", TOP_K);
    printk(KERN_INFO "rank\tname\tpid\tstate\tmem\n");

    for_each_process(p) {
        if (p->mm && p->mm->total_vm > 0) {
            for (i = 0; i < TOP_K; i++) {
                if (!top_k_processes[i] || p->mm->total_vm > top_k_processes[i]->mm->total_vm) {
                    memmove(&top_k_processes[i + 1], &top_k_processes[i], (TOP_K - i - 1) * sizeof(struct task_struct *));
                    top_k_processes[i] = p;
                    break;
                }
            }
        }
    }

    for (i = 0; i < TOP_K; i++) {
        if (top_k_processes[i]) {
            printk(KERN_INFO "%d\t%s\t%d\t%ld\t%lu\n", i + 1, top_k_processes[i]->comm, top_k_processes[i]->pid,
                   top_k_processes[i]->state, top_k_processes[i]->mm->total_vm);
        }
    }
}

static int __init topK_process_info_init(void)
{
    printk(KERN_INFO "topK_processInfo init\n");

    timer_setup(&process_timer, print_top_k_process_info, 0);
    mod_timer(&process_timer, jiffies + msecs_to_jiffies(5000)); // 5秒

    return 0;
}

static void __exit topK_process_info_exit(void)
{
    del_timer(&process_timer);
    printk(KERN_INFO "topK_processInfo exit\n");
}

module_init(topK_process_info_init);
module_exit(topK_process_info_exit);
```

**Makefile**

```shell
ifneq ($(KERNELRELEASE),)
	obj-m := topK_process_info.o
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

2. 代码说明

本代码中的排序算法如下：
- 遍历已排序的进程数组`top_k_processes`，对于每个元素，比较当前进程的内存大小和已排序进程的内存大小。
- 如果当前进程的内存大小大于已排序进程的内存大小，则将已排序的进程往后移动一位。
- 直到找到一个已排序的进程的内存大小小于或等于当前进程的内存大小，或者已经遍历完所有已排序的进程。这时，将当前进程插入到该位置

3. 运行截图

![](/images/20240407180948.png)


### 3.7 任务六：比较常用排序算法的效率

>[! info] 任务描述
>常见的数据排序算法有选择排序、插入排序、冒泡排序、堆排序、快速排序等，它们具有不同的时间复杂度，本任务将衡量冒泡排序、快速排序两种排序算法的时间消耗。
>请你分别编写bubble_sort、quick_sort两个内核模块，在各个模块中实现对应的排序算法，读取file并输出对file文件中所有整数排序需要耗费的时间，以微秒uesc为单位，同时输出排序后的结果。

#### 1. 冒泡排序

**代码**

```C
##include <linux/module.h>
##include <linux/kernel.h>
##include <linux/fs.h>
##include <linux/slab.h>
##include <linux/uaccess.h>
##include <linux/timekeeping.h>

MODULE_LICENSE("GPL");

static void bubble_sort(int *arr, int n) {
    int i, j, temp;
    for (i = 0; i < n - 1; i++) {
        for (j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}

static int __init bubble_sort_init(void) {
    struct file *file;
    char *buf;
    loff_t pos = 0;
    ssize_t read_bytes;
    int *numbers = NULL;
    int capacity = 128, num_count = 0;
    char *ptr, *end_ptr;
    long num;
	int i;
	struct timespec64 start, end;
    s64 time_spent;

    printk(KERN_INFO "Start bubble sort module!\n");

    file = filp_open("./file", O_RDONLY, 0);
    if (IS_ERR(file)) {
        printk(KERN_ERR "Failed to open file\n");
        return PTR_ERR(file);
    }

    buf = kmalloc(file_inode(file)->i_size + 1, GFP_KERNEL); // Allocate buffer to hold the entire file
    if (!buf) {
        printk(KERN_ERR "Failed to allocate buffer\n");
        filp_close(file, NULL);
        return -ENOMEM;
    }

    numbers = kmalloc(capacity * sizeof(int), GFP_KERNEL);
    if (!numbers) {
        printk(KERN_ERR "Failed to allocate numbers array\n");
        kfree(buf);
        filp_close(file, NULL);
        return -ENOMEM;
    }

    read_bytes = kernel_read(file, buf, file_inode(file)->i_size, &pos);
    buf[read_bytes] = '\0';

    ptr = buf;
    while (*ptr) {
        num = simple_strtol(ptr, &end_ptr, 10);
        if (ptr == end_ptr) {
            break;
        }
        ptr = end_ptr;
		while (*ptr == ' ') {
			ptr++;
		}
        if (num_count >= capacity) {
            capacity *= 2;
            numbers = krealloc(numbers, capacity * sizeof(int), GFP_KERNEL);
            if (!numbers) {
                printk(KERN_ERR "Failed to reallocate numbers array\n");
                kfree(buf);
                filp_close(file, NULL);
                return -ENOMEM;
            }
        }
        numbers[num_count++] = (int) num;
    }

	ktime_get_real_ts64(&start);
	printk(KERN_INFO "Before bubble sort, current time is %lld s with %ld us\n", start.tv_sec, start.tv_nsec / 1000);

	bubble_sort(numbers, num_count);

	ktime_get_real_ts64(&end);
	printk(KERN_INFO "After bubble sort, current time is %lld s with %ld us\n", end.tv_sec, end.tv_nsec / 1000);

	time_spent = ((end.tv_sec - start.tv_sec) * 1000000000 + (end.tv_nsec - start.tv_nsec)) / 1000;
	printk(KERN_INFO "Bubble sort finished and took %lld us\n", time_spent);
	printk(KERN_INFO "The result after bubble sort is: \n");

    for (i = 0; i < num_count; i++) {
        printk(KERN_INFO "%d\n", numbers[i]);
    }

    kfree(numbers);
    kfree(buf);
    filp_close(file, NULL);

    return 0;
}

static void __exit bubble_sort_exit(void) {
    printk(KERN_INFO "Exit bubble_sort module!\n");
}

module_init(bubble_sort_init);
module_exit(bubble_sort_exit);
```

**代码说明**
- 首先从`file`中读取数据到缓冲区`buf`
- 再将其转存到数组中
- 对数组进行冒泡排序，计算所需时间

**运行截图**
![](/images/20240419174147.png)


#### 快速排序

**代码**

```C
##include <linux/module.h>
##include <linux/kernel.h>
##include <linux/fs.h>
##include <linux/slab.h>
##include <linux/uaccess.h>
##include <linux/timekeeping.h>

MODULE_LICENSE("GPL");

static int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = (low - 1);
	int j;
	int temp;

    for (j = low; j <= high - 1; j++) {
        if (arr[j] <= pivot) {
            i++;
            temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }
    temp = arr[i+1];
    arr[i+1] = arr[high];
    arr[high] = temp;

    return (i + 1);
}

static void quick_sort(int arr[], int low, int high) {
	int pi;
    if (low < high) {
        pi = partition(arr, low, high);

        quick_sort(arr, low, pi - 1);
        quick_sort(arr, pi + 1, high);
    }
}

static int __init quick_sort_init(void) {
    struct file *file;
    char *buf;
    loff_t pos = 0;
    ssize_t read_bytes;
    int *numbers = NULL;
    int capacity = 128, num_count = 0;
    char *ptr, *end_ptr;
    long num;
	int i;
	struct timespec64 start, end;
    s64 time_spent;

    printk(KERN_INFO "Start quick sort module!\n");

    file = filp_open("./file", O_RDONLY, 0);
    if (IS_ERR(file)) {
        printk(KERN_ERR "Failed to open file\n");
        return PTR_ERR(file);
    }

    buf = kmalloc(file_inode(file)->i_size + 1, GFP_KERNEL); // Allocate buffer to hold the entire file
    if (!buf) {
        printk(KERN_ERR "Failed to allocate buffer\n");
        filp_close(file, NULL);
        return -ENOMEM;
    }

    numbers = kmalloc(capacity * sizeof(int), GFP_KERNEL);
    if (!numbers) {
        printk(KERN_ERR "Failed to allocate numbers array\n");
        kfree(buf);
        filp_close(file, NULL);
        return -ENOMEM;
    }

    read_bytes = kernel_read(file, buf, file_inode(file)->i_size, &pos);
    buf[read_bytes] = '\0';

    ptr = buf;
    while (*ptr) {
        num = simple_strtol(ptr, &end_ptr, 10);
        if (ptr == end_ptr) {
            break;
        }
        ptr = end_ptr;
		while (*ptr == ' ') {
			ptr++;
		}
        if (num_count >= capacity) {
            capacity *= 2;
            numbers = krealloc(numbers, capacity * sizeof(int), GFP_KERNEL);
            if (!numbers) {
                printk(KERN_ERR "Failed to reallocate numbers array\n");
                kfree(buf);
                filp_close(file, NULL);
                return -ENOMEM;
            }
        }
        numbers[num_count++] = (int) num;
    }

	ktime_get_real_ts64(&start);
	printk(KERN_INFO "Before quick sort, current time is %lld s with %ld us\n", start.tv_sec, start.tv_nsec / 1000);

	quick_sort(numbers, 0, num_count);

	ktime_get_real_ts64(&end);
	printk(KERN_INFO "After quick sort, current time is %lld s with %ld us\n", end.tv_sec, end.tv_nsec / 1000);

	time_spent = ((end.tv_sec - start.tv_sec) * 1000000000 + (end.tv_nsec - start.tv_nsec)) / 1000;
	printk(KERN_INFO "Quick sort finished and took %lld us\n", time_spent);
	printk(KERN_INFO "The result after quick sort is: \n");

    for (i = 0; i < num_count; i++) {
        printk(KERN_INFO "%d\n", numbers[i]);
    }

    kfree(numbers);
    kfree(buf);
    filp_close(file, NULL);

    return 0;
}

static void __exit quick_sort_exit(void) {
    printk(KERN_INFO "Exit quick_sort module!\n");
}

module_init(quick_sort_init);
module_exit(quick_sort_exit);
```

**运行截图**

![](/images/20240419175531.png)

#### 对比

根据打印的消息，冒泡排序用时44us，而快排用时35us，显然后者更快

## 实验心得体会

>通过这次实验，我对Linux内核的时间管理机制有了更深入的理解，掌握了jiffies、HZ、tick、节拍、时钟中断等关键概念，并理解了它们与系统时钟的联系，学会了如何使用Linux内核时钟接口来计算任务的执行时间。通过比较不同排序算法的执行时间，对常用排序算法的时间性能差异有了更深入的理解。