(function() {
  'use strict';

  angular
    .module('weatherApp')
    .controller('WeatherController', WeatherController);

  WeatherController.$inject = ['$log', 'WeatherFactory'];

  /* @ngInject */
  function WeatherController($log, WeatherFactory) {
    var vm = this;
    //Properties
    vm.title = 'WeatherFactory';
    vm.list = [];
    vm.buttonList = [];
    vm.searchCity = "San Diego";
    vm.city = "Enter a city name!";
    vm.temp = "0.0F";
    vm.humidity = "0%";
    vm.pressure = 0;
    vm.maxTemp = "0.0F";
    vm.minTemp = "0.0F";
    vm.windSpeed = "0 mph";
    vm.latlon = "Lat/Lon:0, 0";
    vm.date;
    vm.time;
    vm.tempFlag = 'F';
    var weather;

    ////////////////
    //Functions

    vm.updateCity = updateCity;
    vm.refreshCity = refreshCity;
    vm.toggleTemp = toggleTemp;

//calculateTemp will return the temp in either Farenheit or
//Celcius dependind on the temp mode set.
    function calculateTemp(tempVal){
      if (vm.tempFlag === 'F') {
        return tempVal.toFixed(2) + "F";
      }
      else {
        return ((tempVal - 32) * 5 / 9).toFixed(2) + 'C';
      }
    }

//This will pull the data out of the response data.
    function extractData(weather) {
      vm.city = weather.name;
      vm.latlon = "Lat/Lon: " + weather.coord.lat + "," + weather.coord.lon;
      vm.temp = calculateTemp(weather.main.temp);
      vm.minTemp = calculateTemp(weather.main.temp_min);
      vm.maxTemp = calculateTemp(weather.main.temp_max);
      vm.humidity = weather.main.humidity + "%";
      vm.pressure = weather.main.pressure;
      vm.windSpeed = weather.wind.speed + " mph";
    }


  //Format a string with leading '0''s
    function pad(num, size) {
      var s = "000000000" + num;
      return s.substr(s.length - size);
    };

//  This wil convert UNIX time to a JS date value, then print the string.
    function crackDate(dateTime) {

      var utcDate = new Date(dateTime * 1000);
      vm.date = pad(utcDate.getMonth() + 1, 2) + "/" + pad(utcDate.getDate(), 2) + "/" + utcDate.getFullYear();
      vm.time = pad(utcDate.getHours(), 2) + ":" + pad(utcDate.getMinutes(), 2) + ":" + pad(utcDate.getSeconds(),2);
    }

    //This get called when the user selects "F" or "C" on the find bar.
    function toggleTemp() {
      if (vm.tempFlag === 'F'){
        vm.tempFlag = 'C';
      }
      else {
        vm.tempFlag = 'F';
      }
      extractData(weather);
    }

//This fucntion gets called when a user clicks one of the store
//city buttons on the UI.
    function refreshCity(cityName){
        vm.searchCity = cityName;
        // console.log(cityName);
        updateCity();
    }

//Not quite testable, but this will call the weather api
//and get the city's weather info...
    function updateCity() {
      WeatherFactory.weatherSearch(vm.searchCity).then(
        function(response) {
          weather = response.data;
          extractData(weather);
          crackDate(weather.dt);
          var cityInfo  = {
            name: vm.city,
            date: vm.date,
            time: vm.time
          }
          vm.list.push(cityInfo);
          for (var index = 0; index < vm.buttonList.length; index++) {
            if (vm.city === vm.buttonList[index]){
              return;  //name alreay in button list, quit!
            }
          }
          vm.buttonList.push(vm.city);
          // console.log(vm.list);
        },
        function(error) {
          $log.error('failure getting weather', error);
        });

//Jsut old code for reference.
    } // end of activate function

    // activate();
    //
    // function activate() {
    //   WeatherFactory.weatherSearch(vm.city).then(
    //     function(response) {
    //       vm.weather = response.data;
    //     },
    //     function(error) {
    //       $log.error('failure getting weather', error);
    //     });
    //   console.log(vm.weather);
    // } // end of activate function


  } //end of main controller
})();
