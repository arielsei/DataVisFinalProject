let option1Selected = false;
let option2Selected = true;
let sliderElement;
let firstLoad = true;
let topoLayer;
let map;
let resizeTimeout;
const introHeight = 650;
const blockHeight = 350;
let currentBlock = 0;
const highlights = [
    null,
    {
        lat: -66.40414471383308,
        long: -10.418888019117534,
        zoom: 10
    },
    {
        lat: -66.90414471383308,
        long: -10.218888019117534,
        zoom: 11
    },
    {
        lat: -66.00414471383308,
        long: -10.818888019117534,
        zoom: 12
    },
    {
        lat: -67.20414471383308,
        long: -11.118888019117534,
        zoom: 8
    },
    {
        lat: -65.99414471383308,
        long: -10.018888019117534,
        zoom: 7
    }
];

// window.addEventListener(
//     "resize",
//     function() {
//         if (!resizeTimeout) {
//             resizeTimeout = setTimeout(function() {
//                 resizeTimeout = null;
//                 if (option1Selected && !option2Selected) {
//                     let svggMinerias = document.getElementById("svgMinerias");
//                     if (svggMinerias) {
//                         svggMinerias.parentNode.removeChild(svggMinerias);
//                         test();
//                     }
//                 }
//             }, 250);
//         }
//     },
//     true
// );

window.onload = () => {
    const maxBounds = [
        [13.39029, -16.33247], //Southwest
        [-59.450451, -109.47493] //Northeast
    ];
    map = new L.map("map", {
        center: [-12.8, -69.5],
        zoom: 9,
        maxBounds: maxBounds,
        maxBoundsViscosity: 1.0
    });
    const layerOptions = {
        maxZoom: 12,
        minZoom: 5
    };
    const customOption1 = L.Control.extend({
        options: {
            position: "bottomcenter"
        },

        onAdd: function(map) {
            let container = L.DomUtil.get("option1");
            container.onclick = () => {
                option1Selected = !option1Selected;

                if (option1Selected)
                    document
                        .getElementById("option1")
                        .classList.add("selected");
                else
                    document
                        .getElementById("option1")
                        .classList.remove("selected");
                setPopupContent();
            };
            return container;
        }
    });
    const customOption2 = L.Control.extend({
        options: {
            position: "bottomcenter"
        },

        onAdd: function(map) {
            let container = L.DomUtil.get("option2");

            container.onclick = () => {
                option2Selected = !option2Selected;
                if (option2Selected)
                    document
                        .getElementById("option2")
                        .classList.add("selected");
                else
                    document
                        .getElementById("option2")
                        .classList.remove("selected");

                setPopupContent();
            };
            return container;
        }
    });
    L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
        layerOptions
    ).addTo(map);
    option1 = L.DomUtil.get("option1");
    option2 = L.DomUtil.get("option2");
    const corners = map._controlCorners;
    const container = map._controlContainer;
    corners["bottomcenter"] = L.DomUtil.create(
        "div",
        "leaflet-bottom leaflet-horizontal-center",
        container
    );
    map.addControl(new customOption2());
    map.addControl(new customOption1());
    document.getElementById("option2").classList.add("selected");
    setPopupContent();

    L.TopoJSON = L.GeoJSON.extend({
        addData: function(jsonData) {
            if (jsonData.type === "Topology") {
                for (key in jsonData.objects) {
                    geojson = topojson.feature(jsonData, jsonData.objects[key]);
                    L.GeoJSON.prototype.addData.call(this, geojson);
                }
            } else {
                L.GeoJSON.prototype.addData.call(this, jsonData);
            }
        }
    });
    topoLayer = new L.TopoJSON();
    document
        .getElementById("contents")
        .addEventListener("scroll", handleScroll);

    loadMapFile("mineria_1985.geojson.json");

    // readJsonFile("assets/data/mineria_1985.geojson", function(text){
    //     console.log(text);
    //     var data = JSON.parse(text);
    //     console.log(data);
    //     L.geoJSON(data).addTo(map);
    // });
    initializeSlider();
    loadVisualization();
};

function setPopupContent() {
    if (option1Selected && option2Selected) {
        document.getElementById("descriptionsCombined").style.display = "block";
        document.getElementById("descriptionsOption1").style.display = "none";
        document.getElementById("descriptionsOption2").style.display = "none";
    } else if (option1Selected) {
        document.getElementById("descriptionsCombined").style.display = "none";
        document.getElementById("descriptionsOption1").style.display = "block";
        document.getElementById("descriptionsOption2").style.display = "none";
    } else if (option2Selected) {
        document.getElementById("descriptionsCombined").style.display = "none";
        document.getElementById("descriptionsOption1").style.display = "none";
        document.getElementById("descriptionsOption2").style.display = "block";
    } else {
        document.getElementById("descriptionsCombined").style.display = "none";
        document.getElementById("descriptionsOption1").style.display = "none";
        document.getElementById("descriptionsOption2").style.display = "none";
    }
}

function readJsonFile(filename, callback) {
    let rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", filename, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    };
    rawFile.send(null);
}

function initializeSlider() {
    sliderElement = document.getElementById("slider");
    noUiSlider.create(sliderElement, {
        start: 1985,
        step: 8,
        range: {
            min: 1985,
            max: 2017
        }
        // For Scale
        // pips: {
        //     mode: 'steps',
        //     density: 3,
        //     format: wNumb({
        //         decimals: 0
        //     }),
        // }
    });
    sliderElement.noUiSlider.on("update", onSliderUpdate);
}

function onSliderUpdate(values) {
    if (firstLoad) {
        firstLoad = false;
    } else {
        const newValue = parseInt(values[0]);
        fileName = "";
        switch (newValue) {
            case 1985:
                fileName = "mineria_1985.geojson.json";
                break;
            case 1993:
                fileName = "mineria_1993.geojson.json";
                break;
            case 2001:
                fileName = "mineria_2001.geojson.json";
                break;
            case 2009:
                fileName = "mineria_2009.geojson.json";
                break;
            case 2017:
                fileName = "mineria_2017.geojson.json";
                break;
        }
        map.removeLayer(topoLayer);
        loadMapFile(fileName);
    }
}

function loadMapFile(fileName) {
    readJsonFile("assets/data/topolatest/" + fileName, function(text) {
        var data = JSON.parse(text);
        topoLayer = new L.TopoJSON();
        topoLayer.addData(data);
        topoLayer.addTo(map);
        topoLayer.eachLayer(handleLayer);
    });
}

function handleLayer(layer) {
    let colorOfLayer;
    if (layer.feature.properties.MiningType == "HM") {
        colorOfLayer = "#FF3333";
    } else if (layer.feature.properties.MiningType == "SP") {
        colorOfLayer = "#33FF33";
    } else {
        colorOfLayer = "#000000";
    }
    layer.setStyle({
        color: colorOfLayer
    });
}

function handleScroll(event) {
    const scroll = event.srcElement.scrollTop;
    let blockScrolling = scroll - introHeight;
    if (
        scroll ==
        event.srcElement.scrollHeight - event.srcElement.clientHeight
    ) {
        blockScrolling = highlights.length - 1;
    } else {
        if (blockScrolling < 0) {
            blockScrolling = 0;
        } else {
            blockScrolling = parseInt(blockScrolling / blockHeight) + 1;
        }
    }
    if (blockScrolling != currentBlock) {
        if (highlights[blockScrolling]) {
            map.flyTo(
                [
                    highlights[blockScrolling].long,
                    highlights[blockScrolling].lat
                ],
                highlights[blockScrolling].zoom
            );
        }
        elements = document.getElementsByClassName("story-container");
        for (let i = 0; i < elements.length; i++) {
            elements[i].classList.remove("inFocus");
        }
        document
            .getElementById("container" + blockScrolling)
            .classList.add("inFocus");
        currentBlock = blockScrolling;
    }
}

function loadVisualization() {
    // console.log(document.getElementById('descriptionsOption1').offsetWidth);
    //Width and height

    var w = document.getElementById("descriptionsOption2").offsetWidth - 25;
    var h = 300;
    var padding = 35;

    //Tracks view state.  Possible values:
    // 0 = default (areas types)
    // 1 = areas (of one type)
    // 2 = areas (singular)
    var viewState = 0;

    //Tracks most recently viewed/clicked 'type'.  Possible values:
    //"Heavy_Machinery", "Single_Pumps" or undefined
    var viewType;

    var dataset, thisTypeDataset, xScale, yScale, xAxis, yAxis, area; //Empty, for now

    //For converting strings to Dates
    var parseTime = d3.timeParse("%Y-%m");

    //For converting Dates to strings
    var formatTime = d3.timeFormat("%Y");

    //Define key function, to be used when binding data
    var key = function(d) {
        return d.key;
    };

    //Set up stack methods
    var areaStack = d3.stack();
    var typeStack = d3.stack();

    //Load in data
    // console.log(d3);
    d3.request("/assets/data/Visualization.csv")
        .mimeType("text/csv")
        .get(function(response) {
            //
            // DATA PARSING
            //

            //Parse each row of the CSV into an array of string values
            var rows = d3.csvParseRows(response.responseText);
            // console.log(rows);

            //Make dataset an empty array, so we can start adding values
            dataset = [];

            //Loop once for each row of the CSV, starting at row 3,
            //since rows 0-2 contain only area info, not area values.
            for (var i = 2; i < rows.length; i++) {
                //Create a new object
                dataset[i - 2] = {
                    date: parseTime(rows[i][0]) //Make a new Date object for each year + month
                };

                //Loop once for each area in this row (i.e., for this date)
                for (var j = 1; j < rows[i].length; j++) {
                    var sector = rows[0][j];
                    var mining_type = rows[1][j];
                    var mining_type_sector = rows[1][j] + " " + rows[0][j]; //
                    var area_val = rows[i][j];
                    //If area value exists…
                    if (area_val) {
                        area_val = parseInt(area_val); //Convert from string to int
                    } else {
                        //Otherwise…
                        area_val = 0; //Set to zero
                    }

                    //Append a new object with data for this row
                    dataset[i - 2][mining_type_sector] = {
                        mining_type: mining_type,
                        sector: sector,
                        area_val: area_val
                        // "coords": coords
                    };
                }
            }

            //Log out the final state of dataset
            // console.log(dataset);

            //
            //	TYPE DATA SERIES
            //

            //The goal here is to make a totally separate data set that
            //includes just monthly totals for each `type` (Heavy_Machinery, Suction_Pumps).

            //Make typeDataset an empty array, so we can start adding values
            typeDataset = [];

            //Loop once for each row of the CSV, starting at row 3,
            //since rows 0-2 contain only area info, not area values.
            for (var i = 2; i < rows.length; i++) {
                //Create a new object
                typeDataset[i - 2] = {
                    date: parseTime(rows[i][0]), //Make a new Date object for each year
                    Heavy_Machinery: 0,
                    Suction_Pumps: 0
                };

                //Loop once for each area in this row (i.e., for this date)
                for (var j = 1; j < rows[i].length; j++) {
                    var mining_type = rows[1][j]; //'Type' from 2 row in CSV
                    var area_val = rows[i][j]; //area value for this area

                    //If area value exists…
                    if (area_val) {
                        area_val = parseInt(area_val); //Convert from string to int
                    } else {
                        //Otherwise…
                        area_val = 0; //Set to zero
                    }

                    //Add area value to existing sum
                    typeDataset[i - 2][mining_type] += area_val;
                }
            }

            //Log out the final state of dataset
            // console.log(typeDataset);

            //
            // STACKING
            //

            //Tell stack function where to find the keys
            var types = ["Heavy_Machinery", "Suction_Pumps"];
            typeStack.keys(types);

            //Stack the data and log it out
            var typeSeries = typeStack(typeDataset);
            // console.log(typeSeries);

            //
            // MAKE THE CHART
            //

            //Create scale functions
            xScale = d3
                .scaleTime()
                .domain([
                    d3.min(dataset, function(d) {
                        return d.date;
                    }),
                    d3.max(dataset, function(d) {
                        return d.date;
                    })
                ])
                .range([padding, w - padding * 2]);

            yScale = d3
                .scaleLinear()
                .domain([
                    0,
                    d3.max(typeDataset, function(d) {
                        var sum = 0;

                        //Loops once for each row, to calculate
                        //the total (sum) of sales of all areas
                        for (var i = 0; i < types.length; i++) {
                            sum += d[types[i]];
                        }

                        return sum;
                    })
                ])
                .range([h - padding, padding / 2])
                .nice();

            //Define axes
            xAxis = d3
                .axisBottom()
                .scale(xScale)
                .ticks(10)
                .tickFormat(formatTime);

            //Define Y axis
            yAxis = d3
                .axisRight()
                .scale(yScale)
                .ticks(5);

            //Define area generator
            area = d3
                .area()
                .x(function(d) {
                    return xScale(d.data.date);
                })
                .y0(function(d) {
                    return yScale(d[0]);
                })
                .y1(function(d) {
                    return yScale(d[1]);
                });

            //Create SVG element
            var svg = d3
                .select("#chartContainer")
                .append("svg")
                .attr("id", "svgMinerias")
                .attr("width", w)
                .attr("height", h);

            svg.append("g").attr("id", "Areas_ha");

            var showLeggend = function() {
                console.log("TEST!!!!!!");
                svg.append("text")
                    .attr("id", "types")
                    .selectAll("path")
                    .data(typeSeries, key)
                    .enter()
                    .append("path")
                    .attr("text-anchor", "middle") // this makes it easy to centre the text as the transform is applied to the anchor
                    .attr(
                        "transform",
                        "translate(" + padding / 2 + "," + h / 2 + ")"
                    ) // text is drawn off the screen top left, move down and out and rotate
                    .text(function(d) {
                        // console.log(viewType);
                        return d.key;
                    });
            };
            //Create areas for TYPES
            svg.append("g")
                .attr("id", "types")
                .selectAll("path")
                .data(typeSeries, key)
                .enter()
                .append("path")
                .attr("class", "area")
                .attr("opacity", 1)
                .attr("d", area)
                .attr("fill", function(d) {
                    //Which type is this?
                    var thisType = d.key;

                    //New color var
                    var color;

                    switch (thisType) {
                        case "Heavy_Machinery":
                            color = "rgb(95,48,44)";
                            break;

                        case "Suction_Pumps":
                            color = "rgb(69,51,88)";
                            break;
                    }

                    return color;
                })
                .on("click", function(d) {
                    showLeggend();
                    //Update view state
                    viewState++;

                    //
                    // TYPES
                    //

                    //Which type was clicked?
                    var thisType = d.key;

                    //Update this for later reference
                    viewType = thisType;

                    //Generate a new data set with all-zero values,
                    //except for this type's data
                    thisTypeDataset = [];

                    for (var i = 0; i < typeDataset.length; i++) {
                        thisTypeDataset[i] = {
                            date: typeDataset[i].date,
                            Heavy_Machinery: 0,
                            Suction_Pumps: 0,
                            [thisType]: typeDataset[i][thisType] //Overwrites the appropriate zero value above
                        };
                    }

                    // console.log(thisTypeDataset);

                    //Stack the data (even though there's now just one "layer") and log it out
                    var thisTypeSeries = typeStack(thisTypeDataset);
                    // console.log(thisTypeSeries);

                    //Bind the new data set to paths, overwriting old bound data.
                    var paths = d3
                        .selectAll("#types path")
                        .data(thisTypeSeries, key)
                        .classed("unclickable", true);

                    //Transition areas into new positions (i.e., thisType's area
                    //will go to a zero baseline; all others will flatten out).
                    //
                    //Store this transition in a new variable for later reference.
                    var areaTransitions = paths
                        .transition()
                        .duration(1000)
                        .attr("d", area);

                    //Update scale
                    yScale.domain([
                        0,
                        d3.max(thisTypeDataset, function(d) {
                            var sum = 0;

                            //Calculate the total (sum) of sales of this type,
                            //ignoring the others (for now)
                            sum += d[thisType];

                            return sum;
                        })
                    ]);

                    //Append this transition to the one already in progress
                    //(from above).  Transition areas to newly updated scale.
                    areaTransitions
                        .transition()
                        .delay(200)
                        .on("start", function() {
                            //Transition axis to new scale concurrently
                            d3.select("g.axis.y")
                                .transition()
                                .duration(1000)
                                .call(yAxis);
                        })
                        .duration(1000)
                        .attr("d", area)
                        .transition()
                        .on("start", function() {
                            //Make areas visible instantly, so
                            //they are revealed when this fades out
                            d3.selectAll("g#Areas_ha path").attr("opacity", 1);
                        })
                        .duration(1000)
                        .attr("opacity", 0)
                        .on("end", function(d, i) {
                            //Reveal back button
                            if (i == 0) {
                                toggleBackButton();
                            }
                        });

                    //
                    // areas
                    //

                    //Get all possible keys (make + model), but toss out 'date'
                    var keysAll = Object.keys(dataset[0]).slice(1);
                    // console.log(keysAll);

                    //Loop once for each key, and save out just the ones of thisType
                    var keysOfThisType = [];
                    for (var i = 0; i < keysAll.length; i++) {
                        if (dataset[0][keysAll[i]].mining_type == thisType) {
                            keysOfThisType.push(keysAll[i]);
                        }
                    }
                    // console.log(keysOfThisType);

                    //Give the new keys to the stack function
                    areaStack
                        .keys(keysOfThisType)
                        .value(function value(d, key) {
                            return d[key].area_val;
                        });

                    //Stack the data and log it out
                    var areaSeries = areaStack(dataset);
                    // console.log(areaSeries);

                    //Create areas for individual areas
                    svg.select("g#Areas_ha")
                        .selectAll("path")
                        .data(areaSeries, key)
                        .enter()
                        .append("path")
                        .attr("class", "area")
                        .attr("opacity", 0)
                        .attr("d", area)
                        .attr("fill", function(d, i) {
                            //Which area is this?
                            var thisKey = d.key;

                            //What 'type' is this area?
                            var thisType = d[0].data[thisKey].mining_type;
                            // console.log(thisType);

                            //Used to find a cool color below
                            var spread = 0.35;
                            var startingPoint;

                            //Choose where in the color spectrum we start, based on type
                            switch (thisType) {
                                case "Heavy_Machinery":
                                    startingPoint = 0;
                                    break;

                                case "Suction_Pumps":
                                    startingPoint = 0.35;
                                    break;
                            }

                            //How many areas?
                            var numAreas_ha = keysOfThisType.length;

                            //Get a value between 0.0 and 1.0
                            var normalized =
                                startingPoint + (i / numAreas_ha) * spread;

                            //Get that color on the spectrum
                            return d3.interpolateCool(normalized);
                        })
                        .on("click", function(d) {
                            showLeggend();

                            //Update view state
                            viewState++;

                            //Hide the back button during this view transition
                            toggleBackButton();

                            //Which area was clicked?
                            var thisType = d.key;

                            //Fade out all other areas
                            d3.selectAll("g#Areas_ha path")
                                .classed("unclickable", true) //Prevent future clicks
                                .filter(function(d) {
                                    //Filter out 'this' one
                                    if (d.key !== thisType) {
                                        return true;
                                    }
                                })
                                .transition()
                                .duration(1000)
                                .attr("opacity", 0);

                            //Define area generator that will be used just this one time
                            var singleArea_ha_Area = d3
                                .area()
                                .x(function(d) {
                                    return xScale(d.data.date);
                                })
                                .y0(function(d) {
                                    return yScale(0);
                                }) //Note zero baseline
                                .y1(function(d) {
                                    return yScale(d.data[thisType].area_val);
                                });
                            //Note y1 uses the raw 'sales' value for 'this' area,
                            //not the stacked data values (e.g., d[0] or d[1]).

                            //Use this new area generator to transition the area downward,
                            //to have a flat (zero) baseline.
                            var thisAreaTransition = d3
                                .select(this)
                                .transition()
                                .delay(1000)
                                .duration(1000)
                                .attr("d", singleArea_ha_Area);

                            //Update y scale domain, based on the sales for this area only
                            yScale.domain([
                                0,
                                d3.max(dataset, function(d) {
                                    return d[thisType].area_val;
                                })
                            ]);

                            //Transitions the clicked area and y axis into place, to fit the new domain
                            thisAreaTransition
                                .transition()
                                .duration(1000)
                                .attr("d", singleArea_ha_Area)
                                .on("start", function() {
                                    //Transition axis to new scale concurrently
                                    d3.select("g.axis.y")
                                        .transition()
                                        .duration(1000)
                                        .call(yAxis);
                                })
                                .on("end", function() {
                                    //Restore clickability (is that a word?)
                                    d3.select(this).classed(
                                        "unclickable",
                                        "false"
                                    );

                                    //Reveal back button
                                    toggleBackButton();
                                });
                        })
                        .append("title") //Make tooltip
                        .text(function(d) {
                            return d.key;
                        });
                })
                .append("title") //Make tooltip
                .text(function(d) {
                    return d.key;
                });

            //Create axes
            svg.append("g")
                .attr("class", "axis x")
                .attr("transform", "translate(0," + (h - padding) + ")")
                .call(xAxis);

            svg.append("text")
                .attr("transform", "translate(" + w / 2 + " ," + h + ")")
                .style("text-anchor", "middle")
                .text("Date");

            svg.append("g")
                .attr("class", "axis y")
                .attr("transform", "translate(" + (w - padding * 2) + ",0)")
                .call(yAxis);

            svg.append("text")
                .attr("text-anchor", "middle") // this makes it easy to centre the text as the transform is applied to the anchor
                .attr(
                    "transform",
                    "translate(" +
                        (w - padding / 2) +
                        "," +
                        h / 2 +
                        ")rotate(-90)"
                ) // text is drawn off the screen top left, move down and out and rotate
                .text("Area hm");

            //Create back button
            var backButton = svg
                .append("g")
                .attr("id", "backButton")
                .attr("opacity", 0) //Initially hidden
                .classed("unclickable", true) //Initially not clickable
                .attr(
                    "transform",
                    "translate(" +
                        xScale.range()[0] +
                        "," +
                        yScale.range()[1] +
                        ")"
                );

            backButton
                .append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("rx", 5)
                .attr("rx", 5)
                .attr("width", 70)
                .attr("height", 30);

            backButton
                .append("text")
                .attr("x", 7)
                .attr("y", 20)
                .html("&larr; Back");

            //Define click behavior
            backButton.on("click", function() {
                //Hide the back button, as it was just clicked
                toggleBackButton();

                if (viewState == 1) {
                    //Go back to default view

                    //Update view state
                    viewState--;

                    //Re-bind type data and fade in types
                    var typeAreaTransitions = d3
                        .selectAll("g#types path")
                        .data(typeSeries, key)
                        .transition()
                        .duration(250)
                        .attr("opacity", 1)
                        .on("end", function() {
                            //Remove all Areas_ha once this fades in;
                            //they will be recreated later as needed.
                            d3.selectAll("g#Areas_ha path").remove();
                        });

                    //Set y scale back to original domain
                    yScale.domain([
                        0,
                        d3.max(typeDataset, function(d) {
                            var sum = 0;

                            //Loops once for each row, to calculate
                            //the total (sum) of sales of all areas
                            for (var i = 0; i < types.length; i++) {
                                sum += d[types[i]];
                            }

                            return sum;
                        })
                    ]);

                    //Transition type areas and y scale back into place
                    typeAreaTransitions
                        .transition()
                        .duration(1000)
                        .on("start", function() {
                            //Transition axis to new scale concurrently
                            d3.select("g.axis.y")
                                .transition()
                                .duration(1000)
                                .call(yAxis);
                        })
                        .attr("d", area)
                        .on("end", function() {
                            d3.select(this).classed("unclickable", false);
                        });
                } else if (viewState == 2) {
                    //Go back to areas view

                    //Update view state
                    viewState--;

                    //Restore the old y scale
                    yScale.domain([
                        0,
                        d3.max(thisTypeDataset, function(d) {
                            var sum = 0;

                            //Calculate the total (sum) of sales of this type
                            sum += d[viewType];

                            return sum;
                        })
                    ]);

                    //Transition the y axis and visible area back into place
                    d3.selectAll("g#Areas_ha path")
                        .transition()
                        .on("start", function() {
                            //Transition y axis to new scale concurrently
                            d3.select("g.axis.y")
                                .transition()
                                .duration(1000)
                                .call(yAxis);
                        })
                        .duration(1000)
                        .attr("d", area) //Effectively changes only the selected area
                        .transition()
                        .duration(1000)
                        .attr("opacity", 1) //Fade in all areas
                        .on("end", function(d, i) {
                            //Restore clickability
                            d3.select(this).classed("unclickable", false);

                            //Reveal back button
                            if (i == 0) {
                                toggleBackButton();
                            }
                        });
                }
                // ADD LEGEND
                // svg.append("text")
                //     .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
                //     .attr("transform", "translate("+ (padding/2) +","+(h/2)+")")  // text is drawn off the screen top left, move down and out and rotate
                //     .text(function(d) {
                //         // console.log(viewType);
                //         return viewType;
                //     });
            });
        });

    var toggleBackButton = function() {
        //Select the button
        var backButton = d3.select("#backButton");

        //Is the button hidden right now?
        var hidden = backButton.classed("unclickable");

        //Decide whether to reveal or hide it
        if (hidden) {
            //Reveal it

            //Set up dynamic button text
            var buttonText = "&larr; Return ";
            // var buttonTextInfo = "&larr; Current View ";
            //Text varies by mode and type
            if (viewState == 1) {
                buttonText += "types of mining HM - SP";
                // buttonTextInfo += "all types";
            } else if (viewState == 2) {
                buttonText += "Mining Type " + viewType + " by sectors";
                // buttonTextInfo += "all " + viewType + " Areas_ha"
            }

            //Set text
            backButton.select("text").html(buttonText);
            // backButtonIz.select("text").html(buttonTextInfo);

            //Resize button depending on text width
            var rectWidth = Math.round(
                backButton
                    .select("text")
                    .node()
                    .getBBox().width + 16
            );
            if (
                rectWidth <
                document.getElementById("descriptionsOption2").offsetWidth - 25
            )
                backButton.select("rect").attr("width", rectWidth);
            else
                backButton
                    .select("rect")
                    .attr(
                        "width",
                        document.getElementById("descriptionsOption2")
                            .offsetWidth - 50
                    );

            //Fade button in
            backButton
                .classed("unclickable", false)
                .transition()
                .duration(500)
                .attr("opacity", 1);
        } else {
            //Hide it
            backButton
                .classed("unclickable", true)
                .transition()
                .duration(200)
                .attr("opacity", 0);
        }
    };
}
