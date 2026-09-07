import {
  deletarCliente,
  listarClientes,
} from "@/repositories/cliente-repository";
import type { Cliente } from "@/types/cliente";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

type Filtro = "Todos" | "Ativos" | "Inadimplentes" | "Recorrentes";

function formatarData(data: string) {
  const dataFormatada = new Date(data);

  if (Number.isNaN(dataFormatada.getTime())) {
    return "Data nao informada";
  }

  return dataFormatada.toLocaleDateString("pt-BR");
}

export default function ClientesScreen() {
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState<Filtro>("Todos");
  const [clientes, setClientes] = useState<Cliente[]>([]);

  const db = useSQLiteContext();

  useFocusEffect(
    useCallback(() => {
      async function carregarClientes() {
        try {
          const dados = await listarClientes(db);

          setClientes(dados);
        } catch (error) {
          console.error("Erro ao carregar clientes:", error);
        }
      }

      carregarClientes();
    }, [db]),
  );

  const clientesFiltrados = useMemo(() => {
    const texto = busca.toLowerCase().trim();

    return clientes.filter((cliente) => {
      return (
        !texto ||
        cliente.nome.toLowerCase().includes(texto) ||
        (cliente.telefone ?? "").toLowerCase().includes(texto) ||
        (cliente.endereco ?? "").toLowerCase().includes(texto) ||
        (cliente.numero ?? "").toLowerCase().includes(texto) ||
        (cliente.bairro ?? "").toLowerCase().includes(texto)
      );
    });
  }, [busca, clientes]);

  function confirmarExclusao(cliente: Cliente) {
    Alert.alert("Excluir cliente", `Deseja excluir ${cliente.nome}?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await deletarCliente(db, cliente.id);
            setClientes((clientesAtuais) =>
              clientesAtuais.filter(
                (clienteAtual) => clienteAtual.id !== cliente.id,
              ),
            );
          } catch (error) {
            console.error("Erro ao excluir cliente:", error);
          }
        },
      },
    ]);
  }

  function renderCliente({ item }: { item: Cliente }) {
    return (
      <View style={styles.card}>
        <View style={styles.cardTop}>
          <Text style={styles.documento}>ID: {item.id}</Text>
          <View style={[styles.statusBadge, styles.statusAtivo]}>
            <View style={[styles.statusDot, styles.dotAtivo]} />

            <Text style={[styles.statusText, styles.statusTextAtivo]}>
              Cadastrado
            </Text>
          </View>
        </View>

        <Text style={styles.nome}>{item.nome}</Text>

        <Text style={styles.endereco}>
          {item.endereco}, {item.numero} - {item.bairro}
        </Text>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Ionicons name="calendar-outline" size={13} color="#B6C2CF" />
            <Text style={styles.infoText}>
              Cadastro: {formatarData(item.created_at)}
            </Text>
          </View>

          <Text style={styles.telefone}>{item.telefone || "Sem telefone"}</Text>
        </View>

        <View style={styles.actionRow}>
          <Pressable
            accessibilityLabel={`Editar ${item.nome}`}
            style={styles.actionButton}
            onPress={() => {
              router.push({
                pathname: "/clientes/editar-cliente",
                params: {
                  id: item.id,
                },
              });
            }}
          >
            <Ionicons name="create-outline" size={18} color="#54F29A" />
            <Text style={styles.editActionText}>Editar</Text>
          </Pressable>

          <Pressable
            accessibilityLabel={`Excluir ${item.nome}`}
            style={styles.actionButton}
            onPress={() => confirmarExclusao(item)}
          >
            <Ionicons name="trash-outline" size={18} color="#F56B6B" />
            <Text style={styles.deleteActionText}>Excluir</Text>
          </Pressable>
        </View>
      </View>
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

  actionRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 16,
    marginTop: 10,
  },

  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 4,
    paddingHorizontal: 2,
  },

  editActionText: {
    color: "#54F29A",
    fontSize: 11,
    fontWeight: "600",
  },

  deleteActionText: {
    color: "#F56B6B",
    fontSize: 11,
    fontWeight: "600",
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
