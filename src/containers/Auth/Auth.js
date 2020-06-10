import React, { useState, useEffect } from "react";
import Input from "../../components/UI/Input/Input";
import Button from "../../components/UI/Button/Button";
import classes from "./Auth.module.css";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import * as actions from "../../store/actions";
import Spinner from "../../components/UI/Spinner/Spinner";
import { checkValidity } from "../../shared/utility";

const Auth = props => {
	const [controls, setControls] = useState({
		name: {
			elementType: "input",
			elementConfig: {
				type: "email",
				placeholder: "Email",
			},
			value: "",
			validation: {
				required: true,
				isEmail: true,
			},
			valid: false,
			touched: false,
		},
		password: {
			elementType: "input",
			elementConfig: {
				type: "password",
				placeholder: "Password",
			},
			value: "",
			validation: {
				required: true,
				minLength: 6,
			},
			valid: false,
			touched: false,
		},
	});
	const [isSignUp, setIsSignUp] = useState(true);

	const {buildingBurger, authRedirectPath, onSetAuthRedirectPath} = props

	useEffect(() => {
		if (!buildingBurger && authRedirectPath !== "/") {
			onSetAuthRedirectPath();
		}
	}, [buildingBurger, authRedirectPath, onSetAuthRedirectPath]);

	const inputChangedHandler = (event, controlName) => {
		const updatedControls = {
			...controls,
			[controlName]: {
				...controls[controlName],
				value: event.target.value,
				valid: checkValidity(
					event.target.value,
					controls[controlName].validation
				),
				touched: true,
			},
		};
		setControls(updatedControls);
	};

	const submitHandler = event => {
		event.preventDefault();
		props.onAuth(controls.name.value, controls.password.value, isSignUp);
	};

	const switchAuthModeHandler = () => {
		setIsSignUp(prev => !prev);
	};

	const formElementsArray = [];
	for (let key in controls) {
		formElementsArray.push({ id: key, config: controls[key] });
	}

	let form = formElementsArray.map(el => (
		<Input
			key={el.id}
			elementType={el.config.elementType}
			elementConfig={el.config.elementConfig}
			value={el.config.value}
			invalid={!el.config.valid}
			shouldValidate={el.config.validation}
			touched={el.config.touched}
			changed={event => inputChangedHandler(event, el.id)}
		/>
	));

	if (props.loading) {
		form = <Spinner />;
	}

	let errorMessage = null;

	if (props.error) {
		errorMessage = <p>{props.error.message}</p>;
	}

	let authRedirect = null;
	if (props.isAuthenticated) {
		authRedirect = <Redirect to={props.authRedirectPath} />;
	}

	return (
		<div className={classes.Auth}>
			{authRedirect}
			{errorMessage}
			<form onSubmit={submitHandler}>
				{form}
				<Button btnType="Success">SUBMIT</Button>
			</form>
			<Button btnType="Danger" clicked={switchAuthModeHandler}>
				SWITCH TO {isSignUp ? "SIGNIN" : "SIGNUP"}
			</Button>
		</div>
	);
};

const mapStateToProps = state => {
	return {
		loading: state.auth.loading,
		buildingBurger: state.burgerBuilder.building,
		authRedirectPath: state.auth.authRedirectPath,
		error: state.auth.error,
		isAuthenticated: state.auth.token !== null,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onAuth: (email, password, isSignUp) =>
			dispatch(actions.auth(email, password, isSignUp)),
		onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath("/")),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
