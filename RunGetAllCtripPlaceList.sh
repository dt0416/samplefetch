#!/bin/bash

iojs getCtripPlaceList.js http://you.ctrip.com/sightlist/tokyo294.html > tokyo.json
sleep 10

iojs getCtripPlaceList.js http://you.ctrip.com/sightlist/kyoto430.html > kyoto.json