let pokemonRepository = (function() {
	let repository = [];
	let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';


	function add(pokemon) {
		repository.push(pokemon);
	}

	function getAll() {
		return repository;
	}

	function addListItem(pokemon) {
		let pokemonList = document.querySelector(".pokemon-list");
		let listpokemon = document.createElement("li");
		let button = document.createElement("button");
		button.innerText = pokemon.name;
		button.classList.add("button1");
		listpokemon.appendChild(button);
		pokemonList.appendChild(listpokemon);
		addEvent(button, pokemon);
	}

	function addEvent(button, pokemon) {
		button.addEventListener('click', function() {
			showDetails(pokemon);
		});
	}

	function loadList() {
		return fetch(apiUrl).then(function(response) {
			return response.json();
		}).then(function(json) {
			json.results.forEach(function(item) {
				let pokemon = {
					name: item.name,
					detailsUrl: item.url
				};
				add(pokemon);
				console.log(pokemon);
			});
		}).catch(function(e) {
			console.error(e);
		});
	}

	function loadDetails(item) {
		let url = item.detailsUrl;
		return fetch(url).then(function(response) {
			return response.json();
		}).then(function(details) {
			// Now we add the details to the item
			item.imageUrl = details.sprites.front_default;
			item.height = details.height;
			item.types = details.types;
		}).catch(function(e) {
			console.error(e);
		});
	}

function showModal(pokemon){
	let modalContainer = document.querySelector("#modal-container");
	modalContainer.innerHTML='';
	let modal = document.createElement('div');
	modal.classList.add('modal');
	//add content to the modal//
	let closeButtonElement = document.createElement('button');
	closeButtonElement.classList.add('modal-close');
	closeButtonElement.innerText = 'Close';
	closeButtonElement.addEventListener('click', hideModal);
	let titleElement = document.createElement('h4');
	titleElement.innerText = pokemon.name;
	let contentElement = document.createElement('h5');
	contentElement.innerText = pokemon.height;

	//add img to the modal//

	let pokemonImage = document.createElement('image');
	pokemonImage.src = pokemon.imageUrl;
	modal.appendChild(pokemonImage);
	modal.appendChild(titleElement);
	modal.appendChild(contentElement);
	modalContainer.appendChild(modal);
	modalContainer.classList.add('is-visible');
	function hideModal() {
  	let modalContainer = document.querySelector("#modal-container");
  	modalContainer.classList.remove("is-visible");
		modalContainer.addEventListener("click", (e) => {
        let target = e.target;
        if(target === modalContainer) {
            hideModal();
        }
        });
}


    // Function to close the modal via the Esc keyboard key
    window.addEventListener("keydown", (e) => {
        let modalContainer = document.querySelector("modal-container");
        if (e.key === "Escape" && modalContainer.classList.contains("is-visible")) {
            hideModal();
        }
    });

	function showDetails(item) {
		pokemonRepository.loadDetails(item).then(function() {
			showModal(item);
		});
	}

	return {
		add: add,
		getAll: getAll,
		addListItem: addListItem,
		loadList: loadList,
		loadDetails: loadDetails,
		showDetails: showDetails
	};
})();


pokemonRepository.loadList().then(function() {
	pokemonRepository.getAll().forEach(function(pokemon) {
		pokemonRepository.addListItem(pokemon);
	});
});   
