import React from 'react'
import { View, } from 'react-native'
import PropTypes from 'prop-types'
import withDragContext from './withDragContext'
import { isFunction, } from './helpers'

class Droppable extends React.Component {
	static propTypes = {
		id: PropTypes.string.isRequired,
		children: PropTypes.oneOfType([ PropTypes.node, PropTypes.func ]),
		// From context
		dropOver: PropTypes.bool,
		registerDroppable: PropTypes.func.isRequired,
		unregisterDroppable: PropTypes.func.isRequired,
	}

	ref = React.createRef()

	componentDidMount = () => {
		const { registerDroppable, id, } = this.props
		registerDroppable(id, this.ref)
	}

	componentWillUnmount() {
		const { unregisterDroppable, id, } = this.props
		unregisterDroppable(id)
	}

	// Render methods.

	get childrenProps() {
		return { dropOver: this.props.dropOver, }
	}

	renderChildren() {
		const { children, } = this.props

		return isFunction(children)
			? children(this.childrenProps)
			: React.cloneElement(children, this.childrenProps)
	}

	render() {
		return (
			<View
				{...this.props}
				collapsable={false}
				ref={this.ref}
			>
				{this.renderChildren()}
			</View>
		)
	}
}

export default withDragContext({
	componentType: withDragContext.componentTypes.DROPPABLE,
})(Droppable)