hungry-much
===========

Hungry Much is a webapp allowing a team to press the hungry button when they want to go and eat.

##API

####GET /users
Fetch a user by his name.

params:

* name: name of the user

returns (user):

    {
        id: integer,
        name: string,
        email: string,
        groups: array({id: integer})
    }


####POST /users
Add a user.

params:

* name [unique]: user name
* email: user email
* groups [optional]: array of group ids

returns (user):

    {
        id: integer,
        name: string,
        email: string,
        groups: array({id: integer})
    }
    
####GET /users/:id
Get info about a single user by id.

returns (user):

    {
        id: integer,
        name: string,
        email: string,
        groups: array({id: integer})
    }

####PUT /users/:id
Change a user.

params:

* name [optional, unique]: user name
* email [optional]: user email

returns (user):

    {
        id: integer,
        name: string,
        email: string,
        groups: array({id: integer})
    }
    
    
####GET /groups
Get a group by its name.

params:

* name: group name

returns (group):

    {
        id: integer,
        name: string,
        admin: integer,
        users: array({id: integer}),
        clicks: integer,
        treshold: integer
    }

####POST /groups
Create a group.

params:

* name: name of the group
* admin: id of administrator of the group
* treshold [optional]: treshold for clicks

returns (group):

    {
        id: integer,
        name: string,
        admin: integer,
        users: array({id: integer}),
        clicks: integer,
        treshold: integer
    }

####GET /groups/:id
Get info about a group by id.

returns (group):

    {
        id: integer,
        name: string,
        admin: integer,
        users: array({id: integer}),
        clicks: integer,
        treshold: integer
    }

####PUT /groups/:id
Change a group.

params:

* name [optional]: string
* admin [optional]: integer
* treshold [optional]: treshold for clicks

returns (group):

    {
        id: integer,
        name: string,
        admin: integer,
        users: array({id: integer}),
        clicks: integer,
        treshold: integer
    }

####POST /groups/:id/users
Add a user to a group.

params:

* userId: user to add

returns (group):

    {
        id: integer,
        name: string,
        admin: integer,
        users: array({id: integer}),
        clicks: integer,
        treshold: integer
    }

####DELETE /groups/:id/users/:userId
Remove a user from a group.

returns (group):

    {
        id: integer,
        name: string,
        admin: integer,
        users: array({id: integer}),
        clicks: integer,
        treshold: integer
    }
    
    
###POST /clicks
Add a click

params:

* userId: the user that clicked
* groupId: the group for this click

returns (click):

    {
        timeStamp: integer,
        group: {
            id: integer
        },
        user: {
            id: integer
        }
    }
