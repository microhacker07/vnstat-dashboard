#/bin/sh

curl https://cdn.plot.ly/plotly-latest.min.js -o ./public/js/plotly-latest.min.js

sed -i "s/https:\/\/cdn.plot.ly\/plotly-latest.min.js/js\/plotly-latest.min.js/" ./public/index.html


