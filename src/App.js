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

import knob from './knob.png';

import ReactScrollWheelHandler from "react-scroll-wheel-handler";
import Sound from 'react-sound';

import { IoIosSend } from 'react-icons/io';

import { Container, Row, Button, Col, Form, ThemeProvider } from 'react-bootstrap';

// Components
import Sphere3D from './Sphere3D';
import Cube3D from './Cube3D';

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
        {/*<Link to="/" className="navbar-brand mx-auto d-none d-lg-inline-block"><span class="title" data-text="NEURA of the NORTH"><span>NEURA of the NORTH</span></span></Link>
        <Link to="/" className="navbar-brand mx-auto d-lg-none d-inline-block">
          {pathname === '/' && <span class="title" data-text="NEURA of the NORTH"><span>NEURA of the NORTH</span></span>}
          {pathname !== '/' && <img src={logo} alt="logo" />}
        </Link> *** VERSAO COM NOME EM PC E LOGO EM MOBILE***/}
        <Link to="/" className="navbar-brand mx-auto">
          <img id="logo" src={logo} alt="logo" />
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

function ScrollEffect() {

  return (
    <div class="arrow">
      <span></span>
      <span></span>
      <span></span>
    </div>
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

class App extends React.Component {

  render() {
    return (
      <div className="App" >
        <Sound
          url="./bgSound.mp3"
          autoLoad={true}
          playStatus={Sound.status.PLAYING}
          onLoading={this.handleSongLoading}
          onPlaying={this.handleSongPlaying}
          onFinishedPlaying={this.handleSongFinishedPlaying}
        />
        <Navbar />
        <AnimatedSwitch />
      </div>
    );
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
      cellCount: 6,
      knobRotation: -120,
      random3d: Math.random()
    };
  }


  previousEvent() {
    if (this.state.selectedIndex < this.state.events.length - 1) {
      this.setState({
        selectedIndex: this.state.selectedIndex + 1
      });
    }
  }
  nextEvent() {
    if (this.state.selectedIndex > 0) {
      this.setState({
        selectedIndex: this.state.selectedIndex - 1
      });
    }
  }

  updateKnobRotation(newRot) { this.setState({ knobRotation: newRot }); }

  componentDidMount() {
    fetch('https://neuranorth.000webhostapp.com/wp-json/wp/v2/events?per_page=100')
      .then(res => res.json())
      .then(
        (events) => {
          console.log(events)

          events = events.sort(function (a, b) {
            // needed because dates are in format DD/MM/YYYY
            var datePartsA = a.acf.date.split("/");
            var dateA = new Date(+datePartsA[2], datePartsA[1] - 1, +datePartsA[0]);
            var datePartsB = b.acf.date.split("/");
            var dateB = new Date(+datePartsB[2], datePartsB[1] - 1, +datePartsB[0]);
            return dateB - dateA;
          });

          let selIndex = 0;
          let dateDistance = Number.MAX_SAFE_INTEGER;
          var today = new Date();
          today.setHours(0, 0, 0, 0);
          for (var i = 0; i < events.length; ++i) {
            let dateParts = events[i].acf.date.split("/");
            let date = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
            let tmpD = date - today;
            if (tmpD >= 0 && tmpD <= dateDistance) {
              dateDistance = tmpD;
              selIndex = i;
            } else if (tmpD < 0) {
              //cant break because of the titles that have special characters need to be escaped
              //break;
            }
            events[i].title.rendered = events[i].title.rendered.replace(/&#8220;/g, "\"").replace(/&#8221;/g, "\"").replace(/&#8211;/g, "-")
          }

          this.setState({
            isLoaded: true,
            events: events,
            selectedIndex: selIndex
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
    const { error, isLoaded, events, selectedIndex, knobRotation, random3d } = this.state;
    /*if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {*/
    return (
      <section>
        {window.innerWidth < 576 && <Cube3D />}
        {window.innerWidth >= 576 && ((random3d < 0.5 && <Cube3D />) || (random3d >= 0.5 && <Sphere3D />))}
        {window.innerWidth > 576 && <ReactScrollWheelHandler
          upHandler={() => this.nextEvent()}
          downHandler={() => this.previousEvent()}
          timeout="300"
          id="events-carousel">
          <div id="events-lines">
            {events.map((value, index) => {
              let dist = Math.abs(index - selectedIndex)
              let z = 0;
              let y = 0;
              let opacity = 100;
              let height = 2;
              let bgColor = 'white';
              let width = 20;
              if (dist >= 4) {
                z = -200;
                y = 400;
                opacity = 0;
              } else if (dist >= 3) {
                z = -120;
                y = 300;
              } else if (dist >= 2) {
                z = -60;
                y = 200;
              } else if (dist >= 1) {
                z = -20;
                y = 100;
              } else {
                height = 3;
                bgColor = 'tomato';
                width = 50;
              }
              if (index < selectedIndex) {
                y = -y
              }
              return <span className="event-line" style={{
                transform: 'translate3d(0, ' + y + 'px,' + z + 'px)',
                height: height + 'px',
                width: width + 'px',
                backgroundColor: bgColor,
                opacity: opacity
              }}></span>
            })}
          </div>
          <div id="events-infos">
            {events.map((value, index) => {
              let dist = Math.abs(index - selectedIndex)
              let z = 0;
              let y = 0;
              let opacity = 100;
              if (dist >= 4) {
                z = -200;
                y = 400;
                opacity = 0;
              } else if (dist >= 3) {
                z = -120;
                y = 300;
              } else if (dist >= 2) {
                z = -60;
                y = 200;
              } else if (dist >= 1) {
                z = -20;
                y = 100;
              } else {
              }
              if (index < selectedIndex) {
                y = -y
              }
              return <div className="event-info" style={{ transform: 'translate3d(0, ' + y + 'px,' + z + 'px)', opacity: opacity }}>
                <span class="event-title">{value.title.rendered}</span>
                <br />
                <span class="localdata">{value.acf.local} . {value.acf.date}</span>
              </div>
            })}
          </div>
        </ReactScrollWheelHandler>}
        {window.innerWidth > 576 && <div id="home-menu">
          <img id="menu-knob" src={knob} alt="knob" style={{ transform: 'translateY(-100px) rotate(' + knobRotation + 'deg)' }} />

          <div id="menu-content" onMouseLeave={() => this.updateKnobRotation(-120)}>
            <div onMouseEnter={() => this.updateKnobRotation(-50)}>
              <svg height="100" width="80">
                <polyline points="0,90 20,50 70,50" style={{ fill: 'transparent', stroke: 'white', strokeWidth: 2 }} />
              </svg>
              <Link className="menu-anchor" to="/works">WORKS</Link>
            </div>
            <div onMouseEnter={() => this.updateKnobRotation(0)} >
              <svg height="100" width="80">
                <polyline points="20,50 70,50" style={{ fill: 'transparent', stroke: 'white', strokeWidth: 2 }} />
              </svg>
              <Link className="menu-anchor" to="/bio">BIO</Link>
            </div>
            <div onMouseEnter={() => this.updateKnobRotation(50)}>
              <svg height="100" width="80">
                <polyline points="0,10 20,50 70,50" style={{ fill: 'transparent', stroke: 'white', strokeWidth: 2 }} />
              </svg>
              <Link className="menu-anchor" to="/contact">CONTACT</Link>
            </div>
          </div>
        </div>}
        {/* SMALL DEVICES */}
        {window.innerWidth <= 576 && <div id="home-menu">
          <div id="menu-content">
            <div>
              <svg height="80" width="100">
                <polyline points="80,10 20,50 20,70" style={{ fill: 'transparent', stroke: 'white', strokeWidth: 2 }} />
              </svg>
              <svg height="80" width="100">
                <polyline points="50,10 50,30" style={{ fill: 'transparent', stroke: 'white', strokeWidth: 2 }} />
              </svg>
              <svg height="80" width="100">
                <polyline points="20,10 80,50 80,70" style={{ fill: 'transparent', stroke: 'white', strokeWidth: 2 }} />
              </svg>
            </div>
            <div>
              <Link className="menu-anchor" to="/works" style={{ left: '10px' }}>WORKS</Link>
              <Link className="menu-anchor" to="/bio" style={{ bottom: '11vw' }}>BIO</Link>
              <Link className="menu-anchor" to="/contact" style={{ right: '10px' }}>CONTACT</Link>
            </div>
          </div>
        </div>}
        {window.innerWidth <= 576 && <ReactScrollWheelHandler
          rightHandler={() => this.nextEvent()}
          leftHandler={() => this.previousEvent()}
          timeout="300"
          id="events-carousel">
          {events.map((value, index) => {
            let dist = Math.abs(index - selectedIndex)
            let z = 0;
            let x = 0;
            let opacity = 100;
            let height = 2;
            let bgColor = 'white';
            let width = 20;
            if (dist >= 4) {
              z = -200;
              x = 800;
              opacity = 0;
            } else if (dist >= 3) {
              z = -120;
              x = 600;
            } else if (dist >= 2) {
              z = -60;
              x = 400;
            } else if (dist >= 1) {
              z = -20;
              x = 200;
            } else {
              height = 3;
              bgColor = 'tomato';
              width = 50;
            }
            if (index < selectedIndex) {
              x = -x
            }
            return <div className='event-cell' style={{ transform: 'translate3d(' + x + 'px, 0, ' + z + 'px)', opacity: opacity }}>
              <span className="event-line" style={{ transform: 'translateX(-50%)', height: height + 'px', width: width + 'px', backgroundColor: bgColor }}></span>
              <div className="event-info" style={{ transform: 'translateX(-50%)' }}>
                <span class="event-title">{value.title.rendered}</span>
                <br />
                <span class="localdata">{value.acf.local} . {value.acf.date}</span>
              </div>
            </div>
          })}
        </ReactScrollWheelHandler>}
        <footer className="social-container">
          {/*<div className="mx-auto">
            <button className="btn btn-sm btn-dark px-4 py-0">Check my stories</button>
        </div>*/}
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

    /*this.onWheel = this.onWheel.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);*/
  }

  /*onWheel(event) {
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
  }*/

  previousPage() {
    if (this.state.page > 0) {
      this.setState({
        page: this.state.page - 1
      });
    }
  }
  nextPage() {
    if (this.state.page < 3) {
      this.setState({
        page: this.state.page + 1
      });
    }
  }

  render() {
    const { /*changeDelta, delta,*/ page } = this.state;
    return (

      <ReactScrollWheelHandler
        upHandler={() => this.previousPage()}
        downHandler={() => this.nextPage()}>
        <section>
          {/*onWheel={this.onWheel}
        onTouchMove={this.onTouchMove}
        onTouchStart={this.onTouchStart}>
        <h2>{changeDelta}</h2>
    <h2>{delta}</h2>*/}
          <Container fluid className="text-justify">
            <Row>

                  <Col xs="12" sm="10" md="8" lg="4" className={`mx-auto ${page !== 0 ?'d-none' : ''}`}>
                    Rafael Maia, was born in Porto, Portugal. His first contact with music and sound begun with a guitar in the early years of his infancy.
                </Col>
                  <Col xs="12" sm="10" md="8" lg="4" className={`mx-auto ${page !== 1 ?'d-none' : ''}`}>
                    Finished his graduation course in sound and light design by the end of 2018 (acho eu), in this period he had the change to participate as a composer and sound designer for multiple theatre peaces, dance performances and sound installations.
                </Col>
                  <Col xs="12" sm="10" md="8" lg="4" className={`mx-auto ${page !== 2 ?'d-none' : ''}`}>
                    He also had the chance to lead some multidisciplinar art projects in and out o Portugal.
                </Col>
                  <Col xs="12" sm="10" md="8" lg="4" className={`mx-auto ${page !== 3 ?'d-none' : ''}`}>
                    Recently finished his master degree in sound design with a thesis on how to design timbre to affect emotion. Since the beginning of his master degree, Rafael has been actively working in new projects of his own as well as collaborating with multiple well known names in sound design and music in Portugal.
                </Col>

            </Row>
          </Container>
          <div className="bio-scroll">
  {page == 0 && <ScrollEffect /> }
          </div>
          <div className="part-indicator">
						<ul>
							<li style={{opacity: page == 0 ? 1 : 0.2}}></li>
							<li style={{opacity: page == 1 ? 1 : 0.2}}></li>
							<li style={{opacity: page == 2 ? 1 : 0.2}}></li>
							<li style={{opacity: page == 3 ? 1 : 0.2}}></li>
						</ul>
					</div>
        </section >
      </ReactScrollWheelHandler>
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
      message: '',
      showForm: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.showForm = this.showForm.bind(this);
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

  showForm() {
    this.setState({ showForm: true });
  }

  render() {
    const { error, name, email, subject, message, showForm } = this.state;
    return (
      <ReactScrollWheelHandler
        downHandler={() => this.showForm()}>
        <section>
          <Container fluid className="text-center">
            <Row>
              <Col xs="12" sm="10" md="8" lg="4" className="mx-auto">
                {/*<p className="font-weight-bolder mb-0">MAIL ME</p>*/}
                <a className="nostyle" href={'mailto:rafamaianet@hotmail.com?subject=' + subject + '&body=' + message}>rafamaianet@hotmail.com</a>
                <p className="my-4">- or -</p>
                {!showForm &&
                  <div>
                    <p className="font-weight-bolder mb-0" onClick={() => this.showForm()}>CLICK/DRAG DOWN TO CONTACT ME</p>
                    <ScrollEffect />
                  </div>
                }
                {error &&
                  <p className="small text-danger error-message">{error.message}</p>
                }
                <Form className={`contact-form ${showForm ? "visible" : "invisible"}`} onSubmit={this.handleSubmit} >
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
      </ReactScrollWheelHandler>
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
                        src={'https://www.youtube-nocookie.com/embed/' + value + '?fs=0&modestbranding=1&rel=0&showinfo=0'}
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
