send() {
    echo "$2: $1"
    screen -S "$2" -X stuff "$1^M"
}

name=web_amy
screen -dmS $name
send "npm run build" $name
send "cd build" $name
send "node index.js" $name
