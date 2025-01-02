#!/usr/bin/env bash
set -ex

npm install --workspaces

POST_CREATE_SCRIPT="post-create.sh"
if [[ -f "$POST_CREATE_SCRIPT" ]]; then
    chmod +x "$POST_CREATE_SCRIPT"
    "$POST_CREATE_SCRIPT"
fi
