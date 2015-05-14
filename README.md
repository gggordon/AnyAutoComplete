AnyAutoComplete
---------------

> A plugin created for search suggestions that is more flexible.

Why?
----

> Most search suggestion plugins were very strict, didn't allow users to
> still write naturally while using suggestions, only allowing search
> suggestions to be at the end of input text, AnyAutoComplete solves
> this!

Dependencies
------------

 - -jQuery 2.*

Getting Started
---------------

Use bower

    bower install --save AnyAutoComplete

or Download minified script from GitHub

    https://github.com/gggordon/AnyAutoComplete/blob/master/AnyAutoComplete.min.js

Then Include in html file

    <script type="text/javascript" src="AnyAutoComplete.min.js"></script>

Usage
-----
With jQuery

    $('.suggestion-boxes').anyAutoComplete(options); 

or standalone

    new AnyAutoComplete(divNode, options);

where

    divNode - HTMLInputElement  - textbox node
    options - Object
    =================
    options : {
        dataSource : { //keywords or suggestions
            'Cat 1 Name':[
                'Elem 1',
                'Elem 2'
            ],
            'Cat 2 Name':[
                'Elem 1',
                'Elem 2'
            ]
        }
    }

Enjoy
-----
Enjoy this project and if you have any issues feel free to state them here on github or contribute. 

