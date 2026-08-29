#!/bin/sh
# -*- mode: shell-script; indent-tabs-mode: nil; sh-basic-offset: 4; -*-
# ex: ts=8 sw=4 sts=4 et filetype=sh

# Se o plymouth ainda estiver rodando (cmdline usa "quiet splash"), ele
# fica com o console aberto escutando teclado (ESC pra ver mensagens),
# competindo com o nosso shell pela mesma leitura -- isso é o que
# provavelmente causa caracteres sumindo/embaralhados na digitação.
# Manda ele soltar a tela antes de mexer em qualquer coisa.
command -v plymouth >/dev/null 2>&1 && plymouth --hide-splash 2>/dev/null
command -v plymouth >/dev/null 2>&1 && plymouth quit 2>/dev/null

# Reabre stdin/stdout/stderr direto no console ATIVO. Se o console
# trocou de modo (ex: fbcon assumindo depois do plymouth/framebuffer,
# como vimos no dmesg -- "Console: switching to colour frame buffer
# device") o descritor antigo de stdin/stdout do hook pode ficar
# "torto" pra ioctls de terminal, e isso é o que quebra o eco/stty
# mesmo rodando "stty sane" depois.
exec </dev/console >/dev/console 2>&1

# Corrige o eco/modo da tty. Alguns comandos (chsh, passwd, etc.) mexem
# na configuração do terminal para leitura de senha e, se morrem no meio
# do caminho (sinal, crash), não chegam a restaurar -- daí a digitação
# some no shell de emergência. Isso conserta antes do prompt aparecer.
stty sane 2>/dev/null
stty echo icanon 2>/dev/null

echo
echo "=================================================================="
echo " VoidBR - o boot caiu num shell de emergencia (dracut)"
echo "=================================================================="
echo
echo "Isso normalmente significa que algum passo do initramfs falhou ou"
echo "travou antes do sistema real assumir o controle."
echo
echo "Comandos uteis a partir daqui:"
echo "  dmesg | tail -n 60                  - ultimas mensagens do kernel"
echo "  cat /run/initramfs/rdsosreport.txt  - relatorio completo gerado"
echo "  cat /proc/cmdline                   - parametros de boot usados"
echo "  lsblk / blkid                       - discos e particoes detectados"
echo "  fsck /dev/sdXN                      - verifica/repara uma particao"
echo "  mount /dev/sdXN /mnt                - monta uma particao manualmente"
echo "  exit                                - tenta continuar o boot"
echo "  reboot -f                           - reinicia a maquina"
echo

_hits="$(dmesg 2>/dev/null | grep -iE 'segfault|signal|killed|trap|oops|panic|fail' | tail -n 15)"
if [ -n "$_hits" ]; then
	echo "Linhas do dmesg que podem indicar a causa:"
	echo "------------------------------------------------------------------"
	echo "$_hits"
	echo "------------------------------------------------------------------"
	echo
fi

# Dracut cairia num shell "sh" (dash/busybox) por padrão -- troca pra
# bash, que já está no initramfs (garantido no module-setup.sh), pra
# ter histórico, edição de linha e o resto do conforto de um shell de
# verdade. "setsid -c" (quando disponível) cria uma sessão de verdade
# associando o console como terminal controlador -- resolve também o
# aviso de "no job control in this shell". Cai pro sh só se nem bash
# existir.
if command -v setsid >/dev/null 2>&1 && [ -x /bin/bash ]; then
	exec setsid -c /bin/bash
elif [ -x /bin/bash ]; then
	exec /bin/bash
else
	echo "(bash não encontrado no initramfs -- caindo no sh padrão)"
fi
