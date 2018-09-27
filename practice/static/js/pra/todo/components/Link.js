import React from 'react';
import PropTypes from 'prop-types';

const Link = ({ active, children, onClick }) => (
    active ?
        (
            <span>
                {children}
            </span>
        )
        :
        (
            <a
                href='http://www.baidu.com'
                onClick={e => {
                    e.preventDefault();
                    onClick();
                }}
            >
                {children}
            </a>
        )
);

Link.propTypes = {
    active: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func.isRequired
};

export default Link;
