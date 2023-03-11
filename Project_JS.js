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
    },
        'circle-color': [
            'match',
        ['get', 'Interests'],
        'Art', 
        '#629628',
        'Art, Architecture', 
        '#939628',
        'Art, Community', 
        '#963F28',
        'Art, Culture', 
        '#962828',
        'Art, History', 
        '#4DBC00',
        'Art, Mural', 
        '#00BCA0',
        ],
 //use case or match for this line to make categories
    
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
map.addControl(
    new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl:mapboxgl,
        countries: "ca"
    })
);

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
    .setHTML("<b>Address:</b> " + e.features[0].properties.Address + "<br>")
    .addTo(map);
});

//LEGEND SECTION 
//Creating 4 Art legend type categories 
const legendlabels = [
    'Art',
    'Art and Architecture',
    'Art and Community',
    'Art and Culture',
    'Art and History',
    'Art and Mural',
]

const legendcolours = [
   '#629628',
   '#939628',
   '#963F28',
   '#962828',
   '#4DBC00',
   '#00BCA0',
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
