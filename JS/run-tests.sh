echo 
find . -type f | grep -E "\.test.js$" | xargs -n1 node