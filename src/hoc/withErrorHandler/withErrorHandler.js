import React from "react";
import Modal from "../../components/UI/Modal/Modal";
import useHttpErrorHandler from '../../hooks/httpErrorHandler'

const withErrorHandler = (WrappedComponent, axios) => {
	return props => {
		const [error, errorConfirmedHandler] = useHttpErrorHandler(axios);

		return (
			<>
				<Modal
					show={error}
					modalClosed={errorConfirmedHandler}
				>
					{error ? error.message : null}
				</Modal>
				<WrappedComponent {...props} />
			</>
		);
	};
};

export default withErrorHandler;
