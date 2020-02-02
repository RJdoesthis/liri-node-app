require("dotenv").config();

let keys = require("./keys.js");
let Spotify = require('node-spotify-api'); //Using the Spotify api and getting the key from keys.js
let spotify = new Spotify(keys.spotify);
let moment = require('moment'); //Both required to use moment for node
moment().format();
let axios = require('axios'); //To get the information from the APIs for movie and concert-this
let fs = require('fs'); //To read the random.txt file for the do-what-it-says function

let command = process.argv[2]; //For the switch statement
let value = process.argv.slice(3).join(","); //To send the song/movie/concert to their respective functions//TODO improve ux


function getUserInput(command, value) {
    switch (command) {
        case "concert-this":
            concertThis(value);
            break;
        case "spotify-this-song":
            spotifySong(value);
            break;
        case "movie-this":
            movieThis(value);
            break;
        case "do-what-it-says":
            doThis(value);
            break;
        //default case to use inquirer
    };
}
getUserInput(command, value);

function concertThis(value) {
    let url = "https://rest.bandsintown.com/artists/" + value + "/event?app_id=codingbootcamp";
    console.log(url);
    axios.get(url).then(
        function (response) {
            console.log(response[1]);

            "----------------------------Concert Info----------------------------------------"
            console.log("Venue Name: " + response.data[0].venue.name);
            console.log("Venue Location: " + response.data[0].venue.city);
            //  console.log(Date of the Event: " + moment(dateArr[0], "YYYY-MM-DD").format("MM-DD-YYYY");

        })
        .catch(function (error) {
            console.log(error);
        });


}

function spotifySong(value) {
    if (!value) {
        value = "The Sign";
    }
    console.log('THE VALUE IS:', value)
    spotify
        .search({
            type: 'track',
            query: value
        })
        .then(function (response) {
            console.log(response)
            for (let i = 0; i < 3; i++) {
                spotifyResults =
                    "--------------------------------Spotify Info------------------------------------" +
                    "\nArtist(s): " + response.tracks.items[i].artists[0].name +
                    "\nSong Name: " + response.tracks.items[i].name +
                    "\nAlbum Name: " + response.tracks.items[i].album.name +
                    "\nPreview Link: " + response.tracks.items[i].preview_url;

                console.log(spotifyResults);
            }
        })
        .catch(function (err) {
            console.log(err);
        });
}

function movieThis(value) {
    if (!value) {
        value = "mr nobody";
    }
    axios.get("https://www.omdbapi.com/?t=" + value + "&y=&plot=short&apikey=trilogy")
        .then(function (response) {
            let movieResults =
                "-----------------------------Movie Info---------------------------------------" +
                "\nMovie Title: " + response.data.Title +
                "\nYear of Release: " + response.data.Year +
                "\nIMDB Rating: " + response.data.imdbRating +
                "\nRotten Tomatoes Rating: " + response.data.Ratings[1].Value +
                "\nCountry Produced: " + response.data.Country +
                "\nLanguage: " + response.data.Language +
                "\nPlot: " + response.data.Plot +
                "\nActors/Actresses: " + response.data.Actors;
            console.log(movieResults);
        })
        .catch(function (error) {
            console.log(error);
        });

}

function doThis() {

    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        let dataArr = data.split(',');
        command = dataArr[0];
        value = dataArr[1];
        //console.log(dataArr)
        getUserInput(command, value);

    });
};