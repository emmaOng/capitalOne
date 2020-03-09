
var x = document.getElementById("location_message");
window.onload = function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(findBusinesses);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function findBusinesses(position) {
  var lat = position.coords.latitude; 
  var lon = position.coords.longitude;
  var myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer YOUR_API_KEY");

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  fetch("https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=food&latitude="+lat+"&longitude="+lon+"&radius=12000&limit=8 &sort_by=rating&price=1&open_now=true", requestOptions)
    .then(response => response.text())
    .then(results => {
        return JSON.parse(results)})
    .then(data => {
        var mainContainer = document.getElementById("business_list");
        for (var i = 0; i < data.businesses.length; i++) {
            var tr = document.createElement("tr")
            var td = document.createElement("td")
            td.innerHTML = data.businesses[i].name;
            var td2 = document.createElement("td")
            td2.innerHTML = (data.businesses[i].rating).toString()+"/5"
            var td3 = document.createElement("td")
            for (var j = 0; j < data.businesses[i].categories.length; j++) {
              if (j == data.businesses[i].categories.length - 1) {
                td3.innerHTML += data.businesses[i].categories[j].alias
              } else {
                td3.innerHTML += data.businesses[i].categories[j].alias + ", "
              }}
            mainContainer.appendChild(tr);
            tr.appendChild(td);
            tr.appendChild(td2);
            tr.appendChild(td3);
        }
        var positions_list = [];
        for (let i = 0; i < data.businesses.length; i++) {
            let innerList = []
            innerList.push(data.businesses[i].coordinates.latitude, data.businesses[i].coordinates.longitude, data.businesses[i].location)
            positions_list.push(innerList)
            }
        {
                var lat = position.coords.latitude; 
                var lon = position.coords.longitude;
                var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 13,
                center: new google.maps.LatLng(lat,lon),
                mapTypeId: 'roadmap'
            }); 
            
                var marker, i;
            
                for (i = 0; i < positions_list.length; i++) {
                    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(positions_list[i][0],positions_list[i][1]),
                        map: map
                    });
          
                }
            }
        
    }
    )
    
    .catch(error => console.log('error', error));

}

  