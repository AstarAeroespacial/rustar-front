import { type NextPage } from "next";
import Head from "next/head";
import Layout from "~/components/Layout";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const { data: satellites, isLoading } = api.satellite.getSatellites.useQuery();

  return (
    <>
      <Head>
        <title>SatCom - Satellite Management Dashboard</title>
        <meta name="description" content="Satellite management and control system" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          </div>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Stats overview */}
            <div className="mt-8">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="bg-dark-800 overflow-hidden rounded-lg border border-dark-700">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center">
                          <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-dark-400 truncate">Active Satellites</dt>
                          <dd className="text-lg font-medium text-white">
                            {isLoading ? '...' : satellites?.filter(s => s.status === 'active').length || 0}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-dark-800 overflow-hidden rounded-lg border border-dark-700">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 bg-yellow-500 rounded-full flex items-center justify-center">
                          <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-dark-400 truncate">Inactive Satellites</dt>
                          <dd className="text-lg font-medium text-white">
                            {isLoading ? '...' : satellites?.filter(s => s.status === 'inactive').length || 0}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-dark-800 overflow-hidden rounded-lg border border-dark-700">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                            <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-dark-400 truncate">Total Satellites</dt>
                          <dd className="text-lg font-medium text-white">
                            {isLoading ? '...' : satellites?.length || 0}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-dark-800 overflow-hidden rounded-lg border border-dark-700">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 bg-purple-500 rounded-full flex items-center justify-center">
                          <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-dark-400 truncate">Commands Today</dt>
                          <dd className="text-lg font-medium text-white">42</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Satellite list */}
            <div className="mt-8">
              <div className="bg-dark-800 rounded-lg border border-dark-700">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-white mb-4">Satellite Status</h3>
                  {isLoading ? (
                    <div className="text-dark-400">Loading satellites...</div>
                  ) : (
                    <div className="overflow-hidden">
                      <table className="min-w-full divide-y divide-dark-700">
                        <thead>
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">
                              Satellite
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">
                              Last Contact
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">
                              Position
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-700">
                          {satellites?.map((satellite) => (
                            <tr key={satellite.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="text-sm font-medium text-white">{satellite.name}</div>
                                  <div className="text-sm text-dark-400 ml-2">({satellite.id})</div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                  satellite.status === 'active' 
                                    ? 'bg-green-100 text-green-800' 
                                    : satellite.status === 'inactive'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {satellite.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-300">
                                {satellite.lastContact?.toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-300">
                                {satellite.position ? 
                                  `${satellite.position.latitude.toFixed(2)}, ${satellite.position.longitude.toFixed(2)}` 
                                  : 'Unknown'
                                }
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Home;
