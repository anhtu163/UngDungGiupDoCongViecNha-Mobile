* eslint-disable func-names */
import React, { PureComponent } from 'react';
import { Redirect } from 'react-router-dom';
import { Container, Typography, Divider } from '@material-ui/core';
import socketIOClient from "socket.io-client";
import '../App.css';

const ENDPOINT = "http://localhost:3001";

let socket;

class HomePage extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      message: "Message",
      date: "NULL",
      n: "NULL",
      connect:"NULL"
    };
  }

  componentDidMount() {
    const { token } = this.props;

    socket = socketIOClient(ENDPOINT);

    socket.on('connect', function () {
      socket.emit('authenticate', { token });
    });

    socket.on("authenticate",(res)=>{
      this.setState({connect:res.message});
    });

    socket.on("reminder", data => {
      console.log(data);
      this.setState({ message: data.name });
    });

    socket.on("date", data => {
      this.setState({ date: data });
    });

    socket.on("nudge", data => {
      console.log(data);
      this.setState({ n: data.message });
    });
  }

  render() {
    const st = this.props;
    const s = this.state;

    if (!st.isLogin) {
      return <Redirect to="/login" />;
    }

    return (
      <Container maxWidth="50%">
        <Typography>{st.token.toString()}</Typography>
        <Divider />
        <Typography>{st.user.mName}</Typography>
        <Divider />
        <Typography>Date: {s.date}</Typography>
        <Divider />
        <Typography>Connect Server: {s.connect}</Typography>
        <Divider />
        <Typography>Message: {s.message}</Typography>
        <Typography>Nudge: {s.n}</Typography>
        <button type="button" onClick={st.logout}>
          Đăng xuất
          </button>
        <button type="button" onClick={this.nudge}>
          Nudge
          </button>
      </Container>
    );
  }
}

export default HomePage;