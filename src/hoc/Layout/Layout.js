import React, { useState } from "react";
import classes from "./Layout.module.css";
import Toolbar from "../../components/Navigation/Toolbar/Toolbar";
import SideDrawer from "../../components/Navigation/SideDrawer/SideDrawer";
import { connect } from "react-redux";

const Layout = props => {
	const [sideDrawerIsVisible, setSideDrawerIsVisible] = useState(false);

	const SideDrawerClosedHandler = () => {
		setSideDrawerIsVisible(false)
	};

	const SideDrawerToggleHandler = () => {
		setSideDrawerIsVisible(prev => !prev)
	};

	return (
		<>
			<Toolbar
				drawerToggleClicked={SideDrawerToggleHandler}
				isAuth={props.isAuthenticated}
			/>
			<SideDrawer
				isAuth={props.isAuthenticated}
				open={sideDrawerIsVisible}
				closed={SideDrawerClosedHandler}
			/>
			<main className={classes.Content}>{props.children}</main>
		</>
	);
};

const mapStateToProps = state => {
	return {
		isAuthenticated: state.auth.token !== null,
	};
};

export default connect(mapStateToProps)(Layout);
