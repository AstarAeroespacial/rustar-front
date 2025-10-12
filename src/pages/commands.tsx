import { type NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import Layout from '~/components/Layout';
import { api } from '~/utils/api';

interface Command {
    id: string;
    command: string;
    status: 'received' | 'pending' | 'failed';
    timestamp: string;
}

const Commands: NextPage = () => {
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
                <title>Commands - Rustar</title>
                <meta
                    name='description'
                    content='Satellite command center'
                />
            </Head>
            <Layout>
                <div className='py-6'>
                    <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
                        <h1 className='text-3xl font-bold text-white'>
                            Command Center
                        </h1>
                    </div>

                    <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8'>
                        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                            {/* Command Center */}
                            <div className='lg:col-span-1 space-y-6'>
                                {/* Send Command */}
                                <div className='bg-dark-800 rounded-lg border border-dark-700 p-6'>
                                    <h2 className='text-lg font-semibold text-white mb-4'>
                                        Send Command
                                    </h2>

                                    <div className='mb-4'>
                                        <label className='block text-sm font-medium text-dark-300 mb-2'>
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
                                            className='w-full bg-dark-700 border border-dark-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50'
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
                                        <div className='mb-4 p-3 bg-dark-700 rounded-md border border-dark-600'>
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
                                                        <div className='flex items-center justify-between mb-2'>
                                                            <h4 className='font-medium text-white'>
                                                                {command.name}
                                                            </h4>
                                                            <span
                                                                className={`text-xs px-2 py-1 rounded-full ${
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
                                                        <p className='text-sm text-dark-300 mb-2'>
                                                            {
                                                                command.description
                                                            }
                                                        </p>
                                                        {command.requiresConfirmation && (
                                                            <div className='flex items-center text-yellow-400 text-xs'>
                                                                <svg
                                                                    className='h-4 w-4 mr-1'
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

                                    <button
                                        onClick={handleSendCommand}
                                        disabled={
                                            !selectedCommand ||
                                            sendCommandMutation.isLoading ||
                                            commandsLoading
                                        }
                                        className='w-full bg-primary-600 hover:bg-primary-700 disabled:bg-dark-600 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-md transition-colors'
                                    >
                                        {sendCommandMutation.isLoading
                                            ? 'Sending...'
                                            : 'Send Command'}
                                    </button>
                                </div>
                            </div>

                            {/* Command History */}
                            <div className='lg:col-span-2'>
                                <div className='bg-dark-800 rounded-lg border border-dark-700 p-6'>
                                    <h2 className='text-lg font-semibold text-white mb-4'>
                                        Command History
                                    </h2>

                                    <div className='overflow-hidden'>
                                        <table className='min-w-full divide-y divide-dark-700'>
                                            <thead>
                                                <tr>
                                                    <th className='px-6 py-3 text-left text-xs font-medium text-dark-400 uppercase tracking-wider'>
                                                        Command
                                                    </th>
                                                    <th className='px-6 py-3 text-left text-xs font-medium text-dark-400 uppercase tracking-wider'>
                                                        Status
                                                    </th>
                                                    <th className='px-6 py-3 text-left text-xs font-medium text-dark-400 uppercase tracking-wider'>
                                                        Timestamp
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className='divide-y divide-dark-700'>
                                                {commandHistory.map(
                                                    (command) => (
                                                        <tr key={command.id}>
                                                            <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-white'>
                                                                {
                                                                    command.command
                                                                }
                                                            </td>
                                                            <td className='px-6 py-4 whitespace-nowrap'>
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
                                                            <td className='px-6 py-4 whitespace-nowrap text-sm text-dark-300'>
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
            </Layout>
        </>
    );
};

export default Commands;
