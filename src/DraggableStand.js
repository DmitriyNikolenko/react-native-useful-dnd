import React from 'react'
import { Modal, } from 'react-native'
import PropTypes from 'prop-types'

const handleRequestClose = () => null

export default function DraggableStand({ hidden, children, }) {
	return hidden ? null : (
		<Modal
			transparent
			visible={!hidden}
			onRequestClose={handleRequestClose}
		>
			{children}
		</Modal>
	)
}

DraggableStand.propTypes = {
	hidden: PropTypes.bool,
	children: PropTypes.node,
}