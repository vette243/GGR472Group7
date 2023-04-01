//Adding mapbox token 
mapboxgl.accessToken = 'pk.eyJ1IjoiaGVpc2VuemlsbGEiLCJhIjoiY2xjcXlmaHlqMGE5eTNwbjJsZDhxODhpMSJ9.Ib4qz6M3pZ7pBDGXJr8DiA';

//Adding basemap 
const map = new mapboxgl.Map({
    container: 'cult_attract',
    style: 'mapbox://styles/heisenzilla/clf059ulv001l01p696vyh7ks',
    center: [-79.347015, 43.651070],
    zoom: 9,
})

//Adding GEOJSON source section
map.on('load', () => {

    map.addSource('Cultural_Attract', {
        type: 'geojson',
        data: 'https://gabcalayan.github.io/Project_Code/points-of-interest.geojson',
        'generateId': true
    });

    //add my TTC subway GeoJSON source.
    map.addSource('ttc-subway-lines', {
        type: 'geojson',
        data: 'https://zs106.github.io/ggr472lab2/ttc-subway-system.geojson'

    });

    map.addSource('ttc-subway-stations', {
        type: 'geojson',
        data: 'https://zs106.github.io/ggr472datasources/ttc_subway_stations.geojson'

    });
    //add Big parks' source
    map.addSource('Large-Park', {
        type: 'geojson',
        data: 'https://vette243.github.io/Lab3_GGR472/Green_Spaces.geojson'
    }
    )



    //Drawing GEOJSON CULTURAl POINTS as circles
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
        },
        'filter': ['any',
            ['==', ['get', 'Interests'], 'Art'],
            ['==', ['get', 'Interests'], 'Art, Architecture'],
            ['==', ['get', 'Interests'], 'Art, Community'],
            ['==', ['get', 'Interests'], 'Art, Culture'],
            ['==', ['get', 'Interests'], 'Art, History'],
            ['==', ['get', 'Interests'], 'Art, Mural']]
    });

    //Drawing the CULTURAL POINT label layers for my filtered data
    map.addLayer({
        'id': 'Cu_At_Labels',
        'type': 'symbol',
        'source': 'Cultural_Attract',
        'layout': {
            'text-field': ['step',
                ['zoom'], "", 12, ['get', 'SiteName']],
            'text-variable-anchor': ['bottom'],
            'text-radial-offset': 0.5,
            'text-justify': 'auto'
        },
        'paint': {
            'text-color': 'black',
        },

        'filter': ['any',
            ['==', ['get', 'Interests'], 'Art'],
            ['==', ['get', 'Interests'], 'Art, Architecture'],
            ['==', ['get', 'Interest'], 'Art, Community'],
            ['==', ['get', 'Interest'], 'Art, Culture'],
            ['==', ['get', 'Interests'], 'Art, History'],
            ['==', ['get', 'Interests'], 'Art, Mural']]

    });

    //draw TTC system map geometry as lines.
    map.addLayer({
        'id': 'ttcsubwaylineslayer',
        'type': 'line',
        'source': 'ttc-subway-lines',
        'paint': {
            'line-color': [
                'interpolate', ['linear'], ['get', 'RID'],
                1,
                '#f8c300',
                2,
                '#00923f',
                3,
                '#0082c9',
                4,
                '#a21a68'
            ],
            //'line-color': '#ff69b4', default color
            'line-width': 3
        }
    });

    map.addLayer({
        'id': 'ttcsubwaystationslayer',
        'type': 'circle',
        'source': 'ttc-subway-stations',
        'paint': {
            'circle-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                8, 2,
                12, 6
            ],

            //'circle-radius': 5,
            'circle-color': 'red'
        }
    });

//Draw polygon parks' polygon
    map.addLayer({
         'id': 'Large-Park',
         'source': 'Large-Park',
         'type': 'fill',
         'layout': {},
         'paint':{
            'fill-opacity': 0.5,
            'fill-color': 'green'
         }      
    })
})
;

//INTERACTIVE SECTION 

//Adding the search control to the map 
const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
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





//// do the similar thing for the click Popup for the subway station layers points
map.on('click', 'ttcsubwaystationslayer', (e) => {
    // Copy coordinates array, station name, subway lines.
    const coordinates = e.features[0].geometry.coordinates.slice();
    const name = e.features[0].properties.station;
    const line = e.features[0].properties.line; 
    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }
    
    new mapboxgl.Popup()//Popup the target message.
    .setLngLat(coordinates)
    .setHTML('Station Name: ' + name + ' <br />Subway Line: ' + line)
    .addTo(map);
});
     
    // Change the cursor to a pointer when the mouse is over the places layer.
map.on('mouseenter', 'ttcsubwaystationslayer', () => {
    map.getCanvas().style.cursor = 'pointer';
});
     
    // Change it back to a pointer when it leaves.
map.on('mouseleave', 'ttcsubwaystationslayer', () => {
    map.getCanvas().style.cursor = '';
});






//LEGEND SECTION 
//Creating 1 Art legend type categories with additional categories such as SUBWAY LINES AND STATIONS, and TORONTO PARKS
const legendlabels = [

    'Public Art',
    'Subway Lines:',
    ''+'LINE 1 (YONGE-UNIVERSITY)',
    ''+'LINE 2 (BLOOR - DANFORTH)',
    ''+'LINE 3 (SCARBOROUGH)',
    ''+'LINE 4 (SHEPPARD)',
    '',
    "Subway Stations",
    'Large Parks'

]
//Creating the legend colors for each of the categories that we have made above 
const legendcolours = [
    'black',
    '',
    '#f8c300',
    '#00923f',
    '#0082c9',
    '#a21a68',
    '',
    'red',
    '#0080ff'
]

//Calling the legend from my HTML page 
const legend = document.getElementById('legend');

legendlabels.forEach((label, i) => {
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
//Change display of legend based on check box

let legendcheck = document.getElementById('legendcheck');

legendcheck.addEventListener('click', () => {
    if (legendcheck.checked) {
        legendcheck.checked = true;
        legend.style.display = 'block';
    }
    else {
        legend.style.display = "none";
        legendcheck.checked = false;
    }
});
//VORONOI LAYER CHECK 
let layer1check=document.getElementById('voron-fill');


    layer1check.addEventListener('change', (e) => {
        map.setLayoutProperty(
            'voron-fill',
            'visibility',
            e.target.checked ? 'visible' : 'none'
        );
});

//BUFFER LAYER CHECK 
let layer6check=document.getElementById('input-pnts');


    layer6check.addEventListener('change', (e) => {
        map.setLayoutProperty(
            'input-pnts',
            'visibility',
            e.target.checked ? 'visible' : 'none'
        );
});

//Distance LAYER CHECK 
let layer7check=document.getElementById('distanceptslayer');


    layer7check.addEventListener('change', (e) => {

        map.setLayoutProperty(
            'distanceptslayer',
            'visibility',
            e.target.checked ? 'visible' : 'none'
        );
        
        distancegeojson  = {
            'type': 'FeatureCollection',
            'features': []
        };

});

//CULTURAL POINTS LAYER CHECK
let layer2check=document.getElementById('Cu_At_Points');


    layer2check.addEventListener('change', (e) => {
    map.setLayoutProperty(
        'Cu_At_Points',
        'visibility',
        e.target.checked ? 'visible' : 'none'
    );
});
//TTC SUBWAYS LAYER CHECK
let layer3check=document.getElementById('ttcsubwaylineslayer');


    layer3check.addEventListener('change', (e) => {
    map.setLayoutProperty(
        'ttcsubwaylineslayer',
        'visibility',
        e.target.checked ? 'visible' : 'none'
    );
});
//TTC STATIONS LAYER CHECK
let layer4check=document.getElementById('ttcsubwaystationslayer');


    layer4check.addEventListener('change', (e) => {
    map.setLayoutProperty(
        'ttcsubwaystationslayer',
        'visibility',
        e.target.checked ? 'visible' : 'none'
    );
});
//TORONTO PARKS LAYER CHECK
let layer5check=document.getElementById('Large-Park');


    layer5check.addEventListener('change', (e) => {
    map.setLayoutProperty(
        'Large-Park',
        'visibility',
        e.target.checked ? 'visible' : 'none'
    );
});



//GIS ANALYSIS SECTION 

//VORONOI SECTION 

let cultural_points;
//USING FETCH METHOD FOR MY CULTURAL POINTS
fetch('https://gabcalayan.github.io/Project_Code/points-of-interest.geojson')
    .then(response => response.json())
    .then(response => {
        cultural_points = response;
});
//LOADING THE BBOX for my CULTURAL POINTS 
map.on('load', () => {
    let bbox = turf.envelope(cultural_points);
    const voronoiPolygons = turf.voronoi(cultural_points, bbox);
//CREATING AN EMPTY VARIABLE FOR MY VORONOI 
let voronoigeojson = {
    "type": "FeatureCollection",
    "features": []
};
//CREATING THE VORONOI POLYGONS TO THAT EMPTY VARIABLE
voronoiPolygons.features.forEach((feature) => {
    if (feature != null) {
        let featurePush = {
            "type": "Feature",
            "properties": feature.properties,
            "geometry": feature.geometry
        }
        voronoigeojson.features.push(featurePush);
    }
});
//ADDING VORONOI POLYGON SOURCE 
map.addSource('voronoi-poly', {
    type: 'geojson',
    data: voronoigeojson
});
//ADDING THE VORONOI LAYER 
map.addLayer({
    'id':'voron-fill',
    'type': 'fill',
    'source': 'voronoi-poly',
    'paint': {
        'fill-color': 'grey',
        'fill-opacity': 0.3,
        'fill-outline-color': 'black'
    }
});

});


//buffer section

//Create empty GeoJSON objects to hold point features
/*--------------------------------------------------------------------
STORE USER INPUT FEATURES AS GEOJSON
--------------------------------------------------------------------*/

// Create empty GeoJSON objects to hold point features
let geojson = {
    'type': 'FeatureCollection',
    'features': []
};

//Set data source and style on map load
map.on('load', () => {
    //Add datasource using GeoJSON variable
    map.addSource('inputgeojson', {
        type: 'geojson',
        data: geojson
    });

    //Set style for when new points are added to the data source
    map.addLayer({
        'id': 'input-pnts',
        'type': 'circle',
        'source': 'inputgeojson',
        'paint': {
            'circle-radius': 2,
            'circle-color': 'blue'
        }
    });

});

//Add input features to data source based on mouse click and display in map
map.on('click', (e) => {
    //Store clicked point as geojson feature
    const clickedpoint = {
        'type': 'Feature',
        'geometry': {
            'type': 'Point',
            'coordinates': [e.lngLat.lng, e.lngLat.lat]
        }
    };

    //Add clicked point to previously empty geojson FeatureCollection variable
    geojson.features.push(clickedpoint);

    //Update the datasource to include clicked points
    map.getSource('inputgeojson').setData(geojson);

});

/*--------------------------------------------------------------------
STORE USER INPUT FEATURES AS GEOJSON
--------------------------------------------------------------------*/

let bufferAdded =false;
document.getElementById('buffbutton').addEventListener('click', () => {
    if (!bufferAdded){
         //Create empty featurecollection for buffers
        buffresult = {
         "type": "FeatureCollection",
         "features": []
    };

    //Loop through each point in geojson and use turf buffer function to create 0.5km buffer of input points
    //Add buffer polygons to buffresult feature collection
    geojson.features.forEach((feature) => {
        let buffer = turf.buffer(feature, 0.4);
        buffresult.features.push(buffer);
    });

    map.addSource('buffgeojson', {
        "type": "geojson",
        "data": buffresult  //use buffer geojson variable as data source
    })

    //Show buffers on map using styling
    map.addLayer({
        "id": "inputpointbuff",
        "type": "fill",
        "source": "buffgeojson",
        "paint": {
            'fill-color': "blue",
            'fill-opacity': 0.2,
            'fill-outline-color': "black"
        }
    });

    bufferAdded=true;
    }else{
     map.removeLayer("inputpointbuff");
     map.removeSource("buffgeojson");
     bufferAdded=false;
}
    document.getElementById('buffbutton').disabled = false; //disable  button after click



});




//Distance section

//Create empty GeoJSON objects to hold point features
/*--------------------------------------------------------------------
STORE USER INPUT FEATURES AS GEOJSON
--------------------------------------------------------------------*/
const distancePanel= document.getElementById('dp');
const distanceContainer = document.getElementById('distance');
const distanceCheck = document.getElementById('distanceptslayer');
const distance = 0;

// Create empty GeoJSON objects to hold point features
let distancegeojson  = {
    'type': 'FeatureCollection',
    'features': []
};

let emptygeojson = {
    'type': 'FeatureCollection',
    'features': []
};
//Set data source and style on map load
map.on('load', () => {
    //Add user points GeoJSON
    map.addSource('distancepts', {
        type: 'geojson',
        data: distancegeojson
    });

    //draw the user points.
    map.addLayer({
        'id': 'distanceptslayer',
        'type': 'circle',
        'source': 'distancepts',
        'paint': {
            'circle-radius': 7,
            'circle-color': '#3bb2d0'
        }
    });
    

});

//Add input features to data source based on user mouse click and display in map
map.on('click', (e) => {
    if (distanceCheck.checked){//only applied when the distance layer/analysis is checked
        distanceContainer.innerHTML = '';//initialize HTML properties.

        if(distancegeojson.features.length > 1){//restrict to only 2 points, otherwise reset the user database
            distancegeojson  = {
                'type': 'FeatureCollection',
                'features': []
            };
        }

        //Store user clicked point as geojson feature
        const distancepoint = {
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': [e.lngLat.lng, e.lngLat.lat] //store location
            }
            
        };

        //Add clicked point to previously empty geojson.
        distancegeojson.features.push(distancepoint);

        //Update the datasource to include user clicked points
        map.getSource('distancepts').setData(distancegeojson);
        
        //initialize the text message
        const value = document.createElement('pre');
        const distance = turf.distance(distancegeojson.features[0], distancegeojson.features[1], 'kilometers');//apply distance turf.js analysis
        //const distance = turf.length(linestring); //to be implemented in the future if available.
        value.textContent = `The distance is ${distance.toLocaleString()}km`;//set text message.
        distanceContainer.appendChild(value);//add to the styled container.
    }else{
        distanceContainer.removeChild;
    }
    

});

//below is to ensure the distance layer get reset if the distance layer is unchecked, 
//to avoid it running in the background.
distanceCheck.addEventListener('click', () => {//dafault box is checked, initialize the layer.
    if (distanceCheck.checked) {
        distanceCheck.checked = true;
        distanceContainer.style.display = 'block';
        distancePanel.style.display = 'block';
        map.addSource('distancepts', {
            type: 'geojson',
            data: distancegeojson
        });
        //Set style for when new points are added to the data source
        map.addLayer({
            'id': 'distanceptslayer',
            'type': 'circle',
            'source': 'distancepts',
            'paint': {
                'circle-radius': 7,
                'circle-color': '#3bb2d0'
            }
        });
    }
    else {//when unchecked, remove all variables related to the distance layer.
        distanceContainer.style.display = "none";
        distancePanel.style.display = 'none';
        distanceCheck.checked = false;
        //distancegeojson = emptygeojson;
        map.removeLayer('distanceptslayer');
        map.removeSource('distancepts');
    }
});


