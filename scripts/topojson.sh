#!/usr/bin/env bash

#install nodejs http://nodejs.org/
#install npm https://npmjs.org/doc/README.html
#run npm install -g topojson in your command prompt
# Install mapshaper and topsimplify

cd ../data/geojson
# Simplify geojson
for mineria in mineria_*
do
    echo "Simplify $mineria ..."
    mapshaper "$mineria" -dissolve MiningType,Sector -o "grouped_$mineria"
done

# Translate to topojson
for geo in grouped_*
do
    echo "Translating $geo to topojson ..."
    geo2topo -o "../topojson/$geo.json" "$geo"
done

# Simplify topojson
cd ../topojson
for topo in *
do
    echo "Simplifying $topo ..."
    toposimplify -P 0.000000001 -o "simplified_$topo" "$topo"
done
