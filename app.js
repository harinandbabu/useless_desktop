const clockTime = document.querySelector("#taskTime");
const clockDate = document.querySelector("#taskDate");
const windows = document.querySelector("#windows");
const startMenu = document.querySelector("#startMenu");

const explorerButton = document.querySelector("#explorerButton");
const codeButton = document.querySelector("#codeButton");
const youtubeButton = document.querySelector("#youtubeButton");
const calculatorButton = document.querySelector("#calculatorButton");
const startButton = document.querySelector("#startButton");

const errorDialog = document.querySelector("#errorDialog");
const errorTitle = document.querySelector("#errorTitle");
const errorMessage = document.querySelector("#errorMessage");
const errorClose = document.querySelector("#errorClose");
const errorYes = document.querySelector("#errorYes");
const errorNo = document.querySelector("#errorNo");

let appsOpened = 0;
let highestWindow = 20;

function updateDateTime() {
  const now = new Date();

  clockTime.textContent = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });

  clockDate.textContent = now.toLocaleDateString([], {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

function hideError() {
  errorDialog.classList.remove("show");
}

function showError(message, title = "TrustOS System Message", yesText = "OK", noText = "") {
  errorTitle.textContent = title;
  errorMessage.textContent = message;
  errorYes.textContent = yesText;

  if (noText) {
    errorNo.textContent = noText;
    errorNo.hidden = false;
  } else {
    errorNo.hidden = true;
  }

  errorDialog.classList.add("show");
}

errorClose.addEventListener("click", hideError);
errorYes.addEventListener("click", hideError);
errorNo.addEventListener("click", hideError);

function makeWindowDraggable(windowBox) {
  const header = windowBox.querySelector(".window-header");

  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  header.addEventListener("mousedown", (event) => {
    if (event.target.matches(".close-button")) return;

    isDragging = true;
    offsetX = event.clientX - windowBox.offsetLeft;
    offsetY = event.clientY - windowBox.offsetTop;

    highestWindow++;
    windowBox.style.zIndex = highestWindow;
  });

  document.addEventListener("mousemove", (event) => {
    if (!isDragging) return;

    windowBox.style.left = `${event.clientX - offsetX}px`;
    windowBox.style.top = `${event.clientY - offsetY}px`;
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
  });
}

function openWindow(title, content) {
  const windowBox = document.createElement("article");

  highestWindow++;
  windowBox.className = "window";
  windowBox.style.zIndex = highestWindow;

  windowBox.innerHTML = `
    <div class="window-header">
      <span>${title}</span>
      <button class="close-button">×</button>
    </div>
    <div class="window-content">${content}</div>
  `;

  windows.appendChild(windowBox);
  makeWindowDraggable(windowBox);

  appsOpened++;

  if (appsOpened === 3) {
    showError(
      "You opened three applications. Are you avoiding something important?",
      "TrustOS Behaviour Monitor"
    );
  }

  const closeButton = windowBox.querySelector(".close-button");

  closeButton.addEventListener("click", () => {
    windowBox.remove();
  });

  closeButton.addEventListener("mouseenter", () => {
    const moveAmount = Math.floor(Math.random() * 110) - 55;

    closeButton.style.transform = `translateX(${moveAmount}px)`;

    setTimeout(() => {
      closeButton.style.transform = "translateX(0)";
    }, 450);
  });

  return windowBox;
}

function openFolder(folderName) {
  const files = {
    Documents: [
      "📁 Things I Will Read Later",
      "📁 Important Things I Will Ignore",
      "📄 meeting_notes_that_solved_nothing.txt"
    ],
    Pictures: [
      "📁 Screenshots of Other People's Work",
      "📁 Accidental Selfies",
      "📄 definitely_not_a_meme.png"
    ],
    Projects: [
      "📁 Version_Final_Final_Actually_Final",
      "📁 Hackathon Panic",
      "📄 productivity_avoidance_plan.pdf"
    ]
  };

  const fileButtons = files[folderName]
    .map((file) => `<button class="file-row" data-file="${file}">${file}</button>`)
    .join("");

  const folderWindow = openWindow(
    folderName,
    `
      <h2>${folderName}</h2>
      <p>${files[folderName].length} items found.</p>
      <div class="file-list">${fileButtons}</div>
    `
  );

  folderWindow.querySelectorAll(".file-row").forEach((file) => {
    file.addEventListener("click", () => {
      showError(
        `${file.dataset.file} opened successfully. Nothing changed.`,
        "TrustOS File Explorer"
      );
    });
  });
}

function openExplorer() {
  const explorerWindow = openWindow(
    "File Explorer",
    `
      <h2>Home</h2>
      <p>Quick access</p>

      <div class="folder-grid">
        <button class="folder" data-folder="Documents">📁<span>Documents</span></button>
        <button class="folder" data-folder="Pictures">📁<span>Pictures</span></button>
        <button class="folder" data-folder="Projects">📁<span>Projects</span></button>
      </div>
    `
  );

  explorerWindow.querySelectorAll(".folder").forEach((folder) => {
    folder.addEventListener("click", () => {
      openFolder(folder.dataset.folder);
    });
  });
}

function openCode() {
  const codeWindow = openWindow(
    "Visual Studio Code",
    `
      <h2>Welcome back.</h2>
      <p>Your workspace has been prepared.</p>

      <div class="fake-code">function tomorrow() {
  return "definitely";
}

console.log(tomorrow());</div>
    `
  );

  let seconds = 3;

  function showCodeWarning() {
    showError(
      `Are you here for coding? This editor will close in ${seconds} second${seconds === 1 ? "" : "s"}.`,
      "Trust Code Guard",
      "Yes",
      "No"
    );
  }

  showCodeWarning();

  const countdown = setInterval(() => {
    seconds--;

    if (seconds > 0) {
      showCodeWarning();
      return;
    }

    clearInterval(countdown);
    codeWindow.remove();

    showError(
      "Coding attempt prevented successfully. Your time has been protected.",
      "Trust Code Guard"
    );
  }, 1000);
}

function openCalculator() {
  const calculatorWindow = openWindow(
    "Calculator",
    `
      <div class="normal-calculator">
        <div id="calculatorDisplay" class="calculator-display">0</div>

        <div class="calculator-buttons">
          <button class="calc-key calc-danger" data-action="clear">C</button>
          <button class="calc-key" data-action="delete">⌫</button>
          <button class="calc-key calc-operator" data-operation="/">÷</button>
          <button class="calc-key calc-operator" data-operation="*">×</button>

          <button class="calc-key" data-number="7">7</button>
          <button class="calc-key" data-number="8">8</button>
          <button class="calc-key" data-number="9">9</button>
          <button class="calc-key calc-operator" data-operation="-">−</button>

          <button class="calc-key" data-number="4">4</button>
          <button class="calc-key" data-number="5">5</button>
          <button class="calc-key" data-number="6">6</button>
          <button class="calc-key calc-operator" data-operation="+">+</button>

          <button class="calc-key" data-number="1">1</button>
          <button class="calc-key" data-number="2">2</button>
          <button class="calc-key" data-number="3">3</button>
          <button class="calc-key calc-equals" data-action="equals">=</button>

          <button class="calc-key calc-zero" data-number="0">0</button>
          <button class="calc-key" data-number=".">.</button>
        </div>
      </div>
    `
  );

  const display = calculatorWindow.querySelector("#calculatorDisplay");
  const buttons = calculatorWindow.querySelector(".calculator-buttons");

  let currentNumber = "0";
  let firstNumber = null;
  let selectedOperation = null;
  let shouldResetDisplay = false;

  function updateDisplay() {
    display.textContent = currentNumber;
  }

  function wrongAnswer(realAnswer) {
    if (!Number.isFinite(realAnswer)) return 42;

    const mistake = Math.abs(realAnswer) > 10 ? 2 : 1;

    return realAnswer + (Math.random() < 0.5 ? mistake : -mistake);
  }

  function calculate() {
    if (firstNumber === null || selectedOperation === null) return;

    const secondNumber = Number(currentNumber);
    let answer;

    if (selectedOperation === "+") answer = firstNumber + secondNumber;
    if (selectedOperation === "-") answer = firstNumber - secondNumber;
    if (selectedOperation === "*") answer = firstNumber * secondNumber;
    if (selectedOperation === "/") answer = firstNumber / secondNumber;

    currentNumber = String(wrongAnswer(answer));
    firstNumber = null;
    selectedOperation = null;
    shouldResetDisplay = true;

    updateDisplay();

    showError(
      "Your answer has been independently verified by Trust Calculator.",
      "Calculation Complete"
    );
  }

  buttons.addEventListener("click", (event) => {
    const button = event.target;

    if (!button.matches("button")) return;

    const number = button.dataset.number;
    const operation = button.dataset.operation;
    const action = button.dataset.action;

    if (number !== undefined) {
      if (currentNumber === "0" || shouldResetDisplay) {
        currentNumber = number;
        shouldResetDisplay = false;
      } else if (number === "." && currentNumber.includes(".")) {
        return;
      } else {
        currentNumber += number;
      }

      updateDisplay();
      return;
    }

    if (operation) {
      firstNumber = Number(currentNumber);
      selectedOperation = operation;
      shouldResetDisplay = true;
    }

    if (action === "clear") {
      currentNumber = "0";
      firstNumber = null;
      selectedOperation = null;
      shouldResetDisplay = false;
      updateDisplay();
    }

    if (action === "delete" && !shouldResetDisplay) {
      currentNumber = currentNumber.length > 1
        ? currentNumber.slice(0, -1)
        : "0";

      updateDisplay();
    }

    if (action === "equals") {
      calculate();
    }
  });
}

explorerButton.addEventListener("click", openExplorer);
codeButton.addEventListener("click", openCode);
calculatorButton.addEventListener("click", openCalculator);

youtubeButton.addEventListener("click", () => {
  openWindow(
    "YouTube",
    `
      <h2>Recommended for you</h2>
      <p>Loading a video that will definitely improve your life...</p>
      <p><b>Error:</b> Motivation not found.</p>
    `
  );
});

startButton.addEventListener("click", (event) => {
  event.stopPropagation();
  startMenu.classList.toggle("show");
});

startMenu.addEventListener("click", (event) => {
  event.stopPropagation();
});

document.addEventListener("click", () => {
  startMenu.classList.remove("show");
});

document.querySelectorAll("[data-popup]").forEach((button) => {
  button.addEventListener("click", () => {
    showError(button.dataset.popup, "TrustOS System Message");
  });
});

updateDateTime();
setInterval(updateDateTime, 1000);