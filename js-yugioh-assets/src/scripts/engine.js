const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points"),
    },
    cardSprites: {
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },
    fieldCards: {
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
    },
    button: document.createElement("button"), // Botão para mostrar o resultado
    playerSelected: false // Estado para garantir que a carta só possa ser escolhida uma vez
};


// Configuração inicial do botão de resultado
state.button.classList.add("result-button");
state.button.style.display = "none"; // Oculta o botão inicialmente
document.body.appendChild(state.button); // Adiciona o botão ao corpo do documento


const playerSides = {
    player1: "player-cards",
    player1BOX: null,
    computer: "computer-cards",
    computerBOX: null
};


const pathImages = "src/assets/icons/";


const cardData = [
    {
        id: 0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: `${pathImages}dragon.png`,
        WinOf: [1],
        LoseOf: [2]
    },
    {
        id: 1,
        name: "Exodia the Forbidden One",
        type: "Rock",
        img: `${pathImages}exodia.png`,
        WinOf: [2],
        LoseOf: [0]
    },
    {
        id: 2,
        name: "Dark Magician",
        type: "Scissors",
        img: `${pathImages}magician.png`,
        WinOf: [0],
        LoseOf: [1]
    }
];


document.addEventListener("DOMContentLoaded", function() {
    playerSides.player1BOX = document.getElementById("player-cards");
    playerSides.computerBOX = document.getElementById("computer-cards");


    init();
});


async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}


async function createCardImage(IdCard, fieldSide) {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", IdCard);
    cardImage.classList.add("card");


    if (fieldSide === playerSides.player1) {
        cardImage.addEventListener("click", () => {
            if (!state.playerSelected) {
                setCardsField(parseInt(cardImage.getAttribute("data-id")));
                state.playerSelected = true;
            }
        });


        cardImage.addEventListener("mouseover", () => {
            const cardIndex = cardData.findIndex(card => card.id == IdCard);
            if (cardIndex !== -1) {
                drawSelectCard(cardIndex);
            }
        });
    }


    return cardImage;
}


async function setCardsField(cardId) {
    let computerCardId = await getRandomCardId();


    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.player.alt = cardData[cardId].name;


    state.fieldCards.computer.src = cardData[computerCardId].img;
    state.fieldCards.computer.alt = cardData[computerCardId].name;


    const duelResult = await checkDuelResults(cardId, computerCardId);
    await updateScore(duelResult);
    await showResultButton(duelResult);
}


async function checkDuelResults(playerCardId, computerCardId) {
    const playerCard = cardData[playerCardId];
    const computerCard = cardData[computerCardId];


    if (playerCard.WinOf.includes(computerCardId)) {
        return "win";
    } else if (playerCard.LoseOf.includes(computerCardId)) {
        return "lose";
    } else {
        return "draw";
    }
}


async function updateScore(result) {
    if (result === "win") {
        state.score.playerScore += 1;
    } else if (result === "lose") {
        state.score.computerScore += 1;
    }
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}


async function showResultButton(result) {
    state.button.innerText = result.toUpperCase();
    state.button.style.backgroundColor = result === "win" ? "green" : result === "lose" ? "red" : "gray";
    state.button.style.display = "block";


    state.button.onclick = resetGame;
}


function resetGame() {
    state.button.style.display = "none";
    state.playerSelected = false;


    state.fieldCards.player.src = "";
    state.fieldCards.computer.src = "";


    removeAllCardsFromAreas();
    init();
}


function removeAllCardsFromAreas() {
    const playerCardsContainer = document.getElementById("player-cards");
    while (playerCardsContainer.firstChild) {
        playerCardsContainer.removeChild(playerCardsContainer.firstChild);
    }


    const computerCardsContainer = document.getElementById("computer-cards");
    while (computerCardsContainer.firstChild) {
        computerCardsContainer.removeChild(computerCardsContainer.firstChild);
    }
}


async function drawSelectCard(index) {
    const card = cardData[index];
    state.cardSprites.avatar.src = card.img;
    state.cardSprites.name.innerText = card.name;
    state.cardSprites.type.innerText = "Attribute: " + card.type;
}


async function drawCards(cardNumbers, fieldSide) {
    for (let i = 0; i < cardNumbers; i++) {
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);
        document.getElementById(fieldSide).appendChild(cardImage);
    }
}


const bgm = document.getElementById("bgm");
bgm.play();


function init() {
    drawCards(5, playerSides.player1);
    drawCards(5, playerSides.computer);
}


