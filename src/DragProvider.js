import React from 'react'
import PropTypes from 'prop-types'
import DragContext from './DragContext'
import Draggable from './Draggable'
import DropZone from './DropZone'
import { findAsync, getMeasureFromRef, isBetween, throttle, } from './helpers'

export default class DragProvider extends React.Component {
	static Draggable = Draggable

	static DropZone = DropZone

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
		activeDropZoneId: undefined,
		activeDraggableId: undefined,
	}

	dropZoneRefs = []

	get contextValue() {
		return {
			dragState: this.state,
			dragHandlers: {
				callDragStart: this.handleDragStart,
				callDragMove: this.handleDragMove,
				callDrop: this.handleDragEnd,
				registerDropZone: this.registerDropZone,
				unregisterDropZone: this.unregisterDropZone,
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

		const activeDropZoneId = await findAsync(this.dropZoneRefs, async ({ id, ref, }) => {
			const { pageX, pageY, height, width, } = await getMeasureFromRef(ref)

			if (isBetween(draggableX, pageX, pageX + width) && isBetween(draggableY, pageY, pageY + height))
				return id
		})

		this.setState(state => {
			if (state.activeDraggableId) {
				this.props.onDragMove && this.onDragMoveThrottled(this.state.activeDraggableId, { x: draggableX, y: draggableY, })

				if (state.activeDropZoneId !== activeDropZoneId) {
					if (state.activeDropZoneId)
					this.props.onDragLeave && this.props.onDragLeave(state.activeDraggableId, state.activeDropZoneId)
					
					if (activeDropZoneId)
					this.props.onDragEnter && this.props.onDragEnter(state.activeDraggableId, activeDropZoneId)
					
					return { activeDropZoneId, }
				}
			} 
			return null
		})
	}

	handleDragEnd = () => {
		const { activeDropZoneId, activeDraggableId, } = this.state
		this.setState({ activeDropZoneId: undefined, activeDraggableId: undefined, })

		this.props.onDragEnd && this.props.onDragEnd(activeDraggableId)
		if (activeDropZoneId)
			return this.props.onDrop && this.props.onDrop(activeDraggableId, activeDropZoneId)
		else
			return false
	}

	// DropZone handlers.

	registerDropZone = (id, ref) => {
		this.dropZoneRefs.push({ id, ref, })
	}

	unregisterDropZone = (DropZoneId) => {
		this.dropZoneRefs = this.dropZoneRefs.filter(DropZone => DropZone.id !== DropZoneId)
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