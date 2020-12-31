#!/usr/bin/env bash

echo 'Creating application user and db'


mongo ${MONGO_INITDB_DATABASE} \
        --host ${MONGO_HOST} \
        --port ${MONGO_PORT} \
        -u ${MONGO_ROOT_USER} \
        -p ${MONGO_ROOT_PASS} \
        --authenticationDatabase admin \
        --eval "db.createUser({user: '${POLY_MONGO_USER}', pwd: '${POLY_MONGO_PASS}', roles:[{role:'dbOwner', db: '${MONGO_INITDB_DATABASE}'}]});"