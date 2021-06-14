import React from 'react';
import {IonItem, IonSpinner} from "@ionic/react";

const Loader: React.FC = () => {
    return (
        <IonItem>
            <IonSpinner />
        </IonItem>
    )
}

export default Loader;