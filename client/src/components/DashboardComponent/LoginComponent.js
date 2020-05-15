import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createLogin } from '../../actions/userActions'
import './DashboardComponent.css';
import { Redirect } from 'react-router-dom';

class LoginComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            emailId  : '',
            password : ''
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

   async handleSubmit(e){
        e.preventDefault();
        let user = {
            email : this.state.emailId,
            password :  this.state.password
        }
        await this.props.createLogin(user)
    }

    handleChange(e){
        //console.log(e.target.value)
        this.setState({
            [e.target.name] : e.target.value
        })
        
    }
    async componentDidMount() {

    }

    render() {
        localStorage.removeItem('loginTime')
        localStorage.removeItem('token')
        localStorage.removeItem('userId')
        return (
            <div className='container'>
                <div className='row'>
                    <div className='col'>Image</div>
                    <div className='col'>
                        <h1>Login</h1>
                        <p>Don't have an account? <a href='/signup'>Sign up</a></p>
                        <form onSubmit={this.handleSubmit}>
                            <div className="form-group">
                                <label >Email address</label>
                                <input type="email" className="form-control" name='emailId' placeholder="Enter email" onChange={this.handleChange} required/>
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <input type="password" className="form-control" name='password' onChange={this.handleChange} placeholder="Password" required/>
                            </div>
                            <button type="submit" className="btn btn-primary">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}




export default connect(null, {createLogin})(LoginComponent);

