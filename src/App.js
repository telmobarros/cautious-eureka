import React from 'react';
import {
  Switch,
  Route,
  Link,
  useLocation
} from 'react-router-dom';
import logo from './logo.svg';
import './App.css';

import { IoIosSend } from 'react-icons/io';

import { Container, Row, Button, Col, Form } from 'react-bootstrap';

function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav className="navbar navbar-expand fixed-top py-3">
      <div className="collapse navbar-collapse w-100">
        <ul className="navbar-nav mr-auto">
          {pathname !== '/' && pathname !== '/works' &&
            <li className="nav-item">
              <Link to="/works" className="nav-link">Works</Link>
            </li>
          }
          {pathname !== '/' && pathname !== '/bio' && pathname === '/works' &&
            <li className="nav-item">
              <Link to="/bio" className="nav-link">Bio</Link>
            </li>
          }
        </ul>
      </div>
      <div className="mx-auto">
        <Link to="/" className="navbar-brand mx-auto d-none d-lg-inline-block">NEURA of the NORTH</Link>
        <Link to="/" className="navbar-brand mx-auto d-lg-none d-inline-block">
          <img src={logo} alt="logo" />
        </Link>
      </div>
      <div className="navbar-collapse collapse w-100">
        <ul className="navbar-nav ml-auto">
          {pathname !== '/' && pathname !== '/bio' && pathname === '/contact' &&
            <li className="nav-item">
              <Link to="/bio" className="nav-link">Bio</Link>
            </li>
          }
          {pathname !== '/' && pathname !== '/contact' &&
            <li className="nav-item">
              <Link to="/contact" className="nav-link">Contact</Link>
            </li>
          }
        </ul>
      </div>
    </nav>
  );
}

function App() {
  return (
    <div className="App" >
      <Navbar />
      <Switch>
        <Route path="/works">
          <Works />
        </Route>
        <Route path="/bio">
          <Bio />
        </Route>
        <Route path="/contact">
          <Contact />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
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

    fetch('https://neuranorth.000webhostapp.com/wp-json/wp/v2/events', /*{
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
        <section>
          {/*<h2>Events</h2>
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
          </p>*/}
          <div>
            <Link to="/works">Works</Link>
            <Link to="/bio">Bio</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <footer className="social-container">
            <div className="mx-auto">
              <a href="https://www.facebook.com/profile.php?id=100000174129300" target="_blank" ><span>FACEBOOK</span></a>
              <span className="slash"> / </span>
              <a href="https://www.instagram.com/neuraofthenorth/" target="_blank"><span>INSTAGRAM</span></a>
              <span className="slash"> / </span>
              <a href="https://www.youtube.com/user/rafael87909" target="_blank"><span>YOUTUBE</span></a>
            </div>
          </footer>
        </section >
      );
    }
  }
}

function Bio() {
  return <h2>Bio</h2>;
}

class Contact extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      name: '',
      email: '',
      subject: '',
      message: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(event) {
    let formData = new FormData();

    formData.append('your-name', this.state.name);
    formData.append('your-email', this.state.email);
    formData.append('your-subject', this.state.subject);
    formData.append('your-message', this.state.message);

    fetch('https://neuranorth.000webhostapp.com/wp-json/contact-form-7/v1/contact-forms/43/feedback', {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(
        (res) => {
          console.log('ok')
          console.log(res.status)
          if (res.status === 'validation_failed') {
            this.setState({ error: res })
            console.log(this.state)
          }
          console.log(res)
        },
        (error) => {
          console.log('erro')
          console.log(error)
        }
      )
    for (var value of formData.values()) {
      console.log(value);
    }
    event.preventDefault();
  }

  render() {
    const { error, name, email, subject, message } = this.state;
    return (
      <section>
        <Container fluid>
          <Row>
            <Col xs="12" sm="10" md="8" lg="4" className="mx-auto">
              <p className="font-weight-bolder mb-0">MAIL ME</p>
              <a className="nostyle" href={'mailto:rafamaianet@hotmail.com?subject=' + subject + '&body=' + message}>rafamaianet@hotmail.com</a>
              <p className="my-4">- or -</p>
              <p className="font-weight-bolder mb-0">FILL THE FORM BELOW</p>
              {error &&
                <p className="small text-danger error-message">{error.message}</p>
              }
              <Form className="contact-form" onSubmit={this.handleSubmit}>
                <Form.Group>
                  <Form.Control type="text" placeholder="Name" name="name" value={name} onChange={this.handleChange} />
                </Form.Group>
                <Form.Group>
                  <Form.Control type="email" placeholder="name@example.com" name="email" value={email} onChange={this.handleChange} />
                </Form.Group>
                <Form.Group>
                  <Form.Control type="text" placeholder="Subject" name="subject" value={subject} onChange={this.handleChange} />
                </Form.Group>
                <Form.Group>
                  <Form.Control as="textarea" rows="5" placeholder="Tell me more..." name="message" value={message} onChange={this.handleChange} />
                </Form.Group>
                <Button variant="dark" type="submit">SEND <IoIosSend /></Button>
              </Form>
            </Col>
          </Row>
        </Container>
      </section >
    );
  }

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

    fetch('https://neuranorth.000webhostapp.com/wp-json/wp/v2/projects')
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
        <section>
          <h2>Works</h2>
          <ul>
            {projects.map((value, index) => {
              return <li>{value.title.rendered}</li>
            })}
          </ul>
        </section>
      );
    }
  }
}

export default App;
