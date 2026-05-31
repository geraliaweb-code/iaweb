# VPS Audit

## Estado

Auditoria remota nao executada.

Motivo: neste ambiente nao existe acesso SSH configurado para o VPS.

Verificacoes locais realizadas:

- `C:\Users\User\.ssh` existe.
- Nao existe `C:\Users\User\.ssh\config`.
- Nao foram encontradas chaves SSH listadas em `C:\Users\User\.ssh`.
- Existem apenas `known_hosts` e `known_hosts.old`.
- O projeto nao contem referencias locais a Hetzner, VPS, systemd, Docker, `/opt` ou dependencias da ENERSIA.
- `git remote -v` aponta para `https://github.com/geraliaweb-code/iaweb.git`.

## Auditoria pendente no VPS

Quando houver acesso SSH configurado, executar apenas comandos read-only.

### CPU, RAM e disco

```bash
hostnamectl
lscpu
free -h
df -h
lsblk
uptime
```

### Servicos systemd ativos

```bash
systemctl list-units --type=service --state=running --no-pager
systemctl list-unit-files --type=service --no-pager
```

### Portas abertas

```bash
ss -tulpn
```

### Containers Docker

```bash
docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}"
docker compose ls
```

### Diretorios principais em `/opt`

```bash
ls -la /opt
find /opt -maxdepth 2 -type f \( -name "docker-compose.yml" -o -name "compose.yml" -o -name ".env" -o -name "package.json" \) -print
```

### Dependencias ENERSIA

Confirmar:

- diretorio de deploy da ENERSIA
- processo principal
- reverse proxy usado
- portas ocupadas
- variaveis de ambiente
- jobs ou timers systemd
- containers e volumes Docker
- certificados TLS
- dominios configurados

## Riscos de coexistencia ENERSIA + IAWEB

Riscos a validar quando houver SSH:

- conflito de portas entre apps Next.js ou Node
- conflito de nomes de containers Docker
- uso partilhado de `.env` ou secrets
- reverse proxy sem isolamento por dominio
- certificados TLS misturados
- falta de limites de memoria para processos/containers
- deploys manuais que sobrescrevem diretorios existentes
- backups nao separados por projeto
- logs acumulados sem rotacao

## Estrutura recomendada para IAWEB

Proposta futura, sem instalar nada agora:

```text
/opt/iaweb/
  app/
  releases/
  shared/
    .env
    logs/
    uploads/
  backups/
```

Se for usado Docker:

```text
/opt/iaweb/
  compose.yml
  .env
  app/
```

Recomendacoes:

- usar dominio/subdominio separado para IAWEB
- usar porta interna propria para IAWEB
- separar variaveis de ambiente da ENERSIA
- separar logs e backups
- nomear servicos/containers com prefixo `iaweb`
- nao reutilizar volumes da ENERSIA
- configurar reverse proxy por hostname

## Proximo desbloqueio

Configurar um alias SSH local, por exemplo:

```sshconfig
Host iaweb-vps
  HostName <ip-ou-hostname>
  User <utilizador>
  IdentityFile ~/.ssh/<chave>
```

Depois repetir esta auditoria com:

```bash
ssh iaweb-vps "hostnamectl; free -h; df -h; ss -tulpn"
```
