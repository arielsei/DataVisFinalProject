#!/usr/bin/env bash

#install nodejs http://nodejs.org/
#install npm https://npmjs.org/doc/README.html
#run npm install -g topojson in your command prompt

cd ../data/geojson
for file in *
do
  geo2topo -o "../topojson/$file.json" "$file"
done
