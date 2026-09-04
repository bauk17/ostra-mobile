import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { supabase } from "@/services/supabase";
import * as Crypto from "expo-crypto";

export default function NovoClienteScreen() {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [erro, setErro] = useState("");

  async function cadastrarCliente() {
    if (!nome.trim()) {
      setErro("Informe o nome do cliente.");
      return;
    }

    setErro("");

    const cliente = {
      id: Crypto.randomUUID(),
      nome: nome.trim(),
      telefone: telefone.trim() || null,
      endereco: endereco.trim() || null,
      created_at: new Date().toISOString(),
    };

    console.log("Enviando cliente:", cliente);

    const { error } = await supabase.from("clientes").insert(cliente);

    if (error) {
      console.error("Erro ao cadastrar cliente:", error);
      setErro("Não foi possível cadastrar o cliente.");
      return;
    }

    console.log("Cliente cadastrado com sucesso!");

    router.back();
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}

        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
          </Pressable>

          <View style={styles.headerText}>
            <Text style={styles.title}>Novo Cliente</Text>
            <Text style={styles.subtitle}>Cadastre um novo cliente</Text>
          </View>
        </View>

        {/* Formulário */}

        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>
              Nome <Text style={styles.required}>*</Text>
            </Text>

            <TextInput
              value={nome}
              onChangeText={(text) => {
                setNome(text);
                if (erro) setErro("");
              }}
              placeholder="Nome do cliente"
              placeholderTextColor="#718394"
              style={styles.input}
              autoCapitalize="words"
            />

            {erro && <Text style={styles.error}>{erro}</Text>}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Telefone</Text>

            <TextInput
              value={telefone}
              onChangeText={setTelefone}
              placeholder="(22) 99999-9999"
              placeholderTextColor="#718394"
              style={styles.input}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Endereço</Text>

            <TextInput
              value={endereco}
              onChangeText={setEndereco}
              placeholder="Rua, número, bairro..."
              placeholderTextColor="#718394"
              style={[styles.input, styles.multilineInput]}
              multiline
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Botão de cadastro */}

        <Pressable style={styles.submitButton} onPress={cadastrarCliente}>
          <Ionicons name="checkmark" size={20} color="#07131F" />
          <Text style={styles.submitText}>Cadastrar Cliente</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C2F3F",
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    marginTop: 25,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#213A4E",
    borderWidth: 1,
    borderColor: "#315067",
    alignItems: "center",
    justifyContent: "center",
  },

  headerText: {
    marginLeft: 12,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },

  subtitle: {
    color: "#AAB8C4",
    fontSize: 11,
    marginTop: 3,
  },

  form: {
    gap: 20,
  },

  field: {
    gap: 7,
  },

  label: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },

  required: {
    color: "#54F29A",
  },

  input: {
    height: 46,
    backgroundColor: "#213A4E",
    borderWidth: 1,
    borderColor: "#315067",
    borderRadius: 10,
    paddingHorizontal: 13,
    color: "#FFFFFF",
    fontSize: 13,
  },

  multilineInput: {
    height: 90,
    paddingTop: 13,
  },

  error: {
    color: "#FF6B6B",
    fontSize: 11,
  },

  submitButton: {
    height: 50,
    marginTop: 30,
    borderRadius: 12,
    backgroundColor: "#54F29A",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  submitText: {
    color: "#07131F",
    fontSize: 14,
    fontWeight: "700",
  },
});
