#!/usr/bin/env bash

# stop all node processes
killall node

# ULS SERVER

# pull server code
git pull origin dev

node index.js &

# LAB ROOM SERVER

# pull server code
git pull origin dev

node index.js &