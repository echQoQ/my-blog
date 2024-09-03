---
# 这是文章的标题
title: 实验一 openEuler 操作系统 编译内核实验
# 你可以自定义封面图片
cover: /assets/images/cover2.jpg
# 这是页面的图标
icon: paper-plane
# 这是侧边栏的顺序
order: 1
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

# 实验一 openEuler 操作系统 编译内核实验

## 0x01 实验目的

- 通过安装openEuler操作系统、编译安装openEuler操作系统新内核以及简单的内核模块编程任务操作来：
	- 学习掌握如何在树莓派上安装操作系统。
	- 学习掌握如何编译操作系统内核。 
	- 了解内核模块编程。

## 0x02 实验过程

### 1 安装openEuler操作系统

#### 1.1 下载openEuler 22.03 LTS SP3树莓派版本

- 登录openEuler Repo网站
	- [repo.openeuler.org](https://repo.openeuler.org/)
- 找到对应版本的镜像，将openEuler-22.03-LTS-SP3-raspi-aarch64.img.xz下载到本地

#### 1.2 烧录系统

1. 将SD卡通过读卡器插入电脑
2. 使用Raspberry Pi Imager将镜像烧录到SD卡中
3. 烧录完毕后，拔下SD卡并插入树莓派

#### 1.3 连接网络

1. 在设置 -->  网络和internet --> 高级网络设置中，在wifi的更多适配器选项中点击编辑，在共享选项卡上选中“允许其他网络用户通过此计算机的Internet连接来连接”选项。
2. 通过网线把树莓派与电脑相连
3. 在电脑命令行窗口输入arp –a查看新增加的动态IP地址即为raspberry pi的ip地址，利用该ip使用Xshell来连接树莓派，默认账密为root/openeuler
4. 打开手机的个人wifi, 并利用命令行`nmcli dev wifi connect 你的WIFI名 password 你的WIFI密码`将树莓派连接上手机热点
5. 将电脑也连接上手机热点，通过手机热点为树莓派分配的ip再次用xshell连接上树莓派，此时网线可以撤去，电脑通过无线连接控制树莓派

#### 1.4 安装所需组件

- 命令如下
```
dnf install yum
yum -y install unzip yum -y install tar yum -y install lrzsz yum -y install gcc yum -y install make yum -y install flex yum -y install bison yum -y install openssl-devel yum -y install perl
```

### 2 openEuler内核编译与安装

#### 2.1 备份boot目录以防后续步骤更新内核失败

```
tar czvf boot_origin.tgz /boot/
sz boot_origin.tgz   # 将备份文件发送到本地
```

#### 2.2 获取内核源码

1. 在树莓派安装git `yum install git`，并完成个人的基本配置，确保能使用gitee仓库克隆
2. 在树莓派中使用git下载内核源码:`git clone git@gitee.com:openeuler/raspberrypi-kernel.git -b OLK-5.10`
3. 下载完毕后将其重命名：`mv raspberrypi-kernel-openEuler-22.03-LTS-SP2 kernel`

#### 2.3 编译内核

1. 首先进入kernel目录：`cd kernel`
2. 加载默认配置：`make bcm2711_defconfig`
3. 编译内核：`make ARCH=arm64 -j4`
4. 创建编译内核模块目录：`mkdir ../output`
5. 编译内核模块：`make INSTALL_MOD_PATH=../output/ modules_install`

#### 2.4 切换内核

1. 查看当前内核版本：`uname -a`![](/images/20240311105946.png)
2. 将内核放进引导
```
cd /root/output/lib/modules/5.10.0-v8/kernel 
cp arch/arm64/boot/Image /boot/kernel8.img
```
3. 将设备树文件放进引导
```
cp arch/arm64/boot/dts/broadcom/*.dtb /boot/           
cp arch/arm64/boot/dts/overlays/*.dtb* /boot/overlays/ 
cp arch/arm64/boot/dts/overlays/README /boot/overlays/
```
4. 重启系统
5. 再次通过网线将电脑与树莓派相连，然后用xshell实现对树莓派的控制
6. 查看新的内核版本：`uname -a`![](/images/20240311110350.png)
7. 可见内核切换成功

#### 2.5 再次配置WIFI

1. 切换内核后，树莓派会找不到热点，无法进行无线连接，此时需要先在终端输入下列命令：
```
insmod ~/output/lib/modules/5.10.0-v8/kernel/net/rfkill/rfkill.ko
insmod ~/output/lib/modules/5.10.0-v8/kernel/drivers/net/wireless/broadcom/brcm80211/brcmutil/brcmutil.ko
insmod ~/output/lib/modules/5.10.0-v8/kernel/net/wireless/cfg80211.ko
insmod ~/output/lib/modules/5.10.0-v8/kernel/drivers/net/wireless/broadcom/brcm80211/brcmfmac/brcmfmac.ko
```
2. 接着便可通过命令行使树莓派连接WIFI：`nmcli dev wifi connect 你的WIFI名 password 你的WIFI密码`
3. 为了使树莓派重启后可以自动连接WIFI，需要将上面一系列insmod命令写入/etc/rc.local里，这样树莓派开机后自动加载这些驱动，从而能够搜索到附近WIFI，并自动连接

## 0x03 任务一

### 1 任务要求

- 查找相关资料，解释hello_world.c文件中以下代码的含义和作用
	- [1]MODULE_LICENSE 
	- [2]module_param [3]MODULE_PARM_DESC 
	- [4]module_init 
	- [5]module_exit 
	- [6]__init 
	- [7]__exit

### 2 代码解释

- [1]MODULE_LICENSE 
	- 含义
		- 模块的许可证声明
	- 作用
		- 从2.4.10版本内核开始，模块必须通过MODULE_LICENSE宏声明此模块的许可证，否则在加载此模块时，会收到内核被污染 “kernel tainted” 的警告。从linux/module.h文件中可以看到，被内核接受的有意义的许可证有 “GPL”，“GPL v2”，“GPL and additional rights”，“Dual BSD/GPL”，“Dual MPL/GPL”，“Proprietary”。
	- 来源
		- [模块的许可证声明 - MODULE_LICENSE(“GPL”)-CSDN博客](https://blog.csdn.net/kwame211/article/details/77531748)
- [2]module_parameter
	- 含义
		- 定义模块参数的方法:module_param(name, type, perm);其中,
			- name:表示参数的名字;
			- type:表示参数的类型;  
			- perm:表示参数的访问权限;
	- 作用
		- 使用户可在系统启动或模块装载时为参数指定相应值
	- 来源
		- [Linux内核之module_param()函数使用说明-CSDN博客](https://blog.csdn.net/sinat_29891353/article/details/106355202)
- [3]MODULE_PARM_DESC 
	- 含义
		- MODULE_PARM_DESC(para, mesg),其中
			- para:表示参数名字
			- mesg:参数描述
	- 作用
		- 对模块的参数进行描述
	- 来源
		- [MODULE_PARM_DESC(para, mesg)-CSDN博客](https://blog.csdn.net/MACMACip/article/details/105554505)
- [4]module_init 
	- 含义
		- 是 Linux 内核中的一个宏，用于标记驱动模块的起始函数。
	- 作用
		- 用于定义在加载驱动模块时执行的函数
		- 当内核初始化阶段或者动态加载模块时，被 `module_init()` 标记的函数会自动运行
		- 无论模块是编译进内核镜像还是以 `.ko` 文件形式加载，都从这里开始运行
	- 来源
		- copilot + [module_init（linux kernel 宏函数之“模块的起点”） - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/615272622)
- [5]module_exit
	- 含义
	- 
		- 是 Linux 内核中的一个宏，用于标记驱动模块的退出函数
	- 作用
		- 用于定义在卸载驱动模块时执行的函数，
		- 当使用 `rmmod` 命令卸载模块时，内核会调用被 `module_exit()` 标记的函数
	- 来源：
		- copilot
- [6]\_\_init 
	- 作用
		- 通常用于标记**内核初始化阶段**使用的函数。这些函数会被放置在 `.init.text` 区域中
		- 在内核初始化完成后，这些函数占用的内存可以被回收利用。
	- 来源
		- copilot
- [7]\_\_exit
	- 作用
		- 用于标记**模块卸载阶段**使用的函数。这些函数会被放置在 `.exit.text`区域中
		- 当模块被编译为内核的一部分时，这些函数将被忽略，因为在静态编译的情况下，卸载函数永远不会被调用
	- 来源
		- copilot

## 0x04 任务二

### 1 任务要求

>请参考hello_world.c 和 Makefile 文件，编写hello_magic_student.c 和 Makefile，完成以下任务： 1.在 hello_magic_student.c 文件中定义函数 hello_student(…)，该函数包含 3 个参数：id, name, age，分别代 表学号、姓名和年龄，并通过printk输出：” My name is ${name}, student id is ${id}. I am ${age} years old.” 2.在 hello_magic_student.c 文件中定义函数 my_magic_number(…)，该函数包含 2 个参数：id 和 age，分别代表学号和年龄。请你在该函数里将学号的每一位数字相加后再与年龄求和，将求和结果的 个位数作为magic_number，并使用printk 输出：”My magic number is ${magic_number}.”。 完成hello_magic_student.c 文件的编写后，参考 hello_world 模块的 Makefile 并适当调整，在加载内 核时提供学号、姓名和年龄，通过dmesg命令查看printk的输出。

### 2 代码展示

#### 2.1 hello_magic_student.c 与关键代码说明

```
#include <linux/module.h> //头文件
MODULE_LICENSE("GPL");  //模块的许可证声明
static int id;
static char* name;
static int age;        //三个自定义静态变量
module_param(id, int, 0644);  //允许用户输入其值
MODULE_PARM_DESC(id, "int param\n");  //为变量添加说明
module_param(name, charp, 0644);
MODULE_PARM_DESC(name, "char* param");
module_param(age, int, 0644);
MODULE_PARM_DESC(age, "int param\n");
void hello_student(int id, char* name, int age) {
	printk("My name is %s, student id is %d. I am %d years old.",name,id,age);   //打印字符串
}
int __init hello_init(void) {
	printk(KERN_ALERT "Init module.\n");
	hello_student(id, name, age);
	return 0;
}
void __exit hello_exit(void) {
	printk(KERN_INFO "Exit module.\n");
}
module_init(hello_init);  //标记模块导入内核时启动的函数
module_exit(hello_exit);  //标记模块从内核卸载时启动的函数
```

#### 2.2 Makefile

```
ifneq ($(KERNELRELEASE),)
	obj-m := hello_magic_student.o
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

### 3 运行结果

- `make`
	- 编译
- `insmod hello_magic_student.ko id=4174 name="FUNXXX" age=22`
	- 将模块导入内核并输入变量
- `lsmod | grep hello_magic_student`
	- 查看是否导入成功
- `rmmod hello_magic_student`
	- 从内核卸载模块
- `dmesg`
	- 显示内核的消息缓冲区内容

![](/images/20240311212751.png)


## 0x05 实验心得体会

>本次实验完成了在树莓派上安装操作系统以及手动编译内核，并模仿着编写了C文件和Makefile，并在树莓派上编译、导入内核等。通过这些让我切实体会到了与内核的交互，也加深了我对操作系统的初步认识。