#!/usr/bin/env bash

if [ -d /etc/bashrc.d/ ]; then
    for f in /etc/bashrc.d/*.sh; do
        [ -r "$f" ] && . "$f"
    done
    unset f
fi
