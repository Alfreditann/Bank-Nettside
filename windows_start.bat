#this script is used to start the server on Windows
@echo off
cd /d "%~dp0"
npm install
npm run dev
pause