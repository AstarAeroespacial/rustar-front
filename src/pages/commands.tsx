import { type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import Layout from "~/components/Layout";
import { api } from "~/utils/api";

interface Command {
  id: string;
  command: string;
  status: 'Success' | 'Failed' | 'Pending';
  response: string;
  timestamp: string;
}

const Commands: NextPage = () => {
  const [selectedCommand, setSelectedCommand] = useState("");
  const [customCommand, setCustomCommand] = useState("");
  const [criticalCommand, setCriticalCommand] = useState("");
  const [commandHistory] = useState<Command[]>([
    {
      id: "1",
      command: "REBOOT",
      status: "Success",
      response: "System reboot initiated successfully",
      timestamp: "2024-01-02 14:30:02"
    },
    {
      id: "2", 
      command: "STATUS_CHECK",
      status: "Success",
      response: "System operational, all systems nominal",
      timestamp: "2024-01-02 14:29:18"
    },
    {
      id: "3",
      command: "SIGNAL_ADJUST_POWER",
      status: "Failed",
      response: "Error: Signal failed due to antenna issue",
      timestamp: "2024-01-02 14:28:42"
    },
    {
      id: "4",
      command: "REBOOT",
      status: "Success", 
      response: "System reboot initiated successfully",
      timestamp: "2024-01-02 14:28:02"
    },
    {
      id: "5",
      command: "STATUS_CHECK",
      status: "Success",
      response: "System operational, all systems nominal", 
      timestamp: "2024-01-02 14:27:46"
    }
  ]);

  const sendCommandMutation = api.satellite.sendCommand.useMutation();

  const predefinedCommands = [
    { name: "Restart System", description: "Restart the satellite's main computer", value: "REBOOT" },
    { name: "Status Check", description: "Verify operational status of all systems", value: "STATUS_CHECK" },
    { name: "Update Software", description: "Fetch and apply the latest software patches", value: "UPDATE_SOFTWARE" }
  ];

  const handleSendCommand = async (commandType: 'predefined' | 'custom' | 'critical') => {
    let commandToSend = "";
    
    if (commandType === 'predefined') {
      commandToSend = selectedCommand;
    } else if (commandType === 'custom') {
      commandToSend = customCommand;
    } else {
      commandToSend = criticalCommand;
    }

    if (!commandToSend.trim()) return;

    try {
      await sendCommandMutation.mutateAsync({
        number: Math.floor(Math.random() * 1000),
        message: commandToSend
      });
      
      // Clear the input after successful send
      if (commandType === 'custom') setCustomCommand("");
      if (commandType === 'critical') setCriticalCommand("");
      if (commandType === 'predefined') setSelectedCommand("");
      
    } catch (error) {
      console.error("Failed to send command:", error);
    }
  };

  return (
    <>
      <Head>
        <title>Commands - SatCom</title>
        <meta name="description" content="Satellite command center" />
      </Head>
      <Layout>
        <div className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-white">Command Center</h1>
          </div>
          
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Command Center */}
              <div className="lg:col-span-1 space-y-6">
                
                {/* Send Command */}
                <div className="bg-dark-800 rounded-lg border border-dark-700 p-6">
                  <h2 className="text-lg font-semibold text-white mb-4">Send Command</h2>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-dark-300 mb-2">
                      Select Command
                    </label>
                    <select 
                      value={selectedCommand}
                      onChange={(e) => setSelectedCommand(e.target.value)}
                      className="w-full bg-dark-700 border border-dark-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Choose a command...</option>
                      {predefinedCommands.map((cmd) => (
                        <option key={cmd.value} value={cmd.value}>
                          {cmd.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <button
                    onClick={() => handleSendCommand('predefined')}
                    disabled={!selectedCommand || sendCommandMutation.isLoading}
                    className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-dark-600 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-md transition-colors"
                  >
                    {sendCommandMutation.isLoading ? 'Sending...' : 'Send Command'}
                  </button>
                </div>

                {/* Predefined Commands */}
                <div className="bg-dark-800 rounded-lg border border-dark-700 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Predefined Commands</h3>
                  <div className="space-y-3">
                    {predefinedCommands.map((command) => (
                      <div key={command.value} className="border border-dark-600 rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-white">{command.name}</h4>
                            <p className="text-sm text-dark-400 mt-1">{command.description}</p>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedCommand(command.value);
                              handleSendCommand('predefined');
                            }}
                            className="bg-primary-600 hover:bg-primary-700 text-white text-xs px-3 py-1 rounded"
                          >
                            Send
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Critical Command */}
                <div className="bg-yellow-900/20 border border-yellow-600 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <svg className="h-5 w-5 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <h3 className="text-lg font-semibold text-yellow-400">Critical Command</h3>
                  </div>
                  <p className="text-sm text-yellow-300 mb-4">
                    Execute critical commands with a security code.
                  </p>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-yellow-300 mb-2">
                      Confirmation Code
                    </label>
                    <input
                      type="text"
                      placeholder="Enter code..."
                      value={criticalCommand}
                      onChange={(e) => setCriticalCommand(e.target.value)}
                      className="w-full bg-dark-700 border border-yellow-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                  <button
                    onClick={() => handleSendCommand('critical')}
                    disabled={!criticalCommand || sendCommandMutation.isLoading}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:bg-dark-600 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-md transition-colors"
                  >
                    {sendCommandMutation.isLoading ? 'Executing...' : 'Confirm Critical Command'}
                  </button>
                </div>
              </div>

              {/* Command History */}
              <div className="lg:col-span-2">
                <div className="bg-dark-800 rounded-lg border border-dark-700 p-6">
                  <h2 className="text-lg font-semibold text-white mb-4">Command History</h2>
                  
                  <div className="overflow-hidden">
                    <table className="min-w-full divide-y divide-dark-700">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">
                            Command
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">
                            Response
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">
                            Timestamp
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-dark-700">
                        {commandHistory.map((command) => (
                          <tr key={command.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                              {command.command}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                command.status === 'Success' 
                                  ? 'bg-green-100 text-green-800' 
                                  : command.status === 'Failed'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {command.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-dark-300 max-w-xs truncate">
                              {command.response}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-300">
                              {command.timestamp}
                            </td>
                          </tr>
                        ))}
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
