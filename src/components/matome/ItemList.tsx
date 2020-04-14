import React from 'react';
import { THagetterItem } from '../../stores/hagetterItem';
import { observer } from 'mobx-react-lite';
import Item from './Item';

// TODO: make draggable
const ItemList: React.FC<{ items: THagetterItem[], onSelect: (item: THagetterItem) => boolean }> = observer(({ items, onSelect }) => {
  /*const [list, setList] = React.useState<HagetterItem[]>(items);

  const onSortEnd = ({ oldIndex, newIndex }: any) => {
    setList(arrayMove(items, oldIndex, newIndex));
  };

  return <SortableList onSelect={onSelect} items={items} onSortEnd={onSortEnd} />;*/

  return (<div>
    {
      items.map((value, index) => (
        <Item key={value.id} onClick={onSelect} item={value}/>
      ))
    }
  </div>);

  /*
    const handleMouseDown = () => {
      // TODO: normally this action should be called in `onBeforeDragStart`,
      // but there is a known unresolved issue on github:
      // https://github.com/atlassian/react-beautiful-dnd/issues/930
      //setDraggedGroup(true);
    };

    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >{list.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onmousedown={(...args: any[]) => {
                      handleMouseDown();
                      (provided as any).dragHandleProps.onMouseDown(...args);
                    }}
                    style={getItemStyle(
                      snapshot.isDragging,
                      provided.draggableProps.style
                    )}
                  >
                    {item.type === 'status' && <Toot status={item.data} />}
                    {item.type === 'text' && <div>{item.data.text}</div>}
                  </div>
                )}
              </Draggable>))}
              {provided.placeholder}
            </div>)}
        </Droppable>
      </DragDropContext >
    )*/
});

export default ItemList;