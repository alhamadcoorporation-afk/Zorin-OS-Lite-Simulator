# Zorin OS Lite Simulator

Simulation avancée inspirée de Zorin OS Lite, entièrement modifiable dans le navigateur.

## Fonctionnalités

- Bureau Zorin-like
- Écran de démarrage et écran de connexion
- Menu Démarrer
- Terminal avec commandes shell simulées
- Gestionnaire de fichiers
- Notes
- Navigateur, calculatrice, paramètres, boutique d’applications
- Applications préinstallées
- Sauvegarde locale dans le navigateur
- Export du système modifié en JSON + ZIP

## Utilisation

1. Ouvrez `index.html` dans votre navigateur.
2. Connectez-vous avec :
   - utilisateur : `alhamad`
   - mot de passe : `1234`
3. Utilisez le terminal pour modifier le système.

### Commandes disponibles

- `help`
- `ls`
- `pwd`
- `whoami`
- `cat <fichier>`
- `echo <texte>`
- `mkdir <nom>`
- `install <app>`
- `uninstall <app>`
- `apps`
- `theme <light|dark|blue|green>`
- `export`
- `clear`
- `reboot`
- `info`

## Exemple

```bash
install music
install office
theme dark
export
```

## Téléchargement

Vous pouvez télécharger l’état du système modifié directement depuis le bureau en cliquant sur le bouton "Télécharger" ou via le terminal avec `export`.

## Déploiement GitHub Pages

Pour l’héberger en ligne sur GitHub Pages :

1. Créez un dépôt GitHub
2. Ajoutez ces fichiers
3. Activez GitHub Pages depuis les paramètres du dépôt
4. Publiez la branche `main`

## Personnalisation

Vous pouvez modifier :
- les applications dans `script.js`
- la palette de couleurs dans `style.css`
- le thème et les fichiers par défaut dans `script.js`

Ce simulateur est conçu pour être un environnement de bureau expérimental, passif et modifiable depuis le navigateur.

