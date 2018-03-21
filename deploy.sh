#! /bin/bash

cd ..
tar --exclude='./dataex-api/.git' --exclude='./dataex-api/node_modules' -cvf dataex.tar ./dataex-api/

# scp dataex.tar mykrazylabs@35.229.120.209:.
cd dataex-api
