#include "Comment.h"
#include <iostream>
#include <vector>
#include <string>
#include "User.h"
using namespace std;

// Constructor
Comment::Comment(int id, string text, User *user, Post *post)
{
    this->CommentID = id;
    this->Text = text;
    this->user = user;
    this->post = post;
    this->Timestamp = time(0);
}

// Destructor
Comment::~Comment()
{
}

// ID setter
void Comment::setCommentID(int id)
{
    this->CommentID = id;
}
// ID getter
int Comment::getCommentID()
{
    return this->CommentID;
}

// Text setter
void Comment::setText(string text)
{
    this->Text = text;
}
// Text getter
string Comment::getText()
{
    return this->Text;
}

// User setter
void Comment::setUser(User *user)
{
    this->user = user;
}
// User getter
User *Comment::getUser()
{
    return this->user;
}

// Post setter
void Comment::setPost(Post *post)
{
    this->post = post;
}
// Post getter
Post *Comment::getPost()
{
    return this->post;
}

// Timestamp setter
void Comment::setTimestamp(time_t timestamp)
{
    this->Timestamp = timestamp;
}
// Timestamp getter
char *Comment::getTimestamp()
{
    return ctime(&Timestamp);
}