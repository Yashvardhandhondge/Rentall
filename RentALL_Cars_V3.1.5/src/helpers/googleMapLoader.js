import { Loader } from '@googlemaps/js-api-loader';
import { googleMapAPI } from '../config';

export const googleMapLoader = async (name) => {
    const loader = new Loader({
        apiKey: googleMapAPI,
        libraries: [name],
    });
    try {
        await loader.importLibrary(name);
    } catch (error) {
        console.error(error);
    }
}