# Wixa
Wixa is a Discord Bot that are made for Effectiveness and Speed
*This bot is already abandoned because there is a newer version in work*

I have been developing it for 3 years. Even though the bot has been in development that long the bot can actually be done in like 3 days, but I have been busy with my school so I abandoned it in the past and now I will be developing this bot again until it's done.

# How To Get Started
#### Wixa have 4 secret enviroment variable

>* DEVS = which consists of discord user ids for user that are developing this bot so that they can use command that can only be used by dev.
>* PREFIX = The prefix the bot will be using.
>* TOKEN = The discord developer token for the bot.

You need to make a .env file that consist of all of the things.

1. Create a ```.env``` file in the folder that contains all the files.
2. Write all the things that are needed in the ```.env``` files like shown below.
   ```
   DEVS=(replace this text and the parenthese with the discord id of the developers using list style formating)
   PREFIX=(replace this text and the parenthese with the prefix that you want the bot to use to run commands)
   TOKEN=(replace this text and the parenthese with the discord TOKEN to login to your bot)
   ```
in the future the ```PREFIX``` might be removed from the ```.env``` files.

Now to run the code you need to
1. Install ```node v12.22.10``` and ```npm 6.14.16```on your computer.
2. Open the folder that contain all the files in the shell and run the following code inside your shell
    ```
    npm install discord.js@12.5.3
    ```
3. Use the same shell with the folders opened in the shell and run the following code
   ```
   node initiate.js
   ```
4. Done! Now the bot should be running correctly
