//require .env file
require("dotenv").config();
//link key page;
let keys = require("./key.js");
//initialize spotify
let Spotify = require('node-spotify-api');
let spotify = new Spotify(keys.spotify);
//require file system, moment, axios
let fs = require("fs");
let moment = require("moment");
let axios = require("axios")
//user command input
let command = process.argv[2];
//take in input only
let input = process.argv.slice(3).join("+");

//grab movie from api function from command line command and user input
function movies() {
    if (!input) {
        input = 'Mr. Nobody';
    }
    else if (command === 'movie-this') {
        var queryURL = "https://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=trilogy"; 
        axios.get(queryURL)
        .then(function(response) {
            console.log('Title: ' + response.data.Title);
            console.log('Year: ' + response.data.Year);
            console.log('IMDB rating: ' + response.data.imdbRating)
            const rottenTomatoes = response.data.Ratings[1];
            console.log('Rotten Tomatoes: ' + rottenTomatoes["Value"]);
            console.log('Country made: ' + response.data.Country);
            console.log('Language: ' + response.data.Language);
            console.log('Plot: ' + response.data.Plot);
            console.log('Cast: ' + response.data.Actors);
        })
        .catch(function(err) {
            console.log(err);
        });
    };
};

//grab band play date from api function from command line command and user input
function bands() {
        var bandURL = "https://rest.bandsintown.com/artists/" + input + "/events?app_id=codingbootcamp"
        axios.get(bandURL)
        .then(function(response) {
            console.log("Venue Name: " + response.data[0].venue["name"]);
            console.log("Venue Location: " + response.data[0].venue["city"]);
            let eventDate = response.data[0].datetime;
            let eventDateFormat = moment(eventDate).format('MMM Do YYYY, h:mm a')
            console.log("Date and time: " + eventDateFormat)
        })
        .catch(function(err) {
            console.log(err);
        });
};

//grab artist details from api function from command line command and user input
function spotifySong() {
    spotify
    .search({type: 'track', query: input, limit: 1})
    .then(function(response) {
        // console.log(response.tracks.items[0]);
        console.log('Artist name: ' + response.tracks.items[0].album.artists[0].name);
        console.log('Song name: ' + response.tracks.items[0].name);
        console.log('Preview : ' + response.tracks.items[0].preview_url);
        console.log('Album: ' + response.tracks.items[0].album.name);
    })
    .catch(function(err) {
        console.log(err);
    })
} 

//grab ./random.txt content and place it into spotify function
function doWhat() {
    fs.readFile("./random.txt", "utf8", function(err, data){
        if (err) console.log(err);
        let spotifyThisSong = data.split(",");
        command = spotifyThisSong[0];
        input = spotifyThisSong[1];  
        spotifySong(command, input);
    });
};


//liri app logic
function commandInput(command, input) {
    switch(command) {
        case 'movie-this':
            movies();
            break;
        case 'concert-this':
            bands();
            break;
        case 'spotify-this':
            spotifySong();
            break;
        case 'do-what-it-says':
            doWhat(input);
            break;
        default:
            console.log('Please try again.');
            break;
    }   
}

commandInput(command, input)