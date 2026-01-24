import React from 'react';

const Loader = (props) => {
	return (
		<div className="preloader">
			<div className="status">
				<div className="bouncing-loader">
					<div className="cf"></div>
					<div className="cs"></div>
					<div className="ct"></div>
				</div>
			</div>
		</div>
	);
};

export default Loader;
