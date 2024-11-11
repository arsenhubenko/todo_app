import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js';

// Ключ для шифрування
const ENCRYPTION_KEY = 'secret-key';

function App() {
    const [tasks, setTasks] = useState([]);
    const [task, setTask] = useState('');

    // Зчитування завдань з localStorage при завантаженні
    useEffect(() => {
        const encryptedTasks = localStorage.getItem('tasks');
        if (encryptedTasks) {
            const decryptedBytes = CryptoJS.AES.decrypt(encryptedTasks, ENCRYPTION_KEY);
            const decryptedData = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));
            setTasks(decryptedData);
        }
    }, []);

    // Оновлення списку завдань у localStorage
    useEffect(() => {
        if (tasks.length > 0) {
            const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(tasks), ENCRYPTION_KEY).toString();
            localStorage.setItem('tasks', encryptedData);
        }
    }, [tasks]);

    // Додавання нового завдання
    const addTask = () => {
        if (task.trim()) {
            setTasks([...tasks, task]);
            setTask('');
        }
    };

    // Видалення завдання за індексом
    const deleteTask = (index) => {
        const newTasks = tasks.filter((_, i) => i !== index);
        setTasks(newTasks);
    };

    return (
        <div style={styles.container}>
            <h1>Список завдань</h1>
            <div style={styles.inputContainer}>
                <input
                    type="text"
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    placeholder="Нове завдання"
                    style={styles.input}
                />
                <button onClick={addTask} style={styles.button}>Додати</button>
            </div>
            <ul style={styles.list}>
                {tasks.map((task, index) => (
                    <li key={index} style={styles.listItem}>
                        {task}
                        <button onClick={() => deleteTask(index)} style={styles.deleteButton}>Видалити</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

const styles = {
    container: { textAlign: 'center', padding: '20px' },
    inputContainer: { display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' },
    input: { padding: '10px', fontSize: '16px' },
    button: { padding: '10px', fontSize: '16px', cursor: 'pointer' },
    list: { listStyleType: 'none', padding: 0 },
    listItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', backgroundColor: '#f0f0f0', marginBottom: '10px', borderRadius: '5px' },
    deleteButton: { color: 'red', cursor: 'pointer', border: 'none', backgroundColor: 'transparent' },
};

export default App;

