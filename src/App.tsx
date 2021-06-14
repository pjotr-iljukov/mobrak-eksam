import {
    IonApp,
    IonContent,
    IonHeader,
    IonPage,
    IonRouterOutlet,
    IonSplitPane,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import {IonReactRouter} from '@ionic/react-router';
import {Redirect, Route} from 'react-router-dom';
import Menu from './components/Menu';
import Settings from './pages/Settings';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import CastList from "./pages/CastList";
import SingleCastDetails from "./pages/SingleCastDetails";
import React, {useEffect, useState} from "react";
import {deleteCity, editCity, loadCities, saveCity} from "./hooks/useCities";
import {City, SingleCastItem} from "./interfaces/Interfaces";
import Loader from "./components/Loader";

const App: React.FC = () => {
  const [isSpinner, setSpinner] = useState<boolean>(true);
  const [cities, setCities] = useState<City[]>([]);
  const [casts, setCasts] = useState<SingleCastItem[]>([]);
  useEffect(() => {
    (async () => {
      const c = await loadCities();

      setCities(c);
    })();
  }, []);

  useEffect(() => {
      (async () => {
          setSpinner(true);
          const cs = await loadCasts(cities);
          setCasts(cs);
          setSpinner(false);
      })()
  }, [cities])

    const loadCasts = async (cities: City[]) => {
        console.log('loading casts')
        return  await Promise.all(cities.map(async c => {
            const resp = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${c.name},${c.code}&appid=13cba7909e06771a84b18ab719228380&units=metric`)
            const json = await resp.json();
            const cast: SingleCastItem = {
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
            return cast;
        }));
    }

    const handleSaveCity = async (city: City) => {
        const saved = await saveCity(city);
        setCities(saved);
    }

    const handleEditCity = async (name: string, city: City) => {
        const edited = await editCity(name, city);
        setCities(edited);
    }

    const handleDeleteCity = async (name: string) => {
        const deleted = await deleteCity(name);
        setCities(deleted);
    }

  if (isSpinner) {
      return (
          <IonPage>
              <IonHeader>
                  <IonToolbar>
                      <IonTitle>
                          Loading...
                      </IonTitle>
                  </IonToolbar>
              </IonHeader>
              <IonContent>
                  <Loader />
              </IonContent>
          </IonPage>
      )
  }

  return (
    <IonApp>
      <IonReactRouter>
        <IonSplitPane contentId="main">
          <Menu />
          <IonRouterOutlet id="main">
            <Route path="/" exact={true}>
              <Redirect to="/list" />
            </Route>
            <Route path="/list" exact={true}>
              <CastList casts={casts}/>
            </Route>
            <Route path="/settings" exact={true}>
              <Settings
                  cities={cities}
                  handleSaveCity={handleSaveCity}
                  handleEditCity={handleEditCity}
                  handleDeleteCity={handleDeleteCity}/>
            </Route>
            <Route path={"/details/:city"}>
              <SingleCastDetails />
            </Route>
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
