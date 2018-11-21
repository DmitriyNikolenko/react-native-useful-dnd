# Contents
* [About](#about)
* [Demo](#demo)
* [Installation](#installation)
* [Usage](#usage)
* [License](#license)
* [Changelog](#changelog)

# About
Drag&Drop functionality for React Native. Uses new React Context API. 

# Demo

![dnd](/demo/dnd.gif "D&D")

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
- DragProvider - provider of drag&drop functionality. Must be higher in the React-tree than Draggable and DropZone components.
- DragProvider.Draggable - draggable wrapper. Required unique id prop.
- DragProvider.DropZone - drop zone wrapper. Required unique id prop.

## DragProvider props
| prop            | description                             | default                 | type       |
|-----------------|-----------------------------------------|-------------------------|------------|
| children        | Children node                           | undefined               | React.Node |
| onDragStart     | Start drag callback                     | undefined               | Function   |
| onDragMove      | Move Draggable callback                 | undefined               | Function   |
| onDragEnter     | Enter Draggable to DropZone callback    | undefined               | Function   |
| onDragLeave     | Leave Draggable to DropZone callback    | undefined               | Function   |
| onDragEnd       | End of drag callback                    | undefined               | Function   |
| onDrop          | End of drag over DropZone callback      | undefined               | Function   |

## DragProvider.Draggable props
| prop            | description                             | default                 | type                  |
|-----------------|-----------------------------------------|-------------------------|-----------------------|
| id              | Unique id of Draggable component        | undefined (required)    | string                |
| children        | Draggable component                     | undefined               | React.Node/Function   |

## DragProvider.Draggable passing to children props
| prop            | description                                   | default             | type                  |
|-----------------|-----------------------------------------------|---------------------|-----------------------|
| active          | True when component drag                      | false               | boolean               |
| allowDrop       | True when Draggable component over DropZone   | false               | boolean               |

## DragProvider.DropZone props
| prop            | description                             | default                 | type                  |
|-----------------|-----------------------------------------|-------------------------|-----------------------|
| id              | Unique id of DropZone component         | undefined (required)    | string                |
| children        | DropZone component                      | undefined               | React.Node/Function   |

## DragProvider.Draggable passing to children props
| prop            | description                                   | default             | type                  |
|-----------------|-----------------------------------------------|---------------------|-----------------------|
| dropOver        | True when DropZone component under Draggable  | false               | boolean               |

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
	handleDrop = (DropZoneId, draggableId) => console.log('onDrop', DropZoneId, draggableId)

	handleDragStart = (draggableId) => console.log('handleDragStart', draggableId)

	handleDragMove = (draggableId) => console.log('handleDragMove', draggableId)

	handleDragEnter = (draggableId, DropZoneId) => console.log('handleDragEnter', draggableId, DropZoneId)

	handleDragLeave = (draggableId, DropZoneId) => console.log('handleDragLeave', draggableId, DropZoneId)

	handleDrop = (draggableId, DropZoneId) => console.log('handleDrop', draggableId, DropZoneId)

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

				<DragProvider.DropZone id="myDropZone">
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
				</DragProvider.DropZone>

			</DragProvider>
		)
	}
}
```
# License

MIT

# Changelog
- *0.1.2* - fix call onDragMove after onDragEnd.
- *0.1.1* - fix bug, add demo gif, add peerDependencies.
- *0.1.0* - package created.