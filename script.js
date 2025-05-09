function normalize(text) {
    return text
        .toLowerCase()
        .replace(/[\.,:;]/g, '')
        .replace(/\b(the|a|an|and|of|in|to|for|with|on|at|by|from|as|is)\b/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}
  
// function renderTopicSelector() {
//     const selector = document.getElementById('topicSelector');
//     topics.forEach((topic, index) => {
//         const btn = document.createElement('button');
//         btn.textContent = topic.title;
//         btn.onclick = () => renderGame(index);
//         selector.appendChild(btn);
//     });
// }

function renderTopicSelector() {
    const selector = document.getElementById('topicSelector');
    selector.innerHTML = ''; // Limpia contenido previo

    const groupSize = 5;
    const totalGroups = Math.ceil(topics.length / groupSize);

    for (let groupIndex = 0; groupIndex < totalGroups; groupIndex++) {
        const details = document.createElement('details');
        const summary = document.createElement('summary');

        const start = groupIndex * groupSize;
        const end = Math.min((groupIndex + 1) * groupSize, topics.length);
        const topicNumbers = topics
            .slice(start, end)
            .map(topic => {
                const match = topic.title.match(/TOPIC\s*(\d+)/i);
                return match ? match[1] : '?';
            })
            .join(', ');

        summary.textContent = `Temas: ${topicNumbers}`;
        summary.style.cursor = 'pointer';
        summary.style.fontWeight = 'bold';
        summary.style.padding = '8px 0';
        details.appendChild(summary);

        for (let i = start; i < end; i++) {
            const btn = document.createElement('button');
            btn.textContent = topics[i].title;
            btn.onclick = () => renderGame(i);
            btn.style.display = 'block';
            btn.style.margin = '5px 0';
            btn.style.width = '100%';
            details.appendChild(btn);
        }

        selector.appendChild(details);
    }
}

function getLevel(numbering) {
    return (numbering.match(/\./g) || []).length;
}

function renderGame(index) {
    const topic = topics[index];
    currentTopic = topic;
    const gameArea = document.getElementById('gameArea');
    gameArea.innerHTML = '';

    topic.outline.forEach((point, i) => {
        const match = point.text.match(/^(\d+(\.\d+)*\.?)\s+(.*)/);
        if (!match) return;

        const [ , number, , title ] = match;
        const level = getLevel(number);

        const div = document.createElement('div');
        div.style.marginLeft = `${level * 20}px`;

        const label = document.createElement('span');
        label.textContent = `${number} `;
        label.style.display = 'inline-block';
        label.style.width = '70px';

        const input = document.createElement('input');
        input.type = 'text';
        input.id = `input-${i}`;
        input.dataset.expected = normalize(title);
        input.dataset.fulltext = point.text;
        input.dataset.number = number;
        input.dataset.topicIndex = index;
        input.dataset.pointIndex = i;

        div.appendChild(label);
        div.appendChild(input);
        gameArea.appendChild(div);
    });

    document.getElementById('results').innerHTML = '';
}

function checkAnswers() {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '<h3>Resultados:</h3>';

    const inputs = document.querySelectorAll('#gameArea input');
    inputs.forEach((input, i) => {
        const userAnswer = normalize(input.value);
        const expected = input.dataset.expected;
        const fullText = input.dataset.fulltext;
        const number = input.dataset.number;
        const level = getLevel(number);
        const topicIndex = input.dataset.topicIndex;
        const pointIndex = input.dataset.pointIndex;

        const resultDiv = document.createElement('div');
        resultDiv.className = 'result-line';
        resultDiv.style.marginLeft = `${level * 20}px`;

        const isCorrect = userAnswer === expected;
        const point = topics[topicIndex].outline[pointIndex];
        const extraInfo = point.info || '';

        const hasInfo = !!point.info;

        resultDiv.innerHTML = `
            <span class="${isCorrect ? 'correct' : 'incorrect'}">${isCorrect ? '✅' : '❌'} ${number} ${isCorrect ? 'correcto' : 'incorrecto'}</span><br>
            ${!isCorrect ? `Tu respuesta: "${input.value}"<br>` : ''}
            <em>${fullText}</em>
            ${hasInfo ? `<button class="toggle-info-btn" data-index="${i}">＋</button>
            <div class="extra-info hidden" id="info-${i}">
                <p>${point.info}</p>
            </div>` : ''}
        `;

        if (isCorrect) {
            input.classList.add('correct');
            input.classList.remove('incorrect');
        } else {
            input.classList.add('incorrect');
            input.classList.remove('correct');
        }

        resultsDiv.appendChild(resultDiv);
    });

    document.querySelectorAll(".toggle-info-btn").forEach(button => {
        button.addEventListener("click", () => {
            const index = button.getAttribute("data-index");
            const infoBox = document.getElementById(`info-${index}`);
            infoBox.classList.toggle("hidden");
            button.textContent = infoBox.classList.contains("hidden") ? "＋" : "－";
        });
    });
}


let currentTopic = null;
renderTopicSelector();
  