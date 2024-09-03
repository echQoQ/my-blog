---
# 这是文章的标题
title: 数据库SQL
# 你可以自定义封面图片
cover: /assets/images/cover3.jpg
# 这是页面的图标
icon: paper-plane
# 这是侧边栏的顺序
order: 3
# 设置作者
author: Mr.Liu
# 一个页面可以有多个分类
category:
  - 笔记
# 一个页面可以有多个标签
tag:
  - 数据库
# 此页面会在文章列表置顶
sticky: false
# 此页面会出现在星标文章中
star: false
# 你可以自定义页脚
footer: 箱根山岳险天下
# 你可以自定义版权信息
copyright: 无版权
---

## 定义语句格式

#### 定义基本表

```mysql
CREATE TABLE <表名>
      （<列名> <数据类型>[ <列级完整性约束条件> ]
      [，<列名> <数据类型>[ <列级完整性约束条件>] ] …
      [，<表级完整性约束条件> ] ）；
```

- 常用完整性约束
	- 主码约束：`PRIMARY KEY`
	- 唯一性约束：`UNIQUE`
	- 非空值约束：`NOT NULL`

#### 删除基本表

```
DROP TABLE <表名>;
```

#### 修改基本表

```MySQL
ALTER TABLE <表名>
	[ ADD <新列名> <数据类型> [ 完整性约束 ] ]
	[ DROP <完整性约束名> ]
	[ ALTER COLUMN <列名> <数据类型> ]
	[ DROP COLUMN <列名> <数据类型> ]；
```

- 不论基本表中原来是否已有数据，新增加的列一律为空值

### 建立与删除索引
#### 建立索引

```mysql
CREATE [UNIQUE] [CLUSTERED] INDEX <索引名> ON <表名>(<列名>[<次序>][,<列名>[<次序>] ]…)；
```

- 用<表名>指定要建索引的基本表名字
- 索引可以建立在该表的一列或多列上，各列名之间用逗号分隔
- 用<次序>指定索引值的排列次序，升序：ASC，降序：DESC。缺省值：ASC
- UNIQUE表明此索引的每一个索引值只对应唯一的数据记录
- CLUSTERED表示要建立的索引是聚簇索引
- 唯一值索引
	- 对于已含重复值的属性列不能建UNIQUE索引
	- 对某个列建立UNIQUE索引后，插入新记录时DBMS会自动检查新记录在该列上是否取了重复值。这相当于增加了一个UNIQUE约束
- 聚簇索引
	- 建立聚簇索引后，基表中数据也需要按指定的聚簇属性值的升序或降序存放。也即聚簇索引的索引项顺序与表中记录的物理顺序一致

#### 删除索引

```mysql
DROP INDEX <索引名>；
```

例：
- 删除Student表的Stusname索引。
	- DROP INDEX Student.Stusname；

## 查询

### 1 概述

#### 语句格式

```mysql
SELECT [ALL|DISTINCT] <目标列表达式>  [，<目标列表达式>] …
FROM <表名或视图名>  [，<表名或视图名> ] …
[ WHERE <条件表达式> ]
[ GROUP BY <列名1> [ HAVING <条件表达式> ] ]
[ ORDER BY <列名2> [ ASC|DESC ] ]；
```

- SELECT子句：指定要显示的属性列
- FROM子句：指定查询对象(基本表或视图)
- WHERE子句：指定查询条件
 - GROUP BY子句：对查询结果按指定列的值分组，该属性列值相等的元组为一个组。通常会在每组中作用集函数。
- HAVING短语：筛选出只有满足指定条件的组
- ORDER BY子句：对查询结果表按指定列值的升序或降序排序 

### 单表查询

#### 查询指定列
查询全体学生的学号与姓名

```mysql
SELECT Sno, Sname
FROM Student;
```

#### 查询全部列
查询全体学生的详细记录

```mysql
SELECT  Sno，Sname，Ssex，Sage，Sdept
FROM Student；
   或
SELECT  *
FROM Student；
```

#### 查询经过计算的值

SELECT子句的<目标列表达式>为表达式
- 算术表达式
- 字符串常量
- 函数
- 列别名
- 等

查全体学生的姓名及其出生年份

```mysql
SELECT Sname,2024-Sage
FROM Student;
```

查询全体学生的姓名、出生年份和所有系。在出生年份前面增加一个说明，在系名称后面增加一个“系”作为表示

```mysql
SELECT Sname,  '出生年份: ', 2023-Sage, 
Sdept  +  '系'
FROM Student;
```

#### 选择表中的若干元组

##### 消除取值重复的行

- 在SELECT子句中使用DISTINCT短语
- 注意 DISTINCT短语的作用范围是所有目标列

```mysql
SELECT DISTINCT Cno，Grade           
FROM SC;
```

##### 查询满足条件的元组

WHERE子句常用的查询条件
![](/images/20240408151626.png)

###### 确定集合

```mysql
IN <值表>,  NOT IN <值表>
```

<值表>：用逗号分隔的一组取值

###### 字符串匹配

```
[NOT] LIKE  ‘<匹配串>’  [ESCAPE ‘ <换码字符>’]
```

<匹配串>：指定匹配模板
      匹配模板：固定字符串或含通配符的字符串
      当匹配模板为固定字符串时，
      可以用 = 运算符取代 LIKE 谓词
      用 != 或 < >运算符取代 NOT LIKE 谓词

- 通配符
	- `%`代表任意长度（长度可以为0）的字符串
	- _ (下横线)  代表任意单个字符

使用换码字符将通配符转义为普通字符

```mysql
SELECT Cno，Ccredit
FROM Course
WHERE Cname LIKE '面向对象\ _C++ '
ESCAPE '\'
```

###### 涉及空值的查询

- 使用谓词 IS NULL 或 IS NOT NULL
- “IS NULL” 不能用 “= NULL” 代替

###### 多重条件查询

用逻辑运算符AND和 OR来联结多个查询条件
- AND的优先级高于OR
- 可以用括号改变优先级

#### 对查询结果排序
使用ORDER BY子句
 可以按一个或多个属性列排序
 升序：ASC；降序：DESC；缺省值为升序
当排序列含空值时
NULL 作为最小值

#### 使用集函数

**5类主要集函数**
- 计数
	- `COUNT（[DISTINCT|ALL] *）`
	- `COUNT（[DISTINCT|ALL] <列名>）`
- 计算总和
	- `SUM（[DISTINCT|ALL] <列名>）`
- 计算平均值
	- `AVG（[DISTINCT|ALL] <列名>）`
- 求最大值
	- `MAX（[DISTINCT|ALL] <列名>）`
	- `MIN（[DISTINCT|ALL] <列名>）`
- DISTINCT短语：在计算时要取消指定列中的重复值
- ALL短语：不取消重复值
- ALL为缺省值

#### 对查询结果分组

**使用GROUP BY子句分组**
- 细化集函数的作用对象
	- 未对查询结果分组，集函数将作用于整个查询结果
	- 对查询结果分组后，集函数将分别作用于每个组 
 
- GROUP BY子句的作用对象是查询的中间结果表
- 分组方法：按指定的一列或多列值分组，值相等的为一组
- 使用GROUP BY子句后，SELECT子句的列名列表中只能出现分组属性和集函数

例：求各个课程号及相应的选课人数。

```mysql
SELECT Cno，COUNT(Sno)
     FROM    SC
     GROUP BY Cno;
```

**使用HAVING短语筛选最终输出结果**

例：查询选修了2门及以上课程的学生学号。

```mysql
 SELECT Sno
     FROM  SC
     GROUP BY Sno
     HAVING  COUNT(*) >2； 
```

**HAVING短语与WHERE子句的区别：作用对象不同**
- WHERE子句作用于基表或视图，从中选择满足条件的元组。
- HAVING短语作用于组，从中选择满足条件的组。 

### 连接查询
同时涉及多个表的查询称为连接查询
用来连接两个表的条件称为连接条件或连接谓词

一般格式：

```mysql
[<表名1>.]<列名1>  <比较运算符>  [<表名2>.]<列名2>
   比较运算符：=、>、<、>=、<=、!=
[<表名1>.]<列名1> BETWEEN [<表名2>.]<列名2> AND [<表名2>.]<列名3>
```

**连接操作的执行过程**
- 嵌套循环法(NESTED-LOOP)
	- 首先在表1中找到第一个元组，然后从头开始扫描表2，逐一查找满足连接件的元组，找到后就将表1中的第一个元组与该元组拼接起来，形成结果表中一个元组。
	- 表2全部查找完后，再找表1中第二个元组，然后再从头开始扫描表2，逐一查找满足连接条件的元组，找到后就将表1中的第二个元组与该元组拼接起来，形成结果表中一个元组。
	- 重复上述操作，直到表1中的全部元组都处理完毕 
- 排序合并法(SORT-MERGE)
	- 首先按连接属性对表1和表2排序
	- 对表1的第一个元组，从头开始扫描表2，顺序查找满足连接条件的元组，找到后就将表1中的第一个元组与该元组拼接起来，形成结果表中一个元组。当遇到表2中第一条大于表1连接字段值的元组时，对表2的查询不再继续
	- 找到表1的第二条元组，然后从刚才的中断点处继续顺序扫描表2，查找满足连接条件的元组，找到后就将表1中的第一个元组与该元组拼接起来，形成结果表中一个元组。直接遇到表2中大于表1连接字段值的元组时，对表2的查询不再继续
	- 重复上述操作，直到表1或表2中的全部元组都处理完毕为止 
- 索引连接(INDEX-JOIN)
	- 对表2按连接字段建立索引
	- 对表1中的每个元组，依次根据其连接字段值查询表2的索引，从中找到满足条件的元组，找到后就将表1中的第一个元组与该元组拼接起来，形成结果表中一个元组 

#### 等值与非等值连接查询
#### 等值连接
- 连接运算符为 = 的连接操作
- `[<表名1>.]<列名1>  =  [<表名2>.]<列名2>`
- 任何子句中引用表1和表2中同名属性时，都必须加表名前缀。引用唯一属性名时可以加也可以省略表名前缀。

例：查询每个学生及其选修课程的情况

```mysql
SELECT  Student.*，SC.*
FROM     Student，SC
WHERE  Student.Sno = SC.Sno；
```

##### 自然连接
- 等值连接的一种特殊情况，把目标列中重复的属性列去掉

例：查询每个学生及其选修课程的情况

```mysql
 SELECT  Student.Sno，Sname，Ssex，Sage,Sdept，Cno，Grade
 FROM     Student，SC
 WHERE  Student.Sno = SC.Sno；
```

##### 非等值连接查询
- 连接运算符 不是 = 的连接操作

```
[<表名1>.]<列名1><比较运算符>[<表名2>.]<列名2>
比较运算符：>、<、>=、<=、!=
   [<表名1>.]<列名1> BETWEEN [<表名2>.]<列名2> AND [<表名2>.]<列名3> 
```

#### 自身连接
- 一个表与其自己进行连接，称为表的自身连接
- 需要给表起别名以示区别
- 由于所有属性名都是同名属性，因此必须使用别名前缀

例：查询每一门课的间接先修课（即先修课的先修课）

```mysql
 SELECT  FIRST.Cno，SECOND.Cpno
     FROM  Course  FIRST，Course  SECOND
     WHERE FIRST.Cpno = SECOND.Cno； 
```

#### 外连接（Outer Join）
- 外连接与普通连接的区别
	- 普通连接操作只输出满足连接条件的元组
	- 外连接操作以指定表为连接主体，将主体表中不满足连接条件的元组一并输出

例：查询每个学生及其选修课程的情况，包括没有选修课程的学生----用外连接操作

```mysql
SELECT  Student.Sno，Sname，Ssex，
    Sage，Sdept，Cno，Grade
 FROM    Student，SC
 WHERE  Student left join SC
on  Student.Sno = SC.Sno；
```

#### 复合条件连接

WHERE子句中含多个连接条件时，称为复合条件连接

例：查询每个学生的姓名、选修课程名及成绩。

```mysql
SELECT Sname，Cname，Grade
   FROM    Student，SC，Course
   WHERE Student.Sno = SC.Sno
                  and SC.Cno = Course.Cno；
```

### 嵌套查询
- 嵌套查询概述
	- 一个SELECT-FROM-WHERE语句称为一个查询块
	- 将一个查询块嵌套在另一个查询块的WHERE子句或HAVING短语的条件中的查询称为嵌套查询
- 嵌套查询分类
	- 不相关子查询
		- 子查询的查询条件不依赖于父查询
		
	- 相关子查询
		- 子查询的查询条件依赖于父查询
- 嵌套查询求解方法
	- 相关子查询
		- 是由里向外逐层处理。即每个子查询在上一级查询处理之前求解，子查询的结果用于建立其父查询的查找条件
	- 不相关子查询
		- 首先取外层查询中表的第一个元组，根据它与内层查询相关的属性值处理内层查询，若WHERE子句返回值为真，则取此元组放入结果表；
		- 然后再取外层表的下一个元组；
		- 重复这一过程，直至外层表全部检查完为止。
- 引出子查询的谓词
	- 带In谓词的子查询
	- 带有比较运算符的子查询
	- 带有ANY或ALL谓词的子查询
	- 带有EXISTS谓词的子查询
#### 带In谓词的子查询

- 查询与“刘晨”在同一个系学习的学生

```mysql
SELECT Sno，Sname，Sdept
    FROM Student
    WHERE Sdept  IN
          (SELECT Sdept
           FROM Student
           WHERE Sname= ‘ 刘晨 ’)；
```

或用自身连接完成本查询要求

```mysql
SELECT  S1.Sno，S1.Sname，S1.Sdept
FROM     Student S1，Student S2
WHERE  S1.Sdept = S2.Sdept  AND
			  S2.Sname = '刘晨'；
```

- 查询选修了课程名为“信息系统”的学生学号和姓名

```mysql
SELECT Sno，Sname            ③ 最后在Student关系中
FROM    Student                              取出Sno和Sname
WHERE Sno  IN
  (SELECT Sno                 ② 然后在SC关系中找出选
   FROM    SC                       修了3号课程的学生学号
   WHERE  Cno IN
	   (SELECT Cno        ① 首先在Course关系中找出“信
	   FROM Course          息系统”的课程号，结果为3号
	   WHERE Cname= ‘信息系统’));
```

##### 带有比较运算符的子查询
- 当能确切知道内层查询返回单值时，可用比较运算符（>，<，=，>=，<=，!=或< >）。
- 与ANY或ALL谓词配合使用
- 查询与“刘晨”在同一个系学习的学生

```mysql
SELECT Sno，Sname，Sdept
     FROM    Student
     WHERE Sdept   =
            SELECT Sdept
            FROM    Student
            WHERE Sname= ' 刘晨 '；
```

##### 带有ANY或ALL谓词的子查询
- 谓词语义
	- ANY：任意一个值
	- ALL：所有值

需要配合使用比较运算符

```
 >ANY  大于子查询结果中的某个值      
 > ALL  大于子查询结果中的所有值
< ANY  小于子查询结果中的某个值   
< ALL  小于子查询结果中的所有值
>= ANY  大于等于子查询结果中的某个值   
>= ALL  大于等于子查询结果中的所有值
<= ANY  小于等于子查询结果中的某个值   
<= ALL  小于等于子查询结果中的所有值
= ANY  等于子查询结果中的某个值       
=ALL  等于子查询结果中的所有值（通常没有实际意义）
!=（或<>）ANY  不等于子查询结果中的某个值
!=（或<>）ALL  不等于子查询结果中的任何一个值
```

- 查询其他系中比信息系任一个(其中某一个)学生年龄小的学生姓名和年龄

```mysql
SELECT Sname，Sage    FROM    Student
WHERE Sage < ANY (SELECT  Sage FROM   Student  WHERE Sdept= ' IS ')
				 AND Sdept <> ' IS ' ;
```

![](/images/20240411103812.png)

- 查询其他系中比信息系所有学生年龄都小的学生姓名及年龄。

方法一：用ALL谓词

```MYSQL
SELECT Sname，Sage     FROM Student
WHERE Sage < ALL
			(SELECT Sage
			 FROM Student
			 WHERE Sdept= ' IS ')
	   AND Sdept <> ' IS ’;
```

方法二：用集函数

```mysql
SELECT Sname，Sage
	FROM Student
	WHERE Sage <
			   (SELECT MIN(Sage)
				FROM Student
				WHERE Sdept= ' IS ')
		  AND Sdept <>' IS ’;
```

##### 带有EXISTS谓词的子查询

- 查询所有选修了2号课程的学生姓名。

用嵌套查询

```mysql
SELECT Sname
     FROM Student
     WHERE EXISTS
       (SELECT *
        FROM SC          /*相关子查询*/
        WHERE Sno=Student.Sno AND Cno= ‘2')；
```

用连接运算

```mysql
SELECT Sname
FROM Student, SC
WHERE Student.Sno=SC.Sno AND
  SC.Cno= ‘2';
```

- 用EXISTS/NOT EXISTS实现全称量词
	- SQL语言中没有全称量词$\forall$ （For all）
	- 可以把带有全称量词的谓词转换为等价的带有存在量词的谓词
		- ![](/images/20240411105240.png)
- 查询选修了全部课程的学生姓名

```mysql
SELECT Sname
         FROM Student
         WHERE NOT EXISTS
            （SELECT *  FROM Course
              WHERE NOT EXISTS
                  (SELECT * FROM SC
                   WHERE Sno= Student.Sno
                      AND Cno= Course.Cno）；
```

- 用EXISTS/NOT EXISTS实现逻辑蕴函
	- SQL语言中没有蕴函(Implication)逻辑运算
	- 可以利用谓词演算将逻辑蕴函谓词等价转换为
		- ![](/images/20240411105402.png)
- 查询至少选修了学生95002选修的全部课程的学生号码。
	- 不存在这样的课程y，学生95002选修了y，而学生x没有选
![](/images/20240411105443.png)

```mysql
SELECT * from Student 
where not exists
( select * from SC f
  where f.Sno='95002' and not exists
  (select * from SC s
    where s.Cno=f.Cno and s.Sno=Student.Sno))
```

### 集合查询

- 集合操作种类
	- 并操作(UNION)
	- 交操作(INTERSECT)
	- 差操作(EXCEPT)

#### 并操作

- 形式

```mysql
<查询块>
UNION
<查询块>
```

- 参加UNION操作的各结果表的列数必须相同；对应项的数据类型也必须相同

查询选修了课程1或者选修了课程2的学生号码。

方法一

```mysql
SELECT Sno
	FROM SC
	WHERE Cno=' 1 '
	UNION
	SELECT Sno
	FROM SC
	WHERE Cno= ' 2 '；
```

方法二

```mysql
SELECT  DISTINCT  Sno
	FROM SC
	WHERE Cno=' 1 '  OR  Cno= ' 2 '；
```

##### 对集合操作结果的排序
- ORDER BY子句只能用于对最终查询结果排序，不能对中间结果排序
- 任何情况下，ORDER BY子句只能出现在最后
- 对集合操作结果排序时，ORDER BY子句中用数字指定排序属性

例

```mysql
SELECT *
FROM Student
WHERE Sdept= 'CS'
UNION
SELECT *
FROM Student
WHERE Sage<=19
ORDER BY 1；
```

## 数据更新

### 插入数据

- 两种插入数据方式
	- 插入单个元组
	- 插入子查询结果

#### 插入单个元组

- 语句格式

```mysql
INSERT
INTO <表名> [(<属性列1>[，<属性列2 >…)]
VALUES (<常量1> [，<常量2>]    …           )
```

例

```mysql
INSERT
	 INTO Student
	 VALUES ('95020'，'陈冬'，'男'，'IS'，18)；
```

- INTO子句
	- 指定要插入数据的表名及属性列
	- 属性列的顺序可与表定义中的顺序不一致
	- 没有指定属性列：表示要插入的是一条完整的元组，且属性列属性与表定义中的顺序一致
	- 指定部分属性列：插入的元组在其余属性列上取空值
- VALUES子句
	- 提供的值必须与INTO子句匹配
		- 值的个数
		- 值的类型

#### 插入子查询结果

- 语句格式

```mysql
INSERT
    INTO <表名>  [(<属性列1> [，<属性列2>…  )]
    子查询；
```

例
- 对每一个系，求学生的平均年龄，并把结果存入数据库

```mysql
INSERT
	INTO  Deptage(Sdept，Avgage)
		  SELECT  Sdept，AVG(Sage)
		  FROM  Student
		  GROUP BY Sdept；
```

- 子查询
	- SELECT子句目标列必须与INTO子句匹配
		- 值的个数
		- 值的类型

### 修改数据

- 语句格式

```mysql
UPDATE  <表名>
SET  <列名>=<表达式>[，<列名>=<表达式>]…
[WHERE <条件>]；
```

### 删除数据

- 语句格式

```mysql
DELETE
   FROM     <表名>
   [WHERE <条件>]
```

## 视图

**视图的特点**
- 虚表，是从一个或几个基本表（或视图）导出的表
- 只存放视图的定义，不会出现数据冗余
- 基表中的数据发生变化，从视图中查询出的数据也随之改变

---
### 定义视图

```sql
CREATE  VIEW
      <视图名>  [(<列名>  [，<列名>]…)]
      AS  <子查询>
       [WITH  CHECK  OPTION]；
```

>DBMS执行CREATE VIEW语句时只是把视图的定义存入数据字典，并不执行其中的SELECT语句。在对视图查询时，按视图的定义从基本表中将数据查出。

---

**组成视图的属性列名**
全部省略或全部指定
- 省略
	- 由子查询中SELECT目标列中的诸字段组成
- 明确指定视图的所有列名
	- 某个目标列是集函数或列表达式
	- 目标列为`*`
	- 多表连接时选出了几个同名列作为视图的字段
	- 需要在视图中为某个列启用新的更合适的名字

---

- <font color="#e36c09">WITH CHECK OPTION</font>
	- 透过视图进行增删改操作时，不得破坏视图定义中的谓词条件

例：建立信息系学生的视图，并要求透过该视图进行的更新操作只涉及信息系学生。

```sql
CREATE VIEW IS_Student
	AS
		SELECT Sno，Sname，Sage
			FROM  Student
			WHERE  Sdept= 'IS'
	WITH CHECK OPTION
```

- 对IS_Student视图的更新操作
	- 修改操作：DBMS自动加上Sdept= 'IS'的条件
	- DBMS自动检查Sdept属性值是否为'IS'
		- 如果不是，则拒绝该插入操作
- 删除操作：DBMS自动加上Sdept= 'IS'的条件

---
### 删除视图

```sql
DROP  VIEW  <视图名>；
```

- 该语句从数据字典中删除指定的视图定义
- 由该视图导出的其他视图定义仍在数据字典中，但已不能使用，必须显式删除
- 删除基表时，由该基表导出的所有视图定义都必须显式删除

---
### 查询视图

- 从用户角度：查询视图与查询基本表相同
- DBMS实现视图查询的方法
	- 实体化视图（View Materialization）
		- 有效性检查：检查所查询的视图是否存在
		- 执行视图定义，将视图临时实体化，生成临时表
		- 查询视图转换为查询临时表
		- 查询完毕删除被实体化的视图(临时表)
	- 视图消解法（View Resolution）
		- 进行有效性检查，检查查询的表、视图等是否存在。如果存在，则从数据字典中取出视图的定义
		- 把视图定义中的子查询与用户的查询结合起来，转换成等价的对基本表的查询
		- 执行修正后的查询

---
### 更新视图
- 用户角度：更新视图与更新基本表相同
- DBMS实现视图更新的方法
	- 视图实体化法（View Materialization）
	- 视图消解法（View Resolution）
- 指定WITH CHECK OPTION子句后
	- DBMS在更新视图时会进行检查，防止用户通过视图对不属于视图范围内的基本表数据进行更新

---

例：向信息系学生视图IS_S中插入一个新的学生记录：95029，赵新，20岁

```sql
INSERT
	INTO IS_Student
	VALUES(‘95029’，‘赵新’，20)；
```

转换为对基本表的更新:

```sql
INSERT
	INTO   Student(Sno，Sname，Sage，Sdept)
	VALUES('95029'，'赵新'，20，'IS' )；
```