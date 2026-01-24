import React, { Component, Fragment } from 'react';
import { Row, Col, Form, Input, Label, Button, Container } from 'reactstrap';
import Loader from './Loader.jsx';

const signature = "79cc8041-eca6-49fb-8a57-8009793c35be";
const parentWindowLocation = "https://sandbox.crm.com";

class App extends Component {

	_isMounted = false;
	constructor () {
		super();
		this.state = {
			firstname:"",
			lastname:"",
			accessToken:null,
			loading:false
		};
		window.onmessage = this.messageHandler;
	}

	componentDidMount() {
		this._isMounted = true;
		let message = {
			signature:signature,
			message:"AUTH"
		}
		this.messageSender(JSON.stringify(message));
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	messageHandler = (event) => {
		if(event.origin!==parentWindowLocation)
		{
			return;
		}
		else if(typeof event.data === 'string')
		{
			let data = JSON.parse(event.data);
			if(data.access_token)
			{
				this._isMounted && this.setState({
					accessToken: data.access_token
				});
			}
		}

	}

	messageSender = (message) => {
		if(window.top)
		{
			window.top.postMessage(message,parentWindowLocation);
		}
	}

	handleInputChange = (event) => {
		const target = event.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.name;

		this._isMounted && this.setState({
			[name]: value
		});
	}

	submitForm = async (event) => {
		event.preventDefault();
		this._isMounted && await this.setState({
			loading:true
		});

		let body = {
			contact_type:"PERSON",
			first_name:this.state.firstname,
			last_name:this.state.lastname,
			accounts:[
				{
					is_primary:true,
					currency_code:"USD"
				}
			]
		}
		let options = {
			method:'POST',
			headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${this.state.accessToken}` },
			credentials : 'omit',
			body: JSON.stringify(body)
		}

		fetch(parentWindowLocation+"/backoffice/v1/contacts", options)
		.then(response => {
			if(!response.ok)
			{
				throw response;
			}
			const contentType = response.headers.get('content-type');
			if (!contentType || !contentType.includes('application/json')) {

				return response.text();
			}
			return response.json();
		})
		.then(response => {
			let message = {
				signature:signature,
				message:"COMPLETED"
			}
			this.messageSender(JSON.stringify(message));

			this._isMounted && this.setState({
				loading:false
			});
		})
		.catch(error => {
			this._isMounted && this.setState({
				loading:false
			});
			throw error;
		});
	}

    handleClose = () => {
	    let message = {
			message:"COMPLETED"
		}
		this.messageSender(JSON.stringify(message));
    }

    render() {
	    return (
	       <Container>
		       <Row>
			       <Col>
				       <h3 className="mt-2">Create Contact</h3>
			       </Col>
			       <Col className="d-flex justify-content-end align-items-start">
				       <Button close aria-label="Close" onClick={this.handleClose} />
			       </Col>
			    </Row>
				<hr/>
				<Row>
					<Form onSubmit={this.submitForm}>
						<Container>
							{this.state.loading && <Loader/>}
							<Row className="mt-2">
								<Col>
									<Label for="firstname">First Name</Label>
									<Input id="firstname" name="firstname" value={this.state.firstname} onChange={this.handleInputChange}/>
								</Col>
							</Row>
							<Row className="mt-2">
								<Col>
									<Label for="lastname">Last Name</Label>
									<Input id="lastname" name="lastname" value={this.state.lastname} onChange={this.handleInputChange}/>
								</Col>
							</Row>
							<Row className="mt-2">
								<Col>
									<Button type="submit">Submit</Button>
								</Col>
							</Row>
						</Container>
					</Form>
				</Row>
			</Container>
		);
	}
}

export default App;
