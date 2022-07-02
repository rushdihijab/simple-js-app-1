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
	function myFunction() {
	    var input, filter, ul, li, a, i, txtValue;
	    input = document.getElementById("form-control mr-sm-2");
	    filter = input.value.toUpperCase();
	    ul = document.getElementById("#pokemon-list");
	    li = ul.getElementsByTagName("li");
	    for (i = 0; i < li.length; i++) {
	        a = li[i].getElementsByTagName("a")[0];
	        txtValue = a.textContent || a.innerText;
	        if (txtValue.indexOf(filter) > -1) {
	            li[i].style.display = "";
	        } else {
	            li[i].style.display = "none";
	        }
	    }
	}



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
