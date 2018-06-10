# 二叉树的创建

## 二叉树的表示

二叉树可以用结构体的方式表示，也可以用类的方式表示。当然这两种表示方式都离不开指针

*   结构体表示
```C++
//binary tree
struct tree
{
    int val;
    tree *left;
    tree *right;
    tree(int x):val(x),left(NULL),right(NULL){}
};
```
*   类表示  
    在C++中结构体和类几乎没有什么区别，只是成员的访问属性上，类默认是private，而结构体默认是public

## 二叉树的创建

下面创建一个树，并且返回头指针

```C++
//create tree
/*
this is the tree we will create:
                1
               / \
              /   \
             2     3
                  / 
                 /   
                4
                 \
                  \
                   5

preorder    1 2 3 4 5
inorder     2 1 4 5 3
postorder   2 5 4 3 1
*/
tree * create()
{
    tree *head = new tree(1);
    head->left = new tree(2);
    head->right = new tree(3);
    head->right->left = new tree(4);
    head->right->left->right = new tree(5);
    return head;
}
```

# 二叉树的遍历

## 递归遍历

递归遍历比较简单，也是最常用的方式

### 先序遍历

```C++
//preorder tranversal
void PreorderTraversing(tree *node)
{
    if(node==NULL)
    {
        return ;
    }
    //to do something with node value
    cout<<node->val<<endl;

    traversing(node->left);
    traversing(node->right);  
}
```

### 中序遍历

```C++
//inorder tranversal
void InorderTraversing(tree *node)
{
    if(node==NULL)
    {
        return ;
    }
    traversing(node->left);

    //to do something with node value
    cout<<node->val<<endl;

    traversing(node->right);  
}
```

### 后序遍历

```C++
//postorder tranversal
void PostorderTraversing(tree *node)
{
    if(node==NULL)
    {
        return ;
    }
    traversing(node->left);
    traversing(node->right);  

    //to do something with node value
    cout<<node->val<<endl;
}
```

## 循环遍历

循环遍历这里主要用到了STL标准库的栈的数据结构

### 先序遍历

```C++
//preorder tranversal using stack
void PreorderTraversing(tree *head)
{
    stack<tree*> treestack;
    tree *node = head;
    while(node||!treestack.empty())
    {
        treestack.push(node);

        //to do something with node value
        cout<<node->val<<endl;

        node=node->left;
        while(!node&&!treestack.empty())
        {
            node=treestack.top();
            treestack.pop();
            node=node->right;
        }
    }
}
```

### 中序遍历

```C++
//Inorder tranversal using stack
void InorderTraversing(tree *head)
{
    stack<tree*> treestack;
    tree *node = head;
    while(node||!treestack.empty())
    {
        treestack.push(node);
        node=node->left;
        while(!node&&!treestack.empty())
        {
            node=treestack.top();
            treestack.pop();

            //to do something with node value
            cout<<node->val<<endl;

            node=node->right;
        }
    }
}
```

### 后序遍历

```C++
//Postorder tranversal using stack
void PostorderTraversing(tree *head)
{
    stack<tree*> treestack;
    tree *node = head,*prenode=NULL;
    if(node==NULL)
    {
        return ;
    }
    treestack.push(node);
    while(!treestack.empty())
    {
        node=treestack.top();

        if((node->left==NULL && node->right==NULL)||(node->left==prenode || node->right==prenode))
        {
            //to do something with node value
            cout<<node->val<<endl;

            prenode=node;
            treestack.pop();
        }
        else
        {
            if(node->right!=NULL)
            {
                treestack.push(node->right);
            }
            if(node->left!=NULL)
            {
                treestack.push(node->left);
            }
        }
    }
}
```