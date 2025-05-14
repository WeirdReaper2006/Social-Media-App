#include <iostream>
#include <vector>
#include <string>
#include <ctime>
#include "User.h"
using namespace std;

#ifndef NOTIFICATION_H
#define NOTIFICATION_H

class Notification
{
private:
    int NotificationID; // Unique identifier for the notification
    string message;
    vector<User *> recipients; // List of users to notify
    time_t timestamp;          // Time when the notification was created

public:
    // Constructor
    Notification(string msg);

    // Destructor
    ~Notification();

    // Notification ID setter
    void setNotificationID(int id);
    // Notification ID getter
    int getNotificationID();

    // Message Setter
    void setMessage(string msg);
    // Message Getter
    string getMessage();

    // Method to add a recipient
    void addRecipient(User *user);
    // Method to remove a recipient
    void removeRecipient(User *user);
    // Method to get the list of recipients
    void getRecipients();

    // Timestamp Setter
    void setTimestamp(time_t time);
    // Timestamp Getter
    char *getTimestamp();

    // Method to send notification to all recipients
    void sendNotification();
};

#endif