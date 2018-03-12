#!/usr/bin/env bash
echo "Creating database..."

#TODO: use env variable for database name

mongo --host localhost --eval "db.getSiblingDB('dataex')"

echo "Database created."
