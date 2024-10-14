import React from 'react';
import './ProgressStatus.scss';
import DividedProgressBar from '../DividedProgressBar/DividedProgressBar';

const ProgressStatus = (args) => {
    const finalClassName = 'progress-status ' + (args.className || '')
    return (
        <div className={finalClassName}>
            <div className='progress-status__pair'>
                <p className='progress-status__name'>{args.name}</p>
                <p className='progress-status__status'>{args.status}</p>
            </div>
            <DividedProgressBar className='progress-status__bar' percentage={args.percentage} divisions={args.divisions}/>
        </div>
    );
};

export default ProgressStatus;
