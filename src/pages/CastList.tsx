import React from "react";
import {
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonItem,
    IonLabel,
    IonList,
    IonMenuButton,
    IonPage,
    IonTitle,
    IonToolbar
} from "@ionic/react";
import {SingleCastItem} from "../interfaces/Interfaces";

interface CastListProps {
    casts: SingleCastItem[]
}

const CastList: React.FC<CastListProps> = ({casts}) => {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle>
                        All weather casts
                    </IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">All weather casts</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonList>
                    {
                        casts.length > 0 ? casts.map((item: SingleCastItem, idx: number) => (
                            <IonItem key={idx}>
                                <IonLabel>
                                    <h2>{item.city}</h2>
                                    <h3>Temperature: <span>{item.temperature}</span>°C</h3>
                                    <p>{item.description}</p>
                                </IonLabel>
                                <IonButton routerLink={"/details/" + item.city}>
                                    Details
                                </IonButton>
                            </IonItem>
                        )) : (
                            <IonItem>
                                <IonLabel>No records</IonLabel>
                            </IonItem>
                        )
                    }
                </IonList>
            </IonContent>
        </IonPage>
    );
}

export default CastList;