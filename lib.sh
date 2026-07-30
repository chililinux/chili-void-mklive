#!/usr/bin/env bash
# -*- coding: utf-8 -*-
# shellcheck shell=bash disable=SC1091,SC2039,SC2166
# vim: set ts=4 sw=4 et:
#
# lib.sh
#  
# Created: 2023/09/18 - 09:05
# Updated: sáb 25 jul 2026 16:48:16 -04
#
# Copyright (c) 2019-2026 Vilmar Catafesta <vcatafesta@gmail.com>
# Copyright (c) 2009-2015 Juan Romero Pardines.
# All rights reserved.
#
# Redistribution and use in source and binary forms, with or without
# modification, are permitted provided that the following conditions
# are met:
# 1. Redistributions of source code must retain the above copyright
#    notice, this list of conditions and the following disclaimer.
# 2. Redistributions in binary form must reproduce the above copyright
#    notice, this list of conditions and the following disclaimer in the
#    documentation and/or other materials provided with the distribution.
#
# THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR
# IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
# OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
# IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT,
# INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
# NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
# DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
# THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
# (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
# THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
##############################################################################

# This contains the COMPLETE list of binaries that this script needs
# to function.  The only exception is the QEMU binary since it is not
# known in advance which one wil be required.
export TERM=${TERM:-xterm}
export TERM=${TERM:-xterm-256color}
readonly LIBTOOLS="cp echo cat printf which mountpoint mount umount modprobe"
readonly HOSTARCH=$(xbps-uhelper arch)
tput sgr0 # reset colors
bold=$(tput bold)
reset=$(tput sgr0)
rst=$(tput sgr0)
black=$(tput setaf 0)
red=$(tput bold)$(tput setaf 196)
green=$(tput setaf 2)
yellow=$(tput bold)$(tput setaf 3)
blue=$(tput setaf 4)
pink=$(tput setaf 5)
cyan=$(tput setaf 6)
white=$(tput setaf 7)
orange=$(tput setaf 3)
purple=$(tput setaf 125)
violet=$(tput setaf 61)

COL_NC='\e[0m' # No Color
COL_LIGHT_GREEN='\e[1;32m'
COL_LIGHT_RED='\e[1;31m'
#  TICK="${white}[${COL_LIGHT_GREEN}✓ OK${COL_NC}${white}]"
#   CROSS="${white}[${COL_LIGHT_RED}✗ERR${COL_NC}${white}]"
#   INFO="[i]"
#   : "${clrkey=${rst}${light_white}}"
: "${clrkey=${rst}${black}}"
: "${TICK="${clrkey}[${green}✓${clrkey}]${rst}"}"
: "${CROSS="${clrkey}[${red}✗${clrkey}]${rst}"}"
: "${MID="${clrkey}[${red}✗${green}✓${clrkey}]${rst}"}"
: "${WARN="${clrkey}[${yellow}⚠${clrkey}]${yellow}"}"
: "${INFO="${clrkey}[${yellow}➜${clrkey}]${rst}"}"
# shellcheck disable=SC2034
DONE="${COL_LIGHT_GREEN} done!${COL_NC}"
OVER="\\r\\033[K"
DOTPREFIX="  ${black}::${reset} "
declare -a public_repos=()

detect_distro() {
	local id=""
	if [[ -r /etc/os-release ]]; then
		# Lê ID=void|arch|debian|... exatamente como a distro declara
		id=$(grep -E '^ID=' /etc/os-release | cut -d= -f2 | tr -d '"')
	elif [[ -r /usr/lib/os-release ]]; then
		id=$(grep -E '^ID=' /usr/lib/os-release | cut -d= -f2 | tr -d '"')
	else
		echo "unknown"
		return
	fi
	echo "$id"
}

sh_version() {
  cat <<EOF
    ${bold}${cyan}${0##*/} v${_VERSION_}${reset}
    ${bold}${black}Copyright (C) 2023 vcatafesta@gmail.com
    $(gettext 'Licença GPL v3+: GNU GPL versão 3 ou posterior') <https://gnu.org/licenses/gpl.html>
    $(gettext 'Este é um software livre: você é livre para alterá-lo e redistribuí-lo.')
    $(gettext 'NÃO HÁ QUALQUER GARANTIA, na máxima extensão permitida em lei.')${reset}
EOF
}

sh_checkroot() {
  (( EUID != 0 )) && elevate_to_root "$@" || return 0
}
elevate_to_root() {
  log_ok "This script must be run as root. ${INFO} Elevating privileges..."
  ccabec+='root [elevated]'
  # Tenta usar sudo primeiro (caso esteja configurado)
  if command -v sudo >/dev/null 2>&1; then
    exec sudo bash "$0" "$@"
  fi
  # Se sudo falhar, tenta su
  if command -v su >/dev/null 2>&1; then
    exec su -c "$0 $*"
  fi
  die "Error: Unable to elevate privileges. Run manually as root."
}

#msg_info() {  printf "%s\n" "${white}${pink}[INFO] ${rst}${*}${rst}"; }
msg_info() { echo -e "${INFO} ${*}${reset}"; }
msg() { echo -n -e "${INFO} ${*}${reset}"; }
log_ok() { echo -e "${TICK} ${*}${reset}"; }
log_err() { echo -e "${CROSS} ${*}${reset}"; }
log_mid() { echo -e "${MID} ${*}${reset}"; }
log_warn() { echo -e "${WARN} ${*}${reset}"; }
msg_info_tab() { echo -e "  ${INFO} ${*}${reset}"; }
msg_ex_tab() { echo -e "  👉   ${*}${reset}"; }
msg_ex() { echo -e "👉   ${*}${reset}"; }
msg_tab() { echo -e "  ${INFO} ${*}${reset}"; }
log_ok_tab() { echo -e "  ${TICK} ${*}${reset}"; }
log_err_tab() { echo -e "  ${CROSS} ${*}${reset}"; }
log_mid_tab() { echo -e "  ${MID} ${*}${reset}"; }
log_warn_tab() { echo -e "  ${WARN} ${*}${reset}"; }
die() {
	echo -e "${CROSS} ${red}${*}${reset}"
	exit 1
}

# Retorno: 0 = online, 1 = offline
# Retorno:
#   0 = online/existe
#   1 = offline/inexistente
test_repo_online() {
	[ $# -eq 1 ] || return 1

	local repo="$1"
	local url="${repo%/}/x86_64-repodata"
	local ret=1

	case "$repo" in
	http://* | https://*)
		timeout 20 curl \
			--fail \
			--silent \
			--show-error \
			--location \
			--output /dev/null \
			"$url"
		ret=$?
		;;

	*)
		[ -e "$url" ]
		ret=$?
		;;
	esac

#	printf 'RET=%s URL=%s\n' "$ret" "$url" >&2
  if [[ $ret -eq 0 ]]; then
    	msg "Testando $url => "
      printf '\033[1;32mONLINE\033[0m\n'
  else
   	msg "Testando $url => "
	  printf '\033[1;31mOFFLINE\033[0m\n'
  fi
	return "$ret"
}
export -f test_repo_online

run_cmd() {
	local cmd="$*"

	msg_tab "${cyan}[⚙] [running] : ${reset} $cmd"
	# executa comando
	$quiet && eval "$@" >/dev/null 2>&1 || eval "$@"
	local rc=$?

	# ignora erro para mkdir -p e umount -R
	if [[ "$cmd" =~ ^mkdir[[:space:]]+-p ]] || [[ "$cmd" =~ ^umount[[:space:]]+-R ]]; then
		return 0
	fi

	# erro real
	if ((rc != 0)); then
		log_warn_tab "Falha ao executar: $cmd"
		. return $rc
	fi

	return 0
}

run_cmd_new() {
	local cmd="$*"

	if [[ $DRYRUN -eq 1 ]]; then
		msg "${cyan}[DRY-RUN]${rst} ${cmd}"
	else
		$QUIET || echo -e "  [⚙  ] ${cyan}${cmd}${rst}"
		# Executa o comando, falha se houver erro
		# Redireciona stderr para /dev/null apenas para mkdir -p e ummount -R
		if [[ "$cmd" =~ ^mkdir\ -p ]] || [[ "$cmd" =~ ^umount\ -R ]]; then
			#     eval "$cmd" &>/dev/null || true
			"$@" &>/dev/null || true
		else
			#     eval "$cmd" || log_warn_tab "Falha ao executar: $cmd"
			if $QUIET; then
				"$@" &>/dev/null || log_warn_tab "Falha ao executar: $cmd"
			else
				"$@" || log_warn_tab "Falha ao executar: $cmd"
			fi
		fi
	fi
}

readconf() {
	if [[ ${LC_DEFAULT:-0} -eq 0 ]]; then
		read -r -p "$@ [S/n]"
	else
		read -r -p "$@ [Y/n]"
	fi
	[[ ${REPLY^} == "" ]] && return 0
	[[ ${REPLY^} == N ]] && return 1 || return 0
}

print_step() {
	local script_name0="${0##*/}[${FUNCNAME[0]}]:${BASH_LINENO[0]}"
	local script_name1="${0##*/}[${FUNCNAME[1]}]:${BASH_LINENO[1]}"
	local script_name2="${0##*/}[${FUNCNAME[2]}]:${BASH_LINENO[2]}"
	CURRENT_STEP=$((CURRENT_STEP + 1))
	#info_msg "$script_name1=>$cyan[${CURRENT_STEP}/${STEP_COUNT}]$reset $@"
	#	info_msg "=>$cyan[${CURRENT_STEP}/${STEP_COUNT}]$reset $@"
	#	msg "=>$cyan[${CURRENT_STEP}/${STEP_COUNT}]$reset $@"
	msgDot "$*"
}

msgDot() {
	local s="$*"
	local MSG_PAD="${2:-40}" # largura antes do :

	if [[ "$s" == *:* ]]; then
		local left="${s%%:*}"
		local right="${s#*:}"

		printf "=>%s[%s/%s]%s %-*s :%s%s%s\n" \
			"$cyan" "$CURRENT_STEP" "$STEP_COUNT" "$reset" \
			"$MSG_PAD" "$left" \
			"$yellow" "$right" "$reset"
	else
		printf "=>%s[%s/%s]%s %s\n" \
			"$cyan" "$CURRENT_STEP" "$STEP_COUNT" "$reset" \
			"$s"
	fi
}

copy_void_keys() {
	mkdir -p "$1"/var/db/xbps/keys
	cp keys/*.plist "$1"/var/db/xbps/keys
}

cmd_install() {
	local PKGS="$*"
	LC_ALL=C \
		XBPS_ARCH=$BASE_ARCH \
		$XBPS_INSTALL_CMD \
		--ignore-file-conflicts \
		--unpack-only \
		--rootdir "$ROOTFS" ${XBPS_REPOSITORY} \
		--cachedir "$XBPS_CACHEDIR" \
		--update \
		--yes $PKGS
}

cmd_install_force() {
	local PKGS="$*"
	LC_ALL=C \
		XBPS_ARCH=$BASE_ARCH \
		$XBPS_INSTALL_CMD \
		--ignore-file-conflicts \
		--unpack-only \
		--rootdir "$ROOTFS" ${XBPS_REPOSITORY} \
		--cachedir "$XBPS_CACHEDIR" \
		--update \
		--force --force \
		--yes $PKGS
}

cmd_logger() {
	local cmd="$*"
	local msg="$1"
	local check_error="$3"

	print_step "$msg"
	#! $quiet msg_tab "${cyan}[⚙   ] [running] : ${reset} $cmd"
	{
		eval "$2"
		#   } 2>&1 | tee -i -a "$BOOTLOG" >$([[ "$QUIET" == false ]] && echo /dev/stdout || echo "$LOGGER")
	} \
		1> >(tee -i -a "$BOOTLOG" >>"$LOGGER") \
		2> >(tee -i -a "$BOOTLOG" >$([[ "$QUIET" == false ]] && echo /dev/stderr || echo /dev/null))
	local result="${PIPESTATUS[0]}"
	[[ -z $check_error ]] && check_error=1
	[[ $check_error -eq 0 ]] && return
	[[ $result -ne 0 ]] && die "FAILED... $msg - exiting..."
}

verificar_espaco_livre() {
	# Garante que há pelo menos 15GB livres no diretório de compilação
	local espaco_livre=$(df -m "$ROOTDIR" | awk 'NR==2 {print $4}')
	if [ "$espaco_livre" -lt 15360 ]; then
		die "Espaço insuficiente em $ROOTDIR. São necessários pelo menos 15GB livres."
	fi
}

debug() {
	whiptail \
		--fb \
		--clear \
		--backtitle "[debug]$0" \
		--title "[debug]$0" \
		--yesno "${*}\n" \
		0 40
	result=$?
	if ((result)); then
		exit
	fi
	return $result
}

sh_diahora() {
	DIAHORA=$(date +"%Y%m%d-%H%M")
	printf "%s\n" "$DIAHORA"
}

msg_warning() {
	local msg="$*"
	#	echo -e "  =>${yellow}warning: ${cyan}${msg}${reset}"
	echo -e "${WARN} ${*}${reset}"
}
export -f msg_warning

msg_warn() {
	local msg="$1"
	#	printf "%s\n" "${yellow}[WARN] ${cyan}$msg${rst}"
	echo -e "${WARN} ${*}${reset}"
}
export -f msg_warn

# Função para exibir mensagens informativas
msg_err() {
	#	printf "%s\n" "${red}[ERRO] ${cyan}$1${rst}"
	echo -e "${CROSS} ${*}${reset}"
}

replicate() {
	local char=${1:-'#'}
	local nsize=${2:-$(tput cols)}
	local ccolor=${3:-$green}
	local line
	printf -v line "%*s" "$nsize" && echo -e "${ccolor}${line// /$char}${rst}"
}

maxcol() {
	COLUMNS=$(stty size)
	COLUMNS=${COLUMNS##* }
	((COLUMNS <= 0)) && COLUMNS=80
	echo "$COLUMNS"
}

is_target_native() {
	# Because checking whether the target is runnable is ugly, stuff
	# it into a single function. That makes it easy to check anywhere.
	local target_arch

	target_arch="$1"
	# this will cover most
	if [ "${target_arch%-musl}" = "${HOSTARCH%-musl}" ]; then
		return 0
	fi

	case "$HOSTARCH" in
	# ppc64le has no 32-bit variant, only runs its own stuff
	ppc64le*) return 1 ;;
	# x86_64 also runs i686
	x86_64*) test -z "${target_arch##*86*}" ;;
	# aarch64 also runs armv*
	aarch64*) test -z "${target_arch##armv*}" ;;
	# bigendian ppc64 also runs ppc
	ppc64*) test "${target_arch%-musl}" = "ppc" ;;
	# anything else is just their own
	*) return 1 ;;
	esac

	return $?
}

info_msg() {
	((++ncontador))
	# This function handles the printing that is bold within all
	# scripts.  This is a convenience function so that the rather ugly
	# looking ASCII escape codes live in only one place.
	#   printf "\033[1m%s\n\033[m" "$@"
	printf "↑ ${cyan}%03d/%03d => ${yellow}%s\n\033[m" "$ncontador" "$njobs" "$@"
}

die() {
  local script_name0="${0##*/}[${FUNCNAME[0]}]:${BASH_LINENO[0]}"
  local script_name1="${0##*/}[${FUNCNAME[1]}]:${BASH_LINENO[1]}"
  local script_name2="${0##*/}[${FUNCNAME[2]}]:${BASH_LINENO[2]}"
  echo -e "${CROSS}${red}ERROR: $*"
  error_out 1 $LINENO
  exit 1
}

check_tools() {
	# All scripts within mklive declare the tools they will use in a
	# variable called "REQTOOLS".  This function checks that these
	# tools are available and prints out the path to each tool that
	# will be used.  This can be useful to figure out what is broken
	# if a different version of something is used than was expected.
	for tool in $LIBTOOLS $REQTOOLS; do
		if ! which "$tool" >/dev/null; then
			die "Required tool $tool is not available on this system!"
		fi
	done

	info_msg "The following tools will be used:"
	for tool in $LIBTOOLS $REQTOOLS; do
		if $quiet; then
			which "$tool" >/dev/null 2>&1
		else
			which "$tool"
		fi
	done
}

mount_pseudofs() {
	# This function ensures that the psuedofs mountpoints are present
	# in the chroot.  Strictly they are not necessary to have for many
	# commands, but bind-mounts are cheap and it isn't too bad to just
	# mount them all the time.
	for f in dev proc sys; do
		# In a naked chroot there is nothing to bind the mounts to, so
		# we need to create directories for these first.
		[ ! -d "$ROOTFS/$f" ] && mkdir -p "$ROOTFS/$f"
		if ! mountpoint -q "$ROOTFS/$f"; then
			# It is VERY important that this only happen if the
			# pseudofs isn't already mounted.  If it already is then
			# this is virtually impossible to troubleshoot because it
			# looks like the subsequent umount just isn't working.
			mount -r --rbind /$f "$ROOTFS/$f" --make-rslave
		fi
	done
	if ! mountpoint -q "$ROOTFS/tmp"; then
		mkdir -p "$ROOTFS/tmp"
		mount -o mode=0755,nosuid,nodev -t tmpfs tmpfs "$ROOTFS/tmp"
	fi
}

umount_pseudofs() {
	# This function cleans up the mounts in the chroot.  Failure to
	# clean up these mounts will prevent the tmpdir from being
	# deletable instead throwing the error "Device or Resource Busy".
	# The '-f' option is passed to umount to account for the
	# contingency where the psuedofs mounts are not present.
	if [ -d "${ROOTFS}" ]; then
		for f in dev proc sys; do
			umount -R -f "$ROOTFS/$f" >/dev/null 2>&1
		done
	fi
	umount -f "$ROOTFS/tmp" >/dev/null 2>&1
}

run_cmd_target() {
	info_msg "Running $* for target $XBPS_TARGET_ARCH ..."
	if is_target_native "$XBPS_TARGET_ARCH"; then
		# This is being run on the same architecture as the host,
		# therefore we should set XBPS_ARCH.
		if ! eval XBPS_ARCH="$XBPS_TARGET_ARCH" "$@"; then
			die "Could not run command $*"
		fi
	else
		# This is being run on a foriegn arch, therefore we should set
		# XBPS_TARGET_ARCH.  In this case XBPS will not attempt
		# certain actions and will require reconfiguration later.
		if ! eval XBPS_TARGET_ARCH="$XBPS_TARGET_ARCH" "$@"; then
			die "Could not run command $*"
		fi
	fi
}

run_cmd_chroot() {
	# General purpose chroot function which makes sure the chroot is
	# prepared.  This function takes 2 arguments, the location to
	# chroot to and the command to run.

	# This is an idempotent function, it is safe to call every time
	# before entering the chroot.  This has the advantage of making
	# execution in the chroot appear as though it "Just Works(tm)".
	register_binfmt

	# Before we step into the chroot we need to make sure the
	# pseudo-filesystems are ready to go.  Not all commands will need
	# this, but its still a good idea to call it here anyway.
	mount_pseudofs

	# With assurance that things will run now we can jump into the
	# chroot and run stuff!
	chroot "$1" sh -c "$2"
	#	chroot "$1" bash -c "$2"
}

cleanup_chroot() {
	# This function cleans up the chroot shims that are used by QEMU
	# to allow builds on alien platforms.  It takes no arguments but
	# expects the global $ROOTFS variable to be set.

	# Un-Mount the pseudofs mounts if they were mounted
	umount_pseudofs
}

register_binfmt() {
	# This function sets up everything that is needed to be able to
	# chroot into a ROOTFS and be able to run commands there.  This
	# really matters on platforms where the host architecture is
	# different from the target, and you wouldn't be able to run
	# things like xbps-reconfigure -a.  This function is idempotent
	# (You can run it multiple times without modifying state).  This
	# function takes no arguments, but does expect the global variable
	# $XBPS_TARGET_ARCH to be set.

	# This select sets up the "magic" bytes in /proc that let the
	# kernel select an alternate interpreter.  More values for this
	# map can be obtained from here:
	# https://github.com/qemu/qemu/blob/master/scripts/qemu-binfmt-conf.sh

	# If the XBPS_TARGET_ARCH is unset but the PLATFORM is known, it
	# may be possible to set the architecture from the static
	# platforms map.
	if [ -z "$XBPS_TARGET_ARCH" ] && [ ! -z "$PLATFORM" ]; then
		set_target_arch_from_platform
	fi

	# In the special case where the build is native we can return
	# without doing anything else
	# This is only a basic check for identical archs, with more careful
	# checks below for cases like ppc64 -> ppc and x86_64 -> i686.
	_hostarch="${HOSTARCH%-musl}"
	_targetarch="${XBPS_TARGET_ARCH%-musl}"
	if [ "$_hostarch" = "$_targetarch" ]; then
		return
	fi

	case "${_targetarch}" in
	armv*)
		# TODO: detect aarch64 hosts that run 32 bit ARM without qemu (some cannot)
		if ([ "${_targetarch}" = "armv6l" ] && [ "${_hostarch}" = "armv7l" ]); then
			return
		fi
		if [ "${_targetarch}" = "armv5tel" -a \
			\( "${_hostarch}" = "armv6l" -o "${_hostarch}" = "armv7l" \) ]; then
			return
		fi
		_cpu=arm
		_magic="\x7fELF\x01\x01\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x02\x00\x28\x00"
		_mask="\xff\xff\xff\xff\xff\xff\xff\x00\xff\xff\xff\xff\xff\xff\xff\xff\xfe\xff\xff\xff"
		;;
	aarch64)
		_cpu=aarch64
		_magic="\x7fELF\x02\x01\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x02\x00\xb7"
		_mask="\xff\xff\xff\xff\xff\xff\xff\x00\xff\xff\xff\xff\xff\xff\xff\xff\xfe\xff\xff"
		;;
	ppc64le)
		_cpu=ppc64le
		_magic="\x7fELF\x02\x01\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x02\x00\x15\x00"
		_mask="\xff\xff\xff\xff\xff\xff\xff\x00\xff\xff\xff\xff\xff\xff\xff\xff\xfe\xff\xff\x00"
		;;
	ppc64)
		_cpu=ppc64
		_magic="\x7fELF\x02\x02\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x02\x00\x15"
		_mask="\xff\xff\xff\xff\xff\xff\xff\x00\xff\xff\xff\xff\xff\xff\xff\xff\xff\xfe\xff\xff"
		;;
	ppc)
		if [ "$_hostarch" = "ppc64" ]; then
			return
		fi
		_cpu=ppc
		_magic="\x7fELF\x01\x02\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x02\x00\x14"
		_mask="\xff\xff\xff\xff\xff\xff\xff\x00\xff\xff\xff\xff\xff\xff\xff\xff\xff\xfe\xff\xff"
		;;
	mipsel)
		if [ "$_hostarch" = "mips64el" ]; then
			return
		fi
		_cpu=mipsel
		_magic="\x7fELF\x01\x01\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x02\x00\x08\x00"
		_mask="\xff\xff\xff\xff\xff\xff\xff\x00\xff\xff\xff\xff\xff\xff\xff\xff\xfe\xff\xff\xff"
		;;
	x86_64)
		_cpu=x86_64
		_magic="\x7f\x45\x4c\x46\x02\x01\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x02\x00\x3e\x00"
		_mask="\xff\xff\xff\xff\xff\xfe\xfe\xfc\xff\xff\xff\xff\xff\xff\xff\xff\xfe\xff\xff\xff"
		;;
	i686)
		if [ "$_hostarch" = "x86_64" ]; then
			return
		fi
		_cpu=i386
		_magic="\x7f\x45\x4c\x46\x01\x01\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x02\x00\x03\x00"
		_mask="\xff\xff\xff\xff\xff\xfe\xfe\xff\xff\xff\xff\xff\xff\xff\xff\xff\xfe\xff\xff\xff"
		;;
	*)
		die "Unknown target architecture!"
		;;
	esac

	# For builds that do not match the host architecture, the correct
	# qemu binary will be required.
	QEMU_BIN="qemu-${_cpu}-static"
	if ! $QEMU_BIN -version >/dev/null 2>&1; then
		die "$QEMU_BIN binary is missing in your system, exiting."
	fi

	# In order to use the binfmt system the binfmt_misc mountpoint
	# must exist inside of proc
	if ! mountpoint -q /proc/sys/fs/binfmt_misc; then
		modprobe -q binfmt_misc
		mount -t binfmt_misc binfmt_misc /proc/sys/fs/binfmt_misc 2>/dev/null
	fi

	# Only register if the map is incomplete
	if [ ! -f /proc/sys/fs/binfmt_misc/qemu-$_cpu ]; then
		echo ":qemu-$_cpu:M::$_magic:$_mask:/usr/bin/$QEMU_BIN:F" >/proc/sys/fs/binfmt_misc/register 2>/dev/null
	fi
}

set_target_arch_from_platform() {
	# This function maintains a lookup from platform to target
	# architecture.  This is required for scripts that need to know
	# the target architecture, but don't necessarily need to know it
	# internally (i.e. only run_cmd_chroot).
	case "$PLATFORM" in
	bananapi*) XBPS_TARGET_ARCH="armv7l" ;;
	beaglebone*) XBPS_TARGET_ARCH="armv7l" ;;
	cubieboard2* | cubietruck*) XBPS_TARGET_ARCH="armv7l" ;;
	odroid-u2*) XBPS_TARGET_ARCH="armv7l" ;;
	odroid-c2*) XBPS_TARGET_ARCH="aarch64" ;;
	rpi-aarch64*) XBPS_TARGET_ARCH="aarch64" ;;
	rpi-armv7l*) XBPS_TARGET_ARCH="armv7l" ;;
	rpi-armv6l*) XBPS_TARGET_ARCH="armv6l" ;;
	ci20*) XBPS_TARGET_ARCH="mipsel" ;;
	i686*) XBPS_TARGET_ARCH="i686" ;;
	x86_64*) XBPS_TARGET_ARCH="x86_64" ;;
	GCP*) XBPS_TARGET_ARCH="x86_64" ;;
	pinebookpro*) XBPS_TARGET_ARCH="aarch64" ;;
	pinephone*) XBPS_TARGET_ARCH="aarch64" ;;
	rock64*) XBPS_TARGET_ARCH="aarch64" ;;
	*) die "$PROGNAME: Unable to compute target architecture from platform" ;;
	esac

	if [ -z "${PLATFORM##*-musl}" ]; then
		XBPS_TARGET_ARCH="${XBPS_TARGET_ARCH}-musl"
	fi
}

set_dracut_args_from_platform() {
	# In rare cases it is necessary to set platform specific dracut
	# args.  This is mostly the case on ARM platforms.
	case "$PLATFORM" in
	*) ;;
	esac
}

set_cachedir() {
	# The package artifacts are cacheable, but they need to be isolated
	# from the host cache.
	: "${XBPS_CACHEDIR:=--cachedir=$PWD/xbps-cache/${XBPS_TARGET_ARCH}}"
}

replicate() {
	local char="${1:-#}"
	local nsize="${2:-$(tput cols)}"
	# Gera linha com substituição direta sem forks extras
	printf -v _line "%*s" "$nsize" && printf '%b\n' "${blue}${_line// /$char}${reset}"
}

select_mirrors_dialog() {
	local cgithub='/vg/void-mirror/extra'
	local cvc='/vg/void-mirror'
	local cfastly='https://repo-fastly.voidlinux.org'
	local cvoidbr='https://void.voidbr.org/voidlinux'
	local cvoidlinux='https://void.voidlinux.com.br/voidlinux'
	local cchili='https://void.chililinux.com/voidlinux'
	local repo
	declare -a repos=()

	if ! $automatic; then
		repo=$(
			dialog \
				--stdout \
				--clear \
				--backtitle "Void Linux Mirror Selection" \
				--title "Selecione um ou mais mirrors" \
				--checklist "Use ESPAÇO para marcar e ENTER para confirmar:" \
				00 00 00 \
				$cgithub "Mirror Brasil VoidLinux" on \
				$cvc "Mirror Brasil VoidLinux" on \
				$cvoidbr "Mirror Brasil VoidBR" off \
				$cvoidlinux "Mirror Brasil VoidLinux" off \
				$cchili "Mirror Brasil ChiliLinux" off \
				$cfastly "Mirror Oficial Fastly" on
		)

		status=$?
		if ((status != 0)); then
			echo "Cancelado."
			exit 1
		fi
		repos+=("$repo")
	else
		repos+=("$cfastly")
		repos+=("$cgithub")
		repos+=("$cvc")
		repos+=("$cvoidbr")
		repos+=("$cchili")
		repos+=("$cvoidlinux")
	fi

	AREPOSITORY=()
  replicate
	for mirror in "${repos[@]}"; do
		if ! test_repo_online "$mirror/current"; then
			continue
		fi

		public_repos+=($mirror)

		case $mirror in
		$cgithub)
			AREPOSITORY+=("repository=$mirror/current")
			;;
		$cvc)
			AREPOSITORY+=("repository=$mirror/voidlinux/current")
			AREPOSITORY+=("repository=$mirror/extra")
			AREPOSITORY+=("repository=$mirror/voidlinux/current/nonfree")
			AREPOSITORY+=("repository=$mirror/voidlinux/current/multilib")
			AREPOSITORY+=("repository=$mirror/voidlinux/current/multilib/nonfree")
			;;
		$cchili)
			AREPOSITORY+=("repository=$mirror/extra")
			;;
		$cvoidbr | $cvoidlinux | $cchili)
			AREPOSITORY+=("repository=$mirror/current")
			AREPOSITORY+=("repository=$mirror/extra")
			AREPOSITORY+=("repository=$mirror/current/nonfree")
			AREPOSITORY+=("repository=$mirror/current/multilib")
			AREPOSITORY+=("repository=$mirror/current/multilib/nonfree")
			;;
		*)
			AREPOSITORY+=("repository=$mirror/current")
			AREPOSITORY+=("repository=$mirror/current/nonfree")
			AREPOSITORY+=("repository=$mirror/current/multilib")
			AREPOSITORY+=("repository=$mirror/current/multilib/nonfree")
			;;
		esac
	done

	XBPS_REPOSITORY="$(
		printf '%s\n' "${AREPOSITORY[@]}" |
			sed 's/^repository=/--repository=/' |
			tr '\n' ' '
	)"

	#echo "${AREPOSITORY[@]}"
	#echo
	#echo "${XBPS_REPOSITORY[@]}"
	replicate

}

sh_create_etc_xbps_d_conf_00_repository_main_conf() {
	local conf="$1"
	#	debug "$conf"
	mkdir -pv "${conf%/*}"
	rm -f "$conf"
	printf '%s\n' "${AREPOSITORY[@]}" >"$conf"
}

rk33xx_flash_uboot() {
	local dir="$1"
	local dev="$2"
	dd if="${dir}/idbloader.img" of="${dev}" seek=64 conv=notrunc,fsync >/dev/null 2>&1
	dd if="${dir}/u-boot.itb" of="${dev}" seek=16384 conv=notrunc,fsync >/dev/null 2>&1
}

# This library is the authoritative source of the platform map,
# because of this we may need to get this information from the command
# line.  This select allows us to get that information out.  This
# fails silently if the toolname isn't known since this script is
# sourced.
case $1 in
platform2arch)
	PLATFORM=$2
	set_target_arch_from_platform
	echo "$XBPS_TARGET_ARCH"
	;;
esac
