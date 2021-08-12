echo "build.sh"
echo "-- running ./backend/npm run start"
echo "-- running ./frontend/npm run start"

(cd ./backend && npm run start) & (cd ./frontend && npm run start)

echo "-- done."