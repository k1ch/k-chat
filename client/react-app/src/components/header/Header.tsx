import React from 'react'
import './Header.scss'
import { Button } from '@material-ui/core'
import { Link, withRouter } from 'react-router-dom'

import { Clock, Logo } from '../index'

class Header extends React.Component<{ location }, { showLogin: boolean }> {
  constructor(props) {
    super(props)
    this.state = {
      showLogin: this.isShowLogin(this.props.location.pathname)
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.setState({
        showLogin: this.isShowLogin(this.props.location.pathname)
      })
    }
  }

  isShowLogin(path) {
    return !path.startsWith('/login')
  }

  render() {
    return (
      <div className='header_container'>
        <div className='header_logo_container'>
          <div className='header_logo_block'>
            <Link to='/' className='no-text-decoration'>
              <Logo />
            </Link>
          </div>
          <div className='header_logo_clock'>
            <Clock />
          </div>
        </div>
        <div className='header__loginBtn__container'>
          {this.state.showLogin &&
            <div className='header__loginBtn__block'>
              <Link className='no-text-decoration' to='/login'>
                <Button variant='outlined'>Login</Button>
              </Link>
            </div>
          }
        </div>
      </div>
    )
  }
}

export default withRouter(Header)