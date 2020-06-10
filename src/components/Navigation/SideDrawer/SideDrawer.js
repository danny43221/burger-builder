import React from "react";
import Logo from "../../Logo/Logo";
import NavigationItems from "../NavigationItems/NavigationItems";
import BackDrop from "../../UI/Backdrop/Backdrop";
import classes from "./SideDrawer.module.css";

const SideDrawer = (props) => {
	let attachedClasses = [classes.SideDrawer, classes.Close]
	if (props.open) {
		attachedClasses[1] = classes.Open
	}
	return (
		<>
			<BackDrop show={props.open} clicked={props.closed} />
			<div className={attachedClasses.join(' ')} onClick={props.closed}>
				<Logo height="11%" />
				<nav>
					<NavigationItems isAuthenticated={props.isAuth} />
				</nav>
			</div>
		</>
	);
};

export default SideDrawer;
