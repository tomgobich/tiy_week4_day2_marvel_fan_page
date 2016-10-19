$(document).ready(function()
{	
	const FEATURED_COUNT = 6;



	// DOM selectors
	var $modal 		= $('#modal');
	var $modalBody 	= $('#modalBody');



	// Character array to hold all characters returned from API
	var characters = [];

	// Function constructor for Character
	function Character(){};

	// Comic array to hold all comics returned from API
	var comics = [];

	// Function constructor for Comic
	function Comic(){};

	// Call API to get characters
	$.ajax({
		url: `https://gateway.marvel.com:443/v1/public/characters?apikey=99259ddb87ee02a03bf6f38353eb1936`,
		success: function(resp) { loadCharacters(resp); },
	})

	// Call API to get comics
	$.ajax({
		url: `https://gateway.marvel.com:443/v1/public/comics?apikey=99259ddb87ee02a03bf6f38353eb1936`,
		success: function(resp) { loadComics(resp) },
	})



	// Event listener for character button
	$('body').on('click', '.btn-character', loadCharacterDetails);

	// Event listener for comic button
	$('body').on('click', '.btn-comic', loadComicDetails);



	// --------------------------------------------------
	// Load character data from API into Object & array
	// --------------------------------------------------
	function loadCharacters(characterData)
	{
		// Pinpoint data location
		var characterList = characterData.data.results;

		// Loop through needed data
		characterList.forEach(function(characterInfo)
		{
			// Create new character object
			var character = new Character();

			// Append image attributes
			let characterImage = characterInfo.thumbnail.path + '.' + characterInfo.thumbnail.extension;

			// Load data into object
			character.id = characterInfo.id;
			character.name = characterInfo.name;
			character.description = characterInfo.description;
			character.image = characterImage;
			character.comics = characterInfo.comics;

			// load object into array
			characters.push(character);
		});

		// Display character data
		displayFeaturedCharacters();
	}



	// --------------------------------------------------
	// Display featured characters
	// --------------------------------------------------
	function displayFeaturedCharacters()
	{
		var $featuredCharacters = $('#featuredCharacters');
		var characterElement = "";

		// Loop until featured count is reached
		for(let i = 0; i < FEATURED_COUNT; i++)
		{
			// Get random number from 0 to length of characters array
			let random = Math.floor(Math.random() * characters.length);
			
			// Set active character as random index number
			var character = characters[random];

			// Load HTML block into variable
			characterElement += 
			`
				<div data-id="${character.id}" class="col-xs-4 col-md-2 comic-listing">
					<img class="character-image" src="${character.image}" alt="${character.name}">
					<h4 class="character-name">${character.name}</h4>
					<button class="btn marvel btn-character">View Details</button>
				</div>
			`;
		}

		// Append data to parent element
		$featuredCharacters.append(characterElement);
	}



	// --------------------------------------------------
	// Load comic data from API into Object & array
	// --------------------------------------------------
	function loadComics(comicData)
	{
		// Pinpoint data location
		var comicList = comicData.data.results;

		// Loop through needed data
		comicList.forEach(function(comicInfo)
		{
			// Create new comic object
			var comic = new Comic();

			// Concatenate image attributes
			let comicImage = comicInfo.thumbnail.path + '.' + comicInfo.thumbnail.extension;

			// Load data into object
			comic.id = comicInfo.id;
			comic.title = comicInfo.title;
			comic.description = comicInfo.description;
			comic.image = comicImage;
			comic.price = comicInfo.prices[0].price;

			// Load object into array
			comics.push(comic);
		});

		// Display featured comics
		displayFeaturedComics();
	}



	// --------------------------------------------------
	// Display featured comics
	// --------------------------------------------------
	function displayFeaturedComics()
	{
		var $featuredComics = $('#featuredComics');
		var comicElement = "";

		// Loop until featured count is reached
		for(let i = 0; i < FEATURED_COUNT; i++)
		{
			// Get a random number from 0 to comics length
			let random = Math.floor(Math.random() * comics.length);
			
			// Set comic at random index as target
			var comic = comics[random];

			// Load HTML block into variable
			comicElement +=
			`
				<div data-id="${comic.id}" class="col-xs-4 col-md-2 comic-listing">
					<img class="comic-image" src="${comic.image}" alt="${comic.title}">
					<h4 class="comic-title">${comic.title}</h4>
					<p class="comic-price">$${comic.price}</p>
					<button class="btn marvel btn-comic">View Details</button>
				</div>
			`;
		}

		// Append data to element parent
		$featuredComics.append(comicElement);
	}



	// --------------------------------------------------
	// Loads selected character's details
	// --------------------------------------------------
	function loadCharacterDetails(event)
	{
		// Get element from event and get data-id from parent
		let self = event.target,
			id   = $(self).parent().data('id');

		// Build modal to display character
		buildCharacterModal(id);	
	}



	// --------------------------------------------------
	// Loads selected comic's details
	// --------------------------------------------------
	function loadComicDetails(event)
	{
		// Get element from event and get data-id from parent
		let self = event.target,
			id 	 = $(self).parent().data('id');

		// Build modal to display comic
		buildComicModal(id);
	}



	// --------------------------------------------------
	// Build modal pop-up for character
	// --------------------------------------------------
	function buildCharacterModal(id)
	{
		var character = null;

		// Loop through characters
		characters.forEach(function(characterInfo, index)
		{
			// Look for ID match
			if(id === characterInfo.id)
			{
				// Set ID match as target character
				character = characterInfo;
			}
		});

		// Is the description null?
		if(character.description === null)
		{
			// Yes, replace with...
			character.description = "No description...";
		}

		// Build HTML block for modal body
		let modalBody =
		`
			<div class="row">
				<div class="col-xs-12">
					<img class="modal-image" src="${character.image}" alt="${character.name}">
					<h2 class="marvel">${character.name}</h2>
					<p>${character.description}</p>
				</div>
			</div>
			<div class="row">
				<div class="col-xs-12">
					<h4>${character.name} Appears in the following comics:</h4>
				</div>
			</div>
		`;

		// Loop through character's comics
		character.comics.items.forEach(function(comicInfo)
		{
			// Append comics to modal body element block
			modalBody += 
			`
				<div class="row">
					<div class="col-xs-12">
						<p>${comicInfo.name}</p>
					</div>
				</div>
			`;
		});

		// Apply modal body to modal's body
		$modalBody.html(modalBody);

		// Show modal
		$modal.modal('show'); 
	}



	// --------------------------------------------------
	// Build modal pop-up for Comic
	// --------------------------------------------------
	function buildComicModal(id)
	{
		var comic = null;

		// Loop through comics
		comics.forEach(function(comicInfo, index)
		{
			// Search for ID match
			if(id === comicInfo.id)
			{
				// Set id match as target comic
				comic = comicInfo;
			}
		});

		// Is description null?
		if(comic.description === null)
		{
			// Yes, replace with...
			comic.description = "No description...";
		}

		// Build modal body element block
		let modalBody =
		`
			<div class="row">
				<div class="col-xs-12">
					<img class="modal-image" src="${comic.image}" alt="${comic.title}">
					<h2 class="marvel">${comic.title}</h2>
					<p class="modal-comic-description">${comic.description}</p>
				</div>
			</div>
		`;

		// Apply modal body to the modal's body
		$modalBody.html(modalBody);

		// Show modal
		$modal.modal('show'); 
	}

	

});






