SET TARGET=D:\dev\server\apache-tomcat-7.0.8\webapps
SET APPNAME=formcreator.war

grails war
del target\%APPNAME%
move target\formcreator-0.1.war target\%APPNAME%
copy /y target\%APPNAME% %TARGET%
rd /s/q %TARGET%\formcreator