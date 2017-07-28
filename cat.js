/*
individual elections are both data and behavior
they should conform to this interface
define an object named "election" which contains fields
* playerName
* opponentName
* regionName
* positionName
* daysLong
* playerStartPercent
* winPercent

object should contain these methods
* {string "name", string "text"}[] getTurnActions(day, playerPercent, event) - return is internal name + text for options. Event may be null.
* string getCurrentEvent(day, playerPercent, pastEvents[]) - return null for no events, else {string internal "name", string external text "text"}
* void onTurnAction(action, day, playerPercent, event, terminal) - print out information (e.g. result of act), adjust variables
*/

var election = 
{
    vars: {},
    playerName : "Player",
    opponentName: "Cat Whiskerton",
    regionName: "CatVille",
    positionName: "Chief",
    daysLong: 10,
    playerStartPercent: 0.3,
    winPercent: 0.5,
    init: function()
    {
        election.vars.pen = 0;
        election.vars.bumper = 0;
        election.vars.abuse = false;
        election.vars.hasDog = false;
        election.vars.hasCat = false;
    },
    outputElectionInformation: function()
    {
        terminal.printText("You are a monster. For some reason, you don't like cats. Now you have to get elected. It is going to be tough.");
        terminal.printText("Your opponent is normal, and likes cats. You are currently down in the polls.");
    },
    getTurnActions: function()
    {
        var actions = null;

        if (currentEvent == null)
        {
            actions =
            [
                {name: "pen", text: "Give out free pens."},
                {name: "bumper", text: "Give out \"DOGZ RULE\" bumper stickers."},
            ];

            if (!election.vars.abuse)
                actions.push({name: "abuse", text: "Claim cats hurt you in your childhood."});

            if (!election.vars.hasDog)
                actions.push({name: "dog", text: "Claim " + election.opponentName + " has a dog."});
        }
        else if (currentEvent == "hascat")
        {
            actions = 
            [
                {name: "notmine", text: "Claim the despicable things are not yours."},
                {name: "nothing", text: "Do nothing and see if it goes away."}
            ];
        }

        return actions;
    },
    getCurrentEvent: function()
    {
        if (Math.random() > 0.8 && !election.vars.hasCat)
        {
            election.vars.hasCat = true;

            return "hascat";
        }

        return null;
    },
    outputEventInformation: function()
    {
        if (currentEvent == "hascat")
        {
            terminal.printText("The media has discovered you have two cats living in your house!");
        }
    },
    onTurnAction: function(action)
    {
        if (action == "abuse")
        {
            election.vars.abuse = true;

            terminal.printText("Voters believed you. Some have recommended you get a therapist.");

            playerPercent += 0.1;
        }

        if (action == "dog")
        {
            election.vars.hasDog = true;

            terminal.printText("The public was amazed, and called for your statement to be checked.");

            if (Math.random() > 0.5)
            {
                terminal.printText("It turned out to be true!");

                playerPercent += 0.15;
            }
            else
            {
                terminal.printText("It turned out to be false. The public is upset you lied.");

                playerPercent -= 0.1;
            }
        }

        if (action == "pen")
        {
            ++election.vars.pen;

            if (election.vars.pen < 4)
            {
                playerPercent += 0.04;

                return false;
            }
            else
            {
                terminal.printText("The public felt you were buying their affection with pens.");

                playerPercent -= 0.07;
            }
        }

        if (action == "bumper")
        {
            playerPercent += 0.02;

            return false;
        }

        if (action == "notmine")
        {
            if (Math.random() > 0.3)
            {
                terminal.printText("The public believed you. Some say " + election.opponentName + " planted them.");

                playerPercent += 0.01;
            }
            else
            {
                terminal.printText("The public did not believe you. They are deeply offended.");

                playerPercent -= 0.15;
            }
        }

        if (action == "nothing")
        {
            if (Math.random() > 0.7)
            {
                terminal.printText("The media got bored and dropped the story.");
            }
            else
            {
                terminal.printText("The media continues to pester you. The public is offended.");

                playerPercent -= 0.06;
            }
        }
    }
};