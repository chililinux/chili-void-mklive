#!/bin/sh
# -*- mode: shell-script; indent-tabs-mode: nil; sh-basic-offset: 4; -*-
# ex: ts=8 sw=4 sts=4 et filetype=sh

# shellcheck source=/dev/null
type getarg >/dev/null 2>&1 || . /lib/dracut-lib.sh

USERNAME=$(getarg live.user)
[ -z "$USERNAME" ] && USERNAME=anon

SESSION_NAME=xfce
if [ -x "${NEWROOT}"/usr/bin/startxfce4 ]; then
	SESSION_NAME=xfce
elif [ -x "${NEWROOT}"/usr/bin/startplasma-wayland ]; then
	SESSION_NAME=plasma
elif [ -x "${NEWROOT}"/usr/bin/enlightenment_start ]; then
	SESSION_NAME=enlightenment
elif [ -x "${NEWROOT}"/usr/bin/awesome ]; then
	SESSION_NAME=awesome
elif [ -x "${NEWROOT}"/usr/bin/gnome-session ]; then
	SESSION_NAME=gnome
elif [ -x "${NEWROOT}"/usr/bin/mate-session ]; then
	SESSION_NAME=mate
elif [ -x "${NEWROOT}"/usr/bin/cinnamon-session ]; then
	SESSION_NAME=cinnamon
elif [ -x "${NEWROOT}"/usr/bin/i3 ]; then
	SESSION_NAME=i3
elif [ -x "${NEWROOT}"/usr/bin/startlxde ]; then
	SESSION_NAME=startlxde
elif [ -x "${NEWROOT}"/usr/bin/startlxqt ]; then
	SESSION_NAME=startlxqt
elif [ -x "${NEWROOT}"/usr/bin/startfluxbox ]; then
	SESSION_NAME=startfluxbox
fi

# Configure sddm autologin iso.
mkdir -p "${NEWROOT}/etc/sddm.conf.d"
cat >"${NEWROOT}/etc/sddm.conf.d/00-autologin.conf" <<EOF
[Autologin]
Enable=true
User=${USERNAME}
#Session=xfce.desktop
Session=${SESSION_NAME}
EOF

# Configure GDM autologin
if [ -d "${NEWROOT}"/etc/gdm ]; then
	GDMCustomFile="${NEWROOT}"/etc/gdm/custom.conf
	AutologinParameters="AutomaticLoginEnable=true\nAutomaticLogin=$USERNAME"

	# Prevent from updating if parameters already present (persistent usb key)
	#       if ! `grep -qs 'AutomaticLoginEnable' "$GDMCustomFile"` ; then
	if ! grep -qs 'AutomaticLoginEnable' "$GDMCustomFile"; then
		#           if ! `grep -qs '\[daemon\]' "$GDMCustomFile"` ; then
		if ! grep -qs '\[daemon\]' "$GDMCustomFile"; then
			echo '[daemon]' >>"$GDMCustomFile"
		fi
		sed -i "s/\[daemon\]/\[daemon\]\n$AutologinParameters/" "$GDMCustomFile"
	fi
fi

# Configure lightdm autologin.
if [ -r "${NEWROOT}"/etc/lightdm.conf ]; then
	sed -i -e "s|^\#\(default-user=\).*|\1$USERNAME|" "${NEWROOT}"/etc/lightdm.conf
	sed -i -e "s|^\#\(default-user-timeout=\).*|\10|" "${NEWROOT}"/etc/lightdm.conf
fi

# Configure lxdm autologin.
if [ -r "${NEWROOT}"/etc/lxdm/lxdm.conf ]; then
	sed -e "s,.*autologin.*=.*,autologin=$USERNAME," -i "${NEWROOT}"/etc/lxdm/lxdm.conf
	if [ -x "${NEWROOT}"/usr/bin/startxfce4 ]; then
		sed -e "s,.*session.*=.*,session=/usr/bin/startxfce4," -i "${NEWROOT}"/etc/lxdm/lxdm.conf
		#       sed -i 's/^session=.*/session=xfce/' "${NEWROOT}/etc/lxdm/lxdm.conf"
		#		sed -e "s,.*session.*=.*,session=xfce," -i "${NEWROOT}"/etc/lxdm/lxdm.conf
	elif [ -x "${NEWROOT}"/usr/bin/enlightenment_start ]; then
		sed -e "s,.*session.*=.*,session=/usr/bin/enlightenment_start," -i "${NEWROOT}"/etc/lxdm/lxdm.conf
	elif [ -x "${NEWROOT}"/usr/bin/awesome ]; then
		sed -e "s,.*session.*=.*,session=/usr/bin/awesome," -i "${NEWROOT}"/etc/lxdm/lxdm.conf
	elif [ -x "${NEWROOT}"/usr/bin/gnome-session ]; then
		sed -e "s,.*session.*=.*,session=/usr/bin/gnome-session," -i "${NEWROOT}"/etc/lxdm/lxdm.conf
	elif [ -x "${NEWROOT}"/usr/bin/mate-session ]; then
		sed -e "s,.*session.*=.*,session=/usr/bin/mate-session," -i "${NEWROOT}"/etc/lxdm/lxdm.conf
	elif [ -x "${NEWROOT}"/usr/bin/cinnamon-session ]; then
		sed -e "s,.*session.*=.*,session=/usr/bin/cinnamon-session," -i "${NEWROOT}"/etc/lxdm/lxdm.conf
	elif [ -x "${NEWROOT}"/usr/bin/i3 ]; then
		sed -e "s,.*session.*=.*,session=/usr/bin/i3," -i "${NEWROOT}"/etc/lxdm/lxdm.conf
	elif [ -x "${NEWROOT}"/usr/bin/startlxde ]; then
		sed -e "s,.*session.*=.*,session=/usr/bin/startlxde," -i "${NEWROOT}"/etc/lxdm/lxdm.conf
	elif [ -x "${NEWROOT}"/usr/bin/startlxqt ]; then
		sed -e "s,.*session.*=.*,session=/usr/bin/startlxqt," -i "${NEWROOT}"/etc/lxdm/lxdm.conf
	elif [ -x "${NEWROOT}"/usr/bin/startfluxbox ]; then
		sed -e "s,.*session.*=.*,session=/usr/bin/startfluxbox," -i "${NEWROOT}"/etc/lxdm/lxdm.conf
	fi
fi
