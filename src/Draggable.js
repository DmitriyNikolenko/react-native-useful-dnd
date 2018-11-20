import React from 'react'
import PropTypes from 'prop-types'
import { Animated, PanResponder, StyleSheet, } from 'react-native'
import DraggableStand from './DraggableStand'
import withDragContext from './withDragContext'
import { isFunction, } from './helpers'

class Draggable extends React.PureComponent {
	static propTypes = {
		id: PropTypes.string.isRequired,
		children: PropTypes.oneOfType([ PropTypes.node, PropTypes.func ]),
		// From context
		active: PropTypes.bool,
		allowDrop: PropTypes.bool,
		callDragStart: PropTypes.func.isRequired,
		callDragMove: PropTypes.func.isRequired,
		callDrop: PropTypes.func.isRequired,
	}

	state = {
		pan: new Animated.ValueXY(),
		childrenOffset: { left: 0, top: 0, },
	}

	// PanResponder methods.

	handleStartShouldSetPanResponder = (event) => {
		const { id, callDragStart, } = this.props
		callDragStart(id)

		const { pageX, pageY, locationX, locationY, } = event.nativeEvent
		this.setState({
			childrenOffset: { left: pageX - locationX, top: pageY - locationY, },
		})

		return true
	}

	handlePanResponderGrant = () => {
		this.state.pan.setOffset({ x: this.state.pan.x._value, y: this.state.pan.y._value, })
	}

	handlePanResponderMove = (event) => {
		this.props.callDragMove(event.nativeEvent)
	}

	handlePanResponderRelease = () => {
		const { id, callDrop, } = this.props
		callDrop(id)
		this.rollbackMove()
	}

	panResponder = PanResponder.create({
		onStartShouldSetPanResponder: this.handleStartShouldSetPanResponder,
		onPanResponderGrant: this.handlePanResponderGrant,
		onPanResponderMove: Animated.event([ null, { dx: this.state.pan.x, dy: this.state.pan.y, }, ], {
			listener: this.handlePanResponderMove,
		}),
		onPanResponderRelease: this.handlePanResponderRelease,
		onPanResponderTerminate: this.handlePanResponderRelease,
	})

	// Animation methods.

	rollbackMove = (callback) =>
		Animated.spring(this.state.pan, { toValue: { x: 0, y: 0, }, }).start(callback && callback())

	// Render methods.

	get childrenProps() {
		return { dragOver: this.props.allowDrop, drag: this.props.active, }
	}

	renderChildren(hidden) {
		if (hidden)
			return null

		const { children, } = this.props

		return isFunction(children)
			? children(this.childrenProps)
			: React.cloneElement(children, this.childrenProps)
	}

	render() {
		const { active, } = this.props
		const { pan, childrenOffset, } = this.state

		return (
			<>
				<Animated.View {...this.panResponder.panHandlers} style={pan.getLayout()} >
					{this.renderChildren(active)}
				</Animated.View>

				{active ? (
					<DraggableStand>
						<Animated.View
							style={[ styles.dragActive, { ...childrenOffset, transform: pan.getTranslateTransform(), } ]}
						>
							{this.renderChildren()}
						</Animated.View>
					</DraggableStand>

				) : null }
			</>
		)
	}
}

export default withDragContext({
	componentType: withDragContext.componentTypes.DRAGGABLE,
})(Draggable)

const styles = StyleSheet.create({
	dragActive: {
		position: 'absolute',
	},
})