#include "Notification.h"
#include <iostream>
#include <vector>
#include <string>
#include "User.h"
using namespace std;

// Constructor
Notification::Notification(string msg)
{
    this->message = msg;
}

// Destructor
Notification::~Notification()
{
}

// Notification ID setter
void Notification::setNotificationID(int id)
{
    this->NotificationID = id;
}
// Notification ID getter
int Notification::getNotificationID()
{
    return this->NotificationID;
}

// Message Setter
void Notification::setMessage(string msg)
{
    this->message = msg;
}
// Message Getter
string Notification::getMessage()
{
    return this->message;
}

// Method to add a recipient
void Notification::addRecipient(User *user)
{
    this->recipients.push_back(user);
}
// Method to remove a recipient
void Notification::removeRecipient(User *user)
{
    for (auto it = this->recipients.begin(); it != this->recipients.end(); ++it)
    {
        if (*it == user)
        {
            this->recipients.erase(it);
            break;
        }
    }
}
// Method to get the list of recipients
void Notification::getRecipients()
{
    for (auto it = this->recipients.begin(); it != this->recipients.end(); ++it)
    {
        cout << (*it)->getUsername() << endl;
    }
}

// Timestamp Setter
void Notification::setTimestamp(time_t time)
{
    this->timestamp = time;
}
// Timestamp Getter
char *Notification::getTimestamp()
{
    return ctime(&this->timestamp);
}

// Method to send notification to all recipients
void Notification::sendNotification()
{
    for (auto it = this->recipients.begin(); it != this->recipients.end(); ++it)
    {
        cout << "Sending notification to " << (*it)->getUsername() << ": " << this->message << endl;
    }
}