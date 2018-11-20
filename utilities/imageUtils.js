const imageUtils = (()=>{
	//cloudinary setup
	var cloudinary = require('cloudinary'),
		multer 	   = require('multer'),
		storage    = multer.diskStorage({
	  filename: function(req, file, callback) {
	    callback(null, Date.now() + file.originalname);
	  }
	});
	let imageFilter = function (req, file, cb) {
	    // accept image files only
	    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
	        return cb(new Error('Only image files are allowed!'), false);
	    }
	    cb(null, true);
	};
	var upload = multer({ storage: storage, fileFilter: imageFilter})

	cloudinary.config({ 
	  cloud_name: 'madmap', 
	  api_key: "878488145471865", 
	  api_secret: "6rjAFhuPOISffrw5BNCJUxr6Zug"
	});

	const uploadImage = (file,callback)=>{
		let defaultImage = "http://college.koreadaily.com/wp-content/uploads/2018/03/BascHill_autumn16_5788-1600x500.jpg"
		if(file){
			cloudinary.uploader.upload(file.path, function(result) {
	        // add cloudinary url for the image to the object under image property
	        callback(result.secure_url)
	    	})
		}else{
			callback(defaultImage)
    	}
	}
//image and avatar
	const uploadByType = (type) => {
		return upload.single(type)
	}

	return{uploadImage,uploadByType}
})()

module.exports = imageUtils