# Covid19_Tracker
Shows the latest Covid19 data for each country


// Functionality:
This app extract list of countries by their continent using the following API:
https://github.com/hengkiardo/restcountries

The app then looping over the countries, extracting their country code and compares it to the country code found in "about-corona" API.
Thus, allowing for acquiring spesific data for each country. 
Data shown for each conntry is the number fo confirmed cases, total deaths, critical cases and total recivered.
All data is presented using 'Chart JS' graph.

//Bugs in this app:
- Some of the time the app can't aquire the data and returns an error of "Can't read data of undefined".
Since this only happens occasionally I assume that the issue is with the API itself.

- After you choose a country, it is impossible to check a second country from the picklist and the page needs to be refreshed for a second search.

//Difficulties during this work.
- The most challenging aspect of this project was working with the APi which is blocked by cors
