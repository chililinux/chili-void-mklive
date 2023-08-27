#!/bin/sh
# -*- mode: shell-script; indent-tabs-mode: nil; sh-basic-offset: 4; -*-
# ex: ts=8 sw=4 sts=4 et filetype=sh

cat > "${NEWROOT}/etc/xbps.d/00-repository-main.conf" <<- EOF
repository=https://repo-fastly.voidlinux.org/current
repository=https://repo-fastly.voidlinux.org/current/nonfree
repository=https://repo-fastly.voidlinux.org/current/multilib
repository=https://repo-fastly.voidlinux.org/current/multilib/nonfree
#repository=https://voidlinux.com.br/repo/current
#repository=https://voidlinux.com.br/repo/current/nonfree
#repository=https://voidlinux.com.br/repo/current/multilib
#repository=https://voidlinux.com.br/repo/current/multilib/nonfree
#repository=http://void.chililinux.com/voidlinux/current
#repository=http://void.chililinux.com/voidlinux/current/nonfree
#repository=http://void.chililinux.com/voidlinux/current/multilib
#repository=http://void.chililinux.com/voidlinux/current/multilib/nonfree
EOF
