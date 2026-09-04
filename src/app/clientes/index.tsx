import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type Cliente = {
  id: string;
  documento: string;
  nome: string;
  endereco: string;
  status: "Ativo" | "Pendente";
  pedidos: number;
  ultimoPedido: string;
  telefone: string;
  inadimplente?: boolean;
  recorrente?: boolean;
  valorPendente?: number;
};

const CLIENTES: Cliente[] = [
  {
    id: "1",
    documento: "12.345.678/0001-90",
    nome: "Supermercado Central",
    endereco: "Av. Brasil, 1500 - Centro",
    status: "Ativo",
    pedidos: 32,
    ultimoPedido: "Hoje, 10:30",
    telefone: "(11) 98765-4321",
    recorrente: true,
  },
  {
    id: "2",
    documento: "98.765.432/0001-11",
    nome: "Restaurante Sabor Mar",
    endereco: "Rua das Gaivotas, 42 - Orla",
    status: "Ativo",
    pedidos: 18,
    ultimoPedido: "Ter, 17:00",
    telefone: "(11) 97654-3210",
    recorrente: true,
  },
  {
    id: "3",
    documento: "31.654.987/0001-22",
    nome: "Mercadinho São José",
    endereco: "Mercado Público, Box 12",
    status: "Pendente",
    pedidos: 8,
    ultimoPedido: "Ontem, 16:45",
    telefone: "(11) 96543-2109",
    inadimplente: true,
    valorPendente: 450,
  },
  {
    id: "4",
    documento: "45.678.901/0001-22",
    nome: "Bistrô Oceano",
    endereco: "Av. Beira Mar, 800",
    status: "Ativo",
    pedidos: 12,
    ultimoPedido: "Há 2 dias",
    telefone: "(11) 96543-2109",
  },
];

type Filtro = "Todos" | "Ativos" | "Inadimplentes" | "Recorrentes";

export default function ClientesScreen() {
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState<Filtro>("Todos");

  const clientesFiltrados = useMemo(() => {
    const texto = busca.toLowerCase().trim();

    return CLIENTES.filter((cliente) => {
      const correspondeBusca =
        !texto ||
        cliente.nome.toLowerCase().includes(texto) ||
        cliente.documento.toLowerCase().includes(texto) ||
        cliente.telefone.toLowerCase().includes(texto) ||
        cliente.endereco.toLowerCase().includes(texto);

      const correspondeFiltro =
        filtro === "Todos" ||
        (filtro === "Ativos" && cliente.status === "Ativo") ||
        (filtro === "Inadimplentes" && cliente.inadimplente) ||
        (filtro === "Recorrentes" && cliente.recorrente);

      return correspondeBusca && correspondeFiltro;
    });
  }, [busca, filtro]);

  function renderCliente({ item }: { item: Cliente }) {
    return (
      <Pressable style={styles.card}>
        <View style={styles.cardTop}>
          <Text style={styles.documento}>{item.documento}</Text>

          <View
            style={[
              styles.statusBadge,
              item.status === "Ativo"
                ? styles.statusAtivo
                : styles.statusPendente,
            ]}
          >
            <View
              style={[
                styles.statusDot,
                item.status === "Ativo" ? styles.dotAtivo : styles.dotPendente,
              ]}
            />

            <Text
              style={[
                styles.statusText,
                item.status === "Ativo"
                  ? styles.statusTextAtivo
                  : styles.statusTextPendente,
              ]}
            >
              {item.status}
            </Text>
          </View>
        </View>

        <Text style={styles.nome}>{item.nome}</Text>

        <Text style={styles.endereco}>{item.endereco}</Text>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Ionicons name="cube-outline" size={13} color="#B6C2CF" />
            <Text style={styles.infoText}>{item.pedidos} pedidos</Text>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="time-outline" size={13} color="#B6C2CF" />
            <Text style={styles.infoText}>{item.ultimoPedido}</Text>
          </View>

          <Text style={styles.telefone}>{item.telefone}</Text>
        </View>

        {item.inadimplente && item.valorPendente && (
          <Text style={styles.pendenteValor}>
            Pendente: R$ {item.valorPendente.toFixed(2).replace(".", ",")}
          </Text>
        )}
      </Pressable>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Clientes</Text>
          <Text style={styles.subtitle}>
            Gerencie clientes e consulte histórico.
          </Text>
        </View>

        <Pressable
          style={styles.addButton}
          onPress={() => {
            router.push("/clientes/novo-cliente");
            console.log("Clicou no botão de adicionar cliente");
          }}
        >
          <Ionicons name="add" size={28} color="#07131F" />
        </Pressable>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={17} color="#91A0AE" />

        <TextInput
          value={busca}
          onChangeText={setBusca}
          placeholder="Buscar por cliente, endereço ou telefone..."
          placeholderTextColor="#91A0AE"
          style={styles.searchInput}
        />
      </View>

      <View style={styles.filtersContainer}>
        {(["Todos", "Ativos", "Inadimplentes", "Recorrentes"] as Filtro[]).map(
          (item) => (
            <Pressable
              key={item}
              onPress={() => setFiltro(item)}
              style={[
                styles.filterButton,
                filtro === item && styles.filterButtonSelected,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  filtro === item && styles.filterTextSelected,
                ]}
              >
                {item}
              </Text>
            </Pressable>
          ),
        )}
      </View>

      <FlatList
        data={clientesFiltrados}
        keyExtractor={(item) => item.id}
        renderItem={renderCliente}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="people-outline" size={42} color="#617181" />
            <Text style={styles.emptyTitle}>Nenhum cliente encontrado</Text>
            <Text style={styles.emptyText}>
              Tente alterar a busca ou o filtro.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C2F3F",
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },

  subtitle: {
    color: "#C0CBD5",
    fontSize: 12,
    marginTop: 3,
  },

  addButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#54F29A",
    alignItems: "center",
    justifyContent: "center",
  },

  searchContainer: {
    height: 42,
    marginHorizontal: 20,
    borderRadius: 10,
    backgroundColor: "#213A4E",
    borderWidth: 1,
    borderColor: "#315067",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },

  searchInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 12,
    marginLeft: 8,
  },

  filtersContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 8,
    gap: 7,
  },

  filterButton: {
    paddingHorizontal: 12,
    height: 31,
    borderRadius: 15,
    backgroundColor: "#213A4E",
    borderWidth: 1,
    borderColor: "#315067",
    alignItems: "center",
    justifyContent: "center",
  },

  filterButtonSelected: {
    backgroundColor: "#54F29A",
    borderColor: "#54F29A",
  },

  filterText: {
    color: "#B8C5D0",
    fontSize: 10,
  },

  filterTextSelected: {
    color: "#07131F",
    fontWeight: "700",
  },

  list: {
    paddingHorizontal: 20,
    paddingTop: 2,
    paddingBottom: 100,
  },

  card: {
    backgroundColor: "#213A4E",
    borderWidth: 1,
    borderColor: "#315067",
    borderRadius: 10,
    padding: 15,
    marginBottom: 2,
    marginTop: 15,
  },

  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  documento: {
    color: "#9EACB8",
    fontSize: 11,
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 5,
  },

  statusAtivo: {
    backgroundColor: "#174D3A",
  },

  statusPendente: {
    backgroundColor: "#55451B",
  },

  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginRight: 4,
  },

  dotAtivo: {
    backgroundColor: "#54F29A",
  },

  dotPendente: {
    backgroundColor: "#F5A623",
  },

  statusText: {
    fontSize: 11,
    fontWeight: "600",
  },

  statusTextAtivo: {
    color: "#54F29A",
  },

  statusTextPendente: {
    color: "#F5A623",
  },

  nome: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 4,
  },

  endereco: {
    color: "#AAB8C4",
    fontSize: 12,
    marginTop: 2,
  },

  divider: {
    height: 1,
    backgroundColor: "#304A5E",
    marginVertical: 8,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },

  infoText: {
    color: "#B6C2CF",
    fontSize: 8,
    marginLeft: 4,
  },

  telefone: {
    color: "#54F29A",
    fontSize: 8,
    marginLeft: "auto",
  },

  pendenteValor: {
    color: "#F5A623",
    fontSize: 8,
    fontWeight: "600",
    marginTop: 6,
  },

  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
  },

  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
    marginTop: 12,
  },

  emptyText: {
    color: "#8F9EAB",
    fontSize: 11,
    marginTop: 4,
  },
});
