function generateImageUrl(image){
	var data = {
		farmId: image.farm,
		serverId: image.server,
		id: image.id,
		secret : image.secret
	};    
   
	var imageUrl = IMAGE_URL_TEMPLATE.replace(/\{(.*?)\}/g, function(i, match) {
		return data[match];
	});
	
	return imageUrl;
};


function authenticate(viewModel){

	//Getting FROB (needed for get token in future)			
	 var frobParams ={
		api_key : API_KEY,
		method : GET_FROB,
		format : FORMAT_JSON,
		nojsoncallback : 1
	};				
	var api_signature = getSignature(frobParams, SECRET);			
		
	$.getJSON(API_URL,{
		api_key : API_KEY,
		format : FORMAT_JSON,
		method : GET_FROB,
		nojsoncallback : 1,
		api_sig : api_signature,
	}).success(function(data){
		var frob = data.frob._content;
		
		//CREATE A FLICKR LOGIN LINK
		//http://www.flickr.com/services/auth/?api_key=[api_key]&perms=[perms]&frob=[frob]&api_sig=[api_sig]
		
		//GENERATE THE AUTHENTICATION SIGNATURE.
		//Signatures are created using your secret and the other arguments listed in alphabetical order, name then value. In our example, we want to request [delete] permissions
		
		var authentificationLinkParams = {
			"api_key" : API_KEY,
			"frob" : frob,
			"perms" : PERMS
		};				
		api_signature = getSignature(authentificationLinkParams, SECRET);
		
		var authentificationLink = "http://www.flickr.com/services/auth/"
			+"?api_key=" + API_KEY
			+"&frob=" + frob
			+"&perms=" + PERMS
			+"&api_sig=" + api_signature;
			
		//Open authentification window
		var win = window.open(authentificationLink);
		var timer = setInterval(function() {
			if (win.closed) {
				clearInterval(timer);
				
				//continue. Get TOKEN
				var tokenParams = {
					"api_key" : API_KEY,
					"format" : FORMAT_JSON,
					"frob" : frob,
					"method" : GET_TOKEN,
					"nojsoncallback" : 1
				}
				
				api_signature = getSignature(tokenParams, SECRET);

				$.getJSON(API_URL,{
					api_key : API_KEY,
					format : FORMAT_JSON,
					frob: frob,
					method: GET_TOKEN,
					nojsoncallback : 1,
					api_sig : api_signature,
				}).success(function(data){
					var token = data.auth.token._content;
					/* !!!!!!!!!!!!!! */
					/* Save token */
					viewModel.token = token;
				}).fail(function(data){
					alert("fail");
					alert("Stat: " +data.stat+"\n"+"Message: "+data.message);
				});
			}
		}, 500);
	}).fail(function(data){
		alert("fail");
		alert("Stat: " +data.stat+"\n"+"Message: "+data.message);	
	});
};

function getSignature(params, secretKey){
	var keys = Object.keys(params);
	keys.sort();
	
	var sig = "" + secretKey;
	for(var i=0; i<keys.length; i++){
		var key = keys[i];
		sig += ""+key+params[key];
	}
	return md5(sig);
};


function deleteWithToken(viewModel, photoId, photosetId){
	var deleteRequestParams ={
		"api_key" : API_KEY,
		"auth_token" : viewModel.token,
		"format" : FORMAT_JSON,
		"method" : REMOVE_PHOTO_FROM_PHOTOSET,
		"nojsoncallback" : 1,
		"photo_id" : photoId,
		"photoset_id" :  photosetId
	 };
	
	api_signature = getSignature(deleteRequestParams, SECRET);
	 
	$.getJSON(API_URL,{
		api_key : API_KEY,
		auth_token : viewModel.token,
		format : FORMAT_JSON,
		method: REMOVE_PHOTO_FROM_PHOTOSET,
		nojsoncallback : 1,
		photo_id: photoId,
		photoset_id: photosetId,
		api_sig : api_signature,
	}).success(function(data){
		alert("Stat: " +data.stat+"\n"+"Message: "+data.message);
		//Refresh UI;
		var photosets = viewModel.photosets();
		var currentPhotoset = $.grep(photosets, function(photoset){ return photoset.id == photosetId; })[0];
		viewModel.getPhotosByPhotoset(currentPhotoset);
	});
};


function setMeta(viewModel,photoId,photosetId, title){
	var setMetaParams = {
		"auth_token" : viewModel.token,
		"method": SET_PHOTO_META,
		"api_key" : API_KEY,
		"photo_id" : photoId,
		"title" : title,
		"format": FORMAT_JSON,
		"nojsoncallback": 1
	};
	api_signature = getSignature(setMetaParams,SECRET);

	$.getJSON(API_URL,{
		method: SET_PHOTO_META,
		api_key : API_KEY,
		photo_id : photoId,
		title : title,
		format: FORMAT_JSON,
		nojsoncallback: 1,
		auth_token : viewModel.token,
		api_sig : api_signature
	}).success(function(data){
		alert("Stat: " +data.stat+"\n"+"Message: "+data.message);
		//Refresh UI;
		var photosets = viewModel.photosets();
		var currentPhotoset = $.grep(photosets, function(photoset){ return photoset.id == photosetId; })[0];
		viewModel.getPhotosByPhotoset(currentPhotoset);
	});
};
