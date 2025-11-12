import { type NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/router';
import SatellitesLayout from '~/components/SatellitesLayout';
import { api } from '~/utils/api';
import { Button } from '~/components/ui/Button';

interface Command {
    id: string;
    command: string;
    status: 'received' | 'pending' | 'failed';
    timestamp: string;
}

const SatellitesCommands: NextPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const satelliteId = id as string;

    // Fetch satellite data
    const { data: selectedSatData } = api.satellite.getSatelliteById.useQuery(
        { id: satelliteId },
        { enabled: !!satelliteId }
    );

    const [selectedCommand, setSelectedCommand] = useState('');
    const [commandHistory] = useState<Command[]>([
        {
            id: '1',
            command: 'REBOOT',
            status: 'received',
            timestamp: '2024-01-02 14:30:02',
        },
        {
            id: '2',
            command: 'STATUS_CHECK',
            status: 'received',
            timestamp: '2024-01-02 14:29:18',
        },
        {
            id: '3',
            command: 'SIGNAL_ADJUST_POWER',
            status: 'failed',
            timestamp: '2024-01-02 14:28:42',
        },
        {
            id: '4',
            command: 'REBOOT',
            status: 'received',
            timestamp: '2024-01-02 14:28:02',
        },
        {
            id: '5',
            command: 'STATUS_CHECK',
            status: 'pending',
            timestamp: '2024-01-02 14:27:46',
        },
    ]);

    const sendCommandMutation = api.satellite.sendCommand.useMutation();
    const { data: availableCommands, isLoading: commandsLoading } =
        api.satellite.getAvailableCommands.useQuery();

    const handleSendCommand = async () => {
        if (!selectedCommand.trim()) return;

        try {
            await sendCommandMutation.mutateAsync({
                number: Math.floor(Math.random() * 1000),
                message: selectedCommand,
            });

            // Clear the selection after successful send
            setSelectedCommand('');
        } catch (error) {
            console.error('Failed to send command:', error);
        }
    };

    return (
        <>
            <Head>
                <title>{selectedSatData?.name || 'Satellite'} - Command</title>
                <meta
                    name='description'
                    content='Satellite command center'
                />
            </Head>
            <SatellitesLayout>
                <div className='py-6'>
                    <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
                        <h1 className='text-3xl font-bold text-white'>
                            Command
                        </h1>
                    </div>

                    <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8'>
                        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8'>
                            {/* Command Center */}
                            <div className='lg:col-span-1 space-y-6'>
                                {/* Send Command */}
                                <div className='bg-[#141B23] rounded-lg border border-[#13181D] p-4 sm:p-6'>
                                    <h2 className='text-lg font-semibold text-white mb-4'>
                                        Send Command
                                    </h2>

                                    <div className='mb-4'>
                                        <label className='block text-sm font-medium text-gray-300 mb-2'>
                                            Select Command
                                        </label>
                                        <select
                                            value={selectedCommand}
                                            onChange={(e) =>
                                                setSelectedCommand(
                                                    e.target.value
                                                )
                                            }
                                            disabled={commandsLoading}
                                            className='w-full bg-[#0b0f14] border border-[#13181D] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#11435D] disabled:opacity-50'
                                        >
                                            <option value=''>
                                                {commandsLoading
                                                    ? 'Loading commands...'
                                                    : 'Choose a command...'}
                                            </option>
                                            {availableCommands?.map(
                                                (command) => (
                                                    <option
                                                        key={command.id}
                                                        value={command.id}
                                                    >
                                                        {command.name} -{' '}
                                                        {command.description}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </div>

                                    {/* Command Details */}
                                    {selectedCommand && availableCommands && (
                                        <div className='mb-4 p-3 bg-[#0B0F14] rounded-md border border-[#13181D]'>
                                            {(() => {
                                                const command =
                                                    availableCommands.find(
                                                        (cmd) =>
                                                            cmd.id ===
                                                            selectedCommand
                                                    );
                                                if (!command) return null;
                                                return (
                                                    <div>
                                                        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2'>
                                                            <h4 className='font-medium text-white'>
                                                                {command.name}
                                                            </h4>
                                                            <span
                                                                className={`text-xs px-2 py-1 rounded-full w-fit ${
                                                                    command.category ===
                                                                    'system'
                                                                        ? 'bg-red-900/50 text-red-400'
                                                                        : command.category ===
                                                                          'telemetry'
                                                                        ? 'bg-blue-900/50 text-blue-400'
                                                                        : command.category ===
                                                                          'control'
                                                                        ? 'bg-yellow-900/50 text-yellow-400'
                                                                        : 'bg-purple-900/50 text-purple-400'
                                                                }`}
                                                            >
                                                                {
                                                                    command.category
                                                                }
                                                            </span>
                                                        </div>
                                                        <p className='text-sm text-gray-300 mb-2'>
                                                            {
                                                                command.description
                                                            }
                                                        </p>
                                                        {command.requiresConfirmation && (
                                                            <div className='flex items-center text-yellow-400 text-xs'>
                                                                <svg
                                                                    className='h-4 w-4 mr-1 flex-shrink-0'
                                                                    fill='currentColor'
                                                                    viewBox='0 0 20 20'
                                                                >
                                                                    <path
                                                                        fillRule='evenodd'
                                                                        d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
                                                                        clipRule='evenodd'
                                                                    />
                                                                </svg>
                                                                Requires
                                                                confirmation
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    )}

                                    <Button
                                        onClick={handleSendCommand}
                                        disabled={
                                            !selectedCommand ||
                                            sendCommandMutation.isLoading ||
                                            commandsLoading
                                        }
                                        variant='primary'
                                        fullWidth
                                        loading={sendCommandMutation.isLoading}
                                    >
                                        Send Command
                                    </Button>
                                </div>
                            </div>

                            {/* Command History */}
                            <div className='lg:col-span-2'>
                                <div className='bg-[#141B23] rounded-lg border border-[#13181D] p-4 sm:p-6'>
                                    <h2 className='text-lg font-semibold text-white mb-4'>
                                        Command History
                                    </h2>

                                    <div className='overflow-x-auto'>
                                        <table className='min-w-full divide-y divide-[#13181D]'>
                                            <thead>
                                                <tr>
                                                    <th className='px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap'>
                                                        Command
                                                    </th>
                                                    <th className='px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap'>
                                                        Status
                                                    </th>
                                                    <th className='px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap'>
                                                        Timestamp
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className='divide-y divide-[#13181D]'>
                                                {commandHistory.map(
                                                    (command) => (
                                                        <tr key={command.id}>
                                                            <td className='px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-white'>
                                                                {
                                                                    command.command
                                                                }
                                                            </td>
                                                            <td className='px-4 sm:px-6 py-4 whitespace-nowrap'>
                                                                <span
                                                                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                                        command.status ===
                                                                        'received'
                                                                            ? 'bg-green-900/50 text-green-400 border border-green-600'
                                                                            : command.status ===
                                                                              'failed'
                                                                            ? 'bg-red-900/50 text-red-400 border border-red-600'
                                                                            : 'bg-yellow-900/50 text-yellow-400 border border-yellow-600'
                                                                    }`}
                                                                >
                                                                    {
                                                                        command.status
                                                                    }
                                                                </span>
                                                            </td>
                                                            <td className='px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
                                                                {
                                                                    command.timestamp
                                                                }
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </SatellitesLayout>
        </>
    );
};

export default SatellitesCommands;
