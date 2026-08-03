@echo off
setlocal

pushd "%~dp0\.."

if not exist "apps\api\dist\src\main.js" (
  echo Building API...
  call npm run build --workspace=@eduvision/api
)

if not exist "apps\web\.next\standalone\apps\web\server.js" (
  echo Building web...
  call npm run build --workspace=web
)

cd apps\desktop
npm start

popd
