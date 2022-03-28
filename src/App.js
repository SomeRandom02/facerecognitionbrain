import './App.css';
import Navigation from './Components/Navigation/Navigation.js'
import FaceRecognition from './Components/FaceRecognition/FaceRecognition.js'
import Logo from './Components/Logo/Logo.js'
import React, {Component} from 'react';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm.js'
import Rank from './Components/Rank/Rank.js'
import Particless from './Components/Particless/Particless.js'
import SignIn from './Components/SignIn/SignIn.js'
import Register from './Components/Register/Register.js'

class App extends Component {
  constructor() {
    super();
    this.state = {
      input:'',
      imageUrl: '',
      box:{},
      route: 'SignIn',
      isSignedIn: false
    }
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = JSON.parse(data, null, 2).outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("inputimage");
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height,
    };
  };

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({ box: box });
  };

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  onButtonSubmit = () => {
    this.setState({imageUrl: this.input})
    const raw = JSON.stringify({
      "user_app_id": {
        "user_id": "somerandom",
        "app_id": "6c7c3a4c81fc4af5ad639a8fa04754db"
      },
      "inputs": [
        {
          "data": {
            "image": {
              "url": this.state.input
            }
          }
        }
      ]
    });
    
    const requestOptions = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Key f682b1eca26145fe98484be1bc0fa948'
      },
      body: raw
    };
    
    // NOTE: MODEL_VERSION_ID is optional, you can also call prediction with the MODEL_ID only
    // https://api.clarifai.com/v2/models/{YOUR_MODEL_ID}/outputs
    // this will default to the latest version_id
    
    fetch("https://api.clarifai.com/v2/models/face-detection/outputs", requestOptions)
      .then((response) => response.text())
      .then((result) => this.displayFaceBox(this.calculateFaceLocation(result)))
      .catch(error => console.log('error', error));
 
  }

  onRouteChange = (route) => {
    if (route === 'SignIn') {
      this.setState({isSignedIn: false})
    } else if (route === 'Home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  render() {
    const { isSignedIn, route, box, input } = this.state;
    return (
      <div className='App'>
          <Particless className='particles'/>
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        { route === 'Home' 
          ? <div>
              <Logo />
              <Rank />
              <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
              <FaceRecognition box={box} imageUrl={input} /> 
          </div>
          : (
            route === 'SignIn'
            ? <SignIn onRouteChange={this.onRouteChange} />
            : <Register onRouteChange={this.onRouteChange} />
          )

          
           

          
        }
      </div>
    );
  }
}

export default App;
