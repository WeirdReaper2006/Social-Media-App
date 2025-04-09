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
	User *Author;
	time_t Timestamp;

public:
	Post(int id, string content, User *author) : PostID(id), Content(content), Author(author), Timestamp(time(0)) {}
	void getTimestamp()
	{
		cout << "Timestamp: " << ctime(&Timestamp) << endl;
	}
};

#endif
