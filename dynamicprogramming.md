# 动态规划
### 动态规划例子
***
一个人爬楼梯，每次只能爬1个或两个台阶，假设有n个台阶，那么这个人有多少种不同的爬楼梯方法
***
这里希望通过解决这个问题来显示动态规划的高效性
```C++
#include<iostream>
#include<time.h>
#include<windows.h>
using namespace std;

long long upstairs_dp(int n);
long long upstairs_re(int n);

int main()
{
    clock_t start,finish;
    double totaltime;
    long long iresult;

    start = clock();
    iresult = upstairs_re(40); //50需要80秒才能得出结果
    finish = clock();
    cout<<iresult<<endl;
    totaltime = (double) (finish - start)/CLOCKS_PER_SEC;
    cout<<totaltime<<endl;

    start = clock();
    iresult = upstairs_dp(500); //500都无法统计时间
    finish = clock();
    cout<<iresult<<endl;
    totaltime = (double) (finish - start)/CLOCKS_PER_SEC;
    cout<<totaltime<<endl;
}

long long upstairs_dp(int n)
{
    if(n==1)
    {
        return 1L;
    }
    if(n==2)
    {
        return 2L;
    }
    long long temp1=1,temp2=2,temp;
    for(int i=3;i<=n;i++)
    {
        temp = temp1 + temp2;
        temp1 = temp2;
        temp2 = temp;
    }
    return temp;
}

long long upstairs_re(int n)
{
    if(n==1)
    {
        return 1L;
    }
    if(n==2)
    {
        return 2L;
    }
    return upstairs_re(n-1)+upstairs_re(n-2);
}

```

### 动态规划介绍
### 动态规划更多实例