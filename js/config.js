//constants
var API_KEY = "21aa3fc8dec27c7e63d5e76b455f28d8";
var SECRET = "70dafbf6f735d5dc";
var USER_NAME = "andreyprotas";
var USER_ID = "115719100@N03";
var FORMAT_JSON = "json";
var PERMS = "delete";
var IMAGE_URL_TEMPLATE = "https://farm{farmId}.staticflickr.com/{serverId}/{id}_{secret}.jpg";

var API_URL = "https://api.flickr.com/services/rest/";

//methods
var GET_PHOTOSET_PHOTOS = "flickr.photosets.getPhotos";
var GET_PHOTOSET_LIST = "flickr.photosets.getList";
var REMOVE_PHOTO_FROM_PHOTOSET = "flickr.photosets.removePhoto";
var GET_FROB = "flickr.auth.getFrob";
var GET_TOKEN = "flickr.auth.getToken"
var SET_PHOTO_META = "flickr.photos.setMeta";

