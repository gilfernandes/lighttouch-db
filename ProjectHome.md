**LightTouch DB** is a web based tool with which you can create your own online databases. This tool contains two main components:
  * **designer**: component with which you can create your database model, form, table views and your applications.
  * **workbench**: component with which you can perform CRUD operations on the applications you have defined.

The web interfaces for the designer and workbench are both web and Ajax-based.

This tool uses internally a **relational database**, like e.g. Postgres (for storing the internal structures the user design) and **MongoDB** (for the user created databases).

LightTouch DB is a Grails based application which is packaged as a war file. In order to deploy it you will need **Grails 2.0.1** installed.