const xpPerLevel = 100;
let totalXp = 0;
let adIndex = 0;
let quizIndex = 0;
let quizAnswered = false;
let quizScore = 0;

const levelLabel = document.getElementById("levelLabel");
const xpLabel = document.getElementById("xpLabel");
const xpFill = document.getElementById("xpFill");
const adTitle = document.getElementById("adTitle");
const adMessage = document.getElementById("adMessage");
const adSlides = document.getElementById("adSlides");
const adDots = document.getElementById("adDots");
const toast = document.getElementById("toast");
const quizQuestion = document.getElementById("quizQuestion");
const quizOptions = document.getElementById("quizOptions");
const achievementStatus = document.getElementById("achievementStatus");

// PUBLICIDADE: os jogos abaixo aparecem no carrossel do banner.
const ads = [
  {
    title: "Bob Esponja",
    creator: "Julia de Almeida",
    url: "https://spiffy-rugelach-0f95c1.netlify.app/"
  },
  {
    title: "Branca de Neve",
    creator: "Gabriela Zanotto",
    url: "https://mellow-pithivier-0a980d.netlify.app/"
  },
  {
    title: "Sapinho e Frutinhas",
    creator: "Gabriela Moreira",
    url: "https://superb-blini-f25780.netlify.app/"
  },
  {
    title: "Dinossauro",
    creator: "Guilherme Thenorio",
    url: "https://merry-treacle-727dc3.netlify.app/"
  },
  {
    title: "Fantasia",
    creator: "Diego Vizari",
    url: "https://chimerical-shortbread-6ee684.netlify.app/"
  },
  {
    title: "Netlands",
    creator: "Eduardo Filipe",
    url: "https://rococo-frangollo-06f594.netlify.app/"
  }
];

// QUIZ: cada pergunta aceita apenas uma resposta e o quiz nao reinicia.
const quizQuestions = [
  {
    question: "Quanto XP o jogo principal do Bob Esponja da?",
    options: ["50 XP", "25 XP", "100 XP"],
    answer: "50 XP",
    reward: 15
  },
  {
    question: "Qual jogo tem sapinho no nome?",
    options: ["Sapinho e Frutinhas", "Dinossauro", "Branca de Neve"],
    answer: "Sapinho e Frutinhas",
    reward: 15
  },
  {
    question: "Qual botao voce usa para ganhar XP nos jogos?",
    options: ["Jogar", "Todos os jogos", "Regras"],
    answer: "Jogar",
    reward: 15
  },
  {
    question: "Quem criou o jogo principal do Bob Esponja?",
    options: ["Julia de Almeida", "Guilherme Thenorio", "Eduardo Filipe"],
    answer: "Julia de Almeida",
    reward: 15
  },
  {
    question: "Qual jogo foi feito por Diego Vizari?",
    options: ["Fantasia", "Branca de Neve", "Jogo da Giovanna"],
    answer: "Fantasia",
    reward: 15
  },
  {
    question: "Qual barra indica que você está evoluindo no site?",
    options: ["A barra de XP", "O Carrossel", "O Rodapé"],
    answer: "A barra de XP",
    reward: 15
  },
  {
    question: "Qual jogo aparece na lista dos colegas?",
    options: ["Dinossauro", "Pac-Man", "Tetris"],
    answer: "Dinossauro",
    reward: 15
  }
];

function updateXpBar() {
  const currentLevel = Math.floor(totalXp / xpPerLevel) + 1;
  const currentLevelXp = totalXp % xpPerLevel;
  const progress = (currentLevelXp / xpPerLevel) * 100;

  levelLabel.textContent = `Nivel ${currentLevel}`;
  xpLabel.textContent = `${currentLevelXp} / ${xpPerLevel} XP`;
  xpFill.style.width = `${progress}%`;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

function addXp(points, sourceName) {
  const previousLevel = Math.floor(totalXp / xpPerLevel) + 1;
  totalXp += points;
  const newLevel = Math.floor(totalXp / xpPerLevel) + 1;

  updateXpBar();

  if (newLevel > previousLevel) {
    showToast(`${sourceName}: +${points} XP. Subiste para o nivel ${newLevel}!`);
    return;
  }

  showToast(`${sourceName}: +${points} XP adicionados!`);
}

function setupGameXpButtons() {
  document.querySelectorAll("[data-xp]").forEach((gameLink) => {
    gameLink.addEventListener("click", (event) => {
      event.preventDefault();

      const points = Number(gameLink.dataset.xp);
      const gameName = gameLink.dataset.game;
      const gameUrl = gameLink.getAttribute("href");
      const hasGameUrl = gameUrl && gameUrl !== "#";

      addXp(points, gameName);

      if (hasGameUrl) {
        window.open(gameUrl, "_blank", "noopener,noreferrer");
      }
    });
  });
}

function renderAdCarousel() {
  adSlides.innerHTML = "";
  adDots.innerHTML = "";

  ads.forEach((ad, index) => {
    const slide = document.createElement("div");
    const iframe = document.createElement("iframe");
    const dot = document.createElement("button");

    slide.className = "ad-slide";

    iframe.src = ad.url;
    iframe.title = `Previa do jogo ${ad.title}`;
    iframe.loading = index === 0 ? "eager" : "lazy";
    iframe.allow = "autoplay; fullscreen; gamepad";
    iframe.setAttribute("tabindex", "-1");

    slide.appendChild(iframe);

    dot.className = "ad-dot";
    dot.type = "button";
    dot.setAttribute("aria-label", `Mostrar ${ad.title} no carrossel`);
    dot.addEventListener("click", () => {
      adIndex = index;
      updateAdBanner();
    });

    adSlides.appendChild(slide);
    adDots.appendChild(dot);
  });
}

function updateAdBanner() {
  const currentAd = ads[adIndex];
  const slides = adSlides.querySelectorAll(".ad-slide");
  const dots = adDots.querySelectorAll(".ad-dot");

  adTitle.textContent = currentAd.title;
  adMessage.textContent = `Criado por ${currentAd.creator}`;

  slides.forEach((slide, index) => {
    slide.classList.toggle("active", index === adIndex);
  });

  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === adIndex);
  });
}

function startAdCarousel() {
  renderAdCarousel();
  updateAdBanner();

  setInterval(() => {
    adIndex = (adIndex + 1) % ads.length;
    updateAdBanner();
  }, 12000);
}

function renderQuiz() {
  const currentQuestion = quizQuestions[quizIndex];
  quizAnswered = false;
  quizOptions.innerHTML = "";

  if (!currentQuestion) {
    quizQuestion.textContent = "Quiz finalizado!";
    achievementStatus.textContent = `Voce acertou ${quizScore} de ${quizQuestions.length} perguntas.`;
    return;
  }

  quizQuestion.textContent = currentQuestion.question;

  currentQuestion.options.forEach((option) => {
    const button = document.createElement("button");

    button.className = "quiz-option";
    button.type = "button";
    button.textContent = option;
    button.addEventListener("click", () => handleQuizAnswer(button, option));

    quizOptions.appendChild(button);
  });
}

function handleQuizAnswer(selectedButton, selectedOption) {
  if (quizAnswered) {
    return;
  }

  const currentQuestion = quizQuestions[quizIndex];
  const isCorrect = selectedOption === currentQuestion.answer;
  const buttons = quizOptions.querySelectorAll(".quiz-option");

  quizAnswered = true;

  buttons.forEach((button) => {
    button.disabled = true;
    button.classList.toggle("correct", button.textContent === currentQuestion.answer);
  });

  if (!isCorrect) {
    selectedButton.classList.add("wrong");
    achievementStatus.textContent = "Quase! Proxima pergunta em instantes.";
  } else {
    quizScore += 1;
    addXp(currentQuestion.reward, "Quiz XP");
    achievementStatus.textContent = "Conquista desbloqueada: Resposta certeira!";
  }

  setTimeout(() => {
    quizIndex += 1;
    renderQuiz();
  }, 1800);
}

// Inicialização do sistema
updateXpBar();
setupGameXpButtons();
startAdCarousel();
renderQuiz();
