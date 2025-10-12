declare module 'leaflet.fullscreen' {
    import * as L from 'leaflet';

    export interface FullscreenOptions extends L.ControlOptions {
        title?: { false: string; true: string };
        forceSeparateButton?: boolean;
        pseudoFullscreen?: boolean;
    }

    export class Fullscreen extends L.Control {
        constructor(options?: FullscreenOptions);
    }

    declare module 'leaflet' {
        namespace Control {
            class Fullscreen extends L.Control {
                constructor(options?: FullscreenOptions);
            }
        }
    }

    export {};
}

declare module 'leaflet.fullscreen/Control.FullScreen.css';
