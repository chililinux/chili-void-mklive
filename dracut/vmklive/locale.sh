#!/bin/sh
# -*- mode: shell-script; indent-tabs-mode: nil; sh-basic-offset: 4; -*-
# ex: ts=8 sw=4 sts=4 et filetype=sh

type getarg >/dev/null 2>&1 || . /lib/dracut-lib.sh

TIMEZONE="America/Sao_Paulo"
LOCALE=$(getarg locale.LANG)
#[ -z "$LOCALE" ] && LOCALE="en_US.UTF-8"
LOCALE="pt_BR.UTF-8"

# also enable this locale in newroot.
echo "LANG=$LOCALE" > $NEWROOT/etc/locale.conf
echo "LC_COLLATE=C" >> $NEWROOT/etc/locale.conf
echo "LC_ALL=$LOCALE" >> $NEWROOT/etc/locale.conf

# set keymap too.
KEYMAP=$(getarg vconsole.keymap)
#[ -z "$KEYMAP" ] && KEYMAP="us"
KEYMAP="br-abnt2"

if [ -f ${NEWROOT}/etc/vconsole.conf ]; then
    sed -e "s,^KEYMAP=.*,KEYMAP=$KEYMAP," -i $NEWROOT/etc/vconsole.conf
elif [ -f ${NEWROOT}/etc/rc.conf ]; then
    sed -e "s,^#KEYMAP=.*,KEYMAP=$KEYMAP," -i $NEWROOT/etc/rc.conf
fi

sed -e "s|#\?en_US.UTF-8 UTF-8|#en_US.UTF-8 UTF-8|g" -i $NEWROOT/etc/default/libc-locales
sed -e "/$LOCALE UTF-8/s/^\#//"     -i $NEWROOT/etc/default/libc-locales

sed -i -e "s|TIMEZONE=.*|TIMEZONE=$TIMEZONE|g" $NEWROOT/etc/rc.conf
sed -i -e "s|#\?TIMEZONE=.*|TIMEZONE=$TIMEZONE|g" $NEWROOT/etc/rc.conf

#font
sed -i -e "s|FONT=.*|FONT=Lat2-Terminus16|g" $NEWROOT/etc/rc.conf
sed -i -e "s|#\?FONT=.*|FONT=Lat2-Terminus16|g" $NEWROOT/etc/rc.conf

chroot ${NEWROOT} sh -c "xbps-reconfigure -f glibc-locales"

