#include <iostream>
#include <vector>
#include <string>
using namespace std;

#ifndef USER_H
#define USER_H

class User
{
private:
	int UserID;
	string Username;
	string Password;
	string Email;

public:
	// Constructor
	User(int id, string name, string pass, string email);
	// Destructor
	virtual ~User();

	// User ID setter
	void setUserID(int id);
	// User ID getter
	int getUserID();

	// Username setter
	void setUsername(string name);
	// Username getter
	string getUsername();

	// Password setter
	void setPassword(string pass);
	// Password getter
	string getPassword();

	// Email setter
	void setEmail(string email);
	// Email getter
	string getEmail();

	// Method to display user information
	void displayUserInfo();
};

#endif