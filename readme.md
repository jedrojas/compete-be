<!-- Things needed to be installed -->

- Install Node
  - https://nodejs.org/en/download/
- If git and yarn are not installed

  - Install Homebrew
    - https://brew.sh/
  - Install Git
    - $brew install git
  - Install Yarn
    - $brew install yarn

- Install MySQL

  - use following commands to create alias for mysql commands

    - $alias mysql=/usr/local/mysql/bin/mysql
    - $alias mysqladmin=/usr/local/mysql/bin/mysqladmin

  - https://dev.mysql.com/doc/refman/5.7/en/osx-installation-pkg.html

  <!--  -->

<!-- To run the project -->

npm start

<!--  -->

<!-- To run a .ts file -->

npx ts-node <file-path>

<!--  -->

<!-- Clear database and rebuild tables -->

DROP DATABASE compete;
CREATE DATABASE compete DEFAULT CHARSET = utf8mb4 DEFAULT COLLATE = utf8mb4_unicode_ci;
npx ts-node app/config/create-db-tables.ts
npx ts-node app/config/seed-tables.ts

<!--  -->

<!-- Create a new table in DB -->

Create <new_table> model
Create <new_table> controller
Create <new_table> router
Add create table query to create-db-tables.ts
Insert into seed-tables.ts if applicable

<!--  -->

<!-- To open mysql -->

mysql -u root -p

<!--  -->

<!-- resources that might be helpful in the future -->

Building the project:
https://blog.logrocket.com/typescript-with-node-js-and-express/
https://basarat.gitbook.io/typescript/nodejs

<!--  -->
