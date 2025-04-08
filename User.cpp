#include "User.h"
#include <iostream>
#include <vector>
#include <string>
using namespace std;

// Constructor
User::User(int id, string name, string pass, string email)
{
	UserID = id;
	Username = name;
	Password = pass;
	Email = email;
}

// Destructor
User::~User()
{
}

// User ID setter
void User::setUserID(int id)
{
	UserID = id;
}
// User ID getter
int User::getUserID()
{
	return UserID;
}

// Username setter
void User::setUsername(string name)
{
	Username = name;
}
// Username getter
string User::getUsername()
{
	return Username;
}

// Password setter
void User::setPassword(string pass)
{
	Password = pass;
}
// Password getter
string User::getPassword()
{
	return Password;
}

// Email setter
void User::setEmail(string email)
{
	Email = email;
}
// Email getter
string User::getEmail()
{
	return Email;
}

// Method to display user information
void User::displayUserInfo()
{
	cout << "User ID: " << UserID << endl;
	cout << "Username: " << Username << endl;
	cout << "Email: " << Email << endl;
}