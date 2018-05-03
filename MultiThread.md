# Windows下多线程的同步与互斥

## critical section

<pre><code class="C++">#include &lt;stdio.h&gt;
#include &lt;process.h&gt;
#include &lt;windows.h&gt;

// Usage
// EnterCriticalSection(CRITICAL_SECTION)
// ...//do some thing
// LeaveCriticalSection(CRITICAL_SECTION)

long global;
unsigned int __stdcall ThreadFunction(void *handle);
const int THREAD_NUM = 10;  //if the number is more than 100,there will be a question
// definition of critical section
CRITICAL_SECTION g_csThreadCode;

int main()
{
    // initialize critical section
    InitializeCriticalSection(&g_csThreadCode);

    HANDLE handle[THREAD_NUM];
    global = 0;
    int i = 0;
    while (i &lt; THREAD_NUM) 
    {
        handle[i] = (HANDLE)_beginthreadex(NULL, 0, ThreadFunction, &i, 0, NULL);
        ++i;  
    }
    WaitForMultipleObjects(THREAD_NUM, handle, TRUE, INFINITE); //wait for all threads to finish the task
    DeleteCriticalSection(&g_csThreadCode);

    return 0;
}

unsigned int __stdcall ThreadFunction(void *handle)
{
    EnterCriticalSection(&g_csThreadCode);  // enter critical section
    global++;
    Sleep(0);                               //重新发起一次CPU竞争
    printf("global variable is %d\n",global);
    LeaveCriticalSection(&g_csThreadCode);
    return 0;
}
</code></pre>

这个例子当线程数设置为150时，我的主机就无法正常全部打印了

## mutex

<pre><code class="C++">// 互斥量Mutex：
// Usage
// WaitForSingleObject(hMutex,…);  
// ...//do something  
// ReleaseMutex(hMutex);  

#include &lt;stdio.h&gt;
#include &lt;process.h&gt;
#include &lt;windows.h&gt;

long global;
unsigned int __stdcall ThreadFunction(void *handle);
const int THREAD_NUM = 10;
// 互斥量
HANDLE hmutex; 

int main()
{
    // 初始化互斥量,第二个参数为TRUE表示互斥量为创建进程所有
    hmutex = CreateMutex(NULL, FALSE, NULL);

    HANDLE handle[THREAD_NUM];
    global = 0;
    int i = 0;
    while (i &lt; THREAD_NUM) 
    {
        handle[i] = (HANDLE)_beginthreadex(NULL, 0, ThreadFunction, &i, 0, NULL);
        i++;
    }
    WaitForMultipleObjects(THREAD_NUM, handle, TRUE, INFINITE);
    // 销毁互斥量
    CloseHandle(hmutex);
    return 0;
}

unsigned int __stdcall ThreadFunction(void *handle)
{
    WaitForSingleObject(hmutex, INFINITE);  // 等待互斥量被触发
    global++;
    Sleep(0);
    printf("global variable is %d\n", global);
    ReleaseMutex(hmutex);   // 触发互斥量
    return 0;
}
</code></pre>

互斥量和关键段的区别互斥量可以设置等待时间

## event

<pre><code class="C++">// Usage
// SetEvent(hEvent);
// WaitForSingleObject(hEvent,…);
// 等待其他进程的setevent，然后执行操作

#include &lt;stdio.h&gt;  
#include &lt;process.h&gt;  
#include &lt;windows.h&gt;  
long global;  
unsigned int __stdcall ThreadFunction(void *handle);  
const int THREAD_NUM = 10;  
//事件
HANDLE hevent;
int main()  
{  
    //初始化事件初
    hevent = CreateEvent(NULL, FALSE, FALSE, NULL);
    HANDLE  handle[THREAD_NUM];   
    global = 0;  
    int i = 0;  
    SetEvent(hevent);  //如果这一行注释，则事件没有触发，所有线程等待
    while (i &lt; THREAD_NUM)   
    {  
        handle[i] = (HANDLE)_beginthreadex(NULL, 0, ThreadFunction, &i, 0, NULL);  
        i++;  
    }  
    WaitForMultipleObjects(THREAD_NUM, handle, TRUE, INFINITE);  
    //销毁事件
    CloseHandle(hevent);  
    return 0;  
}  
unsigned int __stdcall ThreadFunction(void *handle)  
{
    WaitForSingleObject(hevent,INFINITE);
    global++;  
    Sleep(0);
    printf("global variable is %d\n",global);   
    SetEvent(hevent); //触发事件 
    return 0;  
}  
</code></pre>

事件更适合一个线程像另一个线程发送通知消息

## semaphore

<pre><code class="C++">// WaitForSingleObject(hsemaphore,INFINITE);
// ...//do something
// ReleaseSemaphore(hsemaphore, 1, NULL);

#include &lt;stdio.h&gt;
#include &lt;process.h&gt;
#include &lt;windows.h&gt;

long global;
unsigned int __stdcall ThreadFunction(void *handle);
const int THREAD_NUM = 10;
// 信号量
HANDLE hsemaphore;

int main()
{
    // 初始化信号量和关键段
    hsemaphore = CreateSemaphore(NULL, 0, 1, NULL); // 当前0个资源，最大允许1个同时访问
    ReleaseSemaphore(hsemaphore, 1, NULL);  // 信号量++,多出一个资源，如果注释掉，所有线程等待
    HANDLE handle[THREAD_NUM];
    global = 0;
    int i = 0;
    while (i &lt; THREAD_NUM) 
    {
        handle[i] = (HANDLE)_beginthreadex(NULL, 0, ThreadFunction, &i, 0, NULL);
        ++i;
    }
    WaitForMultipleObjects(THREAD_NUM, handle, TRUE, INFINITE);

    // 销毁信号量
    CloseHandle(hsemaphore);
    return 0;
}

unsigned int __stdcall ThreadFunction(void *handle)
{
    WaitForSingleObject(hsemaphore,INFINITE);
    global++;
    Sleep(0);
    printf("global variable is %d\n",global);
    ReleaseSemaphore(hsemaphore, 1, NULL);  // 信号量++
    return 0;
}
</code></pre>

semaphore针对资源而言，对于一个区间允许有多个线程访问

# 以上几种方法的对比

| critical section |          mutex          |   event   |                 semaphore                 |
|:----------------:|:-----------------------:|:---------:|:-----------------------------------------:|
|       非内核        |           内核            |    内核     |                    内核                     |
|   只能同步单个进程的线程    |                         |           |                  属于PV操作                   |
|   可以由软件层面忙等来实现   | 互斥量是可以命名的，也就是说它可以跨越进程使用 | 主要用于消息通知等 | 允许多个线程在同一时刻访问同一资源，但是需要限制在同一时刻访问此资源的最大线程数目 |

# 进程互斥的软件解决方法

*   Use two shared data items 

<pre><code class="C++">int turn; //指示该谁进入临界区  
bool flag[]; //指示进程是否准备好进入临界区
</code></pre>

*   code for enter critical section 

<pre><code class="C++">flag[i] = TRUE;
turn = j;
while(flag[j]&&turn==j);
</code></pre>

*   code for exit critical section

<pre><code class="C++">flag[j]=FALSE;
</code></pre>

# 其他基于硬件的原子操作

<img src="https://www.jum1023.com/wp-content/uploads/2018/01/thread-300x172.jpg" alt="" width="792" height="455" class="alignnone size-medium wp-image-78" />

# 其他关于进程间同步的经典问题

*   生产者和消费者问题
*   读者优先和写者优先
*   哲学家就餐问题

# 关于线程池的问题