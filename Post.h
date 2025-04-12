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
	int Likes;

public:
	// Constructor
	Post(int id, string content, User *author);
	// Destructor
	~Post();

	// PostID Setter
	void setPostID(int id);
	// PostID Getter
	int getPostID();

	// Content Setter
	void setContent(string content);
	// Content Getter
	string getContent();

	// Author Setter
	void setAuthor(User *author);
	// Author Getter
	User *getAuthor();

	// Timestamp Setter
	void setTimestamp(time_t timestamp);
	// Timestamp Getter
	char *getTimestamp();

	// Likes Setter
	void setLikes(int likes);
	// Likes Getter
	int getLikes();
	// Likes Incrementer
	void incrementLikes();
	// Likes Decrementer
	void decrementLikes();
};

#endif
