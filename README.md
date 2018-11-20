# Contents
* [About](#about)
* [Installation](#installation)
* [Usage](#usage)
* [License](#license)
* [Changelog](#changelog)

# About
Drag&Drop functionality for React Native. Uses new React Context API. 

# Installation

```
npm install react-native-useful-dnd
```
or 
```
yarn add react-native-useful-dnd
```

# Usage

## Import
```javascript
import DragProvider from 'react-native-useful-dnd'
```

## Components
- DragProvider - provider of drag&drop functionality. Must be higher in the React-tree than Draggable and Droppable components.
- DragProvider.Draggable - draggable wrapper. Required unique id prop.
- DragProvider.Droppable - drop zone wrapper. Required unique id prop.

## DragProvider props
| prop            | description                             | default                 | type       |
|-----------------|-----------------------------------------|-------------------------|------------|
| children        | Children node                           | undefined               | React.Node |
| onDragStart     | Start drag callback                     | undefined               | Function   |
| onDragMove      | Move Draggable callback                 | undefined               | Function   |
| onDragEnter     | Enter Draggable to Droppable callback   | undefined               | Function   |
| onDragLeave     | Leave Draggable to Droppable callback   | undefined               | Function   |
| onDragEnd       | End of drag callback                    | undefined               | Function   |
| onDrop          | End of drag over Droppable callback     | undefined               | Function   |

## DragProvider.Draggable props
| prop            | description                             | default                 | type                  |
|-----------------|-----------------------------------------|-------------------------|-----------------------|
| id              | Unique id of Draggable component        | undefined (required)    | string                |
| children        | Draggable component                     | undefined               | React.Node/Function   |

## DragProvider.Draggable passing to children props
| prop            | description                                   | default             | type                  |
|-----------------|-----------------------------------------------|---------------------|-----------------------|
| active          | True when component drag                      | false               | boolean               |
| allowDrop       | True when Draggable component over Droppable  | false               | boolean               |

## DragProvider.Droppable props
| prop            | description                             | default                 | type                  |
|-----------------|-----------------------------------------|-------------------------|-----------------------|
| id              | Unique id of Droppable component        | undefined (required)    | string                |
| children        | Droppable component                     | undefined               | React.Node/Function   |

## DragProvider.Draggable passing to children props
| prop            | description                                   | default             | type                  |
|-----------------|-----------------------------------------------|---------------------|-----------------------|
| dropOver        | True when Droppable component under Draggable | false               | boolean               |

## Example

```javascript
import React from 'react'
import { Text, View, StyleSheet, } from 'react-native'
import DragProvider from 'react-native-useful-dnd'

const dragItemStyles = StyleSheet.create({
	view: {
		width: 50,
		height: 50,
		borderRadius: 25,
		backgroundColor: '#FFD517',
		alignItems: 'center',
		justifyContent: 'center',
	},
	drag: {
		borderWidth: 1,
		borderColor: 'red',
	},
	dragOver: {
		borderWidth: 5,
		borderColor: 'olive',
	},
})

const DragItem = ({ style, color, drag, dragOver, ...props }) => (
	<View {...props} style={[ dragItemStyles.view, { backgroundColor: color, }, drag && dragItemStyles.drag, dragOver && dragItemStyles.dragOver, style ]}>
		<Text>DRAG_ME</ Text>
	</View>
)

export default class AboutUs extends React.Component {
	handleDrop = (droppableId, draggableId) => console.log('onDrop', droppableId, draggableId)

	handleDragStart = (draggableId) => console.log('handleDragStart', draggableId)

	handleDragMove = (draggableId) => console.log('handleDragMove', draggableId)

	handleDragEnter = (draggableId, droppableId) => console.log('handleDragEnter', draggableId, droppableId)

	handleDragLeave = (draggableId, droppableId) => console.log('handleDragLeave', draggableId, droppableId)

	handleDrop = (draggableId, droppableId) => console.log('handleDrop', draggableId, droppableId)

	handleDragEnd = (draggableId) => console.log('handleDragEnd', draggableId)

	render() {
		return (
			<DragProvider
				onDragStart={this.handleDragStart}
				onDragMove={this.handleDragMove}
				onDragEnter={this.handleDragEnter}
				onDragLeave={this.handleDragLeave}
				onDrop={this.handleDrop}
				onDragEnd={this.handleDragEnd}
			>
				<View style={{ height: 150, backgroundColor: '#eaeaea', }}>
					<DragProvider.Draggable
						id="purple"
					>
						{({ dragOver, drag, }) => (
							<DragItem color="purple" drag={drag} dragOver={dragOver} />
						)}
					</DragProvider.Draggable>

					<DragProvider.Draggable id="orange">
						<DragItem color="orange" />
					</DragProvider.Draggable>
				</View>

				<DragProvider.Droppable id="myDropZone">
					{({ dropOver, }) => (
						<View
							style={[
								{ height: 100, justifyContent: 'center', alignItems: 'center', backgroundColor: 'yellow', },
								dropOver && { backgroundColor: 'orange', }
							]}
						>
							<Text>Dropzone</Text>
						</View>
					)}
				</DragProvider.Droppable>

			</DragProvider>
		)
	}
}
```
# License

MIT

# Changelog

- *0.1.0* - package created.