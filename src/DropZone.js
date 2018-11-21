import React from 'react'
import { View, } from 'react-native'
import PropTypes from 'prop-types'
import withDragContext from './withDragContext'
import { isFunction, } from './helpers'

class DropZone extends React.Component {
	static propTypes = {
		id: PropTypes.string.isRequired,
		children: PropTypes.oneOfType([ PropTypes.node, PropTypes.func ]),
		// From context
		dropOver: PropTypes.bool,
		registerDropZone: PropTypes.func.isRequired,
		unregisterDropZone: PropTypes.func.isRequired,
	}

	ref = React.createRef()

	componentDidMount = () => {
		const { registerDropZone, id, } = this.props
		registerDropZone(id, this.ref)
	}

	componentWillUnmount() {
		const { unregisterDropZone, id, } = this.props
		unregisterDropZone(id)
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
	componentType: withDragContext.componentTypes.DROPZONE,
})(DropZone)