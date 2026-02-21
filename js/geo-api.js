(function () {
  var el = document.getElementById('areaInfo');
  if (!el) return;
  var loadingEl = document.getElementById('areaInfoLoading');
  var geoId = el.getAttribute('data-geo-id');
  if (!geoId) return;
  fetch('https://wft-geo-db.p.rapidapi.com/v1/geo/cities/' + geoId, {
    method: 'GET',
    headers: {
      'x-rapidapi-host': 'wft-geo-db.p.rapidapi.com',
      'x-rapidapi-key': 'df3283eef9msh34e419b051a58cdp1441e0jsnf7afcdb21fd8'
    }
  })
    .then(function (response) { return response.json(); })
    .then(function (result) {
      var data = result.data;
      if (loadingEl) loadingEl.style.display = 'none';
      if (!data) return;
      var cityName = document.getElementById('cityName');
      var population = document.getElementById('population');
      var elevation = document.getElementById('elevation');
      var latitude = document.getElementById('latitude');
      var longitude = document.getElementById('longitude');
      if (cityName) cityName.innerText = data.city + ', ' + data.region;
      if (elevation) elevation.innerText += ' ' + data.elevationMeters + ' Meters above sea level';
      if (latitude) latitude.innerText += ' ' + data.latitude;
      if (longitude) longitude.innerText += ' ' + data.longitude;
      if (population) population.innerText += ' ' + data.population;
    })
    .catch(function (err) {
      if (loadingEl) {
        loadingEl.textContent = 'Unable to load area info';
        loadingEl.style.display = '';
      }
      console.error(err);
    });
})();
