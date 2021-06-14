import {City} from "../interfaces/Interfaces";
import {Directory, Encoding, Filesystem} from "@capacitor/filesystem";

export function saveCity(city: City) {
    const save = async (): Promise<City[]> => {
        const existing  = await loadCities();
        const isAlreadySaved = existing.filter(c => c.name === city.name).length > 0;
        if (isAlreadySaved) {
            return existing;
        }
        const newData = [city, ...existing];
        await Filesystem.writeFile({
            path: "countries.json",
            data: JSON.stringify(newData),
            directory: Directory.Documents,
            encoding: Encoding.UTF8
        });
        return newData;
    }
    return save();
}

export function editCity(name: string, updatedCity: City) {
    const edit = async () => {
        const loaded = await loadCities();
        for (let i = 0, l = loaded.length; i < l; i++) {
            if (loaded[i].name === name) {
                loaded[i] = updatedCity;
                await Filesystem.deleteFile({
                    path: "countries.json",
                    directory: Directory.Documents
                });

                await Filesystem.writeFile({
                    path: "countries.json",
                    data: JSON.stringify(loaded),
                    directory: Directory.Documents,
                    encoding: Encoding.UTF8
                });
                break;
            }
        }
        return loaded;
    }
    return edit();
}

export function loadCities() {
    const load = async (): Promise<City[]> => {
        try {
            const content = await Filesystem.readFile({
                path: "countries.json",
                directory: Directory.Documents,
                encoding: Encoding.UTF8
            });
            return  content ? JSON.parse(content.data) as City[] : [];
        } catch (e) {
            return Promise.resolve([]);
        }
    }
    return load();
}

export function deleteCity(name: string) {
    const remove = async () => {
        const loaded = await loadCities();
        const updated = loaded
            .filter(c => c.name !== name);
        if (loaded.length > updated.length) {
            await Filesystem.writeFile({
                path: "countries.json",
                data: JSON.stringify(updated),
                directory: Directory.Documents,
                encoding: Encoding.UTF8
            });
            return updated;
        }
        return loaded;
    }
    return remove();
}