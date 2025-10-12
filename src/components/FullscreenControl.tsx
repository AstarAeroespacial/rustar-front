import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

const FullscreenControl: React.FC = () => {
    const map = useMap();

    useEffect(() => {
        let styleEl: HTMLStyleElement | null = null;

        const setup = async () => {
            try {
                if (typeof window === 'undefined') return;
                await import('leaflet.fullscreen');
                try {
                    await import('leaflet.fullscreen/Control.FullScreen.css');
                } catch {
                    // CSS import may fail in some bundlers; safe to ignore
                }

                // Inject minimal styling for visibility
                styleEl = document.createElement('style');
                styleEl.innerHTML = `
                  .leaflet-control-fullscreen-button {
                    background-color: white !important;
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='black' viewBox='0 0 20 20'%3E%3Cpath d='M3 3h6v2H5v4H3V3zm8 0h6v6h-2V5h-4V3zM3 11h2v4h4v2H3v-6zm12 0h2v6h-6v-2h4v-4z'/%3E%3C/svg%3E") !important;
                    background-size: 60% auto !important;
                    background-repeat: no-repeat !important;
                    background-position: center !important;
                    border: 1px solid #ccc !important;
                    width: 36px !important;
                    height: 36px !important;
                    border-radius: 6px !important;
                    margin-top: 6px !important;
                    margin-right: 6px !important;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.3) !important;
                    cursor: pointer !important;
                    z-index: 9999 !important;
                  }
                `;
                document.head.appendChild(styleEl);

                // Add plugin control if available
                if (
                    !(map as any)._fullscreenControl &&
                    (L.Control as any).Fullscreen
                ) {
                    const control = new (L.Control as any).Fullscreen({
                        position: 'topright',
                        title: {
                            false: 'Pantalla completa',
                            true: 'Salir de pantalla completa',
                        },
                        forceSeparateButton: true,
                    });
                    map.addControl(control);
                    (map as any)._fullscreenControl = control;
                    return;
                }
            } catch {
                // fall through to custom control
            }

            // Fallback: simple custom fullscreen button
            if (!document.querySelector('.custom-fullscreen-btn')) {
                const button = new (L.Control as any)({ position: 'topright' });
                (button as any).onAdd = () => {
                    const div = L.DomUtil.create(
                        'div',
                        'custom-fullscreen-btn leaflet-bar'
                    );
                    div.innerHTML = '⛶';
                    div.style.background = 'white';
                    div.style.color = 'black';
                    div.style.fontSize = '22px';
                    div.style.textAlign = 'center';
                    div.style.cursor = 'pointer';
                    div.style.width = '34px';
                    div.style.height = '34px';
                    div.style.lineHeight = '34px';
                    div.style.borderRadius = '6px';
                    div.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
                    (div as HTMLDivElement).title = 'Pantalla completa';

                    div.onclick = () => {
                        const container = map.getContainer();
                        if (!document.fullscreenElement) {
                            container.requestFullscreen();
                        } else {
                            document.exitFullscreen();
                        }
                    };
                    return div;
                };
                (button as any).addTo(map);
            }
        };

        setup();

        return () => {
            if (styleEl && styleEl.parentNode)
                styleEl.parentNode.removeChild(styleEl);
        };
    }, [map]);

    return null;
};

export default FullscreenControl;
