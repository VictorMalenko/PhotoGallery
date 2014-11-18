function Photo(photo, photosetId){
	var self = this;
	
	self.id = photo.id;	
	self.title = photo.title;
	self.photosetId = photosetId;
	
	self.imageUrl = generateImageUrl({
			farm: photo.farm,
			server: photo.server,
			id: photo.id,
			secret : photo.secret
	});
}


function PhotosetViewModel(){
	var self = this;
	
	self.token = "";
	
	//props
	self.photosets = ko.observableArray([]);
	self.photos = ko.observableArray([]);
	
	
	//methods
	self.getPhotosets = function(){
		$.getJSON( API_URL, {
			method: GET_PHOTOSET_LIST,
			api_key: API_KEY,
			user_id: USER_ID,	
			format: FORMAT_JSON,
			nojsoncallback: 1
		}).success(function(data) {
			var photosets = data.photosets.photoset;
			self.photosets(photosets);
		});
	};
	
	self.getPhotosByPhotoset = function(photoset){
		$.getJSON(API_URL,{
				method: GET_PHOTOSET_PHOTOS,
				api_key: API_KEY,
				photoset_id: photoset.id,
				format: FORMAT_JSON,
				nojsoncallback: 1	
		}).success(function(data){
			var photoset = data.photoset;
			var photos = photoset.photo;
			
			var mappedPhotos = photos.map(function(photo){return new Photo(photo,photoset.id)});
			self.photos(mappedPhotos);
		});
	};
	
	self.viewImage = function(){
		$(".fancybox").fancybox({
			openEffect	: 'elastic'
		});
	};	
	
	self.deletePhoto = function(photo){
			//AUTHENTIFICATION 	
			if (self.token != "")
			{
				var doDelete = confirm("Are you sure, you'd like to delete this file");
				if(doDelete){
					deleteWithToken(self, photo.id, photo.photosetId);
				};
			}
			else
			{	
				alert("You need to authenticate first");
				authenticate(self);
			};
	};
	
	self.edit = function(photo){
		//AUTHENTIFICATION 	
		if (self.token != "")
		{		
			$('#edit').lightbox_me({
				centered: true, 
				onLoad: function() { 
					$("#btnEdit").click(function(){
						var title = $("#edit_title").val();
						setMeta(self,photo.id, photo.photosetId, title);
					});
				}
			});
		}
		else
		{	
			alert("You need to authenticate first");		
			authenticate(self);
		};
	};
};