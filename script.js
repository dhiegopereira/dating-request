// ── Corações flutuantes no fundo ──────────────────────────────
const heartsBg = document.getElementById('hearts-bg');
const heartEmojis = ['💕', '❤️', '💖', '💗', '💓', '💞', '🌹', '✨'];

function createFloatingHeart() {
  const h = document.createElement('div');
  h.classList.add('heart-float');
  h.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
  h.style.left = Math.random() * 100 + 'vw';
  h.style.fontSize = (1 + Math.random() * 1.5) + 'rem';
  const duration = 6 + Math.random() * 8;
  h.style.animationDuration = duration + 's';
  h.style.animationDelay = Math.random() * 4 + 's';
  heartsBg.appendChild(h);
  setTimeout(() => h.remove(), (duration + 4) * 1000);
}

setInterval(createFloatingHeart, 600);
for (let i = 0; i < 10; i++) createFloatingHeart();

// ── Parâmetros via URL ────────────────────────────────────────
const urlParams = new URLSearchParams(window.location.search);
const paramName = urlParams.get('name');
const paramQuestion = urlParams.get('question');

let currentName = paramName || '';
let currentQuestion = paramQuestion || '';

// ── Atualiza a URL com os parâmetros name e question ──────────
function updateURL() {
  const params = new URLSearchParams();
  if (currentName) params.set('name', currentName);
  if (currentQuestion) params.set('question', currentQuestion);
  const newURL = params.toString()
    ? `${window.location.pathname}?${params.toString()}`
    : window.location.pathname;
  window.history.replaceState({}, '', newURL);
}

// Se veio nome e pergunta pela URL, pula direto para a tela de pergunta
if (paramName && paramQuestion) {
  document.getElementById('screen-name').style.display = 'none';
  document.getElementById('screen-question').style.display = 'block';
  document.getElementById('question-text').innerHTML =
    `<span>${currentName}</span>,<br>${currentQuestion}`;
} else if (paramName) {
  // Veio só o nome, pula para perguntar a questão
  document.getElementById('screen-name').style.display = 'none';
  document.getElementById('screen-question-input').style.display = 'block';
}

// ── Tela 1 → Tela 1.5 (digitar pergunta) ─────────────────────
const nameInput = document.getElementById('name-input');
const questionInput = document.getElementById('question-input');

nameInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') goToQuestionInput();
});

questionInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') showQuestion();
});

function goToQuestionInput() {
  const name = nameInput.value.trim();
  if (!name) {
    nameInput.style.borderColor = '#e0335e';
    nameInput.focus();
    nameInput.placeholder = 'Por favor, escreva o nome 💕';
    setTimeout(() => {
      nameInput.style.borderColor = '#ffb3c6';
      nameInput.placeholder = 'Digite o nome da pessoa...';
    }, 2000);
    return;
  }

  currentName = name;
  updateURL();
  document.getElementById('screen-name').style.display = 'none';
  questionInput.focus();
}

// ── Tela 1.5 → Tela 2 (exibir pergunta) ──────────────────────
function showQuestion() {
  const question = questionInput.value.trim();
  if (!question) {
    questionInput.style.borderColor = '#e0335e';
    questionInput.focus();
    questionInput.placeholder = 'Escreva a pergunta 💕';
    setTimeout(() => {
      questionInput.style.borderColor = '#ffb3c6';
      questionInput.placeholder = 'Ex: Quer namorar comigo?';
    }, 2000);
    return;
  }

  currentQuestion = question;
  updateURL();

  document.getElementById('screen-question-input').style.display = 'none';
  document.getElementById('screen-question').style.display = 'block';

  document.getElementById('question-text').innerHTML =
    `<span>${currentName}</span>,<br>${currentQuestion}`;
}

// ── Lógica do botão "Não" troca de lugar com "Sim" ────────────
const wrapper = document.getElementById('buttons-wrapper');
const btnNao = document.getElementById('btn-nao');
const btnSim = document.getElementById('btn-sim');

let swapped = false;

btnNao.addEventListener('mouseenter', function () {
  if (!swapped) {
    wrapper.insertBefore(btnNao, btnSim);
  } else {
    wrapper.insertBefore(btnSim, btnNao);
  }
  swapped = !swapped;
});

// ── Tela 2 → Tela 3 ──────────────────────────────────────────
function showYes() {
  burstHearts(event);

  setTimeout(() => {
    document.getElementById('screen-question').style.display = 'none';
    document.getElementById('screen-yes').style.display = 'block';
  }, 500);
}

function burstHearts(e) {
  const count = 20;
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.classList.add('burst-heart');
    el.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
    el.style.left = (e ? e.clientX : window.innerWidth / 2) + 'px';
    el.style.top = (e ? e.clientY : window.innerHeight / 2) + 'px';
    const angle = Math.random() * 2 * Math.PI;
    const dist = 80 + Math.random() * 160;
    el.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
    el.style.setProperty('--dy', Math.sin(angle) * dist + 'px');
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1300);
  }
}

// ── Modal de configurações ────────────────────────────────────
const settingsBtn = document.getElementById('settings-btn');
const modalOverlay = document.getElementById('modal-overlay');
const modalSave = document.getElementById('modal-save');
const modalCancel = document.getElementById('modal-cancel');
const configName = document.getElementById('config-name');
const configQuestion = document.getElementById('config-question');

settingsBtn.addEventListener('click', () => {
  configName.value = currentName;
  configQuestion.value = currentQuestion;
  modalOverlay.classList.remove('hidden');
});

modalCancel.addEventListener('click', () => {
  modalOverlay.classList.add('hidden');
});

modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) {
    modalOverlay.classList.add('hidden');
  }
});

modalSave.addEventListener('click', () => {
  const newName = configName.value.trim();
  const newQuestion = configQuestion.value.trim();

  if (newName) currentName = newName;
  if (newQuestion) currentQuestion = newQuestion;
  updateURL();

  // Atualiza a tela de pergunta se já estiver visível
  const screenQuestion = document.getElementById('screen-question');
  if (screenQuestion.style.display === 'block') {
    document.getElementById('question-text').innerHTML =
      `<span>${currentName}</span>,<br>${currentQuestion}`;
  }

  // Se ainda está na tela de nome, pula para a pergunta
  const screenName = document.getElementById('screen-name');
  if (screenName.style.display !== 'none' && newName) {
    screenName.style.display = 'none';
    screenQuestion.style.display = 'block';
    document.getElementById('question-text').innerHTML =
      `<span>${currentName}</span>,<br>${currentQuestion}`;
  }

  modalOverlay.classList.add('hidden');
});
