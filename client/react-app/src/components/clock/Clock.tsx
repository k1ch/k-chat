import React from "react";
import './Clock.scss'

export class Clock extends React.Component<{}, { clock: Date }>{
  private tickTimerId
  constructor(props) {
    super(props)
    this.state = { clock: new Date() }
  }

  componentDidMount() {
    this.tickTimerId = setInterval(() => this.tick(), 1000)
  }

  componentWillUnmount() {
    clearInterval(this.tickTimerId)
  }

  tick() {
    this.setState({
      clock: new Date()
    })
  }

  render() {
    return (
      <div className="clock" style={{opacity: 0.5}}>{this.state.clock.toLocaleTimeString()}</div>
    );
  }
}
