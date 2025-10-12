import React, { useState } from 'react';
import Button from '~/components/ui/Button';
import type { Satellite } from '~/types/api';

interface SatelliteInfoCardProps {
    satellite: Satellite | null;
    isLoading: boolean;
    onEdit: (satellite: Satellite) => void;
}

const SatelliteInfoCard: React.FC<SatelliteInfoCardProps> = ({
    satellite,
    isLoading,
    onEdit,
}) => {
    const [copied, setCopied] = useState(false);

    if (isLoading)
        return (
            <div className='bg-dark-800 rounded-lg border border-dark-700 p-6 text-dark-400'>
                Cargando datos del satélite...
            </div>
        );

    if (!satellite)
        return (
            <div className='bg-dark-800 rounded-lg border border-dark-700 p-6 text-dark-400'>
                No hay datos de satélite disponibles.
            </div>
        );

    const { name, id, status, position, tle, lastContact } = satellite;

    const statusColor =
        status === 'active'
            ? 'text-green-400'
            : status === 'inactive'
            ? 'text-yellow-400'
            : 'text-red-400';

    const statusDot =
        status === 'active'
            ? 'bg-green-500'
            : status === 'inactive'
            ? 'bg-yellow-500'
            : 'bg-red-500';

    const handleCopyTLE = async () => {
        if (!tle) return;
        const tleText = `${tle.line1}\n${tle.line2}`;
        await navigator.clipboard.writeText(tleText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className='bg-dark-900 rounded-xl border border-dark-700 p-5 shadow-md'>
            {/* Header */}
            <div className='flex justify-between items-start mb-5'>
                <div>
                    <h2 className='text-lg font-semibold text-white tracking-wide'>
                        {name}
                    </h2>
                    <p className='text-dark-400 text-sm font-mono'>{id}</p>
                </div>

                <Button
                    onClick={() => onEdit(satellite)}
                    size='sm'
                    variant='ghost'
                    iconOnly
                    className='text-dark-400 hover:text-white'
                    iconLeft={
                        <svg
                            className='h-4 w-4'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                            xmlns='http://www.w3.org/2000/svg'
                        >
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth='2'
                                d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z'
                            />
                        </svg>
                    }
                />
            </div>

            {/* Status */}
            <div
                className={`border-l-4 pl-3 mb-5 ${
                    status === 'active'
                        ? 'border-green-500'
                        : status === 'inactive'
                        ? 'border-yellow-500'
                        : 'border-red-500'
                }`}
            >
                <div className={`flex items-center gap-2 ${statusColor}`}>
                    <div className={`w-2.5 h-2.5 rounded-full ${statusDot}`} />
                    <span className='font-medium capitalize'>
                        {status === 'active'
                            ? 'Activo'
                            : status === 'inactive'
                            ? 'Inactivo'
                            : 'Error'}
                    </span>
                </div>
            </div>

            {/* Position and telemetry */}
            <section className='mb-6'>
                <h3 className='text-[11px] uppercase tracking-widest text-dark-400 mb-3'>
                    Posición
                </h3>
                <div className='grid grid-cols-2 gap-y-3'>
                    <InfoItem
                        label='Latitud'
                        value={`${position?.latitude?.toFixed(4) ?? '--'}°`}
                    />
                    <InfoItem
                        label='Longitud'
                        value={`${position?.longitude?.toFixed(4) ?? '--'}°`}
                    />
                    <InfoItem
                        label='Altitud'
                        value={`${position?.altitude ?? '--'} km`}
                    />
                    <InfoItem
                        label='Velocidad'
                        value='7.8 km/s'
                    />
                </div>
            </section>

            {/* Last contact */}
            <div className='border-t border-dark-700 pt-3 text-dark-400 text-sm'>
                Último contacto:{' '}
                <span className='text-dark-300'>
                    {lastContact?.toLocaleString() ?? 'No disponible'}
                </span>
            </div>

            {/* TLE section */}
            {tle && (
                <section className='mt-6'>
                    <h3 className='text-[11px] uppercase tracking-widest text-dark-400 mb-2'>
                        TLE (Two-Line Elements)
                    </h3>

                    <div className='relative group'>
                        {/* TLE text box */}
                        <div className='bg-dark-800 rounded-md p-3 font-mono text-[11px] text-dark-300 leading-relaxed border border-dark-700/50 whitespace-nowrap overflow-x-auto scrollbar-hide'>
                            <div className='mb-1'>{tle.line1}</div>
                            <div>{tle.line2}</div>
                        </div>

                        {/* Copy button */}
                        <div className='absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150'>
                            <Button
                                size='sm'
                                variant='secondary'
                                iconOnly
                                onClick={handleCopyTLE}
                                className={`${
                                    copied
                                        ? 'text-green-400 hover:text-green-300'
                                        : 'text-dark-400 hover:text-white'
                                }`}
                                iconLeft={
                                    copied ? (
                                        <svg
                                            className='h-4 w-4'
                                            fill='none'
                                            stroke='currentColor'
                                            strokeWidth='2'
                                            viewBox='0 0 24 24'
                                        >
                                            <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                d='M5 13l4 4L19 7'
                                            />
                                        </svg>
                                    ) : (
                                        <svg
                                            className='h-4 w-4'
                                            fill='none'
                                            stroke='currentColor'
                                            strokeWidth='2'
                                            viewBox='0 0 24 24'
                                        >
                                            <rect
                                                x='9'
                                                y='9'
                                                width='13'
                                                height='13'
                                                rx='2'
                                                ry='2'
                                            />
                                            <path d='M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1' />
                                        </svg>
                                    )
                                }
                            />
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};

// Subcomponent for small label/value pairs
const InfoItem = ({
    label,
    value,
}: {
    label: string;
    value?: string | number | null;
}) => (
    <div>
        <div className='text-dark-400 text-sm'>{label}</div>
        <div className='text-white font-medium text-sm'>{value ?? '—'}</div>
    </div>
);

export default SatelliteInfoCard;
