# Mettre Bouture en ligne sur un serveur (VPS)

## Une fois, sur le serveur

1. Un serveur Linux (Debian ou Ubuntu) avec Docker : `curl -fsSL https://get.docker.com | sh`.
2. Un nom de domaine (ou un sous-domaine) dont l'enregistrement DNS A pointe vers l'adresse IP du serveur.
3. Le pare-feu laisse passer les ports 22, 80 et 443, et rien d'autre.
4. Le dépôt et les secrets :

   ```bash
   sudo mkdir -p /opt/bouture && sudo chown $USER /opt/bouture
   git clone https://github.com/<compte>/bouture.git /opt/bouture
   cd /opt/bouture
   cp .env.production.example .env   # puis remplir : mot de passe, secret, domaine
   ```

5. Le premier lancement, puis le premier compte :

   ```bash
   docker compose -f compose.prod.yaml up -d --build
   docker compose -f compose.prod.yaml exec api node dist/cli/create-user.js vous@exemple.fr "Prénom Nom" admin
   ```

Caddy obtient le certificat HTTPS au premier accès au domaine.

## À chaque fusion sur main

La CI (`.github/workflows/ci.yml`) vérifie le code puis se connecte au serveur en SSH pour le mettre à jour.
Dans le dépôt GitHub, créer la variable `DEPLOY_ENABLED` à `true` (Settings, Secrets and variables, Actions, onglet Variables), puis l'environnement `recette` (Settings, Environments) avec trois secrets :

| Secret        | Contenu                                                                                                     |
| ------------- | ----------------------------------------------------------------------------------------------------------- |
| `VPS_HOST`    | l'adresse du serveur                                                                                        |
| `VPS_USER`    | l'utilisateur qui a cloné le dépôt                                                                          |
| `VPS_SSH_KEY` | une clé privée SSH dédiée au déploiement, dont la clé publique est dans `~/.ssh/authorized_keys` du serveur |

## Vérifier

```bash
docker compose -f compose.prod.yaml ps        # les trois services « running »
docker compose -f compose.prod.yaml logs api  # les journaux de l'API
```
