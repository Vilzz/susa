import React from 'react'
import { Navbar, Nav, Dropdown } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { LinkContainer } from 'react-router-bootstrap'
import {
  faHome,
  faCog,
  faUserPlus,
  faSignInAlt,
  faSignOutAlt,
  faRunning,
} from '@fortawesome/free-solid-svg-icons'
import { logout } from '../../actions/auth'
import { connect } from 'react-redux'

const Mainnav = ({ isAuthenticated, loading, user, logout, history }) => {
  const linksByUser = (role) => {
    switch (role) {
      case 'Super':
        return (
          <>
            <Dropdown as={Nav.Item}>
              <Dropdown.Toggle as={Nav.Link}>Кабинет</Dropdown.Toggle>
              <Dropdown.Menu>
                <LinkContainer to='/superprofile'>
                  <Dropdown.Item>Данные профиля</Dropdown.Item>
                </LinkContainer>
                <LinkContainer to='/deleteprofile'>
                  <Dropdown.Item>Удаление профиля</Dropdown.Item>
                </LinkContainer>
              </Dropdown.Menu>
            </Dropdown>
            <LinkContainer to='/superdashboard'>
              <Nav.Link>
                <FontAwesomeIcon icon={faCog} transform='left-3 shrink-2' />
                Настройки
              </Nav.Link>
            </LinkContainer>
          </>
        )
      case 'Admin':
        return (
          <>
            <Dropdown as={Nav.Item}>
              <Dropdown.Toggle as={Nav.Link}>Кабинет</Dropdown.Toggle>
              <Dropdown.Menu>
                <LinkContainer to='/adminprofile'>
                  <Dropdown.Item>Данные профиля</Dropdown.Item>
                </LinkContainer>
                <LinkContainer to='/deleteprofile'>
                  <Dropdown.Item>Удаление профиля</Dropdown.Item>
                </LinkContainer>
              </Dropdown.Menu>
            </Dropdown>
            <LinkContainer to='/admindashboard'>
              <Nav.Link>
                <FontAwesomeIcon icon={faCog} transform='left-3 shrink-2' />
                Настройки
              </Nav.Link>
            </LinkContainer>
          </>
        )
      default:
        return (
          <>
            <Dropdown as={Nav.Item}>
              <Dropdown.Toggle as={Nav.Link}>Кабинет</Dropdown.Toggle>
              <Dropdown.Menu>
                <LinkContainer to='/userprofile'>
                  <Dropdown.Item>Учетные данные</Dropdown.Item>
                </LinkContainer>
                <LinkContainer to='/profile'>
                  <Dropdown.Item>Профиль</Dropdown.Item>
                </LinkContainer>
                <LinkContainer to='/editprofile'>
                  <Dropdown.Item>Редактировать профиль</Dropdown.Item>
                </LinkContainer>
                <LinkContainer to='/deleteprofile'>
                  <Dropdown.Item>Удаление профиля</Dropdown.Item>
                </LinkContainer>
              </Dropdown.Menu>
            </Dropdown>
            <LinkContainer to='/userdashboard'>
              <Nav.Link>
                <FontAwesomeIcon icon={faCog} transform='left-3 shrink-2' />
                Настройки
              </Nav.Link>
            </LinkContainer>
          </>
        )
    }
  }

  const guestMenuItems = () => (
    <>
      <LinkContainer to='/login'>
        <Nav.Link>
          <FontAwesomeIcon icon={faSignInAlt} transform='left-3 shrink-2' />
          Вход
        </Nav.Link>
      </LinkContainer>
      <LinkContainer to='/register'>
        <Nav.Link>
          <FontAwesomeIcon icon={faUserPlus} transform='left-3 shrink-2' />
          Регистрация
        </Nav.Link>
      </LinkContainer>
    </>
  )

  const authMenuItems = () => (
    <>
      {!loading && user !== null && linksByUser(user.data.role)}
      <Nav.Link onClick={() => logoutClick()}>
        <FontAwesomeIcon icon={faSignOutAlt} transform='left-3 shrink-2' />
        Выход
      </Nav.Link>
    </>
  )
  const logoutClick = () => {
    logout()
  }
  return (
    <Navbar bg='dark' variant='dark' expand='lg'>
      <LinkContainer to='/'>
        <Navbar.Brand>
          <FontAwesomeIcon icon={faRunning} transform='left-3 shrink-2' />
          SUSA
        </Navbar.Brand>
      </LinkContainer>
      <Navbar.Toggle aria-controls='responsive-navbar-nav' />
      <Navbar.Collapse
        id='responsive-navbar-nav'
        className='justify-content-end'
      >
        <Nav className='mr-auto'>
          <LinkContainer to='/'>
            <Nav.Link>
              <FontAwesomeIcon icon={faHome} transform='left-3 shrink-2' />
              Главная
            </Nav.Link>
          </LinkContainer>
          {!loading && !isAuthenticated ? guestMenuItems() : authMenuItems()}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}
const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  loading: state.auth.loading,
  user: state.auth.user,
})
export default connect(mapStateToProps, { logout })(Mainnav)
