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

* 背包问题
   
一个经典的问题,解法和说明就不多说了，网上的列子数不胜数   
我最终理解这个动态规划问题是通过公式一步一步填写dp的表格   
这里记录一下说，凡事动手实践才能快速掌握

公式如下
```matlab
j<w(i) => v(i,j)=v(i-1,j)
j>=w(i) => v(i,j)=max{ v(i-1,j), v(i-1,j-w(i))+v(i)}
```
i表示第i个物品   
j表示背包的容量  
v表示价值value  
w表示质量weight 
公式的核心含义是对于当前这个物品,装入背包,那么背包剩余空间在所能承载的最大价值是之前计算过的,   
所以可以计算当前物品装入背包时,所能获取的最大价值

根据公式完成下列表格，基本可以理解该问题的解决方法

|i\j|0|0|0|0|0|0|
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
|0|0|0|0|0|0|0|
|30|0|0|0|120|120|120|
|10|0|60|60|120|180|180|
|20|0|60|100|160|180|220|

初始化默认边上为0,从(2,2)位置开始,从上往下，从左往右依次进行   
直到整个表格填满即可   

下面是简单的实现代码   
没有包含回溯找出装那些物品价值最大,仅仅计算了最大价值是多少
```C++
#include<iostream>
using namespace std;

#define row 4
#define column 6

class knapsack
{
public:
	knapsack();
	void init();
	void calculate();
	void printDP();
private:
	int dp[row][column];  //dp数组
	int weight[row];	  //物品质量
	int value[row];		  //物品价值
	int capacity[column]; //背包容量
};

knapsack::knapsack()
{
	memset(dp, 0, sizeof(dp));

	weight[0] = 0;
	weight[1] = 30;
	weight[2] = 10;
	weight[3] = 20;

	value[0] = 0;
	value[1] = 120;
	value[2] = 60;
	value[3] = 100;

	for (int i = 0; i < column; i++)
	{
		capacity[i] = i * 10;
	}
}

void knapsack::init()
{

}

void knapsack::calculate()
{
	for (int j = 1; j < column; j++)
	{
		for (int i = 1; i < row; i++)
		{
			if (capacity[j] < weight[i])
			{
				dp[i][j] = dp[i - 1][j];
			}
			else
			{
				int temp = dp[i - 1][(capacity[j] - weight[i])/10] + value[i];
				dp[i][j] = temp>dp[i - 1][j] ? temp : dp[i - 1][j];
			}
		}
	}
}

void knapsack::printDP()
{
	for (int i = 0; i < row; i++)
	{
		for (int j = 0; j < column; j++)
		{
			cout << dp[i][j] << "\t";
		}
		cout << endl;
	}
	cout << endl;
}


int main()
{
	knapsack k;
	k.calculate();
	k.printDP();
	return 0;
}
```
