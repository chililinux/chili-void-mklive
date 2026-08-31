#!/bin/bash
# -*- mode: shell-script; indent-tabs-mode: nil; sh-basic-offset: 4; -*-
# ex: ts=8 sw=4 sts=4 et filetype=sh

check() {
	return 255
}

depends() {
	echo dmsquash-live
}

install() {
	inst /usr/bin/chroot
	inst /usr/bin/chmod
	inst /usr/bin/sed

	# Garante bash no initramfs -- usado pelo hook de emergência
	# (95voidbr-diag.sh) para trocar o "sh" padrão por um shell melhor.
	# "tty" via caminho absoluto porque a resolução por nome do
	# dracut_install não estava pegando esse binário (bash/tail
	# funcionam por nome normalmente).
	dracut_install bash tail /usr/bin/tty

	if [ -e /usr/bin/memdiskfind ]; then
		inst /usr/bin/memdiskfind
		instmods mtdblock phram
		inst_rules "$moddir/59-mtd.rules" "$moddir/61-mtd.rules"
		prepare_udev_rules 59-mtd.rules 61-mtd.rules
		inst_hook pre-udev 01 "$moddir/mtd.sh"
	fi

	inst_hook pre-pivot 01 "$moddir/adduser.sh"
	if [ ! -e /usr/lib/dracut/modules.d/01vmklive/noautologin ]; then
		inst_hook pre-pivot 02 "$moddir/display-manager-autologin.sh"
	fi
	inst_hook pre-pivot 02 "$moddir/getty-serial.sh"
	inst_hook pre-pivot 03 "$moddir/locale.sh"
	inst_hook pre-pivot 04 "$moddir/repository.sh"

	# Diagnóstico melhor ao cair em shell de emergência (conserta eco da
	# tty + mostra dmesg relevante + instruções em pt_BR), em vez do
	# prompt cru "dracut:/#" padrão.
	inst_hook emergency 95 "$moddir/95voidbr-diag.sh"
}
