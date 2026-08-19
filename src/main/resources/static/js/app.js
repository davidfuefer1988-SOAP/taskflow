// ==========================================
// TASKFLOW
// PASO 6 - EDITAR TAREAS
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
// VARIABLES
// ==========================================

// Cargar tareas desde LocalStorage

let tasks =
    JSON.parse(
        localStorage.getItem("taskflow_tasks")
    ) || [];


// ID de la tarea que estamos editando

let editingTaskId = null;


// ==========================================
// ABRIR MODAL PARA CREAR
// ==========================================

addTaskBtn.addEventListener(
    "click",
    function () {

        // Estamos creando una tarea

        editingTaskId = null;


        // Cambiar textos del modal

        modalTitle.textContent =
            "Nueva tarea";

        modalDescription.textContent =
            "Añade una nueva tarea a tu lista";

        saveTaskButton.textContent =
            "Guardar tarea";


        // Limpiar formulario

        taskForm.reset();


        // Mostrar modal

        taskModal.classList.add("show");


        // Colocar cursor en título

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
// CERRAR MODAL AL PULSAR FUERA
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
        // MODO EDITAR
        // ==================================

        if (editingTaskId !== null) {

            const task =
                tasks.find(
                    function (task) {

                        return task.id === editingTaskId;

                    }
                );


            if (task) {

                // Actualizar datos

                task.title =
                    taskTitle.value.trim();

                task.description =
                    taskDescription.value.trim();

                task.priority =
                    taskPriority.value;

            }

        }


        // ==================================
        // MODO CREAR
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


        // Guardar

        saveTasks();


        // Actualizar pantalla

        renderTasks();

        updateStats();


        // Cerrar modal

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
// ABRIR MODAL PARA EDITAR
// ==========================================

function editTask(taskId) {

    const task =
        tasks.find(
            function (task) {

                return task.id === taskId;

            }
        );


    // Si no existe la tarea
    // no hacemos nada

    if (!task) {

        return;

    }


    // Guardamos el ID

    editingTaskId =
        taskId;


    // Cambiar textos

    modalTitle.textContent =
        "Editar tarea";

    modalDescription.textContent =
        "Modifica los datos de tu tarea";

    saveTaskButton.textContent =
        "Guardar cambios";


    // Rellenar formulario

    taskTitle.value =
        task.title;

    taskDescription.value =
        task.description;

    taskPriority.value =
        task.priority;


    // Mostrar modal

    taskModal.classList.add("show");


    // Cursor en título

    taskTitle.focus();

}


// ==========================================
// MOSTRAR TAREAS
// ==========================================

function renderTasks() {

    taskList.innerHTML = "";


    // ==================================
    // SIN TAREAS
    // ==================================

    if (tasks.length === 0) {

        taskList.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    ✓
                </div>

                <h3>
                    No tienes tareas
                </h3>

                <p>
                    Añade tu primera tarea
                    para comenzar.
                </p>

            </div>

        `;

        return;

    }


    // ==================================
    // RECORRER TAREAS
    // ==================================

    tasks.forEach(
        function (task) {

            const taskElement =
                document.createElement("div");


            taskElement.classList.add(
                "task-item"
            );


            // Añadir clase si está completada

            if (task.completed) {

                taskElement.classList.add(
                    "completed"
                );

            }


            // HTML de la tarea

            taskElement.innerHTML = `

                <!-- COMPLETAR -->

                <div class="task-check">

                    <button
                        class="check-button"
                        data-id="${task.id}"
                        title="Completar tarea">

                    </button>

                </div>


                <!-- INFORMACIÓN -->

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


                <!-- FECHA -->

                <div class="task-date">

                    ${task.createdAt}

                </div>


                <!-- ACCIONES -->

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
// CLICKS EN LAS TAREAS
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


    // TOTAL

    document.getElementById(
        "totalTasks"
    ).textContent =
        total;


    // COMPLETADAS

    document.getElementById(
        "completedTasks"
    ).textContent =
        completed;


    // PENDIENTES

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
    // CÍRCULO DE PROGRESO
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
    "TaskFlow - Paso 6 iniciado correctamente"
);