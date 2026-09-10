import * as Network from "expo-network";

export async function isOnline(): Promise<boolean> {
  const state = await Network.getNetworkStateAsync();

  console.log(state);
  return state.isConnected === true && state.isInternetReachable !== false;
}

export function listenNetwork(callback: (isConnected: boolean) => void) {
  return Network.addNetworkStateListener((state) => {
    const online =
      state.isConnected === true && state.isInternetReachable !== false;

    callback(online);
  });
}
