# 动态规划

### 动态规划介绍
动态规划算法是从暴力搜索算法优化过来的，如果我们不清楚暴力搜索的过程，就难以理解动态规划的实现，当我们了解了动态规划算法的基本原理的文字概述，实现条件之后，这时可能并不是太理解这种思想，去面对实际问题的时候也是无从下手，这个时候我们不能停留在文字层面上，而应该去学习经典动态规划算法的实现，然后倒回来看这些概念，便会恍然大悟。

动态规划算法的难点在于一步转移代价,即找到的数列之间的关系,这些关系甚至没有固定的表达式，只是一些大小的判断等等.


#####动态规划的关键点:

1. 最优化原理，也就是最有子结构性质。这指的是一个最优化策略具有这样的性质，无论过去状态和决策如何，对前面的决策所形成的状态而言，余下的决策必须构成最优策略，简单来说就是一个最优化策略的子策略总是最优的，如果一个问题满足最优化原理，就称其有最优子结构性质。

2. 无后效性，指的是某个状态下的决策的收益，只与状态和决策相关，与达到该状态的方式无关。

3. 子问题的重叠性，动态规划将原来指数级的暴力搜索算法改进到了具有多项式时间复杂度的算法，其中的关键在于解决了荣誉，重复计算的问题，这是动态规划算法的根本目的。

4. 总体来说，动态规划算法就是一系列以空间换取时间的算法。

### 动态规划实例

#### 一维动态规划问题

##### 爬楼梯问题
一个人爬楼梯，每次只能爬1个或2个台阶，假设有n个台阶，那么这个人有多少种不同的爬楼梯方法

这里希望通过解决这个问题对比递归实现的方法来显示动态规划的高效性
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

##### 最长子序列问题
给定数组arr，返回arr的最长递增子序列的长度，比如arr=[2,1,5,3,6,4,8,9,7]，最长递增子序列为[1,3,4,8,9]返回其长度为5.

分析：

首先生成dp[n]的数组，dp[i]表示以必须arr[i]这个数结束的情况下产生的最大递增子序列的长度。对于第一个数来说，很明显dp[0]为1，当我们计算dp[i]的时候，我们去考察i位置之前的所有位置，找到i位置之前的最大的dp值，记为dp[j](0=<j<i),dp[j]代表以arr[j]结尾的最长递增序列，而dp[j]又是之前计算过的最大的那个值，我们在来判断arr[i]是否大于arr[j],如果大于dp[i]=dp[j]1.计算完dp之后，我们找出dp中的最大值，即为这个串的最长递增序列。

```C++
#include <iostream>  
#include <algorithm>  
using namespace std;  
/*动态规划表*/  
int dp[5] = {};  
int main(){  
    int arr[5] = {2,4,5,3,1};  
    dp[0] = 1;  
    const int oo = 0;  
    for (int i = 1;i<5;i++){  
        int _max = oo;  
        for (int j=0;j<i;j++)  
            if(dp[j]>_max&&arr[i]>arr[j])  
                _max = dp[j];  
        dp[i] = _max+1;  
    }  
    int maxlist=0;  
    for (int i = 0; i < 5;i++)  
        if (dp[i] > maxlist)  
            maxlist=dp[i];  
    cout << maxlist << endl;  
}  
```

#### 二维动态规划问题

##### 最短路径问题
给定一个矩阵m，从左上角开始每次只能向右走或者向下走，最后达到右下角的位置，路径中所有数字累加起来就是路径和，返回所有路径的最小路径和，如果给定的m如下，那么路径1,3,1,0,6,1,0就是最小路径和，返回12.

1 3 5 9

8 1 3 4

5 0 6 1

8 8 4 0

分析：对于这个题目，假设m是m行n列的矩阵，那么我们用dp[m][n]来抽象这个问题，dp[i][j]表示的是从原点到i,j位置的最短路径和。我们首先计算第一行和第一列，直接累加即可，那么对于其他位置，要么是从它左边的位置达到，要么是从上边的位置达到，我们取左边和上边的较小值，然后加上当前的路径值，就是达到当前点的最短路径。然后从左到右，从上到下依次计算即可。

```C++
#include <iostream>  
#include <algorithm>  
using namespace std;  
int dp[4][4] = {};  
int main(){  
    int arr[4][4] = {1,3,5,9,8,1,3,4,5,0,6,1,8,8,4,0};  
    //cout << fun(arr,4,4) << endl;  
     const int oo = ~0U>>2;  
     for (int i = 0;i<4;i++)  
         for (int j = 0; j < 4;j++)  
             dp[i][j] = oo;  
     //dp[0][0] = oo;  
     for (int i = 0; i < 4;i++){  
         for (int j = 0; j<4;j++){  
             if (dp[i][j] == oo){  
                if (i==0&&j==0)  
                    dp[i][j] = arr[i][j];  
                else if (i==0&&j!=0)  
                    dp[i][j] = arr[i][j] + dp[i][j-1];  
                else if(i!=0&&j==0)  
                    dp[i][j] = arr[i][j] + dp[i-1][j];  
                else{  
                    dp[i][j] = arr[i][j]+min(dp[i-1][j],dp[i][j-1]);  
                }  
             }  
         }  
     }  
    // cout << dp[3][3] << endl;  
     for (int i = 0; i< 4;i++){  
         for (int j = 0; j<4;j++){  
            cout << dp[i][j] << "  ";  
         }  
         cout << endl;  
     }  
}
```

##### 最长公共子序列问题

给定两个字符串str1和str2，返回两个字符串的最长公共子序列，例如：str1="1A2C3D4B56",str2="B1D23CA45B6A","123456"和"12C4B6"都是最长公共子序列，返回哪一个都行。

分析：本题是非常经典的动态规划问题，假设str1的长度为M，str2的长度为N，则生成M*N的二维数组dp，dp[i][j]的含义是str1[0..i]与str2[0..j]的最长公共子序列的长度。

dp值的求法如下：

dp[i][j]的值必然和dp[i-1][j],dp[i][j-1],dp[i-1][j-1]相关，结合下面的代码来看，我们实际上是从第1行和第1列开始计算的，而把第0行和第0列都初始化为0，这是为了后面的取最大值在代码实现上的方便，dp[i][j]取三者之间的最大值。
```C++
int findLCS(string A, int n, string B, int m) 
{  
    // n表示字符串A的长度，m表示字符串B的长度  
    int dp[500][500] = {};  
    for (int i = 0;i < n;i++)  
    {  
        for (int j = 0; j<m;j++)  
        {  
            if (A[i]==B[j])  
                dp[i+1][j+1] = dp[i][j]+1;  
            else  
                dp[i+1][j+1] = max(dp[i+1][j],dp[i][j+1]);  
        }  
    }  
    return dp[n][m];  
} 
```

##### 字符串问题

给定两个字符串str1，str2，在给定三个整数ic,dc,rc，分别代表插入，删除和替换一个字符的代价。返回将str1

编辑成str2的代价，比如，str1="abc",str2="adc",ic=5,dc=3,rc=2,从str1到str2，将'b'换成'd'代价最小，所以返回2.

分析：

在构建出动态规划表的时候，关键是搞清楚每个位置上数值的来源。首先我们生成dp[M+1][N+1]的动态规划表，M代表str1的长度，N代表str2的长度，那么dp[i][j]就是str1[0..i-1]变成str2[0...j-1]的最小代价，则dp[i][j]的来源分别来自以下四种情况：

a、首先将str1[i-1]删除，变成str1[0...i-2],然后将str1[0...i-2]变成str2[0...j-1],那么dp[i-1][j]就代表从str1[0..i-2]到str2[0...j-1]的最小代价，所以：dp[i][j] = dp[i-1][j]+dc;

b、同理也可以是从str1[0...i-1]变成str2[0...j-2]，然后在插入str2[j-1],dp[i][j-1]就代表从str1[0...i-1]变成str2[0...j-2]的最小大家，所以：dp[i][j] = dp[i][j-1]+ic;

c、如果str[i-1] == str2[j-1],则只需要将str1[0...i-2]变成str2[0...j-2]，此时dp[i][j] = dp[i-1][j-1];

d、如果str1[i-1]!=str2[j-1],则我们只需要将str1[i-1]替换成str2[j-1],此时dp[i][j] = dp[i-1][j-1]+rc;
在这四种情况当中，我们选取最小的一个，即为最小代价

```C++
#include <iostream>  
#include <string>  
#include <algorithm>  
#include <vector>  
using namespace std;  
  
int main(){  
    string str1 = "ab12cd3";  
    string str2 = "abcdf";  
    //cin>>str1;  
    //cin>>str2;  
    const int M = str1.length();  
    const int N = str2.length();  
    //vector<int> p(M+1,0);  
    //vector<vector<int>> dp(N+1,p);  
    int dp[10][10] = {};  
    int ic=5,dc=3,rc=2;  
    //int ic = 1,dc=1,rc=1;  
    dp[0][0] = 0;  
    for (int i = 1;i<N+1;i++)  
        dp[0][i] = ic*i;  
    for (int i = 1;i<M+1;i++)  
        dp[i][0] = dc*i;  
  
    for (int i=0;i<M;i++){  
        for (int j = 0;j<N;j++){  
            int x = min(dc+dp[i+1][j],dp[i][j+1]+ic);  
            if (str1[i]!=str2[j])  
                dp[i+1][j+1] = min(dp[i][j] + rc,x);  
            else   
                dp[i+1][j+1] = min(dp[i][j],x);  
        }  
    }  
    cout << dp[M][N] << endl;  
} 
```

##### 背包问题
   
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


# 例题
##### 如果我们有面值为1元、3元和5元的硬币若干枚，如何用最少的硬币凑够11元

