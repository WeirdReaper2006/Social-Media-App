#include <iostream>
#include <string>
#include <ctime>
#include "headers/User.h"
#include "headers/Post.h"
#include "headers/Comment.h"
#include "headers/Notification.h"
#include "headers/Relationship.h"
#include <fstream>
#include <sstream>
#include <vector>
#define BOOST_VERSION 108800 // 1.88.0 → 108800
#define CROW_USE_BOOST
#include <boost/asio.hpp>
#include "crow_all.h"

using namespace std;

// Utility function to trim strings
string trim(const string &str)
{
    size_t first = str.find_first_not_of(" \n\r\t\f\v");
    size_t last = str.find_last_not_of(" \n\r\t\f\v");
    return (first == string::npos) ? "" : str.substr(first, (last - first + 1));
}

// File paths
const string userFile = "data/users.txt";
const string postFile = "data/posts.txt";
const string commentFile = "data/comments.txt";
const string friendFile = "data/friends.txt";

// Helper function to verify login
bool verifyLogin(const string &username, const string &password)
{
    ifstream file(userFile);
    string line;
    while (getline(file, line))
    {
        istringstream ss(line);
        string storedUser, storedPass;
        ss >> storedUser >> storedPass;
        if (storedUser == username && storedPass == password)
        {
            return true;
        }
    }
    return false;
}

// Route: /register
void handleRegister(const crow::request &req, crow::response &res)
{
    auto body = crow::json::load(req.body);
    string username = body["username"].s();
    string password = body["password"].s();

    ifstream file(userFile);
    string line;
    while (getline(file, line))
    {
        istringstream ss(line);
        string storedUser;
        ss >> storedUser;
        if (storedUser == username)
        {
            res.code = 400;
            res.write("Username already exists");
            res.end();
            return;
        }
    }

    ofstream out(userFile, ios::app);
    out << username << " " << password << "\n";
    res.write("User registered successfully");
    res.end();
}

// Route: /login
void handleLogin(const crow::request &req, crow::response &res)
{
    auto body = crow::json::load(req.body);
    string username = body["username"].s();
    string password = body["password"].s();

    if (verifyLogin(username, password))
    {
        res.write("Login successful");
    }
    else
    {
        res.code = 401;
        res.write("Invalid credentials");
    }
    res.end();
}

// Route: /post
void handlePost(const crow::request &req, crow::response &res)
{
    auto body = crow::json::load(req.body);
    string username = body["username"].s();
    string content = body["content"].s();

    Post post(content, username); // Assuming constructor: Post(content, author)
    ofstream out(postFile, ios::app);
    out << username << "|" << content << "\n";
    res.write("Post created");
    res.end();
}

// Route: /comment
void handleComment(const crow::request &req, crow::response &res)
{
    auto body = crow::json::load(req.body);
    string username = body["username"].s();
    string postAuthor = body["postAuthor"].s();
    string content = body["content"].s();

    ofstream out(commentFile, ios::app);
    out << username << "|" << postAuthor << "|" << content << "\n";
    res.write("Comment added");
    res.end();
}

// Route: /friend
void handleFriend(const crow::request &req, crow::response &res)
{
    auto body = crow::json::load(req.body);
    string from = body["from"].s();
    string to = body["to"].s();

    ofstream out(friendFile, ios::app);
    out << from << "->" << to << "\n";
    res.write("Friend added (one-way)");
    res.end();
}

// Route: /posts
void handleGetPosts(const crow::request &req, crow::response &res)
{
    string username = req.url_params.get("username");
    ifstream postIn(postFile);
    ifstream friendIn(friendFile);

    vector<string> allowedAuthors = {username};
    string line;

    while (getline(friendIn, line))
    {
        istringstream ss(line);
        string from, to;
        getline(ss, from, '-');
        ss.get(); // skip '>'
        getline(ss, to);
        if (from == username)
        {
            allowedAuthors.push_back(trim(to));
        }
    }

    ostringstream response;
    while (getline(postIn, line))
    {
        istringstream ss(line);
        string author, content;
        getline(ss, author, '|');
        getline(ss, content);

        for (const auto &a : allowedAuthors)
        {
            if (a == trim(author))
            {
                response << author << ": " << content << "\n";
                break;
            }
        }
    }

    res.write(response.str());
    res.end();
}

// Route: /admin/posts
void handleAdminPosts(const crow::request &req, crow::response &res)
{
    string username = req.url_params.get("username");

    // Simple check for admin (could be extended)
    if (username != "admin")
    {
        res.code = 403;
        res.write("Access denied");
        res.end();
        return;
    }

    ifstream postIn(postFile);
    ostringstream response;
    string line;

    while (getline(postIn, line))
    {
        istringstream ss(line);
        string author, content;
        getline(ss, author, '|');
        getline(ss, content);
        response << author << ": " << content << "\n";
    }

    res.write(response.str());
    res.end();
}

// Main server
int main()
{
    crow::SimpleApp app;

    CROW_ROUTE(app, "/register").methods("POST"_method)(handleRegister);
    CROW_ROUTE(app, "/login").methods("POST"_method)(handleLogin);
    CROW_ROUTE(app, "/post").methods("POST"_method)(handlePost);
    CROW_ROUTE(app, "/comment").methods("POST"_method)(handleComment);
    CROW_ROUTE(app, "/friend").methods("POST"_method)(handleFriend);
    CROW_ROUTE(app, "/posts").methods("GET"_method)(handleGetPosts);
    CROW_ROUTE(app, "/admin/posts").methods("GET"_method)(handleAdminPosts);

    app.port(18080).multithreaded().run();
}
