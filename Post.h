#include <iostream>
#include <vector>
#include <string>
#include "User.h"
using namespace std;

#ifndef POST_H
#define POST_H

class Post
{
private:
	int PostID;
	string Content;
	User* Author;
	time_t Timestamp;

public:
	Post(int id, string content, User* author) : PostID(id), Content(content), Author(author), Timestamp(time(0)) {}
	time_t getTimestamp() { return Timestamp; }
};

#endif

int main() {
	User u = User(1, "Rayyan", "Nayyar2006", "rayyanrafique95@gmail.com");
	Post p = Post(1, "Hello", &u);
	p.getTimestamp();
}