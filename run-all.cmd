@echo off
setlocal

REM Root folder of this script (ends with a backslash)
set "ROOT=%~dp0"

REM Open each app in its own terminal window
start "admin"      cmd /k "cd /d ""%ROOT%admin"" && npm run dev"
start "frontend"   cmd /k "cd /d ""%ROOT%frontend"" && npm run dev"
start "backend"    cmd /k "cd /d ""%ROOT%backend"" && npx nodemon server.js"
start "background" cmd /k "cd /d ""%ROOT%backgroundservices"" && npx nodemon index.js"

endlocal