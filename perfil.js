document.addEventListener('DOMContentLoaded', () => {
    const profileInfoDiv = document.getElementById('profile-info');
    const clockDiv = document.getElementById('clock');
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');

    // Exibe informações do usuário
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        profileInfoDiv.innerHTML = `
            <p><strong>Nome:</strong> ${user.nome}</p>
            <p><strong>Email:</strong> ${user.email}</p>
        `;
    } else {
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

    function renderTasks() {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.style.backgroundColor = getPriorityColor(task.priority);

            const taskContent = document.createElement('div');
            taskContent.className = 'task-content';

            if (task.editing) {
                // Campos editáveis
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
                // Exibição normal
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

            // Botão de checklist
            const checklistButton = document.createElement('button');
            checklistButton.textContent = task.completed ? 'Desmarcar' : 'Concluir';
            checklistButton.className = 'btn-checklist';
            checklistButton.addEventListener('click', () => {
                task.completed = !task.completed;
                saveTasks();
                renderTasks();
            });

            if (task.editing) {
                // Botão de salvar
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
                // Botão de editar
                const editButton = document.createElement('button');
                editButton.textContent = 'Editar';
                editButton.className = 'btn-edit';
                editButton.addEventListener('click', () => {
                    task.editing = true;
                    renderTasks();
                });

                actions.appendChild(editButton);
            }

            // Botão de excluir
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

    renderTasks();
});
