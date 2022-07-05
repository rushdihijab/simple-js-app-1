// IIFE function;
let pokemonRepository = (function() {
	let repository = [];
	let pokemon =[];
	// The variable apiUrl holds the API link to the pokemon list.
	let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';
	let input = $("input");
  input.on("input", filterList);

	function add(pokemon) {
		repository.push(pokemon);
	}

	function getAll() {
		return repository;
	}

	function filterList() {
    let inputValue = $("input").val();
    let list = $("li");
    list.each(function() {
      let item = $(this);
      let name = item.text();
      if (name.startsWith(inputValue)) {
        item.show();
      } else {
        item.hide();
      }
    });
  }
	//pokemon list + li + button show the details//
	function addListItem(pokemon) {
		let pokemonList = document.querySelector("#pokemon-list");
		let listpokemon = document.createElement("li");
		let button = document.createElement("button");
		let name = pokemon.name
		button.innerText = name.toUpperCase();
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
			item.imageUrl = details.sprites.other["official-artwork"].front_default;
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
		// Clear existing modal content
		let modalBody = $('.modal-body');
		let modalTitle = $('.modal-title');
		modalTitle.empty();
		modalBody.empty();
		// Create content to be appended to the modal
		let name = pokemon.name
		let nameElement = $('<h2>' + name.toUpperCase() + '</h2>');
		let imageElement = $('<img class="modal-img" style="width:50%">');
		imageElement.attr('src', pokemon.imageUrl);
		let heightElement = $('<p>' + 'Height : ' + pokemon.height + '</p>');
		let weightElement = $('<p>' + 'Weight : ' + pokemon.weight + '</p>');
		//Append content to the modal
		modalTitle.append(nameElement);
		modalBody.append(imageElement);
		modalBody.append(heightElement);
		modalBody.append(weightElement);
		$('#exampleModalLive').modal();

	}

	// the search functin ??? //
	// let navbar =document.querySelector('#navbarSupportedContent');
	// let inputForSearch =document.querySelector('input')
	// inputForSearch.addEventListener('keyup', (e) => {
	// 	let seachBar = e.target.value;
	// 	let filter = loadList.filter((pokemon) => {
	// 		return (
	// 			pokemon.name.include(seachBar)
	// 		);
	// 	});
	// 	console.log(filter);
	// });

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





// First loadList of pokemon from API
// Then execute to get all pokemons as required
// And execute for Each pokemon an new list if required
pokemonRepository.loadList().then(function() {
	pokemonRepository.getAll().forEach(function(pokemon) {
		pokemonRepository.addListItem(pokemon);
	});
});
