#!/bin/bash
rm -f *.csv
for i in $(seq 1 $3)
do
    ./phantomjs openBrowser.js http://dugokontov.noip.me/#/project/$2 $1 &
done

