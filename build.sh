echo "build.sh"

echo "-- running ./backend/npm install"
echo "-- running ./frontend/npm install"
(cd ./backend && npm install) & (cd ./frontend && npm install) &

echo "-- running ./backend/npm run start"
echo "-- running ./frontend/npm run start"
(cd ./backend && npm run start) & (cd ./frontend && npm run start) &

echo "-- done."
