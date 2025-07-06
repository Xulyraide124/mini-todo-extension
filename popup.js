// popup.js

// Récupération des éléments du DOM
const taskInput = document.getElementById('taskInput');
const dueDateInput = document.getElementById('dueDateInput');
const addTaskButton = document.getElementById('addTaskButton');
const taskList = document.getElementById('taskList');

// Tableau pour stocker les tâches
let tasks = [];

// Définition du type de stockage à utiliser : sync pour la synchronisation, local sinon
const storageType = chrome.storage.sync; // Changement ici : utilise sync au lieu de local

/**
 * Charge les tâches depuis le stockage du navigateur (sync ou local).
 * Appelé au démarrage de la popup.
 */
async function loadTasks() {
    try {
        const result = await storageType.get('tasks'); // Utilise storageType
        tasks = result.tasks || [];
        sortAndRenderTasks();
    } catch (error) {
        console.error("Erreur lors du chargement des tâches :", error);
    }
}

/**
 * Sauvegarde le tableau de tâches actuel dans le stockage du navigateur (sync ou local).
 * Appelé après chaque modification (ajout, suppression, changement d'état, édition).
 */
async function saveTasks() {
    try {
        await storageType.set({ tasks: tasks }); // Utilise storageType
    } catch (error) {
        console.error("Erreur lors de la sauvegarde des tâches :", error);
    }
}

/**
 * Trie les tâches et les affiche dans l'interface utilisateur.
 * Le tri est effectué par :
 * 1. Statut (tâches non complétées en premier)
 * 2. Date limite (les plus proches en premier, puis les tâches sans date)
 * 3. ID (pour maintenir un ordre stable si les dates sont identiques ou absentes)
 */
function sortAndRenderTasks() {
    tasks.sort((a, b) => {
        // 1. Tâches non complétées avant les complétées
        if (a.completed !== b.completed) {
            return a.completed ? 1 : -1;
        }

        // 2. Tâches avec date limite avant celles sans date
        if (a.dueDate && !b.dueDate) return -1;
        if (!a.dueDate && b.dueDate) return 1;

        // 3. Comparaison des dates si les deux ont une date
        if (a.dueDate && b.dueDate) {
            const dateA = new Date(a.dueDate + 'T00:00:00'); // Ajoute T00:00:00 pour éviter les problèmes de fuseau horaire
            const dateB = new Date(b.dueDate + 'T00:00:00');
            if (dateA.getTime() !== dateB.getTime()) {
                return dateA.getTime() - dateB.getTime();
            }
        }

        // 4. Si tout est égal, tri par ID (les plus récentes en premier)
        return b.id - a.id;
    });
    renderTasks();
}

/**
 * Affiche toutes les tâches du tableau 'tasks' dans l'interface utilisateur.
 * Vide la liste existante avant de la reconstruire.
 */
function renderTasks() {
    taskList.innerHTML = '';

    tasks.forEach(task => {
        const listItem = document.createElement('li');
        listItem.className = `task-item flex items-center p-3 rounded-lg ${task.completed ? 'task-completed' : ''}`;
        listItem.dataset.id = task.id;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.className = 'task-checkbox w-5 h-5 rounded-md border-gray-300 text-blue-600 focus:ring-blue-500';
        checkbox.addEventListener('change', () => toggleTaskCompletion(task.id));

        const taskContentWrapper = document.createElement('div');
        taskContentWrapper.className = 'flex-grow flex flex-col ml-3';

        const taskText = document.createElement('span');
        taskText.className = `task-text text-gray-800 ${task.completed ? 'line-through text-gray-500' : ''}`;
        taskText.textContent = task.text;
        taskText.addEventListener('click', () => enableTaskEditing(task.id, taskText));

        taskContentWrapper.appendChild(taskText);

        // Affichage de la date limite si elle existe
        if (task.dueDate) {
            const dueDateSpan = document.createElement('span');
            dueDateSpan.className = 'task-due-date text-gray-500 text-sm mt-1';
            const date = new Date(task.dueDate + 'T00:00:00');
            dueDateSpan.textContent = `Pour le : ${date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}`;
            taskContentWrapper.appendChild(dueDateSpan);
        }

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 transition duration-200 ease-in-out';
        deleteButton.textContent = 'Supprimer';
        deleteButton.addEventListener('click', () => deleteTask(task.id));

        listItem.appendChild(checkbox);
        listItem.appendChild(taskContentWrapper);
        listItem.appendChild(deleteButton);

        taskList.appendChild(listItem);
    });
}

/**
 * Active le mode édition pour une tâche spécifique.
 * Remplace le span de texte par un input.
 * @param {number} id - L'ID de la tâche à modifier.
 * @param {HTMLElement} taskTextSpan - L'élément span contenant le texte de la tâche.
 */
function enableTaskEditing(id, taskTextSpan) {
    const task = tasks.find(t => t.id === id);
    if (task && task.completed) {
        return;
    }

    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.value = taskTextSpan.textContent;
    editInput.className = 'task-edit-input flex-grow';

    taskTextSpan.parentNode.replaceChild(editInput, taskTextSpan);
    editInput.focus();

    const saveEdit = () => {
        const newText = editInput.value.trim();
        if (newText === '') {
            updateTaskText(id, taskTextSpan.textContent); // Revert to old text if empty
        } else {
            updateTaskText(id, newText);
        }
        renderTasks(); // Re-render the list to ensure everything is updated
    };

    editInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            saveEdit();
        }
    });

    editInput.addEventListener('blur', saveEdit);
}

/**
 * Met à jour le texte d'une tâche spécifique dans le tableau 'tasks'.
 * @param {number} id - L'ID de la tâche à modifier.
 * @param {string} newText - Le nouveau texte de la tâche.
 */
function updateTaskText(id, newText) {
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex > -1) {
        tasks[taskIndex].text = newText;
        saveTasks();
    }
}

/**
 * Ajoute une nouvelle tâche au tableau 'tasks' et met à jour l'interface.
 */
function addTask() {
    const text = taskInput.value.trim();
    const dueDate = dueDateInput.value;

    if (text === '') {
        return;
    }

    const newTask = {
        id: Date.now(),
        text: text,
        completed: false,
        dueDate: dueDate
    };

    tasks.push(newTask);
    saveTasks();
    sortAndRenderTasks();
    taskInput.value = '';
    dueDateInput.value = '';
}

/**
 * Inverse l'état 'completed' d'une tâche spécifique.
 * @param {number} id - L'ID de la tâche à modifier.
 */
function toggleTaskCompletion(id) {
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex > -1) {
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        saveTasks();
        sortAndRenderTasks();
    }
}

/**
 * Supprime une tâche spécifique du tableau 'tasks'.
 * @param {number} id - L'ID de la tâche à supprimer.
 */
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    sortAndRenderTasks();
}

// Écouteurs d'événements
addTaskButton.addEventListener('click', addTask);

taskInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        addTask();
    }
});

// Charge les tâches dès que le DOM est complètement chargé.
document.addEventListener('DOMContentLoaded', loadTasks);
