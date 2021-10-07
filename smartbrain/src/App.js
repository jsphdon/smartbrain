import React, {Component} from 'react';
import Clarifai from 'clarifai';
import Particles from 'react-particles-js';
import Signin from './components/signin/Signin';
import Register from './components/register/Register';
import Navigation from './components/navigation/Navigation';
import Logo from './components/logo/Logo';
import Rank from './components/rank/Rank';
import ImageLinkForm from './components/imageLinkForm/ImageLinkForm';
import FaceRecognition from './components/faceRecognition/FaceRecognition';
import './App.css';

const app = new Clarifai.App({
  apiKey:'cf714d208e3b4ff388a8df77a1b60d55'
});

const particlesOptions ={
  particles: {
    number:{
      value: 100,
      density: {
        enabled: true,
        value_area: 1000,
      }
    }
  }
}

class App extends Component {

  constructor(){
    super();
    this.state ={
      input: '',
      imageUrl:'',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user:{
        id: '', 
        name: '', 
        email: '', 
        password: '', 
        entries: 0, 
        joined: ''
      }
    }
  }

  //! communicate with the backend server
  // componentDidMount(){
  //   fetch('http://localhost:3000/')
  //   .then(response => response.json())
  //   .then(console.log);
  // }

  loadUser=(user)=>{
    this.setState({user:{
        id: user.id, 
        name: user.name, 
        email: user.email, 
        password: user.password, 
        entries: user.entries, 
        joined: user.joined
    }})
  }

  //calculate the face location
  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }


  // display the face box
  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  // get the value inputted
  onInputChange = (event) =>{
    this.setState({input: event.target.value});
  }

  // button click
  onSubmit = () =>{
    this.setState({imageUrl:this.state.input});

    //Clarifai API
    app.models.predict(Clarifai.FACE_DETECT_MODEL,this.state.input)
    .then(response =>
      {if(response)
        {
          fetch('http://localhost:3000/image', 
          {method: 'PUT',
          headers: { 'Content-Type': 'application/json'},
          body: JSON.stringify({ 
            id: this.state.user.id,  
          })
          })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, {entries: count}))
          })
        }this.displayFaceBox(this.calculateFaceLocation(response))
      }
       )
    .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if(route === 'signout'){
      this.setState({isSignedIn: false});
    }else if(route === 'home'){
      this.setState({isSignedIn: true});
    }
    this.setState({route: route});
  }

  render() {
    return (
        <div className="App">
          <Particles className="particles"
                params={particlesOptions} />
          
          <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange}/>
          { this.state.route === 'home' 
          ? <div>
          
            <Logo />

            <Rank name={this.state.user.name} entries={this.state.user.entries}/>
            
            <ImageLinkForm onInputChange={this.onInputChange} onSubmit={this.onSubmit}/>
            
            <FaceRecognition imageUrl={this.state.imageUrl} box={this.state.box}/>

            </div>

          : (
              this.state.route === 'signin' 
              ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
              : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            )
          
          }
        </div>
      );
  }
  
}

export default App;
