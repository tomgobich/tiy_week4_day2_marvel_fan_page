$(document).ready(function()
{

	// DOM selectors
	var $modal 		= $('#modal');
	var $modalBody 	= $('#modalBody');



	// Comic array to hold all comics returned from API
	var comics = [];

	// Function constructor for Comic
	function Comic(){};

	// Call API to get comics
	$.ajax({
		url: `https://gateway.marvel.com:443/v1/public/comics?apikey=99259ddb87ee02a03bf6f38353eb1936`,
		success: function(resp) { loadComics(resp) },
	})


	
	// Event listener for comic button
	$('body').on('click', '.btn-comic', loadComicDetails);

	

	// --------------------------------------------------
	// Load comic data from API into Object & array
	// --------------------------------------------------
	function loadComics(comicData)
	{
		// Target data location
		var comicList = comicData.data.results;

		// Loop through comics
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

		// Display comics
		displayComics();
	}



	// --------------------------------------------------
	// Display comics
	// --------------------------------------------------
	function displayComics()
	{
		var $comicList = $('#comicList');
		var comicElement = "";

		// Loop through comics array
		for(let i = 0; i < comics.length; i++)
		{
			// Set i index as target comic
			var comic = comics[i];

			// Load data into HTML block
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

		// Append HTML block to DOM
		$comicList.append(comicElement);
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






