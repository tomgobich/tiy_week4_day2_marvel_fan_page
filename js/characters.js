$(document).ready(function()
{	

	// Character array to hold all characters returned from API
	var characters = [];

	// Function constructor for Character
	function Character(){};

	// Call API to get characters
	$.ajax({
		url: `https://gateway.marvel.com:443/v1/public/characters?apikey=99259ddb87ee02a03bf6f38353eb1936`,
		success: function(resp) { loadCharacters(resp); },
	})



	// --------------------------------------------------
	// --------------------------------------------------
	//
	// Event Listeners
	//
	// --------------------------------------------------
	// --------------------------------------------------

	// Event listener for character button
	$('body').on('click', '.btn-character', loadCharacterDetails);

	

	// --------------------------------------------------
	// --------------------------------------------------
	//
	// Functions
	//
	// --------------------------------------------------
	// --------------------------------------------------

	// --------------------------------------------------
	// Load character data from API into Object & array
	// --------------------------------------------------
	function loadCharacters(characterData)
	{
		// Load data path
		var characterList = characterData.data.results;

		// Loop through characters
		characterList.forEach(function(characterInfo)
		{
			// Create new character object
			var character = new Character();

			// Concatenate image attributes
			let characterImage = characterInfo.thumbnail.path + '.' + characterInfo.thumbnail.extension;

			// Load data into object
			character.id = characterInfo.id;
			character.name = characterInfo.name;
			character.description = characterInfo.description;
			character.image = characterImage;
			character.comics = characterInfo.comics;

			// Load object into array
			characters.push(character);
		});

		// Display featured characters
		displayCharacters();
	}



	// --------------------------------------------------
	// Display characters
	// --------------------------------------------------
	function displayCharacters()
	{
		var $characterList = $('#characterList');
		var characterElement = "";

		// Loop through characters array
		for(let i = 0; i < characters.length; i++)
		{	
			// Set i index as target character
			var character = characters[i];

			// Build characters HTML
			characterElement += 
			`
				<div data-id="${character.id}" class="col-xs-4 col-md-2 comic-listing">
					<img class="character-image" src="${character.image}" alt="${character.name}">
					<h4 class="character-name">${character.name}</h4>
					<button class="btn marvel btn-character">View Details</button>
				</div>
			`;
		}

		// Append characters to HTML
		$characterList.append(characterElement);
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
		$('#modalBody').html(modalBody);

		// Show modal
		$('#modal').modal('show'); 
	}

	

});






