import React from 'react'
import PropTypes from 'prop-types'
import DragContext from './DragContext'
import Draggable from './Draggable'
import Droppable from './Droppable'
import { findAsync, getMeasureFromRef, isBetween, throttle, } from './helpers'

export default class DragProvider extends React.Component {
	static Draggable = Draggable

	static Droppable = Droppable

	static propTypes = {
		children: PropTypes.node,
		// drag callbacks
		onDragStart: PropTypes.func,
		onDragMove: PropTypes.func,
		onDragEnter: PropTypes.func,
		onDragLeave: PropTypes.func,
		onDragEnd: PropTypes.func,
		onDrop: PropTypes.func,
	}

	state = {
		activeDroppableId: undefined,
		activeDraggableId: undefined,
	}

	droppableRefs = []

	get contextValue() {
		return {
			dragState: this.state,
			dragHandlers: {
				callDragStart: this.handleDragStart,
				callDragMove: this.handleDragMove,
				callDrop: this.handleDragEnd,
				registerDroppable: this.registerDroppable,
				unregisterDroppable: this.unregisterDroppable,
			},
		}
	}

	// Draggable handlers.

	handleDragStart = (activeDraggableId) => {
		this.setState({ activeDraggableId })
		this.props.onDragStart && this.props.onDragStart(activeDraggableId)
	}

	onDragMoveThrottled = throttle(this.props.onDragMove, 100)

	handleDragMove = async (nativeEvent) => {
		const { pageX: draggableX, pageY: draggableY, } = nativeEvent

		const activeDroppableId = await findAsync(this.droppableRefs, async ({ id, ref, }) => {
			const { pageX, pageY, height, width, } = await getMeasureFromRef(ref)

			if (isBetween(draggableX, pageX, pageX + width) && isBetween(draggableY, pageY, pageY + height))
				return id
		})

		this.setState(state => {
			if (state.activeDroppableId === activeDroppableId)
				return null
			else {
				if (state.activeDroppableId)
					this.props.onDragLeave && this.props.onDragLeave(state.activeDraggableId, state.activeDroppableId)

				if (activeDroppableId)
					this.props.onDragEnter && this.props.onDragEnter(state.activeDraggableId, activeDroppableId)

				return { activeDroppableId, }
			}
		})
		this.props.onDragMove && this.onDragMoveThrottled(this.state.activeDraggableId, { x: draggableX, y: draggableY, })
	}

	handleDragEnd = () => {
		const { activeDroppableId, activeDraggableId, } = this.state
		this.setState({ activeDroppableId: undefined, activeDraggableId: undefined, })

		this.props.onDragEnd && this.props.onDragEnd(activeDraggableId)
		if (activeDroppableId)
			return this.props.onDrop && this.props.onDrop(activeDraggableId, activeDroppableId)
		else
			return false
	}

	// Droppable handlers.

	registerDroppable = (id, ref) => {
		this.droppableRefs.push({ id, ref, })
	}

	unregisterDroppable = (droppableId) => {
		this.droppableRefs = this.droppableRefs.filter(droppable => droppable.id !== droppableId)
	}

	// Render method.

	render() {
		return (
			<DragContext.Provider value={this.contextValue}>
				{this.props.children}
			</DragContext.Provider>
		)
	}
}