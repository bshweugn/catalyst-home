import React from 'react';
import { useDragLayer } from 'react-dnd';
import ItemCard from '../ItemCard/ItemCard';

const CustomDragLayer = () => {
    const { itemType, isDragging, item, currentOffset } = useDragLayer((monitor) => ({
        item: monitor.getItem(),
        itemType: monitor.getItemType(),
        currentOffset: monitor.getSourceClientOffset(),
        isDragging: monitor.isDragging(),
    }));

    if (!isDragging || !currentOffset) {
        return null;
    }

    const layerStyles = {
        position: 'fixed',
        pointerEvents: 'none',
        top: 0,
        left: 0,
        transform: `translate(${currentOffset.x}px, ${currentOffset.y}px)`,
        zIndex: 100,
    };

    return (
        <div style={layerStyles}>
            <div style={{ transform: 'scale(1)', opacity: 1 }}> {/* Устанавливаем масштаб 1 и полную непрозрачность */}
                <ItemCard device={item.device} editMode={true} /> {/* Используем вашу карточку */}
            </div>
        </div>
    );
};

export default CustomDragLayer;
