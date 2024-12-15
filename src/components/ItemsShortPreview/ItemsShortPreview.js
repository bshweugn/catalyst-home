import React from "react";
import "./ItemsShortPreview.scss";
import { renderItemIcon } from '../../itemInfo';

const ItemsShortPreview = ({ devices, action, label }) => {
    const firstThreeDevices = Object.keys(devices).slice(0, 3);
    const remainingCount = Object.keys(devices).length - 3;

    return (
        <div className="items-short-preview">
            <p className='text-input__label'>{label}</p>
            <div className="items-short-preview__wrapper">
                <div className="items-short-preview__icons">
                    {firstThreeDevices.map((device, index) => (
                        <div key={index} className="items-short-preview__icon">
                            {renderItemIcon(devices[device], false)}
                        </div>
                    ))}
                    {remainingCount > 0 && (
                        <div className="items-short-preview__icon items-short-preview__icon--more">
                            +{remainingCount}
                        </div>
                    )}
                </div>
                {Object.keys(devices).length == 0 ? null :
                    <div className="items-short-preview__names">
                        {firstThreeDevices.map((device, index) => (
                            <span key={index} className="items-short-preview__name">
                                {devices[device].name}
                                {index < firstThreeDevices.length - 1 && ", "}
                                {index === firstThreeDevices.length - 2 && firstThreeDevices.length > 1 ? "" : ""}
                            </span>
                        ))}
                        {remainingCount > 0 && (
                            <span className="items-short-preview__name items-short-preview__name--more">
                                {" и ещё " + remainingCount} аксессуар{remainingCount > 1 ? "а" : ""}
                            </span>
                        )}
                    </div>
                }
                <div className={`items-short-preview__change-btn ${Object.keys(devices).length == 0 ? "items-short-preview__change-btn--full" : ""}`} onClick={() => action()}>
                    {Object.keys(devices).length == 0 ? "Выбрать аксессуары" : "Изменить выбор"}
                </div>
            </div>
        </div>
    );
};

export default ItemsShortPreview;
