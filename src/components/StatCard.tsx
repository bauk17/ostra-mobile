import { StyleSheet, Text, View } from "react-native";

type StatCardProps = {
  title: string;
  value: string;
  valueColor: string;
};

function StatCard({ title, value, valueColor }: StatCardProps) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statTitle}>{title}</Text>

      <Text style={[styles.statValue, { color: valueColor }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
});

export default StatCard;
