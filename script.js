document.addEventListener('DOMContentLoaded', () => {

    const defaultTasks = [
        "Napij se",
        "Všichni kromě tebe pijí",
        "Zazpívej písničku",
        "Zatanči 30 sekund",
        "Řekni vtip",
        "Vyber hráče, který pije"
    ];

    let tasks = JSON.parse(localStorage.getItem('silvestr_tasks')) || [...defaultTasks];

    const glass = document.getElementById('glass');
    const ctx = glass.getContext('2d');
    const pourBtn = document.getElementById('pour');
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTask');
    const taskList = document.getElementById('taskList');

    let fillLevel = 0;
    let pouring = false;

    function saveTasks() {
        localStorage.setItem('silvestr_tasks', JSON.stringify(tasks));
    }

    function drawGlass() {
        ctx.clearRect(0, 0, glass.width, glass.height);

        ctx.strokeStyle = '#aaa';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(40, 30);
        ctx.lineTo(40, 200);
        ctx.quadraticCurveTo(80, 240, 120, 200);
        ctx.lineTo(120, 30);
        ctx.closePath();
        ctx.stroke();

        if (fillLevel > 0) {
            ctx.beginPath();
            ctx.moveTo(42, 200);
            ctx.quadraticCurveTo(80, 235, 118, 200);
            ctx.lineTo(118, 200 - 160 * fillLevel);
            ctx.lineTo(42, 200 - 160 * fillLevel);
            ctx.closePath();
            ctx.fillStyle = '#f7d046';
            ctx.fill();
        }

        ctx.fillStyle = '#222';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(Math.round(fillLevel * 100) + '%', glass.width / 2, 25);
    }

    function showTask() {
        const task = tasks[Math.floor(Math.random() * tasks.length)];
        alert(task);
        fillLevel = 0;
        drawGlass();
    }

    function pourGlass() {
        if (pouring || fillLevel >= 1) return;
        pouring = true;

        const pourAmount = Math.random() * 0.2 + 0.05;
        const target = Math.min(1, fillLevel + pourAmount);
        let start = null;
        let initial = fillLevel;

        function animate(ts) {
            if (!start) start = ts;
            const progress = (ts - start) / 600;

            if (progress < 1) {
                fillLevel = initial + (target - initial) * progress;
                drawGlass();
                requestAnimationFrame(animate);
            } else {
                fillLevel = target;
                drawGlass();
                pouring = false;
                if (fillLevel >= 1) setTimeout(showTask, 300);
            }
        }
        requestAnimationFrame(animate);
    }

    function renderTaskList() {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const li = document.createElement('li');

            const span = document.createElement('span');
            span.textContent = task;

            const delBtn = document.createElement('button');
            delBtn.textContent = '✖';
            delBtn.className = 'delete-btn';
            delBtn.onclick = () => {
                tasks.splice(index, 1);
                saveTasks();
                renderTaskList();
            };

            li.appendChild(span);
            li.appendChild(delBtn);
            taskList.appendChild(li);
        });
    }

    pourBtn.onclick = pourGlass;

    addTaskBtn.onclick = () => {
        const val = taskInput.value.trim();
        if (!val) return;
        tasks.push(val);
        saveTasks();
        taskInput.value = '';
        renderTaskList();
    };

    drawGlass();
    renderTaskList();
});
