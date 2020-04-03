import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom';
import logo from './logo.svg';
import './App.css';

import { Button } from 'react-bootstrap';

function App() {
  return (
    <div className="App" >
      <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
        <a className="navbar-brand" href="#">RAFAEL MAIA</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarCollapse">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Link</a>
            </li>
            <li className="nav-item">
              <a className="nav-link disabled" href="#">Disabled</a>
            </li>
          </ul>
          <form className="form-inline mt-2 mt-md-0">
            <input className="form-control mr-sm-2" type="text" placeholder="Search" aria-label="Search"></input>
            <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
          </form>
        </div>
      </nav>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Router>
          <div>
            <nav>
              <ul>
                <li><Link to="/">
                  <Button variant="primary">Home</Button>
                </Link>

                </li>
                <li>
                  <Link to="/works">Works</Link>
                </li>
                <li>
                  <Link to="/about">Bio</Link>
                </li>
              </ul>
            </nav>

            {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
            <Switch>
              <Route path="/about">
                <About />
              </Route>
              <Route path="/works">
                <Works />
              </Route>
              <Route path="/">
                <Home />
              </Route>
            </Switch>
          </div>
        </Router>
      </header>
    </div>
  );
}

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      events: [],
      selectedIndex: 0,
      cellCount: 6
    };
  }

  timer() {
    this.setState({ selectedIndex: this.state.selectedIndex + 1 });
  }

  previousEvent() {
    this.setState({
      selectedIndex: this.state.selectedIndex - 1
    });
    console.log(this.state)
  }
  nextEvent() {
    this.setState({
      selectedIndex: this.state.selectedIndex + 1
    });
  }


  componentDidMount() {
    var intervalId = setInterval(() => this.timer(), 3000);
    // store intervalId in the state so it can be accessed later:
    this.setState({ intervalId: intervalId });

    fetch('https://rafaelmaia.000webhostapp.com/wp-json/wp/v2/events', /*{
      method: 'GET',
      mode: 'no-cors',
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'cookie': '__test=48031c46594cb39af38e8220a84d54de'
      }
    }*/)
      .then(res => res.json())
      .then(
        (events) => {
          console.log(events)
          let eventsTmp = events
          if (events.length > 0) {
            while (events.length % this.state.cellCount !== 0) {
              events = events.concat(eventsTmp)
              console.log(events)
            }
          }

          this.setState({
            isLoaded: true,
            events: events
          });
        },
        (error) => {
          console.log(error)
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }


  render() {
    const { error, isLoaded, events, selectedIndex, cellCount } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <div>
          <h2>Events</h2>
          <div className="scene">
            <div className="carousel" style={{ transform: 'translateZ(-120px) rotateX(' + (selectedIndex / cellCount) * -360 + 'deg)' }}>
              {events.map((value, index) => {
                let rotateX = index * (360 / cellCount)
                let position = selectedIndex
                if (selectedIndex < 0) {
                  position = 18 + selectedIndex % events.length
                }
                let distanceFromSelected = Math.abs(Math.abs(index - ((position + (events.length / 2)) % events.length)) - events.length / 2)
                return <div className="carousel__cell" style={{ transform: 'rotateX(' + rotateX + 'deg) translateZ(120px)', opacity: 100 - 100 * distanceFromSelected / (cellCount / 2) + '%' }}>
                  {value.title.rendered}<br />
                  {value.acf.local} - {value.acf.date}
                </div>
              })}
            </div>
          </div>
          <p style={{ textAlign: "center" }}>
            <button className="previous-button" onClick={() => this.previousEvent()}>Previous</button>
            <button className="next-button" onClick={() => this.nextEvent()}>Next</button>
          </p>
        </div >
      );
    }
  }
}

function About() {
  return <h2>About</h2>;
}

class Works extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      projects: []
    };
  }

  componentDidMount() {

    fetch('https://rafaelmaia.000webhostapp.com/wp-json/wp/v2/projects')
      .then(res => res.json())
      .then(
        (projects) => {
          console.log(projects)
          this.setState({
            isLoaded: true,
            events: projects
          });
        },
        (error) => {
          console.log(error)
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  render() {
    const { error, isLoaded, projects } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <div>
          <h2>Works</h2>
          <ul>
            {projects.map((value, index) => {
              return <li>{value.title.rendered}</li>
            })}
          </ul>
        </div>
      );
    }
  }
}

export default App;
