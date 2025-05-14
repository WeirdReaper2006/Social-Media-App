#include <iostream>
#include <vector>
#include <string>
#include <ctime>
#include "User.h"
using namespace std;

#ifndef RELATIONSHIP_H
#define RELATIONSHIP_H

class Relationship
{
private:
    int RelationshipID; // Unique identifier for the friendship
    User user1;
    User user2;
    string status;    // "pending", "accepted", "rejected", "blocked"
    time_t Timestamp; // Timestamp of when the relationship was created

public:
    // Constructor
    Relationship(int id, User *user1, User *user2, string stat);

    // Destructor
    ~Relationship();

    // Relationship ID setter
    void setRelationshipID(int id);
    // Relationship ID getter
    int getRelationshipID();

    // User1 setter
    void setUser1(User *u1);
    // User1 getter
    User getUser1();

    // User2 setter
    void setUser2(User *u2);
    // User2 getter
    User getUser2();

    // Status setter
    void setStatus(string stat);
    // Status getter
    string getStatus();

    // Timestamp setter
    void setTimestamp(time_t ts);
    // Timestamp getter
    char *getTimestamp();

    // Method to send a friendship request
    void sendRequest();
    // Method to accept a friendship request
    void acceptRequest();
    // Method to reject/remove a friendship request
    void rejectRequest();

    // Function to display relationship details
    void displayRelationshipDetails();
};

#endif