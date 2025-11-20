const list = document.getElementById('pokemon-list');
const filter = document.getElementById('filter');
const search = document.getElementById('search');
const darkToggle = document.getElementById('darkToggle');

// Modal
const modal = document.getElementById('modal');
const closeModal = document.getElementById('closeModal');
const modalImage = document.getElementById('modalImage');
const modalName = document.getElementById('modalName');
const modalTypes = document.getElementById('modalTypes');
const modalHeight = document.getElementById('modalHeight');
const modalWeight = document.getElementById('modalWeight');
const modalAbilities = document.getElementById('modalAbilities');
const modalStats = document.getElementById('modalStats');

let allPokemon = [];
const legendary = ["mewtwo", "articuno", "zapdos", "moltres", "mew"];

// Modo escuro inicial
if (localStorage.getItem("darkmode") === "on") {
    document.documentElement.classList.add("dark");
}

// Alternar modo escuro
darkToggle.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");

    const isDark = document.documentElement.classList.contains("dark");
    localStorage.setItem("darkmode", isDark ? "on" : "off");
});

// Cores dos tipos
function getColor(type) {
    const colors = {
        fire: "bg-orange-500",
        water: "bg-blue-500",
        grass: "bg-green-500",
        electric: "bg-yellow-400",
        psychic: "bg-purple-500",
        dark: "bg-gray-600",
        dragon: "bg-indigo-600"
    };
    return colors[type] || "bg-gray-500";
}

async function getPokemonNamePT(id) {
    const resp = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
    const data = await resp.json();

    const ptName = data.names.find(n => n.language.name === "pt");
    return ptName ? ptName.name : data.name;
}

async function loadPokemon() {
    for (let i = 1; i <= 151; i++) {
        const resp = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
        const data = await resp.json();

        allPokemon.push({
            id: data.id,
            name: data.name,
            image: data.sprites.other["official-artwork"].front_default,
            types: data.types.map(t => t.type.name)
        });
    }

    renderPokemon(allPokemon);
}

// Card do Pokemon
function renderPokemon(listData) {
    list.innerHTML = "";

    listData.forEach(p => {
        const typesHTML = p.types.map(t =>
            `<span class="px-2 py-1 rounded text-white text-xs ${getColor(t)}">`
        ).join("");

        list.innerHTML += `
            <div onclick="openPokemon(${p.id})"
                class="bg-white dark:bg-gray-800 dark:text-white rounded-2xl p-5 shadow-md hover:shadow-xl transition transform hover:-translate-y-1 cursor-pointer">

                <img src="${p.image}" class="w-28 h-28 mx-auto drop-shadow-xl">

                <h3 class="text-center font-bold text-lg mt-3 capitalize">
                    ${p.id}. ${p.name}
                </h3>

                <div class="flex justify-center gap-2 mt-2">
                    ${typesHTML}
                </div>
            </div>
        `;
    });
}

// Modal
async function openPokemon(id) {
    const resp = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await resp.json();

    modalImage.src = data.sprites.other["official-artwork"].front_default;
    modalName.textContent = data.name;

    modalTypes.innerHTML = data.types.map(t =>
        `<span class="px-3 py-1 rounded text-white text-sm bg-${getColor(t.type.name)}-500">${t.type.name}</span>`
    ).join("");

    modalHeight.textContent = (data.height / 10).toFixed(1);
    modalWeight.textContent = (data.weight / 10).toFixed(1);

    modalAbilities.textContent = data.abilities
        .map(a => a.ability.name)
        .join(", ");

    modalStats.innerHTML = data.stats.map(s =>
        `<li><strong>${s.stat.name.toUpperCase()}</strong>: ${s.base_stat}</li>`
    ).join("");

    modal.classList.remove("hidden");
}

closeModal.addEventListener("click", () => modal.classList.add("hidden"));
modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.add("hidden");
});


// Filtro e Pesquisa
function applyFilters() {
    const typeFilter = filter.value;
    const searchText = search.value.toLowerCase();

    let filtered = allPokemon.filter(p =>
        p.name.includes(searchText)
    );

    if (typeFilter === "legendary") {
        filtered = filtered.filter(p => legendary.includes(p.name));
    } else if (typeFilter !== "all") {
        filtered = filtered.filter(p => p.types.includes(typeFilter));
    }

    renderPokemon(filtered);
}

filter.addEventListener("change", applyFilters);
search.addEventListener("keyup", applyFilters);

loadPokemon();
