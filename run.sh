#!/usr/bin/env bash
cd "$(dirname "$0")"
echo $(date) >> unem.log
printf "\n\n\n\n\n\n\n\n\n\n\n" >> unem.log
node app.js -p 80:443 -f 59.111.160.197
