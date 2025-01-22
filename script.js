// Use the API_URL variable to make fetch requests to the API.
// Replace the placeholder with your cohort name (ex: 2109-UNF-HY-WEB-PT)
const cohortName = "2412-FTB-ET-WEB-FT";
const API_URL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}`;

/**
 * Fetches all players from the API.
 * @returns {Object[]} the array of player objects
 */
const fetchAllPlayers = async () => {
  try {
    const response = await fetch(`${API_URL}/players`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data.players;
  } catch (err) {
    console.error("Uh oh, trouble fetching players!", err);
  }
};

/**
 * Fetches a single player from the API.
 * @param {number} playerId
 * @returns {Object} the player object
 */
const fetchSinglePlayer = async (playerId) => {
  try {
    const playerIdResponse = await fetch(`${API_URL}/players/${playerId}`);
    if (!playerIdResponse.ok) {
      throw new Error(`HTTP error! status: ${playerIdResponse.status}`);
    }
    const idData = await playerIdResponse.json();
    return idData.data.player;
  } catch (err) {
    console.error(`Oh no, trouble fetching player #${playerId}!`, err);
  }
};

/**
 * Adds a new player to the roster via the API.
 * @param {Object} playerObj the player to add
 * @returns {Object} the player returned by the API
 */
const addNewPlayer = async (playerObj) => {
  try {
    const objectResponse = await fetch(`${API_URL}/players`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(playerObj)
    });
    if (!objectResponse.ok) {
      throw new Error(`HTTP error! status: ${objectResponse.status}`);
    }
    const objectData = await objectResponse.json();
    return objectData.data.player;
  } catch (err) {
    console.error("Oops, something went wrong with adding that player!", err);
  }
};



/**
 * Removes a player from the roster via the API.
 * @param {number} playerId the ID of the player to remove
 */
const removePlayer = async (playerId) => {
  try {
    const removeResponse = await fetch(`${API_URL}/players/${playerId}`, {
      method: "DELETE",
    });

    if (!removeResponse.ok) {
      throw new Error(`HTTP error! status: ${removeResponse.status}`);
    }
    console.log(`Player #${playerId} has been removed!`);
  } catch (err) {
    console.error(
      `Whoops, trouble removing player #${playerId} from the roster!`,
      err
    );
  }
};

/**
 * Updates `<main>` to display a list of all players.
 *
 * If there are no players, a corresponding message is displayed instead.
 *
 * Each player is displayed in a card with the following information:
 * - name
 * - id
 * - image (with alt text of the player's name)
 *
 * Additionally, each card has two buttons:
 * - "See details" button that, when clicked, calls `renderSinglePlayer` to
 *    display more information about the player
 * - "Remove from roster" button that, when clicked, will call `removePlayer` to
 *    remove that specific player and then re-render all players
 *
 * Note: this function should replace the current contents of `<main>`, not append to it.
 * @param {Object[]} playerList - an array of player objects
 */
const renderAllPlayers = (playerList) => {
  const main = document.querySelector("main");
  main.innerHTML = "";

  //if statement for list length

  if (!playerList.length) {
    main.innerHTML = "<p>No players found!</p>";
    return;
  }

  //create a card for each player
  playerList.forEach((player) => {
    const playerCard = document.createElement("div");
    playerCard.classList.add("player-card");
    playerCard.innerHTML = `
<h2>${player.name}</h2>
<p>Player ID: ${player.id}</p>
<img src="${player.imageUrl}" alt="${player.name}">
<button class="dtlBtn" data-id="${player.id}">See Puppy Details</button>
<button class="rmvBtn" data-id="${player.id}">Remove Puppy</button>
`;
    main.appendChild(playerCard);
  });

  // Event listener to see details button
  const dtlBtn = document.querySelectorAll(".dtlBtn");
  dtlBtn.forEach((button) => {
    button.addEventListener("click", async () => {
      const player = await fetchSinglePlayer(button.dataset.id);
      renderSinglePlayer(player);
    });
  });

  // Event listener to remove button
  const rmvBtn = document.querySelectorAll(".rmvBtn");
  rmvBtn.forEach((button) => {
    button.addEventListener("click", async () => {
      const confirmation = confirm("Are you sure you want to remove this player?");
      if (confirmation) {
        await removePlayer(button.dataset.id);
        const players = await fetchAllPlayers();
        renderAllPlayers(players);
      }
    });
  });



};
/**
 * Fills in `<form id="new-player-form">` with the appropriate inputs and a submit button.
 * When the form is submitted, it should call `addNewPlayer`, fetch all players,
 * and then render all players to the DOM.
 */
const renderNewPlayerForm = () => {
  try {
    const form = document.getElementById("new-player-form");
    form.innerHTML = `
     
      <input type="text" id="name" name="name" placeholder="Puppy Name" required>
         
    
      <input type="text" id="breed" name="breed" placeholder="Puppy Breed" required>
  
      <input type="url" id="image" name="image" placeholder="Puppy Image" required>
      <button type="submit">Add New Player</button>`;

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const newPlayer = {
        name: form.name.value,
        breed: form.breed.value,
        imageUrl: form.image.value,
      };
      await addNewPlayer(newPlayer);
      const players = await fetchAllPlayers();
      renderAllPlayers(players);
      form.reset();
    });
  } catch (err) {
    console.error("Uh oh, trouble rendering the new player form!", err);
  }
};




/**
 * Updates `<main>` to display a single player.
 * The player is displayed in a card with the following information:
 * - name
 * - id
 * - breed
 * - image (with alt text of the player's name)
 * - team name, if the player has one, or "Unassigned"
 *
 * The card also contains a "Back to all players" button that, when clicked,
 * will call `renderAllPlayers` to re-render the full list of players.
 * @param {Object} player an object representing a single player
 */
const renderSinglePlayer = (player) => {
  constplayerDetails = document.querySelector("#playerDetails");
  playerDetails.innerHTML = `
    <h2>${player.name}</h2>
    <p>Player ID: ${player.id}</p>
    <p>Breed: ${player.breed}</p>
    <p>Team: ${player.team ? player.team.name : "Unassigned"}</p>
    <img src="${player.imageUrl}" alt="${player.name}">
    `;
  const modal = document.querySelector("#playerModal");
  const span = document.querySelector(".close");
  modal.style.display = "block";
  span.onclick = () => {
    modal.style.display = "none";
  }
  window.onclick = (event) => {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
};
/**
 * Initializes the app by fetching all players and rendering them to the DOM.
 */
const init = async () => {
  const players = await fetchAllPlayers();
  renderAllPlayers(players);
  renderNewPlayerForm();
};
// This script will be run using Node when testing, so here we're doing a quick
// check to see if we're in Node or the browser, and exporting the functions
// we want to test if we're in Node.
if (typeof window === "undefined") {
  module.exports = {
    fetchAllPlayers,
    fetchSinglePlayer,
    addNewPlayer,
    removePlayer,
    renderAllPlayers,
    renderSinglePlayer,
    renderNewPlayerForm,
  };
} else {
  init();
}