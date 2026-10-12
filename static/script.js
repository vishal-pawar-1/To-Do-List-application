document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todo-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');

    // Fetch and display all tasks on initial load
    fetchTasks();

    // Event listener for adding a task
    todoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = taskInput.value.trim();
        if (!title) return;

        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title })
        });

        if (response.ok) {
            taskInput.value = '';
            fetchTasks();
        }
    });

    // Fetch all tasks from backend
    async function fetchTasks() {
        const response = await fetch('/api/tasks');
        const tasks = await response.json();
        renderTasks(tasks);
    }

    // Render list elements dynamically
    function renderTasks(tasks) {
        taskList.innerHTML = '';
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            
            li.innerHTML = `
                <div class="task-content">
                    <input type="checkbox" ${task.completed ? 'checked' : ''}>
                    <span>${escapeHtml(task.title)}</span>
                </div>
                <button class="delete-btn">Delete</button>
            `;

            // Toggle Completion Event
            const checkbox = li.querySelector('input');
            checkbox.addEventListener('change', () => toggleTask(task.id, checkbox.checked));

            // Delete Event
            const deleteBtn = li.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => deleteTask(task.id));

            taskList.appendChild(li);
        });
    }

    // Toggle complete/incomplete API call
    async function toggleTask(id, completed) {
        await fetch(`/api/tasks/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed })
        });
        fetchTasks();
    }

    // Delete task API call
    async function deleteTask(id) {
        await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
        fetchTasks();
    }

    // Helper to sanitize HTML strings
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
});
