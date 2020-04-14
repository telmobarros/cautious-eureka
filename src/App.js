import React from 'react';
import {
  Switch,
  Route,
  Link,
  useLocation,
  withRouter
} from 'react-router-dom';
import { TransitionGroup, CSSTransition } from "react-transition-group";
import logo from './logo.svg';
import './App.css';

import { IoIosSend } from 'react-icons/io';

import { Container, Row, Button, Col, Form } from 'react-bootstrap';
import * as THREE from "three";

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

const AnimatedSwitch = withRouter(({ location }) => (
  <TransitionGroup>
    <CSSTransition key={location.key} classNames="fade" timeout={1000}>
      <Switch location={location}>
        <Route path="/works/:slug" component={Work} />
        <Route path="/works" component={Works} />
        <Route path="/bio" component={Bio} />
        <Route path="/contact" component={Contact} />
        <Route path="/" component={Home} />
      </Switch>
    </CSSTransition>
  </TransitionGroup>
));

function App({ location }) {
  return (
    <div className="App" >
      <Navbar />
      <AnimatedSwitch />
    </div>
  );
}

class ThreeD extends React.Component {
  /*componentDidMount() {
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    // document.body.appendChild( renderer.domElement );
    // use ref as a mount point of the Three.js scene instead of the document.body
    this.mount.appendChild( renderer.domElement );
    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    var cube = new THREE.Mesh( geometry, material );
    scene.add( cube );
    camera.position.z = 5;
    var animate = function () {
      requestAnimationFrame( animate );
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render( scene, camera );
    };
    animate();
  }
  render() {
    return (
      <div ref={ref => (this.mount = ref)} />
    )
  }*/
  constructor(props) {
    super(props);
    this.state = {
      mouseX: 0,
      mouseY: 0,
      SEPARATION: 200,
      AMOUNTX: 10,
      AMOUNTY: 10
    };
    if (window.innerWidth > window.innerHeight) {
      this.state.windowHalfX = window.innerWidth / 2
      this.state.windowHalfY = window.innerHeight / 2
      this.state.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000)
      this.state.scene = new THREE.Scene()
      this.state.renderer = new THREE.WebGLRenderer({ alpha: true })
    } else {

    }

    // This binding is necessary to make `this` work in the callback
    this.animate = this.animate.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.render3d = this.render3d.bind(this);
  }

  componentDidMount() {
    if (this.state.renderer) {
      this.state.renderer.setSize(window.innerWidth, window.innerHeight - 10);
      // document.body.appendChild( renderer.domElement );
      // use ref as a mount point of the Three.js scene instead of the document.body
      this.mount.appendChild(this.state.renderer.domElement);

      this.state.camera.position.z = 1000


      // particles
      var PI2 = Math.PI * 2;
      var material = new THREE.SpriteMaterial({
        color: 0xffffff,
        program: function (context) {
          context.beginPath();
          context.arc(0, 0, 0.5, 0, PI2, true);
          context.fill();
        }
      });

      var geometry = new THREE.Geometry();

      for (var i = 0; i < 100; i++) {
        var particle;
        particle = new THREE.Sprite(material);
        particle.position.x = Math.random() * 2 - 1;
        particle.position.y = Math.random() * 2 - 1;
        particle.position.z = Math.random() * 2 - 1;
        particle.position.normalize();
        particle.position.multiplyScalar(Math.random() * 10 + 450);
        particle.scale.x = particle.scale.y = 10;
        this.state.scene.add(particle);
        geometry.vertices.push(particle.position);
      }

      // lines
      var line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.5 }));
      this.state.scene.add(line);

      // end init();

      this.animate();
    }
  }

  animate() {
    requestAnimationFrame(this.animate);
    this.render3d();
  }

  render3d() {
    this.state.camera.position.set(
      this.state.camera.position.x + (this.state.mouseX - this.state.camera.position.x) * .05,
      this.state.camera.position.y + (- this.state.mouseY + 200 - this.state.camera.position.y) * .05,
      this.state.camera.position.z)
    this.state.camera.lookAt(this.state.scene.position);

    this.state.renderer.render(this.state.scene, this.state.camera);
  }

  onMouseMove(event) {
    console.log(event)
    this.setState({
      mouseX: event.clientX - this.state.windowHalfX,
      mouseY: event.clientY - this.state.windowHalfY
    })
  }

  onTouchStart(event) {
    if (event.touches.length > 1) {

      /*event.preventDefault();*/
      this.setState({
        mouseX: event.touches[0].pageX - this.state.windowHalfX,
        mouseY: event.touches[0].pageY - this.state.windowHalfY
      })

    }
  }

  onTouchMove(event) {
    if (event.touches.length === 1) {

      /*event.preventDefault();*/
      this.setState({
        mouseX: event.touches[0].pageX - this.state.windowHalfX,
        mouseY: event.touches[0].pageY - this.state.windowHalfY
      })

    }
  }

  render() {
    return (
      <div ref={ref => (this.mount = ref)}
        onMouseMove={this.onMouseMove}
        onTouchStart={this.onTouchStart}
        onTouchMove={this.onTouchMove} />
    )
  }
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

    fetch('https://neuranorth.000webhostapp.com/wp-json/wp/v2/events')
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
    /*if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {*/
    return (
      <section>
        {window.innerWidth > 576 && <ThreeD />}
        <Container fluid className="position-absolute">
          <Row>
            <Col xs={{ span: 12, order: 3 }} md={{ span: 3, order: 1 }} className="events-container">
              <div className="scene">
                <div className="led-container">
                  <div className="led mid"></div>
                </div>
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
              {/*<p style={{ textAlign: "center" }}>
                <button className="previous-button" onClick={() => this.previousEvent()}>Previous</button>
                <button className="next-button" onClick={() => this.nextEvent()}>Next</button>
                </p>*/}
            </Col>
            <Col xs={{ span: 12, order: 1 }} md={{ span: 6, order: 2 }} className></Col>
            <Col xs={{ span: 12, order: 2 }} md={{ span: 3, order: 3 }}>

              {/*<div className="led-container">
                <div className="led mid"></div>
                <div className="text">Works</div>
    </div>*/}
              <Row className="menu-container">
                <Col xs={12} md={10} className="my-3">
                  <li>
                    <Link to="/works" className="anchor-menu p-3">WORKS</Link>
                  </li>
                </Col>
                <Col xs={12} md={10} className="my-3">
                  <li>
                    <Link to="/bio" className="anchor-menu py-3">BIO</Link>
                  </li>
                </Col>
                <Col xs={12} md={10} className="my-3">
                  <li>
                    <Link to="/contact" className="anchor-menu py-3">CONTACT</Link>
                  </li>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
        <footer className="social-container">
          <div class="mx-auto">
            <button className="btn btn-sm btn-dark px-4 py-0">Check my stories</button>
          </div>
          <div className="mx-auto">
            <a href="https://www.facebook.com/profile.php?id=100000174129300" target="_blank" >FACEBOOK</a>
            <span className="slash"> / </span>
            <a href="https://www.instagram.com/neuraofthenorth/" target="_blank">INSTAGRAM</a>
            <span className="slash"> / </span>
            <a href="https://www.youtube.com/user/rafael87909" target="_blank">YOUTUBE</a>
          </div>
        </footer>
      </section >
    );
    /*}*/
  }
}


class Bio extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      delta: 0,
      touchStart: 0,
      page: 0,
      changeDelta: 0
    }

    this.onWheel = this.onWheel.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
  }

  onWheel(event) {
    console.log(event)
    this.setState({
      delta: this.state.delta + event.deltaY
    })

    if ((this.state.page > 0 && this.state.delta - this.state.changeDelta < 0) || (this.state.page < 3 && this.state.delta - this.state.changeDelta > 0)) {
      if (this.state.delta - this.state.changeDelta >= 300) {
        this.setState({
          page: this.state.page + 1,
          changeDelta: this.state.delta
        })
      } else if (this.state.delta - this.state.changeDelta <= -300) {
        this.setState({
          page: this.state.page - 1,
          changeDelta: this.state.delta
        })
      }
    } else {
      this.setState({
        changeDelta: this.state.delta
      })
    }
  }

  onTouchMove(event) {
    console.log(event.touches[0].clientY - this.state.touchStart)
    this.setState({
      delta: (this.state.delta + (this.state.touchStart - event.touches[0].clientY) / 10)
    })
    if ((this.state.page > 0 && this.state.delta - this.state.changeDelta < 0) || (this.state.page < 3 && this.state.delta - this.state.changeDelta > 0)) {
      if (this.state.delta - this.state.changeDelta >= 300) {
        this.setState({
          page: this.state.page + 1,
          changeDelta: this.state.delta
        })
      } else if (this.state.delta - this.state.changeDelta <= -300) {
        this.setState({
          page: this.state.page - 1,
          changeDelta: this.state.delta
        })
      }
    } else {
      this.setState({
        changeDelta: this.state.delta
      })
    }
  }

  onTouchStart(event) {
    console.log(event.touches[0].clientY)
    this.setState({
      touchStart: event.touches[0].clientY
    })
  }

  render() {
    const { changeDelta, delta, page } = this.state;
    return (
      <section
        onWheel={this.onWheel}
        onTouchMove={this.onTouchMove}
        onTouchStart={this.onTouchStart}>
        <h2>{changeDelta}</h2>
        <h2>{delta}</h2>
        <div className={page !== 0 ? 'd-none' : ''}>Bio</div>
        <div className={page !== 1 ? 'd-none' : ''}>Nome</div>
        <div className={page !== 2 ? 'd-none' : ''}>Idade</div>
        <div className={page !== 3 ? 'd-none' : ''}>última</div>
      </section >
    );
  }
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
        <Container fluid className="text-center">
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

var CAT2FACES = ['front', 'back', 'right', 'left', 'top', 'bottom']

class Works extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      projects: [],
      selectedCategory: 0
    };

    this.changeCategory = this.changeCategory.bind(this);
  }

  componentDidMount() {

    fetch('https://neuranorth.000webhostapp.com/wp-json/wp/v2/projects')
      .then(res => res.json())
      .then(
        (projects) => {
          console.log(projects)
          this.setState({
            isLoaded: true,
            projects: projects
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


  changeCategory(newCategory) {
    this.setState({
      selectedCategory: newCategory
    })
  }

  render() {
    const { error, isLoaded, projects, selectedCategory } = this.state;
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
              return <li><Link to={'/works/' + value.slug}>{value.title.rendered}</Link></li>
            })}
          </ul>
          <div className="categories">
            <div className="cube-div">
              <div className={'cube show-' + (selectedCategory ? CAT2FACES[selectedCategory] : '')}>
                <div className="cube__face cube__face--front">all</div>
                <div className="cube__face cube__face--back">cinema</div>
                <div className="cube__face cube__face--right">dance</div>
                <div className="cube__face cube__face--left">music</div>
                <div className="cube__face cube__face--top">sound art</div>
                <div className="cube__face cube__face--bottom">theatre</div>
              </div>
            </div>
            <div className="categories-list">
              <a onClick={() => this.changeCategory(0)} href="#all" className={selectedCategory === 0 ? 'active' : ''}>all</a>
              <span className="slash"> / </span>
              <a onClick={() => this.changeCategory(1)} href="#cinema" className={selectedCategory === 1 ? 'active' : ''}>cinema</a>
              <span className="slash"> / </span>
              <a onClick={() => this.changeCategory(2)} href="#dance" className={selectedCategory === 2 ? 'active' : ''}>dance</a>
              <span className="slash"> / </span>
              <a onClick={() => this.changeCategory(3)} href="#music" className={selectedCategory === 3 ? 'active' : ''}>music</a>
              <span className="slash"> / </span>
              <a onClick={() => this.changeCategory(4)} href="#sound-art" className={selectedCategory === 4 ? 'active' : ''}>sound art</a>
              <span className="slash"> / </span>
              <a onClick={() => this.changeCategory(5)} href="#theatre" className={selectedCategory === 5 ? 'active' : ''}>theatre</a>
            </div>
          </div>
        </section >
      );
    }
  }
}

class Work extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      project: null
    };
  }

  componentDidMount() {
    fetch('https://neuranorth.000webhostapp.com/wp-json/wp/v2/projects?slug=' + this.props.match.params.slug)
      .then(res => res.json())
      .then(
        (projects) => {
          let project = projects[0]
          console.log(project)
          project.acf.content = Object.values(project.acf.content)
          console.log(project)
          this.setState({
            isLoaded: true,
            project: project
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
    const { error, isLoaded, project } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <section>
          <Container fluid>
            <Row className="text-container">
              <Col xs="12">
                <h2>{project.title.rendered}</h2>
              </Col>
              <Col xs="6" md="3">
                <p className="title">FESTIVAL</p>
                <p className="value">{project.acf.festival}</p>
              </Col>
              <Col xs="6" md="3">
                <p className="title">YEAR</p>
                <p className="value">{project.acf.year}</p>
              </Col>
              <Col xs="12" md="6">
                <p className="title">STORY</p>
                <p className="value description">{project.acf.description}</p>
              </Col>
            </Row>
            <Row className="media-container">
              <Col xs="12" className="position-absolute mt-3 text-center text-muted"><h5>check this</h5></Col>
              {project.acf.content.map((value, index) => {
                if (value !== '') {
                  if (value.length > 15) {
                    return <Col xs="12" className="mx-auto">
                      <img src={'https://drive.google.com/uc?id=' + value} alt={index} />
                    </Col>
                  } else if (value.length < 15) {
                    return <Col xs="12" className="mx-auto">
                      <iframe id="player" type="text/html"
                        src={'http://www.youtube-nocookie.com/embed/' + value + '?fs=0&modestbranding=1&rel=0&showinfo=0'}
                        frameborder="0"></iframe>
                    </Col>
                  }
                }
              })}
            </Row>
          </Container>
        </section>
      );
    }
  }
}

export default App;
