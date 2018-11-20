import React from 'react'
import DragContext from './DragContext'

const componentTypes = Object.freeze({
	DRAGGABLE: 'Draggable',
	DROPPABLE: 'Droppable',
})

const selectFavoriteDragState = {
	[componentTypes.DRAGGABLE]: (componentId, dragState) => {
		const active = componentId === dragState.activeDraggableId
		const allowDrop = active && !!dragState.activeDroppableId

		return { active, allowDrop, }
	},
	[componentTypes.DROPPABLE]: (componentId, dragState) => {
		return ({
			dropOver: componentId === dragState.activeDroppableId,
		})
	},
}

export default function withDragContext({ componentType, }) {
	return WrappedComponent =>
		(props) => (
			<DragContext.Consumer>
				{({ dragHandlers, dragState, }) => {
					const favoriteDragState = selectFavoriteDragState[componentType].(props.id, dragState) || {}

					return (
						<WrappedComponent {...props} {...dragHandlers} {...favoriteDragState} />
					)
				}}
			</DragContext.Consumer>
		)
}

withDragContext.componentTypes = componentTypes