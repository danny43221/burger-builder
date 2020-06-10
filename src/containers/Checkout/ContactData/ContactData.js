import React, { useState } from "react";
import Button from "../../../components/UI/Button/Button";
import classes from "./ContactData.module.css";
import axios from "../../../axios-orders";
import Spinner from "../../../components/UI/Spinner/Spinner";
import Input from "../../../components/UI/Input/Input";
import { connect } from "react-redux";
import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";
import * as actions from "../../../store/actions";
import { checkValidity } from "../../../shared/utility";

const ContactData = props => {
	const [orderForm, setOrderForm] = useState({
		name: {
			elementType: "input",
			elementConfig: {
				type: "text",
				placeholder: "Your Name",
			},
			value: "",
			validation: {
				required: true,
			},
			valid: false,
			touched: false,
		},
		street: {
			elementType: "input",
			elementConfig: {
				type: "text",
				placeholder: "Street",
			},
			value: "",
			validation: {
				required: true,
			},
			valid: false,
			touched: false,
		},
		zipCode: {
			elementType: "input",
			elementConfig: {
				type: "text",
				placeholder: "ZIP Code",
			},
			value: "",
			validation: {
				required: true,
				minLength: 5,
				maxLength: 5,
			},
			valid: false,
			touched: false,
		},
		country: {
			elementType: "input",
			elementConfig: {
				type: "text",
				placeholder: "Country",
			},
			value: "",
			validation: {
				required: true,
			},
			valid: false,
			touched: false,
		},
		email: {
			elementType: "input",
			elementConfig: {
				type: "email",
				placeholder: "Your Email",
			},
			value: "",
			validation: {
				required: true,
			},
			valid: false,
			touched: false,
		},
		deliveryMethod: {
			elementType: "select",
			elementConfig: {
				options: [
					{ value: "fastest", displayValue: "Fastest" },
					{ value: "cheapest", displayValue: "Cheapest" },
				],
			},
			value: "fastest",
			validation: {},
			valid: true,
		},
	});

	const [formIsValid, setFormIsValid] = useState(false);

	const orderHandler = event => {
		event.preventDefault();

		const formData = {};
		for (let el in orderForm) {
			formData[el] = orderForm[el].value;
		}
		const order = {
			ingredients: props.ings,
			price: props.price,
			orderData: formData,
			userId: props.userId,
		};
		props.onOrderBurger(order, props.token);
	};

	const inputChangedHandler = (event, inputIdentifier) => {
		const updatedOrderForm = {
			...orderForm,
		};

		const updatedFormElement = {
			...updatedOrderForm[inputIdentifier],
		};

		updatedFormElement.value = event.target.value;
		updatedFormElement.valid = checkValidity(
			updatedFormElement.value,
			updatedFormElement.validation
		);
		updatedFormElement.touched = true;
		updatedOrderForm[inputIdentifier] = updatedFormElement;

		let formIsValid = true;
		for (let i in updatedOrderForm) {
			formIsValid = updatedOrderForm[i].valid && formIsValid;
		}

		setOrderForm(updatedOrderForm);
		setFormIsValid(formIsValid);
	};

	const formElementsArray = [];
	for (let key in orderForm) {
		formElementsArray.push({ id: key, config: orderForm[key] });
	}
	let form = (
		<div className={classes.ContactData}>
			<h4>Enter your Contact Data</h4>
			<form onSubmit={orderHandler}>
				{formElementsArray.map(el => (
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
				))}
				<Button
					btnType="Success"
					disabled={!formIsValid}
					clicked={orderHandler}
				>
					ORDER
				</Button>
			</form>
		</div>
	);
	if (props.loading) {
		form = <Spinner />;
	}
	return form;
};

const mapStateToProps = state => {
	return {
		ings: state.burgerBuilder.ingredients,
		price: state.burgerBuilder.totalPrice,
		loading: state.order.loading,
		token: state.auth.token,
		userId: state.auth.userId,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onOrderBurger: (orderData, token) =>
			dispatch(actions.purchaseBurger(orderData, token)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withErrorHandler(ContactData, axios));
