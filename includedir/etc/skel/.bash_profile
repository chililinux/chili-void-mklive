# .bash_profile — instalado via /etc/skel pelo mkiso (-I includedir)
# Vira o perfil do usuário "anon" quando o dracut (módulo vmklive) cria
# a conta em tempo de boot (useradd -m copia /etc/skel pra dentro do
# $HOME recém-criado).
#
# Objetivo: com "live.autologin" no cmdline, a tty1 loga como anon
# sozinha — e este arquivo dispara o void-install na hora, tipo o
# instalador TUI (whiptail) das ISOs antigas do Debian.

# Só dispara na tty1 (autologin do live) — evita rodar de novo se o
# usuário abrir um terminal gráfico ou logar via ssh depois.
if [ "$(tty)" = "/dev/tty1" ]; then
    # roda o instalador; ao sair dele (ESC, Ctrl+C, ou fim da instalação),
    # cai num shell normal em vez de fechar a sessão.
    sudo /usr/bin/void-install
    echo
    echo "Instalador encerrado. Você está num shell bash normal agora."
    echo "Para rodar o instalador de novo: sudo void-install"
fi
