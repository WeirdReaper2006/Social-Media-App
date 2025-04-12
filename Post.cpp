#include "Post.h"
#include <iostream>
#include <string>
#include <ctime>
#include "User.h"
using namespace std;

// Constructor
Post::Post(int id, string content, User *author)
{
    this->PostID = id;
    this->Content = content;
    this->Author = author;
    this->Timestamp = time(0);
}

// Destructor
Post::~Post()
{
}

// PostID Setter
void Post::setPostID(int id)
{
    PostID = id;
}
// PostID Getter
int Post::getPostID()
{
    return PostID;
}

// Content Setter
void Post::setContent(string content)
{
    Content = content;
}
// Content Getter
string Post::getContent()
{
    return Content;
}

// Author Setter
void Post::setAuthor(User *author)
{
    Author = author;
}
// Author Getter
User *Post::getAuthor()
{
    return Author;
}

// Timestamp Setter
void Post::setTimestamp(time_t timestamp)
{
    Timestamp = timestamp;
}
// Timestamp Getter
char *Post::getTimestamp()
{
    // cout << "Timestamp: " << ctime(&Timestamp) << endl;
    return ctime(&Timestamp);
}

// Likes Setter
void Post::setLikes(int likes)
{
    Likes = likes;
}
// Likes Getter
int Post::getLikes()
{
    return Likes;
}
// Likes Incrementer
void Post::incrementLikes()
{
    Likes++;
}
// Likes Decrementer
void Post::decrementLikes()
{
    Likes--;
}