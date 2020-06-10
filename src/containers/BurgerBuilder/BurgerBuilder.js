import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import Spinner from "../../components/UI/Spinner/Spinner";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import axios from "../../axios-orders";
import * as actions from "../../store/actions/index";

export const BurgerBuilder = props => {
	const [purchasing, setPurchasing] = useState(false);

	const price = useSelector(state => state.burgerBuilder.totalPrice);
	const ings = useSelector(state => state.burgerBuilder.ingredients);
	const error = useSelector(state => state.burgerBuilder.error);
	const isAuthenticated = useSelector(state => state.auth.token !== null);

	const dispatch = useDispatch();
	
	const onIngredientAdded = ingredientName => dispatch(actions.addIngredient(ingredientName));
	const onIngredientRemoved = ingredientName => dispatch(actions.removeIngredient(ingredientName));
	const onInitIngredients = useCallback(() => dispatch(actions.initIngredients()), [dispatch]);
	const onInitPurchase = () => dispatch(actions.purchaseInit());
	const onSetAuthRedirectPath = path => dispatch(actions.setAuthRedirectPath(path));

	useEffect(() => {
		onInitIngredients();
	}, [onInitIngredients]);

	const updatePurchaseState = ingredients => {
		return Object.values(ingredients).some(el => el > 0);
	};

	const purchaseHandler = () => {
		if (isAuthenticated) {
			setPurchasing(true);
		} else {
			onSetAuthRedirectPath("/checkout");
			props.history.push("/auth");
		}
	};

	const purchaseCancelHandler = () => {
		setPurchasing(false);
	};

	const purchaseContinueHandler = () => {
		onInitPurchase();
		props.history.push("/checkout");
	};

	let orderSummary = null;

	const disabledInfo = {
		...ings,
	};

	for (let key in disabledInfo) {
		disabledInfo[key] = disabledInfo[key] <= 0;
	}

	let burger = error ? <p>Done fucked up nigga</p> : <Spinner />;
	if (ings) {
		burger = (
			<>
				<Burger ingredients={ings} />
				<BuildControls
					ingredientAdded={onIngredientAdded}
					ingredientRemoved={onIngredientRemoved}
					disabled={disabledInfo}
					purchaseable={updatePurchaseState(ings)}
					ordered={purchaseHandler}
					price={price}
					isAuth={isAuthenticated}
				/>
			</>
		);

		orderSummary = (
			<OrderSummary
				ingredients={ings}
				price={price}
				purchaseCancelled={purchaseCancelHandler}
				purchaseContinued={purchaseContinueHandler}
			/>
		);
	}

	return (
		<>
			<Modal show={purchasing} modalClosed={purchaseCancelHandler}>
				{orderSummary}
			</Modal>
			{burger}
		</>
	);
};

export default withErrorHandler(BurgerBuilder, axios);
