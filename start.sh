#!/bin/bash
echo ""
echo " BuySide CRM — starting server..."
echo ""

if ! command -v node &> /dev/null; then
  echo " ERROR: Node.js is not installed."
  echo " Download it from https://nodejs.org  (choose the LTS version)"
  echo ""
  exit 1
fi

if [ ! -d "node_modules" ]; then
  echo " First run — installing dependencies..."
  npm install
  echo ""
fi

node server.js
