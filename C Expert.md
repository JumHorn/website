# 第一章 C:穿越时空的迷雾

* * *

*   原型决定C语言不支持函数重载

<pre><code class="C++">//previous definition is here
void overload(int a)
{
    printf("%d\n",a);
}

void overload(double a)
{
    printf("%lf\n",a);
}
</code></pre>

*   参数传递类似于赋值

<pre><code class="C++">void assign(char a)
{
    printf("%d\n",a);
}
//指针类型才会出现这种错误
void assignpoint(char *p)
{
    printf("%s\n",p);
}
//gcc C++ error C warning
int main()
{
    const char a = 5;
    assign(a);
    const char *p = "helloworld";
    //argument is incompatible with prototype
    assignpoint(p);
}  
</code></pre>

*   尽量不要使用无符号类型

<pre><code class="C++">int array[5] = {1,2,3,4,5};
//当数组类型发生变化时，这种方式比下面的方法更通用
#define TOTAL_ELEMENTS sizeof(array)/sizeof(array[0])
// #define TOTAL_ELEMENTS sizeof(array)/sizeof(int)

int main()
{
    int d = -1;
    // TOTAL_ELEMENTS类型是无符号整数，d被转化为无符号数
    // 需要强制类型转化
    // if(d&lt;(int)TOTAL_ELEMENTS)
    if(d&lt;TOTAL_ELEMENTS)
    {
        printf("hello");
    }
}  
</code></pre>

# 第二章 这不是Bug,而是语言特性

*   switch

<pre><code class="C++">#include&lt;stdio.h&gt;
int main()  
{
    const int two = 2; //现在编译器不会出现错误
    //case条件不能是变量，只能是整形常量包括char, short, int, long
    int i=2;
    //一条switch语句最多257个case标签
    //8bit的所有情况加上EOF
    switch(i)
    {
        //没有break则顺序执行，不执行default
        case 1:printf("case 1\n");
        //default 打错了也能编译通过
        defult:printf("default"); //default 顺序不影响
        case two:printf("case 2\n");
        case 3:printf("case 3\n");
    }
}
</code></pre>

*   字符串自动连接

<pre><code class="C++">#include&lt;stdio.h&gt;
int main()  
{
    //加斜杠空格，第二行前面的空格也算在内，没有反斜杠会报错
    printf("a favorite children's book\
    is muffy\n");
    //新风格字符串自动连接
    printf("a favorite children's book"
    " is muffy\n");
    //定义数组时要注意
    char *strs[] = {"red""green","yellow"};
    printf("%s\n",strs[0]);
}
</code></pre>

*   符号重载

<pre><code class="C++">#include&lt;stdio.h&gt;
int main()
{
    int *p;
    int i=3,apple;
    p=&i;
    // invalid operands to binary expression ('unsigned long' and 'int *')
    apple = sizeof(int)*p;
}
</code></pre>

*   运算符优先级

| 优先级          |       表达式        |        实际结果        |
| ------------ |:----------------:|:------------------:|
| .的优先级高于*     |       *p.f       |       *(p.f)       |
| []高于*        |    int *ap[]     |    int *(ap[])     |
| 函数()高于*      |    int *fp()     |    int *(fp())     |
| ==和!=高于位操作符  |   val&mask!=0    |   val&(mask!=0)    |
| ==和!=高于赋值符   | c=getchar()!=EOF | c=(getchar()!=EOF) |
| 算数运算符高于移位运算符 |    msb<<4+lsb    |    msb<<(4+lsb)    |
| 逗号运算符最低      |      i=1,2       |      (i=1),2       |

*   最大一口策略

<pre><code class="C++">int main()
{
    int x=2,y=3,temp;
    temp = y+++x;
    printf("%d\n",temp);
    // temp = y+++++x; //缺少空格
    // temp = y++ ++ +x; //不能编译通过
    printf("%d\n",temp);
}
</code></pre>

*   lint程序

# 第三章 分析C语言的声明

*   声明复杂性

1\.函数的返回值不能是一个函数,foo()()是非法的  
2\.函数的返回值不能是一个数组,foo()[]是非法的  
3\.数组里面不能有函数,foo[]()是非法的

下面是合法的 * 函数的返回值允许是一个函数指针,如int(* fun())(); * 函数的返回值允许是一个指向数组的指针,如int(*fun())[]; * 数组里面允许有函数指针,如int(*fun[])() * 数组里面允许有其他数组int foo[][]

*   位段，无名字段和填充字段

<pre><code class="C++">#include&lt;stdio.h&gt;
int main()
{
    struct dog
    {
        char id;
        short height;
        int weight;
    };
    //字节对齐
    printf("%lu\n",sizeof(struct dog));//8
    //位填充不影响字节对齐
    struct pid_tag
    {
        unsigned int inactive : 1;
        unsigned int :1; //1个位填充
        unsigned int refcount : 6;
        unsigned int :0; //填充到下一个字边界
        short pid_id;
        short :0;
        struct pid_tag *link;
    };
    printf("%lu\n",sizeof(struct pid_tag));//16
}
</code></pre>

*   typedef 和 #define

<pre><code class="C++">#include&lt;stdio.h&gt;
int main()
{
    #define peach int  //没有分号
    unsigned peach i;  //incorrect

    typedef int banans;
    // unsigned banans i; //incorrect

    #define int_ptr int *
    int_ptr chalk,cheese;  //chalk是指针，cheese是int

    typedef char * char_ptr;
    char_ptr Bentley,Rolls_Royce; //两个char*
}
</code></pre>

# 第四章 令人震惊的事实：数组和指针并不相同

*   左值和右值

左值是地址，而右值是地址的内容

声明为指针，定义为数组 会出错  
原因如下  
char a[9] = "abcdefgh" c = a[i]  
编译器符号表示具有一个地址9980  
运行时步骤1: 取i的值，将它与9980相加  
运行时步骤2: 取地址(9980+i)的内容

char *p = "abcdefgh" c = p[i]  
编译器符号表示具有一个p地址4624  
运行时步骤1: 取地址4624的内容9980  
运行时步骤2: 取i的值，将它与9980相加  
运行时步骤3: 取地址(9980+i)的内容

通过上述两步，即可理解当声明为指针，定义为数组时会出错  
首先当p声明为指针时，会依照三步来获取内容，错误出现在步骤1  
需要对数组名取内容，实际是数组第一个元素的值，加上偏移量  
得到错误的结果

# 第五章 对链接的思考

*   链接库

**使用vc编译器**  
cl –c cppfile 生成obj文件  
静态链接库  
lib objfile 生成lib文件  
动态连接库  
__declspec(dllexport) //必须添加，导出函数，这样就会有lib文件生成  
link /dll objfile 生成dll文件  
查看动态链接库 dumpbin /exports dllfile

windows下调用动态链接库

<pre><code class="C++">#include&lt;iostream&gt;
#include&lt;windows.h&gt;
using namespace std;

// windows 下的调用方式
int main()
{
    typedef void (*pfunc)(void);
    HINSTANCE hDll=LoadLibrary("E:\\CClearning\\DynamicLinkLibrary\\dll.dll");
    if(!hDll)
    {
        cout&lt;&lt;"LoadLibrary Error: "&lt;&lt;GetLastError()&lt;&lt;endl;
        return 0;
    }
    cout&lt;&lt;"dll.dll的句柄地址："&lt;&lt; hDll &lt;&lt; endl;

    //pfunc本身表示指针，不能再用pfunc*
    //pfunc * pf=(pfunc *)GetProcAddress(hDll,"?greet@@YAXXZ");

    pfunc pf=(pfunc)GetProcAddress(hDll,"?greet@@YAXXZ");
    if(!pf)
    {
        cout&lt;&lt;"GetProcAddress Error: "&lt;&lt;GetLastError()&lt;&lt;endl;
        return 0;
    }
    cout&lt;&lt;"dll.dll内的greet()函数的地址："&lt;&lt; pf &lt;&lt;endl;

    pf();
    //(*pf)();
    //使用完毕后，释放dll文件
    FreeLibrary(hDll);
}
</code></pre>

**使用gcc编译器**  
g++ -c cppfile 生成.o链接文件  
静态连接库 ar rc liblib.a lib.o 生成.a静态文件  
要指定生成文件名liblib.a  
然后链接静态库  
g++ gccstatic.cpp -L . -l lib  
L指定要搜索的库的路径，l指定要搜索的库的名字，可以省略libXXX.a  
当然MinGW可以使用这种方法g++ gccstatic.cpp liblib.a

动态连接库  
g++ dll.cpp -shared -o libdll.so 生成.so动态链接文件  
然后链接动态库  
g++ gccdynamic.cpp libdll.so

# 第六章 运行时数据结构

*   a.out中各个段，数据段，代码段

*   setjmp可以实现异常处理

<pre><code class="C++">#include&lt;stdio.h&gt;
#include&lt;setjmp.h&gt;

jmp_buf buf;

// warning: type specifier missing, defaults to 'int' [-Wimplicit-int]
banana()
{
    printf("in banana() \n");
    longjmp(buf,1);
    //一下代码不会被执行
    printf("you'll never see this,because i longjmp'd");
}

main()
{
    if(setjmp(buf))
    {
        printf("back in main\n");
    }
    else
    {
        printf("first time through\n");
        banana();
    }
}
</code></pre>

# 第七章 对内存的思考

内存中的分段和分页