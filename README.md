hungry-much
===========

Hungry Much is a webapp allowing a team to press the hungry button when they want to go and eat.

##API

###Types
User:

    {
        id: integer,
        name: string,
        email: string
    }
    
Group:
    
    {
        id: integer,
        name: string,
        admin: integer,
        users: array({id: integer}),
        clicks: integer,
        treshold: integer
    }
    
Click:
    
    {
        timestamp: integer,
        userId: integer,
        groupId: integer
    }
    
###REST

####POST /auth/signup
Add a user.

params:

* name: user name
* email [unique]: user email
* password: user password

returns: User

####POST /auth/signin
Sign in as a user.

params:

* email [unique]: user email
* password: user password

returns: User
  
####GET /auth/signout
Sign out.

---

####GET /users
Fetch a user by his email.

params:

* email: name of the user

returns: User

    
####GET /users/:id
Get info about a single user by id.

returns: User

####PUT /users/:id
Change a user.

params:

* name [optional, unique]: user name
* email [optional]: user email

returns (user):
    
    
####GET /groups
Get a group by its name.

params:

* name: group name

returns: Group

####POST /groups
Create a group.

params:

* name: name of the group
* admin: id of administrator of the group
* treshold [optional]: treshold for clicks

returns: Group

####GET /groups/:id
Get info about a group by id.

returns: Group

####PUT /groups/:id
Change a group.

params:

* name [optional]: string
* admin [optional]: integer
* treshold [optional]: treshold for clicks

returns: Group

####POST /groups/:id/users
Add a user to a group.

params:

* userId: user to add

returns: Group

####DELETE /groups/:id/users/:userId
Remove a user from a group.

returns: Group

####GET /clicks
params:

* groupId: the group
* after: integer

Returns: 

    {
        clicks: Array(CLick)
    }
    
    
###POST /clicks
Add a click

params:

* userId: the user that clicked
* groupId: the group for this click

returns: Click
