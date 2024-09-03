---
# 这是文章的标题
title: 实验六 openEuler 操作系统 文件系统
# 你可以自定义封面图片
cover: /assets/images/cover2.jpg
# 这是页面的图标
icon: paper-plane
# 这是侧边栏的顺序
order: 6
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

本次实验主要学习Linux文件系统的底层实现，加深学生对文件系统底层存储数据结构的理解。为便于 学生实现，本次实验只要求实现一个与ramfs类似的内存文件系统，无需关注与硬盘等设备的交互。 
在实验开始之前，需要注意以下两点： 
① 本次实验已完成内核编译（openEuler 4.19.08），可直接开始实验； 
② 本次实验可能用到的内核函数和系统调用已在正文给出，详细信息可在https://manpages.org/查询

## 0x02 实验目的

⚫ 学习掌握Linux系统中普通文件和目录文件的区别与联系 

⚫ 学习掌握Linux管理文件的底层数据结构 

⚫ 学习掌握Linux文件存储的常见形式

⚫ 加深学生对读写者问题的理解和信号量的使用


## 0x03 实验任务

### 3.1 任务概述

1. 内存文件系统myRAMFS的功能要求 

本次实验要求学生在Linux下实现一个类似于ramfs的内存文件系统myRAMFS，该文件系统至少支持下表中 描述的10条命令，其中实验手册已提供了部分命令的实现，其他命令需要大家自行实现。

![](/images/20240621144735.png)

2. 文件系统功能完善与可用性测试

内存文件系统由Disk模块和File模块组成，其中Disk模块用于与内存交互，提供存储接口，完成内存的分配与回收操作；File模块负责实现基于内存的虚拟文件系统。请你根据任务引导完成myRAMFS文件系统中 File功能模块的编写。 
实验手册已给出Makefile、myRAMFS.cpp、Disk.h、Disk.cpp和File.h的完整代码以及待填充的File.cpp，请你 根据任务引导完善File.cpp，要求编译并运行myRAMFS.cpp后能够类似于shell命令窗口，实时从命令行中读取命令，解析并执行。
### 3.2 任务引导
1. 内存文件系统——Linux文件读取和写入的本质 
用户和操作系统对文件的读写操作是有差异的，用户进程习惯以字节的方式读写文件；而操作系统内核则是以数据块的形式读写。文件系统的作用就是屏蔽掉这种差异。本次实验要求学生设计一个基于内存的文件系统，即文件存储在内存而非硬盘上，相对于硬盘文件系统，内存文件系统的实现更为简单，也能让学生专注于文件系统本身。 
2. 内存文件系统——文件的存储 
内存文件系统的文件数据需要存储在内存上，与程序在内存中的存放类似，文件在内存中的存放方式主要有连续空间存放和非连续空间存放两种，其中非连续空间存放又可分为链表方式和索引方式。为了降低实验难度，本次实验设计的内存文件系统myRAMFS要求学生使用连续空间存放的存储方式。 
连续空间存放 连续空间存放方式顾名思义，文件存放在内存连续的物理空间中（注意，本次设计的myRAMFS是虚拟内存文件系统，虚拟内存连续，物理内存不一定连续），在这种存储形式下，文件数据紧密相连，读写效率较高。
另外，使用连续的存储方式需要在文件头中指定起始块的位置和文件占用的块大小。 
![](/images/20240621151910.png)
连续存储的方式虽然读写效率较高，但同时也会带来内存空间碎片和文件长度不易于扩展等缺陷。
3. 内存文件系统——空闲空间管理 
myRAMFS 虚拟内存文件系统使用位示图法管理空闲空间。 

### 3.3 具体任务

请你完成File.cpp中未完成的函数的编写，实现完整的myRAMFS虚拟内存文件系统的功能。 具体需要完成的函数如下：


| 编号  | 函数声明                                                                         | 功能         | 备注         |
| --- | ---------------------------------------------------------------------------- | ---------- | ---------- |
| 1   | addDirUnit(dirTable* myDirTable, char fileName[], int type, int FCBBlockNum) | 添加目录项      | 辅助函数       |
| 2   | int changeDir(char dirName[])                                                | 切换目录       | 命令 [cd]    |
| 3   | int changeName(char oldName[], char newName[])                               | 修改文件名或者目录名 | 命令 [rn]    |
| 4   | int creatDir(char dirName[])                                                 | 创建目录       | 命令 [mkdir] |
| 5   | deleteFile(char fileName[])                                                  | 删除文件       | 命令 [rm]    |
| 6   | write_file(char fileName[], char content[])                                  | 从末尾写入文件    | 命令 [write] |


## 0x04 实验内容

### 4.1 <font color="#f79646">addDirUnit()</font>

```C++
/*
首先检查目录表是否已满，如果已满则返回错误。
然后检查是否已存在同名文件或目录，避免重复添加。
如果通过检查，创建一个新的目录项，填入文件名、类型（目录或文件）、以及关联的FCB块号。
最后更新目录表中的目录项数量。
 */
int addDirUnit(dirTable *myDirTable, char fileName[], int type, int FCBdataStartBlock) { 
    //获得目录表 
    int dirUnitAmount = myDirTable->dirUnitAmount; 
    //检测目录表是否已满 
    if (dirUnitAmount == DIR_TABLE_MAX_SIZE) { 
        printf("dirTables is full, try to delete some file\n"); 
        return -1; 
    } 
 
    //是否存在同名文件 
    if (findUnitInTable(myDirTable, fileName) != -1) { 
        printf("file already exist\n"); 
        return -1; 
    } 
    //构建新目录项 
    dirUnit *newDirUnit = &myDirTable->dirs[dirUnitAmount]; 
    myDirTable->dirUnitAmount++;//当前目录表的目录项数量+1 
    //设置新目录项内容 
    strcpy(newDirUnit->fileName, fileName); 
    newDirUnit->type = type; 
    newDirUnit->startBlock = FCBdataStartBlock; 
 
    return 0; 
} 
```

### 4.2 <font color="#f79646">int changeDir()</font>

```C++
/**
根据给定的目录名查找目录项在当前目录中的索引。
如果未找到目录项，输出错误信息并返回失败。
如果找到了目录项，再检查该项是否为目录，如果不是目录则输出错误信息并返回失败。
若为目录，则更新当前目录为该目录项所表示的目录。
对于特殊情况，如果切换到上级目录（名称为".."），则更新全局绝对路径。
 */
int changeDir(char dirName[]) { 
    //目录项在目录位置 
    int unitIndex = findUnitInTable(currentDirTable, dirName); 
    //不存在 
    if (unitIndex == -1) { 
        printf("file not found\n"); 
        return -1; 
    } 
    //判断目标文件是否为目录 
    if (currentDirTable->dirs[unitIndex].type == 1) { 
        printf("not a dir\n"); 
        return -1; 
    } 
    //修改当前目录 
    int dirBlock = currentDirTable->dirs[unitIndex].startBlock; 
    currentDirTable = (dirTable *) getBlockAddr(dirBlock); 
    //修改全局绝对路径 
    //返回到上一层的情况 
    if (strcmp(dirName, "..") == 0) {
        //回退绝对路径 
        int len = strlen(path); 
        for (int i = len - 2; i >= 0; i--) 
            if (path[i] == '/') { 
                path[i + 1] = '\0'; 
                break; 
            } 
    } else { 
        //进入下一级目录的情况 
        strcat(path, dirName); 
        strcat(path, "/"); 
    } 
    return 0; 
} 
 
```

### 4.3 <font color="#f79646">int changeName()</font>

```C++
/*
首先查找当前目录中是否存在给定的旧名称的目录项。
如果未找到目录项，输出错误信息并返回失败。
如果找到了目录项，则将其文件名修改为新的名称
*/
int changeName(char oldName[], char newName[]) { 
    int unitIndex = findUnitInTable(currentDirTable, oldName); 
    if (unitIndex == -1) { 
        printf("file not found\n"); 
        return -1; 
    } 
    strcpy(currentDirTable->dirs[unitIndex].fileName, newName); 
    return 0; 
} 
```

### 4.4 <font color="#f79646">int creatDir()</font>

```C++
/**
首先检查目录名长度是否合法。
然后分配一个新的盘块作为该目录的存储空间。
将新创建的目录作为一个目录项添加到当前目录。
同时为新建的目录添加一个指向父目录的特殊目录项（".."）。
 */
int creatDir(char dirName[]) { 
    if (strlen(dirName) >= FILENAME_MAX_LENGTH) { 
        printf("file name too long\n"); 
        return -1; 
    } 
    //为目录表分配空间 
    int dirBlock = getBlock(1); 
    if (dirBlock == -1) 
        return -1; 
    //将目录作为目录项添加到当前目录 
    if (addDirUnit(currentDirTable, dirName, 0, dirBlock) == -1) 
        return -1; 
    //为新建的目录添加一个到父目录的目录项 
    dirTable *newTable = (dirTable *) getBlockAddr(dirBlock); 
    newTable->dirUnitAmount = 0; 
    char parent[] = ".."; 
    if (addDirUnit(newTable, parent, 0, getAddrBlock((char *) currentDirTable)) == -1) 
        return -1; 
    return 0; 
} 
```

### 4.5 <font color="#f79646">int deleteFile()</font>

```C++
/**
首先检查是否试图删除系统自动生成的父目录项（".."），如果是则输出错误信息并返回失败。
查找当前目录中是否存在给定文件名的目录项。
如果未找到目录项，输出错误信息并返回失败。
如果找到了目录项，则判断其类型是否为文件。
如果是文件，则释放该文件占用的内存空间（包括FCB和数据块），然后从当前目录的目录表中删除该文件的目录项。
 */
int deleteFile(char fileName[]) { 
    //忽略系统的自动创建的父目录 
    if (strcmp(fileName, "..") == 0) { 
        printf("can't delete ..\n"); 
        return -1; 
    } 
    //查找文件的目录项位置 
    int unitIndex = findUnitInTable(currentDirTable, fileName); 
    if (unitIndex == -1) { 
        printf("file not found\n"); 
        return -1; 
    } 
    dirUnit myUnit = currentDirTable->dirs[unitIndex]; 
    //判断类型
    if (myUnit.type == 0)//目录 
    { 
        printf("not a file\n"); 
        return -1; 
    } 
    int FCBBlock = myUnit.startBlock; 
    //释放内存 
    releaseFile(FCBBlock); 
    //从目录表中剔除 
    deleteDirUnit(currentDirTable, unitIndex); 
    return 0; 
} 
```

### 4.6 <font color="#f79646">int write_file()</font>

```C++
/**
首先通过 open 函数获取文件的FCB。
获取文件的数据块地址和大小，以及文件的当前数据长度。
使用信号量保证写操作的原子性和并发性。
将指定内容逐字符写入文件数据区域。
如果写入后文件达到了最大尺寸，则输出相应提示信息
 */
int write_file(char fileName[], char content[]) { 
    FCB *myFCB = open(fileName); 
    int contentLen = strlen(content); 
    int fileSize = myFCB->fileSize * block_size; 
    char *data = (char *) getBlockAddr(myFCB->dataStartBlock); 
    myFCB->write_sem = sem_open("write_sem", 0); 
    if (sem_wait(myFCB->write_sem) == -1) 
        perror("sem_wait error"); 
    for (int i = 0; i < contentLen && myFCB->dataSize < fileSize; i++, myFCB->dataSize++) { 
        *(data + myFCB->dataSize) = content[i]; 
    } 
    printf("> Write finished, press any key to continue...."); 
    getchar(); 
    sem_post(myFCB->write_sem); 
    if (myFCB->dataSize == fileSize) 
        printf("file is full, can't write in\n"); 
    return 0; 
} 
```

## 0x05 实验心得体会

本次实验让我从理论到实践深入了解了文件系统的内部工作原理。通过手动实现一个内存文件系统，我对文件和目录的管理有了更清晰的认识，特别是在文件系统结构设计和数据管理方面。通过实现各种文件系统命令，我巩固了课堂学习中的理论知识，例如如何设计有效的目录结构以及如何处理文件的创建和删除等操作。在实现过程中，我也深入思考了如何通过高效的数据结构和算法管理文件和目录，以尽可能减少内存占用并提高系统的响应速度。
总的来说，这次实验不仅帮助我更好地理解了操作系统中文件系统的实现机制，还显著提升了我在Linux环境下编程和调试的能力，是一次极具价值的学习经历。
