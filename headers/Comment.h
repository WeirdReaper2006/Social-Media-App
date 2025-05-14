#include <iostream>
#include <vector>
#include <string>
#include "User.h"
#include "Post.h"
using namespace std;

#ifndef COMMENT_H
#define COMMENT_H

class Comment
{
private:
    int CommentID;
    string Text;
    User *user;
    Post *post;
    time_t Timestamp;

public:
    // Constructor
    Comment(int id, string text, User *user, Post *post);

    // Destructor
    ~Comment();

    // ID setter
    void setCommentID(int id);
    // ID getter
    int getCommentID();

    // Text setter
    void setText(string text);
    // Text getter
    string getText();

    // User setter
    void setUser(User *user);
    // User getter
    User *getUser();

    // Post setter
    void setPost(Post *post);
    // Post getter
    Post *getPost();

    // Timestamp setter
    void setTimestamp(time_t timestamp);
    // Timestamp getter
    char *getTimestamp();
};

#endif