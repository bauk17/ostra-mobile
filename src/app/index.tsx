import { Pressable, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ostra Águas</Text>

      <Text style={styles.subtitle}></Text>

      <View style={styles.buttons}>
        <Pressable style={styles.button}>
          <Text style={styles.buttonTitle}>Clientes</Text>
        </Pressable>

        <Pressable style={styles.button}>
          <Text style={styles.buttonTitle}>Cargas</Text>
        </Pressable>

        <Pressable
          style={styles.button}
          onPress={() => console.log("Olá, mundo")}
        >
          <Text style={styles.buttonTitle}>Pedidos</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    color: "#5b8ce6",
  },

  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 40,
  },

  buttons: {
    gap: 16,
  },

  button: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: "#eeeeee",
  },

  buttonTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4586ff",
  },

  buttonDescription: {
    marginTop: 4,
    fontSize: 14,
  },
});
