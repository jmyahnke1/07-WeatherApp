//Simple HTTP factory to call the open weather API.

(function() {
  'use strict';

  angular
    .module('weatherApp')
    .factory('WeatherFactory', WeatherFactory); // https://docs.angularjs.org/guide/services

  WeatherFactory.$inject = ['$http', '$q', '$log']; // https://github.com/johnpapa/angular-styleguide/tree/master/a1#manual-annotating-for-dependency-injection

  /* @ngInject */
  function WeatherFactory($http, $q, $log) {

    var service = {
      weatherSearch: weatherSearch
    };
    return service;

    function weatherSearch(city) {
      console.log("*****   Weather Search!!  ******");
      console.log("City name is " + city);
      var defer = $q.defer();
      var url = 'http://api.openweathermap.org/data/2.5/weather?q={"' + city + '"}&APPID=376d463f52ce2729d995a8df315d1759'

      console.log(url);
      $http({
          method: "GET",
          url: url,
          params: {
          mode: 'json',
          units: 'imperial'
          }
        }) // end of http
        .then(
          function(response) {
            if (typeof response.data === 'object') {
              defer.resolve(response);
              toastr.success('We have weather!');
              console.log(response);
            } else {
              defer.reject(response);
              toastr.warning('no weather found<br/>' + response.config.url);

            }
          },
          // failure
          function(error) {
            defer.reject(error);
            $log.error(error);
            toastr.error('error: ' + error.data + '<br/>status: ' + error.statusText);
          });
      return defer.promise;
    }
  }
})();
