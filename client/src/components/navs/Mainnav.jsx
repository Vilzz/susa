import React from 'react'
import { Navbar, Nav, NavDropdown } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faHome,
  faUserPlus,
  faSignInAlt,
  faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons'
const Mainnav = () => {
  return (
    <Navbar bg='dark' variant='dark' expand='lg'>
      <Navbar.Brand href='/'>SUSA</Navbar.Brand>
      <Navbar.Toggle aria-controls='responsive-navbar-nav' />
      <Navbar.Collapse
        id='responsive-navbar-nav'
        className='justify-content-end'
      >
        <Nav className='mr-auto'>
          <Nav.Link href='/'>
            <FontAwesomeIcon icon={faHome} transform='left-3 shrink-2' />
            Главная
          </Nav.Link>
          <NavDropdown title='Dropdown' id='collasible-nav-dropdown'>
            <NavDropdown.Item href='#action/3.1'>Action</NavDropdown.Item>
            <NavDropdown.Item href='#action/3.2'>
              Another action
            </NavDropdown.Item>
            <NavDropdown.Item href='#action/3.3'>Something</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href='#action/3.4'>
              Separated link
            </NavDropdown.Item>
          </NavDropdown>
          <Nav.Link href='/login'>
            <FontAwesomeIcon icon={faSignInAlt} transform='left-3 shrink-2' />
            Вход
          </Nav.Link>
          <Nav.Link href='/register'>
            <FontAwesomeIcon icon={faUserPlus} transform='left-3 shrink-2' />
            Регистрация
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default Mainnav
