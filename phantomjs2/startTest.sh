#!/bin/bash
rm -f *.csv
for i in $(seq 1 $2)
do
    ./phantomjs openBrowser.js http://dugokontov.noip.me/#/project/$1 US &
done

