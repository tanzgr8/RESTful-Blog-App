var express= require("express"),
	methodOverride =require("method-override"),
 app = express(),
	bodyparser = require("body-parser"),
	expressSanitizer=require("express-sanitizer"),
mongoose=require("mongoose");

mongoose.connect("mongodb://localhost:27017/Blog", { useNewUrlParser: true });
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride('_method'));
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
	body: String,
    created:  {type: Date, default: Date.now}
});

var Blog = mongoose.model("blog", blogSchema);
// blog.create({
// 	title:"BLOG 1",
// 	image: "https://i1.trekearth.com/photos/118704/img_3338.jpg",
// 	body:"CLICKED BY ME"	
// });
app.get("/",function(req,res){
	res.redirect("/blogs");
});
app.get("/blogs",function(req,res){
	Blog.find({},function(err,blogs){
		if(err){
			console.log(err);
		}else{
			res.render("index",{blogs:blogs});
		}
	});
});
app.get("/blogs/new",function(req,res){
	res.render("new");
});
app.post("/blogs",function(req,res){
	req.body.blog.body = req.sanitize(req.body.blog.body );
	Blog.create(req.body.blog,function(err,newBlog){
		if(err){
			res.render("new");
		}else{
			res.redirect("/blogs");
		}
	})
});
app.get("/blogs/:id",function(req,res){
		Blog.findById(req.params.id,function(err,foundblog){
			if(err){
				res.redirect("/blogs");
			}else{
				res.render("show",{blog:foundblog});			}
		});
});
app.get("/blogs/:id/edit",function(req,res){
	Blog.findById(req.params.id,function(err,foundblog){
		if(err){
			res.redirect("/blogs");
		}else{
			res.render("edit",{blog:foundblog});
		}
	});
});
app.put("/blogs/:id",function(req,res){
		req.body.blog.body = req.sanitize(req.body.blog.body );
	 Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, blog){
       if(err){
           console.log(err);
       } else {
         var showUrl = "/blogs/" + blog._id;
         res.redirect(showUrl);
       }
   });
});
app.delete("/blogs/:id",function(req,res){
	Blog.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs");
		}
	});
});

app.listen(process.env.port || 3000 , process.env.IP,function(){
console.log("Server running");	
});