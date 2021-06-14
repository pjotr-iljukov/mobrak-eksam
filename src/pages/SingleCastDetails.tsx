import React, {useEffect, useState} from "react";
import {
    IonButtons,
    IonBackButton,
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar, IonGrid, IonCol, IonRow, IonCard, IonCardTitle, IonCardSubtitle, IonCardHeader, IonCardContent, IonLabel
} from "@ionic/react";
import {useParams} from "react-router";
import {SingleCastItem} from "../interfaces/Interfaces";

const CastItem: React.FC<{ propertyName: string, propertyValue: string | number}> = ({propertyName, propertyValue}) => (
    <IonRow>
        <IonCol>
            {propertyName}
        </IonCol>
        <IonCol>
            {propertyValue}
        </IonCol>
    </IonRow>
);

const SingleCastDetails: React.FC = () => {
    const [isLoading, setLoading] = useState<boolean>(true);
    const [item, setItem] = useState<SingleCastItem>();
    const { city } = useParams<{ city: string; }>();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const i = await fetchItem();
        setItem(i);
        setLoading(false);
    }

    const fetchItem = async () => {
        const resp = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=13cba7909e06771a84b18ab719228380&units=metric`)
        const json = await resp.json();
        return  {
            city: json.name,
            country: json.sys.country,
            temperature: json.main.temp,
            description: json.weather[0].description,
            feelsLike: json.main.feels_like,
            humidity: json.main.humidity,
            pressure: json.main.pressure,
            wind: json.wind.speed,
            visibility: json.visibility,
            sunrise: json.sys.sunrise,
            sunset: json.sys.sunset
        }
    }

    // unixtime * 1000 <- today
    const formatDate = (date: Date): string => {
        const hours: string = date.getHours() < 10 ? "0" + date.getHours() : String(date.getHours());
        const minutes: string = date.getMinutes() < 10 ? "0" + date.getMinutes() : String(date.getMinutes());
        const seconds: string = date.getSeconds() < 10 ? "0" + date.getSeconds() + "." + date.getMilliseconds() : date.getSeconds() + "." + date.getMilliseconds();
        return `${hours}:${minutes}:${seconds}`
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton />
                    </IonButtons>
                    <IonTitle>Details</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen>
                {
                    isLoading ? (
                        <IonLabel>Loading, please wait</IonLabel>
                    ) : (
                        <IonCard>
                            <IonCardHeader>
                                <IonCardSubtitle>{formatDate(new Date())}</IonCardSubtitle>
                                <IonCardTitle>{item!.city}, {item!.country}</IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent>
                                <IonGrid>
                                    <CastItem propertyName={"Temperature: "} propertyValue={item!.temperature + " °C"} />
                                    <CastItem propertyName={"Feels like: "} propertyValue={item!.feelsLike + " °C"} />
                                    <CastItem propertyName={"Humidity: "} propertyValue={item!.humidity + " %"} />
                                    <CastItem propertyName={"Pressure: "} propertyValue={item!.pressure + " hPa"} />
                                    <CastItem propertyName={"Wind: "} propertyValue={item!.wind + " m/s"} />
                                    <CastItem propertyName={"Visibility: "} propertyValue={item!.visibility + " km"} />
                                    <CastItem propertyName={"Sunrise: "} propertyValue={formatDate(new Date(item!.sunrise * 1000))} />
                                    <CastItem propertyName={"Sunset: "} propertyValue={formatDate(new Date(item!.sunset * 1000))} />
                                </IonGrid>
                            </IonCardContent>
                        </IonCard>
                    )
                }

            </IonContent>
        </IonPage>
    )
};

export default SingleCastDetails;