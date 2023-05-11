var map = L.map('map').setView([52.505, 19.5], 7);
var punkty = 0
var zycia = 3

const div_punkty = document.getElementById("punkty")
const div_zycia = document.getElementById("zycia")

div_punkty.innerHTML+=punkty
div_zycia.innerHTML+=zycia

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

map.dragging.disable(); 
map.scrollWheelZoom.disable();

console.log(wojewodztwa)

// Dodanie warstwy województw do mapy
var wojewodztwaLayer = L.geoJSON(wojewodztwa.features).addTo(map);

// Funkcja losująca województwo
function losujWojewodztwo() {
  // Pobranie wszystkich województw z warstwy
  var wojewodztwa = wojewodztwaLayer.getLayers();

  // Wylosowanie jednego województwa
  var wylosowaneWojewodztwo = wojewodztwa[Math.floor(Math.random() * wojewodztwa.length)];

  // Zwrócenie nazwy wylosowanego województwa
  return wylosowaneWojewodztwo.feature.properties.nazwa;
}

// Wywołanie funkcji losującej województwo
var wylosowane = losujWojewodztwo();

document.getElementById("wojewodz").innerHTML = "Kliknij Województwo: " + wylosowane

function rysujTraseDoPoprawnegoWojewodztwa(kliknieteWojewodztwo) {
    // Pobranie koordynat klikniętego województwa
    var kliknieteWojewodztwoLayer = wojewodztwaLayer.getLayers().find(layer => layer.feature.properties.nazwa === kliknieteWojewodztwo);
    var kliknieteWojewodztwoCoords = kliknieteWojewodztwoLayer.getBounds().getCenter();
  
    // Pobranie koordynat poprawnego województwa
    var poprawneWojewodztwoLayer = wojewodztwaLayer.getLayers().find(layer => layer.feature.properties.nazwa === poprawneWojewodztwo);
    var poprawneWojewodztwoCoords = poprawneWojewodztwoLayer.getBounds().getCenter();
  
    // Utworzenie obiektu z punktami końcowymi trasy
    var points = [
      L.latLng(kliknieteWojewodztwoCoords.lat, kliknieteWojewodztwoCoords.lng),
      L.latLng(poprawneWojewodztwoCoords.lat, poprawneWojewodztwoCoords.lng)
    ];
}




wojewodztwaLayer.on('click', function(e) {
    var kliknieteWojewodztwo = e.layer.feature.properties.nazwa;

    if (kliknieteWojewodztwo === wylosowane) {
        punkty++
        div_punkty.innerHTML= `Punkty: ${punkty}`
        alert(`Gratulacje, Zdobywasz Punkt, Masz ${punkty} punkt`);

        console.log(wylosowane)
    } else {
        var poprawneWojewodztwo = wylosowane;
        var poprawnyLayer = wojewodztwaLayer.getLayers().find(layer => layer.feature.properties.nazwa === poprawneWojewodztwo);
        var kliknietyLayer = e.layer;
    
        var latlngs = [
          poprawnyLayer.getBounds().getCenter(),
          kliknietyLayer.getBounds().getCenter()
        ];
        var polyline = L.polyline(latlngs, {color: 'red'}).addTo(map);
    
    

        zycia-=1
        div_zycia.innerHTML= `Zycia: ${zycia}`
        alert(`Niestety, spróbuj jeszcze raz. Zostały ci ${zycia} zycia`);
        wylosowane = losujWojewodztwo();
        console.log(wylosowane)
        if(zycia == 0){
            document.getElementById("body").innerHTML = ""
            document.getElementById("body").style.backgroundColor = "black"
            document.getElementById("body").style.marginLeft = "500px"
            var game = document.createElement("h1")
            game.setAttribute("id", "koniec")
            game.innerHTML = "Game Over"

            var p = document.createElement("p")
            p.setAttribute("id", "pk")
            p.innerHTML = "Twoja liczba punktów to: " + punkty

            document.getElementById("body").appendChild(game)
            document.getElementById("body").appendChild(p)
        }
    }
    document.getElementById("wojewodz").innerHTML = "Kliknij Województwo: " + wylosowane
  });