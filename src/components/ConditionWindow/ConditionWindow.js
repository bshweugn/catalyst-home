import React, { useEffect } from 'react';
import './ConditionWindow.scss';
import Close from '../icons/Close/Close';
import Description from '../Description/Description';
import Button from '../Button/Button';

const ConditionWindow = (args) => {
    const finalClassName = 'condition-window ' + (args.visible ? 'condition-window--visible ' : '') + (args.className || '')

    useEffect(() => {
        console.log("HAHA");
    }, [args.visible]);

    return (
        <div className={finalClassName}>
            <div className={`condition-window__window ${args.visible ? "condition-window__window--visible" : ""}`}>
                <div className='condition-window__header'>
                    <div className='condition-window__icon'>{args.icon}</div>
                    <p className='condition-window__name'>{args.name}</p>
                </div>
                <div className='popup__close-btn' onClick={() => { args.func(false); }}>
                    <Close size="0.6rem" fill={"gray"} />
                </div>
                <div className='condition-window__content'>
                    {args.children}
                    <Description bottomSeparated text={"Выберите состояние, определяющее условие выполнения автоматизации."} />
                    <Button primary inactive={!args.canSave} label="Сохранить" onClick={() => { args.func(false); }} />
                </div>
            </div>
        </div>
    );
};

export default ConditionWindow;
