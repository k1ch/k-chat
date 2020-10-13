import React from 'react'
import { Card, CardActionArea, CardActions, CardContent, CardHeader, TextField, FormControl, Button } from '@material-ui/core'
import { Link } from 'react-router-dom'

import './Login.scss'

export class Login extends React.Component<{ location }> {
  constructor(props) {
    super(props)
  }

  handleLogin(e) {

  }

  handleChange(e) {
    e.preventDefault()
    
  }

  render() {
    return (
      <Card classes={{ root: 'card__container' }} raised={true}>
        <CardHeader classes={{ title: 'card__header-title', subheader: 'card__header-subheader' }}
          title={'Welcomet to KChat!'}
          subheader={(<span>Need an account? <Link to='/'>Sign up!</Link></span>)}
        />
        <CardContent classes={{ root: 'card__content__container' }}>
          <FormControl>
            <TextField required label='Username' variant="outlined"></TextField>
          </FormControl>
          <br></br>
          <FormControl>
            <TextField required variant="outlined" label='Password' error={false} helperText={false && 'fdsfds'} />
          </FormControl>
        </CardContent>
        <div style={{ float: 'right', marginRight: '20px', marginBottom: '20px' }}>
          <CardActions >
            <Button variant='outlined'>Login</Button>
          </CardActions>
        </div>
      </Card>
    )
  }
}