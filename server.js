require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose')
const CurrentStudent = require('./models/currentStudent');
const User = require('./models/userModel');
const path = require('path');
const app = express()
const PORT = process.env.PORT || 3000
const bcrypt = require('bcrypt')
const saltRounds = 10
const axios = require('axios')
const cors = require('cors');
const cookieParser = require('cookie-parser'); 


// app.use(cors());

const allowedOrigins = ['http://localhost:3000','https://lifemeuplatest-4fd195746a8a.herokuapp.com/'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
}));
app.use(cookieParser()); 

app.use(express.json())


app.use(express.static(path.join(__dirname, '/')));
app.use((req,res,next) =>{  
    next()
})

// Set MIME type for CSS files
app.use((req, res, next) => {
    if (req.url.endsWith('.css')) {
      res.type('text/css');
    }
    next();
  });



app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');


/*

----------------------USERS API'S BELOW--------------------------------------------------------------------------------------
*/
//Getting the login page
app.get('/', (req,res) =>{
  res.render('index', {title: "Log in"})
})


//GET all Users
app.get('/api/users', async (req, res) => {
  try {
      const users = await User.find({}).sort({ firstName: 1 });
      res.status(200).json(users);
  } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});



app.get('/search/:id', async (req, res) => {
  try {
      const userSearch = req.query.search;
      const loggedInUser = req.params.id;
      console.log("user search:", userSearch);

      // Define a condition based on whether the search is empty or null
      const condition = userSearch ? { userName: { $regex: new RegExp('^' + userSearch, 'i') } } : { _id: { $ne: loggedInUser } };

      const users = await User.find(condition).sort({ userName: 1 });
      console.log("Users are", users);

      res.render('userSearch', { users, searchTerm: userSearch, title: "Search" });
  } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});



//GET a single user by their id
app.get('/api/users/:id', async(req,res) =>{
  const {id} = req.params

  if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(404).json({error: 'No such User'})
  }


  const user = await User.findById(id)

  if(!user){
      return res.status(404).json({error: 'No such User'})
  }
  res.status(200).json(user)
})


//GET single user by the username

app.get('/api/user/:username', async (req,res) =>{
  const username = req.params.username;

  try {
      const users = await User.findOne({ userName: username });

      if (!users) {
          return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json(users);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
})

//GET antoher user for the profile page
app.get('/profile/:id', async (req, res) => {
  try {
      console.log("Starting Other User's Profile API");
      const id = req.params.id
      const user = await User.findById(id).populate({
          path: 'followers',
          select: '_id userName firstName lastName'
      });
      console.log("User is  ", user);
      const followers = user.followers.map(follower => ({
          _id: follower._id,
          userName: follower.userName,
          firstName: follower.firstName,
          lastName: follower.lastName
    }));
      res.render('profile', {user, followers,title:user.userName});

      
  } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal Server Error");
  }
});

// GET currently logged in user's profile
app.get('/myProfile/:id', async (req, res) => {
  try {
      console.log("Starting My Profile API");
      const id = req.params.id;
      const user = await User.findById(id).populate({
          path: 'followers',
          select: '_id userName firstName lastName profileImage', // Specify the fields you want
        });

    

      if (!user) {
          // Handle the case where the user is not found
          console.log("User not found");
          return res.status(404).send("User not found");
      }

      console.log("User is  ", user);

  
      
      const followers = user.followers.map(follower => ({
          _id: follower._id,
          userName: follower.userName,
          firstName: follower.firstName,
          lastName: follower.lastName,
          profileImage: follower.profileImage
      }));
      console.log("Followers are", followers)
      res.render('myProfile', { user, followers, title: user.userName });

  } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal Server Error");
  }
});

app.get('/editProfile/:id', async (req,res)=>{
  try {
      const id = req.params.id;

      const user = await User.findById(id);
      
      if(!user){
          return res.status(404).send("User not found")
      }
      res.render('editProfile', {user, title:"Edit Profile"})
  } catch (error) {
      
  }
})

//POST a new user
app.post('/api/users/create', async (req, res) => {
  try {
    const { firstName, lastName, userName, password, email, zNumber, profileImage, followers, personalProfile, gymProfile } = req.body;

    // Check if both email and zNumber are associated with a current student
    const isCurrentStudent = await CurrentStudent.findOne({ email, zNumber });

    if (!isCurrentStudent || !isCurrentStudent.email || !isCurrentStudent.zNumber) {
      return res.status(400).json({ error: 'User is not a current student' });
    }

    // Continue with user creation
    const hash = await bcrypt.hash(password, saltRounds);

    const existingUser = await User.findOne({ email, zNumber });

    if (existingUser) {
      return res.status(400).json({ error: 'User with this email and zNumber already exists' });
    }

    const user = await User.create({
      firstName,
      lastName,
      userName,
      password: hash,
      email,
      zNumber,
      profileImage: profileImage || null,
      followers: followers || [],
      personalProfile: personalProfile || null,
      gymProfile: gymProfile || null,
    });

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


//Login a user    
app.post('/api/users/login', async (req, res) => {
  try {
      const { email, password } = req.body;

      // Find a user with the provided email
      const user = await User.findOne({ email });


      if (!user) {
          return res.status(404).json({ error: 'No such user' });
      }


      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
          return res.status(401).json({ error: 'Incorrect password' });
      }
      return res.status(200).json({ id: user._id, username: user.userName});
      
  } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server error' });
  }
});



//DELETE a single user
app.delete('/api/users/delete/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

     await User.updateMany({},
      { $pull: { followers: user._id } }, { "multi": true }
      )

    // Remove the user using findOneAndDelete
    await User.findOneAndDelete({ _id: userId });

    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.patch('/api/users/addFollower/:id', async (req, res) => {
  try{
     
      const userId = req.params.id;
      const followerID = req.body.followerID; // Assuming you send the follower's ID in the request body
      console.log(req.body)
      // Check if both users exist
      const [user, follower] = await Promise.all([
        User.findById(userId),
        User.findById(followerID),
      ]);
  
      if (!user || !follower) {
        return res.status(404).json({ error: 'User(s) not found' });
      }
  
      // Check if the follower is not already in the followers array
      if (!user.followers.includes(followerID)) {
        // Add the follower to the user's followers array
        user.followers.push(followerID);
        await user.save();
  
        return res.status(200).json({ message: 'Follower added successfully' });
      } else {
        return res.status(400).json({ message: 'User is already a follower' });
      }
  } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
});



app.patch('/api/users/removeFollower/:id', async (req, res) => {
  const id  = req.params.id;
  const followerIDToRemove = req.body.followerID; // Assuming your request body has a "followerID" field

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the followerIDToRemove exists in the user's followers array
    const indexOfFollower = user.followers.indexOf(followerIDToRemove);

    if (indexOfFollower === -1) {
      return res.status(404).json({ error: 'Follower not found in the user\'s followers list' });
    }

    // Remove the followerIDToRemove from the user's followers array
    user.followers.splice(indexOfFollower, 1);
    await user.save();

    return res.status(200).json({ success: true, message: 'Follower removed successfully' });
  } catch (error) {
    console.error('Error removing follower:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }

});

// Endpoint to remove all followers from a user by ID
app.delete('/api/users/removeAllFollowers/:id', async (req, res) => {
  const userId = req.params.id;

  try {
      // Find the user by ID
      const user = await User.findById(userId);

      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      // Remove all followers
      user.followers = [];
      
      // Save the updated user
      await user.save();

      return res.status(200).json({ success: true, message: 'All followers removed successfully' });
  } catch (error) {
      console.error('Error removing followers:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
  }
});

//UPDATE a single user
app.patch('/api/users/update/:id', async(req, res) => {
  try {
      const id = req.params.id;
      const user = await User.findById(id);

      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      // Update user's profile based on the request body
      user.personalProfile = req.body.personalProfile || user.personalProfile;
      user.userName = req.body.userName || user.userName;
      user.gymProfile = req.body.gymProfile || user.gymProfile;
      user.password = req.body.password || user.password;

      // Check if the request body contains a profileImage field
      if (req.body.profileImage) {
          user.profileImage = req.body.profileImage;
      }

      // Save the updated user
      await user.save();

      return res.status(200).json(user);

  } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/api/users/getFollowers/:id', async (req,res)=>{
  const id = req.params.id
  try {
      const user = await User.findById(id).populate({
          path: 'followers',
          select: '_id userName firstName lastName'
        });
      

      if(!user){
          return res.status(404).json("User not Found!")
      }

      return res.status(200).json(user.followers)
  } catch (error) {
      return res.status(500).json(error)
  }
})
/*

----------------------WEATHER API BELOW-------------------------------------------------------------------------------------------
*/

app.get('/weather', async (req,res) =>{
const apiKey = process.env.WEATHER_KEY
const location = 'Boca Raton'
const measurement = 'metric'
try {
  const weather = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=${measurement}&appid=${apiKey}`
  );

  const json = weather.data;

  if (json.cod === '404') {
    return res.status(404).json({ message: 'Not Found' });
  }

  return res.status(200).json(json)

} catch (err){
  return res.status(404).json({error: err.message})
}
})

// connect to database
mongoose.connect(process.env.MONGO_URI)
  .then(() =>{
    app.listen(process.env.PORT || 3000, function(){
      console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
    })
  })
  .catch((error) =>{
    console.error("Database connection error:", error);
  })