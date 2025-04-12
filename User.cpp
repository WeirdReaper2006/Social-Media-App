#include "User.h"
#include <iostream>
#include <vector>
#include <string>
using namespace std;

// Constructor
User::User(int id, string name, string pass, string email)
{
	this->UserID = id;
	this->Username = name;
	this->Password = pass;
	this->Email = email;
}

// Destructor
User::~User()
{
}

// User ID setter
void User::setUserID(int id)
{
	this->UserID = id;
}
// User ID getter
int User::getUserID()
{
	return this->UserID;
}

// Username setter
void User::setUsername(string name)
{
	this->Username = name;
}
// Username getter
string User::getUsername()
{
	return this->Username;
}

// Password setter
void User::setPassword(string pass)
{
	this->Password = pass;
}
// Password getter
string User::getPassword()
{
	return this->Password;
}

// Email setter
void User::setEmail(string email)
{
	this->Email = email;
}
// Email getter
string User::getEmail()
{
	return this->Email;
}

// Method to display user information
void User::displayUserInfo()
{
	cout << "User ID: " << UserID << endl;
	cout << "Username: " << Username << endl;
	cout << "Email: " << Email << endl;
}