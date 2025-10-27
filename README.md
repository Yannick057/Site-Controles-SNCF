\# 🚄 Application Contrôles SNCF



Application web de gestion des contrôles à bord pour les agents SNCF. Permet la saisie, l'archivage et l'analyse statistique des contrôles de titres de transport.



\## 📋 Fonctionnalités



\### ✅ Saisie des contrôles

\- Enregistrement des informations de train (numéro, origine, destination, heure)

\- Comptage des personnes contrôlées avec boutons rapides (+5, +10)

\- \*\*Compteurs rapides STT\*\* :

&nbsp; - STT 50€ pour les tarifs contrôle

&nbsp; - STT 100€ pour les PV

\- Gestion des tarifs exceptionnels/bord

\- Gestion des tarifs contrôle (STT, RNV, Titre tiers, etc.)

\- Gestion des PV avec types multiples

\- Indicateurs RI (positif/négatif)

\- Ajout de commentaires et photos

\- \*\*Statistiques du train en temps réel\*\* (7 et 30 derniers jours)



\### 📊 Statistiques et analyses

\- Vue d'ensemble avec 5 indicateurs clés

\- Graphique par train (Top 10)

\- Graphique d'évolution par jour

\- Tableau récapitulatif détaillé par ligne



\### 📤 Import/Export

\- \*\*Export JSON\*\* : Sauvegarde complète de la base de données

\- \*\*Import JSON\*\* : Support des formats multiples (timestamp, date)

\- \*\*Export HTML\*\* : Rapport imprimable avec tri (par jour/train/origine)

\- \*\*Export PDF\*\* : Génération automatique avec impression



\### 🔧 Paramètres

\- Onglet Général : Langue, notes personnelles

\- Onglet Base de données : Import/Export/Suppression

\- Menu burger discret et moderne



\### 📱 Fonctionnalités avancées

\- \*\*Tableau triable\*\* : Clic sur les en-têtes pour trier par colonne

\- \*\*Stockage local\*\* : Toutes les données sont sauvegardées dans le navigateur

\- \*\*Design responsive\*\* : Adapté mobile et desktop

\- \*\*PWA Ready\*\* : Installable sur mobile



---



\## 📂 Structure du projet



📁 MonSiteSNCF/

│

├── 📄 index.html # Page principale (saisie + historique)

├── 📄 stats.html # Page statistiques et graphiques

├── 📄 styles.css # Tous les styles CSS

│

├── 📄 script-main.js # Script principal (formulaire, historique, tri)

├── 📄 script-exports.js # Script import/export (JSON, HTML, PDF)

├── 📄 script-stats.js # Script page statistiques (graphiques)

│

├── 📄 manifest.json # Manifeste PWA

└── 📄 README.md # Documentation (ce fichier)



---



\## 🚀 Installation



\### Option 1 : Utilisation locale

1\. Télécharge tous les fichiers dans un dossier

2\. Ouvre `index.html` dans un navigateur moderne (Chrome, Firefox, Edge)

3\. C'est tout ! L'application fonctionne sans serveur



\### Option 2 : Installation sur mobile (PWA)

1\. Héberge les fichiers sur un serveur web (GitHub Pages, Netlify, etc.)

2\. Ouvre l'URL sur mobile

3\. Ajoute à l'écran d'accueil via le menu du navigateur

4\. L'application s'ouvrira comme une app native



---



\## 🎯 Guide d'utilisation



\### 1️⃣ Saisir un contrôle

1\. Renseigne le numéro de train (affichage auto des stats sur 7/30 jours)

2\. Remplis origine, destination, heure de départ

3\. Indique le nombre de personnes contrôlées

4\. Utilise les compteurs STT 50€ et STT 100€ pour une saisie rapide

5\. Ajoute les tarifs exceptionnels, contrôles et PV si nécessaire

6\. Clique sur "💾 Enregistrer la saisie"



\### 2️⃣ Consulter l'historique

\- Tri par colonne : Clique sur les en-têtes (Date, Train, Origine, etc.)

\- Modifier : Clique sur ✏️ pour éditer un contrôle

\- Supprimer : Clique sur 🗑️ pour effacer un contrôle



\### 3️⃣ Exporter les données

1\. Sélectionne le type d'export (Par jour, Par train, Par origine)

2\. Clique sur "📄 Export HTML" ou "🖨️ Export PDF"

3\. Pour sauvegarder la base : Menu burger ☰ → Base de données → Exporter JSON



\### 4️⃣ Voir les statistiques

1\. Clique sur "📊 Statistiques" en haut à droite

2\. Consulte les graphiques et le tableau récapitulatif

3\. Retour à l'accueil avec "↩ Retour"



---



\## ⚙️ Configuration



\### API SNCF (optionnel)

Pour activer la vérification automatique du statut des trains :

1\. Obtiens une clé API sur \[SNCF Open Data](https://www.digital.sncf.com/startup/api)

2\. Ouvre `script-main.js`

3\. Remplace `YOUR\_SNCF\_API\_KEY` par ta clé API

const API\_KEY = "ta-cle-api-ici";





---



\## 🛠️ Technologies utilisées



\- \*\*HTML5\*\* : Structure de l'application

\- \*\*CSS3\*\* : Design moderne et responsive

\- \*\*JavaScript ES6\*\* : Logique et interactions

\- \*\*Chart.js\*\* : Graphiques statistiques

\- \*\*LocalStorage API\*\* : Stockage des données

\- \*\*PWA\*\* : Installation sur mobile



---



\## 🔒 Confidentialité et sécurité



\- ✅ \*\*100% local\*\* : Toutes les données sont stockées dans le navigateur

\- ✅ \*\*Pas de serveur\*\* : Aucune transmission de données vers l'extérieur

\- ✅ \*\*Pas de tracking\*\* : Aucun cookie, aucune analyse

\- ⚠️ \*\*Attention\*\* : Vide le cache du navigateur = perte des données (pense à exporter régulièrement en JSON)



---



\## 📝 Notes de version



\### Version 2.0 (Octobre 2025)

\- ✨ Ajout des compteurs STT rapides (50€ et 100€)

\- ✨ Stats du train en temps réel (7/30 jours)

\- ✨ Tableau triable par colonne

\- ✨ Export avec tri (par jour/train/origine)

\- 🔧 Code modulaire (3 fichiers JS séparés)

\- 🔧 Support du champ timestamp dans l'import

\- 🗑️ Suppression du graphique "Répartition des fraudes"



\### Version 1.0 (Juin 2025)

\- 🎉 Version initiale

\- Saisie, historique, statistiques

\- Import/Export JSON, HTML, PDF



---



\## 🆘 Support et contact



Pour toute question, suggestion ou bug :

\- Email : support@exemple.fr

\- GitHub : \[github.com/username/controles-sncf](https://github.com)



---



\## 📜 Licence



MIT License - Libre d'utilisation et de modification



---



\## 🙏 Remerciements



Développé pour faciliter le travail quotidien des agents de contrôle SNCF.



\*\*Bon contrôle ! 🚄✨\*\*







