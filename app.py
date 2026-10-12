from flask import Flask, render_template, request, jsonify
import mysql.connector

app = Flask(__name__)

# MySQL Configuration
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'your_mysql_password',  # Replace with your MySQL password
    'database': 'todo_db'
}

def get_db_connection():
    return mysql.connector.connect(**db_config)

@app.route('/')
def index():
    return render_template('index.html')

# API: Get all tasks
@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT * FROM tasks ORDER BY id DESC')
    tasks = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(tasks)

# API: Add a new task
@app.route('/api/tasks', methods=['POST'])
def add_task():
    data = request.get_json()
    title = data.get('title', '').strip()
    
    if not title:
        return jsonify({'error': 'Title is required'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO tasks (title) VALUES (%s)', (title,))
    conn.commit()
    task_id = cursor.lastrowid
    cursor.close()
    conn.close()

    return jsonify({'id': task_id, 'title': title, 'completed': False}), 201

# API: Toggle complete/incomplete state
@app.route('/api/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    data = request.get_json()
    completed = data.get('completed')

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('UPDATE tasks SET completed = %s WHERE id = %s', (completed, task_id))
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({'message': 'Task updated successfully'})

# API: Delete a task
@app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM tasks WHERE id = %s', (task_id,))
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({'message': 'Task deleted successfully'})

if __name__ == '__main__':
    app.run(debug=True)
