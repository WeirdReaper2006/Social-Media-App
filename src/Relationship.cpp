#include "Relationship.h"
#include <iostream>
#include <vector>
#include <string>
#include <ctime>
#include "User.h"
using namespace std;

// Constructor
Relationship::Relationship(int id, User *user1, User *user2, string status) : RelationshipID(id), user1(*user1), user2(*user2), status(status), Timestamp(time(0))
{
    // Constructor body can be empty as member initializer list is used
}

// Destructor
Relationship::~Relationship()
{
}

// Relationship ID setter
void Relationship::setRelationshipID(int id)
{
    this->RelationshipID = id;
}
// Relationship ID getter
int Relationship::getRelationshipID()
{
    return this->RelationshipID;
}

// User1 setter
void Relationship::setUser1(User *u1)
{
    this->user1 = *u1;
}
// User1 getter
User Relationship::getUser1()
{
    return this->user1;
}

// User2 setter
void Relationship::setUser2(User *u2)
{
    this->user2 = *u2;
}
// User2 getter
User Relationship::getUser2()
{
    return this->user2;
}

// Status setter
void Relationship::setStatus(string stat)
{
    this->status = stat;
}
// Status getter
string Relationship::getStatus()
{
    return this->status;
}

// Timestamp setter
void Relationship::setTimestamp(time_t ts)
{
    this->Timestamp = ts;
}
// Timestamp getter
char *Relationship::getTimestamp()
{
    return ctime(&this->Timestamp);
}

// Method to send a friendship request
void Relationship::sendRequest()
{
    this->status = "pending";
    cout << "Friendship request sent from " << user1.getUsername() << " to " << user2.getUsername() << endl;
}
// Method to accept a friendship request
void Relationship::acceptRequest()
{
    this->status = "accepted";
    cout << "Friendship request accepted between " << user1.getUsername() << " and " << user2.getUsername() << endl;
}
// Method to reject/remove a friendship request
void Relationship::rejectRequest()
{
    this->status = "rejected";
    cout << "Friendship request rejected between " << user1.getUsername() << " and " << user2.getUsername() << endl;
}

// Function to display relationship details
void Relationship::displayRelationshipDetails()
{
    cout << "Relationship ID: " << RelationshipID << endl;
    cout << "User 1: " << user1.getUsername() << endl;
    cout << "User 2: " << user2.getUsername() << endl;
    cout << "Status: " << status << endl;
    cout << "Timestamp: " << ctime(&Timestamp) << endl;
}