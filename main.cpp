#include <iostream>
#include <string>
#include <ctime>
#include "User.h"
#include "Post.h"
using namespace std;

int main()
{
    User u = User(1, "Rayyan", "Nayyar2006", "rayyanrafique95@gmail.com");
    Post p = Post(1, "Hello", &u);
    p.getTimestamp();
}