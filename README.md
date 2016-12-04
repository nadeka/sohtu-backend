# sohtu-backend [![Build Status](https://travis-ci.org/nadeka/sohtu-backend.svg?branch=master)](https://travis-ci.org/nadeka/sohtu-backend) [![Coverage Status](https://coveralls.io/repos/github/nadeka/sohtu-backend/badge.svg?branch=master)](https://coveralls.io/github/nadeka/sohtu-backend?branch=master)

[Link to EB](http://marketingautomation-env.eu-west-1.elasticbeanstalk.com/)

### Setup for development

##### 1. Install Node and PostgreSQL

##### 2. Install dependencies

    npm install

##### 3. Create databases for development and tests

    createdb sohtudev
    createdb sohtutest
    
##### 4. Run migrations in the development database

    npm run migrate
    
All changes to databases are made with migration files. With
this command, Knex looks for migration files that it has not run before
(in the migrations directory) and runs them in the dev database. 

The latest batch of migrations can be rolled back with:

    npm run rollback
    
If you want to rollback all migrations, you need to recreate the dev 
database.    

See also knexfile.js in the project root.
    
##### 5. Add seed data to the development database

    npm run seed     
    
This command deletes all data from the tables and then inserts
seed entries.
 
##### 6. Start the local server

    npm start

Now the app is running on [http://localhost:8000](http://localhost:8000)

### Running tests

    npm run test
    
Tests run migrations and seeds in the test database so you only need to 
make sure the test database exists.
