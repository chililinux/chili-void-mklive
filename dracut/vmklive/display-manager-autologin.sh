#!/bin/sh
# -*- mode: shell-script; indent-tabs-mode: nil; sh-basic-offset: 4; -*-
# ex: ts=8 sw=4 sts=4 et filetype=sh

# shellcheck source=/dev/null
type getarg >/dev/null 2>&1 || . /lib/dracut-lib.sh

configure_normal_dm_autologin() {
	USERNAME=$(getarg live.user)
	[ -z "$USERNAME" ] && USERNAME=anon

	# Fonte principal: o mkiso já grava EDITION="Xfce"/"Hyprland"/...
	# (sh_set_edition_os_release) em /etc/os-release na hora do build --
	# é o flavor exato escolhido, sem ambiguidade nenhuma. Só usa o
	# valor se um .desktop com esse nome realmente existir (evita
	# confiar num EDITION que não bate com nada instalado de verdade).
	SESSION_NAME=""
	if [ -r "${NEWROOT}/etc/os-release" ]; then
		# /etc/os-release é feito pra ser "sourceado" (é a própria spec
		# do formato) -- o shell já trata aspas simples/duplas/nenhuma
		# igual, sem precisar de sed nenhum pra extrair o valor.
		EDITION=""
		. "${NEWROOT}/etc/os-release"
		_edition_lc=$(echo "$EDITION" | tr '[:upper:]' '[:lower:]')
		case "$_edition_lc" in
		xfce-base) _edition_lc=xfce ;;
		esac
		if [ -f "${NEWROOT}/usr/share/wayland-sessions/${_edition_lc}.desktop" ] ||
			[ -f "${NEWROOT}/usr/share/xsessions/${_edition_lc}.desktop" ]; then
			SESSION_NAME="$_edition_lc"
		fi
	fi

	# Fallback: EDITION ausente/sem .desktop correspondente -- varre os
	# .desktop reais e pega o primeiro. Menos preciso quando há mais de
	# um instalado (ex: xfce + labwc juntos), mas melhor que travar.
	if [ -z "$SESSION_NAME" ]; then
		for f in "${NEWROOT}"/usr/share/wayland-sessions/*.desktop "${NEWROOT}"/usr/share/xsessions/*.desktop; do
			[ -f "$f" ] || continue
			SESSION_NAME=$(basename "$f" .desktop)
			break
		done
	fi
	[ -z "$SESSION_NAME" ] && SESSION_NAME=xfce

	# Configura os quatro DMs SEMPRE, incondicional -- não dá pra saber
	# com certeza qual está de fato habilitado no runit (pode ter mais
	# de um instalado no mesmo rootfs). Escrever pra todos é inofensivo:
	# só o que estiver de fato ativado em
	# /etc/runit/runsvdir/default/<dm> vai ler essa config.

	# SDDM
	mkdir -p "${NEWROOT}/etc/sddm.conf.d"
	cat >"${NEWROOT}/etc/sddm.conf.d/00-autologin" <<EOF
[Autologin]
Enable=true
User=${USERNAME}
Session=${SESSION_NAME}
EOF

	# GDM
	mkdir -p "${NEWROOT}/etc/gdm"
	GDMCustomFile="${NEWROOT}/etc/gdm/custom.conf"
	AutologinParameters="AutomaticLoginEnable=true\nAutomaticLogin=$USERNAME"
	if ! grep -qs 'AutomaticLoginEnable' "$GDMCustomFile"; then
		if ! grep -qs '\[daemon\]' "$GDMCustomFile"; then
			echo '[daemon]' >>"$GDMCustomFile"
		fi
		sed -i "s/\[daemon\]/\[daemon\]\n$AutologinParameters/" "$GDMCustomFile"
	fi

	# lightdm -- drop-in em conf.d, não depende de um lightdm.conf
	# pré-existente com linhas comentadas específicas (jeito antigo,
	# quebrava se o pacote não estivesse instalado ainda nesse ponto).
	mkdir -p "${NEWROOT}/etc/lightdm/lightdm.conf.d"
	cat >"${NEWROOT}/etc/lightdm/lightdm.conf.d/50-voidbr-autologin.conf" <<EOF
[Seat:*]
autologin-user=${USERNAME}
autologin-user-timeout=0
EOF

	# lxdm -- mesmo raciocínio: cria o arquivo do zero se não existir,
	# em vez de só tentar um sed que não acha nada pra substituir.
	case "$SESSION_NAME" in
	xfce) LXDM_BIN=/usr/bin/startxfce4 ;;
	enlightenment) LXDM_BIN=/usr/bin/enlightenment_start ;;
	awesome) LXDM_BIN=/usr/bin/awesome ;;
	gnome) LXDM_BIN=/usr/bin/gnome-session ;;
	mate) LXDM_BIN=/usr/bin/mate-session ;;
	cinnamon) LXDM_BIN=/usr/bin/cinnamon-session ;;
	i3) LXDM_BIN=/usr/bin/i3 ;;
	startlxde) LXDM_BIN=/usr/bin/startlxde ;;
	startlxqt) LXDM_BIN=/usr/bin/startlxqt ;;
	startfluxbox) LXDM_BIN=/usr/bin/startfluxbox ;;
	*) LXDM_BIN=/usr/bin/startxfce4 ;;
	esac
	mkdir -p "${NEWROOT}/etc/lxdm"
	if [ -f "${NEWROOT}/etc/lxdm/lxdm.conf" ]; then
		sed -e "s,.*autologin.*=.*,autologin=$USERNAME," -i "${NEWROOT}/etc/lxdm/lxdm.conf"
		sed -e "s,.*session.*=.*,session=$LXDM_BIN," -i "${NEWROOT}/etc/lxdm/lxdm.conf"
	else
		cat >"${NEWROOT}/etc/lxdm/lxdm.conf" <<EOF
[base]
autologin=${USERNAME}
session=${LXDM_BIN}
EOF
	fi
}

disable_display_managers() {
	# Boot direto no instalador (entrada "Instalar" do menu): não deixa
	# nenhum display manager subir, pra não competir com o autologin de
	# texto da tty1 (adduser.sh) + o .bash_profile que dispara o
	# void-install.
	for dm in sddm gdm lightdm lxdm; do
		rm -f "${NEWROOT}/etc/runit/runsvdir/default/$dm" 2>/dev/null
	done
}

# Sem "exit"/"return" no nível do script: este hook pode ser carregado
# via "source" pelo dracut, e um "exit" aqui mataria o processo
# principal do dracut inteiro em vez de só voltar do hook.
if getargbool 0 voidbr.autoinstall; then
	disable_display_managers
else
	configure_normal_dm_autologin
fi
