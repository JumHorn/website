# C & C++
这里主要讨论的是区别，而不是C++中有的，而C语言中没有的东西。C++比C语言多了很多东西，最重要的当属类(面向对象编程)和模板(泛型编程)，基于泛型编程还引出了元编程(metaprogramming)等等。这里讨论公共部分但是不一样的部分
***
### 函数重载  
函数重载是C++支持的，C不支持  
C++的函数重载在类继承的时候不起作用
```C++
#include<iostream>
using namespace std;

class Base
{
public:
    Base(){}
    virtual void print()
    {
        cout<<"base"<<endl;
    }
};

class Derive : public Base
{
public:
    void print(int m)
    {
        cout<<"derive"<<endl;
    }
};

int main()
{
    Derive *a = new Derive;
    a->print();  //candidate expects 1 argument, 0 provided
    // 但是下面的调用可以正常运行
    // Base *a = new Derive;
    // a->print();  
}

```
而C语言中也可以用宏来改变函数的定义
```C
#include<stdio.h>

double sqr(x){return x*x;}
#define sqr(x) x*x  //这两行不能互换位置，否则expanded from macro 

int main()
{
    printf("%d\n",sqr(3+3)); //这里使用宏，下面的使用函数的定义
    printf("%d\n",(int)(sqr)(3+3));//浮点数当整形打印数据不正确，可以强制类型转化
}
```
### 默认参数
C++支持默认参数，而C不支持默认参数
```C++
#include<stdio.h>
int power(int m,int n=2)
{
    int i,result=1;
    for(i=0;i<n;i++)
    {
        result*=m;
    }
    return result;
}
```
### void参数
在C语言中不加void则表示参数是任意个数,而C++中void和空是一个意思
```C
#include<stdio.h>
//空表示任意参数
void greet()
{
    printf("%s\n","hello world");
}
//表示不可以传参数
void test(void)
{
    printf("hello");
}

int main()
{
    greet("world");
}
```
### struct结构体
- C语言的struct只能声明变量(包含指针变量)。C++可以声明变量和函数
- C++ struct定义变量可以省略struct关键字，C语言不可以
- C++的结构体和类的区别只是默认成员的访问属性不同，struct是public访问属性，而class是private访问属性  

C++结构体赋值和C语言的区别
```C++
#include<iostream>
using namespace std;

struct Animal
{
    int weight;
    char code;
    virtual void bark()
    {
        cout<<"wa"<<endl;
    }
};

//正常情况情况下可以这样赋值，但是当函数是virtual的时候会失败
//少了虚函数地址
int main()
{
    //could not convert '{1023, 'f'}' from '<brace-enclosed initializer list>' to 'Animal'
    Animal a = {1023,'f'};
    cout<<a.code<<endl;
}
```
C++结构体的成员默认访问属性
```C++
#include<iostream>
using namespace std;

struct Animal
{
    //这里所有默认public
    int weight;
    void bark()
    {
        cout<<"wa"<<endl;
    }
};

//这里默认public，所以可以省略
struct Dog : Animal
{
};

int main()
{
    Dog d;
    d.bark();
}
```

### 变量定义  
- for循环中定义变量  
C++可以在for循环中定义变量，而C语言标准不行
```C++
#include<stdio.h>
int main()
{
    for(int i=0;i<10;i++)
    {
        printf("hello world\n");
    }
}
```
然而实际上不论是gcc还是vc都支持C在for循环中定义变量，未来标准可能会改变

- 变量定义位置  
C要求变量定义在前面，不要在中间定义变量  
C++变量可以定义位置任意
### 内存操作
- C语言用的是malloc和free  
- C++用的是new和delete
其实C++底层的operator new和C语言的malloc作用是一样的
```C++
//operator new有三种形式：
//throwing
void* operator new (std::size_t size) throw (std::bad_alloc);
//nothrow
void* operator new (std::size_t size, const std::nothrow_t& nothrow_value) throw();
//placement
void* operator new (std::size_t size, void* ptr) throw();
```