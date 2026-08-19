// ==========================================
// TASKFLOW
// PASO 9 - ORDENACIÓN DE TAREAS
// ==========================================


// ==========================================
// ELEMENTOS DEL DOM
// ==========================================

const addTaskBtn =
    document.getElementById("addTaskBtn");

const taskModal =
    document.getElementById("taskModal");

const closeModal =
    document.getElementById("closeModal");

const cancelTask =
    document.getElementById("cancelTask");

const taskForm =
    document.getElementById("taskForm");

const taskTitle =
    document.getElementById("taskTitle");

const taskDescription =
    document.getElementById("taskDescription");

const taskPriority =
    document.getElementById("taskPriority");

const taskList =
    document.getElementById("taskList");

const progressCircle =
    document.getElementById("progressCircle");

const modalTitle =
    document.getElementById("modalTitle");

const modalDescription =
    document.getElementById("modalDescription");

const saveTaskButton =
    document.getElementById("saveTaskButton");


// ==========================================
// BÚSQUEDA
// ==========================================

const searchInput =
    document.getElementById("searchInput");

const clearSearch =
    document.getElementById("clearSearch");


// ==========================================
// FILTROS
// ==========================================

const filterButtons =
    document.querySelectorAll(
        ".filter-button"
    );


// ==========================================
// ORDENACIÓN
// ==========================================

const sortSelect =
    document.getElementById("sortSelect");


// ==========================================
// VARIABLES
// ==========================================

let tasks =
    JSON.parse(
        localStorage.getItem("taskflow_tasks")
    ) || [];


let editingTaskId = null;

let currentFilter = "all";

let currentSearch = "";

let currentSort = "newest";


// ==========================================
// ABRIR MODAL PARA CREAR
// ==========================================

addTaskBtn.addEventListener(
    "click",
    function () {

        editingTaskId = null;

        modalTitle.textContent =
            "Nueva tarea";

        modalDescription.textContent =
            "Añade una nueva tarea a tu lista";

        saveTaskButton.textContent =
            "Guardar tarea";

        taskForm.reset();

        taskModal.classList.add("show");

        taskTitle.focus();

    }
);


// ==========================================
// CERRAR MODAL
// ==========================================

function closeTaskModal() {

    taskModal.classList.remove("show");

    taskForm.reset();

    editingTaskId = null;

}


closeModal.addEventListener(
    "click",
    closeTaskModal
);


cancelTask.addEventListener(
    "click",
    closeTaskModal
);


// ==========================================
// CERRAR AL PULSAR FUERA
// ==========================================

taskModal.addEventListener(
    "click",
    function (event) {

        if (event.target === taskModal) {

            closeTaskModal();

        }

    }
);


// ==========================================
// CREAR O EDITAR TAREA
// ==========================================

taskForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        // ==================================
        // EDITAR
        // ==================================

        if (editingTaskId !== null) {

            const task =
                tasks.find(
                    function (task) {

                        return task.id === editingTaskId;

                    }
                );


            if (task) {

                task.title =
                    taskTitle.value.trim();

                task.description =
                    taskDescription.value.trim();

                task.priority =
                    taskPriority.value;

            }

        }


        // ==================================
        // CREAR
        // ==================================

        else {

            const newTask = {

                id: Date.now(),

                title:
                    taskTitle.value.trim(),

                description:
                    taskDescription.value.trim(),

                priority:
                    taskPriority.value,

                completed: false,

                createdAt:
                    new Date()
                        .toLocaleDateString("es-ES")

            };


            tasks.push(newTask);

        }


        saveTasks();

        renderTasks();

        updateStats();

        closeTaskModal();

    }
);


// ==========================================
// GUARDAR EN LOCALSTORAGE
// ==========================================

function saveTasks() {

    localStorage.setItem(
        "taskflow_tasks",
        JSON.stringify(tasks)
    );

}


// ==========================================
// EDITAR TAREA
// ==========================================

function editTask(taskId) {

    const task =
        tasks.find(
            function (task) {

                return task.id === taskId;

            }
        );


    if (!task) {

        return;

    }


    editingTaskId =
        taskId;


    modalTitle.textContent =
        "Editar tarea";

    modalDescription.textContent =
        "Modifica los datos de tu tarea";

    saveTaskButton.textContent =
        "Guardar cambios";


    taskTitle.value =
        task.title;

    taskDescription.value =
        task.description;

    taskPriority.value =
        task.priority;


    taskModal.classList.add("show");

    taskTitle.focus();

}


// ==========================================
// FILTRAR POR ESTADO
// ==========================================

function filterByStatus(taskArray) {

    if (currentFilter === "pending") {

        return taskArray.filter(
            function (task) {

                return !task.completed;

            }
        );

    }


    if (currentFilter === "completed") {

        return taskArray.filter(
            function (task) {

                return task.completed;

            }
        );

    }


    return taskArray;

}


// ==========================================
// BUSCAR TAREAS
// ==========================================

function filterBySearch(taskArray) {

    if (currentSearch === "") {

        return taskArray;

    }


    const search =
        currentSearch.toLowerCase();


    return taskArray.filter(
        function (task) {

            const title =
                task.title.toLowerCase();

            const description =
                (task.description || "")
                    .toLowerCase();

            const priority =
                task.priority.toLowerCase();


            return (
                title.includes(search) ||
                description.includes(search) ||
                priority.includes(search)
            );

        }
    );

}


// ==========================================
// ORDENAR TAREAS
// ==========================================

function sortTasks(taskArray) {

    // Creamos una copia para no modificar
    // directamente el array original

    const sortedTasks =
        [...taskArray];


    // ==================================
    // MÁS RECIENTES
    // ==================================

    if (currentSort === "newest") {

        sortedTasks.sort(
            function (a, b) {

                return b.id - a.id;

            }
        );

    }


    // ==================================
    // MÁS ANTIGUAS
    // ==================================

    else if (currentSort === "oldest") {

        sortedTasks.sort(
            function (a, b) {

                return a.id - b.id;

            }
        );

    }


    // ==================================
    // PRIORIDAD ALTA → BAJA
    // ==================================

    else if (
        currentSort === "priority-high"
    ) {

        const priorityValues = {

            Alta: 3,

            Media: 2,

            Baja: 1

        };


        sortedTasks.sort(
            function (a, b) {

                return (
                    priorityValues[b.priority] -
                    priorityValues[a.priority]
                );

            }
        );

    }


    // ==================================
    // PRIORIDAD BAJA → ALTA
    // ==================================

    else if (
        currentSort === "priority-low"
    ) {

        const priorityValues = {

            Alta: 3,

            Media: 2,

            Baja: 1

        };


        sortedTasks.sort(
            function (a, b) {

                return (
                    priorityValues[a.priority] -
                    priorityValues[b.priority]
                );

            }
        );

    }


    return sortedTasks;

}


// ==========================================
// OBTENER TAREAS FILTRADAS Y ORDENADAS
// ==========================================

function getFilteredTasks() {

    // Primero filtramos por estado

    let result =
        filterByStatus(tasks);


    // Después aplicamos búsqueda

    result =
        filterBySearch(result);


    // Finalmente ordenamos

    result =
        sortTasks(result);


    return result;

}


// ==========================================
// MOSTRAR TAREAS
// ==========================================

function renderTasks() {

    taskList.innerHTML = "";


    const filteredTasks =
        getFilteredTasks();


    // ==================================
    // SIN RESULTADOS
    // ==================================

    if (filteredTasks.length === 0) {

        let title =
            "No tienes tareas";

        let description =
            "Añade tu primera tarea para comenzar.";


        // BÚSQUEDA

        if (currentSearch !== "") {

            title =
                "No se encontraron tareas";

            description =
                `No hay resultados para "${currentSearch}".`;

        }


        // PENDIENTES

        else if (currentFilter === "pending") {

            title =
                "No tienes tareas pendientes";

            description =
                "¡Perfecto! Has completado todas tus tareas.";

        }


        // COMPLETADAS

        else if (currentFilter === "completed") {

            title =
                "No tienes tareas completadas";

            description =
                "Cuando completes una tarea aparecerá aquí.";

        }


        taskList.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    ✓
                </div>

                <h3>
                    ${title}
                </h3>

                <p>
                    ${description}
                </p>

            </div>

        `;

        return;

    }


    // ==================================
    // MOSTRAR TAREAS
    // ==================================

    filteredTasks.forEach(
        function (task) {

            const taskElement =
                document.createElement("div");


            taskElement.classList.add(
                "task-item"
            );


            if (task.completed) {

                taskElement.classList.add(
                    "completed"
                );

            }


            taskElement.innerHTML = `

                <div class="task-check">

                    <button
                        class="check-button"
                        data-id="${task.id}"
                        title="Completar tarea">

                    </button>

                </div>


                <div class="task-info">

                    <h3>
                        ${task.title}
                    </h3>

                    <p>
                        ${
                            task.description ||
                            "Sin descripción"
                        }
                    </p>

                    <span
                        class="priority ${task.priority.toLowerCase()}">

                        ${task.priority}

                    </span>

                </div>


                <div class="task-date">

                    ${task.createdAt}

                </div>


                <div class="task-actions">

                    <button
                        class="edit-button"
                        data-id="${task.id}"
                        title="Editar tarea">

                        ✏️

                    </button>


                    <button
                        class="delete-button"
                        data-id="${task.id}"
                        title="Eliminar tarea">

                        🗑️

                    </button>

                </div>

            `;


            taskList.appendChild(
                taskElement
            );

        }
    );

}


// ==========================================
// BUSCADOR - ESCRIBIR
// ==========================================

searchInput.addEventListener(
    "input",
    function () {

        currentSearch =
            searchInput.value.trim();


        if (currentSearch !== "") {

            clearSearch.classList.add(
                "visible"
            );

        }

        else {

            clearSearch.classList.remove(
                "visible"
            );

        }


        renderTasks();

    }
);


// ==========================================
// LIMPIAR BÚSQUEDA
// ==========================================

clearSearch.addEventListener(
    "click",
    function () {

        searchInput.value = "";

        currentSearch = "";

        clearSearch.classList.remove(
            "visible"
        );

        renderTasks();

        searchInput.focus();

    }
);


// ==========================================
// BOTONES DE FILTRO
// ==========================================

filterButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                filterButtons.forEach(
                    function (btn) {

                        btn.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                currentFilter =
                    button.dataset.filter;


                renderTasks();

            }
        );

    }
);


// ==========================================
// CAMBIAR ORDENACIÓN
// ==========================================

sortSelect.addEventListener(
    "change",
    function () {

        currentSort =
            sortSelect.value;


        renderTasks();

    }
);


// ==========================================
// ACCIONES DE TAREAS
// ==========================================

taskList.addEventListener(
    "click",
    function (event) {


        // ==================================
        // COMPLETAR
        // ==================================

        const checkButton =
            event.target.closest(
                ".check-button"
            );


        if (checkButton) {

            const taskId =
                Number(
                    checkButton.dataset.id
                );


            const task =
                tasks.find(
                    function (task) {

                        return task.id === taskId;

                    }
                );


            if (task) {

                task.completed =
                    !task.completed;


                saveTasks();

                renderTasks();

                updateStats();

            }


            return;

        }


        // ==================================
        // EDITAR
        // ==================================

        const editButton =
            event.target.closest(
                ".edit-button"
            );


        if (editButton) {

            const taskId =
                Number(
                    editButton.dataset.id
                );


            editTask(taskId);

            return;

        }


        // ==================================
        // ELIMINAR
        // ==================================

        const deleteButton =
            event.target.closest(
                ".delete-button"
            );


        if (deleteButton) {

            const taskId =
                Number(
                    deleteButton.dataset.id
                );


            const confirmed =
                confirm(
                    "¿Quieres eliminar esta tarea?"
                );


            if (!confirmed) {

                return;

            }


            tasks =
                tasks.filter(
                    function (task) {

                        return task.id !== taskId;

                    }
                );


            saveTasks();

            renderTasks();

            updateStats();

        }

    }
);


// ==========================================
// ESTADÍSTICAS
// ==========================================

function updateStats() {

    const total =
        tasks.length;


    const completed =
        tasks.filter(
            function (task) {

                return task.completed === true;

            }
        ).length;


    const pending =
        total - completed;


    document.getElementById(
        "totalTasks"
    ).textContent =
        total;


    document.getElementById(
        "completedTasks"
    ).textContent =
        completed;


    document.getElementById(
        "pendingTasks"
    ).textContent =
        pending;


    // ==================================
    // PORCENTAJE
    // ==================================

    const progress =
        total === 0
            ? 0
            : Math.round(
                (completed / total) * 100
            );


    document.getElementById(
        "progressValue"
    ).textContent =
        `${progress}%`;


    // ==================================
    // CÍRCULO
    // ==================================

    const degrees =
        progress * 3.6;


    progressCircle.style.background =
        `
        conic-gradient(
            #3b82f6 ${degrees}deg,
            #252a35 ${degrees}deg
        )
        `;

}


// ==========================================
// INICIAR APLICACIÓN
// ==========================================

renderTasks();

updateStats();


console.log(
    "TaskFlow - Paso 9 iniciado correctamente"
);