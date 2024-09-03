---
# 这是文章的标题
title: 实验五 openEuler 操作系统 内存管理实验
# 你可以自定义封面图片
cover: /assets/images/cover2.jpg
# 这是页面的图标
icon: paper-plane
# 这是侧边栏的顺序
order: 5
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

## 0x01 实验介绍

本实验利用内核函数 `kmalloc()`, `vmalloc()` 实现内存的分配，并要求学生根据提示实现基于最佳适应算 法的`bf_malloc` 内存分配器，加深初学者对<font color="#4f81bd">Linux</font>内存分配的理解。 
在实验开始之前，需要注意以下两点： 
① 本次实验已完成内核编译（<font color="#4f81bd">openEuler 4.19.08</font>），可直接开始实验；
② 本次实验可能用到的内核函数有：`kmalloc()`, `vmalloc()`, `kfree()`, `sbrk()`, `memset()`，参数和返回类型请 在<font color="#9bbb59">https://manpages.org/</font>查询。

## 0x02 实验目的

⚫ 学习掌握`kmalloc()`和`vmalloc()`分配内存的差异； 

⚫ 加深学生对首次适应算法和最佳适应算法的理解； 

⚫ 锻炼学生编写内核模块的能力。

## 0x03 实验任务

### 任务一：使用kmalloc分配内存

> [!note] ### 任务内容
> 请你按照以下提示完成如下任务： 
> 1. 编写 `kmalloc.c` 内核模块，调用`kmalloc()` 函数分别为<font color="#c0504d">kmallocmem1</font>和<font color="#c0504d">kmallocmem2</font>分配 1KB和8KB大小的内存空间并使用`printk() `打印指针地址； 
> 2. 测试 `kmalloc()`可分配的内存大小是否有上限，若有，则寻找`kmalloc()`申请内存的上限，为<font color="#c0504d">kmallocmem3</font>申请最大可分配上限的内存空间，在实验报告中描述你是如何确定该上限的，并使用`printk()` 打印指针地址；同时为<font color="#c0504d">kmallocmem4</font>申请比最大可分配上限稍大的内存空间； 
> 3. 处理分配失败时的逻辑，在分配失败时打印“<font color="#244061">Failed to allocate kmallocmem1/ kmallocmem2/ kmallocmem3 / kmallocmem4!\n</font>” 
> 4. 编写 Makefile 文件，执行make (注意修改：<font color="#f79646">KERNELDIR ?= /usr/lib/modules/$(shell uname -r)/build</font>，使用本地内核)； 
> 5. 加载模块，查看加载的模块内容，查看打印出的指针地址； 
> 6. 根据机器是32位或者是64位的情况，分析分配结果是否成功以及地址落在的区域，并给出相应的解释


**给kmallocmem1和kmallocmem2分配内存空间**

```C
	kmallocmem1 = kmalloc(1024, GFP_KERNEL);
	if (kmallocmem1) {
		printk(KERN_INFO "kmallocmem1 addr = %p\n", kmallocmem1);
	} else {
		printk(KERN_ERR "Failed to allocate kmallocmem1!\n");
	}
	kmallocmem2 = kmalloc(1024*8, GFP_KERNEL);
	if (kmallocmem2) {
		printk(KERN_INFO "kmallocmem2 addr = %p\n", kmallocmem2);
	} else {
		printk(KERN_ERR "Failed to allocate kmallocmem2!\n");
	}
```

**寻找`kmalloc()`申请内存的上限**

定义一个整形变量mm

```C
int mm=1;
```

为kmallocmem3分配`mm*1024*1024`比特的内存大小

```C
	kmallocmem3 = kmalloc(1024*1024*mm, GFP_KERNEL);
	if (kmallocmem3) {
		printk(KERN_INFO "kmallocmem3 addr = %p\n", kmallocmem3);
	} else {
		printk(KERN_ERR "Failed to allocate kmallocmem3!\n");
	}
```

采用二分法策略将mm设置不同大小，结果分别如下

mm=1:<font color="#00b0f0">成功</font>
![](/images/20240517160814.png)
mm=256:<font color="#c00000">失败</font>![](/images/20240517160747.png)
mm=128:<font color="#c00000">失败</font>![](/images/20240517160856.png)
mm=64:<font color="#c00000">失败</font>![](/images/20240517160952.png)
mm=32:<font color="#c00000">失败</font>![](/images/20240517161027.png)
mm=16:<font color="#c00000">失败</font>![](/images/20240517161108.png)
mm=8:<font color="#c00000">失败</font>![](/images/20240517161218.png)
mm=4:<font color="#00b0f0">成功</font>![](/images/20240517161237.png)

可以推断`kmalloc()`申请内存的上限为4MB

为了进一步确认，接下来给kmallocmem3分配`1024*1024*4 Bytes`，而给kmallocmem4分配`1024*1024*4+1 Bytes`，观察实验结果如下![](/images/20240517161840.png)
由此确认了`kmalloc()`申请内存的上限为4MB

**结果分析**

1. **kmallocmem1、kmallocmem2 和 kmallocmem3** 分配成功，地址均落在低地址区域，这符合内核堆内存的分配特性。
2. **kmallocmem4** 分配失败，因为请求的大小超过了 kmalloc 的最大可分配限制。

在 64 位系统中，这些地址通常表示为 64 位长整数。尽管这些地址显示为 8 位十六进制数，但在实际使用中，可能只用到低位部分。内核地址空间管理确保这些地址有效且可用。


### 任务二：使用vmalloc分配内存

> [!note] ### 任务内容
> 请你参考上述kmalloc模块的编写提示完成如下任务： 
> 1. 编写vmalloc.c内核模块，调用vmalloc() 函数分别为vmallocmem1、vmallocmem2、vmallocmem3分配8KB、1MB和64MB大小的内存空间并使用printk() 打印指针地址； 
> 2. 根据你在任务一中找到的kmalloc内存分配上限，请你为vmallocmem4分配比该上限稍大的内存； 
> 3. 处理分配失败时的逻辑，在分配失败时打印“Failed to allocate vmallocmem1/ vmallocmem2/ vmallocmem3!\n” 
> 4. 编写Makefile文件，执行make；
> 5. 加载模块，查看加载的模块内容，查看打印出的指针地址； 
> 6. 根据机器是32位或者是64位的情况，分析分配结果是否成功以及地址落在的区域，并给出相应的解释

**部分核心代码如下**

```C
static int __init mem_module_init(void)
{
	printk(KERN_INFO "Start vmalloc!\n");
	vmallocmem1 = vmalloc(1024*8);
	if (vmallocmem1) {
		printk(KERN_INFO "vmallocmem1 addr = %p\n", vmallocmem1);
	} else {
		printk(KERN_ERR "Failed to allocate vmallocmem1!\n");
	}
	vmallocmem2 = vmalloc(1024*1024);
	if (vmallocmem2) {
		printk(KERN_INFO "vmallocmem2 addr = %p\n", vmallocmem2);
	} else {
		printk(KERN_ERR "Failed to allocate vmallocmem2!\n");
	}
	vmallocmem3 = vmalloc(1024*1024*64);
	if (vmallocmem3) {
		printk(KERN_INFO "vmallocmem3 addr = %p\n", vmallocmem3);
	} else {
		printk(KERN_ERR "Failed to allocate vmallocmem3!\n");
	}
	vmallocmem4 = vmalloc(1024*1024*4+1);
	if (vmallocmem4) {
		printk(KERN_INFO "vmallocmem4 addr = %p\n", vmallocmem4);
	} else {
		printk(KERN_ERR "Failed to allocate vmallocmem4!\n");
	}
	return 0;
}
```

**编写`Makefile`如下**

```Makefile
ifneq ($(KERNELRELEASE),)
	obj-m := vmalloc.o
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

**编写`a.sh`如下**

```shell
make
insmod vmalloc.ko
sleep 0.5
rmmod vmalloc.ko
dmesg | tail -n 6
make clean
```

命令行执行`bash a.sh`，结果如下

![](/images/20240517165126.png)

**结果分析**：

<font color="#00b050">vmallocmem1、vmallocmem2、vmallocmem3、vmallocmem4</font>均成功分配到了所需的内存地址

在 64 位系统中，这些地址通常表示为 64 位长整数。尽管这些地址显示为 8 位十六进制数，但在实际使用中，可能只用到低位部分。内核地址空间管理确保这些地址有效且可用。

### 任务三：阅读并理解首次适应算法的实现


> [!note] ### 任务内容
> 请你阅读并理解`ff_malloc.c`源文件，该文件基于链表实现了首次适应算法。其中`ff_malloc(size_t size)`用于分 配指定大小的内存空间，`free(void *prt)`用于释放内存空间，`calloc(size_t num, size_t len)`用于动态地分配 num 个长度为 size 的连续空间，并将每一个字节都初始化为 0。

**test.c编译运行结果如下**

![](/images/20240517171558.png)

**ff_malloc.c算法流程的理解**

1. `void free(void* ptr)`
	1. 如果指针为空，直接返回
	2. 将指针 `ptr` 转换为指向 `header` 的指针 `block`，并指向其前一个位置。
	3. 寻找插入点
		1. 遍历链表，找到合适的位置以保证链表按内存地址排序
		2. 通过检查 `block` 的地址和当前 `iter` 块及其下一个块的地址，找到插入位置。
	4. 块合并
		1. 如果新释放的块与链表中相邻的块相连，则将它们合并成一个更大的块
	5. 更新链表
		1. 插入新块或合并后的块到链表中
2. `void *ff_malloc(size_t size)`
	1. 计算实际需要的块大小
	2. 如果链表为空，初始化链表，使其自循环
	3. 遍历链表，找到第一个大小足够的块
		1. 如果找到的块大小正好匹配，则直接返回该块
		2. 如果块大小超过需求，则拆分块并返回前半部分
	4. 如果遍历链表后没有找到合适的块，则使用 `sbrk` 请求一块新的内存
	5. 将新请求的内存块加入到链表中，并再次进行分配
3. `void* calloc(size_t num, size_t len)`
	1. 调用 `ff_malloc`分配大小为 `num * len` 的内存块
	2. 使用 `memset` 将分配的内存块初始化为 0
	3. 返回指向分配和初始化好的内存块的指针
### 任务四：实现最佳适应算法

> [!note] 任务内容
> 请你阅读任务三中 `ff_malloc.c` 对首次适应算法的实现，基于最佳适应算法设计实现一个简单的内存管理程序，实现内存管理的频繁分配和回收，并通过日志打印等手段比较首次适应算法和最佳适应算法在内存分配上的区别。 
> **子任务1：** 
> 编写 bf_malloc.c 文件实现首次适应算法，`bf_malloc.c `中需要包含 `bf_malloc(size_t size)`、 `free(void *prt)`、
> `calloc(size_t num, size_t len)`三个函数。 
> **子任务2：** 
> 参考任务三，编写内存分配测试脚本test.c以及用于编译ff_malloc.c和test.c的Makefile 
> **子任务3：** 
> 尝试在`ff_malloc.c` 和 `bf_malloc.c` 中使用` printk` (或` printf`)记录日志，输出能够体现 `ff_malloc` 和 `bf_malloc` 内
> 存分配差异的日志并给出分析。 

**`void *bf_malloc(size_t size)`实现流程**

1. **遍历空闲块链表**：
    - 从链表的第一个节点开始遍历，查找符合条件的空闲块。
    - 使用 `do-while` 循环，确保至少执行一次遍历。
    - 在循环中，根据每个空闲块的大小，选择满足需求且大小最小的块作为最佳适应块。
    - 如果找到符合条件的块，则记录下该块及其前一个节点。
2. **分配内存**：
    - 如果找到了最佳适应块，则进行内存分配。
    - 如果最佳适应块的大小正好等于需求大小，则直接使用该块。
    - 如果最佳适应块的大小大于需求大小，则拆分该块，将前半部分作为分配出去的内存，更新其大小，并将剩余部分保留在链表中。
    - 如果没有找到符合条件的块，则请求新的内存块。
3. **请求新的内存块**：
    - 如果遍历完链表后仍未找到符合条件的块，则使用 `sbrk` 请求新的内存块。
    - 将新分配的内存块加入到链表中，并再次执行分配过程。
4. **返回结果**：
    - 返回分配的内存块的地址。

**日志打印函数**

```C
void log_allocation(void *ptr, size_t size, const char *strategy) {
    printf("[%s] Allocated %zu bytes at %p\n", strategy, size, ptr);
}
```

**日志结果分析**

ff_malloc
1. 内存分配的地址呈递增趋势。
2. 每次分配都选择链表中第一个符合大小要求的空闲块。
3. 分配的内存块地址不断增长，但空闲块的利用率相对较低，可能会产生大量的碎片。
![](/images/20240517182522.png)
bf_malloc
1. 内存分配的地址并非严格递增，而是在整个空闲块中选择最适合需求大小的块。
2. 每次分配都会在整个空闲块中寻找最小的可用块来分配内存。
3. 分配的内存块地址相对分散，但整体空闲块的利用率更高，碎片较少。
![](/images/20240517182538.png)


## 0x04 实验心得体会

这次实验中，通过使用内核函数 kmalloc() 和 vmalloc() 来实现内存的分配，并且根据提示实现了基于最佳适应算法的 bf_malloc 内存分配器。这个实验使我加深了对 Linux 内存分配的理解，同时也提升了我编写内核模块的能力。

首先，在学习和比较 kmalloc() 和 vmalloc() 时，使我深入了解了它们之间的差异。kmalloc() 用于分配小块连续的物理内存，而 vmalloc() 则用于分配大块的虚拟内存。

其次，在实现基于最佳适应算法的 bf_malloc 内存分配器时，我们需要考虑如何在内核中实现一种高效的内存分配策略。通过比较首次适应算法和最佳适应算法，我们更清晰地认识到不同算法的优缺点，以及在不同场景下它们的适用性。这有助于我们更好地理解内存分配算法的原理和实现方式。