import { NativeTabs } from "expo-router/unstable-native-tabs";
import { useColorScheme } from "react-native";

import { Colors } from "@/constants/theme";

export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === "unspecified" ? "light" : scheme];

  return (
    <NativeTabs
      backgroundColor={colors.background}
      indicatorColor={colors.backgroundElement}
      labelVisibilityMode="labeled"
      labelStyle={{
        selected: {
          color: colors.text,
        },
      }}
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Dashboard</NativeTabs.Trigger.Label>

        <NativeTabs.Trigger.Icon
          md={{
            default: "home",
            selected: "home",
          }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="clientes">
        <NativeTabs.Trigger.Label>Clientes</NativeTabs.Trigger.Label>

        <NativeTabs.Trigger.Icon
          md={{
            default: "group",
            selected: "group",
          }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="cargas">
        <NativeTabs.Trigger.Label>Cargas</NativeTabs.Trigger.Label>

        <NativeTabs.Trigger.Icon
          md={{
            default: "inventory_2",
            selected: "inventory_2",
          }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="pedidos">
        <NativeTabs.Trigger.Label>Pedidos</NativeTabs.Trigger.Label>

        <NativeTabs.Trigger.Icon
          md={{
            default: "shopping_cart",
            selected: "shopping_cart",
          }}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="entregas">
        <NativeTabs.Trigger.Label>Entregas</NativeTabs.Trigger.Label>

        <NativeTabs.Trigger.Icon
          md={{
            default: "local_shipping",
            selected: "local_shipping",
          }}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
