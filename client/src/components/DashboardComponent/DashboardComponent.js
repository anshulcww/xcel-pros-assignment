import React, { Component } from 'react';
import { getUsers } from '../../actions/userActions'
import { logout } from '../../actions/userActions'
import { editUser } from '../../actions/userActions'
import { deleteUser } from '../../actions/userActions'
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Modal from 'react-modal';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};

class DashboardComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalIsOpen: false,
            firstName: '',
            lastName: '',
            email: '',
            userId : ''
        }
        this.handleModal = this.handleModal.bind(this)
        this.handleClick = this.handleClick.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleDeleteUser = this.handleDeleteUser.bind(this);
    }

    async handleDeleteUser(select){
        let userId = select._id
        await this.props.deleteUser(userId)
    }


    async handleSubmit(e){
        e.preventDefault();
        let body = {
            firstName : this.state.firstName,
            lastName : this.state.lastName,
            email: this.state.email,
            updateUserId : this.state.userId
        }
        await this.props.editUser(body)
        this.setState({
            modalIsOpen : false
        })
    }

    handleClick(select) {
        this.setState({
            modalIsOpen: true,
            firstName: select.firstName,
            lastName: select.lastName,
            email: select.email,
            userId : select._id
        })
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })

    }

    handleModal() {
        this.setState({
            modalIsOpen: false
        })
    }
    async handleLogout(e) {
        e.preventDefault()
        await this.props.logout()
    }
    async componentDidMount() {

        await this.props.getUsers()
    }

    render() {
        let isAuth = localStorage.getItem('token')
        let loginTime = localStorage.getItem('loginTime')
        if (!isAuth) {
            return <Redirect
                to={{
                    pathname: '/login'
                }}
            />
        }
        // if(loginTime !== null && Date.now() - loginTime > 6000){
        //     //localStorage.removeItem('loginTime')
        //     return  <Redirect
        //     to={{
        //         pathname : '/login'
        //     }}
        //     /> 
        // }
        let userName = localStorage.getItem('userName');       
        return (
            <div className='container'>
                <div className='row'>
                    <div className='col'><h2>Dashboard</h2></div>
                    <div className='col'><h3>{userName ? userName : 'Hello'}</h3><span><button type='button' onClick={this.handleLogout}>Log out</button></span></div>
                </div>
                <div className='row'>
                    {
                        this.props.users.map((u, index) => (
                            <div className="card user-card" key={index}>
                                <img src="/avatar.jpg" class="card-img-top" alt="..." />
                                <div class="card-body">
                                    <h5 class="card-title"><span>{u.firstName}</span><span> {u.lastName}</span></h5>
                                    <p class="card-text">{u.email}</p>
                                    <button type='button' onClick={() => this.handleClick(u)}>Edit</button>
                                    <button type='button' onClick= {() => this.handleDeleteUser(u)}>Delete</button>
                                </div>
                            </div>
                        ))
                    }
                </div>
                <Modal
                    isOpen={this.state.modalIsOpen}
                    style={customStyles}
                    contentLabel="Example Modal"
                >

                    <h3>Edit User Details</h3>
                    <form onSubmit={this.handleSubmit}>
                        <div className="row">
                            <div className="col">
                                <label>First Name</label>
                                <input type="text" className="form-control" name='firstName' placeholder="First name" onChange={this.handleChange} value = {this.state.firstName} required />
                            </div>
                            <div className="col">
                                <label>Last Name</label>
                                <input type="text" className="form-control" name='lastName' placeholder="Last name" onChange={this.handleChange} value = {this.state.lastName} required />
                            </div>
                        </div>
                        <br></br>
                        <div className="form-group">
                            <label >Email address</label>
                            <input type="email" className="form-control" name='email' placeholder="Enter email" onChange={this.handleChange} value = {this.state.email} required />
                        </div>
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    users: state.user.users,
    user: state.user.user
})


export default connect(mapStateToProps, { getUsers, logout, editUser, deleteUser })(DashboardComponent);
