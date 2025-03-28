document.addEventListener('DOMContentLoaded', () => {
    const userNameElement = document.getElementById('user-name');
    const profileInfoDiv = document.getElementById('profile-info');
    const clockDiv = document.getElementById('clock');
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');
    const taskFilters = document.getElementById('task-filters');
    const filterOptions = taskFilters.querySelectorAll('input[name="filter"]');

    // Exibe informações do usuário
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        userNameElement.textContent = user.nome || 'Usuário'; // Exibe o nome ou "Usuário" como fallback
        profileInfoDiv.innerHTML = `<p><strong>Email:</strong> ${user.email}</p>`;
    } else {
        userNameElement.textContent = 'Usuário não encontrado';
        profileInfoDiv.innerHTML = '<p>Nenhum usuário logado.</p>';
    }

    // Relógio em tempo real
    function updateClock() {
        const now = new Date();
        clockDiv.textContent = now.toLocaleTimeString();
    }
    setInterval(updateClock, 1000);
    updateClock();

    // Gerenciar tarefas
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function getPriorityColor(priority) {
        switch (priority) {
            case 'low':
                return '#d4edda'; // Verde claro
            case 'medium':
                return '#fff3cd'; // Amarelo claro
            case 'high':
                return '#f8d7da'; // Vermelho claro
            default:
                return '#ffffff'; // Branco
        }
    }

    function renderTasks() {
        taskList.innerHTML = '';

        // Obtém a opção de filtro selecionada
        const selectedFilter = [...filterOptions].find(option => option.checked).value;

        // Filtra e ordena as tarefas com base no filtro selecionado
        let filteredTasks = [...tasks];
        if (selectedFilter === 'recent') {
            filteredTasks = filteredTasks.reverse(); // Mais recentes primeiro
        } else if (selectedFilter === 'completed') {
            filteredTasks = filteredTasks.filter(task => task.completed); // Apenas tarefas concluídas
        } else if (selectedFilter === 'priority-high') {
            filteredTasks.sort((a, b) => {
                const priorityOrder = { high: 3, medium: 2, low: 1 };
                return priorityOrder[b.priority] - priorityOrder[a.priority]; // Alta para baixa
            });
        } else if (selectedFilter === 'priority-low') {
            filteredTasks.sort((a, b) => {
                const priorityOrder = { high: 3, medium: 2, low: 1 };
                return priorityOrder[a.priority] - priorityOrder[b.priority]; // Baixa para alta
            });
        }

        // Renderiza as tarefas filtradas
        filteredTasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.style.backgroundColor = getPriorityColor(task.priority);

            const taskContent = document.createElement('div');
            taskContent.className = 'task-content';

            if (task.editing) {
                taskContent.innerHTML = `
                    <input type="text" class="edit-title" value="${task.title}">
                    <textarea class="edit-desc">${task.desc}</textarea>
                    <select class="edit-priority">
                        <option value="low" ${task.priority === 'low' ? 'selected' : ''}>Baixa</option>
                        <option value="medium" ${task.priority === 'medium' ? 'selected' : ''}>Média</option>
                        <option value="high" ${task.priority === 'high' ? 'selected' : ''}>Alta</option>
                    </select>
                `;
            } else {
                taskContent.innerHTML = `
                    <strong>${task.title}</strong>
                    <p>${task.desc}</p>
                    <span>Prioridade: ${task.priority}</span>
                `;
            }

            if (task.completed) {
                li.classList.add('completed');
            }

            const actions = document.createElement('div');
            actions.className = 'task-actions';

            const checklistButton = document.createElement('button');
            checklistButton.textContent = task.completed ? 'Desmarcar' : 'Concluir';
            checklistButton.className = 'btn-checklist';
            checklistButton.addEventListener('click', () => {
                task.completed = !task.completed;
                saveTasks();
                renderTasks();
            });

            if (task.editing) {
                const saveButton = document.createElement('button');
                saveButton.textContent = 'Salvar';
                saveButton.className = 'btn-save';
                saveButton.addEventListener('click', () => {
                    const newTitle = li.querySelector('.edit-title').value;
                    const newDesc = li.querySelector('.edit-desc').value;
                    const newPriority = li.querySelector('.edit-priority').value;

                    task.title = newTitle;
                    task.desc = newDesc;
                    task.priority = newPriority;
                    task.editing = false;

                    saveTasks();
                    renderTasks();
                });

                actions.appendChild(saveButton);
            } else {
                const editButton = document.createElement('button');
                editButton.textContent = 'Editar';
                editButton.className = 'btn-edit';
                editButton.addEventListener('click', () => {
                    task.editing = true;
                    renderTasks();
                });

                actions.appendChild(editButton);
            }

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Excluir';
            deleteButton.className = 'btn-delete';
            deleteButton.addEventListener('click', () => {
                tasks.splice(index, 1);
                saveTasks();
                renderTasks();
            });

            actions.appendChild(checklistButton);
            actions.appendChild(deleteButton);

            li.appendChild(taskContent);
            li.appendChild(actions);
            taskList.appendChild(li);
        });
    }

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('task-title').value;
        const desc = document.getElementById('task-desc').value;
        const priority = document.getElementById('task-priority').value;

        tasks.push({ title, desc, priority, completed: false, editing: false });
        saveTasks();
        renderTasks();
        taskForm.reset();
    });

    // Atualiza a lista de tarefas ao alterar o filtro
    filterOptions.forEach(option => {
        option.addEventListener('change', renderTasks);
    });

    renderTasks();
});
