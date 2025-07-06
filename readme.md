
# Mini-Gestionnaire de Tâches (Extension Chrome)

Ce projet est une extension de navigateur simple et efficace, conçue pour vous aider à gérer vos tâches quotidiennes directement depuis votre navigateur Chrome. Inspiré par des outils comme Todoist, il offre une interface utilisateur minimaliste mais fonctionnelle pour ajouter, suivre et organiser vos tâches.

## 🚀 Fonctionnalités

  * **Ajout de Tâches** : Ajoutez rapidement de nouvelles tâches via un champ de saisie dédié.
  * **Gestion des Dates Limites** : Attribuez une date limite à chaque tâche pour mieux organiser votre emploi du temps.
  * **Marquer comme Complété** : Cochez les tâches terminées pour les barrer visuellement.
  * **Édition de Tâches** : Cliquez directement sur le texte d'une tâche pour la modifier.
  * **Suppression de Tâches** : Supprimez facilement les tâches qui ne sont plus nécessaires.
  * **Persistance des Données** : Vos tâches sont sauvegardées localement et persistent même après la fermeture du navigateur.
  * **Synchronisation (via Compte Google)** : Les tâches sont synchronisées avec votre compte Google, vous permettant d'accéder à votre liste sur n'importe quel appareil Chrome où vous êtes connecté.
  * **Tri Intelligent** : Les tâches sont automatiquement triées : les tâches non complétées apparaissent avant les complétées, puis par date limite (les plus proches en premier), et enfin par ordre d'ajout.

## 🛠️ Technologies Utilisées

  * **HTML5** : Structure de l'interface utilisateur de la popup.
  * **CSS3** : Stylisation de l'interface, incluant une base avec [Tailwind CSS](https://tailwindcss.com/) pour un développement rapide et un CSS personnalisé pour des ajustements spécifiques.
  * **JavaScript (ES6+)** : Logique métier de l'extension, manipulation du DOM, gestion des événements et interaction avec les APIs Chrome.
  * **Chrome Extension APIs** :
      * `chrome.action` : Pour définir la popup de l'extension.
      * `chrome.storage.sync` : Pour la persistance et la synchronisation des données des tâches avec le compte Google de l'utilisateur.

## ⚙️ Installation de l'extension

Pour installer et tester cette extension sur votre navigateur Chrome :

1.  **Téléchargez le code** : Clonez ce dépôt GitHub ou téléchargez l'archive ZIP et décompressez-la.
    ```bash
    git clone https://github.com/Xulyraide124/mini-todo-extension.git 
    ```
2.  **Créez le dossier des icônes** : À la racine du projet, créez un dossier nommé `icons`.
3.  **Ajoutez les icônes** : Placez-y trois fichiers d'image (par exemple, `.png`) nommés `icon16.png`, `icon48.png`, et `icon128.png`. Ces images serviront d'icônes pour votre extension.
4.  **Ouvrez Chrome Extensions** : Dans votre navigateur Chrome, tapez `chrome://extensions/` dans la barre d'adresse et appuyez sur `Entrée`.
5.  **Activez le mode développeur** : En haut à droite de la page, activez le bouton "**Mode développeur**".
6.  **Chargez l'extension** : Cliquez sur le bouton "**Charger l'extension non empaquetée**".
7.  **Sélectionnez le dossier** : Naviguez jusqu'au dossier racine de votre projet (`mini-todo-extension/` si vous l'avez nommé ainsi) et sélectionnez-le.

L'extension devrait maintenant apparaître dans votre liste d'extensions. Vous verrez son icône dans la barre d'outils de Chrome (vous devrez peut-être cliquer sur l'icône en forme de pièce de puzzle pour l'épingler pour un accès facile).

## 🚀 Comment utiliser l'extension

1.  **Ouvrir la Popup** : Cliquez sur l'icône de l'extension dans votre barre d'outils Chrome.
2.  **Ajouter une Tâche** :
      * Tapez le nom de votre tâche dans le champ "Ajouter une nouvelle tâche...".
      * (Optionnel) Sélectionnez une date limite à l'aide du champ de date.
      * Cliquez sur le bouton "**Ajouter**" ou appuyez sur `Entrée`.
3.  **Marquer/Démarquer une Tâche** : Cliquez sur la **case à cocher** à côté de la tâche pour la marquer comme complétée (le texte sera barré) ou la démarquer.
4.  **Modifier une Tâche** : Cliquez sur le **texte d'une tâche** (non complétée) pour la rendre éditable. Appuyez sur `Entrée` ou cliquez en dehors du champ pour sauvegarder les modifications.
5.  **Supprimer une Tâche** : Cliquez sur le bouton "**Supprimer**" à côté de la tâche.

