import QuickAccessCard from "@/components/QuickAcessCard";
import StatCard from "@/components/StatCard";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ostra Águas</Text>
      </View>

      {/* Welcome */}

      <View style={styles.welcomeCard}>
        <View style={styles.welcomeIcon}>
          <Ionicons name="file-tray-outline" size={24} color="#006e8f" />
        </View>

        <View>
          <Text style={styles.welcomeTitle}>Ostra Águas</Text>

          <Text style={styles.welcomeDescription}>
            Controle de estoque e entregas
          </Text>
        </View>
      </View>

      {/* Statistics */}

      <View style={styles.statistics}>
        <StatCard title="Pedidos hoje" value={"10"} valueColor="#111827" />
        <StatCard title="Estoque atual" value={"32"} valueColor="#111827" />
      </View>

      {/* Quick access */}

      <Text style={styles.sectionTitle}>Acesso Rápido</Text>

      <View style={styles.quickAccess}>
        <QuickAccessCard
          icon="people-outline"
          iconColor="#111827"
          iconBackground="#e5e7eb"
          title="Clientes"
          description="Cadastrar e consultar clientes"
        />
        <QuickAccessCard
          icon="cube-outline"
          iconColor="#d97706"
          iconBackground="#f3eee5"
          title="Cargas"
          description="Registrar entrada de cargas"
        />

        <QuickAccessCard
          icon="cart-outline"
          iconColor="#a5b4fc"
          iconBackground="#eef0ff"
          title="Pedidos"
          description="Criar pedidos e acompanhar status."
        />

        <QuickAccessCard
          icon="car-outline"
          iconColor="#008f72"
          iconBackground="#e2f4ef"
          title="Entregas"
          description="Selecionar pedidos pendentes."
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f8f9fc",
  },

  container: {
    padding: 18,
    paddingBottom: 30,
  },

  // Header

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 40,
  },

  headerTitle: {
    fontSize: 18,
    marginTop: 25,
    fontWeight: "700",
    color: "#111827",
  },

  profileButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
  },

  // Welcome

  welcomeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#22344a",
    borderRadius: 8,
    padding: 18,
    marginBottom: 12,
  },

  welcomeIcon: {
    width: 42,
    height: 42,
    borderRadius: 8,
    backgroundColor: "#1b2c40",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  welcomeTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#008f72",
  },

  welcomeDescription: {
    fontSize: 12,
    color: "#536277",
    marginTop: 4,
  },

  // Statistics

  statistics: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },

  statCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e5e8ef",
  },

  statTitle: {
    fontSize: 11,
    color: "#374151",
    marginBottom: 6,
  },

  statValue: {
    fontSize: 25,
    fontWeight: "700",
  },

  // Quick access

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginTop: 2,
    marginBottom: 12,
  },

  quickAccess: {
    gap: 10,
  },

  quickCard: {
    minHeight: 61,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e8ef",
    padding: 10,
  },

  quickIcon: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  quickContent: {
    flex: 1,
  },

  quickTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },

  quickDescription: {
    fontSize: 11,
    color: "#6b7280",
    marginTop: 3,
  },
});
