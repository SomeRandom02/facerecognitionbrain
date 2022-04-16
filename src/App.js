import './App.css';
import Navigation from './Components/Navigation/Navigation.js'
import FaceRecognition from './Components/FaceRecognition/FaceRecognition.js'
// import Logo from './Components/Logo/Logo.js'
import React, {Component} from 'react';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm.js'
import Rank from './Components/Rank/Rank.js'
import Particless from './Components/Particless/Particless.js'
import SignIn from './Components/SignIn/SignIn.js'
import Register from './Components/Register/Register.js'

const initialState = {
  input:'',
  imageUrl: '',
  box:{},
  route: 'SignIn',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entires: 0,
    joined: ''
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entires: data.entires,
      joined: data.joined
    }})
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
    this.setState({imageUrl: this.state.input});
      fetch('https://tranquil-peak-69950.herokuapp.com/imageurl', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          input: this.state.input
        })
      })
      .then(response => response.json())
      .then(response => {
        if (response) {
          fetch('https://tranquil-peak-69950.herokuapp.com/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entires: count}))
            })
          })
            .catch(console.log)
        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if (route === 'SignIn') {
      this.setState(initialState)
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
              {/* <Logo /> */}
              <Rank name={this.state.user.name} entires={this.state.user.entires}/>
              <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
              <FaceRecognition box={box} imageUrl={input} /> 
          </div>
          : (
            route === 'SignIn'
            ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
            : <Register loadUser ={this.loadUser} onRouteChange={this.onRouteChange} />
          )

          
           

          
        }
      </div>
    );
  }
}

export default App;
