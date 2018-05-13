# Layout Cost for adding Encapsulation
### 查看类的内存
本书中提到了对象的很多模型,而我确喜欢实际应用   
自然对msvc和gcc所实现的类的内存模型比较关心。   
那么能够直观的看到类的内存模型,自然是十分令人兴奋的事情了   
查看类的布局能够对C++对象模型和编译器有更好的了解
1. msvc

msvc中就有很直观的方法来实现这一功能   

***
>打印所有类内存结构   
>cl /d1 reportAllCLassLayout    
>打印指定类内存结构,类名前面没有空格   
>cl /d1 reportSingleClassLayout[classname]   
***

下面是一个例子   
文件名:_test.cpp
```C++
class IBaseA
{
public:
    //virtual void fnA() = 0;
    int m_nTestA;
};

class IBaseB
{
public:
    virtual void fnB() = 0;
    int m_nTestB;
};

class CTest : public IBaseA,public IBaseB
{
public:
    //virtual void fnA(){ printf("fnA\n"); }
    virtual void fnB(){ printf("fnB\n"); }
};

int main()
{
    CTest *pTest = new CTest;
    void *p = (void*)pTest;
    IBaseA *pBaseA = (IBaseA*)p;
    //pBaseA->fnA();

    IBaseB *pBaseB = (IBaseB*)p;
    pBaseB->fnB();

    pBaseB = (IBaseB*)pTest;  //相当于做了指针的偏移
    pBaseB->fnB();

    return 0;
}

```

命令：cl /d1 reportSingleClassLayoutCTest _test.cpp   
```C
class CTest     size(12):   
        +---   
        | +--- (base class IBa   
 0      | | {vfptr}   
 4      | | m_nTestB   
        | +---   
        | +--- (base class IBa   
 8      | | m_nTestA   
        | +---   
        +---   
   
CTest::$vftable@:   
        | &CTest_meta   
        |  0   
 0      | &CTest::fnB   
   
CTest::fnB this adjustor: 0   
```

2. gcc

命令gcc -fdump-class-hierarchy _test.cpp
类的内存结构在生成的class文件里面

```C
Class IBaseA
   size=4 align=4
   base size=4 base align=4
IBaseA (0x0x4cf1700) 0

Vtable for IBaseB
IBaseB::_ZTV6IBaseB: 3u entries
0     (int (*)(...))0
4     (int (*)(...))(& _ZTI6IBaseB)
8     (int (*)(...))__cxa_pure_virtual

Class IBaseB
   size=8 align=4
   base size=8 base align=4
IBaseB (0x0x4cf1738) 0
    vptr=((& IBaseB::_ZTV6IBaseB) + 8u)

Vtable for CTest
CTest::_ZTV5CTest: 3u entries
0     (int (*)(...))0
4     (int (*)(...))(& _ZTI5CTest)
8     (int (*)(...))CTest::fnB

Class CTest
   size=12 align=4
   base size=12 base align=4
CTest (0x0x6982180) 0
    vptr=((& CTest::_ZTV5CTest) + 8u)
  IBaseA (0x0x4cf1770) 8
  IBaseB (0x0x4cf17a8) 0
      primary-for CTest (0x0x6982180)
```


# Default Constructor
编译器自动生成的这些函数只有在编译器需要的时候才生成,   
如果编译结束都没有使用的函数,是不会被生成的   

1. 构造函数的扩张

在构造函数内部优先调用数据成员的构造函数   
TODO调用数据成员的构造函数的顺序,猜测和声明顺序一致


可以编译，不能链接   
设计者必须定义pure virtual destructor
```C++
class Animal
{
public:
    virtual ~Animal()=0;
};

class Dog : public Animal
{};

int main()
{
    Dog d;
    return 0;
}

```

2. 继承情况下的构造和析构的顺序
```C++
#include "stdafx.h"
#include "iostream"
using namespace std;
class Base
{
public:
    Base(){ std::cout<<"Base::Base()"<<std::endl; }
    ~Base(){ std::cout<<"Base::~Base()"<<std::endl; }
};

class Base1:public Base
{
public:
    Base1(){ std::cout<<"Base1::Base1()"<<std::endl; }
    ~Base1(){ std::cout<<"Base1::~Base1()"<<std::endl; }
};

class Derive
{
public:
    Derive(){ std::cout<<"Derive::Derive()"<<std::endl; }
    ~Derive(){ std::cout<<"Derive::~Derive()"<<std::endl; }
};

class Derive1:public Base1
{
private:
    Derive m_derive;
public:
    Derive1(){ std::cout<<"Derive1::Derive1()"<<std::endl; }
    ~Derive1(){ std::cout<<"Derive1::~Derive1()"<<std::endl; }
};

int _tmain(int argc, _TCHAR* argv[])
{
    Derive1 derive;
    return 0;
}

```
运行结果是：
Base::Base()    
Base1::Base1()    
Derive::Derive()   
Derive1::Derive1()   
Derive1::~Derive1()   
Derive::~Derive()  
Base1::~Base1()  
Base::~Base()  

这里构造和析构时的调用顺序是相反的   
TODO这里是先调用父类构造函数,还是调用自身数据成员的构造函数

3. 当编译器无法生成默认构造函数的时候也会罢工

下面是一个例子
```C++
class Animal
{
public:
    int &height;
};

int main()
{
    Animal a;//note: 'Animal::Animal()' is implicitly deleted because the default definition would be ill-formed:
}

```
4. 虚基类构造函数
```C++
class Base 
{
public:
    Base(int m):b(m){}
    int b;
};

class A : virtual public Base
{
public:
    A():a(5),Base(99){}
    int a;
};

class B : virtual public Base
{
public:
    B():b(6),Base(100){}
    int b;
};

class Derive:public A, public B
{
public:
    Derive(int q):B(),A(),Base(15){}    //虚基类必须这样，非虚基类不能隔代
};

int main()
{
    Derive d(12);
    return 0;
}

```
5. C++新标准的move construct & move assignment construct

TODO

# the semantics of data
1. static 和 const
```C++
class Animal
{
public:
    static void eat() const;
};

```
const 成员函数是包含this指针的 。这明显不被static函数允许

2. 继承和多态

继承的注意事项   
在private继承中,子类public不能改变private的属性
```C++
class Animal
{
public:
    virtual void bark();
};

class Dog : private Animal
{
public:     //it should be private
    void bark()
    {
        cout<<"wang"<<endl;
    }
};

int main()
{
    Dog d0;
    Dog *d1;
    //_test.obj : error LNK2001: 无法解析的外部符号 "public: virtual void __thiscall Animal::bark(void)" (?bark@Animal@@UAEXXZ)
    //d0.bark();

    //编译通过，运行错误
    //d1->bark();

    //'Animal' is an inaccessible base of 'Dog',private不允许这样转换
    Animal *a = new Dog();
    a->bark();
}

```

多态依赖于虚拟成员函数,只有指针才能实现多态   
实现细节是在指针查找虚表寻址方式的时候发生的

3. TODO MFC和Qt避免继承负担的封装措施

# the semantics of function

1. 虚拟成员函数

转换成虚表寻址方式,也是这种方式实现了多态

2. const成员函数

在c++中，非const对象是可以调用const成员函数的
```C++
#include<iostream>
using namespace std;

class Animal
{
public:
    int height;
    void bark() //const对象只能调用const成员函数
    {
        cout<<"wang"<<endl;
    }
};

void test(const Animal a)
{
    a.bark();
}

int main()
{
    Animal a;
    test(a);
    return 0;
}

```

3. 通过指针访问private成员函数
```C++
class Dog
{
private:
    int numbers;
    void setnum(int n)
    {
        numbers=n;
        cout<<numbers<<endl;
    }
public:
    Dog(){}
    Dog(string str,int n)
    {
        numbers = n;
    }
    int getnum()
    {
        cout<<numbers<<endl;
        return numbers;
    }
};

int main()
{
    Dog d;
    *(int *)&d = 5555;
    void (Dog::*pf)(int);
    void *p;
    Dog *D = &d;
    pf = &D->setnum;
    (D->*pf)(78);
}

```
指向成员函数的指针
```C++
void (Animal::*pf)()
pf = &Animal::eat()
```
