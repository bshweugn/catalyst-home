// import React, { useState } from 'react';
// import { Container, Draggable } from 'react-smooth-dnd';
// import { Haptics, ImpactStyle } from '@capacitor/haptics';
// import { applyDrag } from './utils';
// import './DraggableList.scss';
// import Drag from '../icons/Drag/Drag';

// const DraggableList = ({ items, labelField, valueField, onDropComplete, label }) => {

//     const [dragItems, setDragItems] = useState(items);

//     const handleDrop = async (dropResult) => {
//         if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
//             const newItems = applyDrag([...items], dropResult);

//             console.log(newItems)

//             // onDropComplete(newItems);

//             await Haptics.impact({ style: ImpactStyle.Light });
//         }
//     };

//     return (
//         <div className='draggable-list'>
//             <p className='text-input__label'>{label}</p>
//             <div className='draggable-list__wrapper'>
//                 <Container
//                     dragHandleSelector=".draggable-list__drag"
//                     lockAxis="y" onDrop={e => setState({ items: applyDrag(items, e) })}
//                 >
//                     {items.map((item, index) => (
//                         <Draggable key={item[valueField]}>
//                             <div className="draggable-list__item">
//                                 <div className='draggable-list__border'/>
//                                 <Drag className='draggable-list__drag' size='1.4rem' color="white"/>
//                                 {item[labelField]} {/* Вывод подписи на основе labelField */}
//                             </div>
//                         </Draggable>
//                     ))}
//                 </Container>
//             </div>
//         </div>
//     );
// };

// export default DraggableList;

import './DraggableList.scss'


import React, { useState } from 'react';
import { Container, Draggable } from 'react-smooth-dnd';
import { applyDrag } from './utils';
import Drag from '../icons/Drag/Drag';

const LockAxis = (args) => {
    const [items, setItems] = useState(args.items);

    const handleDrop = (e) => {
        let newItems = applyDrag(items, e)
        setItems(newItems);
        args.onChange(newItems);
    };

    return (
        <div className='draggable-list'>
            <p className='text-input__label'>{args.label}</p>
            <div className='draggable-list__wrapper'>
                <Container lockAxis="y" onDrop={handleDrop}>
                    {items.map(p => (
                        <Draggable key={p.id}>
                            <div className="draggable-list__item">
                                <Drag className='draggable-list__drag' size='1.4rem' color="white" />
                                {p.name}
                            </div>
                        </Draggable>
                    ))}
                </Container>
            </div>
        </div>
    );
};

export default LockAxis;

