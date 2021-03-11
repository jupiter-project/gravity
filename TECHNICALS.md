# Gravity Development Guidelines
This is a document meant to educate and aid developers on the use of the Gravity development framework, providing guidelines on how to customize and further develop it. This guide will be updated as more features are added.

## Basic Info / Stack Description

### What is Gravity?
* Blockchain-powered full-stack web development framework
* Allows for quick app development with data storage on the Jupiter blockchain
* Effectivly encrypts and backs up sensitive information

### What is the Jupiter Blockchain?
* A fork ofo the NXT blockchain.
* NXT blockchain API calls work and perform exactly the same. 
* Reference the [official API Guide](https://nxtwiki.org/wiki/The_Nxt_API) for new blockchain features dev in Gravity

### Stack and required plugin information
* Written in Node
* Check `packages.json` in root directory for dependencies
* Notable deps
  * `Express`: Backend framework that is heavily used in all backend related code
  * `React`: Frontend framework
  * `Bootstrap`: Styling library, mobile compatible
  * `Plop` and `Gulp`: Generate templates and run tasks

### File arrangements
 A typical file arrangement of a Gravity powered app:

Architecture:
  * Model-view-controller (MVC) pattern
  * Clear separation between data mapping, routing and and front-end rendering
  (models, controllers, views/src folders respectively). 

Root Files
  * `Server.js`: 
    * The most important file of the app
    * Glues packages and files together
    * It runs the app based entirely on the contents of the folders detailed above.
    * Modification is not neccessary unless a new package is loaded in the app and it needs to run on every folder.
  * `Package.json`: 
    * Contains all the app dependencies
    * Use `npm install` (or `sudo npm install` if necessary) to install dependencies loccally
    * Don’t edit this file directly - use `npm  install ‘name of package’`
  * `Package-lock.json`: 
    * Generated when running `npm install`. Used for versioning of libraries
  * `Webpack.config.js`:
    * Compiles (or bundles) Gravity's React Components of Gravity into `bundle.js`. 
    * The React Components aren't loaded by the app on page load - `bundle.js` is called and provides the webpage with the components and functions
    * Tells Webpack to load the React Components into `bundle.js`. 
    * Necessary at the moment. Only edit it to do a front-end overhaul
  * `.env` (Important for Development!):
    * Not present in the above screenshot but it is necessary when hosting gravity locally for dev purposes
    * Add it to the root file and name it `.env`
    * Holds the environmental variables needed by the Gravity app
    * These are sensitive data and should not be stored in the code or checked into a repository, but in the server on which the Gravity app runs 
  * `.gravity.js` (Important for Development):
    * Also not present in the above screenshot but it is necessary when developing your app. 
    * It should contain the same variables as the .env file, but on a JSON format. 
    * Allows youo to run some of the commands needed to work on your applications (such as database table creation).
  * `plopfile.js` (Important for Development):
    * Handles file generation based on templates.
  * `Node_modules`
	* These folders is generated when loading packages for the app (via npm install or bower) and contains all the dependency files. You should NOT modify these folders or any of its files in any manner. It contains none of the custom code used by Gravity.
  * `Config`
	* Contains all files related to the general configuration of the app
	* Directly loaded in the server.js file. 
  
#### **Required files for a Gravity app**
* `api.js`: This file contains the general api endpoints that can be used to retrieve data from the blockchain in a general manner. More on this in upcoming sections.
* `controller.js`: This file contains the routing rules that will be employed by the application. For example, they redirect the user 2FA screen when needed or prevent unlogged users to access pages that require authentication.
* `gravity.js`:  This is an extremely important file as it loads the app with all the functions the gravity site will use to record data into the blockchain as well as generating important files for development.
* `_methods`: This file contains certain methods used by the configuration files and that are too large to be placed in the other files without sacrificing code legibility.
* `passport.js`:
  * Contains user authentication rules
  * Passport handles most of the heavy lifting for auth
  * Contains all logic for validating a user on login and storing user information at signup. 
  * API calls to Jupiter:
    * Included during signup
    * Automatically store certain information in the blockchain
    * Perform associated actions (e.x. Generate a user alias in the blockchain)
* `Models`
  * Contains the code related data storage in the blockchain. 
  * The types and number of files contained in this folder depend on the information that you will be storing
  * Each ‘type’ of record should be put in a separate file to keep information properly classified (More on model files in the ‘How to create a record’ section).
  * 3 default files in this folder: 
    * `_model.js`: This is the basic template that every model file is an extension of. BE CAUTIOUS when if editing this file as it will affect data retrieval and organization. 
    * `_validations.js`: 
      * Providea validation rules of the data entered to the blockchain. Because data validation cannot be done at this moment at the blockchain level, validations rules are fed to the `_model.js` file which validates data before it is pushed to Jupiter.
      * Do not edit unless your project needs specific validation rules.
    * `user.js`:
      * Default user model file. When a ‘users’ table is created (more on this in later sections), 
      * Allows for an immediate way to record information from the users of the app such as name, lastname, email, JUP account and other information required such as keys for 2FA authentication.
  * `Public`
    * Contains all public assets that are used and displayed in the Gravity app
      * Styling, images, JS files, and external code that you directly want to reference in your webpage. 
    * The following is a screenshot of what you typically would find inside this folder:
    * Important: The contents in this folder can be directly referenced in your web page as if they were located in the root file. E.x: to reference an image in your page, you can call `/img/name-of-image-file.file-extension`
    * The app uses scss for styling by default and gulp to update all files.
    * The `js` folder contains `bundle.js` which is the front-end react components compiled.  When making a webpage, `/js/bundle.js` is the link file you must add to load your react components.
  * `Src`
    * Contains all the react-components code that the app will use and which will be compiled into the bundle.js file. Inside of it you will find a folder called components which contains all the react components that app will use, including the ones that will retrieve your app data your users. More on this in later sections
  * `Views`
    * **JSX** files for front-end rendering
    * A **layout folder** and a file for each web page that the app will render.  The layout folder would have html code that is rendered in all web pages, for example, a navigation menu and/or footer
    * **HTML objects** with ids specified in `/src/index.jsx` - renders react components for the app

## Development with Gravity
Required Environmental variables
	A number of environmental variables will be required to run alongside your application in order to run your gravity application. This env variables can be generated via the `npm run gravity:db:create` command, which will create a `.env` file with the variables along with a `.gravity.js` file containing a copy of them as well in JSON format. This later file is used by Gravity to run certain commands while your app itself is not running. The `.env` and `.gravity.js` file should be deleted when in production to increase security. In production, use different methods to upload your env variables such as storing them in your `/etc/environment` file.
	The environmental variables required to run a gravity app are the following (Keep them all in uppercase):
* `APPNAME` => This environmental variable can be used to display the name of it throughout your application
* `JUPITERSERVER` => This the url or api address of the jupiter node your app will use to push and retrieve data from the blockchain.
* `APP_ACCOUNT_ADDRESS` => This is a Jupiter address that will represent your app’s data in the Jupiter blockchain. This is the address where you will have to send your JUP to in order for your app to save data.
* `APP_ACCOUNT` => This is the passphrase for the above mentioned account. The passphrase is needed for automation purposes.
* `APP_PUBLIC_KEY` => This is the Jupiter public key associated with the above account. Having makes data recording safer for your app.
* `ENCRYPT_ALGORITHM` => This represents the algorithm used to encrypt your app’s data prior to saving it in the blockchain (2 layer encryption).
* `ENCRYPT_PASSWORD` => This represents used in the encryption process in the above mentioned scenario. It is extremely important to keep this password secure as it cannot be changed. 
* `SESSION_SECRET` => This variable is used by Passport to generate sessions.

With the ENV variables secure, you can retrieve your app’s data blockchain at any point.

## The Frontend

### Customizing the Frontend Style
	 	 	
Gravity uses a combination of **Bootstrap**, **Gulp**, and **jQuery** for custom styles.
* **Bootstrap** - frontend framework that lets us quickly and easily build a beautiful, responsive and interactive web-application. 
* **Gulp**, - take advantage of Bootstrap 4’s custom theming as well as the `sb-admin` theme provided by [startbootstrap.com](startbootstrap.com). The original template files have been included for your convenience.
* **jQuery** and **jQuery.easing** - animation and dynamic website content.

The Bootstrap Theme can be customised using the SCSS files located inside the public folder. These SCSS files are a collection of components used to style the website. 

Here are the contents of the SCSS folder
* `sb-admin.scss` -  this combines all of our various scss files into one main file to be served to the public. 
* The `navbar` folder contains all the style components to customize the header of the page in Gravity. 
* `_variables.scss` sets the colors used throughout the template. Update this and the colors will be updated across all files.
* `_global.scss` - contains all global attributes like the body tag, the height and width calculations of each section, and the `content-wrapper` section
  * `content-wrapper` is where **Gravity’s** body content of the page will be served from.
  * `Navbar` is the top header with the links and navigation.
* `_login.scss` - custom style sheet for the login page.
* `_footer.scss` - controls the style for our footer section, and the 
* `_mixins.scss` - custom variables we can define, and use in other files. The sb-admin.scss is the master file that combines everything into one file so the styles can be served to the website.
* `_utilities.scss` contains custom variables we can use for applying our own sizes and heights.
* `_cards.scss` - custom style for the bootstrap 4 “Cards”component.

Once we have made an alteration to these files, we must run `gulp` inside the root directory of Gravity to re-compile our files and view our changes live.

In addition to the `gulp` command, we can also use `gulp dev` to tell Gulp to watch for any changes, then re-compile everything when the change is detected. It is recommended to run the `gulp dev` command in a separate terminal screen as this will continue the process in the background, then you can open another terminal screen to run `npm start` to review your changes.

If you want to set your own custom styles for gravity, it is recommended to create a `custom.css` file and link it to gravity on the `application.jsx` file inside `views/layout/` Then you can build your own custom css styles to load over-top of the theme files that are already established, this is recommended for quick changes, however for more style control, the SCSS files are the way to go.

We have also included all the original template examples, this way we can easily copy, and paste sections from the template that you wish to your on your site. The examples can be found on the landing page of gravity under the **Getting Started** tab.


## The Backend 
### Data Storage in Gravity
* Information is encrypted and storage in the Jupiter blockchain using the `/nxt?requestType=sendMessage` API call. 
* We use NXT’s existing infrastructure to record data. 
* The method's requirement is to change the file declaring the Gravity constants to expand the data limit on message recording. 
* For Gravity, the data limit was extended to 10 times its default. 

#### **Important concepts:** 
* Each model we store data for need a unique address 
* E.x.: 
  * One address used to record User information
  * Another one for payout information
  * ... and so on and on. 
* Gravity sends a JSON object from the **model address** to the **owner's user address**. 
* The JSON object is **encrypted twice**: 
  * **First**: using an encryption method set by the Gravity app (more on ’Model files’ and Required environmental variables’ sections), 
  * **Second**: by the blockchain itself. 
* As an App Developer, you must assign your app a Jupiter account address.
  * Acts as the **main app database**
  * Stores the **address/passphrase/public key** table info holding data of your models. More on this in the `Gravity Commands` section.

#### **Models**

The `_model.js` file is responsible for validating, sending, retrieving, processing, and updating data from the blockchain.

> Each new model file that is created is or should be an extension of the above file. 

We import libraries that are required in all of our models:
* **Axios**: making network requests, validations (rules and methods)
* **Gravity**: methods for blockchain communication
* **Events**: divide our code into different steps 
 
This file is creatres a Model class that:
  * Exported at the end of the code
  * Requires data (our record’s data object) that comes from the other model files such as User when they are called in other parts of the code.
  * Defines object variables that is used by the system, such as:
    * `model_params`: lists all the parameters this model uses (ignoring any others that might try to be passed)
    * `table` variable: contains the table name we are recording the model data to 
  * 
There are several methods in this file. The most important ones are `verify()`, `create()`, and `update()` which are necessary for the data recording process.
  * `verify()`:
    * Validates data before submission to the blockchain
    * Automatically called inside the `create()` and `update()` methods
    * Works by reading the `validation_rules` variables initialized in the constructor (and properly defined inside the other model files) and comparing them with the values given to us in the data parameter. 
  * `create()` and `update()` are pretty self-explanatory
  
	>`update()` dooes not modify the record created by `create()` but copyies the latest version of that record and updating its values before pushing it to the blockchain. 
	
	This is done because the blockchain data **cannot be deleted** if not set to prunable data.
  * `Gravity`:
    * Retrieves all versions of a record with a specific `Id` number 
    * Sorts from newest to oldest
    * This way we accurately ‘update’ records and always work with the latest version available.
  * `create()`: creates the first instance of a specific record and pushes it to the Jupiter blockchain.
    * Calls `generateId()` to give the first record instance a unique id number. This id number is copied by the `update()` method which pushes all newer versions of the original record.
    * Currently, there is no way to delete data. Future versions of gravity, however, will provide a way for records to be ‘archived’ when they are no longer needed.
 
Edit this file only if you wish to
  * Add global model methods or
  * Modify existing methods.

It is recommended that you create new model (e.x.: `new_model.js`) that **extends** `_model.js` and make your other model files an extension of this one.

### Model files and Data validation
#### **Model files:**
* Represent what a single record in your database looks like and what types of data it holds
* Are extensions of the `_model.js` file we covered in the previous section
* Connect to the **Jupiter blockchain** through that file.

Below is a copy of what our user model (which comes in all versions of gravity) file looks like by default in gravity.

Load the `_model.js` file at the top. The extends Model part of the code next to the class name makes the file an extension of our main model file. The `super()` method is called to pass data to our `_model.js` file to set variables for the object.  

Every model file needs to assign 4 pieces of data through the super method: `model`, `table`, `model_params` and `data`.  

* `model`: the name of the model in form of a string; this is done to help customize error messages and other things with the actual name of the model.  Table represents the name of the table in the database (you app’s address); since all tables of your app are saved in your app address as part of a JSON object, gravity can locate your table by finding the key in the object that matches the string set in the table variable.
* `model_params`: tells gravity exactly what fields are meant to be saved as part of your record. If you try to save an object that has a field not included  in the model_params list, it this field will not be recorded.
* `data`: represents the actual the JSON object data you are trying to save and which will represent your record.  Data whose keys match parameters in the `model_params` list will be added to the this.record variable, which is a JSON object.

### Validation Rules
`this.validation_rules` is an array that holds a list of objects used to make sure the data you want to save meet certain standard you want to keep. The following is an example:

We are providing a **validation rule** for the our record’s **firstname** attribute. `Attribute_name` is a string representation of how you wish this attribute to be represented in validation messages and rules contains the actual validations rules. 

The screenshot shows are we our model’s first name attribute is a **String** data type that is required in order to save the record.  To provide further validation, you would need to assign values to other keys recognized by gravity.

>(See ‘Data validation keys’ section to see supported validation rules).

Finally, after setting all the initiation data for the model in the constructor, we write down all the specific class functions that the model is going to be using in your app. 

Going back to the **User** model seen before, we see that, among other methods, there is a `validPassword()` function that user objects will use to validate passwords during login. 

#### **Data Validation Keys**

The following are all the keys that gravity currently support:
* `required`: If set to true, this means the attribute needs to be entered by the user.
* `dataType`: This indicates what data type the attribute would fall under. Different validation rules would apply depending of the data type. Current types supported are : String, Integer, String, Boolean (attribute can only be true or false or else an error would be raised) and Email(verifies that the attribute value fits and email format). An error will be raised if an unknown dataType is entered. 
* `minLength`: If the datatype of the attribute is String, this indicates the minimum length it should be if added to the requirements hash. An error will be raised if the value of minLength is not an integer or if it is higher than maxLength or if lower than zero..
* `maxLength`: If the datatype of the attribute is String, this indicates the maximum length it should be if added to the requirements hash. An error will be raised if the value of maxLength is not an integer or if lower than minLength or if lower than zero.
* `lessThan`: If the datatype of the attribute is Integer, this indicates the indicates the minimum  value the attribute should be if added to the requirements hash. If added, then the value of the attribute will need to be one number higher than the moreThan parameter. 
* `moreThan`: If the datatype of the attribute is Integer, this indicates the indicates the maximum  value the attribute should be if added to the requirements hash. If added, then the value of the attribute will need to be one number lower than the lessThan parameter. 

> More validation rules will be added as the Gravity project progresses.
	
Model files are automatically generated through the `run npm gravity:app:scaffold` command as detailed in the ‘Gravity Commands’ section but they can be made manually by following the same structure detailed above.

## Authentication
Gravity natively uses the node package **Passport** to handle user authentications inside your gravity app. The `passport.js` file inside the `config` folder contains your signup and login methods and has been customized to work alongside the Jupiter blockchain.

### Routing
#### **Basic routes**
	
Routing in Gravity is handled by the files located in the `controllers` folder. By default, two files will be included out of the box in gravity: `_application.js` and `account.js`. The first file contains all the general routes your Gravity apps starts with for not authenticated users and the basic user authentication routes. The second file contains specific routes for accounts used by users and 2FA setup and authentication. 

In addition to these two default routing files, the `config` folder contains an additional once called `api.js`. This file is extremely important as it provides generic routes that can be used to retrieve, create and update right away after calling for the `npm run gravity:app:scaffold` command and creating the table in Gravity.

As mentioned at the beginning of this guide, Gravity uses **Express** to handle requests and responses to the server. A very basic route would work as follows:

* The above route basically catches all requests made to ‘your-site.com/test’ and returns an object with an object with a key success with true value. The variable app is defined in server.js file and passed to the route file. This route of course will not return a website, just a response object. If you wish for your route to return a page, you would write the code as follows:
* The above code catches requests made to the `/test_page` endpoint. Once the request is captured, we load the code that contains the view for that specific page; in this case, we load `test_page.jsx`. As mentioned previously, React is gravity’s frontend framework and every view file will have the jsx extension. This code is not pure html code however,  so we use the ReactDOMServer library’s `renderToString()` and the React’s `createElement()` methods to convert our jsx file into a React element (assigning attached data to it) and then into a string which will be read as pure html code by the browser. We store this converted string into our page variable and send it as a response back to the client. 


#### **Route permissions**
There are currently three types of non-api Get routes in Gravity:
* routes for pages that can be accessed by anybody (login, signup, and informational pages)
* routes for pages that only required you to be logged in (the 2FA page for example)
* routes for pages that will block the user from accessing them if additional information or clearance is required (for example, if 2FA code is required).This permissions can be found in the `controller.js` file in the `config` folder.

We’ll first mention how to add pages that can be accessed by everyone, which will be referred to as unlogged pages for the remainder of the guide. We’ll cover the other types of GET pages afterwards. 

#### **Unlogged pages and basic route structure**
These are pages that can be accessed without authentication of any kind (about pages, signup, login, etc). Our previous screenshot of our test page code is the perfect example. Let’s break down its components as it shares mostly the same structure as all page loaders in gravity:

The first thing that we will always need to include is the `var messages= req.session.flash` which creates a local variable that will store messages that were stored as a session variable in a previous route (this will occur if a different route redirects to the one you are creating). After writing that line, you will need to clear the session messages by declaring the flash session variable null to make sure this message won’t be displayed after doing so the first time.

As mentioned before, we load our code for the page and return it as a string that read as html by the browser. The JSON object next to `PageFile` is the data that will be attached to this page.  The props that will always be included in every page route are:
* **Name**: The text inside the <title></title> html tags for the page that you will be loading.
* **Dashboard**: Lets the system know if the page about to be rendered requires the user dashboards or info to be displayed automatically(Go to the Front end section for more details). Set to false if this is meant to be an unlogged page. 
* **Messages**: Where we allocate the session messages we previously stored in the  messages variable prior to clearing them. We would render this messages in the front-end when the page is accessed.

#### **Pages that require your to be only logged in**
These are pages whose only requirement for access are to be logged in. Even if a user has 2FA enabled, for example, they would not need to enter a 2FA verification code to access it. An example of this page would be the 2FA authorization page itself. It can be viewed only when the user is logged in but does not require additional verifications to be viewed. The following is the route to the 2FA page:

As you can see, it follows virtually the same steps as the previous **GET** page type, the difference being that a third parameter was added inside the `app.get` function between the endpoint name and the route function. This parameter is also a function. The `controller.onlyLoggedIn` function redirects a request to the root route (‘/’) if there’s no user logged in.  This is a method from the file `config/controller.js` and it is loaded at the top of the route file. 

Additionally, you can see that a new prop was added ‘user’ which contains the information of the user that made the request to that page and is stored in the request itself. Always include user in the props when working on this or the following type of route.

#### **Pages that may require additional verification**
This are the pages where 2fa or any other form of verification should be applied if the user requested those extra security clearances. The format would be identical to the previous one except that you replace the `onlyLoggedIn` function with the `isLoggedIn` function, which verifies:
* the user needs to provide 2FA verification and 2) 
* if that verification has been processed.  

If verification has not been processed, the user would be redirected to the proper verification page until verification is provided.

#### **Which permission to use**
Which permissions you decide to use will depend your situations but, as a rule of thumb, always grant the highest level of permission (`isLoggedIn`) to all pages that are meant to be viewed only by users of your site even if you don’t plan on having them implement 2FA. You can always add 2FA or any other form of authentication later on and use the `onlyLoggedIn` permission to implement any form of verification you want.

Finally, there is also a `isLoggedInIndex` for specific rerouting behaviour from the index page.

#### **Creating new route files**
There are currently two methods that generate route files in Gravity. The first one is the ‘npm run gravity:app:scaffold’ which generates all the files are needed to display a page that will get and save records to and from the database, and the ‘npm run gravity:app:page’ which creates a route file and a view file that matches the route in that file. The following is the full route file that controls that test page we saw earlier:

We display the route code as a function because it is called as such in the `server.js` file, which passes the app object, our **passport** configuration for logged pages and our React libraries for page display. The libraries called before our route are common libraries used throughout Gravity for route handling, including our `controller.js` file and our `gravity.js` file. Not all of this libraries are needed and you are free to add or remove based on your needs.

You can add new routes manually by adding `.js` files inside the controller folder that match the above format and strongly encourage you to learn more about both express and axios, the two libraries most used libraries to handle api calls in Gravity.

#### **Routing order**
By default, the server.js file loads every file in the `controller` folder in alphabetical order, which is why the `_appliction.js` file will always be the first one to run as long as the dash is kept at the beginning. 

The `api.js` routing file mentioned in the previous section is loaded earlier than all the other routes in the system since they are supposed to be used by multiple models within gravity. Those generic routes contain exception lists that tell the system if they are meant to be skipped so that a later route in the load order will pick up the client request.

>Make sure that whatever new route you add to your Gravity app does not conflict with another route earlier in the order. If it does, you will need to write an exception wherever the conflict originates or move your route directly to an earlier load.
