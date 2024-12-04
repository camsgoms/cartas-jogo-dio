const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMoreButton');

const maxRecords = 151;
const limit = 10;
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}" data-name="${pokemon.name}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}" alt="${pokemon.name}">
            </div>
        </li>
    `;
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('');
        pokemonList.innerHTML += newHtml;
    });
}

loadPokemonItens(offset, limit);

loadMoreButton.addEventListener('click', () => {
    offset += limit;
    const qtdRecordsWithNexPage = offset + limit;

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset;
        loadPokemonItens(offset, newLimit);

        loadMoreButton.parentElement.removeChild(loadMoreButton);
    } else {
        loadPokemonItens(offset, limit);
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const pokemonModal = document.querySelector("#pokemonModal");
    const modalBody = document.querySelector("#modalBody");
    const closeModal = document.querySelector("#closeModal");

    // Função para abrir o modal com os detalhes do Pokémon
    const showPokemonDetails = async (pokemonName) => {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
            const pokemonData = await response.json();

            // Construir o conteúdo do modal
            modalBody.innerHTML = `
                <h2>${pokemonData.name.toUpperCase()} (#${pokemonData.id})</h2>
                <img src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}">
                <p><strong>Altura:</strong> ${pokemonData.height / 10} m</p>
                <p><strong>Peso:</strong> ${pokemonData.weight / 10} kg</p>
                <p><strong>Tipos:</strong> ${pokemonData.types.map(type => type.type.name).join(", ")}</p>
                <p><strong>Habilidades:</strong> ${pokemonData.abilities.map(ability => ability.ability.name).join(", ")}</p>
            `;

            // Exibir o modal
            pokemonModal.style.display = "block";
        } catch (error) {
            console.error("Erro ao buscar os detalhes do Pokémon:", error);
        }
    };

    // Fechar o modal ao clicar no botão de fechar
    closeModal.addEventListener("click", () => {
        pokemonModal.style.display = "none";
    });

    // Fechar o modal ao clicar fora do conteúdo
    window.addEventListener("click", (event) => {
        if (event.target === pokemonModal) {
            pokemonModal.style.display = "none";
        }
    });

    // Adicionar evento de clique para cada Pokémon
    pokemonList.addEventListener("click", (event) => {
        const pokemonCard = event.target.closest("li"); // Encontra o card do Pokémon
        if (pokemonCard) {
            const pokemonName = pokemonCard.dataset.name; // Obter o nome do Pokémon
            showPokemonDetails(pokemonName);
        }
    });
});
