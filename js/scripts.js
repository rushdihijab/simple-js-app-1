// IIFE function;

let pokemonRepository = (function() {
			let repository = [];
	// The variable apiUrl holds the API link to the pokemon list.
			let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';


			function add(pokemon) {
				repository.push(pokemon);
			}

			function getAll() {
				return repository;
			}
			//pokemon list + li + button show the details//
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
			// The eventListener funciton holds two parameters.

			function addEvent(button, pokemon) {
				button.addEventListener('click', function() {
					showDetails(pokemon);
				});
			}
			//fetch pokemon API//
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
					// Now we add the details to the item//
					item.imageUrl =     details.sprites.front_default;
					item.height = details.height;
					item.types = details.types;
					item.weight = details.weight
				}).catch(function(e) {
					console.error(e);
				});
			}
			// The function showDetails calls the functin loadDetails.//
			// The function loadDetails holds the item informationi for each pokemon//
			// The item information are provided in the JS API//

			function showDetails(item) {
				pokemonRepository.loadDetails(item).then(function() {
					showModal(item);
				});
			}
			//modalContainer//
			function showModal(pokemon) {
				let modalContainer = document.querySelector('#modal-container');
				modalContainer.innerHTML = '';
				let modal = document.createElement('div');
				modal.classList.add('modal');
				//add content to the modal//
				let closeButtonElement = document.createElement('button');
				closeButtonElement.classList.add('modal-close');
				closeButtonElement.innerText = 'X';
				closeButtonElement.addEventListener('click', hideModal);
				let titleElement = document.createElement('h4');
				titleElement.innerText = 'Name : ' + pokemon.name;
				let contentElement = document.createElement('h5');
				contentElement.innerText = 'Height : ' + pokemon.height;
				let weightElement = document.createElement('h2');
				weightElement.innerText = 'Weight : '+pokemon.weight;
				let typesElement = document.createElement('h3');
				//typesElement.innerText = pokemon.types.map(t => 't.types');

				//add img to the modal//
				let pokemonImage = document.createElement('img');
				pokemonImage.src = pokemon.imageUrl;
				//appendChild//
				modal.appendChild(pokemonImage);
				modal.appendChild(closeButtonElement);
				modal.appendChild(titleElement);
				modal.appendChild(contentElement);
				modal.appendChild(weightElement);
				//modal.appendChild(typesElement);
				modalContainer.appendChild(modal);
				modalContainer.classList.add('is-visible');

				}

				function hideModal() {
					let modalContainer = document.querySelector('#modal-container');
					modalContainer.classList.remove('is-visible');
				}

				let modalContainer = document.querySelector('#modal-container')
				modalContainer.addEventListener('click', (e) => {
						let target = e.target;
						if (target === modalContainer) {
							hideModal();
						}
					});


					// Function to close the modal via the Esc keyboard key//
					window.addEventListener('keydown', (e) => {
						let modalContainer = document.querySelector('#modal-container');
						if (e.key === 'Escape' && modalContainer.classList.contains('is-visible')) {
							hideModal();
						}
					});

				return {
					add: add,
					getAll: getAll,
					addListItem: addListItem,
					loadList: loadList,
					loadDetails: loadDetails,
					showDetails: showDetails,
					showModal: showModal,

				}

			})();

		pokemonRepository.loadList().then(function() {
			pokemonRepository.getAll().forEach(function(pokemon) {
				pokemonRepository.addListItem(pokemon);
			});
		});
