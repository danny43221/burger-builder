import React, { Component } from "react";
import classes from "./Layout.module.css";
import Toolbar from "../../components/Navigation/Toolbar/Toolbar";
import SideDrawer from "../../components/Navigation/SideDrawer/SideDrawer";
import { connect } from "react-redux";

class Layout extends Component {
	state = {
		showSideDrawer: false,
	};

	SideDrawerClosedHandler = () => {
		this.setState({
			showSideDrawer: false,
		});
	};

	SideDrawerToggleHandler = () => {
		this.setState(prevState => ({
			showSideDrawer: !prevState.showSideDrawer,
		}));
	};

	render() {
		return (
			<>
				<Toolbar
					drawerToggleClicked={this.SideDrawerToggleHandler}
					isAuth={this.props.isAuthenticated}
				/>
				<SideDrawer
					isAuth={this.props.isAuthenticated}
					open={this.state.showSideDrawer}
					closed={this.SideDrawerClosedHandler}
				/>
				<main className={classes.Content}>{this.props.children}</main>
			</>
		);
	}
}

const mapStateToProps = state => {
	return {
		isAuthenticated: state.auth.token !== null,
	};
};

export default connect(mapStateToProps)(Layout);
