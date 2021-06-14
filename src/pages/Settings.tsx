import React, {useRef, useState} from "react";
import {
    IonAlert,
    IonButton,
    IonButtons,
    IonCol,
    IonContent,
    IonGrid,
    IonHeader,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonMenuButton,
    IonPage,
    IonRow,
    IonTitle,
    IonToolbar,
    useIonModal
} from "@ionic/react";
import {City} from "../interfaces/Interfaces";

interface ModalProperties {
    city?: City
    save: (city: City) => void;
    handleDismiss: () => void;
    update: (name: string, updatedCity: City) => void;
}

const SettingModal: React.FC<ModalProperties> = ({ city, handleDismiss, save, update }:ModalProperties) => {
    const cityCodeRef = useRef<HTMLIonInputElement>(null);
    const cityNameRef = useRef<HTMLIonInputElement>(null);

    const handleSave = () => {
        const cityCode = cityCodeRef.current!.value as string;
        const cityName = cityNameRef.current!.value as string;

        if (!cityCode || !cityName) {
            // handle error
            console.log("error")
            handleDismiss();
            return;
        }
        save({
            code: cityCode,
            name: cityName
        });
        handleDismiss();
    }

    const handleUpdate = () => {
        const cityCode = cityCodeRef.current!.value as string;
        const cityName = cityNameRef.current!.value as string;

        if (!cityCode || !cityName) {
            // handle error
            console.log("error")
            handleDismiss();
            return;
        }
        update(city!.name, { code: cityCode, name: cityName });
        handleDismiss();
    }

    return  (
        <div>
            <IonToolbar>
                <IonTitle>
                    { city ? 'Edit city': 'Add city' }
                </IonTitle>
            </IonToolbar>
            <IonList>
                <IonItem>
                    <IonLabel position="stacked">Enter country code</IonLabel>
                    <IonInput
                        type="text"
                        value={city?.code}
                        ref={cityCodeRef}
                        required={true} />
                </IonItem>
                <IonItem>
                    <IonLabel position="stacked">Enter city</IonLabel>
                    <IonInput
                        type="text"
                        value={city?.name}
                        ref={cityNameRef}
                        required={true} />
                </IonItem>
            </IonList>
            <IonGrid>
                <IonRow>
                    <IonCol>
                        <IonButton
                            fill="solid"
                            color="success"
                            expand="block"
                            onClick={() => city ? handleUpdate() :  handleSave()}>
                            { city ? 'Update' : 'Save' }
                        </IonButton>
                    </IonCol>
                    <IonCol>
                        <IonButton
                            fill="solid"
                            color="danger"
                            expand="block"
                            onClick={() => handleDismiss()}>
                            Close
                        </IonButton>
                    </IonCol>
                </IonRow>
            </IonGrid>
        </div>
    )
}

interface SettingsProps {
    cities: City[],
    handleSaveCity: (c: City) => void;
    handleEditCity: (name: string, c: City) => void;
    handleDeleteCity: (name: string) => void;
}

const Settings: React.FC<SettingsProps> = ({cities, handleSaveCity, handleEditCity, handleDeleteCity}) => {
    const [selectedCity, setSelectedCity] = useState<City | undefined>(undefined);
    const [removeCity, setRemoveCity] = useState<string>();

    const handleDismiss = () => {
        dismiss();
        setSelectedCity(undefined);
    }

    const openEditModal = (city: City) => {
        setSelectedCity(city);
        present();
    }

    const [present, dismiss] = useIonModal(SettingModal, {
        city: selectedCity,
        save: handleSaveCity,
        update: handleEditCity,
        handleDismiss: handleDismiss
    })

    const handleDelete = async () => {
        if (removeCity) {
            await handleDeleteCity(removeCity);
            setRemoveCity('');
        }
    }

    const handleCancelDeleteCity = () => {
        setRemoveCity('');
    }

    return (
        <IonPage>
            <IonAlert isOpen={!!removeCity} message={"Are you sure?"} buttons={[
                {text: 'Okay', handler: handleDelete},
                {text: 'Cancel', handler: handleCancelDeleteCity}]}/>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle>Settings</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Settings</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonGrid>
                    <IonRow>
                        <IonCol>
                            <IonButton onClick={() => present()}
                                       expand="block"
                                       size="large"
                                       fill="outline"
                                       color="dark">
                                Add city
                            </IonButton>
                        </IonCol>
                    </IonRow>
                    <IonRow>
                        <IonCol>
                            <IonList>
                                {
                                    cities ? cities.map((city: City, idx: number) => {
                                        return (
                                            <IonItem lines="full" key={idx}>
                                                <IonLabel>{city.name}</IonLabel>
                                                <IonButtons slot="end">
                                                    <IonButton
                                                        onClick={() => openEditModal(city)}
                                                        fill="outline"
                                                        color="tertiary">Edit</IonButton>
                                                    <IonButton
                                                        onClick={() => setRemoveCity(city.name)}
                                                        fill="outline"
                                                        color="danger">
                                                        Delete
                                                    </IonButton>
                                                </IonButtons>
                                            </IonItem>
                                        )
                                    }) : (<></>)
                                }
                            </IonList>
                        </IonCol>
                    </IonRow>

                </IonGrid>
            </IonContent>
        </IonPage>
    )
};

export default Settings;