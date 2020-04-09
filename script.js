var settings = {
	"async": true,
	"crossDomain": true,
	"url": "https://edamam-edamam-nutrition-analysis.p.rapidapi.com/api/nutrition-data?ingr=1%20large%20apple",
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "edamam-edamam-nutrition-analysis.p.rapidapi.com",
		"x-rapidapi-key": "d8b37011d5mshfdc852418e9e300p167785jsn0d94302f0b12"
	}
}

$.ajax(settings).done(function (response) {
	console.log(response);
});