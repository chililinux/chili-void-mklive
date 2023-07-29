#!/bin/sh
# -*- mode: shell-script; indent-tabs-mode: nil; sh-basic-offset: 4; -*-
# ex: ts=8 sw=4 sts=4 et filetype=sh

cat > "${NEWROOT}/etc/bash/bashrc.d/bashrc.sh" <<- EOF
#export PS1='\e[32;1m\u \e[33;1m→ \e[36;1m\h \e[37;0m\w\n\e[35;1m�# \e[m'
export PS1='\e[31m\u\e[33m@\e[36m\h\e[31m \e[0m\w# '
alias cls=clear
alias ls='ls -la --color=auto'
alias ed=nano
alias du='du -h'
alias dut='du -hs * | sort -h'
alias xcopyn='cp -Rpvan'
alias xcopy='cp -Rpva'
eval $(dircolors -b $HOME/.dircolors)

path() {
   echo -e "\${PATH//:/\\\n}"
}
EOF

