# IoT Party UI 
This project was carried out by eight students at Linköping University as a part of our Bachelor project and is licensed under MIT.

The purpose of the UI is to host an instance that a player can connect to. The instance then handles all the game related part of the project. This includes rendering the players, checking collisions and handling the Controller sensor data.

When creating an instance the host of the party can set it up by changing a few parameters. This includes the instance name, which gamemode is being played and how many players are allowed.

# Browser Support
Most of the development was made using Google Chrome and Mozilla Firefox. As such we currently encourage the user to use one of these two browsers when running the game for the best experience. 
Other browsers might be supported but we have not gone out of our way to test them.

# Dependencies 
In order to run the game for this project the user need four different repositories which are listed below:
* [Server](https://github.com/TDDD96-PUM-Grupp1/server) - This runs the deepstream server that handles the network connections.
* [UI](https://github.com/TDDD96-PUM-Grupp1/ui) - This hosts the Javascript files for the UI.
* [Controller](https://github.com/TDDD96-PUM-Grupp1/services) - This hosts the Javascript files for the Controller.
* [Services](https://github.com/TDDD96-PUM-Grupp1/services) - This hosts services that handles all instances that are currently running, this makes it possible to run multiple instances of the UI.

The corresponing setup is described in their respective GitHub repositories.

# Installation
The instructions will be using yarn as package manager. See [npm vs yarn chear sheet](https://shift.infinite.red/npm-vs-yarn-cheat-sheet-8755b092e5cc) for npm equivalents.

To download and install all the Javascript packages run these commands in your prefered terminal:

```
git clone git@github.com:TDDD96-PUM-Grupp1/ui.git
yarn
```

If you cannot use ssh to clone the repository you can use the https command instead:
```
git clone https://github.com/TDDD96-PUM-Grupp1/ui.git
yarn
```

Now that you have the UI and all the needed packages you can host the Javascript files in a few ways depending on your use-case:

## Server using Windows
This will host the Javascript files and connect to a deepstream server at deepstream.&lt;insert domain>
```
yarn start-pc
```

## Locally using Windows
This will host the Javascript files and connect to a deepstream server that is running locally within the network.

**NOTE:** This will only work if all the users are on the same network as the hosted files.
```
yarn start-pc-local
```

## Server using Linux
This will host the Javascript files, and connect to a deepstream server at deepstream.&lt;insert domain>
```
yarn start
```

## Locally using Linux
This will host the Javascript files and connect to a deepstream server that is running locally within the network.

**NOTE:** This will only work if all the users are on the same network as the hosted files.
```
yarn start-local
```
