//Adding mapbox token 
mapboxgl.accessToken = 'pk.eyJ1IjoiaGVpc2VuemlsbGEiLCJhIjoiY2xjcXlmaHlqMGE5eTNwbjJsZDhxODhpMSJ9.Ib4qz6M3pZ7pBDGXJr8DiA';

//Adding basemap 
const map = new mapboxgl.Map ({
    container: 'cult_attract',
    style: 'mapbox://styles/heisenzilla/clf059ulv001l01p696vyh7ks',
    center: [-79.347015, 43.651070],
    zoom: 9,
})

//Adding GEOJSON source 
map.on('load', () => {

map.addSource ('Cultural_Attract', {
    type:'geojson',
    data: 'https://gabcalayan.github.io/Project_Code/points-of-interest.geojson',
    'generateId': true
});

//Drawing GEOJSON point as circles
map.addLayer({
    'id': 'Cu_At_Points',
    'type': 'circle',
    'source': 'Cultural_Attract',
    'paint': {
        'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            9, 1,
            12, 5
        ],
   
        'circle-color': 'black'
 //use case or match for this line to make categories
 },    
       'filter': ['any', 
       ['==', ['get', 'Interests'], 'Art'],
       ['==', ['get', 'Interests'], 'Art, Architecture'],
       ['==', ['get', 'Interests'], 'Art, Community'],
       ['==', ['get', 'Interests'], 'Art, Culture'],
       ['==', ['get', 'Interests'], 'Art, History'],
       ['==', ['get', 'Interests'], 'Art, Mural']]
});
        
//Drawing label layers for my filtered data
map.addLayer ({
    'id':'Cu_At_Labels',
    'type': 'symbol',
    'source': 'Cultural_Attract',
    'layout': {
        'text-field': ['step',
            ['zoom'], "", 12, ['get', 'SiteName']],
        'text-variable-anchor': ['bottom'],
        'text-radial-offset': 0.5,
        'text-justify':'auto'
    },
    'paint':{
        'text-color':'black',
    },
    
    'filter': ['any', 
        ['==', ['get', 'Interests'], 'Art'],
        ['==', ['get', 'Interests'], 'Art, Architecture'],
        ['==', ['get', 'Interest'], 'Art, Community'],
        ['==', ['get', 'Interest'], 'Art, Culture'],
        ['==', ['get', 'Interests'], 'Art, History'],
        ['==', ['get', 'Interests'], 'Art, Mural']]
        
    });

});

//INTERACTIVE SECTION 

//Adding the search control to the map 
const geocoder = new MapboxGeocoder ({
    accessToken: mapboxgl.accessToken,
    mapbox: mapboxgl,
    countries: "ca"
})

document.getElementById('geocoder').appendChild(geocoder.onAdd(map));

//Adding the return to center button 
document.getElementById('returnbutton').addEventListener('click', () => {
    map.flyTo({
        center: [-79.347015, 43.651070],
        zoom: 10,
        essential: true
    });
});


//Adding the zoom and rotation controls in the map 
map.addControl(new mapboxgl.NavigationControl());
//Adding the fullscreen option in the map
map.addControl(new mapboxgl.FullscreenControl());

//Adding simple click event just to check if it works 
map.on('click', 'Cu_At_Points', (e) => {
    console.log(e);
    let Address = e.features[0].properties.Address;
    console.log(Address);
});

//Adding the pop - up click event for my layer 
map.on('mouseenter', 'Cu_At_Points', () => {
    map.getCanvas().style.cursor = 'pointer';
});

map.on('mouseleave', 'Cu_At_Points', () => {
    map.getCanvas().style.cursor = '';
});

map.on('click', 'Cu_At_Points', (e) => {
    new mapboxgl.Popup()
    .setLngLat(e.lngLat)
    .setHTML("<b>Address:</b> " + e.features[0].properties.Address + "<br>" + "<b>Interests:</b> " + e.features[0].properties.Interests + "<br>")
    .addTo(map);
});

//LEGEND SECTION 
//Creating 4 Art legend type categories 
const legendlabels = [
    'Public Art'
]

const legendcolours = [
   'black',
]

//Calling the legend from my HTML page 
const legend = document.getElementById('legend');

legendlabels.forEach((label,i) => {
    const color = legendcolours[i];

    const item = document.createElement('div');
    const key = document.createElement('span');

    key.className = 'legend-key';
    key.style.backgroundColor = color;
    
    const value = document.createElement('span');
    value.innerHTML = `${label}`;

    item.appendChild(key);
    item.appendChild(value);

    legend.appendChild(item);
});
