import {
    atualizarCliente,
    buscarClientePorId,
} from "@/repositories/cliente-repository";
import { router, useLocalSearchParams } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditarClienteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const db = useSQLiteContext();

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [numero, setNumero] = useState("");
  const [bairro, setBairro] = useState("");

  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  async function salvarAlteracoes() {
    if (!id) {
      setErro("Cliente não encontrado.");
      return;
    }

    if (!nome.trim()) {
      setErro("Informe o nome do cliente.");
      return;
    }

    setErro("");

    try {
      await atualizarCliente(db, {
        id,
        nome: nome.trim(),
        telefone: telefone.trim(),
        endereco: endereco.trim(),
        numero: numero.trim(),
        bairro: bairro.trim(),
        created_at: new Date().toISOString(),
      });

      router.back();
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
      setErro("Ocorreu um erro ao atualizar o cliente. Tente novamente.");
    }
  }

  useEffect(() => {
    async function carregarCliente() {
      if (!id) {
        setErro("Cliente não encontrado.");
        setLoading(false);
        return;
      }

      try {
        const cliente = await buscarClientePorId(db, id);

        if (!cliente) {
          setErro("Cliente não encontrado.");
          return;
        }

        setNome(cliente.nome);
        setTelefone(cliente.telefone ?? "");
        setEndereco(cliente.endereco ?? "");
        setNumero(cliente.numero ?? "");
        setBairro(cliente.bairro ?? "");
      } catch (error) {
        console.error("Erro ao carregar cliente:", error);
        setErro("Erro ao carregar cliente.");
      } finally {
        setLoading(false);
      }
    }

    carregarCliente();
  }, [db, id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text>Carregando cliente...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>

        <View>
          <Text style={styles.title}>Editar cliente</Text>
          <Text style={styles.subtitle}>Altere os dados do cliente.</Text>
        </View>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Nome</Text>

        <TextInput
          value={nome}
          onChangeText={setNome}
          placeholder="Nome do cliente"
          placeholderTextColor="#91A0AE"
          style={styles.input}
        />

        <Text style={styles.label}>Telefone</Text>

        <TextInput
          value={telefone}
          onChangeText={setTelefone}
          placeholder="Telefone"
          placeholderTextColor="#91A0AE"
          keyboardType="phone-pad"
          style={styles.input}
        />

        <Text style={styles.label}>Endereço</Text>

        <TextInput
          value={endereco}
          onChangeText={setEndereco}
          placeholder="Endereço"
          placeholderTextColor="#91A0AE"
          style={[styles.input, styles.inputEndereco]}
          multiline
        />

        <Text style={styles.label}>Número</Text>

        <TextInput
          value={numero}
          onChangeText={setNumero}
          placeholder="Número do endereço"
          placeholderTextColor="#91A0AE"
          keyboardType="number-pad"
          style={styles.input}
        />

        <Text style={styles.label}>Bairro</Text>

        <TextInput
          value={bairro}
          onChangeText={setBairro}
          placeholder="Bairro"
          placeholderTextColor="#91A0AE"
          style={styles.input}
        />

        {erro !== "" && <Text style={styles.erro}>{erro}</Text>}

        <Pressable style={styles.saveButton} onPress={salvarAlteracoes}>
          <Text style={styles.saveButtonText}>Salvar alterações</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C2F3F",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 20,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#213A4E",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  backText: {
    color: "#FFFFFF",
    fontSize: 32,
    lineHeight: 34,
    marginTop: -3,
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

  form: {
    paddingHorizontal: 20,
  },

  label: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 12,
  },

  input: {
    height: 44,
    backgroundColor: "#213A4E",
    borderWidth: 1,
    borderColor: "#315067",
    borderRadius: 10,
    paddingHorizontal: 12,
    color: "#FFFFFF",
    fontSize: 13,
  },

  inputEndereco: {
    height: 90,
    paddingTop: 12,
    textAlignVertical: "top",
  },

  erro: {
    color: "#FF6B6B",
    fontSize: 12,
    marginTop: 10,
  },

  saveButton: {
    height: 46,
    borderRadius: 10,
    backgroundColor: "#54F29A",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },

  saveButtonText: {
    color: "#07131F",
    fontSize: 13,
    fontWeight: "700",
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  text: {
    color: "#FFFFFF",
    fontSize: 14,
  },
});
