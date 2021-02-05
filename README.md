# icinga2-mongo-plugin

A simple plugin for Icinga2 checking MongoDB compatible connections.

## Usage

You have to clone the plugin e.g. in the `/usr/lib/nagios/plugins` folder and install it:

```
git clone https://github.com/egodigital/icinga2-mongo-plugin.git
cd icinga2-mongo-plugin
npm install
```

First define a new command:

```
object CheckCommand "check_mongo_connection" {
  command = [ PluginDir + "/icinga2-mongo-plugin/run", "-u", "$mongo_uri$" ]

  vars.mongo_uri = "$host.vars.mongo_uri$"
}
```

Define a Host that uses the `check_mongo_connection` command:

```
object Host "some-mongo-host" {
  import "generic-host"
  
  check_command = "check_mongo_connection"

  vars.mongo_uri = "<YOUR-MONGODB-URI>"
}
```
